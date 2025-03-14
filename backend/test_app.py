import unittest
import json
import os
from app import app

class ResumeAnalyzerTestCase(unittest.TestCase):
    """Test cases for the Resume Analyzer API."""

    def setUp(self):
        """Set up test client and other test variables."""
        self.app = app.test_client()
        self.app.testing = True
        # Set mock OpenAI key for testing
        os.environ["OPENAI_API_KEY"] = "test_key"

    def test_health_check(self):
        """Test the health check endpoint."""
        response = self.app.get('/api/health')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'ok')
        
    def test_analyze_missing_resume(self):
        """Test the analyze endpoint with missing resume file."""
        response = self.app.post('/api/analyze', data={
            'job_description': 'This is a test job description'
        })
        self.assertEqual(response.status_code, 400)
        
    def test_analyze_missing_job_description(self):
        """Test the analyze endpoint with missing job description."""
        # Create a test file to upload
        with open('test_resume.txt', 'w') as f:
            f.write('This is a test resume')
            
        try:
            with open('test_resume.txt', 'rb') as test_file:
                response = self.app.post('/api/analyze', 
                                        data={
                                            'resume': (test_file, 'test_resume.pdf')
                                        })
                self.assertEqual(response.status_code, 400)
        finally:
            # Clean up the test file
            if os.path.exists('test_resume.txt'):
                os.remove('test_resume.txt')

if __name__ == '__main__':
    unittest.main()
