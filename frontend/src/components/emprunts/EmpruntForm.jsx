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

  const apiUrl = `${process.env.REACT_APP_API_URL}`;

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
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          boxShadow: theme => `0 8px 40px ${theme.palette.primary.main}20`,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main',
        color: 'white',
        pb: 2,
        '& .MuiTypography-root': { fontWeight: 600 }
      }}>
        Nouvel Emprunt
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom sx={{ 
              color: 'primary.main',
              fontWeight: 500
            }}>
              Sélectionner un abonné
            </Typography>
            <TextField
              fullWidth
              placeholder="Rechercher un abonné..."
              value={searchAbonne}
              onChange={(e) => setSearchAbonne(e.target.value)}
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  }
                }
              }}
            />
            <Paper sx={{ 
              height: 400,
              overflow: "auto",
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              '& .MuiListItem-root': {
                borderLeft: '3px solid transparent',
                transition: 'all 0.2s',
                '&:hover': {
                  borderLeftColor: 'primary.main',
                  bgcolor: 'action.hover',
                  transform: 'translateX(4px)',
                },
                '&.Mui-selected': {
                  borderLeftColor: 'primary.main',
                  bgcolor: 'primary.lighter',
                }
              }
            }}>
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
            <Typography variant="h6" gutterBottom sx={{ 
              color: 'primary.main',
              fontWeight: 500
            }}>
              Sélectionner un document
            </Typography>
            <TextField
              fullWidth
              placeholder="Rechercher un document..."
              value={searchDocument}
              onChange={(e) => setSearchDocument(e.target.value)}
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  }
                }
              }}
            />
            <Paper sx={{ 
              height: 400,
              overflow: "auto",
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              '& .MuiListItem-root': {
                borderLeft: '3px solid transparent',
                transition: 'all 0.2s',
                '&:hover': {
                  borderLeftColor: 'primary.main',
                  bgcolor: 'action.hover',
                  transform: 'translateX(4px)',
                },
                '&.Mui-selected': {
                  borderLeftColor: 'primary.main',
                  bgcolor: 'primary.lighter',
                }
              }
            }}>
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
        <Box mt={3} p={2} sx={{ 
          bgcolor: 'grey.50',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main', fontWeight: 500 }}>
            Résumé de l'emprunt
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
      <DialogActions sx={{ 
        p: 2,
        gap: 1,
        bgcolor: 'grey.50',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
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
