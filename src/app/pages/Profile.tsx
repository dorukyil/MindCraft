import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/client';

export function Profile() {
  const [name, setName] = useState('');
  const [xp, setXp] = useState(0);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#83aeff] to-[#8fb9ff]">
      <div className="bg-[#3C3C3C] border-4 border-black p-8 shadow-[6px_6px_0px_black] text-white font-mono">
        <h1 className="text-xl mb-4">PROFILE</h1>
        <p>Name: {name}</p>
        <p>Total XP: {xp}</p>
      </div>
    </div>
  );
}