import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Copy, Check, ExternalLink, Calendar, FileText } from 'lucide-react';
import { createJob, getAllJobs } from '../services/api';
import PageHeader from '../components/PageHeader';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { TextArea } from '../components/ui/Input';
import JobRoleSelect from '../components/JobRoleSelect';
import EmptyState from '../components/ui/EmptyState';

function CreateJob() {
  const [title, setTitle] = useState('Software Engineer');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdJob, setCreatedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await getAllJobs();
      setJobs(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async () => {
    if (!description.trim()) {
      alert('Please add a job description');
      return;
    }
    setLoading(true);
    try {
      const data = await createJob(title, description);
      setCreatedJob(data);
      setDescription('');
      await loadJobs();
    } catch (e) {
      alert('Error creating job: ' + e.message);
    }
    setLoading(false);
  };

  const copyLink = async (jobId, id) => {
    const link = `${window.location.origin}/apply/${jobId}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(id || jobId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="p-6 md:p-8 min-h-screen animate-fade-in" style={{ background: '#0f0a2e' }}>
      <PageHeader
        title="Job Postings"
        subtitle="Create job postings and share apply links with candidates"
        icon={Briefcase}
      />

      {/* Create form */}
      <Card className="mb-6">
        <CardHeader
          title="Create New Job"
          subtitle="Pick a role and add a description"
          icon={Plus}
        />
        <div className="grid grid-cols-1 gap-4">
          <JobRoleSelect value={title} onChange={setTitle} icon={Briefcase} />
          <TextArea
            label="Job Description"
            placeholder="Describe the role, responsibilities, required skills, experience level..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-32 resize-none"
          />
        </div>
        <Button
          variant="primary"
          size="lg"
          icon={Plus}
          loading={loading}
          onClick={handleCreate}
          className="w-full mt-5"
        >
          {loading ? 'Creating...' : 'Create Job & Get Link'}
        </Button>
      </Card>

      {/* Success */}
      {createdJob && (
        <div className="mb-6 animate-slide-up">
          <div
            className="rounded-2xl p-5 flex items-start gap-4"
            style={{
              background: 'rgba(34,197,94,0.10)',
              border: '1px solid rgba(34,197,94,0.30)',
              boxShadow: '0 4px 20px rgba(34,197,94,0.10)',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl text-white flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
            >
              <Check size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold mb-1" style={{ color: '#22c55e' }}>Job Created Successfully!</h3>
              <p className="text-sm text-purple-300 mb-3">Share this link with candidates:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/apply/${createdJob.id}`}
                  className="flex-1 rounded-lg px-3 py-2 text-sm text-white"
                  style={{
                    background: 'rgba(15,10,46,0.60)',
                    border: '1px solid rgba(34,197,94,0.30)',
                  }}
                />
                <Button
                  variant="success"
                  size="md"
                  icon={Copy}
                  onClick={() => copyLink(createdJob.id, 'new')}
                >
                  {copiedId === 'new' ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All jobs */}
      <Card>
        <CardHeader
          title="All Job Postings"
          subtitle={`${jobs.length} active posting${jobs.length === 1 ? '' : 's'}`}
          icon={Briefcase}
        />
        {jobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No jobs created yet"
            description="Create your first job posting to start collecting applications."
          />
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="group rounded-xl p-4 transition-all"
                style={{
                  background: 'rgba(15,10,46,0.40)',
                  border: '1px solid rgba(139,92,246,0.20)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(139,92,246,0.10)';
                  e.currentTarget.style.borderColor = 'rgba(139,92,246,0.40)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(15,10,46,0.40)';
                  e.currentTarget.style.borderColor = 'rgba(139,92,246,0.20)';
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(139,92,246,0.20)', color: '#a78bfa' }}
                    >
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-white">{job.title}</p>
                      <p className="text-sm text-purple-300 line-clamp-2 mt-1">{job.description}</p>
                      <p className="text-xs text-purple-400 mt-2 inline-flex items-center gap-1">
                        <Calendar size={12} />
                        Created {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'recently'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={ExternalLink}
                      onClick={() => window.open(`/apply/${job.id}`, '_blank')}
                    >
                      Preview
                    </Button>
                    <Button
                      variant={copiedId === job.id ? 'success' : 'primary'}
                      size="sm"
                      icon={copiedId === job.id ? Check : Copy}
                      onClick={() => copyLink(job.id, job.id)}
                    >
                      {copiedId === job.id ? 'Copied!' : 'Copy Link'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default CreateJob;
