from flask import Blueprint, request, jsonify
from app.services.stats_service import StatsService

bp = Blueprint('stats', __name__)
service = StatsService()

@bp.route('/stats', methods=['GET'])
def get_stats():
    try:
        stats = service.get_stats()
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500