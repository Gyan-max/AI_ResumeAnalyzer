import React, { useState } from 'react';
import ResumeUploader from './components/ResumeUploader';
import JobDescriptionInput from './components/JobDescriptionInput';
import ResultsDisplay from './components/ResultsDisplay';
import Header from './components/Header';
import axios from 'axios';
import './App.css';

// Get API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);

  const handleResumeUpload = (acceptedFile) => {
    setFile(acceptedFile[0]);
    setError('');
  };

  const handleJobDescriptionChange = (text) => {
    setJobDescription(text);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please upload a resume file');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setIsLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('job_description', jobDescription);

    try {
      const response = await axios.post(`${API_URL}/api/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setAnalysis(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Error analyzing resume. Please try again later.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8 fade-in">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Your Resume</h2>
          <ResumeUploader onUpload={handleResumeUpload} />
          
          {file && (
            <p className="mt-4 text-green-600">
              ✅ File uploaded: {file.name}
            </p>
          )}
          
          <div className="mt-8">
            <JobDescriptionInput 
              value={jobDescription} 
              onChange={handleJobDescriptionChange} 
            />
          </div>
          
          {error && (
            <p className="mt-4 text-red-600">
              {error}
            </p>
          )}
          
          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : 'Analyze Resume'}
          </button>
        </div>
        
        {analysis && (
          <ResultsDisplay results={analysis} />
        )}
      </main>
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p> {new Date().getFullYear()} AI Resume Analyzer</p>
        {process.env.REACT_APP_ENVIRONMENT === 'development' && (
          <p className="text-xs mt-2 text-gray-400">Development Mode</p>
        )}
      </footer>
    </div>
  );
}

export default App;
