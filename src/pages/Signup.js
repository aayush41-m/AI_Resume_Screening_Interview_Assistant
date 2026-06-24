import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, AlertCircle, Sparkles, Check } from 'lucide-react';
import { signup } from '../services/api';
import Button from '../components/ui/Button';
import { TextInput } from '../components/ui/Input';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await signup(name, email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const benefits = [
    'AI-powered resume screening',
    'Bulk resume analysis',
    'AI interview assistant',
    'Detailed candidate reports',
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#0f0a2e' }}>
      <div className="absolute top-0 -right-20 w-96 h-96 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" style={{ background: '#ec4899' }} />
      <div className="absolute bottom-0 -left-20 w-96 h-96 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" style={{ background: '#8b5cf6' }} />
      <div className="absolute top-1/2 left-1/3 w-96 h-96 rounded-full filter blur-3xl opacity-20" style={{ background: '#7c3aed' }} />

      <div className="relative w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center animate-slide-up">
        {/* Left side - benefits */}
        <div className="hidden md:block px-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              boxShadow: '0 10px 40px rgba(139,92,246,0.40)',
            }}
          >
            <Sparkles size={28} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold leading-tight text-white">
            Hire smarter,<br />
            <span style={{ color: '#c4b5fd' }}>not harder.</span>
          </h1>
          <p className="text-purple-200 mt-4 text-lg">
            Join HR teams using AI to find the right candidates, faster.
          </p>
          <ul className="mt-8 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-3 text-purple-100">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(139,92,246,0.30)' }}
                >
                  <Check size={14} className="text-white" />
                </div>
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Right side - form */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(26,16,64,0.85)',
            border: '1px solid rgba(139,92,246,0.25)',
            boxShadow: '0 10px 40px rgba(139,92,246,0.20)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="md:hidden flex flex-col items-center mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}
            >
              <Sparkles size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">AI Recruiter</h1>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Create your account</h2>
            <p className="text-sm text-purple-300 mt-1">
              Start screening resumes with AI in minutes
            </p>
          </div>

          {error && (
            <div
              className="flex items-start gap-2 px-4 py-3 rounded-lg mb-5 text-sm"
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

          <form onSubmit={handleSignup} className="space-y-4">
            <TextInput
              type="text"
              label="Full name"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={User}
              required
            />
            <TextInput
              type="email"
              label="Work email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />
            <TextInput
              type="password"
              label="Password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
              minLength={6}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              iconRight={!loading ? ArrowRight : undefined}
              className="w-full mt-2"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="text-center text-sm text-purple-300 mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold hover:underline"
              style={{ color: '#a78bfa' }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
