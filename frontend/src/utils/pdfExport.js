
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToPdf = (data, columns, title) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  doc.setFontSize(10);
  doc.text(new Date().toLocaleDateString(), 14, 22);

  // Add table
  doc.autoTable({
    head: [columns.map(col => col.header)],
    body: data.map(item => columns.map(col => item[col.field])),
    startY: 30,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [63, 81, 181] },
  });

  // Save PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateEmpruntsPDF = (emprunts) => {
  const columns = [
    { header: 'Document', field: 'document.titre' },
    { header: 'Abonné', field: 'abonne.nom' },
    { header: 'Date Emprunt', field: 'date_emprunt' },
    { header: 'Date Retour Prévue', field: 'date_retour_prevue' },
    { header: 'Statut', field: 'statut' },
  ];

  const formattedData = emprunts.map(emprunt => ({
    'document.titre': emprunt.document?.titre || '',
    'abonne.nom': `${emprunt.abonne?.nom} ${emprunt.abonne?.prenom}` || '',
    'date_emprunt': new Date(emprunt.date_emprunt).toLocaleDateString(),
    'date_retour_prevue': new Date(emprunt.date_retour_prevue).toLocaleDateString(),
    'statut': emprunt.statut,
  }));

  exportToPdf(formattedData, columns, 'Liste des Emprunts');
};

export const generateDocumentsPDF = (documents) => {
  const columns = [
    { header: 'Titre', field: 'titre' },
    { header: 'Auteur', field: 'auteur' },
    { header: 'Type', field: 'type' },
    { header: 'ISBN', field: 'isbn' },
    { header: 'Statut', field: 'disponible' },
  ];

  const formattedData = documents.map(doc => ({
    ...doc,
    disponible: doc.disponible ? 'Disponible' : 'Emprunté',
  }));

  exportToPdf(formattedData, columns, 'Liste des Documents');
};

export const generateAbonnesPDF = (abonnes) => {
  const columns = [
    { header: 'Nom', field: 'nom' },
    { header: 'Email', field: 'email' },
    { header: 'Téléphone', field: 'telephone' },
    { header: 'Date Inscription', field: 'date_inscription' },
  ];

  const formattedData = abonnes.map(abonne => ({
    ...abonne,
    date_inscription: new Date(abonne.date_inscription).toLocaleDateString(),
  }));

  exportToPdf(formattedData, columns, 'Liste des Abonnés');
};