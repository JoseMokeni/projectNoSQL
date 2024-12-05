from app.services.abonne_service import AbonneService
from app.services.document_service import DocumentService
from app.services.emprunt_service import EmpruntService

class StatsService:
    
    def get_stats(self):
        documentService = DocumentService()
        totalDocuments = documentService.count_total()
        totalDocumentsDispo = documentService.count_disponibles()
        totalDocumentsEmpruntes = documentService.count_empruntes()
        
        abonneService = AbonneService()
        totalAbonnes = abonneService.get_abonnes_count()
        
        empruntService = EmpruntService()
        empruntsEnCours = empruntService.get_emprunts_count()
        empruntsEnRetard = empruntService.get_emprunts_en_retard_count()
        
        data = {
            'empruntsEnCours': empruntsEnCours,
            'empruntsEnRetard': empruntsEnRetard,
            'totalDocuments': totalDocuments,
            'totalDocumentsDispo': totalDocumentsDispo,
            'totalDocumentsEmpruntes': totalDocumentsEmpruntes,
            'totalAbonnes': totalAbonnes
        }
        
        return data
    