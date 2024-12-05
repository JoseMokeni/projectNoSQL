// src/components/emprunts/EmpruntForm.jsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Radio,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";

const EmpruntForm = ({ open, handleClose, handleSubmit }) => {
  const [abonnes, setAbonnes] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [searchAbonne, setSearchAbonne] = useState("");
  const [searchDocument, setSearchDocument] = useState("");
  const [selectedAbonne, setSelectedAbonne] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const apiUrl = "http://backend:5000/api";

  const fetchAbonnes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/abonnes`);
      setAbonnes(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des abonnés:", error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${apiUrl}/documents`);
      setDocuments(response.data.filter((doc) => doc.disponible));
    } catch (error) {
      console.error("Erreur lors du chargement des documents:", error);
    }
  };

  useEffect(() => {
    fetchAbonnes();
    fetchDocuments();
  }, []);

  const filteredAbonnes = abonnes.filter((abonne) =>
    `${abonne.nom} ${abonne.prenom}`
      .toLowerCase()
      .includes(searchAbonne.toLowerCase())
  );

  const filteredDocuments = documents.filter((doc) =>
    doc.titre.toLowerCase().includes(searchDocument.toLowerCase())
  );

  const onSubmit = () => {
    if (selectedAbonne && selectedDocument) {
      handleSubmit({
        abonne_id: selectedAbonne._id,
        document_id: selectedDocument._id,
      });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Nouvel Emprunt</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Liste des Abonnés */}
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom>
              Sélectionner un abonné
            </Typography>
            <TextField
              fullWidth
              placeholder="Rechercher un abonné..."
              value={searchAbonne}
              onChange={(e) => setSearchAbonne(e.target.value)}
              margin="normal"
            />
            <Paper variant="outlined" sx={{ height: 400, overflow: "auto" }}>
              <List>
                {filteredAbonnes.map((abonne) => (
                  <ListItem
                    key={abonne._id}
                    button
                    selected={selectedAbonne?._id === abonne._id}
                    onClick={() => setSelectedAbonne(abonne)}
                  >
                    <Radio
                      checked={selectedAbonne?._id === abonne._id}
                      onChange={() => setSelectedAbonne(abonne)}
                    />
                    <ListItemText
                      primary={`${abonne.nom} ${abonne.prenom}`}
                      secondary={abonne.email}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Liste des Documents */}
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom>
              Sélectionner un document
            </Typography>
            <TextField
              fullWidth
              placeholder="Rechercher un document..."
              value={searchDocument}
              onChange={(e) => setSearchDocument(e.target.value)}
              margin="normal"
            />
            <Paper variant="outlined" sx={{ height: 400, overflow: "auto" }}>
              <List>
                {filteredDocuments.map((document) => (
                  <ListItem
                    key={document._id}
                    button
                    selected={selectedDocument?._id === document._id}
                    onClick={() => setSelectedDocument(document)}
                  >
                    <Radio
                      checked={selectedDocument?._id === document._id}
                      onChange={() => setSelectedDocument(document)}
                    />
                    <ListItemText
                      primary={document.titre}
                      secondary={`${document.auteur} - ${document.type}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Résumé de la sélection */}
        <Box mt={2}>
          <Typography variant="subtitle1" gutterBottom>
            Résumé de l'emprunt :
          </Typography>
          <Typography variant="body2">
            Abonné :{" "}
            {selectedAbonne
              ? `${selectedAbonne.prenom} ${selectedAbonne.nom}`
              : "Non sélectionné"}
          </Typography>
          <Typography variant="body2">
            Document :{" "}
            {selectedDocument ? selectedDocument.titre : "Non sélectionné"}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Annuler
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          color="primary"
          disabled={!selectedAbonne || !selectedDocument}
        >
          Créer l'emprunt
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmpruntForm;
