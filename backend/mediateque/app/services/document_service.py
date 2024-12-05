from bson import ObjectId
from datetime import datetime
from app import mongo

class DocumentService:
    def create(self, document_data):
        document_data['disponible'] = True
        document_data['emprunts'] = []
        document_data['date_ajout'] = datetime.now()
        result = mongo.db.documents.insert_one(document_data)
        return str(result.inserted_id)
    
    def find_all(self):
        return list(mongo.db.documents.find())
    
    def find_by_id(self, document_id):
        return mongo.db.documents.find_one({'_id': ObjectId(document_id)})
    
    def update(self, document_id, data):
        return mongo.db.documents.update_one(
            {'_id': ObjectId(document_id)},
            {'$set': data}
        )
    
    def delete(self, document_id):
        return mongo.db.documents.delete_one({'_id': ObjectId(document_id)})
    
    def search(self, query):
        return list(mongo.db.documents.find({
            '$or': [
                {'titre': {'$regex': query, '$options': 'i'}},
                {'auteur': {'$regex': query, '$options': 'i'}}
            ]
        }))
    
    def update_disponibilite(self, document_id, disponible):
        return mongo.db.documents.update_one(
            {'_id': ObjectId(document_id)},
            {'$set': {'disponible': disponible}}
        )
    
    def find_by_type(self, type_doc):
        return list(mongo.db.documents.find({'type': type_doc}))

    def find_by_disponibilite(self, disponible):
        return list(mongo.db.documents.find({'disponible': disponible}))

    def count_total(self):
        return mongo.db.documents.count_documents({})

    def count_disponibles(self):
        return mongo.db.documents.count_documents({'disponible': True})

    def count_empruntes(self):
        return mongo.db.documents.count_documents({'disponible': False})

    def count_par_type(self):
        pipeline = [
            {'$group': {
                '_id': '$type',
                'count': {'$sum': 1}
            }}
        ]
        result = mongo.db.documents.aggregate(pipeline)
        return {doc['_id']: doc['count'] for doc in result}

    def get_types(self):
        return mongo.db.documents.distinct('type')