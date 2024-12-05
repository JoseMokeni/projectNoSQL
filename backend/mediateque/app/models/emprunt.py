import datetime
from bson import ObjectId


class Emprunt:
    def __init__(self):
        self.schema = {
            'abonne_id': ObjectId,
            'document_id': ObjectId,
            'date_emprunt': datetime.datetime,  # ISO format: "YYYY-MM-DDTHH:MM:SS.mmmZ"
            'date_retour_prevue': datetime.datetime,  # ISO format: "YYYY-MM-DDTHH:MM:SS.mmmZ"
            'date_retour_effective': datetime.datetime,  # ISO format: "YYYY-MM-DDTHH:MM:SS.mmmZ"
            'statut': str  # 'en_cours', 'retarde', 'termine'
        }