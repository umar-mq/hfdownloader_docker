HF-Downloader (Production) for TrueNAS SCALE
============================================

Contents
--------
- docker/Dockerfile
- docker/requirements.txt
- backend/app/main.py
- backend/app/auth.py
- backend/app/jobs.py
- worker/worker.py
- webui/ (enhanced WebUI with Material UI)
- nginx/nginx.conf
- docker-compose.prod.yml
- k8s/chart/Chart.yaml
- k8s/chart/values.yaml
- k8s/chart/templates/deployment.yaml
- README-DEPLOY.md (this file)
- BEGINNER_DEPLOY_GUIDE.md (step-by-step deployment guide)

Quickstart (Compose)
--------------------
1. Edit `docker-compose.prod.yml` and replace /mnt/<pool>/hf-models with a TrueNAS dataset path.
2. Set secrets HF_TOKEN and JWT_SECRET in TrueNAS App UI (do NOT embed them in cleartext).
3. Paste `docker-compose.prod.yml` into Apps -> Custom App -> Install via YAML or run with docker-compose.
4. Build and push image (optional):
   docker build -t ghcr.io/<you>/hf-downloader:latest ./docker
   docker push ghcr.io/<you>/hf-downloader:latest

Quickstart (Helm)
-----------------
1. Edit k8s/chart/values.yaml with image location and PVC sizes.
2. Create Kubernetes secrets for HF_TOKEN and JWT_SECRET.
3. Install the chart via Helm or add as an ix-chart to TrueNAS SCALE catalog.

Enhanced Features
-----------------
The updated HF Downloader includes:
- Modern WebUI with Material Design and dark/light mode
- Real-time job monitoring with progress tracking
- Advanced download controls (pause, resume, cancel, retry)
- Branch and file-level download selection
- Drag-and-drop and copy-paste functionality
- Enhanced API with flexible download options

Beginner's Deployment Guide
---------------------------
For users new to TrueNAS SCALE deployment, see [BEGINNER_DEPLOY_GUIDE.md](BEGINNER_DEPLOY_GUIDE.md) for detailed step-by-step instructions.

Operational notes
-----------------
- Logs are written to /data/logs in container (mapped to backend-data in compose).
- Increase worker replicas to scale parallel downloads. Ensure storage throughput is adequate.
- Use Nginx + TLS in front of the API. Restrict UI to private network or VPN.
- For TrueNAS SCALE deployment, ensure the app has sufficient resources (2GB+ RAM recommended)
