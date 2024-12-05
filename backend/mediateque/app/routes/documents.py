from flask import Blueprint, request, jsonify
from app.services.document_service import DocumentService
from bson import ObjectId

bp = Blueprint('documents', __name__)
service = DocumentService()

@bp.route('/documents', methods=['GET'])
def get_documents():
    try:
        search_query = request.args.get('search')
        type_doc = request.args.get('type')  # Pour filtrer par type
        disponible = request.args.get('disponible')  # Pour filtrer par disponibilité
        
        if search_query:
            documents = service.search(search_query)
        elif type_doc:
            documents = service.find_by_type(type_doc)
        elif disponible:
            documents = service.find_by_disponibilite(disponible.lower() == 'true')
        else:
            documents = service.find_all()
            
        return jsonify([{**doc, '_id': str(doc['_id'])} for doc in documents])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/documents/<id>', methods=['GET'])
def get_document(id):
    try:
        document = service.find_by_id(id)
        if document:
            return jsonify({**document, '_id': str(document['_id'])})
        return jsonify({'error': 'Document non trouvé'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/documents', methods=['POST'])
def create_document():
    try:
        data = request.get_json()
        required_fields = ['titre', 'auteur', 'type']
        
        # Vérification des champs requis
        if not all(field in data for field in required_fields):
            return jsonify({
                'error': 'Champs requis manquants',
                'required_fields': required_fields
            }), 400
            
        doc_id = service.create(data)
        return jsonify({
            'message': 'Document créé avec succès',
            'id': str(doc_id)
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/documents/<id>', methods=['PUT'])
def update_document(id):
    try:
        data = request.get_json()
        service.update(id, data)
        return jsonify({'message': 'Document mis à jour avec succès'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/documents/<id>', methods=['DELETE'])
def delete_document(id):
    try:
        service.delete(id)
        return jsonify({'message': 'Document supprimé avec succès'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/documents/<id>/disponibilite', methods=['PUT'])
def update_disponibilite(id):
    try:
        data = request.get_json()
        if 'disponible' not in data:
            return jsonify({'error': 'Le champ disponible est requis'}), 400
            
        service.update_disponibilite(id, data['disponible'])
        return jsonify({'message': 'Disponibilité mise à jour avec succès'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/documents/stats', methods=['GET'])
def get_stats():
    try:
        return jsonify({
            'total': service.count_total(),
            'disponibles': service.count_disponibles(),
            'empruntes': service.count_empruntes(),
            'par_type': service.count_par_type()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/documents/types', methods=['GET'])
def get_types():
    try:
        return jsonify(service.get_types())
    except Exception as e:
        return jsonify({'error': str(e)}), 500