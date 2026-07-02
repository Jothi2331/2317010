import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Card, CardContent, Chip, Grid, Select, MenuItem, IconButton, Badge, Pagination } from '@mui/material';
import { Refresh, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNotifications } from '../context/NotificationContext.jsx';

const AllNotifications = () => {
  const { notifications, loading, error, fetchNotifications, markAsViewed, isViewed } = useNotifications();
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const p = {};
    if (filter !== 'all') p['notification type'] = filter;
    fetchNotifications({ ...p, limit, page });
  }, [filter, page, limit]);

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.Type === filter);
  const c = (t) => ({ Placement: '#ff1744', Result: '#ff9100', Event: '#00e676' }[t] || '#999');
  const l = (t) => ({ Placement: 'High', Result: 'Medium', Event: 'Low' }[t]);

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 5 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
        <Typography variant="h5">All <Badge badgeContent={filtered.length} color="primary" /></Typography>
        <Box display="flex" gap={1}>
          <Select size="small" value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }} sx={{ minWidth: 90 }}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
          <Select size="small" value={limit} onChange={e => { setLimit(e.target.value); setPage(1); }} sx={{ minWidth: 60 }}>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
          <IconButton onClick={() => fetchNotifications({ limit, page })}><Refresh /></IconButton>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {!filtered.length ? 
          <Grid item xs={12}><Alert severity="info">No notifications</Alert></Grid> :
          filtered.map(n => (
            <Grid item xs={12} key={n.ID}>
              <Card sx={{ cursor: 'pointer', borderLeft: `4px solid ${c(n.Type)}`, opacity: isViewed(n.ID) ? 0.6 : 1 }} onClick={() => markAsViewed(n.ID)}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <Box flex={1}>
                      <Typography variant="h6">{n.Message}</Typography>
                      <Typography variant="caption">{new Date(n.Timestamp).toLocaleString()}</Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" gap={0.5} alignItems="flex-end">
                      <Chip label={l(n.Type)} size="small" sx={{ bgcolor: c(n.Type), color: 'white' }} />
                      {isViewed(n.ID) ? <VisibilityOff /> : <Visibility color="primary" />}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        }
      </Grid>
      {filtered.length > 0 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination count={Math.ceil(filtered.length / limit)} page={page} onChange={(e, v) => setPage(v)} />
        </Box>
      )}
    </Box>
  );
};

export default AllNotifications;