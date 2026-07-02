import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Card, CardContent, Chip, Grid, Slider, Select, MenuItem, IconButton, Badge, Paper } from '@mui/material';
import { Refresh, Star, StarBorder } from '@mui/icons-material';
import { useNotifications } from '../context/NotificationContext.jsx';

const PriorityNotifications = () => {
  const { notifications, loading, error, fetchNotifications, markAsViewed, isViewed } = useNotifications();
  const [topN, setTopN] = useState(10);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const p = {};
    if (filter !== 'all') p['notification type'] = filter;
    fetchNotifications({ ...p, limit: 100 });
  }, [filter]);

  const score = (n) => {
    const w = { Placement: 3, Result: 2, Event: 1 }[n.Type] || 0;
    const r = Math.max(0.1, 1 / (1 + (Date.now() - new Date(n.Timestamp).getTime()) / 3600000));
    return (w * 100) + (r * 50);
  };

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.Type === filter);
  const priority = filtered.map(n => ({ ...n, s: score(n) })).sort((a, b) => b.s - a.s).slice(0, topN);
  const c = (t) => ({ Placement: '#ff1744', Result: '#ff9100', Event: '#00e676' }[t] || '#999');
  const l = (t) => ({ Placement: 'High', Result: 'Medium', Event: 'Low' }[t]);
  const stars = (s) => s >= 250 ? 5 : s >= 200 ? 4 : s >= 150 ? 3 : s >= 100 ? 2 : 1;

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 5 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="h5">Priority <Badge badgeContent={priority.length} color="primary" /></Typography>
        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center" mt={1}>
          <Box flex={1} minWidth={150}>
            <Typography variant="caption">Top: {topN}</Typography>
            <Slider value={topN} onChange={(e, v) => setTopN(v)} min={5} max={50} step={5} />
          </Box>
          <Select size="small" value={filter} onChange={e => setFilter(e.target.value)} sx={{ minWidth: 90 }}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
          <IconButton onClick={() => fetchNotifications({ limit: 100 })}><Refresh /></IconButton>
        </Box>
      </Paper>

      <Grid container spacing={2}>
        {!priority.length ? 
          <Grid item xs={12}><Alert severity="info">No priority notifications</Alert></Grid> :
          priority.map((n, i) => (
            <Grid item xs={12} key={n.ID}>
              <Card sx={{ cursor: 'pointer', borderLeft: `4px solid ${c(n.Type)}`, opacity: isViewed(n.ID) ? 0.6 : 1 }} onClick={() => markAsViewed(n.ID)}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Typography variant="h6">#{i+1} {n.Message}</Typography>
                        {[...Array(stars(n.s))].map((_, j) => <Star key={j} sx={{ color: '#ffd700', fontSize: 14 }} />)}
                      </Box>
                      <Typography variant="caption">{new Date(n.Timestamp).toLocaleString()} • Score: {Math.round(n.s)}</Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" gap={0.5} alignItems="flex-end">
                      <Chip label={l(n.Type)} size="small" sx={{ bgcolor: c(n.Type), color: 'white' }} />
                      {isViewed(n.ID) ? <StarBorder /> : <Star color="primary" />}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        }
      </Grid>
    </Box>
  );
};

export default PriorityNotifications;