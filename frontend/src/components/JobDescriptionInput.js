import React from 'react';

function JobDescriptionInput({ value, onChange }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-800">Enter Job Description</h3>
      <p className="text-gray-600">Paste the job description to match your resume against</p>
      <textarea
        className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        placeholder="Paste job description here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      ></textarea>
    </div>
  );
}

export default JobDescriptionInput;
