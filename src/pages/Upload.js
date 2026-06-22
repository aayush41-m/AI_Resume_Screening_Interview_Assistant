import React, { useState } from 'react';
import { screenResume, bulkUploadResumes } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Upload() {
  const [mode, setMode] = useState('single');

  const [files, setFiles] = useState([]);
  const [jobDescription, setJobDescription] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [jobRole, setJobRole] = useState('Software Engineer');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [bulkFiles, setBulkFiles] = useState([]);
  const [bulkNames, setBulkNames] = useState([]);
  const [bulkResult, setBulkResult] = useState(null);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleBulkFileChange = (e) => {
    const selected = [...e.target.files];
    setBulkFiles(selected);
    setBulkNames(selected.map((f) => f.name.replace(/\.[^/.]+$/, '')));
  };

  const updateBulkName = (index, value) => {
    const updated = [...bulkNames];
    updated[index] = value;
    setBulkNames(updated);
  };

 const handleScreen = async () => {
    if (files.length === 0 || !jobDescription.trim() || !candidateName.trim()) {
      alert('Please add candidate name, job description, and upload a resume file');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await screenResume(candidateName, candidateEmail, jobRole, jobDescription, files[0]);
      if (data.error) {
        alert(data.error);
      } else {
        setResult(data);
      }
    } catch (error) {
      alert('Error screening resume: ' + error.message);
    }
    setLoading(false);
  };

  const handleBulkScreen = async () => {
    if (bulkFiles.length === 0 || !jobDescription.trim()) {
      alert('Please add job description and upload resume files');
      return;
    }

    setLoading(true);
    setBulkResult(null);

    try {
      const namesString = bulkNames.join(',');
      const data = await bulkUploadResumes(namesString, jobRole, jobDescription, bulkFiles);
      setBulkResult(data);
    } catch (error) {
      alert('Error screening resumes: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Upload Resumes</h2>

      {/* Mode Switch */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('single')}
          className={
            'px-4 py-2 rounded-lg font-bold text-sm ' +
            (mode === 'single' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border')
          }
        >
          Single Resume
        </button>
        <button
          onClick={() => setMode('bulk')}
          className={
            'px-4 py-2 rounded-lg font-bold text-sm ' +
            (mode === 'bulk' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border')
          }
        >
          Bulk Upload (Multiple Resumes)
        </button>
      </div>

      {/* Job Role + Job Description (shared) */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h3 className="text-lg font-bold text-blue-900 mb-2">Job Role</h3>
       <select
            className="w-full border rounded-lg p-3 text-gray-700"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
          >
            <optgroup label="Software Development">
              <option>Software Engineer</option>
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
              <option>Full Stack Developer</option>
              <option>Mobile App Developer (Android)</option>
              <option>Mobile App Developer (iOS)</option>
              <option>React Developer</option>
              <option>Java Developer</option>
              <option>Python Developer</option>
              <option>.NET Developer</option>
              <option>PHP Developer</option>
              <option>Game Developer</option>
            </optgroup>
            <optgroup label="Data & AI">
              <option>Data Analyst</option>
              <option>Data Scientist</option>
              <option>Data Engineer</option>
              <option>Machine Learning Engineer</option>
              <option>AI Engineer</option>
              <option>Business Intelligence Analyst</option>
            </optgroup>
            <optgroup label="DevOps & Infrastructure">
              <option>DevOps Engineer</option>
              <option>Cloud Engineer</option>
              <option>Site Reliability Engineer (SRE)</option>
              <option>System Administrator</option>
              <option>Network Engineer</option>
            </optgroup>
            <optgroup label="Quality & Testing">
              <option>QA Engineer</option>
              <option>Automation Test Engineer</option>
              <option>Manual Tester</option>
            </optgroup>
            <optgroup label="Design">
              <option>UI/UX Designer</option>
              <option>Graphic Designer</option>
              <option>Product Designer</option>
            </optgroup>
            <optgroup label="Management">
              <option>Product Manager</option>
              <option>Project Manager</option>
              <option>Scrum Master</option>
              <option>Engineering Manager</option>
              <option>Technical Lead</option>
            </optgroup>
            <optgroup label="Security & Database">
              <option>Cybersecurity Analyst</option>
              <option>Database Administrator (DBA)</option>
              <option>Security Engineer</option>
            </optgroup>
            <optgroup label="Other Tech Roles">
              <option>Blockchain Developer</option>
              <option>IT Support Engineer</option>
              <option>Technical Writer</option>
              <option>Solutions Architect</option>
            </optgroup>
            <optgroup label="Fire & Safety">
            <option>Fire Safety Officer</option>
            <option>Fire and Safety Engineer</option>
            <option>EHS Officer (Environment, Health & Safety)</option>
            <option>Industrial Safety Officer</option>
            <option>HSE Manager (Health, Safety & Environment)</option>
            <option>Safety Inspector</option>
            <option>Occupational Health & Safety Specialist</option>
          </optgroup>
          </select>

        <h3 className="text-lg font-bold text-blue-900 mb-2">Job Description</h3>
        <textarea
          className="w-full border rounded-lg p-3 h-32 text-gray-700"
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      {mode === 'single' ? (
        <>
          {/* SINGLE MODE */}
          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Candidate Name</h3>
            <input
              type="text"
              className="w-full border rounded-lg p-3 text-gray-700 mb-4"
              placeholder="Enter candidate name..."
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
            />

            <h3 className="text-lg font-bold text-blue-900 mb-2">Candidate Email (Optional)</h3>
            <input
              type="email"
              className="w-full border rounded-lg p-3 text-gray-700"
              placeholder="candidate@example.com"
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
            />
            <p className="text-gray-400 text-xs mt-1">If provided, candidate will receive an email with their result.</p>
          </div>

          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Upload Resume File</h3>
            <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center">
              <p className="text-gray-400 mb-3">Click to Upload</p>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
              />
              <label
                htmlFor="fileInput"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700"
              >
                Choose File
              </label>
            </div>

            {files.length > 0 && (
              <div className="mt-4">
                <h4 className="font-bold text-gray-600 mb-2">Selected File:</h4>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700 py-1">
                    <span>{file.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleScreen}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'AI is analyzing...' : 'Screen Resume'}
          </button>

          {result && (
            <div className="bg-white rounded-xl shadow p-6 mt-6">
              <h3 className="text-xl font-bold text-blue-900 mb-4">AI Screening Result</h3>

              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl font-bold text-blue-600">{result.score}</div>
                <div className="text-gray-500">/ 100</div>
                <span
                  className={
                    'ml-auto px-4 py-2 rounded-full font-bold ' +
                    (result.recommendation === 'Shortlisted'
                      ? 'bg-green-100 text-green-700'
                      : result.recommendation === 'Rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700')
                  }
                >
                  {result.recommendation}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{result.summary}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-bold text-green-700 mb-2">Strengths</h4>
                  {result.strengths &&
                    result.strengths.map((s, i) => (
                      <p key={i} className="text-gray-600 text-sm">- {s}</p>
                    ))}
                </div>
                <div>
                  <h4 className="font-bold text-red-700 mb-2">Missing Skills</h4>
                  {result.missing_skills &&
                    result.missing_skills.map((s, i) => (
                      <p key={i} className="text-gray-600 text-sm">- {s}</p>
                    ))}
                </div>
              </div>

              <button
                onClick={() => navigate('/candidates')}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                View All Candidates
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          {/* BULK MODE */}
          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Upload Multiple Resume Files</h3>
            <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center">
              <p className="text-gray-400 mb-3">Select multiple PDF/DOCX files</p>
              <input
                type="file"
                multiple
                accept=".pdf,.docx,.txt"
                onChange={handleBulkFileChange}
                className="hidden"
                id="bulkFileInput"
              />
              <label
                htmlFor="bulkFileInput"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700"
              >
                Choose Files
              </label>
            </div>

            {bulkFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="font-bold text-gray-600 mb-2">
                  {bulkFiles.length} file(s) selected — Edit candidate names below:
                </h4>
                {bulkFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 py-2 border-b">
                    <span className="text-gray-400 text-sm w-48 truncate">{file.name}</span>
                    <input
                      type="text"
                      className="flex-1 border rounded-lg px-3 py-1 text-sm"
                      value={bulkNames[index] || ''}
                      onChange={(e) => updateBulkName(index, e.target.value)}
                      placeholder="Candidate name"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleBulkScreen}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'AI is analyzing all resumes...' : `Screen ${bulkFiles.length} Resumes`}
          </button>

          {bulkResult && (
            <div className="bg-white rounded-xl shadow p-6 mt-6">
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                Bulk Screening Results ({bulkResult.total} resumes)
              </h3>

              <div className="space-y-3">
                {bulkResult.results.map((r, i) => (
                  <div key={i} className="border rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-800">{r.candidate_name}</p>
                      <p className="text-gray-400 text-xs">{r.filename}</p>
                      {r.error && <p className="text-red-500 text-sm">{r.error}</p>}
                    </div>
                    {r.status === 'success' ? (
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-blue-600">{r.score}/100</span>
                        <span
                          className={
                            'px-3 py-1 rounded-full text-sm font-bold ' +
                            (r.recommendation === 'Shortlisted'
                              ? 'bg-green-100 text-green-700'
                              : r.recommendation === 'Rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700')
                          }
                        >
                          {r.recommendation}
                        </span>
                      </div>
                    ) : (
                      <span className="text-red-500 text-sm font-bold">Failed</span>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/candidates')}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 mt-6"
              >
                View All Candidates
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Upload;