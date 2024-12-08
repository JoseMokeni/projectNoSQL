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
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
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
        {abonne ? "Modifier l'abonné" : "Ajouter un nouvel abonné"}
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box 
          component="form" 
          noValidate 
          onSubmit={onSubmit} 
          sx={{ 
            '& .MuiTextField-root': {
              mb: 2.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'action.hover',
                  '& fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: '2px',
                  }
                },
                '&.Mui-focused': {
                  boxShadow: theme => `0 0 0 2px ${theme.palette.primary.main}20`,
                },
                '&.Mui-error': {
                  boxShadow: theme => `0 0 0 2px ${theme.palette.error.main}20`,
                },
                '& textarea': {
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  }
                }
              },
              '& .MuiFormLabel-root': {
                '&.Mui-focused': {
                  color: 'primary.main'
                }
              },
              '& .MuiFormHelperText-root': {
                mx: 0,
                mt: 0.5
              }
            }
          }}
        >
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
            sx={{
              '& .MuiOutlinedInput-root': {
                '& textarea': {
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  }
                }
              }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        p: 2.5,
        gap: 1,
        bgcolor: 'grey.50',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Button 
          onClick={handleClose} 
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            px: 3
          }}
        >
          Annuler
        </Button>
        <Button 
          onClick={onSubmit} 
          variant="contained" 
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            boxShadow: 2
          }}
        >
          {abonne ? "Modifier" : "Ajouter"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AbonneForm;
