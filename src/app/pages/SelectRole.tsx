import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MinecraftButton } from '../components/MinecraftButton';
import { supabase } from '../lib/supabase/client';

export function SelectRole() {
  const navigate = useNavigate();
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ data: { role } });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="size-full min-h-screen relative overflow-hidden bg-gradient-to-b from-[#83aeff] to-[#8fb9ff]">
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

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div
            className="bg-gradient-to-br from-[#976d4c] to-[#7b583d] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-6"
            style={{ imageRendering: 'pixelated' }}
          >
            <div className="text-center mb-5">
              <img src="/mindCraft_logo_border.png" alt="MindCraft Logo" className="w-14 h-14 mx-auto mb-2" />
              <h1
                className="text-2xl text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]"
                style={{ fontFamily: 'monospace', letterSpacing: '2px' }}
              >
                WHO ARE YOU?
              </h1>
              <p className="text-[#FCD34D] font-mono text-xs mt-1 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                Choose your role to continue
              </p>
            </div>

            <div className="flex border-4 border-black overflow-hidden mb-5">
              {(['student', 'teacher'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 font-mono text-sm uppercase transition-colors ${
                    role === r
                      ? 'bg-[#72b149] text-white'
                      : 'bg-[#3C3C3C] text-white/60 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {error && (
              <p className="text-red-400 font-mono text-xs mb-3 drop-shadow-[1px_1px_0px_rgba(0,0,0,0.5)]">
                {error}
              </p>
            )}

            <MinecraftButton className="w-full" onClick={handleConfirm} disabled={loading}>
              {loading ? 'SAVING...' : 'CONFIRM'}
            </MinecraftButton>
          </div>
        </div>
      </div>
    </div>
  );
}
