import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  IconButton, 
  Box, 
  Switch,
  FormControlLabel,
  FormGroup
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import DownloadForm from './components/DownloadForm';
import JobManagement from './components/JobManagement';
import { lightTheme, darkTheme } from './theme';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [token, setToken] = useState('');

  const theme = React.useMemo(
    () => createTheme(darkMode ? darkTheme : lightTheme),
    [darkMode]
  );

  useEffect(() => {
    const savedToken = localStorage.getItem('jwt');
    if (savedToken) {
      setToken(savedToken);
    }
    
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  const handleThemeChange = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  const handleTokenSave = (newToken) => {
    setToken(newToken);
    localStorage.setItem('jwt', newToken);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h1" component="div" sx={{ flexGrow: 1 }}>
              HF Downloader
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={handleThemeChange}
                    icon={<Brightness7 />}
                    checkedIcon={<Brightness4 />}
                  />
                }
                label={darkMode ? "Dark" : "Light"}
              />
            </FormGroup>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <DownloadForm token={token} onTokenSave={handleTokenSave} />
          <JobManagement token={token} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
