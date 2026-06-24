import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Mail,
  Phone,
  User,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Building2,
  MapPin,
  Calendar,
} from 'lucide-react';
import { getJob, submitApplication } from '../services/api';
import Button from '../components/ui/Button';
import { TextInput } from '../components/ui/Input';
import FileDropZone from '../components/FileDropZone';

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
      setError(err.message || 'Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#0f0a2e' }}
      >
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-3 text-purple-300">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: '#0f0a2e' }}
      >
        <div
          className="rounded-2xl p-8 text-center max-w-md animate-slide-up"
          style={{
            background: 'rgba(26,16,64,0.85)',
            border: '1px solid rgba(139,92,246,0.25)',
            boxShadow: '0 10px 40px rgba(139,92,246,0.20)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div
            className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(239,68,68,0.20)', color: '#ef4444' }}
          >
            <AlertCircle size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Job Not Found</h2>
          <p className="text-sm text-purple-300">
            This job posting may have been removed or the link is invalid.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: '#0f0a2e' }}
      >
        <div
          className="rounded-2xl p-10 text-center max-w-md animate-slide-up"
          style={{
            background: 'rgba(26,16,64,0.85)',
            border: '1px solid rgba(34,197,94,0.30)',
            boxShadow: '0 10px 40px rgba(34,197,94,0.20)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-5 animate-pulse-slow"
            style={{ background: 'rgba(34,197,94,0.20)', color: '#22c55e' }}
          >
            <CheckCircle2 size={42} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Application Submitted!</h2>
          <p className="text-sm text-purple-300 leading-relaxed">
            Thank you, <span className="font-semibold text-white">{name}</span>. Your application for{' '}
            <span className="font-semibold text-white">{job.title}</span> has been received.
            {email && ' We will get back to you via email.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: '#0f0a2e' }}>
      <div className="max-w-2xl mx-auto animate-slide-up">
        {/* Job banner */}
        <div
          className="relative overflow-hidden rounded-t-2xl p-7"
          style={{
            background: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #3b0764 100%)',
            boxShadow: '0 10px 40px rgba(139,92,246,0.30)',
          }}
        >
          <div
            className="absolute top-0 -right-10 w-48 h-48 rounded-full filter blur-3xl opacity-30"
            style={{ background: '#ec4899' }}
          />
          <div className="relative">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 text-white"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
            >
              <Sparkles size={12} /> Open Position
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{job.title}</h1>
            <div className="flex flex-wrap gap-3 mt-3 text-purple-200 text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Building2 size={14} /> AI Recruiter
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} /> Remote
              </span>
              {job.created_at && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} /> Posted {new Date(job.created_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Job description */}
        {job.description && (
          <div
            className="border-x px-7 py-5"
            style={{
              background: 'rgba(26,16,64,0.60)',
              borderColor: 'rgba(139,92,246,0.20)',
            }}
          >
            <p className="text-sm text-purple-200 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>
        )}

        {/* Apply form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-b-2xl p-7 space-y-4"
          style={{
            background: 'rgba(26,16,64,0.85)',
            border: '1px solid rgba(139,92,246,0.25)',
            borderTopWidth: 0,
            boxShadow: '0 10px 40px rgba(139,92,246,0.20)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="flex items-center gap-2.5 mb-1">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.20)', color: '#a78bfa' }}
            >
              <Send size={16} />
            </div>
            <h2 className="text-lg font-bold text-white">Apply for this position</h2>
          </div>

          {error && (
            <div
              className="flex items-start gap-2 px-4 py-3 rounded-lg text-sm"
              style={{
                background: 'rgba(239,68,68,0.15)',
                color: '#fca5a5',
                border: '1px solid rgba(239,68,68,0.30)',
              }}
            >
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <TextInput
            label="Full Name"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={User}
            required
          />
          <TextInput
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            required
          />
          <TextInput
            type="tel"
            label="Phone Number"
            placeholder="+91 XXXXX XXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            icon={Phone}
            required
          />

          <FileDropZone
            accept=".pdf,.docx,.txt"
            files={file ? [file] : []}
            onFiles={(files) => setFile(files[0] || null)}
            label="Resume (PDF/DOCX)"
            hint="PDF, DOCX, or TXT"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={submitting}
            icon={Send}
            className="w-full mt-2"
          >
            {submitting ? 'Submitting your application...' : 'Submit Application'}
          </Button>

          <p className="text-xs text-purple-400 text-center">
            By applying, you agree to share your resume with the hiring team.
          </p>
        </form>
      </div>
    </div>
  );
}

export default Apply;