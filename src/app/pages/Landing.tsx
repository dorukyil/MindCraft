import { useNavigate } from 'react-router';
import { MinecraftButton } from '../components/MinecraftButton';
import { AdinkraPattern } from '../components/AdinkraPattern';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { BookOpen, Pickaxe, Users, Target, Zap } from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#83aeff] to-[#8fb9ff]">
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

      {/* Adinkra patterns in corners */}
      <div className="absolute top-8 left-8 opacity-20">
        <AdinkraPattern size={80} />
      </div>
      <div className="absolute bottom-8 right-8 opacity-20">
        <AdinkraPattern size={80} />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ImageWithFallback
              src="/mindCraft_logo_border.png"
              alt="MindCraft Logo"
              className="w-18 h-18"
            />
            <div>
              <h1
                className="text-5xl text-white drop-shadow-[4px_4px_1px_rgba(0,0,0,0.8)]"
                style={{ fontFamily: 'monospace', imageRendering: 'pixelated', letterSpacing: '2px' }}
              >
                MINDCRAFT
              </h1>
              <p className="text-white/80 font-mono text-sm mt-1 drop-shadow-[2px_2px_2px_rgba(0,0,0,1)]">
                Build Your Knowledge, Block by Block</p>
            </div>
          </div>
          <MinecraftButton onClick={() => navigate('/login')}>
            GET STARTED
          </MinecraftButton>
        </header>

        {/* Hero Section */}
        <section className="px-8 py-16 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="text-5xl text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)] mb-6"
                style={{ fontFamily: 'monospace', letterSpacing: '2px' }}
              >
                LEARN THROUGH PLAY
              </h2>
              <p className="text-white/90 font-mono text-lg mb-8 leading-relaxed drop-shadow-[2px_2px_2px_rgba(0,0,0,0.8)]">
                MindCraft transforms education into an adventure where every lesson is a new block
                in building your future.
              </p>
              <div className="flex gap-4">
                <MinecraftButton onClick={() => navigate('/signup')} className="!bg-[#72b149]">
                  <div className="flex items-center gap-3">
                    <BookOpen size={18} />
                    START LEARNING
                  </div>
                </MinecraftButton>
                <MinecraftButton onClick={() => navigate('/login')}>
                  <div className="flex items-center gap-3">
                    <Pickaxe size={18} />
                    LOG IN
                  </div>
                </MinecraftButton>
              </div>
            </div>

            {/* Hero Image */}
            <div
              className="bg-gradient-to-br from-[#976d4c] to-[#7b583d] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] overflow-hidden"
              style={{ imageRendering: 'pixelated' }}
            >
              <ImageWithFallback
                src="/students working.jpeg"
                alt="Students learning"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="px-8 py-16 bg-gradient-to-br from-[#976d4c] to-[#7b583d] border-y-8 border-black">
          <div className="max-w-7xl mx-auto">
            <h3
              className="text-4xl text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)] mb-8 text-center"
              style={{ fontFamily: 'monospace', letterSpacing: '2px' }}
            >
              ABOUT MINDCRAFT
            </h3>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Feature 1 */}
              <div className="bg-[#3C3C3C] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-6">
                <div className="w-12 h-12 bg-[#72b149] border-2 border-black flex items-center justify-center mb-4">
                  <Users className="text-white" size={24} />
                </div>
                <h4 className="text-white font-mono text-lg mb-2 font-bold">CULTURAL LEARNING</h4>
                <p className="text-white/80 font-mono text-sm leading-relaxed">
                  Experience education rooted in West African traditions, featuring Adinkra symbols,
                  Kente patterns, and cultural wisdom.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#3C3C3C] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-6">
                <div className="w-12 h-12 bg-[#FCD34D] border-2 border-black flex items-center justify-center mb-4">
                  <Target className="text-black" size={24} />
                </div>
                <h4 className="text-white font-mono text-lg mb-2 font-bold">GAMIFIED APPROACH</h4>
                <p className="text-white/80 font-mono text-sm leading-relaxed">
                  Learn through a game like interface that makes education fun,
                  engaging, and rewarding with XP and achievements.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#3C3C3C] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-6">
                <div className="w-12 h-12 bg-[#D97706] border-2 border-black flex items-center justify-center mb-4">
                  <Zap className="text-white" size={24} />
                </div>
                <h4 className="text-white font-mono text-lg mb-2 font-bold">INTERACTIVE LESSONS</h4>
                <p className="text-white/80 font-mono text-sm leading-relaxed">
                  Build knowledge block by block with hands-on activities, quizzes,
                  and challenges designed to make learning stick.
                </p>
              </div>
            </div>

            <p className="text-lg text-white/90 font-mono text-lg text-center max-w-2xl mx-auto leading-relaxed drop-shadow-[3px_3px_0px_rgba(0,0,0,0.8)]"
               style={{ fontFamily: 'monospace', letterSpacing: '2px' }}>
              Our mission is to make learning accessible, culturally relevant, and incredibly fun for students of all ages.
            </p>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="px-4 py-16 max-w-7xl mx-auto">
          <h3
            className="text-4xl text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)] mb-8 text-center"
            style={{ fontFamily: 'monospace', letterSpacing: '2px' }}
          >
            EXPERIENCE THE JOURNEY
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Gallery Image 1 */}
            <div
              className="bg-gradient-to-br from-[#976d4c] to-[#7b583d] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] overflow-hidden"
              style={{ imageRendering: 'pixelated' }}
            >
              <ImageWithFallback
                src="/students with tech.jpeg"
                alt="Education and books"
                className="w-full h-[300px] object-cover block"
              />
              <div className="p-5 bg-[#3C3C3C] border-t-4 border-black">
                <p className="text-white font-mono text-sm text-center">Traditional learning meets modern technology</p>
              </div>
            </div>

            {/* Gallery Image 2 */}
            <div
              className="bg-gradient-to-br from-[#976d4c] to-[#7b583d] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] overflow-hidden"
              style={{ imageRendering: 'pixelated' }}
            >
              <ImageWithFallback
                src="/students socializing.jpeg"
                alt="Building blocks"
                className="w-full h-[300px] object-cover"
              />
              <div className="p-5 bg-[#3C3C3C] border-t-4 border-black">
                <p className="text-white font-mono text-sm text-center">Build your knowledge, one block at a time</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-8 py-16 bg-gradient-to-br from-[#72b149] to-[#55942c] border-y-8 border-black">
          <div className="max-w-4xl mx-auto text-center">
            <h3
              className="text-4xl text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)] mb-4"
              style={{ fontFamily: 'monospace', letterSpacing: '2px' }}
            >
              READY TO START BUILDING?
            </h3>
            <p className="text-white/90 font-mono text-lg mb-5 drop-shadow-[2px_2px_1px_rgba(0,0,0,0.8)]">
              Join MindCraft today and transform the way you learn!
            </p>
            <div className="flex gap-4 justify-center">
              <MinecraftButton onClick={() => navigate('/login')} className="!bg-[#3C3C3C] !text-white">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} />
                  LOGIN
                </div>
              </MinecraftButton>
              <MinecraftButton onClick={() => navigate('/signup')} className="!bg-[#FCD34D] !text-white">
                <div className="flex items-center gap-2">
                  <Pickaxe size={18} />
                  CREATE ACCOUNT
                </div>
              </MinecraftButton>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-8 py-3 bg-[#3C3C3C] border-black">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-white/50 font-mono text-sm">
              © 2026 MindCraft: Build Your Knowledge, Block by Block.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}