import React, { useState } from 'react';
import { Upload as UploadIcon, Files, Sparkles, ArrowRight, User, Mail, FileText, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { screenResume, bulkUploadResumes } from '../services/api';
import PageHeader from '../components/PageHeader';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import { TextInput, TextArea } from '../components/ui/Input';
import FileDropZone from '../components/FileDropZone';
import JobRoleSelect from '../components/JobRoleSelect';

function Upload() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('single');

  // Single
  const [files, setFiles] = useState([]);
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobRole, setJobRole] = useState('Software Engineer');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Bulk
  const [bulkFiles, setBulkFiles] = useState([]);
  const [bulkNames, setBulkNames] = useState([]);
  const [bulkResult, setBulkResult] = useState(null);

  const handleBulkFileChange = (files) => {
    setBulkFiles(files);
    setBulkNames(files.map((f) => f.name.replace(/\.[^/.]+$/, '')));
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
    <div className="p-6 md:p-8 min-h-screen animate-fade-in" style={{ background: '#0f0a2e' }}>
      <PageHeader
        title="Upload Resumes"
        subtitle="AI will analyze each resume against your job description"
        icon={UploadIcon}
      />

      {/* Mode switcher */}
      <div
        className="mb-6 inline-flex p-1 rounded-xl"
        style={{
          background: 'rgba(26,16,64,0.80)',
          border: '1px solid rgba(139,92,246,0.20)',
        }}
      >
        <ModeButton
          active={mode === 'single'}
          onClick={() => setMode('single')}
          icon={FileText}
          label="Single Resume"
        />
        <ModeButton
          active={mode === 'bulk'}
          onClick={() => setMode('bulk')}
          icon={Files}
          label="Bulk Upload"
        />
      </div>

      {/* Job Role + Description */}
      <Card className="mb-6">
        <CardHeader
          title="Job Details"
          subtitle="What role are you hiring for?"
          icon={Sparkles}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <JobRoleSelect value={jobRole} onChange={setJobRole} />
        </div>
        <div className="mt-4">
          <TextArea
            label="Job Description"
            placeholder="Paste the job description here — required skills, years of experience, responsibilities..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="h-32 resize-none"
          />
        </div>
      </Card>

      {mode === 'single' ? (
        <>
          {/* Candidate details */}
          <Card className="mb-6">
            <CardHeader title="Candidate Information" icon={User} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Candidate Name"
                placeholder="e.g. Jane Doe"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                icon={User}
              />
              <TextInput
                type="email"
                label="Email (Optional)"
                placeholder="candidate@example.com"
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                icon={Mail}
              />
            </div>
            <p className="text-xs text-purple-400 mt-2">
              If email is provided, candidate will receive a copy of their result.
            </p>
          </Card>

          {/* Upload */}
          <Card className="mb-6">
            <CardHeader title="Resume File" icon={UploadIcon} />
            <FileDropZone
              accept=".pdf,.docx,.txt"
              files={files}
              onFiles={setFiles}
              hint="PDF, DOCX, or TXT — up to one file"
            />
          </Card>

          <Button
            variant="primary"
            size="lg"
            onClick={handleScreen}
            loading={loading}
            icon={Sparkles}
            className="w-full"
          >
            {loading ? 'AI is analyzing the resume...' : 'Screen Resume'}
          </Button>

          {/* Result */}
          {result && (
            <div className="mt-6 animate-slide-up">
              <ResultCard result={result} onView={() => navigate('/candidates')} />
            </div>
          )}
        </>
      ) : (
        <>
          {/* Bulk */}
          <Card className="mb-6">
            <CardHeader
              title="Upload Multiple Resumes"
              subtitle={`${bulkFiles.length} file${bulkFiles.length === 1 ? '' : 's'} selected`}
              icon={Files}
            />
            <FileDropZone
              accept=".pdf,.docx,.txt"
              multiple
              files={bulkFiles}
              onFiles={handleBulkFileChange}
              hint="You can select multiple files at once"
            />

            {bulkFiles.length > 0 && (
              <div className="mt-5 space-y-2">
                <p className="text-sm font-semibold text-white mb-2">
                  Edit candidate names:
                </p>
                {bulkFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-xs text-purple-300 w-40 truncate">{file.name}</span>
                    <TextInput
                      placeholder="Candidate name"
                      value={bulkNames[index] || ''}
                      onChange={(e) => updateBulkName(index, e.target.value)}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Button
            variant="primary"
            size="lg"
            onClick={handleBulkScreen}
            loading={loading}
            icon={Sparkles}
            className="w-full"
            disabled={bulkFiles.length === 0}
          >
            {loading
              ? `AI is analyzing ${bulkFiles.length} resume${bulkFiles.length === 1 ? '' : 's'}...`
              : `Screen ${bulkFiles.length || ''} Resume${bulkFiles.length === 1 ? '' : 's'}`.trim()}
          </Button>

          {/* Bulk results */}
          {bulkResult && (
            <div className="mt-6 animate-slide-up">
              <Card>
                <CardHeader
                  title={`Bulk Results — ${bulkResult.total} resumes`}
                  subtitle="Sorted by AI score"
                  icon={CheckCircle2}
                />
                <div className="space-y-2">
                  {bulkResult.results.map((r, i) => (
                    <BulkResultRow key={i} r={r} />
                  ))}
                </div>
                <Button
                  variant="success"
                  size="md"
                  className="w-full mt-4"
                  onClick={() => navigate('/candidates')}
                  iconRight={ArrowRight}
                >
                  View All Candidates
                </Button>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ModeButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={[
        'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all',
      ].join(' ')}
      style={{
        background: active ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'transparent',
        color: active ? '#ffffff' : '#a78bfa',
        boxShadow: active ? '0 2px 8px rgba(139,92,246,0.20)' : 'none',
      }}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function ResultCard({ result, onView }) {
  const score = Number(result.score) || 0;
  const scoreColor =
    score >= 75 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444';
  const scoreBg =
    score >= 75 ? 'rgba(34,197,94,0.15)' : score >= 50 ? 'rgba(234,179,8,0.15)' : 'rgba(239,68,68,0.15)';

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles size={18} style={{ color: '#a78bfa' }} />
            AI Screening Result
          </h3>
          <p className="text-sm text-purple-300 mt-1">{result.summary}</p>
        </div>
        <StatusBadge status={result.recommendation} />
      </div>

      <div
        className="flex items-center gap-4 p-4 rounded-xl mb-5"
        style={{ background: scoreBg }}
      >
        <div className="text-5xl font-bold" style={{ color: scoreColor }}>{score}</div>
        <div>
          <p className="text-sm font-semibold text-purple-300">Overall Match Score</p>
          <p className="text-xs text-purple-400">Out of 100</p>
        </div>
        <div
          className="flex-1 h-2 rounded-full overflow-hidden"
          style={{ background: 'rgba(15,10,46,0.60)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${score}%`,
              background:
                score >= 75 ? 'linear-gradient(90deg, #22c55e, #16a34a)' :
                score >= 50 ? 'linear-gradient(90deg, #eab308, #ca8a04)' :
                              'linear-gradient(90deg, #ef4444, #dc2626)',
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkillList
          title="Strengths"
          items={result.strengths || []}
          iconColor={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}
        />
        <SkillList
          title="Missing Skills"
          items={result.missing_skills || []}
          iconColor={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
        />
      </div>

      <Button variant="success" size="md" className="w-full mt-5" onClick={onView} iconRight={ArrowRight}>
        View All Candidates
      </Button>
    </Card>
  );
}

function SkillList({ title, items, iconColor }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: 'rgba(15,10,46,0.40)', border: '1px solid rgba(139,92,246,0.15)' }}
    >
      <h4 className="font-bold text-white mb-2 text-sm">{title}</h4>
      {items.length === 0 ? (
        <p className="text-xs text-purple-400">No data</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-purple-200">
              <span
                className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 text-xs font-bold"
                style={iconColor}
              >
                {title === 'Strengths' ? '+' : '−'}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BulkResultRow({ r }) {
  if (r.status !== 'success') {
    return (
      <div
        className="flex items-center justify-between p-3 rounded-lg"
        style={{
          background: 'rgba(239,68,68,0.10)',
          border: '1px solid rgba(239,68,68,0.30)',
        }}
      >
        <div>
          <p className="font-semibold text-white">{r.candidate_name}</p>
          <p className="text-xs text-purple-400">{r.filename}</p>
        </div>
        <StatusBadge status="Failed" />
      </div>
    );
  }
  const score = Number(r.score) || 0;
  return (
    <div
      className="flex items-center justify-between p-3 rounded-lg transition-colors"
      style={{
        background: 'rgba(15,10,46,0.40)',
        border: '1px solid rgba(139,92,246,0.20)',
      }}
    >
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-white truncate">{r.candidate_name}</p>
        <p className="text-xs text-purple-400 truncate">{r.filename}</p>
      </div>
      <div className="flex items-center gap-3 ml-3">
        <span className="text-xl font-bold" style={{ color: '#a78bfa' }}>{score}</span>
        <span className="text-xs text-purple-400">/100</span>
        <StatusBadge status={r.recommendation} size="sm" />
      </div>
    </div>
  );
}

export default Upload;
