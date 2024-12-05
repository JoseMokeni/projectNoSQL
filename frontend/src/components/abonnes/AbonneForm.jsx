import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";

const AbonneForm = ({ open, handleClose, abonne, handleSubmit }) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (abonne) {
      setFormData({
        nom: abonne.nom || "",
        prenom: abonne.prenom || "",
        email: abonne.email || "",
        telephone: abonne.telephone || "",
        adresse: abonne.adresse || "",
      });
    } else {
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        adresse: "",
      });
    }
    setErrors({});
  }, [abonne]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
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
        {abonne ? "Modifier l'abonné" : "Ajouter un nouvel abonné"}
      </DialogTitle>
      <DialogContent>
        <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 2 }}>
          <TextField
            name="nom"
            label="Nom"
            fullWidth
            margin="normal"
            value={formData.nom}
            onChange={handleChange}
            error={!!errors.nom}
            helperText={errors.nom}
            required
          />
          <TextField
            name="prenom"
            label="Prénom"
            fullWidth
            margin="normal"
            value={formData.prenom}
            onChange={handleChange}
            error={!!errors.prenom}
            helperText={errors.prenom}
            required
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            required
          />
          <TextField
            name="telephone"
            label="Téléphone"
            fullWidth
            margin="normal"
            value={formData.telephone}
            onChange={handleChange}
          />
          <TextField
            name="adresse"
            label="Adresse"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={formData.adresse}
            onChange={handleChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Annuler
        </Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          {abonne ? "Modifier" : "Ajouter"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AbonneForm;
