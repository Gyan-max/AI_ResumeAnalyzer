import React from 'react';

function ResultsDisplay({ results }) {
  const { 
    match_percentage, 
    extracted_skills, 
    missing_skills, 
    improvement_suggestions, 
    summary 
  } = results;

  // Function to determine the color of the match percentage
  const getMatchColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Function to get the circular progress background class
  const getCircularProgressClass = (percentage) => {
    if (percentage >= 80) return 'bg-green-600';
    if (percentage >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Analysis Results</h2>
      
      <div className="flex flex-col md:flex-row">
        {/* Match Score Section */}
        <div className="md:w-1/3 mb-8 md:mb-0 flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-4 text-center">Job Match Score</h3>
          
          <div className="relative h-48 w-48">
            <div className="h-full w-full rounded-full bg-gray-200 absolute"></div>
            <div 
              className={`h-full w-full rounded-full absolute transition-all duration-1000 ease-out`}
              style={{
                background: `conic-gradient(${getCircularProgressClass(match_percentage)} ${match_percentage}%, transparent 0)`,
                transform: 'rotate(-90deg)'
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-4xl font-bold ${getMatchColor(match_percentage)}`}>
                {match_percentage}%
              </span>
            </div>
          </div>
          
          <p className="text-gray-600 mt-4 text-center max-w-xs">
            {match_percentage >= 80 
              ? 'Great match! Your resume aligns well with this job.' 
              : match_percentage >= 60 
                ? 'Good match! With some improvements, your resume could be stronger for this position.' 
                : 'Your resume needs significant improvements to match this job description.'}
          </p>
        </div>
        
        {/* Skills Section */}
        <div className="md:w-2/3 md:pl-8">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Summary</h3>
            <p className="text-gray-700">{summary}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Skills Found</h3>
              <div className="space-y-2">
                {extracted_skills && extracted_skills.length > 0 ? (
                  extracted_skills.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-gray-700">{skill}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No skills were identified in your resume.</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">Missing Skills</h3>
              <div className="space-y-2">
                {missing_skills && missing_skills.length > 0 ? (
                  missing_skills.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-red-600 mr-2">✗</span>
                      <span className="text-gray-700">{skill}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No missing skills identified.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Improvement Suggestions */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-xl font-semibold mb-4">Improvement Suggestions</h3>
        <ul className="space-y-3">
          {improvement_suggestions && improvement_suggestions.length > 0 ? (
            improvement_suggestions.map((suggestion, index) => (
              <li key={index} className="flex">
                <span className="text-blue-600 mr-3">•</span>
                <span className="text-gray-700">{suggestion}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No improvement suggestions available.</p>
          )}
        </ul>
      </div>
      
      {/* Download Improved Resume Button - This would be implemented in a real application */}
      <div className="mt-8 flex justify-center">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200">
          Download Improved Resume Suggestions
        </button>
      </div>
    </div>
  );
}

export default ResultsDisplay;
