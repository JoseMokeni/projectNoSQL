import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Chip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";

const EmpruntsList = ({ open, handleClose, abonneId, abonneName }) => {
  const [emprunts, setEmprunts] = useState([]);

  const apiUrl = `${process.env.REACT_APP_API_URL}/emprunts`;

  useEffect(() => {
    const fetchEmprunts = async () => {
      if (abonneId) {
        try {
          const response = await axios.get(`${apiUrl}/abonne/${abonneId}`);
          setEmprunts(response.data);
        } catch (error) {
          console.error("Erreur lors du chargement des emprunts:", error);
        }
      }
    };

    fetchEmprunts();
  }, [abonneId]);

  const getStatusColor = (emprunt) => {
    const retourPrevu = new Date(emprunt.date_retour_prevue);
    const today = new Date();

    if (emprunt.date_retour_effective) return "success";
    if (retourPrevu < today) return "error";
    return "primary";
  };

  const getStatusLabel = (emprunt) => {
    if (emprunt.date_retour_effective) return "Retourné";
    const retourPrevu = new Date(emprunt.date_retour_prevue);
    const today = new Date();
    return retourPrevu < today ? "En retard" : "En cours";
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
          overflow: 'hidden',
          boxShadow: theme => `0 8px 40px ${theme.palette.primary.main}20`,
        }
      }}
    >
      <DialogTitle sx={{
        bgcolor: 'primary.main',
        color: 'white',
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 2
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Emprunts de {abonneName}
        </Typography>
        <IconButton 
          onClick={handleClose}
          sx={{ 
            color: 'white',
            '&:hover': { 
              bgcolor: 'primary.dark',
              transform: 'rotate(90deg)',
              transition: 'all 0.3s',
            }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ 
              bgcolor: 'primary.dark',
              '& .MuiTableCell-head': {
                color: 'white',
                fontWeight: 600,
                fontSize: '0.95rem'
              }
            }}>
              <TableCell>Document</TableCell>
              <TableCell>Date d'emprunt</TableCell>
              <TableCell>Date de retour prévue</TableCell>
              <TableCell>Date de retour effective</TableCell>
              <TableCell>Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emprunts.map((emprunt) => (
              <TableRow 
                key={emprunt._id}
                sx={{
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    '& .MuiChip-root': {
                      transform: 'scale(1.05)',
                    }
                  }
                }}
              >
                <TableCell>{emprunt.document?.titre}</TableCell>
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
                    label={getStatusLabel(emprunt)}
                    color={getStatusColor(emprunt)}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
            {emprunts.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Aucun emprunt trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default EmpruntsList;
