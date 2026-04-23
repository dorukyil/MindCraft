import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { MinecraftButton } from '../components/MinecraftButton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ArrowLeft } from 'lucide-react';

type LessonStatus = 'completed' | 'in-progress' | 'locked';

const lessonsData = [
  {
    id: 1,
    module: 'Module 1',
    title: 'WASSCE (West African Senior School Certificate)',
    description: '',
    status: 'in-progress' as LessonStatus,
    progress: 0,
    xp: 150,
  },
  {
    id: 2,
    module: 'Module 2',
    title: 'BECE (Basic Education Certificate Examination)',
    description: '',
    status: 'in-progress' as LessonStatus,
    progress: 0,
    xp: 200,
  },
  {
    id: 3,
    module: 'Module 3',
    title: 'Lesson 3',
    description: '',
    status: 'in-progress' as LessonStatus,
    progress: 0,
    xp: 250,
  },
];

export function Lesson() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<typeof lessonsData[0] | null>(null);

  useEffect(() => {
    const lessonId = parseInt(id || '0', 10);
    const foundLesson = lessonsData.find(l => l.id === lessonId);

    if (foundLesson) {
      setLesson(foundLesson);
    } else {
      // If lesson not found, redirect back to dashboard
      navigate('/dashboard');
    }
  }, [id, navigate]);

  if (!lesson) {
    return null;
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-[#83aeff] to-[#8fb9ff]">
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
              src="/mindCraft_logo_border.png"
              alt="MindCraft Logo"
              className="w-12 h-12"
            />
            <h1
              className="text-3xl text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: 'monospace', imageRendering: 'pixelated', letterSpacing: '2px' }}
            >
              MINDCRAFT
            </h1>
          </div>
          <MinecraftButton onClick={() => navigate('/dashboard')}>
            <div className="flex items-center gap-2">
              <ArrowLeft size={16} />
              BACK TO DASHBOARD
            </div>
          </MinecraftButton>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Lesson Header */}
          <div
            className="bg-gradient-to-br from-[#976d4c] to-[#7b583d] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-6 mb-6"
            style={{ imageRendering: 'pixelated' }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h2
                  className="text-3xl text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)] mb-2"
                  style={{ fontFamily: 'monospace', letterSpacing: '2px' }}
                >
                  {lesson.title.toUpperCase()}
                </h2>
              </div>
              <div className="bg-[#3C3C3C] border-4 border-black px-4 py-2 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
                <p className="text-[#FCD34D] font-mono text-2xl font-bold drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">+{lesson.xp}</p>
                <p className="text-white/60 font-mono text-xs">XP</p>
              </div>
            </div>

            {/* African-inspired decorative divider */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[#72b149] to-transparent" />
              <div className="w-2 h-2 bg-[#72b149] rotate-45" />
              <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[#72b149] to-transparent" />
            </div>
          </div>

          {/* Empty Content Area */}
          <div
            className="bg-gradient-to-br from-[#976d4c] to-[#7b583d] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-6"
            style={{ imageRendering: 'pixelated' }}
          >
            <div className="min-h-[400px] flex items-center justify-center">
              <p className="text-white/60 font-mono text-sm">Lesson content coming soon...</p>
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