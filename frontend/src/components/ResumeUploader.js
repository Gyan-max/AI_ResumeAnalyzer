import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function ResumeUploader({ onUpload }) {
  const onDrop = useCallback(acceptedFiles => {
    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center">
        <svg 
          className="w-12 h-12 text-gray-400 mb-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        {isDragActive ? (
          <p className="text-blue-500">Drop your resume here</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">Drag & drop your resume here, or click to select</p>
            <p className="text-sm text-gray-500">Supported formats: PDF, DOCX</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeUploader;
