import pytest
from flask import Flask, json
from unittest.mock import Mock, patch
from bson import ObjectId
# from app.routes import documents, emprunts, abonnes
from routes import documents, emprunts, abonnes

# Fixtures
@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(documents.bp)
    app.register_blueprint(emprunts.bp)
    app.register_blueprint(abonnes.bp)
    return app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def sample_document():
    return {
        '_id': str(ObjectId()),
        'titre': 'Le Petit Prince',
        'auteur': 'Antoine de Saint-Exupéry',
        'type': 'livre',
        'disponible': True
    }

@pytest.fixture
def sample_abonne():
    return {
        '_id': str(ObjectId()),
        'nom': 'Dupont',
        'prenom': 'Jean',
        'email': 'jean.dupont@email.com'
    }

# Document Tests
class TestDocuments:
    def test_get_documents_success(self, client):
        with patch('app.services.document_service.DocumentService.find_all') as mock_find_all:
            mock_find_all.return_value = [
                {'_id': ObjectId(), 'titre': 'Test Book', 'auteur': 'Test Author', 'type': 'livre'}
            ]
            response = client.get('/documents')
            assert response.status_code == 200
            data = json.loads(response.data)
            assert isinstance(data, list)
            assert len(data) > 0
            assert 'titre' in data[0]

    def test_get_documents_search(self, client):
        with patch('app.services.document_service.DocumentService.search') as mock_search:
            mock_search.return_value = [
                {'_id': ObjectId(), 'titre': 'Search Result', 'auteur': 'Author', 'type': 'livre'}
            ]
            response = client.get('/documents?search=test')
            assert response.status_code == 200
            data = json.loads(response.data)
            assert isinstance(data, list)
            assert len(data) > 0

    def test_create_document_success(self, client, sample_document):
        with patch('app.services.document_service.DocumentService.create') as mock_create:
            mock_create.return_value = ObjectId()
            response = client.post('/documents',
                                 json={
                                     'titre': sample_document['titre'],
                                     'auteur': sample_document['auteur'],
                                     'type': sample_document['type']
                                 })
            assert response.status_code == 201
            data = json.loads(response.data)
            assert 'id' in data

    def test_create_document_missing_fields(self, client):
        response = client.post('/documents', json={'titre': 'Test Book'})
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
        assert 'required_fields' in data

    def test_update_document_success(self, client, sample_document):
        with patch('app.services.document_service.DocumentService.update') as mock_update:
            doc_id = sample_document['_id']
            response = client.put(f'/documents/{doc_id}',
                                json={'titre': 'Updated Title'})
            assert response.status_code == 200
            data = json.loads(response.data)
            assert data['message'] == 'Document mis à jour avec succès'

# Emprunt Tests
class TestEmprunts:
    def test_creer_emprunt_success(self, client):
        with patch('app.services.emprunt_service.EmpruntService.creer_emprunt') as mock_create:
            mock_create.return_value = ObjectId()
            response = client.post('/emprunts',
                                 json={
                                     'abonne_id': str(ObjectId()),
                                     'document_id': str(ObjectId())
                                 })
            assert response.status_code == 201
            data = json.loads(response.data)
            assert 'id' in data

    def test_creer_emprunt_invalid_data(self, client):
        response = client.post('/emprunts', json={})
        assert response.status_code == 500

    def test_enregistrer_retour_success(self, client):
        with patch('app.services.emprunt_service.EmpruntService.enregistrer_retour') as mock_return:
            emprunt_id = str(ObjectId())
            response = client.post(f'/emprunts/{emprunt_id}/retour')
            assert response.status_code == 200
            data = json.loads(response.data)
            assert data['message'] == 'Retour enregistré'

    def test_get_retards_success(self, client):
        with patch('app.services.emprunt_service.EmpruntService.get_emprunts_en_retard') as mock_retards:
            mock_retards.return_value = [
                {'_id': ObjectId(), 'abonne_id': ObjectId(), 'document_id': ObjectId(), 'date_retour_prevue': '2024-03-01'}
            ]
            response = client.get('/emprunts/en-retard')
            assert response.status_code == 200
            data = json.loads(response.data)
            assert isinstance(data, list)

# Abonné Tests
class TestAbonnes:
    def test_get_abonnes_success(self, client):
        with patch('app.services.abonne_service.AbonneService.find_all') as mock_find_all:
            mock_find_all.return_value = [
                {'_id': ObjectId(), 'nom': 'Dupont', 'prenom': 'Jean', 'email': 'jean@email.com'}
            ]
            response = client.get('/abonnes')
            assert response.status_code == 200
            data = json.loads(response.data)
            assert isinstance(data, list)
            assert len(data) > 0

    def test_create_abonne_success(self, client, sample_abonne):
        with patch('app.services.abonne_service.AbonneService.create') as mock_create:
            mock_create.return_value = ObjectId()
            response = client.post('/abonnes',
                                 json={
                                     'nom': sample_abonne['nom'],
                                     'prenom': sample_abonne['prenom'],
                                     'email': sample_abonne['email']
                                 })
            assert response.status_code == 201
            data = json.loads(response.data)
            assert 'id' in data

    def test_get_abonne_not_found(self, client):
        with patch('app.services.abonne_service.AbonneService.find_by_id') as mock_find:
            mock_find.return_value = None
            response = client.get(f'/abonnes/{str(ObjectId())}')
            assert response.status_code == 404
            data = json.loads(response.data)
            assert 'error' in data

    def test_update_abonne_success(self, client, sample_abonne):
        with patch('app.services.abonne_service.AbonneService.update') as mock_update:
            abonne_id = sample_abonne['_id']
            response = client.put(f'/abonnes/{abonne_id}',
                                json={'nom': 'Updated Name'})
            assert response.status_code == 200
            data = json.loads(response.data)
            assert data['message'] == 'Abonné mis à jour'

    def test_delete_abonne_success(self, client):
        with patch('app.services.abonne_service.AbonneService.delete') as mock_delete:
            abonne_id = str(ObjectId())
            response = client.delete(f'/abonnes/{abonne_id}')
            assert response.status_code == 200
            data = json.loads(response.data)
            assert data['message'] == 'Abonné supprimé'