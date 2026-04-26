import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { MinecraftButton } from '../components/MinecraftButton';

export function Subscriptions() {
  const navigate = useNavigate();

  const tiers = [
    { name: 'BASIC', color: 'bg-gray-600' },
    { name: 'ADVANCED', color: 'bg-[#5992FF]' },
    { name: 'MAX', color: 'bg-[#FCD34D]' },
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-b from-[#83aeff] to-[#8fb9ff]">

      {/* Minecraft Dashboard Button */}
      <div className="absolute top-6 left-6">
        <MinecraftButton onClick={() => navigate('/dashboard')}>
          <div className="flex items-center gap-2">
            <ArrowLeft size={16} />
            DASHBOARD
          </div>
        </MinecraftButton>
      </div>

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
  );
}