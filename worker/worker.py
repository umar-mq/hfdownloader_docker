# Worker runner (use with image's entrypoint or run directly)
import os
from rq import Worker, Queue, Connection
import redis

REDIS_URL = os.environ.get('REDIS_URL','redis://redis:6379/0')
listen = ['hf-jobs']
r = redis.Redis.from_url(REDIS_URL)

with Connection(r):
    worker = Worker(list(map(Queue, listen)))
    worker.work()
