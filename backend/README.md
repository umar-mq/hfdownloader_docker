# HF Downloader Backend API Documentation

## Overview

The HF Downloader Backend provides a RESTful API for managing Hugging Face model downloads with enhanced functionality for branch and file-level control.

## Authentication

All API endpoints require JWT authentication using the `Authorization: Bearer <token>` header.

## API Endpoints

### Health Check

**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "ok"
}
```

### Create Download Job

**POST** `/api/download`

Create a new download job with enhanced options.

**Request Body:**
```json
{
  "model_id": "string",              // Required: Hugging Face model ID
  "repo_type": "string",             // Optional: Repository type (model, dataset, space). Default: "model"
  "local_dir": "string",             // Optional: Custom local directory
  "hf_transfer": "boolean",          // Optional: Enable HF Transfer. Default: true
  "download_type": "string",         // Optional: Download type (full, branch, files). Default: "full"
  "branch": "string",                // Optional: Specific branch to download (required if download_type="branch")
  "files": ["string"]                // Optional: Specific files to download (required if download_type="files")
}
```

**Response:**
```json
{
  "job_id": "string"                 // Unique identifier for the download job
}
```

### List Download Jobs

**GET** `/api/jobs`

List all download jobs.

**Response:**
```json
[
  {
    "id": "string",                  // Job ID
    "status": "string"               // Job status (queued, downloading, completed, failed, paused)
  }
]
```

### Get Job Details

**GET** `/api/job/{job_id}`

Get detailed information about a specific download job.

**Parameters:**
- `job_id` (path): The unique identifier for the job

**Response:**
```json
{
  "id": "string",                    // Job ID
  "status": "string",                // Job status
  "result": {}                       // Job result (if completed)
}
```

### WebSocket Job Logs

**WS** `/ws/jobs/{job_id}`

Establish a WebSocket connection to receive real-time updates for a specific job.

**Parameters:**
- `job_id` (path): The unique identifier for the job

**Messages:**
```json
{
  "event": "start|log|finish",      // Type of event
  "cmd": "string",                  // Command being executed (start event)
  "line": "string",                 // Log line (log event)
  "code": "number"                  // Exit code (finish event)
}
```

## Job Statuses

- `queued`: Job is waiting to be processed
- `downloading`: Job is actively downloading
- `completed`: Job finished successfully
- `failed`: Job encountered an error
- `paused`: Job has been paused

## Download Types

- `full`: Download the entire repository
- `branch`: Download a specific branch
- `files`: Download specific files

## Environment Variables

- `HF_TOKEN`: Hugging Face access token
- `HF_HUB_ENABLE_HF_TRANSFER`: Enable HF Transfer for accelerated downloads
- `REDIS_URL`: Redis connection URL
- `MODEL_DIR`: Directory for storing downloaded models
- `DATA_DIR`: Directory for storing application data
- `JWT_SECRET`: Secret for JWT token signing

## Error Handling

The API uses standard HTTP status codes:
- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent abuse. Clients that exceed the limit will receive a 429 (Too Many Requests) response.

## Future Enhancements

Planned improvements include:
- Job cancellation endpoint
- Job pause/resume endpoints
- Enhanced job metadata
- Download progress tracking
- Batch job operations