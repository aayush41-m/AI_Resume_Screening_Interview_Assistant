import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { login } from '../services/api';
import Button from '../components/ui/Button';
import { TextInput } from '../components/ui/Input';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#0f0a2e' }}>
      {/* Decorative blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 rounded-full filter blur-3xl opacity-40 animate-pulse-slow" style={{ background: '#8b5cf6' }} />
      <div className="absolute bottom-0 -right-20 w-96 h-96 rounded-full filter blur-3xl opacity-40 animate-pulse-slow" style={{ background: '#ec4899' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full filter blur-3xl opacity-30" style={{ background: '#a78bfa' }} />
      <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full filter blur-3xl opacity-20 animate-pulse-slow" style={{ background: '#7c3aed' }} />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full filter blur-3xl opacity-20 animate-pulse-slow" style={{ background: '#db2777' }} />

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Logo above card */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              boxShadow: '0 10px 40px rgba(139,92,246,0.40)',
            }}
          >
            <Sparkles size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">AI Recruiter</h1>
          <p className="text-purple-200 text-sm mt-1">Smart hiring starts here</p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(26,16,64,0.85)',
            border: '1px solid rgba(139,92,246,0.25)',
            boxShadow: '0 10px 40px rgba(139,92,246,0.20)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Welcome back</h2>
            <p className="text-sm text-purple-300 mt-1">
              Login to your HR account to continue
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

          <form onSubmit={handleLogin} className="space-y-4">
            <TextInput
              type="email"
              label="Email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />
            <TextInput
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              iconRight={!loading ? ArrowRight : undefined}
              className="w-full mt-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'rgba(139,92,246,0.25)' }} />
            <span className="text-xs text-purple-400">OR</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(139,92,246,0.25)' }} />
          </div>

          <p className="text-center text-sm text-purple-300">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-semibold hover:underline"
              style={{ color: '#a78bfa' }}
            >
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-purple-300 mt-6">
          AI-powered resume screening & interview assistant
        </p>
      </div>
    </div>
  );
}

export default Login;
