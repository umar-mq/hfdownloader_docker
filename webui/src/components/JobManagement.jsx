import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import {
  Refresh,
  PlayArrow,
  Pause,
  Stop,
  RestartAlt,
  Search,
  FilterList
} from '@mui/icons-material';
import useJobWebSocket from '../hooks/useJobWebSocket';

const JobManagement = ({ token }) => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created');
  const [sortOrder, setSortOrder] = useState('desc');

  // Mock data for demonstration
  const mockJobs = [
    {
      id: 'job-1',
      model_id: 'facebook/opt-125m',
      status: 'downloading',
      progress: 65,
      size: '2.4 GB',
      downloaded: '1.56 GB',
      speed: '4.2 MB/s',
      eta: '5:32',
      created: '2023-05-15 14:30:22',
      branch: 'main'
    },
    {
      id: 'job-2',
      model_id: 'google/flan-t5-base',
      status: 'completed',
      progress: 100,
      size: '1.1 GB',
      downloaded: '1.1 GB',
      speed: '0 MB/s',
      eta: '0:00',
      created: '2023-05-14 09:15:45',
      branch: 'main'
    },
    {
      id: 'job-3',
      model_id: 'stabilityai/stable-diffusion-2-1',
      status: 'queued',
      progress: 0,
      size: '5.2 GB',
      downloaded: '0 GB',
      speed: '0 MB/s',
      eta: '--:--',
      created: '2023-05-15 16:45:10',
      branch: 'fp16'
    },
    {
      id: 'job-4',
      model_id: 'EleutherAI/gpt-j-6B',
      status: 'failed',
      progress: 32,
      size: '24.2 GB',
      downloaded: '7.74 GB',
      speed: '0 MB/s',
      eta: '--:--',
      created: '2023-05-15 10:22:17',
      branch: 'main',
      error: 'Network timeout'
    }
  ];

  useEffect(() => {
    fetchJobs();
    
    // Set up periodic refresh
    const interval = setInterval(fetchJobs, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterAndSortJobs();
  }, [jobs, searchTerm, statusFilter, sortBy, sortOrder]);

  const fetchJobs = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      // In a real implementation, this would call the backend API
      // const response = await fetch('/api/jobs', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      // const data = await response.json();
      
      // For now, we'll use mock data
      setTimeout(() => {
        setJobs(mockJobs);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const filterAndSortJobs = () => {
    let result = [...jobs];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(job => 
        job.model_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(job => job.status === statusFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'model_id':
          aValue = a.model_id;
          bValue = b.model_id;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'size':
          aValue = parseFloat(a.size);
          bValue = parseFloat(b.size);
          break;
        case 'created':
        default:
          aValue = new Date(a.created);
          bValue = new Date(b.created);
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredJobs(result);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'downloading': return 'primary';
      case 'queued': return 'warning';
      case 'failed': return 'error';
      case 'paused': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'downloading': return 'Downloading';
      case 'queued': return 'Queued';
      case 'failed': return 'Failed';
      case 'paused': return 'Paused';
      default: return status;
    }
  };

  const handleAction = (jobId, action) => {
    // In a real implementation, this would call the backend API
    console.log(`Action ${action} triggered for job ${jobId}`);
    
    // For demonstration, let's update the job status in mock data
    const updatedJobs = jobs.map(job => {
      if (job.id === jobId) {
        switch (action) {
          case 'pause':
            return { ...job, status: 'paused' };
          case 'resume':
            return { ...job, status: 'downloading' };
          case 'cancel':
            return { ...job, status: 'failed' };
          case 'retry':
            return { ...job, status: 'queued' };
          default:
            return job;
        }
      }
      return job;
    });
    
    setJobs(updatedJobs);
  };

  const handleRefresh = () => {
    fetchJobs();
  };

  return (
    <Card>
      <CardHeader 
        title="Download Jobs" 
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="queued">Queued</MenuItem>
                <MenuItem value="downloading">Downloading</MenuItem>
                <MenuItem value="paused">Paused</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>
            <IconButton onClick={handleRefresh} disabled={loading}>
              <Refresh />
            </IconButton>
          </Box>
        }
      />
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredJobs.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography>No download jobs found</Typography>
            <Typography variant="body2" color="text.secondary">
              Start a new download to see it appear here
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Model ID</TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => {
                          setSortBy('status');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                      >
                        Status
                        {sortBy === 'status' && (
                          <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>Progress</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Speed</TableCell>
                    <TableCell>ETA</TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => {
                          setSortBy('created');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                      >
                        Created
                        {sortBy === 'created' && (
                          <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredJobs.map((job) => (
                    <TableRow key={job.id} hover>
                      <TableCell>
                        <Typography variant="body2">{job.model_id}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {job.id}
                        </Typography>
                        {job.branch && (
                          <Chip 
                            label={job.branch} 
                            size="small" 
                            variant="outlined" 
                            sx={{ ml: 1 }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusText(job.status)} 
                          color={getStatusColor(job.status)} 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <CircularProgress 
                              variant="determinate" 
                              value={job.progress} 
                              size={24} 
                              thickness={4}
                              color={getStatusColor(job.status)}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ minWidth: 35 }}>
                            {job.progress}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{job.downloaded}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          of {job.size}
                        </Typography>
                      </TableCell>
                      <TableCell>{job.speed}</TableCell>
                      <TableCell>{job.eta}</TableCell>
                      <TableCell>
                        <Typography variant="body2">{job.created}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {job.status === 'downloading' && (
                            <Tooltip title="Pause">
                              <IconButton 
                                size="small" 
                                onClick={() => handleAction(job.id, 'pause')}
                              >
                                <Pause fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {(job.status === 'paused' || job.status === 'queued') && (
                            <Tooltip title="Resume">
                              <IconButton 
                                size="small" 
                                onClick={() => handleAction(job.id, 'resume')}
                              >
                                <PlayArrow fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {(job.status === 'downloading' || job.status === 'queued' || job.status === 'paused') && (
                            <Tooltip title="Cancel">
                              <IconButton 
                                size="small" 
                                onClick={() => handleAction(job.id, 'cancel')}
                              >
                                <Stop fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {job.status === 'failed' && (
                            <Tooltip title="Retry">
                              <IconButton 
                                size="small" 
                                onClick={() => handleAction(job.id, 'retry')}
                              >
                                <RestartAlt fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredJobs.length} of {jobs.length} jobs
              </Typography>
              <Box>
                <Button
                  size="small"
                  onClick={() => {
                    setSortBy('created');
                    setSortOrder('desc');
                  }}
                >
                  Sort by Newest
                </Button>
              </Box>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default JobManagement;