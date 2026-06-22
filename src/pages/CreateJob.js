import React, { useState, useEffect } from 'react';
import { createJob, getAllJobs } from '../services/api';

function CreateJob() {
  const [title, setTitle] = useState('Software Engineer');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdJob, setCreatedJob] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const data = await getAllJobs();
    setJobs(data);
  };

  const handleCreate = async () => {
    if (!description.trim()) {
      alert('Please add a job description');
      return;
    }
    setLoading(true);
    const data = await createJob(title, description);
    setCreatedJob(data);
    setDescription('');
    await loadJobs();
    setLoading(false);
  };

  const copyLink = (jobId) => {
    const link = `${window.location.origin}/apply/${jobId}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Create Job Posting</h2>

      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h3 className="text-lg font-bold text-blue-900 mb-2">Job Role</h3>
        <select
          className="w-full border rounded-lg p-3 text-gray-700 mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          placeholder="Describe the role, requirements, skills needed..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button
        onClick={handleCreate}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-bold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Job & Get Link'}
      </button>

      {createdJob && (
        <div className="bg-green-50 border border-green-300 rounded-xl p-6 mt-6">
          <h3 className="font-bold text-green-800 mb-2">Job Created Successfully!</h3>
          <p className="text-gray-600 text-sm mb-3">Share this link with candidates:</p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              className="flex-1 border rounded-lg px-3 py-2 text-sm bg-white"
              value={`${window.location.origin}/apply/${createdJob.id}`}
            />
            <button
              onClick={() => copyLink(createdJob.id)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
            >
              Copy Link
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-4 mt-8">
        <h3 className="text-lg font-bold text-blue-900 mb-4">All Job Postings</h3>
        {jobs.length === 0 ? (
          <p className="text-gray-400 text-sm">No jobs created yet.</p>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800">{job.title}</p>
                  <p className="text-gray-500 text-sm truncate w-96">{job.description}</p>
                </div>
                <button
                  onClick={() => copyLink(job.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700"
                >
                  Copy Apply Link
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateJob;