import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { supabase } from '../lib/supabase/client';
import { lessons } from '../../data/lessons';
import type { Lesson } from '../../data/lessons';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ArrowLeft, ChevronDown, ChevronRight, CheckCircle, XCircle, Users, Loader2 } from 'lucide-react';
import { MinecraftButton } from '../components/MinecraftButton';

interface Attempt {
  id: string;
  user_id: string;
  user_name: string;
  completed_at: string;
  correct_count: number;
  total_questions: number;
  xp_earned: number;
}

interface Answer {
  id: string;
  attempt_id: string;
  step_index: number;
  question: string;
  selected_option: string;
  correct_option: string;
  is_correct: boolean;
}

export function TeacherLessonView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<Lesson | null | undefined>(undefined);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      setLoading(true);

      // Try static lessons first, then fall back to uploaded_lessons
      const staticLesson = lessons.find(l => l.id === id);
      if (staticLesson) {
        setLesson(staticLesson);
      } else {
        const { data } = await supabase
          .from('uploaded_lessons')
          .select('lesson_data')
          .eq('lesson_data->>id', id)
          .maybeSingle();
        setLesson(data ? (data.lesson_data as Lesson) : null);
      }

      const [attemptsRes, answersRes] = await Promise.all([
        supabase
          .from('lesson_attempts')
          .select('*')
          .eq('lesson_id', id)
          .order('completed_at', { ascending: false }),
        supabase
          .from('lesson_answers')
          .select('*')
          .eq('lesson_id', id),
      ]);

      setAttempts(attemptsRes.data ?? []);
      setAnswers(answersRes.data ?? []);
      setLoading(false);
    }

    fetchData();
  }, [id]);

  function toggleExpand(attemptId: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(attemptId) ? next.delete(attemptId) : next.add(attemptId);
      return next;
    });
  }

  function wrongAnswersFor(attemptId: string) {
    return answers.filter(a => a.attempt_id === attemptId && !a.is_correct);
  }

  function pct(correct: number, total: number) {
    return total > 0 ? Math.round((correct / total) * 100) : 100;
  }

  function scoreColor(p: number) {
    if (p >= 80) return 'text-[#72b149]';
    if (p >= 50) return 'text-[#FCD34D]';
    return 'text-red-400';
  }

  const avgScore = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + pct(a.correct_count, a.total_questions), 0) / attempts.length)
    : 0;

  if (lesson === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#83aeff] to-[#8fb9ff]">
        <p className="text-white font-mono text-sm animate-pulse">LOADING...</p>
      </div>
    );
  }

  if (lesson === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#83aeff] to-[#8fb9ff]">
        <p className="text-white font-mono">Lesson not found.</p>
      </div>
    );
  }

  return (
    <div className="size-full min-h-screen relative overflow-hidden bg-gradient-to-b from-[#83aeff] to-[#8fb9ff]">
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://minecraft.wiki/images/thumb/Plains_sky.png/1200px-Plains_sky.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            imageRendering: 'pixelated',
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">

          <MinecraftButton onClick={() => navigate('/dashboard')}>
            <div className="flex items-center gap-2">
              <ArrowLeft size={16} />
              DASHBOARD
            </div>
          </MinecraftButton>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {/* Lesson info + stats */}
          <div className="bg-gradient-to-br from-[#976d4c] to-[#7b583d] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-white/50 font-mono text-xs">{lesson.module} — TEACHER VIEW</span>
                <h2
                  className="text-2xl text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)] mt-1"
                  style={{ fontFamily: 'monospace', letterSpacing: '1px' }}
                >
                  {lesson.title}
                </h2>
                <p className="text-white/60 font-mono text-xs mt-1">{lesson.description}</p>
              </div>
              <div className="flex gap-4 shrink-0">
                <div className="bg-[#3C3C3C] border-4 border-black px-4 py-2 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
                  <p className="text-[#83aeff] font-mono text-xl font-bold">{attempts.length}</p>
                  <p className="text-white/60 font-mono text-xs">COMPLETIONS</p>
                </div>
                <div className="bg-[#3C3C3C] border-4 border-black px-4 py-2 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
                  <p className={`font-mono text-xl font-bold ${scoreColor(avgScore)}`}>{attempts.length > 0 ? `${avgScore}%` : '—'}</p>
                  <p className="text-white/60 font-mono text-xs">AVG SCORE</p>
                </div>
              </div>
            </div>
          </div>

          {/* Student list */}
          <div className="bg-gradient-to-br from-[#976d4c] to-[#7b583d] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users size={18} className="text-white/70" />
              <h3
                className="text-lg text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]"
                style={{ fontFamily: 'monospace', letterSpacing: '2px' }}
              >
                STUDENT RESULTS
              </h3>
            </div>

            <div className="flex items-center gap-2 mb-5">
              <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[#72b149] to-transparent" />
              <div className="w-2 h-2 bg-[#72b149] rotate-45" />
              <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[#72b149] to-transparent" />
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-3 py-12 text-white/50 font-mono text-sm">
                <Loader2 size={18} className="animate-spin" />
                LOADING RESULTS...
              </div>
            ) : attempts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/40 font-mono text-sm">No students have completed this lesson yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {attempts.map(attempt => {
                  const score = pct(attempt.correct_count, attempt.total_questions);
                  const wrong = wrongAnswersFor(attempt.id);
                  const isOpen = expanded.has(attempt.id);
                  const date = new Date(attempt.completed_at).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  });

                  return (
                    <div
                      key={attempt.id}
                      className="bg-[#3C3C3C] border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]"
                    >
                      {/* Student row header */}
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                        onClick={() => toggleExpand(attempt.id)}
                      >
                        {/* Expand icon */}
                        <span className="text-white/40 shrink-0">
                          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </span>

                        {/* Name */}
                        <span className="text-white font-mono text-sm font-bold flex-1 truncate">
                          {attempt.user_name}
                        </span>

                        {/* Score badge */}
                        <span className={`font-mono text-sm font-bold shrink-0 ${scoreColor(score)}`}>
                          {attempt.total_questions > 0
                            ? `${attempt.correct_count}/${attempt.total_questions} (${score}%)`
                            : 'N/A'}
                        </span>

                        {/* Date */}
                        <span className="text-white/40 font-mono text-xs shrink-0 hidden sm:block">{date}</span>

                        {/* Wrong count pill */}
                        {wrong.length > 0 && (
                          <span className="bg-red-500/20 border border-red-500/40 text-red-400 font-mono text-xs px-2 py-0.5 shrink-0">
                            {wrong.length} WRONG
                          </span>
                        )}
                        {wrong.length === 0 && attempt.total_questions > 0 && (
                          <span className="bg-[#72b149]/20 border border-[#72b149]/40 text-[#72b149] font-mono text-xs px-2 py-0.5 shrink-0">
                            PERFECT
                          </span>
                        )}
                      </button>

                      {/* Expanded: wrong answers */}
                      {isOpen && (
                        <div className="border-t-2 border-black/40 px-4 pb-4 pt-3">
                          {wrong.length === 0 ? (
                            <div className="flex items-center gap-2 text-[#72b149] font-mono text-xs py-2">
                              <CheckCircle size={14} />
                              All questions answered correctly!
                            </div>
                          ) : (
                            <div className="flex flex-col gap-3">
                              <p className="text-white/40 font-mono text-xs mb-1">INCORRECT ANSWERS:</p>
                              {wrong.map((ans, i) => (
                                <div
                                  key={ans.id ?? i}
                                  className="bg-black/30 border-l-4 border-red-500/60 px-3 py-2 flex flex-col gap-1.5"
                                >
                                  <p className="text-white/80 font-mono text-xs font-bold leading-snug">
                                    Q: {ans.question}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <XCircle size={12} className="text-red-400 shrink-0" />
                                    <span className="text-red-400 font-mono text-xs">
                                      Answered: {ans.selected_option}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <CheckCircle size={12} className="text-[#72b149] shrink-0" />
                                    <span className="text-[#72b149] font-mono text-xs">
                                      Correct: {ans.correct_option}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-[#82c159] border-2 border-black" />
            <div className="w-3 h-3 bg-[#72b149] border-2 border-black" />
            <div className="w-3 h-3 bg-[#55942c] border-2 border-black" />
          </div>
        </div>
      </div>
    </div>
  );
}
