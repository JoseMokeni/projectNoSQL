import datetime


class Abonne:
    def __init__(self):
        self.schema = {
            'nom': str,
            'prenom': str,
            'email': str,
            'adresse': str,
            'telephone': str,
            'date_inscription': datetime,
            'emprunts_actuels': list,
            'historique_emprunts': list
        }