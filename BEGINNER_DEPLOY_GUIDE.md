# Complete Beginner's Guide to Deploying HF Downloader on TrueNAS SCALE

This guide will walk you through deploying the HF Downloader application on TrueNAS SCALE, even if you have no prior experience with Docker, Kubernetes, or TrueNAS.

## Prerequisites

Before you begin, you'll need:
1. A TrueNAS SCALE system (version 22.12 or later recommended)
2. Administrative access to the TrueNAS web interface
3. A dataset for storing downloaded models
4. A Hugging Face account and access token

## Step 1: Prepare Your TrueNAS System

### 1.1 Create a Dataset for Models
1. Log into your TrueNAS web interface
2. Navigate to **Storage > Datasets**
3. Click **Add Dataset**
4. Set the following:
   - **Name**: `hf-models` (or any name you prefer)
   - **Pool**: Select your storage pool
   - Leave other settings as default
5. Click **Save**

### 1.2 Enable Kubernetes (if not already enabled)
1. Go to **System Settings > Services**
2. Find **Kubernetes** in the list
3. Click the slider to enable it
4. Wait for Kubernetes to initialize (this may take several minutes)

## Step 2: Obtain Required Credentials

### 2.1 Get Your Hugging Face Token
1. Visit [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Click **New token**
3. Give it a name (e.g., "TrueNAS Downloader")
4. Select **Role**: Read
5. Click **Create token**
6. **Save this token** - you'll need it later

### 2.2 Generate a JWT Secret
1. Open a terminal or command prompt on your computer
2. Run this command to generate a random secret:
   ```bash
   openssl rand -base64 32
   ```
3. **Save this secret** - you'll need it later

## Step 3: Deploy Using the Apps Interface

### 3.1 Prepare the docker-compose File
1. Download the `docker-compose.prod.yml` file from the repository
2. Edit it to match your system:
   - Replace `/mnt/{pool}/hf-models` with your actual dataset path
   - You'll add secrets through the TrueNAS interface later

### 3.2 Deploy via Custom App
1. In TrueNAS, go to **Apps > Custom App**
2. Click **Install via YAML**
3. Paste the contents of your edited `docker-compose.prod.yml` file
4. Click **Install**

## Step 4: Configure Secrets

### 4.1 Add Secrets in TrueNAS
1. Go to **Apps > Installed Applications**
2. Find your HF Downloader application
3. Click the **Edit** button (pencil icon)
4. Scroll down to the **Secrets** section
5. Add two secrets:
   - **HF_TOKEN**: Your Hugging Face token
   - **JWT_SECRET**: Your generated JWT secret
6. Click **Save**

## Step 5: Access the Application

### 5.1 Find the Application URL
1. Go to **Apps > Installed Applications**
2. Find your HF Downloader application
3. Look for the **Application URL** in the details
4. It will typically be something like `http://[your-truenas-ip]:8080`

### 5.2 Generate a User Token
1. Open the application URL in your web browser
2. You'll need to generate a JWT token for authentication:
   - Open a terminal or command prompt
   - Run this command (replace `YOUR_JWT_SECRET` with your actual secret):
     ```bash
     curl -X POST http://[your-truenas-ip]:8080/api/auth/token \
       -H "Content-Type: application/json" \
       -d '{"sub": "user1"}'
     ```
   - This will return a token that you can use in the WebUI

### 5.3 Use the WebUI
1. Open the application URL in your browser
2. Enter your JWT token in the token field
3. Start downloading models by entering model IDs

## Step 6: Managing Downloads

### 6.1 Start a Download
1. In the WebUI, enter a model ID (e.g., `facebook/opt-125m`)
2. Select repository type if needed (usually "Model")
3. Choose download options:
   - **Full Model**: Download the entire repository
   - **Select Branch**: Download a specific branch
   - **Select Files**: Download specific files only
4. Click **Start Download**

### 6.2 Monitor Progress
1. The **Download Jobs** section shows all active downloads
2. You can see progress, speed, and estimated time remaining
3. Use the action buttons to pause, resume, or cancel downloads

### 6.3 Access Downloaded Models
1. Your downloaded models are stored in the dataset you created
2. Access them via **Storage > Datasets** in TrueNAS
3. Or access them directly via the filesystem at `/mnt/{pool}/hf-models`

## Troubleshooting

### Common Issues and Solutions

#### Issue: Application won't start
**Solution**: 
1. Check that your dataset path is correct
2. Verify that your secrets are properly configured
3. Check the application logs in **Apps > Installed Applications > Logs**

#### Issue: Can't access the WebUI
**Solution**:
1. Verify the application is running (status should be "Active")
2. Check the application URL in the details
3. Ensure no firewall is blocking the port

#### Issue: Downloads failing
**Solution**:
1. Check that your HF_TOKEN is correct and has read permissions
2. Verify you have sufficient storage space
3. Check the job logs for specific error messages

#### Issue: Slow downloads
**Solution**:
1. Increase the number of workers in the application configuration
2. Ensure your network connection is stable
3. Check if your storage has adequate throughput

## Updating the Application

### To Update to a New Version
1. Go to **Apps > Installed Applications**
2. Find your HF Downloader application
3. Click the **Update** button
4. If using the default image, it will automatically pull the latest version
5. If using a specific tag, update the image tag in the configuration
6. Click **Save**

## Advanced Configuration

### Scaling Workers
To increase download parallelization:
1. Edit the application configuration
2. Find the **worker** section
3. Increase the **replicas** value
4. Click **Save**

### Resource Allocation
For better performance:
1. Edit the application configuration
2. Adjust CPU and memory limits for the backend and worker services
3. Click **Save**

## Security Considerations

1. **Never expose the application to the internet** without proper authentication and encryption
2. **Store your tokens securely** and regenerate them periodically
3. **Restrict access** to the WebUI to trusted networks or VPN
4. **Use HTTPS** in production environments (requires additional configuration)

## Getting Help

If you encounter issues:
1. Check the application logs in TrueNAS
2. Review this documentation
3. Visit the project repository for issues and discussions
4. Contact the TrueNAS community forums

## Conclusion

You've successfully deployed the HF Downloader on TrueNAS SCALE! You can now download Hugging Face models directly to your TrueNAS system with a user-friendly web interface. Remember to monitor your storage usage and keep your application updated for the best experience.