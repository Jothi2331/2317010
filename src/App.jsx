import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import AllNotifications from './components/AllNotifications.jsx';
import PriorityNotifications from './components/PriorityNotifications.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>Campus Notifications</Typography>
              <Button color="inherit" component={Link} to="/">All</Button>
              <Button color="inherit" component={Link} to="/priority">Priority</Button>
            </Toolbar>
          </AppBar>
          <Container sx={{ mt: 4 }}>
            <Routes>
              <Route path="/" element={<AllNotifications />} />
              <Route path="/priority" element={<PriorityNotifications />} />
            </Routes>
          </Container>
        </Box>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
