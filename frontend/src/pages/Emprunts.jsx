import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
} from "@mui/material";
import { Add, Check, Delete, Search } from "@mui/icons-material";
import axios from "axios";
import EmpruntForm from "../components/emprunts/EmpruntForm";

const Emprunts = () => {
  const [emprunts, setEmprunts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const apiUrl = `${process.env.REACT_APP_API_URL}/emprunts`;

  const fetchEmprunts = async () => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setEmprunts(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchEmprunts();
  }, []);

  const filteredEmprunts = emprunts.filter(
    (emprunt) =>
      emprunt.document?.titre
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      emprunt.abonne?.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emprunt.abonne?.prenom
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      emprunt.abonne?.telephone
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      emprunt.statut?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRetour = (id) => {
    axios.post(`${apiUrl}/${id}/retour`);

    setEmprunts((prev) =>
      prev.map((e) => (e._id === id ? { ...e, statut: "retourne" } : e))
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet emprunt ?")) {
      axios
        .delete(`${apiUrl}/${id}`)
        .then(() => {
          setEmprunts((prev) => prev.filter((e) => e._id !== id));
        })
        .catch((err) => console.error(err));
    }
  };

  const handleCreateEmprunt = async (data) => {
    try {
      await axios.post(`${apiUrl}`, data);
      setOpenDialog(false);
      fetchEmprunts(); // Rafraîchir la liste des emprunts
    } catch (error) {
      console.error("Erreur lors de la création de l'emprunt:", error);
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Emprunts</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Nouvel Emprunt
        </Button>
      </Box>

      {/* search field */}
      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher par document, abonné, téléphone ou statut..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ color: "action.active", mr: 1 }} />,
          }}
        />
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Document</TableCell>
              <TableCell>Abonné</TableCell>
              <TableCell>Date Emprunt</TableCell>
              <TableCell>Date Retour Prévue</TableCell>
              <TableCell>Date Retour Effective</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmprunts.map((emprunt) => (
              <TableRow key={emprunt._id}>
                <TableCell>{emprunt.document?.titre}</TableCell>
                <TableCell>
                  {emprunt.abonne?.nom +
                    " " +
                    emprunt.abonne?.prenom +
                    "-" +
                    emprunt.abonne?.telephone}
                </TableCell>
                <TableCell>
                  {new Date(emprunt.date_emprunt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(emprunt.date_retour_prevue).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {emprunt.date_retour_effective
                    ? new Date(
                        emprunt.date_retour_effective
                      ).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={emprunt.statut}
                    color={
                      emprunt.statut === "en_cours"
                        ? "primary"
                        : emprunt.statut === "en_retard"
                        ? "error"
                        : "success"
                    }
                  />
                </TableCell>
                <TableCell>
                  {emprunt.statut === "en_cours" && (
                    <IconButton onClick={() => handleRetour(emprunt._id)}>
                      <Check />
                    </IconButton>
                  )}

                  <IconButton onClick={() => handleDelete(emprunt._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <EmpruntForm
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        handleSubmit={handleCreateEmprunt}
      />
    </Box>
  );
};

export default Emprunts;
