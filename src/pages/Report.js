import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getCandidates, getResumeViewUrl } from '../services/api';

function Report() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    loadCandidate();
  }, [id]);

  const loadCandidate = async () => {
    try {
      setLoading(true);
      const allCandidates = await getCandidates();
      const found = allCandidates.find(
        (c) => String(c.id) === String(id)
      );
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
        backgroundColor: '#f3f4f6',
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

      pdf.save(
        `${candidate.name.replace(/\s+/g, '_')}_Report.pdf`
      );
    } catch (error) {
      console.error(error);
      alert(`Error generating PDF: ${error.message}`);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-400">
        Loading report...
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="p-6 text-center text-gray-400">
        Candidate not found.
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-900">
          Candidate Report
        </h2>

        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50"
        >
          {downloading
            ? 'Generating PDF...'
            : 'Download PDF Report'}
        </button>
      </div>

      <div ref={reportRef} className="bg-gray-100">
        <div className="bg-white rounded-xl shadow p-6 mb-6 flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center text-4xl">
            👤
          </div>

          <div>
            <h3 className="text-xl font-bold text-blue-900">
              {candidate.name}
            </h3>

            <p className="text-gray-500">
              {candidate.role}
            </p>

            {candidate.has_resume && (
              <div className="flex gap-3 mt-2">
                <a
                  href={getResumeViewUrl(candidate.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Resume
                </a>
              </div>
            )}
          </div>

          <div className="ml-auto text-center">
            <p className="text-gray-500 text-sm">
              Overall Score
            </p>

            <h3 className="text-5xl font-bold text-blue-600">
              {candidate.score}
            </h3>

            <p className="text-gray-400 text-sm">
              out of 100
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-blue-900 mb-4">
              Skills Matched
            </h3>

            {candidate.strengths?.length > 0 ? (
              candidate.strengths.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-2 py-1"
                >
                  <span className="text-green-500">+</span>
                  <span className="text-gray-700">
                    {skill}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">
                No data
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-blue-900 mb-4">
              Skills Missing
            </h3>

            {candidate.missing_skills?.length > 0 ? (
              candidate.missing_skills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-2 py-1"
                >
                  <span className="text-red-500">-</span>
                  <span className="text-gray-700">
                    {skill}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">
                No data
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-blue-900 mb-4">
            AI Recommendation
          </h3>

          <div className="flex items-center gap-4">
            <span
              className={`px-4 py-2 rounded-full font-bold text-lg ${
                candidate.status === 'Shortlisted'
                  ? 'bg-green-100 text-green-700'
                  : candidate.status === 'Rejected'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {candidate.status === 'Shortlisted'
                ? 'HIRE'
                : candidate.status === 'Rejected'
                ? 'REJECT'
                : 'PENDING'}
            </span>

            <p className="text-gray-600">
              {candidate.summary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;