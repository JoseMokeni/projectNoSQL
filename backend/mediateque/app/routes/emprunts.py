from flask import Blueprint, request, jsonify
from app.services.emprunt_service import EmpruntService

bp = Blueprint('emprunts', __name__)
service = EmpruntService()

@bp.route('/emprunts', methods=['GET'])
def get_emprunts():
    try:
        emprunts = service.get_emprunts()
        return jsonify([{**e, '_id': str(e['_id'])} for e in emprunts])
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/emprunts', methods=['POST'])
def creer_emprunt():
    try:
        data = request.get_json()
        emprunt_id = service.creer_emprunt(
            data['abonne_id'],
            data['document_id']
        )
        return jsonify({'id': str(emprunt_id)}), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/emprunts/<id>/retour', methods=['POST'])
def enregistrer_retour(id):
    try:
        service.enregistrer_retour(id)
        return jsonify({'message': 'Retour enregistré'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/emprunts/en-retard', methods=['GET'])
def get_retards():
    try:
        retards = service.get_emprunts_en_retard()
        return jsonify([{**r, '_id': str(r['_id'])} for r in retards])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@bp.route('/emprunts/abonne/<id>', methods=['GET'])
def get_emprunts_abonne(id):
    try:
        emprunts = service.get_historique_emprunts_abonne(id)
        return jsonify([{**e, '_id': str(e['_id'])} for e in emprunts])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@bp.route('/emprunts/<id>', methods=['DELETE'])
def delete_emprunt(id):
    try:
        service.delete_emprunt(id)
        return jsonify({'message': 'Emprunt supprimé'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500