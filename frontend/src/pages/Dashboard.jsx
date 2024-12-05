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
          <Card>
            <CardContent>
              <LibraryBooks color="primary" />
              <Typography variant="h5">{stats.totalDocuments}</Typography>
              <Typography color="textSecondary">Documents</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <People color="primary" />
              <Typography variant="h5">{stats.totalAbonnes}</Typography>
              <Typography color="textSecondary">Abonnés</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <BookmarkBorder color="primary" />
              <Typography variant="h5">{stats.empruntsEnCours}</Typography>
              <Typography color="textSecondary">Emprunts en cours</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Warning color="error" />
              <Typography variant="h5">{stats.empruntsEnRetard}</Typography>
              <Typography color="textSecondary">Retards</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
