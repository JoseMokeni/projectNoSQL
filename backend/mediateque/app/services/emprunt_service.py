from bson import ObjectId
from datetime import datetime, timedelta
from app import mongo
from app.services import abonne_service
from app.services import document_service

class EmpruntService:
    def __init__(self):
        self.duree_emprunt = timedelta(days=14)  # Durée par défaut de 14 jours
        self.abonne_service = abonne_service.AbonneService()
        self.document_service = document_service.DocumentService()
    
    def creer_emprunt(self, abonne_id, document_id):
        # Vérifier si le document est disponible
        document = mongo.db.documents.find_one({'_id': ObjectId(document_id)})
        if not document or not document.get('disponible'):
            raise ValueError("Document non disponible")
        
        date_emprunt = datetime.now()
        date_retour_prevue = date_emprunt + self.duree_emprunt
        
        emprunt_data = {
            'abonne_id': ObjectId(abonne_id),
            'document_id': ObjectId(document_id),
            'date_emprunt': date_emprunt,
            'date_retour_prevue': date_retour_prevue,
            'date_retour_effective': None,
            'statut': 'en_cours'
        }
        
        # Créer l'emprunt
        result = mongo.db.emprunts.insert_one(emprunt_data)
        
        # Mettre à jour le document
        mongo.db.documents.update_one(
            {'_id': ObjectId(document_id)},
            {
                '$set': {'disponible': False},
                '$push': {'emprunts': str(result.inserted_id)}
            }
        )
        
        # Mettre à jour l'abonné
        mongo.db.abonnes.update_one(
            {'_id': ObjectId(abonne_id)},
            {
                '$push': {
                    'emprunts_actuels': str(result.inserted_id),
                    'historique_emprunts': str(result.inserted_id)
                }
            }
        )
        
        return str(result.inserted_id)
    
    def enregistrer_retour(self, emprunt_id):
        emprunt = mongo.db.emprunts.find_one({'_id': ObjectId(emprunt_id)})
        if not emprunt:
            raise ValueError("Emprunt non trouvé")
        
        # Mettre à jour l'emprunt
        mongo.db.emprunts.update_one(
            {'_id': ObjectId(emprunt_id)},
            {
                '$set': {
                    'date_retour_effective': datetime.now(),
                    'statut': 'retourne'
                }
            }
        )
        
        # Mettre à jour le document
        mongo.db.documents.update_one(
            {'_id': emprunt['document_id']},
            {'$set': {'disponible': True}}
        )
        
        # Mettre à jour l'abonné
        mongo.db.abonnes.update_one(
            {'_id': emprunt['abonne_id']},
            {'$pull': {'emprunts_actuels': str(emprunt_id)}}
        )
    
    def get_emprunts_en_cours(self):
        return list(mongo.db.emprunts.find({'statut': 'en_cours'}))
    
    def get_emprunts_count(self):
        return mongo.db.emprunts.count_documents({'statut': 'en_cours'})
    
    def get_emprunts_en_retard(self):
        return list(mongo.db.emprunts.find({
            'statut': 'en_cours',
            'date_retour_prevue': {'$lt': datetime.now()}
        }))
    
    def get_emprunts_en_retard_count(self):
        return mongo.db.emprunts.count_documents({
            'statut': 'en_cours',
            'date_retour_prevue': {'$lt': datetime.now()}
            })
    
    def get_historique_emprunts_abonne(self, abonne_id):
        try:
            emprunts = list(mongo.db.emprunts.find({'abonne_id': ObjectId(abonne_id)}))
            
            # get the abonne and document 
            for emprunt in emprunts:
                emprunt['abonne'] = self.abonne_service.find_by_id(emprunt['abonne_id'])
                # remove abonne_id from emprunt['abonne']
                emprunt['document'] = self.document_service.find_by_id(emprunt['document_id'])
                if emprunt['abonne']:
                    del emprunt['abonne']['_id']
                if emprunt['document']:
                    del emprunt['document']['_id']
                
            return [{**emprunt, '_id': str(emprunt['_id']), 'abonne_id': str(emprunt['abonne_id']), 'document_id': str(emprunt['document_id'])} for emprunt in emprunts]
        except Exception as e:
            print(f"Error fetching emprunts: {str(e)}")
            return []
    
    def get_emprunts(self):
        try:
            emprunts = list(mongo.db.emprunts.find({}))
            # get the abonne and document 
            for emprunt in emprunts:
                emprunt['abonne'] = self.abonne_service.find_by_id(emprunt['abonne_id'])
                # remove abonne_id from emprunt['abonne']
                emprunt['document'] = self.document_service.find_by_id(emprunt['document_id'])
                if emprunt['abonne']:
                    del emprunt['abonne']['_id']
                if emprunt['document']:
                    del emprunt['document']['_id']
                
            return [{**emprunt, '_id': str(emprunt['_id']), 'abonne_id': str(emprunt['abonne_id']), 'document_id': str(emprunt['document_id'])} for emprunt in emprunts]
        except Exception as e:
            print(f"Error fetching emprunts: {str(e)}")
            return []
        
    def delete_emprunt(self, emprunt_id):
        emprunt = mongo.db.emprunts.find_one({'_id': ObjectId(emprunt_id)})
        if not emprunt:
            raise ValueError("Emprunt non trouvé")
        
        # Mettre à jour le document
        mongo.db.documents.update_one(
            {'_id': emprunt['document_id']},
            {'$pull': {'emprunts': str(emprunt_id)}}
        )
        
        # Mettre à jour l'abonné
        mongo.db.abonnes.update_one(
            {'_id': emprunt['abonne_id']},
            {'$pull': {'historique_emprunts': str(emprunt_id)}}
        )
        
        # Supprimer l'emprunt
        mongo.db.emprunts.delete_one({'_id': ObjectId(emprunt_id)}
        )