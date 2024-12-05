// src/components/documents/DocumentForm.jsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
} from "@mui/material";

const DocumentForm = ({ open, handleClose, document, handleSubmit }) => {
  const [formData, setFormData] = useState({
    titre: "",
    auteur: "",
    type: "",
    isbn: "",
    date_publication: "",
    disponible: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (document) {
      setFormData({
        titre: document.titre || "",
        auteur: document.auteur || "",
        type: document.type || "",
        isbn: document.isbn || "",
        date_publication: document.date_publication || "",
        disponible: document.disponible,
      });
    } else {
      setFormData({
        titre: "",
        auteur: "",
        type: "",
        isbn: "",
        date_publication: "",
        disponible: true,
      });
    }
    setErrors({});
  }, [document]);

  const types = ["livre", "dvd", "magazine", "cd"];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.titre.trim()) newErrors.titre = "Le titre est requis";
    if (!formData.auteur.trim()) newErrors.auteur = "L'auteur est requis";
    if (!formData.type) newErrors.type = "Le type est requis";

    if (formData.type === "livre" && !formData.isbn.trim()) {
      newErrors.isbn = "L'ISBN est requis pour les livres";
    }

    if (!formData.date_publication.trim()) {
      newErrors.date_publication = "La date de publication est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Effacer l'erreur quand l'utilisateur commence à corriger
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleSubmit(formData);
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {document ? "Modifier le document" : "Ajouter un nouveau document"}
      </DialogTitle>
      <DialogContent>
        <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 2 }}>
          <TextField
            name="titre"
            label="Titre"
            fullWidth
            margin="normal"
            value={formData.titre}
            onChange={handleChange}
            error={!!errors.titre}
            helperText={errors.titre}
            required
          />
          <TextField
            name="auteur"
            label="Auteur"
            fullWidth
            margin="normal"
            value={formData.auteur}
            onChange={handleChange}
            error={!!errors.auteur}
            helperText={errors.auteur}
            required
          />
          <TextField
            select
            name="type"
            label="Type"
            fullWidth
            margin="normal"
            value={formData.type}
            onChange={handleChange}
            error={!!errors.type}
            helperText={errors.type}
            required
          >
            {types.map((type) => (
              <MenuItem key={type} value={type}>
                {type.toUpperCase()}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name="isbn"
            label="ISBN"
            fullWidth
            margin="normal"
            value={formData.isbn}
            onChange={handleChange}
            error={!!errors.isbn}
            helperText={errors.isbn}
            required={formData.type === "livre"}
          />
          <TextField
            name="date_publication"
            label="Date de publication"
            type="date"
            fullWidth
            margin="normal"
            value={formData.date_publication}
            onChange={handleChange}
            error={!!errors.date_publication}
            helperText={errors.date_publication}
            required
          />
          {/* Disponibilite */}
          <TextField
            select
            name="disponible"
            label="Disponible"
            fullWidth
            margin="normal"
            value={formData.disponible}
            onChange={handleChange}
          >
            <MenuItem value={true}>Disponible</MenuItem>
            <MenuItem value={false}>Emprunté</MenuItem>
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Annuler
        </Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          {document ? "Modifier" : "Ajouter"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentForm;
