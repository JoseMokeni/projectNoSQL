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
  IconButton,
  TextField,
} from "@mui/material";
import { Edit, Delete, Add, Book, Search } from "@mui/icons-material";
import AbonneForm from "../components/abonnes/AbonneForm";

import axios from "axios";
import EmpruntsList from "../components/abonnes/EmpruntsList";

const Abonnes = () => {
  const [abonnes, setAbonnes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAbonne, setSelectedAbonne] = useState(null);

  const [openEmprunts, setOpenEmprunts] = useState(false);
  const [selectedAbonneEmprunts, setSelectedAbonneEmprunts] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const apiUrl = `${process.env.REACT_APP_API_URL}/abonnes`;

  useEffect(() => {
    fetchAbonnes();
  }, []);

  const fetchAbonnes = () => {
    axios
      .get(apiUrl)
      .then((res) => setAbonnes(res.data))
      .catch((err) => console.error(err));
  };

  const filteredAbonnes = abonnes.filter(
    (abonne) =>
      abonne.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      abonne.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      abonne.telephone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (abonneData) => {
    try {
      if (selectedAbonne) {
        await axios.put(`${apiUrl}/${selectedAbonne._id}`, abonneData);
      } else {
        await axios.post(apiUrl, abonneData);
      }
      setOpenDialog(false);
      setSelectedAbonne(null);

      fetchAbonnes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet abonné ?")) {
      axios
        .delete(`${apiUrl}/${id}`)
        .then((res) => {
          setAbonnes((prev) => prev.filter((a) => a._id !== id));
        })
        .catch((err) => console.error(err));
    }
  };

  const handleViewEmprunts = (id) => {
    console.log("View Emprunts", id);
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Abonnés</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Nouvel Abonné
        </Button>
      </Box>

      {/* search field */}
      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher par nom, email ou téléphone..."
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
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Emprunts</TableCell>
              <TableCell>Date d'inscription</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAbonnes.map((abonne) => (
              <TableRow key={abonne._id}>
                <TableCell>{abonne.nom}</TableCell>
                <TableCell>{abonne.email}</TableCell>
                <TableCell>{abonne.telephone}</TableCell>
                <TableCell>{abonne.emprunts_actuels?.length || 0}</TableCell>
                <TableCell>
                  {new Date(abonne.date_inscription).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedAbonne(abonne);
                      setOpenDialog(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(abonne._id)}>
                    <Delete />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setSelectedAbonneEmprunts(abonne);
                      setOpenEmprunts(true);
                    }}
                  >
                    <Book />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <AbonneForm
        open={openDialog}
        handleClose={() => {
          setOpenDialog(false);
          setSelectedAbonne(null);
        }}
        abonne={selectedAbonne}
        handleSubmit={handleSubmit}
      />
      <EmpruntsList
        open={openEmprunts}
        handleClose={() => {
          setOpenEmprunts(false);
          setSelectedAbonneEmprunts(null);
        }}
        abonneId={selectedAbonneEmprunts?._id}
        abonneName={
          selectedAbonneEmprunts
            ? `${selectedAbonneEmprunts.prenom} ${selectedAbonneEmprunts.nom}`
            : ""
        }
      />
    </Box>
  );
};

export default Abonnes;
