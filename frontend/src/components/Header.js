import React from 'react';

function Header() {
  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold">AI Resume Analyzer</h1>
        <p className="mt-2 text-blue-100">
          Upload your resume and get AI-powered feedback to improve your job application
        </p>
      </div>
    </header>
  );
}

export default Header;
