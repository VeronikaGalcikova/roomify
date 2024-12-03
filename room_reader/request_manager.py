import requests
from flask import current_app, session


# Class for managing REST API communication
class RequestManager:
    session: requests.session() = None
    base_url: str

    def __init__(self):
        self.base_url = current_app.config.get("BACKEND_BASE_URL")
        self.session = requests.session()  # Create a session for making HTTP requests
        self.session.headers.update({"Content-Type": "application/json"})

    def request(self, method, endpoint, data=None) -> tuple:
        """
        Send an HTTP request to the specified endpoint.

        Args:
            method (str): The HTTP method (GET, POST, PUT, DELETE, etc.).
            endpoint (str): The endpoint to send the request to.
            data (dict): Optional request payload data.

        Returns:
            dict: The response JSON data.
        """
        if self.session is None:
            # Raise an error if the session is missing
            raise requests.exceptions.HTTPError("Session missing")

        # Check if the token is set, if not, perform a login
        if not session.get(current_app.config.get('ACCESS_TOKEN_KEY', '')):
            self.login()

        # Set the Authorization header using the token
        self.session.headers.update({
            "Authorization": f"Bearer {session.get(current_app.config.get('ACCESS_TOKEN_KEY'), '')}"
        })

        # Send the request to the backend API
        response = self.session.request(method, f"{self.base_url}{endpoint}", json=data)

        if response.status_code == 401:
            # Update access token and perform request again
            self.login()
            return self.request(method=method, endpoint=endpoint, data=data)

        # Return the response content and status code as a tuple
        return response.json(), response.status_code

    def login(self):
        """Perform a login request to obtain token and store it to session."""
        print(f"{self.base_url}{current_app.config.get('LOGIN_URL')}",
              {"username": current_app.config.get("ROOM_READER_USER"),
               "password": current_app.config.get("ROOM_READER_PASSWORD")})
        response = self.session.request("POST",
                                        f"{self.base_url}{current_app.config.get('LOGIN_URL')}",
                                        json={"username": current_app.config.get("ROOM_READER_USER"),
                                              "password": current_app.config.get("ROOM_READER_PASSWORD")})
        print(response.json())
        # Store the token
        session[current_app.config.get("ACCESS_TOKEN_KEY")] = response.json().get("access", "")

    def verify_room_access(self, data: dict) -> tuple:
        """
        Verify that the specified card has access to the room.

        Args:
            data (dict): Dict containing uid of the card and uid of the room reader.

        Returns:
            dict: The response JSON data.
        """
        return self.request("POST",
                            f"{current_app.config.get('VERIFY_URL')}",
                            data=data)
