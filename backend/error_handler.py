"""
Error handling utilities for the Resume Analyzer backend.
"""
import traceback
import logging
from flask import jsonify

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

class APIError(Exception):
    """Base exception class for API errors."""
    def __init__(self, message, status_code=500, payload=None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['error'] = self.message
        return rv

def handle_api_error(error):
    """Return a JSON response for API errors."""
    logger.error(f"API Error: {error.message}")
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

def handle_general_error(error):
    """Handle general exceptions by logging and returning a JSON response."""
    logger.error(f"Unexpected error: {str(error)}")
    logger.error(traceback.format_exc())
    response = jsonify({'error': 'An unexpected error occurred. Please try again later.'})
    response.status_code = 500
    return response

def register_error_handlers(app):
    """Register error handlers with the Flask app."""
    app.register_error_handler(APIError, handle_api_error)
    app.register_error_handler(Exception, handle_general_error)
