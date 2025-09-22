import os
import uuid
import json
from pathlib import Path
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Depends, WebSocket
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from backend.app.auth import verify_jwt, require_jwt
from backend.app.jobs import enqueue_download, list_jobs, get_job_meta

app = FastAPI(title='HF Downloader API')

MODEL_DIR = Path(os.environ.get('MODEL_DIR', '/models'))
MODEL_DIR.mkdir(parents=True, exist_ok=True)

class DownloadPayload(BaseModel):
    model_id: str
    repo_type: str = "model"
    local_dir: str = ""
    hf_transfer: bool = True
    download_type: str = "full"  # full, branch, files
    branch: Optional[str] = None
    files: Optional[List[str]] = None

class HealthResponse(BaseModel):
    status: str

class DownloadResponse(BaseModel):
    job_id: str

class JobResponse(BaseModel):
    id: str
    status: str
    result: Optional[dict] = None

@app.get('/health', response_model=HealthResponse)
def health():
    return {'status':'ok'}

@app.post('/api/download', response_model=DownloadResponse)
def download(payload: DownloadPayload, user=Depends(require_jwt)):
    if not payload.model_id:
        raise HTTPException(status_code=400, detail='model_id required')
    
    job_id = enqueue_download(
        model_id=payload.model_id,
        repo_type=payload.repo_type,
        local_dir=payload.local_dir,
        hf_transfer=payload.hf_transfer,
        download_type=payload.download_type,
        branch=payload.branch,
        files=payload.files
    )
    return {'job_id': job_id}

@app.get('/api/jobs')
def api_jobs(user=Depends(require_jwt)):
    return list_jobs()

@app.get('/api/job/{job_id}', response_model=JobResponse)
def api_job(job_id: str, user=Depends(require_jwt)):
    meta = get_job_meta(job_id)
    if not meta:
        raise HTTPException(status_code=404, detail='not found')
    return meta

@app.websocket('/ws/jobs/{job_id}')
async def ws_logs(websocket: WebSocket, job_id: str):
    await websocket.accept()
    # Simple pubsub over Redis used in jobs; attempt to stream logs
    import redis, json
    r = redis.Redis.from_url(os.environ.get('REDIS_URL','redis://redis:6379/0'))
    p = r.pubsub()
    channel = f'job:{job_id}:channel'
    p.subscribe(channel)
    try:
        for msg in p.listen():
            if msg and msg.get('type') == 'message':
                data = msg.get('data')
                try:
                    text = data.decode() if isinstance(data, bytes) else str(data)
                except:
                    text = str(data)
                await websocket.send_text(text)
    except Exception:
        pass
    finally:
        p.unsubscribe(channel)
        await websocket.close()
