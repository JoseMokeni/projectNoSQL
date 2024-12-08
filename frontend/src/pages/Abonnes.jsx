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
import { Edit, Delete, Add, Book, Search, ArrowUpward, ArrowDownward } from "@mui/icons-material";
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
  const [sortField, setSortField] = useState('nom');
  const [sortDirection, setSortDirection] = useState('asc');

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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedAbonnes = abonnes
    .filter(
      (abonne) =>
        abonne.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        abonne.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        abonne.telephone.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (a[sortField] < b[sortField]) return -1 * direction;
      if (a[sortField] > b[sortField]) return 1 * direction;
      return 0;
    });

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

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />;
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
          sx={{
            '& .MuiOutlinedInput-root': {
              transition: 'all 0.2s ease',
              '&:hover': {
                '& fieldset': { borderColor: 'primary.main' },
              },
              '&.Mui-focused': {
                '& fieldset': { borderWidth: 2 },
              },
            },
          }}
        />
      </Box>

      <Paper elevation={3} sx={{ 
        borderRadius: 2, 
        overflow: 'hidden',
        '& .MuiTableHead-root': {
          backgroundColor: 'primary.dark',
          '& .MuiTableCell-head': {
            color: 'white',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'opacity 0.2s ease',
            '&:hover': {
              opacity: 0.9,
            },
          },
        },
        '& .MuiTableBody-root .MuiTableRow-root': {
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'action.hover',
            transform: 'translateX(6px)',
          },
        },
        '& .MuiIconButton-root': {
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.1)',
            color: 'primary.main',
          },
        },
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSort('nom')} style={{ cursor: 'pointer' }}>
                Nom <SortIcon field="nom" />
              </TableCell>
              <TableCell onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                Email <SortIcon field="email" />
              </TableCell>
              <TableCell onClick={() => handleSort('telephone')} style={{ cursor: 'pointer' }}>
                Téléphone <SortIcon field="telephone" />
              </TableCell>
              <TableCell>Emprunts</TableCell>
              <TableCell onClick={() => handleSort('date_inscription')} style={{ cursor: 'pointer' }}>
                Date d'inscription <SortIcon field="date_inscription" />
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedAbonnes.map((abonne) => (
              <TableRow 
                key={abonne._id}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }
                }}
              >
                <TableCell>{abonne.nom}</TableCell>
                <TableCell>{abonne.email}</TableCell>
                <TableCell>{abonne.telephone}</TableCell>
                <TableCell>{abonne.emprunts_actuels?.length || 0}</TableCell>
                <TableCell>
                  {new Date(abonne.date_inscription).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      sx={{ 
                        '&:hover': { 
                          color: 'primary.main',
                          transform: 'scale(1.1)'
                        }
                      }}
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
                  </Box>
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
