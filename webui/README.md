# HF Downloader WebUI Documentation

## Overview

The HF Downloader WebUI is a modern, responsive interface built with React and Material UI that provides a comprehensive solution for managing Hugging Face model downloads.

## Components

### 1. App (`App.jsx`)

The main application component that sets up the theme provider, routing, and global state management.

**Features:**
- Dark/light mode toggle with persistent settings
- JWT token management
- Responsive layout using Material UI components

### 2. DownloadForm (`components/DownloadForm.jsx`)

The primary form for creating new download jobs.

**Features:**
- JWT token input and storage
- Model ID input with validation
- Repository type selection (model, dataset, space)
- Local directory specification
- HF Transfer toggle for accelerated downloads
- Download type selection:
  - Full model download
  - Branch-specific download
  - File-specific download
- Drag and drop support for model IDs
- Real-time feedback with notifications

### 3. JobManagement (`components/JobManagement.jsx`)

The dashboard for monitoring and managing download jobs.

**Features:**
- Real-time job status updates
- Filtering by job status
- Sorting by various criteria
- Search functionality
- Progress visualization with circular progress indicators
- Job action controls:
  - Pause/resume downloads
  - Cancel downloads
  - Retry failed downloads
- Detailed job information display

### 4. DragDropUpload (`components/DragDropUpload.jsx`)

A specialized component for drag and drop functionality.

**Features:**
- Visual drop zone with clear instructions
- Support for text-based model ID drops
- Visual feedback during drag operations
- Integration with the main download form

### 5. Theme (`theme.js`)

Custom Material UI themes for consistent styling.

**Features:**
- Light and dark mode themes
- Consistent color palette
- Responsive typography

## Hooks

### useJobWebSocket (`hooks/useJobWebSocket.jsx`)

A custom React hook for managing WebSocket connections to receive real-time job updates.

**Features:**
- Automatic connection management
- Error handling
- Data parsing and state management

## Styling

The application uses Material UI for consistent, accessible styling with the following customizations:

- Responsive design for all screen sizes
- Dark/light mode support
- Consistent spacing and typography
- Accessible color contrast
- Smooth transitions and animations

## API Integration

The WebUI communicates with the backend through a REST API with the following endpoints:

- `POST /api/download` - Create a new download job
- `GET /api/jobs` - List all download jobs
- `GET /api/job/{job_id}` - Get details for a specific job
- `WS /ws/jobs/{job_id}` - WebSocket connection for real-time updates

## Future Enhancements

Planned improvements include:
- Enhanced drag and drop with file support
- Bulk action controls for job management
- Advanced filtering and sorting options
- Detailed job logs and error reporting
- Performance optimizations