import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../../lib/supabase/client';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        subscription.unsubscribe();
        const role = session.user.user_metadata?.role;
        navigate(role ? '/dashboard' : '/select-role');
      } else if (event === 'SIGNED_OUT' || (!session && event !== 'INITIAL_SESSION')) {
        subscription.unsubscribe();
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#83aeff] to-[#8fb9ff]">
      <p className="font-mono text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">Signing you in…</p>
    </div>
  );
}
