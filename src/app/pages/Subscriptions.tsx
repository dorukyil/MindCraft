import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { MinecraftButton } from '../components/MinecraftButton';

export function Subscriptions() {
  const navigate = useNavigate();

  const tiers = [
    { name: 'BASIC', color: 'bg-gray-600' },
    { name: 'ADVANCED', color: 'bg-[#83aeff]' },
    { name: 'MAX', color: 'bg-[#FCD34D]' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#83aeff] to-[#8fb9ff] p-6">
      {/* Back to dashboard button */}
      <div className="flex items-center gap-4 mb-8">
        <MinecraftButton
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 font-mono text-xl transition-colors">
          <ArrowLeft size={16} />
          DASHBOARD
        </MinecraftButton>
      </div>

      {/* Page content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`${tier.color} w-60 h-96 border-4 border-black shadow-[6px_6px_0px_black] flex flex-col items-center justify-center font-mono text-white`}
            >
              <h2 className="text-xl">{tier.name}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}