from flask import Blueprint, request, jsonify
from app.services.abonne_service import AbonneService
from bson import ObjectId

bp = Blueprint('abonnes', __name__)
service = AbonneService()

@bp.route('/abonnes', methods=['GET'])
def get_abonnes():
    try:
        abonnes = service.find_all()
        return jsonify([{**abonne, '_id': str(abonne['_id'])} for abonne in abonnes])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/abonnes/<id>', methods=['GET'])
def get_abonne(id):
    try:
        abonne = service.find_by_id(id)
        if abonne:
            return jsonify({**abonne, '_id': str(abonne['_id'])})
        return jsonify({'error': 'Abonné non trouvé'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/abonnes', methods=['POST'])
def create_abonne():
    try:
        data = request.get_json()
        abonne_id = service.create(data)
        return jsonify({'id': str(abonne_id)}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/abonnes/<id>', methods=['PUT'])
def update_abonne(id):
    try:
        data = request.get_json()
        service.update(id, data)
        return jsonify({'message': 'Abonné mis à jour'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/abonnes/<id>', methods=['DELETE'])
def delete_abonne(id):
    try:
        service.delete(id)
        return jsonify({'message': 'Abonné supprimé'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500