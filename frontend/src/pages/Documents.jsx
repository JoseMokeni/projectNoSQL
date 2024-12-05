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
import { Edit, Delete, Add, Search } from "@mui/icons-material";
import DocumentForm from "../components/documents/DocumentForm";
import axios from "axios";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const apiUrl = `${process.env.REACT_APP_API_URL}/documents`;

  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setDocuments(data))
      .catch((err) => console.error(err));
  }, []);

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.auteur.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (documentData) => {
    try {
      if (selectedDocument) {
        await axios.put(`${apiUrl}/${selectedDocument._id}`, documentData);
      } else {
        await axios.post(`${apiUrl}`, documentData);
      }
      setDocuments((prev) => {
        if (selectedDocument) {
          return prev.map((doc) =>
            doc._id === selectedDocument._id ? documentData : doc
          );
        }
        return [...prev, documentData];
      });
      setOpenDialog(false);
      setSelectedDocument(null);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      try {
        await axios.delete(`${apiUrl}/${id}`);
        setDocuments(documents.filter((doc) => doc._id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
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
        <Typography variant="h4">Documents</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Nouveau Document
        </Button>
      </Box>

      {/* search field */}
      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher par titre, auteur, ISBN ou type..."
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
              <TableCell>Titre</TableCell>
              <TableCell>Auteur</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Date de publication</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDocuments.map((doc) => (
              <TableRow key={doc._id}>
                <TableCell>{doc.titre}</TableCell>
                <TableCell>{doc.auteur}</TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{doc.isbn}</TableCell>
                <TableCell>{doc.date_publication}</TableCell>
                <TableCell>
                  <Chip
                    label={doc.disponible ? "Disponible" : "Emprunté"}
                    color={doc.disponible ? "success" : "error"}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedDocument(doc);
                      setOpenDialog(true);
                    }}
                  >
                    <Edit />
                  </IconButton>

                  <IconButton onClick={() => handleDelete(doc._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <DocumentForm
        open={openDialog}
        handleClose={() => {
          setOpenDialog(false);
          setSelectedDocument(null);
        }}
        document={selectedDocument}
        handleSubmit={handleSubmit}
      />
    </Box>
  );
};

export default Documents;