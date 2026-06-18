import React, { useState } from 'react';

function Upload() {
  const [files, setFiles] = useState([]);
  const [jobDescription, setJobDescription] = useState('');

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Upload Resumes</h2>

      {/* Job Description */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h3 className="text-lg font-bold text-blue-900 mb-2">Job Description</h3>
        <textarea
          className="w-full border rounded-lg p-3 h-32 text-gray-700"
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      {/* File Upload */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h3 className="text-lg font-bold text-blue-900 mb-2">Upload Resume Files</h3>
        <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center">
          <p className="text-gray-400 mb-3">Drag & Drop or Click to Upload</p>
          <input
            type="file"
            multiple
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700"
          >
            Choose Files
          </label>
        </div>

        {/* Uploaded Files List */}
        {files.length > 0 && (
          <div className="mt-4">
            <h4 className="font-bold text-gray-600 mb-2">Selected Files:</h4>
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-700 py-1">
                <span>📄</span>
                <span>{file.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-bold hover:bg-blue-700">
        Screen Resumes 🚀
      </button>
    </div>
  )
}

export default Upload;