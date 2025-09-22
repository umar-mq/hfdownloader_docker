# HF Downloader - Enhanced WebUI and Downloading System

## Overview

This update introduces a completely redesigned WebUI and enhanced downloading system for the HF Downloader tool. The new interface provides a professional, modern, and production-ready design with advanced features for managing Hugging Face model downloads.

## Key Features

### Modern WebUI
- Professional, responsive design using Material UI
- Dark/light mode toggle with persistent settings
- Intuitive layout for efficient workflow
- Accessible and consistent styling

### Advanced Job Management
- Real-time job monitoring with progress tracking
- Filtering and sorting capabilities
- Detailed job information (file size, URL, branch, ETA)
- Status labels: Downloading, Paused, Completed, Failed
- Notifications for completion or error events

### Enhanced Download Controls
- Individual job controls (pause, resume, cancel)
- Retry functionality for failed jobs
- Bulk actions for managing multiple jobs

### Flexible Download Options
- Branch selection for repository downloads
- File-level control for selective downloads
- Toggle for `hf_transfer` (Hugging Face accelerated transfer)
- Validation of selections before starting downloads

### User Experience Improvements
- Drag-and-drop area for adding new download jobs
- Copy-paste input with URL auto-validation
- Smooth animations for progress transitions and hover states

## Architecture

### Frontend
- React with Material UI components
- Responsive design for desktop and mobile
- Dark/light mode theming
- Real-time updates via WebSocket integration

### Backend
- FastAPI REST API with WebSocket support
- Redis Queue (RQ) for job management
- Enhanced download functionality with branch/file-level control
- JWT authentication for security

## Installation

For TrueNAS SCALE users, we provide two deployment options:

### Quick Deployment (Recommended for Beginners)
See our [Complete Beginner's Guide to Deploying HF Downloader on TrueNAS](BEGINNER_DEPLOY_GUIDE.md) for step-by-step instructions.

### Advanced Deployment
1. Clone the repository
2. Set environment variables:
   - `HF_TOKEN`: Your Hugging Face access token
   - `JWT_SECRET`: Secret for JWT token signing
3. Build and run with Docker Compose:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Usage

1. Access the WebUI at `http://localhost:8080`
2. Enter your JWT token in the settings
3. Create new download jobs with advanced options:
   - Select specific branches
   - Enable/disable `hf_transfer`
   - Choose individual files or entire models
4. Monitor and manage downloads in real-time

## API Documentation

See [Backend API Documentation](backend/README.md) for detailed information about the REST API endpoints.

## WebUI Documentation

See [WebUI Documentation](webui/README.md) for detailed information about the frontend components and architecture.

## Development

### Frontend Development
```bash
cd webui
npm install
npm run dev
```

### Backend Development
```bash
# Install Python dependencies
pip install -r requirements.txt

# Run the backend
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Deployment

The application can be deployed using Docker Compose or Kubernetes:

### Docker Compose
1. Edit `docker-compose.prod.yml` with your configuration
2. Run `docker-compose -f docker-compose.prod.yml up -d`

### Kubernetes
1. Edit `k8s/chart/values.yaml` with your configuration
2. Deploy with Helm:
   ```bash
   helm install hf-downloader k8s/chart
   ```

## Security Considerations

- All API endpoints require JWT authentication
- Store sensitive tokens as Kubernetes secrets or Docker secrets
- Use HTTPS/TLS in production environments
- Restrict UI access to private networks or VPN

## Future Enhancements

- Enhanced drag and drop with file support
- Bulk action controls for job management
- Advanced filtering and sorting options
- Detailed job logs and error reporting
- Performance optimizations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.