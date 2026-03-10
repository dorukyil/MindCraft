import { useNavigate } from 'react-router';
import { MinecraftButton } from '../components/MinecraftButton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { BookOpen, Clock, CheckCircle, Lock } from 'lucide-react';

type LessonStatus = 'completed' | 'in-progress' | 'locked';

const lessons = [
  {
    id: 1,
    module: 'Vocabulary',
    title: 'Everyday Words',
    description: 'Build your core vocabulary with the most common words used in daily conversation.',
    status: 'completed' as LessonStatus,
    progress: 100,
    xp: 150,
  },
  {
    id: 2,
    module: 'Vocabulary',
    title: 'Idioms & Expressions',
    description: 'Master common idioms and phrases that native speakers use all the time.',
    status: 'completed' as LessonStatus,
    progress: 100,
    xp: 200,
  },
  {
    id: 3,
    module: 'Grammar',
    title: 'Nouns & Pronouns',
    description: 'Understand how to use nouns and pronouns correctly in sentences.',
    status: 'in-progress' as LessonStatus,
    progress: 45,
    xp: 250,
  },
  {
    id: 4,
    module: 'Grammar',
    title: 'Verb Tenses',
    description: 'Learn past, present, and future tenses to talk about any point in time.',
    status: 'locked' as LessonStatus,
    progress: 0,
    xp: 300,
  },
  {
    id: 5,
    module: 'Reading',
    title: 'Reading Comprehension',
    description: 'Practice understanding written passages and answering questions about them.',
    status: 'locked' as LessonStatus,
    progress: 0,
    xp: 350,
  },
  {
    id: 6,
    module: 'Writing',
    title: 'Sentence Structure',
    description: 'Construct clear, well-formed sentences using proper syntax and punctuation.',
    status: 'locked' as LessonStatus,
    progress: 0,
    xp: 400,
  },
];

const statusConfig = {
  completed: {
    label: 'COMPLETED',
    labelColor: 'text-[#72b149]',
    border: 'border-[#72b149]',
    icon: CheckCircle,
    iconColor: 'text-[#72b149]',
    barColor: 'bg-[#72b149]',
  },
  'in-progress': {
    label: 'IN PROGRESS',
    labelColor: 'text-[#FCD34D]',
    border: 'border-[#FCD34D]',
    icon: Clock,
    iconColor: 'text-[#FCD34D]',
    barColor: 'bg-[#FCD34D]',
  },
  locked: {
    label: 'LOCKED',
    labelColor: 'text-white/40',
    border: 'border-white/20',
    icon: Lock,
    iconColor: 'text-white/40',
    barColor: 'bg-white/20',
  },
};

export function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const completedCount = lessons.filter(l => l.status === 'completed').length;
  const totalXp = lessons.filter(l => l.status === 'completed').reduce((sum, l) => sum + l.xp, 0);

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
          <MinecraftButton onClick={handleLogout}>
            LOGOUT
          </MinecraftButton>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Welcome + stats bar */}
          <div
            className="bg-gradient-to-br from-[#976d4c] to-[#7b583d] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-6 mb-6"
            style={{ imageRendering: 'pixelated' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2
                  className="text-2xl text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]"
                  style={{ fontFamily: 'monospace', letterSpacing: '2px' }}
                >
                  WELCOME BACK!
                </h2>
                <p className="text-[#FCD34D] font-mono text-xs mt-1 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                  Build Your Knowledge, Block by Block
                </p>
              </div>
              <div className="flex gap-4">
                <div className="bg-[#3C3C3C] border-4 border-black px-4 py-2 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
                  <p className="text-[#72b149] font-mono text-xl font-bold drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">{completedCount}/{lessons.length}</p>
                  <p className="text-white/60 font-mono text-xs">LESSONS</p>
                </div>
                <div className="bg-[#3C3C3C] border-4 border-black px-4 py-2 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
                  <p className="text-[#FCD34D] font-mono text-xl font-bold drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">{totalXp}</p>
                  <p className="text-white/60 font-mono text-xs">XP EARNED</p>
                </div>
              </div>
            </div>

            {/* Overall progress bar */}
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span className="text-white font-mono text-xs">OVERALL PROGRESS</span>
                <span className="text-white font-mono text-xs">{Math.round((completedCount / lessons.length) * 100)}%</span>
              </div>
              <div className="h-4 bg-[#3C3C3C] border-2 border-black">
                <div
                  className="h-full bg-[#72b149] transition-all"
                  style={{ width: `${(completedCount / lessons.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Lesson blocks */}
          <div
            className="bg-gradient-to-br from-[#976d4c] to-[#7b583d] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-6"
            style={{ imageRendering: 'pixelated' }}
          >
            <h3
              className="text-lg text-white mb-4 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: 'monospace', letterSpacing: '2px' }}
            >
              YOUR LESSONS
            </h3>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[#72b149] to-transparent" />
              <div className="w-2 h-2 bg-[#72b149] rotate-45" />
              <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[#72b149] to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {lessons.map((lesson) => {
                const cfg = statusConfig[lesson.status];
                const Icon = cfg.icon;
                return (
                  <div
                    key={lesson.id}
                    className={`bg-[#3C3C3C] border-4 ${cfg.border} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-4 flex flex-col gap-3 ${lesson.status === 'locked' ? 'opacity-60' : ''}`}
                  >
                    {/* Module tag + status */}
                    <div className="flex items-center justify-between">
                      <span className="text-white/50 font-mono text-xs">{lesson.module}</span>
                      <div className="flex items-center gap-1">
                        <Icon size={12} className={cfg.iconColor} />
                        <span className={`font-mono text-xs ${cfg.labelColor}`}>{cfg.label}</span>
                      </div>
                    </div>

                    {/* Title + description */}
                    <div>
                      <div className="flex items-start gap-2 mb-1">
                        <BookOpen size={14} className="text-white/70 mt-0.5 shrink-0" />
                        <h4 className="text-white font-mono text-sm font-bold drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)] leading-tight">
                          {lesson.title}
                        </h4>
                      </div>
                      <p className="text-white/60 font-mono text-xs leading-relaxed pl-5">
                        {lesson.description}
                      </p>
                    </div>

                    {/* Progress bar */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white/40 font-mono text-xs">PROGRESS</span>
                        <span className="text-white/40 font-mono text-xs">{lesson.progress}%</span>
                      </div>
                      <div className="h-3 bg-black/40 border-2 border-black">
                        <div
                          className={`h-full ${cfg.barColor} transition-all`}
                          style={{ width: `${lesson.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* XP + action */}
                    <div className="flex items-center justify-between mt-auto pt-1">
                      <span className="text-[#FCD34D] font-mono text-xs drop-shadow-[1px_1px_0px_rgba(0,0,0,0.5)]">
                        +{lesson.xp} XP
                      </span>
                      <button
                        disabled={lesson.status === 'locked'}
                        className={`font-mono text-xs px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all disabled:cursor-not-allowed ${
                          lesson.status === 'completed'
                            ? 'bg-[#55942c] text-white hover:brightness-110'
                            : lesson.status === 'in-progress'
                            ? 'bg-[#FCD34D] text-black hover:brightness-110'
                            : 'bg-white/10 text-white/30'
                        }`}
                      >
                        {lesson.status === 'completed' ? 'REVIEW' : lesson.status === 'in-progress' ? 'CONTINUE' : 'LOCKED'}
                      </button>
                    </div>
                  </div>
                );
              })}
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
