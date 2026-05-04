import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { MinecraftButton } from '../components/MinecraftButton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { BookOpen, Clock, CheckCircle, Lock, Users, BarChart2, Upload, ClipboardList, Copy, Check, LogIn, School, Eye, EyeOff } from 'lucide-react';
import { lessons } from '../../data/lessons';
import type { Lesson } from '../../data/lessons';
import { supabase } from '../lib/supabase/client';
import { Sidebar } from '../components/Sidebar';
import { UploadLessonModal } from '../components/UploadLessonModal';
import { UploadAssignmentModal } from '../components/UploadAssignmentModal';
import { AssignmentSection } from '../components/AssignmentSection';

interface Classroom {
  id: string;
  class_code: string;
  name: string;
}

function generateClassCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

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

  const [uploadedLessons, setUploadedLessons] = useState<Lesson[]>([]);

  const [showUpload, setShowUpload] = useState(false);

  const [showUploadAssignment, setShowUploadAssignment] = useState(false);

  const [assignmentRefreshKey, setAssignmentRefreshKey] = useState(0);

  const [classroom, setClassroom] = useState<(Classroom & { student_count: number }) | null>(null);
  const [classroomLoading, setClassroomLoading] = useState(true);
  const [codeCopied, setCodeCopied] = useState(false);
  const [codeVisible, setCodeVisible] = useState(false);
  const [classroomNameInput, setClassroomNameInput] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [renamingName, setRenamingName] = useState('');
  const [showRoster, setShowRoster] = useState(false);
  const [roster, setRoster] = useState<{ student_name: string | null; joined_at: string }[]>([]);
  const [rosterLoading, setRosterLoading] = useState(false);

  async function fetchUploadedLessons() {
    const { data } = await supabase.from('uploaded_lessons').select('lesson_data').order('created_at', { ascending: true });
    if (data) setUploadedLessons(data.map(r => r.lesson_data as Lesson));
  }

  async function fetchClassroom() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setClassroomLoading(false); return; }

    const { data } = await supabase
      .from('classrooms')
      .select('id, class_code, name')
      .eq('teacher_id', user.id)
      .maybeSingle();

    if (data) {
      const { count } = await supabase
        .from('classroom_members')
        .select('*', { count: 'exact', head: true })
        .eq('classroom_id', data.id);
      setClassroom({ ...data, student_count: count ?? 0 });
    }
    setClassroomLoading(false);
  }

  async function fetchRoster(classroomId: string) {
    setRosterLoading(true);
    const { data } = await supabase
      .from('classroom_members')
      .select('student_name, joined_at')
      .eq('classroom_id', classroomId)
      .order('joined_at', { ascending: true });
    setRoster(data ?? []);
    setRosterLoading(false);
  }

  async function createClassroom() {
    const name = classroomNameInput.trim() || 'My Classroom';
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const code = generateClassCode();
    const { data, error } = await supabase
      .from('classrooms')
      .insert({ teacher_id: user.id, class_code: code, name })
      .select('id, class_code, name')
      .single();

    if (error) {
      console.error('createClassroom error:', error);
      alert(`Failed to create classroom: ${error.message}`);
      return;
    }
    if (data) setClassroom({ ...data, student_count: 0 });
  }

  function copyCode() {
    if (!classroom) return;
    navigator.clipboard.writeText(classroom.class_code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }

  function toggleRoster() {
    if (!classroom) return;
    if (!showRoster) fetchRoster(classroom.id);
    setShowRoster(r => !r);
  }

  async function renameClassroom() {
    const name = renamingName.trim();
    if (!name || !classroom) return;
    const { error } = await supabase
      .from('classrooms')
      .update({ name })
      .eq('id', classroom.id);
    if (!error) {
      setClassroom({ ...classroom, name });
      setEditingName(false);
    }
  }

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
    fetchUploadedLessons();
    fetchClassroom();

  }, []);

  const allLessons = [...lessons, ...uploadedLessons];

  const modules = Array.from(new Set(allLessons.map(l => l.module)));

  const totalCompletions = Object.values(completionCounts).reduce((s, v) => s + v, 0);

  return (

    <div className="size-full min-h-screen relative overflow-hidden bg-gradient-to-b from-[#83aeff] to-[#8fb9ff]">

      {showUpload && (
        <UploadLessonModal
          onClose={() => setShowUpload(false)}
          onUploaded={fetchUploadedLessons}
        />
      )}

      {showUploadAssignment && (
        <UploadAssignmentModal
          onClose={() => setShowUploadAssignment(false)}
          onCreated={() => setAssignmentRefreshKey(k => k + 1)}
        />
      )}

      <div className="absolute inset-0 opacity-30">

        <div className="absolute inset-0"

          style={{

            backgroundImage: `url('https://minecraft.wiki/images/thumb/Plains_sky.png/1200px-Plains_sky.png')`,

            backgroundSize: 'cover', backgroundPosition: 'center', imageRendering: 'pixelated',

          }}

        />

      </div>

      <div className="relative z-10 min-h-screen p-8">

        {/* Sidebar — self-contained with fixed positioning */}
        <Sidebar onLogout={onLogout} />

        {/* Header — centered */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <ImageWithFallback
              src="/mindCraft_logo_border.png"
              alt="MindCraft Logo"
              className="w-12 h-12"
            />
            <h1
              className="text-3xl text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]"
              style={{
                fontFamily: 'monospace',
                imageRendering: 'pixelated',
                letterSpacing: '2px',
              }}
            >
              MINDCRAFT
            </h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Welcome bar */}
          <div
              className="bg-gradient-to-br from-[#976d4c] to-[#7b583d] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-6 mb-6"
              style={{imageRendering: 'pixelated'}}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2
                    className="text-2xl text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]"
                    style={{fontFamily: 'monospace', letterSpacing: '2px'}}
                >
                  TEACHER DASHBOARD{firstName ? ` — ${firstName.toUpperCase()}` : ''}
                </h2>
                <p className="text-[#FCD34D] font-mono text-xs mt-1 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                  Click any lesson to see student results and wrong answers
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <div
                    className="bg-[#3C3C3C] border-4 border-black px-4 py-2 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
                  <p className="text-[#83aeff] font-mono text-xl font-bold">{allLessons.length}</p>
                  <p className="text-white/60 font-mono text-xs">LESSONS</p>
                </div>
                <div
                    className="bg-[#3C3C3C] border-4 border-black px-4 py-2 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
                  <p className="text-[#FCD34D] font-mono text-xl font-bold">
                    {loading ? '…' : totalCompletions}
                  </p>
                  <p className="text-white/60 font-mono text-xs">COMPLETIONS</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setShowUpload(true)}
                    className="flex items-center gap-2 bg-[#72b149] border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all hover:brightness-110"
                  >
                    <Upload size={14} className="text-white" />
                    <span className="text-white font-mono text-xs font-bold">UPLOAD LESSON</span>
                  </button>
                  <button
                    onClick={() => setShowUploadAssignment(true)}
                    className="flex items-center gap-2 bg-[#FCD34D] border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all hover:brightness-110"
                  >
                    <ClipboardList size={14} className="text-black" />
                    <span className="text-black font-mono text-xs font-bold">UPLOAD ASSIGNMENT</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Classroom section */}
          <div
            className="bg-gradient-to-br from-[#3C3C3C] to-[#2a2a2a] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-6 mb-6"
            style={{ imageRendering: 'pixelated' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <School size={18} className="text-[#83aeff]" />
              <h3
                className="text-lg text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]"
                style={{ fontFamily: 'monospace', letterSpacing: '2px' }}
              >
                YOUR CLASSROOM
              </h3>
            </div>

            {classroomLoading ? (
              <p className="text-white/40 font-mono text-xs animate-pulse">LOADING...</p>
            ) : classroom ? (
              <>
                {/* Code + stats row */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1">
                    {/* Classroom name + inline rename */}
                    {editingName ? (
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <input
                          autoFocus
                          value={renamingName}
                          onChange={e => setRenamingName(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') renameClassroom(); if (e.key === 'Escape') setEditingName(false); }}
                          className="bg-[#1a1a1a] border-4 border-[#83aeff] text-white font-mono text-sm px-3 py-1 outline-none"
                        />
                        <button onClick={renameClassroom} className="bg-[#72b149] border-4 border-black px-3 py-1 text-white font-mono text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:brightness-110">SAVE</button>
                        <button onClick={() => setEditingName(false)} className="bg-[#3C3C3C] border-4 border-black px-3 py-1 text-white/60 font-mono text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:brightness-110">CANCEL</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white/50 font-mono text-xs">{classroom.name.toUpperCase()} — SHARE THIS CODE WITH YOUR STUDENTS</p>
                        <button
                          onClick={() => { setRenamingName(classroom.name); setEditingName(true); }}
                          className="text-white/30 hover:text-white/70 transition-colors"
                          title="Rename classroom"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[#FCD34D] font-mono text-4xl font-bold drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)] tracking-[8px]">
                        {codeVisible ? classroom.class_code : '••••••'}
                      </span>
                      <button
                        onClick={() => setCodeVisible(!codeVisible)}
                        className="flex items-center gap-2 bg-[#976d4c] border-4 border-black px-3 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all hover:brightness-110"
                        title={codeVisible ? 'Hide code' : 'Show code'}
                      >
                        {codeVisible
                          ? <EyeOff size={14} className="text-white/60" />
                          : <Eye size={14} className="text-white/60" />}
                      </button>
                      <button
                        onClick={copyCode}
                        className="flex items-center gap-2 bg-[#976d4c] border-4 border-black px-3 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all hover:brightness-110"
                      >
                        {codeCopied ? <Check size={14} className="text-[#72b149]" /> : <Copy size={14} className="text-white" />}
                        <span className="text-white font-mono text-xs">{codeCopied ? 'COPIED!' : 'COPY'}</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-[#1a1a1a] border-4 border-black px-4 py-2 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
                      <p className="text-[#83aeff] font-mono text-xl font-bold">{classroom.student_count}</p>
                      <p className="text-white/60 font-mono text-xs">ENROLLED</p>
                    </div>
                    <button
                      onClick={toggleRoster}
                      className="flex items-center gap-2 bg-[#83aeff] border-4 border-black px-3 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all hover:brightness-110"
                    >
                      <Users size={14} className="text-black" />
                      <span className="text-black font-mono text-xs font-bold">{showRoster ? 'HIDE ROSTER' : 'VIEW ROSTER'}</span>
                    </button>
                  </div>
                </div>

                {/* Roster */}
                {showRoster && (
                  <div className="mt-4 border-t-4 border-black/40 pt-4">
                    <p className="text-white/50 font-mono text-xs mb-3">CLASS ROSTER</p>
                    {rosterLoading ? (
                      <p className="text-white/40 font-mono text-xs animate-pulse">LOADING...</p>
                    ) : roster.length === 0 ? (
                      <p className="text-white/30 font-mono text-xs">No students have joined yet.</p>
                    ) : (
                      <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                        {roster.map((s, i) => (
                          <div key={i} className="flex items-center justify-between bg-[#1a1a1a] border-2 border-black px-3 py-2">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-[#976d4c] border-2 border-black flex items-center justify-center text-white font-mono text-xs font-bold">
                                {(s.student_name ?? '?').charAt(0).toUpperCase()}
                              </div>
                              <span className="text-white font-mono text-xs">{s.student_name ?? 'Unknown'}</span>
                            </div>
                            <span className="text-white/30 font-mono text-[10px]">
                              Joined {new Date(s.joined_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-white/60 font-mono text-xs">Create a classroom to get a shareable code for your students.</p>
                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  <input
                    value={classroomNameInput}
                    onChange={e => setClassroomNameInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && createClassroom()}
                    placeholder="CLASS NAME (e.g. Period 3 English)"
                    className="bg-[#1a1a1a] border-4 border-black text-white font-mono text-sm px-3 py-2 outline-none placeholder:text-white/20 flex-1 min-w-0"
                  />
                  <button
                    onClick={createClassroom}
                    className="flex items-center gap-2 bg-[#72b149] border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all hover:brightness-110 whitespace-nowrap"
                  >
                    <School size={14} className="text-white" />
                    <span className="text-white font-mono text-xs font-bold">CREATE CLASSROOM</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Assignments section */}
          <AssignmentSection isTeacher={true} refreshKey={assignmentRefreshKey} />

          {/* Lesson analytics cards grouped by module */}
          {modules.map(module => {
            const moduleLessons = allLessons.filter(l => l.module === module);
            return (
                <div
                    key={module}
                    className="bg-gradient-to-br from-[#976d4c] to-[#7b583d] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-6 mb-6"
                    style={{imageRendering: 'pixelated'}}
                >
                  <h3
                      className="text-lg text-white mb-4 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]"
                      style={{fontFamily: 'monospace', letterSpacing: '2px'}}
                  >
                    {module} LESSONS
                  </h3>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[#72b149] to-transparent"/>
                    <div className="w-2 h-2 bg-[#72b149] rotate-45"/>
                    <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[#72b149] to-transparent"/>
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
                              <BarChart2 size={14} className="text-[#83aeff]"/>
                            </div>

                            {/* Title + description */}
                            <div>
                              <div className="flex items-start gap-2 mb-1">
                                <BookOpen size={14} className="text-white/70 mt-0.5 shrink-0"/>
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
                                <Users size={12} className="text-[#83aeff]"/>
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
                    <div className="w-3 h-3 bg-[#82c159] border-2 border-black"/>
                    <div className="w-3 h-3 bg-[#72b149] border-2 border-black"/>
                    <div className="w-3 h-3 bg-[#55942c] border-2 border-black"/>
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
  const [uploadedLessons, setUploadedLessons] = useState<Lesson[]>([]);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [classroomChecked, setClassroomChecked] = useState(false);
  const [classCodeInput, setClassCodeInput] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joining, setJoining] = useState(false);
  const [parentCode, setParentCode] = useState<string | null>(null);
  const [parentLinked, setParentLinked] = useState(false);
  const [parentCodeCopied, setParentCodeCopied] = useState(false);
  const [parentCodeVisible, setParentCodeVisible] = useState(false); 


  useEffect(() => {
    async function fetchData() {
      const {data: {user}} = await supabase.auth.getUser();
      if (!user) return;

      const studentName: string = user.user_metadata?.full_name ?? user.user_metadata?.name ?? '';

      const [attemptsRes, uploadedRes, memberRes, parentLinkRes] = await Promise.all([
        supabase.from('lesson_attempts').select('lesson_id, xp_earned').eq('user_id', user.id),
        supabase.from('uploaded_lessons').select('lesson_data').order('created_at', { ascending: true }),
        supabase.from('classroom_members').select('student_name, classrooms(id, class_code, name)').eq('student_id', user.id).maybeSingle(),
        supabase.from('parent_student_links').select('id').eq('student_id', user.id).maybeSingle(),
      ]);

      if (attemptsRes.data) {
        setCompletedIds(new Set(attemptsRes.data.map(a => a.lesson_id as string)));
        setTotalXp(attemptsRes.data.reduce((sum, a) => sum + (a.xp_earned as number), 0));
      }
      if (uploadedRes.data) {
        setUploadedLessons(uploadedRes.data.map(r => r.lesson_data as Lesson));
      }
      if (memberRes.data?.classrooms) {
        setClassroom(memberRes.data.classrooms as unknown as Classroom);
        if (!memberRes.data.student_name && studentName) {
          await supabase.from('classroom_members').update({ student_name: studentName }).eq('student_id', user.id);
        }
      }
      setParentLinked(!!parentLinkRes.data);
      setClassroomChecked(true);

      // Fetch or create parent link code
      const { data: existingCode } = await supabase
        .from('student_codes')
        .select('code')
        .eq('student_id', user.id)
        .maybeSingle();

      if (existingCode) {
        setParentCode(existingCode.code);
        if (studentName) {
          supabase.from('student_codes').update({ student_name: studentName }).eq('student_id', user.id);
        }
      } else {
        const newCode = generateClassCode();
        const { data } = await supabase
          .from('student_codes')
          .insert({ student_id: user.id, code: newCode, student_name: studentName })
          .select('code')
          .single();
        if (data) setParentCode(data.code);
      }
    }
    fetchData();
  }, []);

  async function joinClassroom() {
    const code = classCodeInput.trim().toUpperCase();
    if (!code) return;
    setJoining(true);
    setJoinError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setJoining(false); return; }

    const { data: room } = await supabase
      .from('classrooms')
      .select('id, class_code, name')
      .eq('class_code', code)
      .maybeSingle();

    if (!room) {
      setJoinError('Class code not found. Check with your teacher.');
      setJoining(false);
      return;
    }

    const studentName: string = user.user_metadata?.full_name ?? user.user_metadata?.name ?? '';

    const { error } = await supabase
      .from('classroom_members')
      .insert({ classroom_id: room.id, student_id: user.id, student_name: studentName });

    if (error) {
      setJoinError(error.code === '23505' ? 'You already joined this class.' : 'Failed to join. Try again.');
    } else {
      setClassroom(room);
      setClassCodeInput('');
    }
    setJoining(false);
  }

  const allLessons = [...lessons, ...uploadedLessons];
  const completedCount = completedIds.size;
  const modules = Array.from(new Set(allLessons.map(l => l.module)));

  function getStatus(lesson: Lesson): LessonStatus {
    if (completedIds.has(lesson.id)) return 'completed';
    const moduleLessons = allLessons.filter(l => l.module === lesson.module);
    const idx = moduleLessons.findIndex(l => l.id === lesson.id);
    if (idx === 0) return 'in-progress';
    const prev = moduleLessons[idx - 1];
    return completedIds.has(prev.id) ? 'in-progress' : 'locked';
  }

  function handleLessonClick(lesson: Lesson) {
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
        {/* Sidebar — self-contained with fixed positioning */}
        <Sidebar onLogout={onLogout} />

        {/* Header — centered */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <ImageWithFallback src="/mindCraft_logo_border.png" alt="MindCraft Logo" className="w-12 h-12" />
            <h1
              className="text-3xl text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: 'monospace', imageRendering: 'pixelated', letterSpacing: '2px' }}
            >
              MINDCRAFT
            </h1>
          </div>
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
                  <p className="text-[#72b149] font-mono text-xl font-bold drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">{completedCount}/{allLessons.length}</p>
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
                <span className="text-white font-mono text-xs">{Math.round((completedCount / allLessons.length) * 100)}%</span>
              </div>
              <div className="h-4 bg-[#3C3C3C] border-2 border-black">
                <div
                  className="h-full bg-[#72b149] transition-all"
                  style={{ width: `${(completedCount / allLessons.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Parent link code — hidden once parent is connected */}
          {classroomChecked && !parentLinked && parentCode && (
            <div
              className="bg-gradient-to-br from-[#3C3C3C] to-[#2a2a2a] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-5 mb-6"
              style={{ imageRendering: 'pixelated' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Users size={16} className="text-[#FCD34D]" />
                <h3 className="text-white font-mono text-sm font-bold drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]" style={{ letterSpacing: '2px' }}>
                  CONNECT WITH PARENT
                </h3>
              </div>
              <p className="text-white/50 font-mono text-xs mb-3">Share this code with your parent so they can follow your progress.</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[#FCD34D] font-mono text-3xl font-bold tracking-[6px] drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
                  {parentCodeVisible ? parentCode : '••••••'}
                </span>
                <button
                  onClick={() => setParentCodeVisible(v => !v)}
                  className="flex items-center gap-1 bg-[#2a2a2a] border-4 border-black px-3 py-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:brightness-110 transition-all"
                  title={parentCodeVisible ? 'Hide code' : 'Show code'}
                >
                  {parentCodeVisible
                    ? <EyeOff size={13} className="text-white/60" />
                    : <Eye size={13} className="text-white/60" />}
                </button>
                <button
                  onClick={() => { navigator.clipboard.writeText(parentCode); setParentCodeCopied(true); setTimeout(() => setParentCodeCopied(false), 2000); }}
                  className="flex items-center gap-2 bg-[#976d4c] border-4 border-black px-3 py-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all hover:brightness-110"
                >
                  {parentCodeCopied ? <Check size={13} className="text-[#72b149]" /> : <Copy size={13} className="text-white" />}
                  <span className="text-white font-mono text-xs">{parentCodeCopied ? 'COPIED!' : 'COPY'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Classroom section */}
          {classroomChecked && (
            <div
              className="bg-gradient-to-br from-[#3C3C3C] to-[#2a2a2a] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-6 mb-6"
              style={{ imageRendering: 'pixelated' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <School size={18} className="text-[#83aeff]" />
                <h3
                  className="text-lg text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]"
                  style={{ fontFamily: 'monospace', letterSpacing: '2px' }}
                >
                  YOUR CLASSROOM
                </h3>
              </div>

              {classroom ? (
                <div className="flex items-center gap-4">
                  <CheckCircle size={16} className="text-[#72b149] shrink-0" />
                  <div>
                    <p className="text-[#72b149] font-mono text-xs font-bold">ENROLLED</p>
                    <p className="text-white font-mono text-sm">{classroom.name}</p>
                  </div>
                  <div className="ml-auto bg-[#2a2a2a] border-4 border-black px-4 py-2 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
                    <p className="text-[#FCD34D] font-mono text-lg font-bold tracking-widest">{classroom.class_code}</p>
                    <p className="text-white/60 font-mono text-xs">CLASS CODE</p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-white/60 font-mono text-xs mb-3">Enter the class code your teacher gave you to join their classroom.</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <input
                      value={classCodeInput}
                      onChange={e => { setClassCodeInput(e.target.value.toUpperCase()); setJoinError(''); }}
                      onKeyDown={e => e.key === 'Enter' && joinClassroom()}
                      maxLength={6}
                      placeholder="XXXXXX"
                      className="bg-[#1a1a1a] border-4 border-black text-[#FCD34D] font-mono text-xl tracking-[6px] px-4 py-2 w-44 outline-none placeholder:text-white/20 uppercase"
                    />
                    <button
                      onClick={joinClassroom}
                      disabled={joining || classCodeInput.trim().length < 6}
                      className="flex items-center gap-2 bg-[#72b149] border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LogIn size={14} className="text-white" />
                      <span className="text-white font-mono text-xs font-bold">{joining ? 'JOINING...' : 'JOIN CLASS'}</span>
                    </button>
                  </div>
                  {joinError && (
                    <p className="text-red-400 font-mono text-xs mt-2">{joinError}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Assignments + lessons — only visible after joining a class */}
          {classroomChecked && !classroom && (
            <div
              className="bg-gradient-to-br from-[#3C3C3C] to-[#2a2a2a] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-10 mb-6 flex flex-col items-center gap-4"
              style={{ imageRendering: 'pixelated' }}
            >
              <Lock size={32} className="text-white/20" />
              <p className="text-white/50 font-mono text-sm text-center">JOIN A CLASSROOM ABOVE TO ACCESS LESSONS AND ASSIGNMENTS</p>
            </div>
          )}

          {classroom && <AssignmentSection isTeacher={false} />}

          {/* Lesson blocks grouped by module */}
          {classroom && modules.map(module => {
            const moduleLessons = allLessons.filter(l => l.module === module);
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

// ─── Parent Dashboard ─────────────────────────────────────────────────────────
function ParentDashboard({ firstName, onLogout }: { firstName: string; onLogout: () => void }) {
  const [linkedStudent, setLinkedStudent] = useState<{ student_id: string; student_name: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [codeInput, setCodeInput] = useState('');
  const [linkError, setLinkError] = useState('');
  const [linking, setLinking] = useState(false);
  const [attempts, setAttempts] = useState<{ lesson_id: string; correct_count: number; total_questions: number; xp_earned: number }[]>([]);
  const [submissions, setSubmissions] = useState<{ assignment_id: string; grade: string | null; feedback: string | null; submitted_at: string; file_name: string }[]>([]);
  const [assignments, setAssignments] = useState<{ id: string; title: string; description: string | null; due_date: string | null }[]>([]);
  const [uploadedLessons, setUploadedLessons] = useState<Lesson[]>([]);
  const [studentInClassroom, setStudentInClassroom] = useState(false);

  async function fetchStudentData(studentId: string) {
    const [attRes, subRes, asgRes, upRes, memberRes] = await Promise.all([
      supabase.from('lesson_attempts').select('lesson_id, correct_count, total_questions, xp_earned').eq('user_id', studentId),
      supabase.from('assignment_submissions').select('assignment_id, grade, feedback, submitted_at, file_name').eq('user_id', studentId),
      supabase.from('assignments').select('id, title, description, due_date').order('created_at', { ascending: false }),
      supabase.from('uploaded_lessons').select('lesson_data').order('created_at', { ascending: true }),
      supabase.from('classroom_members').select('id').eq('student_id', studentId).maybeSingle(),
    ]);
    setAttempts(attRes.data ?? []);
    setSubmissions(subRes.data ?? []);
    setAssignments(asgRes.data ?? []);
    setUploadedLessons((upRes.data ?? []).map(r => r.lesson_data as Lesson));
    setStudentInClassroom(!!memberRes.data);
  }

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data: link } = await supabase
        .from('parent_student_links')
        .select('student_id, student_name')
        .eq('parent_id', user.id)
        .maybeSingle();
      if (link) {
        setLinkedStudent(link);
        await fetchStudentData(link.student_id);
      }
      setLoading(false);
    }
    init();
  }, []);

  async function linkStudent() {
    const code = codeInput.trim().toUpperCase();
    if (!code) return;
    setLinking(true);
    setLinkError('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLinking(false); return; }
    const { data: sc } = await supabase.from('student_codes').select('student_id, student_name').eq('code', code).maybeSingle();
    if (!sc) { setLinkError('Student code not found. Ask your child for their code.'); setLinking(false); return; }
    const { error } = await supabase.from('parent_student_links').insert({ parent_id: user.id, student_id: sc.student_id, student_name: sc.student_name });
    if (error) {
      setLinkError(error.code === '23505' ? 'Already linked to this student.' : 'Failed to link. Try again.');
    } else {
      setLinkedStudent(sc);
      await fetchStudentData(sc.student_id);
    }
    setLinking(false);
  }

  const allLessons = [...lessons, ...uploadedLessons];
  const completedIds = new Set(attempts.map(a => a.lesson_id));
  const totalXp = attempts.reduce((s, a) => s + a.xp_earned, 0);
  const completedCount = completedIds.size;
  const modules = Array.from(new Set(allLessons.map(l => l.module)));

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function isOverdue(due: string) {
    const d = new Date(due); d.setHours(23, 59, 59, 999); return d < new Date();
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-[#83aeff] to-[#8fb9ff]">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{ backgroundImage: `url('https://minecraft.wiki/images/thumb/Plains_sky.png/1200px-Plains_sky.png')`, backgroundSize: 'cover', backgroundPosition: 'center', imageRendering: 'pixelated' }} />
      </div>
      <div className="relative z-10 min-h-screen p-8">
        <Sidebar onLogout={onLogout} />
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <img src="/mindCraft_logo_border.png" alt="MindCraft Logo" className="w-12 h-12" />
            <h1 className="text-3xl text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]" style={{ fontFamily: 'monospace', letterSpacing: '2px' }}>MINDCRAFT</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#976d4c] to-[#7b583d] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-6 mb-6" style={{ imageRendering: 'pixelated' }}>
            <h2 className="text-2xl text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]" style={{ fontFamily: 'monospace', letterSpacing: '2px' }}>
              PARENT DASHBOARD{firstName ? ` — ${firstName.toUpperCase()}` : ''}
            </h2>
            <p className="text-[#FCD34D] font-mono text-xs mt-1">Track your child's learning progress</p>
          </div>

          {loading ? (
            <p className="text-white font-mono text-sm animate-pulse text-center">LOADING...</p>
          ) : !linkedStudent ? (
            /* ── Link student ── */
            <div className="bg-gradient-to-br from-[#3C3C3C] to-[#2a2a2a] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-8" style={{ imageRendering: 'pixelated' }}>
              <div className="flex items-center gap-3 mb-4">
                <Users size={20} className="text-[#FCD34D]" />
                <h3 className="text-white font-mono text-lg font-bold" style={{ letterSpacing: '2px' }}>LINK YOUR CHILD'S ACCOUNT</h3>
              </div>
              <p className="text-white/60 font-mono text-xs mb-5">Ask your child to share their parent code from their dashboard, then enter it below.</p>
              <div className="flex items-center gap-3 flex-wrap">
                <input
                  value={codeInput}
                  onChange={e => { setCodeInput(e.target.value.toUpperCase()); setLinkError(''); }}
                  onKeyDown={e => e.key === 'Enter' && linkStudent()}
                  maxLength={6}
                  placeholder="XXXXXX"
                  className="bg-[#1a1a1a] border-4 border-black text-[#FCD34D] font-mono text-xl tracking-[6px] px-4 py-2 w-48 outline-none placeholder:text-white/20 uppercase"
                />
                <button
                  onClick={linkStudent}
                  disabled={linking || codeInput.trim().length < 6}
                  className="flex items-center gap-2 bg-[#72b149] border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <LogIn size={14} className="text-white" />
                  <span className="text-white font-mono text-xs font-bold">{linking ? 'LINKING...' : 'LINK STUDENT'}</span>
                </button>
              </div>
              {linkError && <p className="text-red-400 font-mono text-xs mt-3">{linkError}</p>}
            </div>
          ) : (
            <>
              {/* ── Student overview card ── */}
              <div className="bg-[#3C3C3C] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-16 h-16 bg-[#976d4c] border-4 border-black flex items-center justify-center text-white font-mono text-2xl font-bold shadow-[4px_4px_0px_black] shrink-0">
                  {(linkedStudent.student_name ?? '?').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-white font-mono text-xl font-bold">{linkedStudent.student_name ?? 'Student'}</p>
                  <p className="text-white/40 font-mono text-xs mt-0.5">LINKED STUDENT</p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-[#2a2a2a] border-4 border-black px-4 py-2 text-center shadow-[4px_4px_0px_black]">
                    <p className="text-[#FCD34D] font-mono text-xl font-bold">{totalXp}</p>
                    <p className="text-white/40 font-mono text-xs">TOTAL XP</p>
                  </div>
                  <div className="bg-[#2a2a2a] border-4 border-black px-4 py-2 text-center shadow-[4px_4px_0px_black]">
                    <p className="text-[#72b149] font-mono text-xl font-bold">{completedCount}/{allLessons.length}</p>
                    <p className="text-white/40 font-mono text-xs">LESSONS</p>
                  </div>
                  <div className="bg-[#2a2a2a] border-4 border-black px-4 py-2 text-center shadow-[4px_4px_0px_black]">
                    <p className="text-[#83aeff] font-mono text-xl font-bold">{submissions.filter(s => s.grade).length}/{assignments.length}</p>
                    <p className="text-white/40 font-mono text-xs">GRADED</p>
                  </div>
                </div>
              </div>

              {/* ── Not in classroom yet ── */}
              {!studentInClassroom && (
                <div className="bg-gradient-to-br from-[#3C3C3C] to-[#2a2a2a] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-10 mb-6 flex flex-col items-center gap-3" style={{ imageRendering: 'pixelated' }}>
                  <Lock size={28} className="text-white/20" />
                  <p className="text-white/50 font-mono text-sm text-center">YOUR CHILD HASN'T JOINED A CLASSROOM YET</p>
                  <p className="text-white/30 font-mono text-xs text-center">Lessons and assignments will appear here once they join their teacher's class.</p>
                </div>
              )}

              {/* ── Assignments ── */}
              {studentInClassroom && (
                <div className="bg-gradient-to-br from-[#976d4c] to-[#7b583d] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-6 mb-6" style={{ imageRendering: 'pixelated' }}>
                  <h3 className="text-lg text-white mb-4 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]" style={{ fontFamily: 'monospace', letterSpacing: '2px' }}>ASSIGNMENTS</h3>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[#FCD34D] to-transparent" />
                    <div className="w-2 h-2 bg-[#FCD34D] rotate-45" />
                    <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[#FCD34D] to-transparent" />
                  </div>
                  {assignments.length === 0 ? (
                    <p className="text-white/40 font-mono text-xs text-center py-4">No assignments yet.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {assignments.map(a => {
                        const sub = submissions.find(s => s.assignment_id === a.id);
                        const overdue = a.due_date && isOverdue(a.due_date) && !sub;
                        return (
                          <div key={a.id} className={`bg-[#3C3C3C] border-4 ${sub?.grade ? 'border-[#FCD34D]/60' : sub ? 'border-[#72b149]/50' : overdue ? 'border-red-500/50' : 'border-white/10'} px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2`}>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-mono text-xs font-bold truncate">{a.title}</p>
                              {a.due_date && (
                                <p className={`font-mono text-[10px] mt-0.5 ${overdue ? 'text-red-400' : 'text-white/40'}`}>
                                  Due {fmtDate(a.due_date)}{overdue ? ' — OVERDUE' : ''}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              {sub ? (
                                <>
                                  <span className="text-[#72b149] font-mono text-xs flex items-center gap-1">
                                    <CheckCircle size={11} /> Submitted {fmtDate(sub.submitted_at)}
                                  </span>
                                  {sub.grade ? (
                                    <span className="bg-[#FCD34D]/20 border border-[#FCD34D]/50 text-[#FCD34D] font-mono text-xs px-2 py-0.5 font-bold">{sub.grade}</span>
                                  ) : (
                                    <span className="text-[#83aeff] font-mono text-xs">Awaiting grade</span>
                                  )}
                                </>
                              ) : (
                                <span className={`font-mono text-xs ${overdue ? 'text-red-400' : 'text-white/30'}`}>
                                  {overdue ? 'NOT SUBMITTED' : 'PENDING'}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── Lesson progress ── */}
              {studentInClassroom && modules.map(module => {
                const moduleLessons = allLessons.filter(l => l.module === module);
                const doneCount = moduleLessons.filter(l => completedIds.has(l.id)).length;
                return (
                  <div key={module} className="bg-gradient-to-br from-[#976d4c] to-[#7b583d] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-6 mb-6" style={{ imageRendering: 'pixelated' }}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]" style={{ fontFamily: 'monospace', letterSpacing: '2px' }}>{module} LESSONS</h3>
                      <span className="text-[#72b149] font-mono text-sm font-bold">{doneCount}/{moduleLessons.length}</span>
                    </div>
                    <div className="h-3 bg-black/40 border-2 border-black mb-4">
                      <div className="h-full bg-[#72b149]" style={{ width: `${(doneCount / moduleLessons.length) * 100}%` }} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {moduleLessons.map(lesson => {
                        const done = completedIds.has(lesson.id);
                        const att = attempts.find(a => a.lesson_id === lesson.id);
                        const pct = att && att.total_questions > 0 ? Math.round((att.correct_count / att.total_questions) * 100) : null;
                        return (
                          <div key={lesson.id} className={`flex items-center gap-3 px-3 py-2 border-2 ${done ? 'border-[#72b149]/40 bg-[#72b149]/10' : 'border-black/30 bg-black/20'}`}>
                            <div className={`w-4 h-4 border-2 border-black flex items-center justify-center shrink-0 ${done ? 'bg-[#72b149]' : 'bg-white/10'}`}>
                              {done && <CheckCircle size={10} className="text-white" />}
                            </div>
                            <span className="text-white font-mono text-xs flex-1 truncate">{lesson.title}</span>
                            {pct !== null && (
                              <span className={`font-mono text-xs font-bold shrink-0 ${pct >= 80 ? 'text-[#72b149]' : pct >= 50 ? 'text-[#FCD34D]' : 'text-red-400'}`}>{pct}%</span>
                            )}
                            <span className="text-[#FCD34D] font-mono text-xs shrink-0">+{lesson.xp} XP</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </>
          )}
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
    setRoleLoaded(true); // Can remove this later, just had to do this to get it working again for me
  }, []);

  const handleLogout = () => navigate('/');

  if (!roleLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#83aeff] to-[#8fb9ff]">
        <p className="text-white font-mono text-sm animate-pulse">LOADING...</p>
      </div>
    );
  }

  if (role === 'teacher') return <TeacherDashboard firstName={firstName} onLogout={handleLogout} />;
  if (role === 'parent') return <ParentDashboard firstName={firstName} onLogout={handleLogout} />;
  return <StudentDashboard firstName={firstName} role={role} onLogout={handleLogout} />;
}