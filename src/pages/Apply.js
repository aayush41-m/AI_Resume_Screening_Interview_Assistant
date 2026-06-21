import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getJob, submitApplication } from '../services/api';

function Apply() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadJob();
    // eslint-disable-next-line
  }, [jobId]);

  const loadJob = async () => {
    setLoading(true);
    try {
      const data = await getJob(jobId);
      setJob(data);
    } catch (err) {
      setJob(null);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !file) {
      setError('Please fill all fields and upload your resume.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const data = await submitApplication(name, email, phone, jobId, file);
      if (data.error) {
        setError(data.error);
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Job Not Found</h2>
          <p className="text-gray-500">This job posting may have been removed or the link is invalid.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-xl shadow p-8 text-center max-w-md">
          <div className="text-5xl mb-4">✓</div>
          <h2 className="text-xl font-bold text-green-700 mb-2">Application Submitted!</h2>
          <p className="text-gray-500">
            Thank you, {name}. Your application for <strong>{job.title}</strong> has been received.
            {email && ' We will get back to you via email.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-blue-900 text-white rounded-t-xl p-6">
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <p className="text-blue-200 mt-2 text-sm">{job.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-b-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-bold text-blue-900">Apply for this position</h2>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>
          )}

          <div>
            <label className="text-sm font-bold text-gray-600 block mb-1">Full Name</label>
            <input
              type="text"
              className="w-full border rounded-lg px-4 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-600 block mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-4 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-600 block mb-1">Phone Number</label>
            <input
              type="tel"
              className="w-full border rounded-lg px-4 py-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-600 block mb-1">Resume (PDF/DOCX)</label>
            <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center">
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                id="resumeFile"
              />
              <label
                htmlFor="resumeFile"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 inline-block"
              >
                {file ? file.name : 'Choose File'}
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Submitting your application...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Apply;