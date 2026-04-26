import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { MinecraftButton } from '../components/MinecraftButton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { BookOpen, Clock, CheckCircle, Lock, Users, BarChart2 } from 'lucide-react';
import { lessons } from '../../data/lessons';
import { supabase } from '../lib/supabase/client';
import { Sidebar } from '../components/Sidebar';

type LessonStatus = 'completed' | 'in-progress' | 'locked';

const statusConfig: Record<LessonStatus, {

  label: string;

  labelColor: string;

  border: string;

  icon: typeof CheckCircle;

  iconColor: string;

  barColor: string;

}> = {

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

const progressByStatus: Record<LessonStatus, number> = {

  completed: 100,

  'in-progress': 0,

  locked: 0,

};

// ─── Teacher Dashboard ────────────────────────────────────────────────────────

function TeacherDashboard({

  firstName, onLogout,

}: { firstName: string; onLogout: () => void }) {

  const navigate = useNavigate();

  const [completionCounts, setCompletionCounts] = useState<Record<string, number>>({});

  const [avgScores, setAvgScores] = useState<Record<string, number>>({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchStats() {

      const { data } = await supabase

        .from('lesson_attempts')

        .select('lesson_id, correct_count, total_questions');

      if (data) {

        const counts: Record<string, number> = {};

        const totals: Record<string, { correct: number; questions: number }> = {};

        for (const row of data) {

          counts[row.lesson_id] = (counts[row.lesson_id] ?? 0) + 1;

          if (!totals[row.lesson_id]) totals[row.lesson_id] = { correct: 0, questions: 0 };

          totals[row.lesson_id].correct += row.correct_count;

          totals[row.lesson_id].questions += row.total_questions;

        }

        const avgs: Record<string, number> = {};

        for (const [lid, t] of Object.entries(totals)) {

          avgs[lid] = t.questions > 0 ? Math.round((t.correct / t.questions) * 100) : 100;

        }

        setCompletionCounts(counts);

        setAvgScores(avgs);

      }

      setLoading(false);

    }

    fetchStats();

  }, []);

  const modules = Array.from(new Set(lessons.map(l => l.module)));

  const totalCompletions = Object.values(completionCounts).reduce((s, v) => s + v, 0);

  return (

    <div className="size-full min-h-screen relative overflow-hidden bg-gradient-to-b from-[#83aeff] to-[#8fb9ff]">

      <div className="absolute inset-0 opacity-30">

        <div className="absolute inset-0"

          style={{

            backgroundImage: `url('https://minecraft.wiki/images/thumb/Plains_sky.png/1200px-Plains_sky.png')`,

            backgroundSize: 'cover', backgroundPosition: 'center', imageRendering: 'pixelated',

          }}

        />

      </div>

      <div className="relative z-10 min-h-screen p-8">

        {/* Sidebar */}

        <Sidebar onLogout={onLogout} />

        {/* Header */}

        <div className="flex items-center mb-8">

          <div className="flex items-center gap-4">

            <ImageWithFallback src="/mindCraft_logo_border.png" alt="MindCraft Logo" className="w-12 h-12" />

            <h1

              className="text-3xl text-white drop-shadow-[4px_4px_1px_rgba(0,0,0,0.8)]"

              style={{ fontFamily: 'monospace', imageRendering: 'pixelated', letterSpacing: '2px' }}

            >

              MINDCRAFT

            </h1>

          </div>

        </div>
        <div className="max-w-6xl mx-auto">
          {/* Welcome bar */}
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
                  TEACHER DASHBOARD{firstName ? ` — ${firstName.toUpperCase()}` : ''}
                </h2>
                <p className="text-[#FCD34D] font-mono text-xs mt-1 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                  Click any lesson to see student results and wrong answers
                </p>
              </div>
              <div className="flex gap-4">
                <div className="bg-[#3C3C3C] border-4 border-black px-4 py-2 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
                  <p className="text-[#83aeff] font-mono text-xl font-bold">{lessons.length}</p>
                  <p className="text-white/60 font-mono text-xs">LESSONS</p>
                </div>
                <div className="bg-[#3C3C3C] border-4 border-black px-4 py-2 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
                  <p className="text-[#FCD34D] font-mono text-xl font-bold">
                    {loading ? '…' : totalCompletions}
                  </p>
                  <p className="text-white/60 font-mono text-xs">COMPLETIONS</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson analytics cards grouped by module */}
          {modules.map(module => {
            const moduleLessons = lessons.filter(l => l.module === module);
            return (
              <div
                key={module}
                className="bg-gradient-to-br from-[#976d4c] to-[#7b583d] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-6 mb-6"
                style={{ imageRendering: 'pixelated' }}
              >
                <h3
                  className="text-lg text-white mb-4 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]"
                  style={{ fontFamily: 'monospace', letterSpacing: '2px' }}
                >
                  {module} LESSONS
                </h3>
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[#72b149] to-transparent" />
                  <div className="w-2 h-2 bg-[#72b149] rotate-45" />
                  <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[#72b149] to-transparent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {moduleLessons.map(lesson => {
                    const count = completionCounts[lesson.id] ?? 0;
                    const avg = avgScores[lesson.id];
                    const avgColor = avg === undefined ? 'text-white/40' : avg >= 80 ? 'text-[#72b149]' : avg >= 50 ? 'text-[#FCD34D]' : 'text-red-400';
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => navigate(`/teacher/lesson/${lesson.id}`)}
                        className="bg-[#3C3C3C] border-4 border-[#83aeff]/60 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-4 flex flex-col gap-3 cursor-pointer hover:brightness-110 transition-all"
                      >
                        {/* Module tag + analytics icon */}
                        <div className="flex items-center justify-between">
                          <span className="text-white/50 font-mono text-xs">{lesson.module}</span>
                          <BarChart2 size={14} className="text-[#83aeff]" />
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

                        {/* Stats row */}
                        <div className="flex items-center justify-between mt-auto pt-2 border-t-2 border-black/30">
                          <div className="flex items-center gap-1.5">
                            <Users size={12} className="text-[#83aeff]" />
                            <span className="text-[#83aeff] font-mono text-xs font-bold">
                              {loading ? '…' : `${count} student${count !== 1 ? 's' : ''}`}
                            </span>
                          </div>
                          <span className={`font-mono text-xs font-bold ${avgColor}`}>
                            {loading ? '…' : avg !== undefined ? `avg ${avg}%` : 'no data'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex justify-center gap-2">
                  <div className="w-3 h-3 bg-[#82c159] border-2 border-black" />
                  <div className="w-3 h-3 bg-[#72b149] border-2 border-black" />
                  <div className="w-3 h-3 bg-[#55942c] border-2 border-black" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Student Dashboard ────────────────────────────────────────────────────────
function StudentDashboard({
  firstName, role, onLogout,
}: { firstName: string; role: string; onLogout: () => void }) {
  const navigate = useNavigate();
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [totalXp, setTotalXp] = useState(0);

  useEffect(() => {
    async function fetchProgress() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('lesson_attempts')
        .select('lesson_id, xp_earned')
        .eq('user_id', user.id);
      if (data) {
        setCompletedIds(new Set(data.map(a => a.lesson_id as string)));
        setTotalXp(data.reduce((sum, a) => sum + (a.xp_earned as number), 0));
      }
    }
    fetchProgress();
  }, []);

  const completedCount = completedIds.size;
  const modules = Array.from(new Set(lessons.map(l => l.module)));

  function getStatus(lesson: typeof lessons[0]): LessonStatus {
    if (completedIds.has(lesson.id)) return 'completed';
    const moduleLessons = lessons.filter(l => l.module === lesson.module);
    const idx = moduleLessons.findIndex(l => l.id === lesson.id);
    if (idx === 0) return 'in-progress';
    const prev = moduleLessons[idx - 1];
    return completedIds.has(prev.id) ? 'in-progress' : 'locked';
  }

  function handleLessonClick(lesson: typeof lessons[0]) {
    if (getStatus(lesson) === 'locked') return;
    navigate(`/lesson/${lesson.id}`);
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-[#83aeff] to-[#8fb9ff]">
      {/* Minecraft sky background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `url('https://minecraft.wiki/images/thumb/Plains_sky.png/1200px-Plains_sky.png')`,
            backgroundSize: 'cover', backgroundPosition: 'center', imageRendering: 'pixelated',
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <ImageWithFallback src="/mindCraft_logo_border.png" alt="MindCraft Logo" className="w-12 h-12" />
            <h1
              className="text-3xl text-white drop-shadow-[4px_4px_1px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: 'monospace', imageRendering: 'pixelated', letterSpacing: '2px' }}
            >
              MINDCRAFT
            </h1>
          </div>
          <Sidebar onLogout={onLogout} />
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
                  WELCOME BACK{role ? ` ${role.toUpperCase()}` : ''}{firstName ? ` ${firstName.toUpperCase()}` : ''}!
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

          {/* Lesson blocks grouped by module */}
          {modules.map(module => {
            const moduleLessons = lessons.filter(l => l.module === module);
            return (
              <div
                key={module}
                className="bg-gradient-to-br from-[#976d4c] to-[#7b583d] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-6 mb-6"
                style={{ imageRendering: 'pixelated' }}
              >
                <h3
                  className="text-lg text-white mb-4 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]"
                  style={{ fontFamily: 'monospace', letterSpacing: '2px' }}
                >
                  {module} LESSONS
                </h3>
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[#72b149] to-transparent" />
                  <div className="w-2 h-2 bg-[#72b149] rotate-45" />
                  <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[#72b149] to-transparent" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {moduleLessons.map(lesson => {
                    const status = getStatus(lesson);
                    const cfg = statusConfig[status];
                    const Icon = cfg.icon;
                    const progress = progressByStatus[status];
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson)}
                        className={`bg-[#3C3C3C] border-4 ${cfg.border} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-4 flex flex-col gap-3 ${
                          status === 'locked' ? 'opacity-60' : 'cursor-pointer hover:brightness-110 transition-all'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-white/50 font-mono text-xs">{lesson.module}</span>
                          <div className="flex items-center gap-1">
                            <Icon size={12} className={cfg.iconColor} />
                            <span className={`font-mono text-xs ${cfg.labelColor}`}>{cfg.label}</span>
                          </div>
                        </div>
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
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-white/40 font-mono text-xs">PROGRESS</span>
                            <span className="text-white/40 font-mono text-xs">{progress}%</span>
                          </div>
                          <div className="h-3 bg-black/40 border-2 border-black">
                            <div className={`h-full ${cfg.barColor} transition-all`} style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-1">
                          <span className="text-[#FCD34D] font-mono text-xs drop-shadow-[1px_1px_0px_rgba(0,0,0,0.5)]">
                            +{lesson.xp} XP
                          </span>
                          <button
                            disabled={status === 'locked'}
                            onClick={e => { e.stopPropagation(); handleLessonClick(lesson); }}
                            className={`font-mono text-xs px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all disabled:cursor-not-allowed ${
                              status === 'completed'
                                ? 'bg-[#55942c] text-white hover:brightness-110'
                                : status === 'in-progress'
                                ? 'bg-[#FCD34D] text-black hover:brightness-110'
                                : 'bg-white/10 text-white/30'
                            }`}
                          >
                            {status === 'completed' ? 'REVIEW' : status === 'in-progress' ? 'START' : 'LOCKED'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 flex justify-center gap-2">
                  <div className="w-3 h-3 bg-[#82c159] border-2 border-black" />
                  <div className="w-3 h-3 bg-[#72b149] border-2 border-black" />
                  <div className="w-3 h-3 bg-[#55942c] border-2 border-black" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard (role router) ──────────────────────────────────────────────────
export function Dashboard() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [role, setRole] = useState('');
  const [roleLoaded, setRoleLoaded] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate('/login');
        return;
      }
      const meta = user.user_metadata;
      const fullName: string = meta?.full_name ?? meta?.name ?? '';
      setFirstName(fullName.split(' ')[0]);
      setRole(meta?.role ?? '');
      setRoleLoaded(true);
    });
  }, []);

  const handleLogout = () => navigate('/');

  if (!roleLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#83aeff] to-[#8fb9ff]">
        <p className="text-white font-mono text-sm animate-pulse">LOADING...</p>
      </div>
    );
  }

  if (role === 'teacher') {
    return <TeacherDashboard firstName={firstName} onLogout={handleLogout} />;
  }

  return <StudentDashboard firstName={firstName} role={role} onLogout={handleLogout} />;
}