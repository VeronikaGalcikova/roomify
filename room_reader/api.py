from flask import request, Blueprint, jsonify
from request_manager import RequestManager

api_blueprint = Blueprint('api', __name__)


@api_blueprint.route('/verify', methods=['POST'])
def verify_card():
    try:
        # Get request body and check required fields
        data = request.get_json()
        if not data or 'card' not in data or 'room_reader' not in data:
            return jsonify({"detail": "Both 'card' and 'room_reader' fields are required."}), 400

        # Send a request to the backend API via RequestManager and return its response to the client
        request_manager = RequestManager()
        response_data, status_code = request_manager.verify_room_access(data=data)

        return jsonify(response_data), status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
