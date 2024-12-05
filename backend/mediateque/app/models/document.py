import datetime


class Document:
    def __init__(self):
        self.schema = {
            'titre': str,
            'auteur': str,
            'type': str,
            'isbn': str,
            'date_publication': datetime,
            'disponible': bool,
            'emprunts': list
        }