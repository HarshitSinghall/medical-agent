import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0f1e]">
      {/* Ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-primary-600/20 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary-800/25 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-primary-500/10 blur-[80px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Card */}
      <div className="relative w-full max-w-md mx-4 animate-in">
        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl shadow-black/40">

          {/* Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-600/40 mb-4">
              <Pill className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Healthriver</h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">Admin Portal</p>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Sign in to your account</h2>
            <p className="text-gray-500 text-sm mt-1">Enter your credentials to access the dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-400 mb-1.5">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm outline-none focus:border-primary-500/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-600 text-sm outline-none focus:border-primary-500/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-300 transition-colors rounded-lg"
                  tabIndex={-1}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 disabled:from-primary-800 disabled:to-primary-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-primary-600/25 transition-all duration-200 hover:shadow-primary-500/35 hover:-translate-y-0.5 active:translate-y-0 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-gray-600 text-xs mt-6">
            Contact your administrator if you don't have access.
          </p>
        </div>

        {/* Subtle glow under card */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-primary-600/20 blur-2xl rounded-full pointer-events-none" />
      </div>
    </div>
  );
}
