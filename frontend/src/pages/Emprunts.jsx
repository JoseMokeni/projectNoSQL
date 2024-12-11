import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  TableSortLabel,
} from "@mui/material";
import { Add, Check, Delete, Search, PictureAsPdf } from "@mui/icons-material";
import axios from "axios";
import EmpruntForm from "../components/emprunts/EmpruntForm";
import { generateEmpruntsPDF } from "../utils/pdfExport";
import { toast } from 'react-toastify';

const Emprunts = () => {
  const [statusFilter, setStatusFilter] = useState("tous");
  const [emprunts, setEmprunts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderBy, setOrderBy] = useState('date_emprunt');
  const [order, setOrder] = useState('desc');

  const apiUrl = `${process.env.REACT_APP_API_URL}/emprunts`;

  const checkAndUpdateOverdueStatus = (emprunts) => {
    const today = new Date();
    return emprunts.map(emprunt => {
      if (emprunt.statut === 'en_cours' && new Date(emprunt.date_retour_prevue) < today) {
        return { ...emprunt, statut: 'en_retard' };
      }
      return emprunt;
    });
  };

  const fetchEmprunts = async () => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const updatedEmprunts = checkAndUpdateOverdueStatus(data);
        setEmprunts(updatedEmprunts);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchEmprunts();
    // Check for overdue items every minute
    const interval = setInterval(() => {
      setEmprunts(prev => checkAndUpdateOverdueStatus(prev));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const filteredEmprunts = emprunts.filter((emprunt) => {
    const matchesSearch =
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
      emprunt.statut?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "tous" || emprunt.statut === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleRetour = (id) => {
    axios.post(`${apiUrl}/${id}/retour`)
      .then(() => {
        setEmprunts((prev) =>
          prev.map((e) => (e._id === id ? { ...e, statut: "retourne" } : e))
        );
        toast.success('Retour enregistré avec succès');
      })
      .catch(err => {
        toast.error('Erreur lors du retour');
        console.error(err);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet emprunt ?")) {
      axios
        .delete(`${apiUrl}/${id}`)
        .then(() => {
          setEmprunts((prev) => prev.filter((e) => e._id !== id));
          toast.success('Emprunt supprimé avec succès');
        })
        .catch((err) => {
          toast.error('Erreur lors de la suppression');
          console.error(err);
        });
    }
  };

  const handleCreateEmprunt = async (data) => {
    try {
      await axios.post(`${apiUrl}`, data);
      setOpenDialog(false);
      fetchEmprunts();
      toast.success('Emprunt créé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la création de l\'emprunt');
      console.error("Erreur lors de la création de l'emprunt:", error);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortData = (data) => {
    return data.sort((a, b) => {
      let aVal = a[orderBy];
      let bVal = b[orderBy];

      // Special handling for nested properties
      if (orderBy === 'document') aVal = a.document?.titre;
      if (orderBy === 'document') bVal = b.document?.titre;
      if (orderBy === 'abonne') aVal = `${a.abonne?.nom} ${a.abonne?.prenom}`;
      if (orderBy === 'abonne') bVal = `${b.abonne?.nom} ${b.abonne?.prenom}`;

      // Convert dates to timestamps for comparison
      if (orderBy.includes('date')) {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (bVal < aVal) return order === 'asc' ? 1 : -1;
      if (bVal > aVal) return order === 'asc' ? -1 : 1;
      return 0;
    });
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
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdf />}
            onClick={() => generateEmpruntsPDF(emprunts)}
          >
            Exporter PDF
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
          >
            Nouvel Emprunt
          </Button>
        </Box>
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          sx={{ flex: 1 }}
          variant="outlined"
          placeholder="Rechercher par document, abonné, téléphone ou statut..."
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
            label="Statut"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="tous">Tous</MenuItem>
            <MenuItem value="en_cours">En cours</MenuItem>
            <MenuItem value="en_retard">En retard</MenuItem>
            <MenuItem value="retourne">Retourné</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper elevation={3} sx={{ 
        borderRadius: 2, 
        overflow: 'hidden',
        '& .MuiTableCell-head': {
          backgroundColor: 'primary.dark',
          color: 'white',
          fontSize: '0.95rem',
          fontWeight: 600,
        },
        '& .MuiTableSortLabel-root': {
          color: 'white !important',
          '&:hover': {
            opacity: 0.8,
          },
        },
        '& .MuiTableBody-root .MuiTableRow-root': {
          '&:hover': {
            backgroundColor: 'action.hover',
            transform: 'scale(1.001)',
            transition: 'all 0.3s ease',
          },
        },
        '& .MuiChip-root': {
          fontWeight: 500,
          padding: '4px',
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
        '& .MuiIconButton-root': {
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: 'action.selected',
          },
        },
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'document'}
                  direction={orderBy === 'document' ? order : 'asc'}
                  onClick={() => handleRequestSort('document')}
                >
                  Document
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'abonne'}
                  direction={orderBy === 'abonne' ? order : 'asc'}
                  onClick={() => handleRequestSort('abonne')}
                >
                  Abonné
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'date_emprunt'}
                  direction={orderBy === 'date_emprunt' ? order : 'asc'}
                  onClick={() => handleRequestSort('date_emprunt')}
                >
                  Date Emprunt
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'date_retour_prevue'}
                  direction={orderBy === 'date_retour_prevue' ? order : 'asc'}
                  onClick={() => handleRequestSort('date_retour_prevue')}
                >
                  Date Retour Prévue
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'date_retour_effective'}
                  direction={orderBy === 'date_retour_effective' ? order : 'asc'}
                  onClick={() => handleRequestSort('date_retour_effective')}
                >
                  Date Retour Effective
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'statut'}
                  direction={orderBy === 'statut' ? order : 'asc'}
                  onClick={() => handleRequestSort('statut')}
                >
                  Statut
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortData(filteredEmprunts).map((emprunt) => (
              <TableRow 
                key={emprunt._id}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    transform: 'scale(1.002)',
                    transition: 'all 0.2s'
                  }
                }}
              >
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
                    sx={{ 
                      fontWeight: 'bold',
                      '& .MuiChip-label': { px: 2 }
                    }}
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
