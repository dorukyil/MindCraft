import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Star, BookOpen, Target, ClipboardList, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase/client';
import { lessons } from '../../data/lessons';
import { MinecraftButton } from '../components/MinecraftButton';

interface Attempt {
  lesson_id: string;
  completed_at: string;
  correct_count: number;
  total_questions: number;
  xp_earned: number;
}

interface AssignmentRow {
  id: string;
  title: string;
  due_date: string | null;
  submission: {
    submitted_at: string;
    file_name: string;
    grade: string | null;
    feedback: string | null;
    graded_at: string | null;
  } | null;
}

function xpToLevel(xp: number): { level: number; current: number; needed: number } {
  const level = Math.floor(xp / 500) + 1;
  const current = xp % 500;
  const needed = 500;
  return { level, current, needed };
}

function lessonTitle(lessonId: string, uploaded: { id: string; title: string }[]): string {
  const stat = lessons.find(l => l.id === lessonId);
  if (stat) return stat.title;
  const up = uploaded.find(l => l.id === lessonId);
  return up?.title ?? lessonId;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function Profile() {
  const [name, setName] = useState('');
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
  const [uploadedTitles, setUploadedTitles] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setName(user.user_metadata?.full_name ?? '');

      const [attemptsRes, assignmentsRes, uploadedRes] = await Promise.all([
        supabase
          .from('lesson_attempts')
          .select('lesson_id, completed_at, correct_count, total_questions, xp_earned')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false }),
        supabase
          .from('assignments')
          .select(`
            id, title, due_date,
            assignment_submissions!left(submitted_at, file_name, grade, feedback, graded_at)
          `)
          .order('created_at', { ascending: false }),
        supabase.from('uploaded_lessons').select('id, lesson_data->title'),
      ]);

      if (attemptsRes.data) setAttempts(attemptsRes.data);

      if (assignmentsRes.data) {
        const userId = user.id;
        // filter submissions to only this user's
        const rows: AssignmentRow[] = await Promise.all(
          assignmentsRes.data.map(async (a: any) => {
            const { data: sub } = await supabase
              .from('assignment_submissions')
              .select('submitted_at, file_name, grade, feedback, graded_at')
              .eq('assignment_id', a.id)
              .eq('user_id', userId)
              .maybeSingle();
            return { id: a.id, title: a.title, due_date: a.due_date, submission: sub ?? null };
          })
        );
        setAssignments(rows);
      }

      if (uploadedRes.data) {
        setUploadedTitles(uploadedRes.data.map((r: any) => ({ id: r.id, title: r.title as string })));
      }

      setLoading(false);
    }
    load();
  }, []);

  const totalXp = attempts.reduce((s, a) => s + a.xp_earned, 0);
  const { level, current, needed } = xpToLevel(totalXp);
  const totalCorrect = attempts.reduce((s, a) => s + a.correct_count, 0);
  const totalQuestions = attempts.reduce((s, a) => s + a.total_questions, 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const submitted = assignments.filter(a => a.submission).length;
  const graded = assignments.filter(a => a.submission?.grade).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#83aeff] to-[#8fb9ff] p-6">
      {/* Back to dashboard button */}
      <div className="flex items-center gap-4 mb-8">
        <MinecraftButton
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 font-mono text-xl transition-colors">
          <ArrowLeft size={16} />
          DASHBOARD
        </MinecraftButton>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-white font-mono text-sm animate-pulse">
          LOADING...
        </div>
      ) : (
        <div className="max-w-3xl mx-auto flex flex-col gap-6">

          {/* ── Player card ── */}
          <div className="bg-[#3C3C3C] border-4 border-black shadow-[6px_6px_0px_black] p-6 flex items-center gap-6">
            <div className="w-16 h-16 bg-[#976d4c] border-4 border-black flex items-center justify-center text-white font-mono text-2xl font-bold shadow-[4px_4px_0px_black] shrink-0">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-mono text-lg font-bold truncate">{name || 'PLAYER'}</p>
              <p className="text-white/50 font-mono text-xs">LEVEL {level}</p>
              {/* XP bar */}
              <div className="mt-2 w-full bg-black/40 border-2 border-black h-4 relative">
                <div
                  className="h-full bg-[#FCD34D] transition-all duration-500"
                  style={{ width: `${Math.round((current / needed) * 100)}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-black font-bold">
                  {current} / {needed} XP
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[#FCD34D] font-mono text-2xl font-bold">{totalXp}</p>
              <p className="text-white/50 font-mono text-xs">TOTAL XP</p>
            </div>
          </div>

          {/* ── Stats row ── */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: BookOpen, label: 'LESSONS', value: attempts.length, color: 'text-[#83aeff]' },
              { icon: Target, label: 'ACCURACY', value: `${accuracy}%`, color: 'text-[#72b149]' },
              { icon: ClipboardList, label: 'SUBMITTED', value: `${submitted}/${assignments.length}`, color: 'text-[#FCD34D]' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-[#3C3C3C] border-4 border-black shadow-[4px_4px_0px_black] p-4 flex flex-col items-center gap-1">
                <Icon size={18} className={color} />
                <p className={`font-mono text-xl font-bold ${color}`}>{value}</p>
                <p className="font-mono text-[10px] text-white/40">{label}</p>
              </div>
            ))}
          </div>

          {/* ── Lesson history ── */}
          <div className="bg-[#3C3C3C] border-4 border-black shadow-[6px_6px_0px_black]">
            <div className="px-5 py-3 border-b-4 border-black flex items-center gap-2">
              <BookOpen size={14} className="text-[#83aeff]" />
              <h2 className="text-white font-mono text-sm font-bold">LESSON HISTORY</h2>
              <span className="ml-auto text-white/30 font-mono text-xs">{attempts.length} attempts</span>
            </div>

            {attempts.length === 0 ? (
              <p className="text-white/40 font-mono text-xs text-center py-8">No lessons completed yet.</p>
            ) : (
              <div className="divide-y-2 divide-black/40 max-h-72 overflow-y-auto">
                {attempts.map((a, i) => {
                  const pct = a.total_questions > 0 ? Math.round((a.correct_count / a.total_questions) * 100) : 100;
                  const scoreColor = pct >= 80 ? 'text-[#72b149]' : pct >= 50 ? 'text-[#FCD34D]' : 'text-red-400';
                  return (
                    <div key={i} className="px-5 py-3 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-mono text-xs font-bold truncate">
                          {lessonTitle(a.lesson_id, uploadedTitles)}
                        </p>
                        <p className="text-white/40 font-mono text-[10px]">{fmtDate(a.completed_at)}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`font-mono text-sm font-bold ${scoreColor}`}>{pct}%</p>
                        <p className="text-[#FCD34D] font-mono text-[10px]">+{a.xp_earned} XP</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Assignment tracker ── */}
          <div className="bg-[#3C3C3C] border-4 border-black shadow-[6px_6px_0px_black]">
            <div className="px-5 py-3 border-b-4 border-black flex items-center gap-2">
              <ClipboardList size={14} className="text-[#FCD34D]" />
              <h2 className="text-white font-mono text-sm font-bold">ASSIGNMENTS</h2>
              <span className="ml-auto text-white/30 font-mono text-xs">{graded} graded</span>
            </div>

            {assignments.length === 0 ? (
              <p className="text-white/40 font-mono text-xs text-center py-8">No assignments yet.</p>
            ) : (
              <div className="divide-y-2 divide-black/40">
                {assignments.map(a => {
                  const sub = a.submission;
                  const overdue = !sub && a.due_date && new Date(a.due_date) < new Date();
                  return (
                    <div key={a.id} className="px-5 py-3 flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {sub ? (
                          <CheckCircle size={14} className={sub.grade ? 'text-[#72b149]' : 'text-[#83aeff]'} />
                        ) : (
                          <Clock size={14} className={overdue ? 'text-red-400' : 'text-white/30'} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-mono text-xs font-bold truncate">{a.title}</p>
                        {a.due_date && (
                          <p className={`font-mono text-[10px] ${overdue ? 'text-red-400' : 'text-white/40'}`}>
                            Due {fmtDate(a.due_date)}{overdue ? ' — OVERDUE' : ''}
                          </p>
                        )}
                        {sub && !sub.grade && (
                          <p className="text-[#83aeff] font-mono text-[10px]">Submitted — awaiting grade</p>
                        )}
                        {sub?.grade && (
                          <div className="mt-1 flex items-center gap-2">
                            <Star size={11} className="text-[#FCD34D]" />
                            <span className="text-[#FCD34D] font-mono text-xs font-bold">{sub.grade}</span>
                            {sub.feedback && (
                              <span className="text-white/50 font-mono text-[10px] truncate">{sub.feedback}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        {!sub && (
                          <span className={`font-mono text-[10px] ${overdue ? 'text-red-400' : 'text-white/30'}`}>
                            NOT SUBMITTED
                          </span>
                        )}
                        {sub && !sub.grade && (
                          <span className="font-mono text-[10px] text-[#83aeff]">PENDING</span>
                        )}
                        {sub?.grade && (
                          <span className="font-mono text-[10px] text-[#72b149]">GRADED</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
