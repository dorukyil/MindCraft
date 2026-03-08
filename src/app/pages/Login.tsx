import { useState } from 'react';
import { Link } from 'react-router';
import { MinecraftButton } from '../components/MinecraftButton';
import { MinecraftInput } from '../components/MinecraftInput';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    // Handle login logic here
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
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Login card with West African pattern border */}
          <div className="relative">
            {/* Main login container */}
            <div 
              className="bg-gradient-to-br from-[#976d4c] to-[#7b583d] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-6"
              style={{ imageRendering: 'pixelated' }}
            >
              {/* Logo area */}
              <div className="text-center mb-5">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <img 
                    src={logoImage} 
                    alt="MindCraft Logo" 
                    className="w-16 h-16"
                  />
                </div>
                
                <h1 
                  className="text-4xl mb-1 text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]"
                  style={{
                    fontFamily: 'monospace',
                    imageRendering: 'pixelated',
                    letterSpacing: '2px'
                  }}
                >
                  MINDCRAFT
                </h1>
                
                <p className="text-[#FCD34D] font-mono text-xs drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                  Build Your Knowledge, Block by Block
                </p>

                {/* African-inspired decorative divider */}
                <div className="flex items-center justify-center gap-2 mt-3">
                  <div className="w-12 h-1 bg-gradient-to-r from-transparent via-[#72b149] to-transparent" />
                  <div className="w-2 h-2 bg-[#72b149] rotate-45" />
                  <div className="w-12 h-1 bg-gradient-to-r from-transparent via-[#72b149] to-transparent" />
                </div>
              </div>

              {/* Login form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label 
                    htmlFor="email" 
                    className="block mb-2 text-white font-mono text-sm drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]"
                  >
                    USERNAME / EMAIL
                  </label>
                  <MinecraftInput
                    type="email"
                    id="email"
                    placeholder="student@mindcraft.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label 
                    htmlFor="password" 
                    className="block mb-2 text-white font-mono text-sm drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]"
                  >
                    PASSWORD
                  </label>
                  <MinecraftInput
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* African pattern decorative element */}
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-white font-mono cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 border-2 border-black"
                    />
                    Remember me
                  </label>
                  <a 
                    href="#" 
                    className="text-[#FCD34D] font-mono hover:text-[#FBBF24] underline"
                  >
                    Forgot password?
                  </a>
                </div>

                <MinecraftButton type="submit" className="w-full">
                  LOGIN
                </MinecraftButton>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-0.5 bg-white/30" />
                <span className="text-white font-mono text-xs">OR</span>
                <div className="flex-1 h-0.5 bg-white/30" />
              </div>

              {/* Google login button */}
              <button
                type="button"
                onClick={() => console.log('Google login clicked')}
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
                  Continue with Google
                </span>
              </button>

              {/* Sign up link */}
              <div className="mt-4 text-center">
                <p className="text-white font-mono text-xs">
                  New to MindCraft?{' '}
                  <Link 
                    to="/signup" 
                    className="text-[#FCD34D] hover:text-[#FBBF24] underline font-bold"
                  >
                    Create Account
                  </Link>
                </p>
              </div>

              {/* Decorative West African pattern accent */}
              <div className="mt-4 flex justify-center gap-2">
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
