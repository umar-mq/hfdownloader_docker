import os, uuid, json, subprocess, shlex, time
from pathlib import Path
from typing import List, Optional
import redis
from rq import Queue
from rq.job import Job

REDIS_URL = os.environ.get('REDIS_URL','redis://redis:6379/0')
r = redis.Redis.from_url(REDIS_URL)
q = Queue('hf-jobs', connection=r)
MODEL_DIR = Path(os.environ.get('MODEL_DIR','/models'))
DATA_DIR = Path(os.environ.get('DATA_DIR','/data'))
LOG_DIR = DATA_DIR / 'logs'
LOG_DIR.mkdir(parents=True, exist_ok=True)

def _publish(job_id, payload):
    ch = f'job:{job_id}:channel'
    r.publish(ch, json.dumps(payload))

def enqueue_download(
    model_id: str,
    repo_type: str = 'model',
    local_dir: str = '',
    hf_transfer: bool = True,
    download_type: str = 'full',
    branch: Optional[str] = None,
    files: Optional[List[str]] = None
):
    job_id = str(uuid.uuid4())
    target = MODEL_DIR / (local_dir or model_id.replace('/','_'))
    target.mkdir(parents=True, exist_ok=True)
    q.enqueue_call(
        func=run_download,
        args=(job_id, model_id, repo_type, str(target), hf_transfer, download_type, branch, files),
        job_id=job_id,
        result_ttl=60*60*24
    )
    return job_id

def list_jobs():
    # naive implementation: list keys in Redis (for demo)
    keys = r.keys('rq:job:*')[:100]
    out = []
    for k in keys:
        try:
            jid = k.decode().split(':')[-1]
            j = Job.fetch(jid, connection=r)
            out.append({'id': jid, 'status': j.get_status()})
        except Exception:
            pass
    return out

def get_job_meta(job_id):
    try:
        j = Job.fetch(job_id, connection=r)
        meta = {'id':job_id, 'status': j.get_status(), 'result': j.result}
        return meta
    except Exception:
        return None

def run_download(
    job_id: str,
    model_id: str,
    repo_type: str,
    target_dir: str,
    hf_transfer: bool = True,
    download_type: str = 'full',
    branch: Optional[str] = None,
    files: Optional[List[str]] = None
):
    log_path = LOG_DIR / f'{job_id}.log'
    env = os.environ.copy()
    
    # Set HF transfer based on user preference
    if hf_transfer:
        env.setdefault('HF_HUB_ENABLE_HF_TRANSFER','1')
    else:
        env.setdefault('HF_HUB_ENABLE_HF_TRANSFER','0')
    
    # Build command based on download type
    cmd_parts = ["huggingface-cli", "download", shlex.quote(model_id), "--repo-type", shlex.quote(repo_type), "--local-dir", shlex.quote(target_dir)]
    
    if download_type == 'branch' and branch:
        cmd_parts.extend(["--revision", shlex.quote(branch)])
    elif download_type == 'files' and files:
        for file in files:
            cmd_parts.extend(["--include", shlex.quote(file)])
    
    cmd = " ".join(cmd_parts)
    _publish(job_id, {'event':'start', 'cmd':cmd})
    
    with open(log_path,'w') as lf:
        proc = subprocess.Popen(shlex.split(cmd), stdout=subprocess.PIPE, stderr=subprocess.STDOUT, env=env, text=True)
        for line in proc.stdout:
            lf.write(line)
            lf.flush()
            _publish(job_id, {'event':'log','line': line})
        proc.wait()
        _publish(job_id, {'event':'finish','code': proc.returncode})
    return {'returncode': proc.returncode}
