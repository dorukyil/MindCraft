import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase/client';

export function Profile() {
  const [name, setName] = useState('');
  const [xp, setXp] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fullName = user.user_metadata?.full_name || '';
      setName(fullName);

      const { data } = await supabase
        .from('lesson_attempts')
        .select('xp_earned')
        .eq('user_id', user.id);

      if (data) {
        setXp(data.reduce((sum, a) => sum + (a.xp_earned || 0), 0));
      }
    }

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#83aeff] to-[#8fb9ff] p-6">
      {/* Back button — matches LessonPage exactly */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-white/70 hover:text-white font-mono text-xl transition-colors"
        >
          <ArrowLeft size={28} />
          DASHBOARD
        </button>
      </div>

      {/* Page content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-[#3C3C3C] border-4 border-black p-8 shadow-[6px_6px_0px_black] text-white font-mono">
          <h1 className="text-xl mb-4">PROFILE</h1>
          <p>Name: {name}</p>
          <p>Total XP: {xp}</p>
        </div>
      </div>
    </div>
  );
}