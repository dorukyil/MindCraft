import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Menu, User, CreditCard, LogOut } from 'lucide-react';

export function Sidebar({ onLogout }: { onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-8 right-6 z-64 bg-[#3C3C3C] border-4 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]"
      >
        <Menu className="text-white" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-60 bg-[#2a2a2a] border-l-4 border-black z-40 transform transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 pt-24 flex flex-col gap-6 font-mono items-end text-right h-full overflow-y-auto">

          {/* Profile */}
          <button
            onClick={() => {
              navigate('/profile');
              setOpen(false);
            }}
            className="flex items-center gap-3 text-white hover:text-[#83aeff] flex-row-reverse"
          >
            <User size={18} />
            PROFILE
          </button>

          {/* Subscription */}
          <button
            onClick={() => {
              navigate('/subscriptions');
              setOpen(false);
            }}
            className="flex items-center gap-3 text-white hover:text-[#83aeff] flex-row-reverse"
          >
            <CreditCard size={18} />
            SUBSCRIPTIONS
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              onLogout();
              setOpen(false);
            }}
            className="flex items-center gap-3 text-red-400 hover:text-red-300 flex-row-reverse"
          >
            <LogOut size={18} />
            LOGOUT
          </button>
        </div>
      </div>
    </>
  );
}