import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { MinecraftButton } from '../components/MinecraftButton';
import { MinecraftInput } from '../components/MinecraftInput';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase/client';

export function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: { data: { role, full_name: formData.fullName } },
    });
    if (error?.message.toLowerCase().includes('already registered')) {
      setError('An account with this email already exists.');
    } else if (error) {
      setError(error.message);
    } else if (data.user?.identities?.length === 0) {
      setError('An account with this email already exists.');
    } else {
      setMessage('Check your email to confirm your account.');
    }
    setLoading(false);
  };

  return (
    <div className="size-full min-h-screen relative overflow-hidden bg-gradient-to-b from-[#83aeff] to-[#8fb9ff]">
      {/* Minecraft sky background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `url('https://minecraft.wiki/images/thumb/Plains_sky.png/1200px-Plains_sky.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            imageRendering: 'pixelated'
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 py-8">
        <div className="w-full max-w-md">
          {/* Signup card with West African pattern border */}
          <div className="relative">
            {/* Main signup container */}
            <div 
              className="bg-gradient-to-br from-[#976d4c] to-[#7b583d] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-5"
              style={{ imageRendering: 'pixelated' }}
            >
              {/* Logo area */}
              <div className="text-center mb-3">
                <div className="flex items-center justify-center gap-3 mb-1.5">
                  <img 
                    src = "/mindCraft_logo_border.png"
                    alt="MindCraft Logo" 
                    className="w-14 h-14"
                  />
                </div>
                
                <h1 
                  className="text-3xl mb-1 text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]"
                  style={{
                    fontFamily: 'monospace',
                    imageRendering: 'pixelated',
                    letterSpacing: '2px'
                  }}
                >
                  CREATE ACCOUNT
                </h1>
                
                <p className="text-[#FCD34D] font-mono text-xs drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                  Start Building Your Knowledge Today
                </p>

                {/* African-inspired decorative divider */}
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="w-10 h-1 bg-gradient-to-r from-transparent via-[#72b149] to-transparent" />
                  <div className="w-2 h-2 bg-[#72b149] rotate-45" />
                  <div className="w-10 h-1 bg-gradient-to-r from-transparent via-[#72b149] to-transparent" />
                </div>
              </div>

              {/* Signup form */}
              <form onSubmit={handleSubmit} className="space-y-2">
                {/* Role selector */}
                <div className="flex border-4 border-black overflow-hidden mb-1">
                  {(['student', 'teacher'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 py-1.5 font-mono text-xs uppercase transition-colors ${
                        role === r
                          ? 'bg-[#72b149] text-white'
                          : 'bg-[#3C3C3C] text-white/60 hover:text-white'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                <div>
                  <label
                    htmlFor="fullName"
                    className="block mb-1.5 text-white font-mono text-sm drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]"
                  >
                    FULL NAME
                  </label>
                  <MinecraftInput
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Alex Johnson"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block mb-1.5 text-white font-mono text-sm drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]"
                  >
                    EMAIL
                  </label>
                  <MinecraftInput
                    type="email"
                    id="email"
                    name="email"
                    placeholder="student@mindcraft.edu"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label 
                    htmlFor="password" 
                    className="block mb-1.5 text-white font-mono text-sm drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]"
                  >
                    PASSWORD
                  </label>
                  <MinecraftInput
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label 
                    htmlFor="confirmPassword" 
                    className="block mb-1.5 text-white font-mono text-sm drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]"
                  >
                    CONFIRM PASSWORD
                  </label>
                  <MinecraftInput
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Terms and conditions */}
                <div className="flex items-start gap-2 text-xs pt-1">
                  <input 
                    type="checkbox" 
                    id="terms"
                    required
                    className="w-4 h-4 border-2 border-black mt-0.5"
                  />
                  <label htmlFor="terms" className="text-white font-mono cursor-pointer">
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                </div>

                {error && (
                  <p className="text-red-400 font-mono text-xs drop-shadow-[1px_1px_0px_rgba(0,0,0,0.5)]">
                    {error}
                  </p>
                )}
                {message && (
                  <p className="text-[#72b149] font-mono text-xs drop-shadow-[1px_1px_0px_rgba(0,0,0,0.5)]">
                    {message}
                  </p>
                )}

                <MinecraftButton type="submit" className="w-full mt-4" disabled={loading}>
                  {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
                </MinecraftButton>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-3">
                <div className="flex-1 h-0.5 bg-white/30" />
                <span className="text-white font-mono text-xs">OR</span>
                <div className="flex-1 h-0.5 bg-white/30" />
              </div>

              {/* Google signup button */}
              <button
                type="button"
                onClick={() => supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: { redirectTo: 'http://localhost:5173/auth/callback' },
                })}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] active:translate-x-[2px] active:translate-y-[2px] transition-all hover:bg-gray-50"
                style={{ imageRendering: 'pixelated', fontFamily: 'monospace' }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                  <path fill="none" d="M1 1h22v22H1z" />
                </svg>
                <span className="text-gray-700 font-bold text-sm">
                  Sign up with Google
                </span>
              </button>

              {/* Login link */}
              <div className="mt-3 text-center">
                <p className="text-white font-mono text-xs">
                  Already have an account?{' '}
                  <Link 
                    to="/" 
                    className="text-[#FCD34D] hover:text-[#FBBF24] underline font-bold"
                  >
                    Login
                  </Link>
                </p>
              </div>

              {/* Decorative West African pattern accent */}
              <div className="mt-3 flex justify-center gap-2">
                <div className="w-3 h-3 bg-[#82c159] border-2 border-black" />
                <div className="w-3 h-3 bg-[#72b149] border-2 border-black" />
                <div className="w-3 h-3 bg-[#55942c] border-2 border-black" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}