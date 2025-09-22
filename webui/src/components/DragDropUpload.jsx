import React, { useCallback } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

const DragDropUpload = ({ onModelIdDrop }) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    // Handle dropped text (model ID)
    const text = e.dataTransfer.getData('text/plain');
    if (text) {
      onModelIdDrop(text);
      return;
    }
    
    // Handle dropped files (if needed in future)
    if (e.dataTransfer.files.length > 0) {
      // Process files if needed
    }
  }, [onModelIdDrop]);

  return (
    <Paper
      variant="outlined"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        p: 3,
        textAlign: 'center',
        borderStyle: 'dashed',
        borderColor: isDragOver ? 'primary.main' : 'divider',
        backgroundColor: isDragOver ? 'action.hover' : 'transparent',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer'
      }}
    >
      <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
      <Typography variant="h2" gutterBottom>
        Drag & Drop Model ID
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Drag a text file containing a model ID here, or paste a model ID anywhere in the app
      </Typography>
    </Paper>
  );
};

export default DragDropUpload;