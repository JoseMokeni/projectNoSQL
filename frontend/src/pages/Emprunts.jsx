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
} from "@mui/material";
import { Add, Check, Delete } from "@mui/icons-material";
import axios from "axios";
import EmpruntForm from "../components/emprunts/EmpruntForm";

const Emprunts = () => {
  const [emprunts, setEmprunts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const apiUrl = "http://localhost:5000/api/emprunts";

  const fetchEmprunts = async () => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setEmprunts(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchEmprunts();
  }, []);

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
            {emprunts.map((emprunt) => (
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
