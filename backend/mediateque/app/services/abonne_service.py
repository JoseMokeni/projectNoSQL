from bson import ObjectId
from datetime import datetime
from app import mongo

class AbonneService:
    def create(self, abonne_data):
        abonne_data['date_inscription'] = datetime.now()
        abonne_data['emprunts_actuels'] = []
        abonne_data['historique_emprunts'] = []
        result = mongo.db.abonnes.insert_one(abonne_data)
        return str(result.inserted_id)
    
    def find_all(self):
        return list(mongo.db.abonnes.find())
    
    def find_by_id(self, abonne_id):
        return mongo.db.abonnes.find_one({'_id': ObjectId(abonne_id)})
    
    def update(self, abonne_id, data):
        return mongo.db.abonnes.update_one(
            {'_id': ObjectId(abonne_id)},
            {'$set': data}
        )
    
    def delete(self, abonne_id):
        return mongo.db.abonnes.delete_one({'_id': ObjectId(abonne_id)})
    
    def get_emprunts_actuels(self, abonne_id):
        abonne = self.find_by_id(abonne_id)
        return abonne.get('emprunts_actuels', []) if abonne else []
    
    def get_abonnes_count(self):
        return mongo.db.abonnes.count_documents({})