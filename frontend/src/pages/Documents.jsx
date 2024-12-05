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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TableSortLabel,
} from "@mui/material";
import { Edit, Delete, Add, Search } from "@mui/icons-material";
import DocumentForm from "../components/documents/DocumentForm";
import axios from "axios";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

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
      doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.date_publication && doc.date_publication.includes(searchQuery))
  );

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredDocuments = filteredDocuments
    .filter(doc => statusFilter === "all" ? true : doc.disponible === (statusFilter === "disponible"))
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      if (sortConfig.key === 'date_publication') {
        const dateA = new Date(a[sortConfig.key] || '');
        const dateB = new Date(b[sortConfig.key] || '');
        return sortConfig.direction === 'asc' 
          ? dateA - dateB 
          : dateB - dateA;
      }
      
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

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
      <Box mb={3} display="flex" gap={2}>
        <TextField
          sx={{ flex: 1 }}
          variant="outlined"
          placeholder="Rechercher par titre, auteur, ISBN ou type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ color: "action.active", mr: 1 }} />,
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Statut</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Statut"
          >
            <MenuItem value="all">Tous</MenuItem>
            <MenuItem value="disponible">Disponible</MenuItem>
            <MenuItem value="emprunte">Emprunté</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'titre'}
                  direction={sortConfig.key === 'titre' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('titre')}
                >
                  Titre
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'auteur'}
                  direction={sortConfig.key === 'auteur' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('auteur')}
                >
                  Auteur
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'type'}
                  direction={sortConfig.key === 'type' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('type')}
                >
                  Type
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'isbn'}
                  direction={sortConfig.key === 'isbn' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('isbn')}
                >
                  ISBN
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'date_publication'}
                  direction={sortConfig.key === 'date_publication' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('date_publication')}
                >
                  Date de publication
                </TableSortLabel>
              </TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndFilteredDocuments.map((doc) => (
              <TableRow key={doc._id}>
                <TableCell>{doc.titre}</TableCell>
                <TableCell>{doc.auteur}</TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{doc.isbn}</TableCell>
                <TableCell>{formatDate(doc.date_publication)}</TableCell>
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
