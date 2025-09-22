import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup
} from '@mui/material';
import { Download, Save } from '@mui/icons-material';
import DragDropUpload from './DragDropUpload';

const DownloadForm = ({ token, onTokenSave }) => {
  const [modelId, setModelId] = useState('');
  const [repoType, setRepoType] = useState('model');
  const [localDir, setLocalDir] = useState('');
  const [hfTransfer, setHfTransfer] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [downloadType, setDownloadType] = useState('full'); // full, branch, files
  const [branches, setBranches] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tokenInput, setTokenInput] = useState(token || '');

  const handleTokenSave = () => {
    onTokenSave(tokenInput);
    setSnackbar({
      open: true,
      message: 'Token saved successfully!',
      severity: 'success'
    });
  };

  const handleSubmit = async () => {
    if (!tokenInput) {
      setSnackbar({
        open: true,
        message: 'Please enter your JWT token first',
        severity: 'error'
      });
      return;
    }

    if (!modelId) {
      setSnackbar({
        open: true,
        message: 'Please enter a model ID',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    
    try {
      const payload = {
        model_id: modelId,
        repo_type: repoType,
        local_dir: localDir,
        hf_transfer: hfTransfer,
        download_type: downloadType,
        branch: selectedBranch || undefined,
        files: selectedFiles.length > 0 ? selectedFiles : undefined
      };

      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenInput}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setSnackbar({
        open: true,
        message: `Download job queued successfully! Job ID: ${data.job_id}`,
        severity: 'success'
      });
      
      // Reset form
      setModelId('');
      setLocalDir('');
      setSelectedBranch('');
      setSelectedFiles([]);
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error queuing download: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFetchModelInfo = async () => {
    if (!modelId) {
      setSnackbar({
        open: true,
        message: 'Please enter a model ID first',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    
    try {
      // This would be a new endpoint to fetch model metadata
      // For now, we'll simulate with mock data
      setBranches(['main', 'dev', 'experimental']);
      setFiles(['config.json', 'pytorch_model.bin', 'tokenizer.json', 'README.md']);
      
      setSnackbar({
        open: true,
        message: 'Model information fetched successfully!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error fetching model info: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileToggle = (file) => {
    if (selectedFiles.includes(file)) {
      setSelectedFiles(selectedFiles.filter(f => f !== file));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleModelIdDrop = (text) => {
    setModelId(text);
    setSnackbar({
      open: true,
      message: 'Model ID received from drag & drop!',
      severity: 'success'
    });
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader title="Download Model" />
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={9}>
              <TextField
                fullWidth
                label="JWT Token"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                type="password"
                helperText="Enter your authentication token"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Save />}
                onClick={handleTokenSave}
                sx={{ height: '100%' }}
              >
                Save Token
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mb: 3 }}>
          <DragDropUpload onModelIdDrop={handleModelIdDrop} />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Model ID"
                value={modelId}
                onChange={(e) => setModelId(e.target.value)}
                placeholder="e.g., facebook/opt-125m"
                helperText="Enter the Hugging Face model ID"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Repository Type</InputLabel>
                <Select
                  value={repoType}
                  label="Repository Type"
                  onChange={(e) => setRepoType(e.target.value)}
                >
                  <MenuItem value="model">Model</MenuItem>
                  <MenuItem value="dataset">Dataset</MenuItem>
                  <MenuItem value="space">Space</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Local Directory (optional)"
                value={localDir}
                onChange={(e) => setLocalDir(e.target.value)}
                helperText="Custom local directory for the download"
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            onClick={handleFetchModelInfo}
            disabled={loading || !modelId}
            sx={{ mb: 2 }}
          >
            Fetch Model Information
          </Button>

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={hfTransfer}
                  onChange={(e) => setHfTransfer(e.target.checked)}
                />
              }
              label="Enable HF Transfer (Accelerated Download)"
            />
          </FormGroup>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h2" sx={{ mb: 2 }}>Download Options</Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant={downloadType === 'full' ? 'contained' : 'outlined'}
                onClick={() => setDownloadType('full')}
                sx={{ height: '100%' }}
              >
                Full Model
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant={downloadType === 'branch' ? 'contained' : 'outlined'}
                onClick={() => setDownloadType('branch')}
                disabled={branches.length === 0}
                sx={{ height: '100%' }}
              >
                Select Branch
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant={downloadType === 'files' ? 'contained' : 'outlined'}
                onClick={() => setDownloadType('files')}
                disabled={files.length === 0}
                sx={{ height: '100%' }}
              >
                Select Files
              </Button>
            </Grid>
          </Grid>

          {downloadType === 'branch' && branches.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Select Branch</InputLabel>
                <Select
                  value={selectedBranch}
                  label="Select Branch"
                  onChange={(e) => setSelectedBranch(e.target.value)}
                >
                  {branches.map((branch) => (
                    <MenuItem key={branch} value={branch}>{branch}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {downloadType === 'files' && files.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Select Files:</Typography>
              <Paper sx={{ p: 2 }}>
                {files.map((file) => (
                  <FormControlLabel
                    key={file}
                    control={
                      <Checkbox
                        checked={selectedFiles.includes(file)}
                        onChange={() => handleFileToggle(file)}
                      />
                    }
                    label={file}
                    sx={{ display: 'block', ml: 0 }}
                  />
                ))}
              </Paper>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleSubmit}
            disabled={loading}
            size="large"
          >
            {loading ? 'Downloading...' : 'Start Download'}
          </Button>
        </Box>
      </CardContent>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default DownloadForm;