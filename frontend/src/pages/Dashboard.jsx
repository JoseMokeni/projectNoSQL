import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import {
  LibraryBooks,
  People,
  BookmarkBorder,
  Warning,
} from "@mui/icons-material";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalAbonnes: 0,
    empruntsEnCours: 0,
    empruntsEnRetard: 0,
  });

  const apiUrl = `${process.env.REACT_APP_API_URL}/stats`;

  useEffect(() => {
    console.log(process.env);
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Tableau de Bord
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card 
            sx={{
              p: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 2,
              background: 'linear-gradient(145deg, #ffffff 0%, #f4f4f4 100%)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: (theme) => `0 8px 24px ${theme.palette.primary.light}40`,
              },
              '& .MuiSvgIcon-root': {
                fontSize: 48,
                transition: 'transform 0.3s ease',
              },
              '&:hover .MuiSvgIcon-root': {
                transform: 'scale(1.1)',
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ mb: 2 }}>
                <LibraryBooks color="primary" sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                {stats.totalDocuments}
              </Typography>
              <Typography color="textSecondary" variant="subtitle1">
                Documents
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card 
            sx={{
              p: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 2,
              background: 'linear-gradient(145deg, #ffffff 0%, #f4f4f4 100%)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: (theme) => `0 8px 24px ${theme.palette.primary.light}40`,
              },
              '& .MuiSvgIcon-root': {
                fontSize: 48,
                transition: 'transform 0.3s ease',
              },
              '&:hover .MuiSvgIcon-root': {
                transform: 'scale(1.1)',
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ mb: 2 }}>
                <People color="primary" sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                {stats.totalAbonnes}
              </Typography>
              <Typography color="textSecondary" variant="subtitle1">
                Abonnés
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card 
            sx={{
              p: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 2,
              background: 'linear-gradient(145deg, #ffffff 0%, #f4f4f4 100%)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: (theme) => `0 8px 24px ${theme.palette.primary.light}40`,
              },
              '& .MuiSvgIcon-root': {
                fontSize: 48,
                transition: 'transform 0.3s ease',
              },
              '&:hover .MuiSvgIcon-root': {
                transform: 'scale(1.1)',
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ mb: 2 }}>
                <BookmarkBorder color="primary" sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                {stats.empruntsEnCours}
              </Typography>
              <Typography color="textSecondary" variant="subtitle1">
                Emprunts en cours
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card 
            sx={{
              p: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 2,
              background: 'linear-gradient(145deg, #ffffff 0%, #f4f4f4 100%)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: (theme) => `0 8px 24px ${theme.palette.primary.light}40`,
              },
              '& .MuiSvgIcon-root': {
                fontSize: 48,
                transition: 'transform 0.3s ease',
              },
              '&:hover .MuiSvgIcon-root': {
                transform: 'scale(1.1)',
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ mb: 2 }}>
                <Warning color="error" sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                {stats.empruntsEnRetard}
              </Typography>
              <Typography color="textSecondary" variant="subtitle1">
                Retards
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
