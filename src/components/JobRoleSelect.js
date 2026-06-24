import React from 'react';
import { Briefcase } from 'lucide-react';

const JOB_ROLES = {
  'Software Development': [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Mobile App Developer (Android)',
    'Mobile App Developer (iOS)',
    'React Developer',
    'Java Developer',
    'Python Developer',
    '.NET Developer',
    'PHP Developer',
    'Game Developer',
  ],
  'Data & AI': [
    'Data Analyst',
    'Data Scientist',
    'Data Engineer',
    'Machine Learning Engineer',
    'AI Engineer',
    'Business Intelligence Analyst',
  ],
  'DevOps & Infrastructure': [
    'DevOps Engineer',
    'Cloud Engineer',
    'Site Reliability Engineer (SRE)',
    'System Administrator',
    'Network Engineer',
  ],
  'Quality & Testing': [
    'QA Engineer',
    'Automation Test Engineer',
    'Manual Tester',
  ],
  Design: [
    'UI/UX Designer',
    'Graphic Designer',
    'Product Designer',
  ],
  Management: [
    'Product Manager',
    'Project Manager',
    'Scrum Master',
    'Engineering Manager',
    'Technical Lead',
  ],
  'Security & Database': [
    'Cybersecurity Analyst',
    'Database Administrator (DBA)',
    'Security Engineer',
  ],
  'Other Tech Roles': [
    'Blockchain Developer',
    'IT Support Engineer',
    'Technical Writer',
    'Solutions Architect',
  ],
  'Fire & Safety': [
    'Fire Safety Officer',
    'Fire and Safety Engineer',
    'EHS Officer (Environment, Health & Safety)',
    'Industrial Safety Officer',
    'HSE Manager (Health, Safety & Environment)',
    'Safety Inspector',
    'Occupational Health & Safety Specialist',
  ],
};

export default function JobRoleSelect({ value, onChange, icon: Icon = Briefcase, label = 'Job Role' }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-semibold text-white mb-1.5">
        {Icon && <Icon size={14} style={{ color: '#a78bfa' }} />}
        {label}
      </label>
      <div className="relative">
        <select
          className="w-full rounded-lg text-white px-3 py-2.5 pr-10 appearance-none transition-all duration-150 focus:ring-2 focus:outline-none border border-purple-700/40 focus:border-brand-400 focus:ring-brand-500/20"
          style={{ background: 'rgba(15,10,46,0.60)' }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {Object.entries(JOB_ROLES).map(([group, roles]) => (
            <optgroup key={group} label={group}>
              {roles.map((role) => (
                <option key={role} value={role} style={{ background: '#1a1040' }}>
                  {role}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

export { JOB_ROLES };
