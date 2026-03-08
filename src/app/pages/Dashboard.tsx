import { useNavigate } from 'react-router';
import { MinecraftButton } from '../components/MinecraftButton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
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
      <div className="relative z-10 min-h-screen p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1532347833815-3b8e47e7bd7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5lY3JhZnQlMjBwaWNrYXhlJTIwYm9vayUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NzI5OTcyNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="MindCraft Logo"
              className="w-12 h-12 object-cover rounded border-2 border-black"
            />
            <h1
              className="text-3xl text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]"
              style={{
                fontFamily: 'monospace',
                imageRendering: 'pixelated',
                letterSpacing: '2px'
              }}
            >
              MINDCRAFT
            </h1>
          </div>

          <MinecraftButton onClick={handleLogout}>
            LOGOUT
          </MinecraftButton>
        </div>

        {/* Content area */}
        <div className="max-w-6xl mx-auto">
          <div
            className="bg-gradient-to-br from-[#976d4c] to-[#7b583d] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-8"
            style={{ imageRendering: 'pixelated' }}
          >
            <h2
              className="text-2xl text-white mb-4 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]"
              style={{
                fontFamily: 'monospace',
                imageRendering: 'pixelated',
                letterSpacing: '2px'
              }}
            >
              WELCOME TO MINDCRAFT!
            </h2>

            <p className="text-[#FCD34D] font-mono text-sm mb-6 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
              Build Your Knowledge, Block by Block
            </p>

            {/* Decorative divider */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[#72b149] to-transparent" />
              <div className="w-2 h-2 bg-[#72b149] rotate-45" />
              <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[#72b149] to-transparent" />
            </div>

            <div className="bg-[#3C3C3C] border-4 border-black p-6 shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.5)]">
              <p className="text-white font-mono text-center text-lg">
                Your learning dashboard will appear here
              </p>
            </div>

            {/* Decorative West African pattern accent */}
            <div className="mt-6 flex justify-center gap-2">
              <div className="w-3 h-3 bg-[#82c159] border-2 border-black" />
              <div className="w-3 h-3 bg-[#72b149] border-2 border-black" />
              <div className="w-3 h-3 bg-[#55942c] border-2 border-black" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}