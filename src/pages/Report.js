import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  XCircle,
  Eye,
  Briefcase,
  FileText,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { getCandidates, getResumeViewUrl } from '../services/api';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';

function Report() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    loadCandidate();
    // eslint-disable-next-line
  }, [id]);

  const loadCandidate = async () => {
    try {
      setLoading(true);
      const allCandidates = await getCandidates();
      const found = allCandidates.find((c) => String(c.id) === String(id));
      setCandidate(found || null);
    } catch (error) {
      console.error('Error loading candidate:', error);
      setCandidate(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current || !candidate) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${candidate.name.replace(/\s+/g, '_')}_Report.pdf`);
    } catch (error) {
      console.error(error);
      alert(`Error generating PDF: ${error.message}`);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center" style={{ background: '#0f0a2e', minHeight: '100vh' }}>
        <div className="inline-block w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-purple-300">Loading report...</p>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="p-8" style={{ background: '#0f0a2e', minHeight: '100vh' }}>
        <EmptyState
          icon={AlertCircle}
          title="Candidate not found"
          description="This candidate may have been deleted or the link is invalid."
          action={<Button variant="primary" onClick={() => navigate('/candidates')}>Back to Candidates</Button>}
        />
      </div>
    );
  }

  const score = Number(candidate.score) || 0;
  const scoreColorLight =
    score >= 75 ? '#16a34a' : score >= 50 ? '#ca8a04' : '#dc2626';
  const scoreBgLight =
    score >= 75 ? '#dcfce7' : score >= 50 ? '#fef9c3' : '#fee2e2';
  const recStatus = candidate.status;

  return (
    <div className="p-6 md:p-8 min-h-screen animate-fade-in" style={{ background: '#0f0a2e' }}>
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/candidates')}
          className="inline-flex items-center gap-1.5 text-sm text-purple-300 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft size={14} /> Back to candidates
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Candidate Report</h1>
            <p className="text-sm text-purple-300 mt-1">AI-generated screening analysis</p>
          </div>
          <Button
            variant="accent"
            size="md"
            icon={Download}
            loading={downloading}
            onClick={handleDownloadPDF}
          >
            {downloading ? 'Generating PDF...' : 'Download PDF'}
          </Button>
        </div>

        {/* PDF-captured region */}
        <div
          ref={reportRef}
          className="space-y-5 p-6 rounded-2xl"
          style={{ background: '#ffffff' }}
        >
          {/* Hero card */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
              border: '1px solid #ddd6fe',
            }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar name={candidate.name} size="xl" />
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900">{candidate.name}</h2>
                <p className="text-sm text-gray-600 inline-flex items-center gap-1.5 mt-1">
                  <Briefcase size={14} /> {candidate.role}
                </p>
                {candidate.has_resume && (
                  <div className="mt-3">
                    <a
                      href={getResumeViewUrl(candidate.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-purple-700 hover:text-purple-800 font-semibold"
                    >
                      <Eye size={14} /> View Resume
                    </a>
                  </div>
                )}
              </div>

              <div
                className="rounded-2xl p-5 text-center min-w-[180px]"
                style={{ background: scoreBgLight }}
              >
                <p className="text-xs uppercase tracking-wider font-semibold text-gray-600">
                  Overall Score
                </p>
                <p className="text-5xl font-bold mt-1" style={{ color: scoreColorLight }}>{score}</p>
                <p className="text-xs text-gray-500 mt-1">out of 100</p>
                <div className="mt-3 h-1.5 bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${score}%`, background: scoreColorLight }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Skills match */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div
              className="rounded-2xl p-6"
              style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}
            >
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                <CheckCircle2 size={20} style={{ color: '#16a34a' }} /> Skills Matched
              </h3>
              {candidate.strengths?.length > 0 ? (
                <ul className="space-y-2">
                  {candidate.strengths.map((skill) => (
                    <li
                      key={skill}
                      className="flex items-start gap-2.5 py-2 px-3 bg-green-50 border border-green-100 rounded-lg"
                    >
                      <span className="w-5 h-5 rounded-md bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        ✓
                      </span>
                      <span className="text-sm text-gray-800">{skill}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No matched skills data</p>
              )}
            </div>

            <div
              className="rounded-2xl p-6"
              style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}
            >
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                <XCircle size={20} style={{ color: '#dc2626' }} /> Skills Missing
              </h3>
              {candidate.missing_skills?.length > 0 ? (
                <ul className="space-y-2">
                  {candidate.missing_skills.map((skill) => (
                    <li
                      key={skill}
                      className="flex items-start gap-2.5 py-2 px-3 bg-red-50 border border-red-100 rounded-lg"
                    >
                      <span className="w-5 h-5 rounded-md bg-red-500 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        −
                      </span>
                      <span className="text-sm text-gray-800">{skill}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No missing skills data</p>
              )}
            </div>
          </div>

          {/* Summary + recommendation */}
          <div
            className="rounded-2xl p-6"
            style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}
          >
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
              <Sparkles size={20} style={{ color: '#7c3aed' }} /> AI Recommendation
            </h3>
            <div className="flex flex-wrap items-start gap-4">
              <StatusBadge status={recStatus} size="lg" />
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm text-gray-700 leading-relaxed">{candidate.summary}</p>
              </div>
            </div>
          </div>

          {/* Meta info */}
          <div
            className="rounded-2xl p-6"
            style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}
          >
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
              <FileText size={20} style={{ color: '#6b7280' }} /> Candidate Details
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Meta label="Email" value={candidate.email || 'Not provided'} />
              <Meta label="Phone" value={candidate.phone || 'Not provided'} />
              <Meta label="Applied for" value={candidate.role || 'Not specified'} />
              <Meta
                label="Resume"
                value={candidate.has_resume ? candidate.resume_filename || 'Uploaded' : 'Not uploaded'}
              />
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider font-semibold text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900 mt-1 break-words">{value}</dd>
    </div>
  );
}

export default Report;