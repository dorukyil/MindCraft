import { useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase/client';
import {
  Calendar, CheckCircle, ChevronDown, ChevronRight,
  Download, FileText, Loader2, Upload, Star, MessageSquare,
} from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  rubric_path: string | null;
  created_at: string;
}

interface Submission {
  id: string;
  assignment_id: string;
  user_id: string;
  user_name: string;
  file_path: string;
  file_name: string;
  submitted_at: string;
  grade: string | null;
  feedback: string | null;
  graded_at: string | null;
}

interface Props {
  isTeacher: boolean;
  refreshKey?: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function isOverdue(due: string) {
  const d = new Date(due);
  d.setHours(23, 59, 59, 999);
  return d < new Date();
}

function getGradeColor(grade: string | null): { color: string } {
  if (!grade) return { color: '#FCD34D' };

  const g = grade.trim().toUpperCase();

  if (g === 'A+') return { color: '#46EB6A' };
  if (g === 'A')  return { color: '#46EB56' };
  if (g === 'A-') return { color: '#5AEB51' };

  if (g === 'B+') return { color: '#6FEB4B' };
  if (g === 'B')  return { color: '#83EB46' };
  if (g === 'B-') return { color: '#A3EB46' };

  if (g === 'C+') return { color: '#C4EB46' };
  if (g === 'C')  return { color: '#E5EB46' };
  if (g === 'C-') return { color: '#E7D646' };

  if (g === 'D+') return { color: '#E9C146' };
  if (g === 'D')  return { color: '#EBAC46' };
  if (g === 'D-') return { color: '#E89046' };

  if (g === 'F')  return { color: '#EB4646' };

  const num = parseFloat(g.replace('%', ''));
  if (!isNaN(num)) {
    if (num >= 97) return { color: '#46EB6A' }; // A+
    if (num >= 93) return { color: '#46EB56' }; // A
    if (num >= 90) return { color: '#5AEB51' }; // A-
    if (num >= 87) return { color: '#6FEB4B' }; // B+
    if (num >= 83) return { color: '#83EB46' }; // B
    if (num >= 80) return { color: '#A3EB46' }; // B-
    if (num >= 77) return { color: '#C4EB46' }; // C+
    if (num >= 73) return { color: '#E5EB46' }; // C
    if (num >= 70) return { color: '#E7D646' }; // C-
    if (num >= 67) return { color: '#E9C146' }; // D+
    if (num >= 63) return { color: '#EBAC46' }; // D
    if (num >= 60) return { color: '#E89046' }; // D-
    return { color: '#EB4646' }; // F
  }

  return { color: '#CFCFCF' }; // Other input default
}

async function openSignedUrl(path: string) {
  const { data } = await supabase.storage
    .from('assignments')
    .createSignedUrl(path, 3600);
  if (data?.signedUrl) window.open(data.signedUrl, '_blank');
}

export function AssignmentSection({ isTeacher, refreshKey }: Props) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // student submit state
  const [pendingSubmitId, setPendingSubmitId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // teacher grade state
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [savingGradeId, setSavingGradeId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const { data: asgns } = await supabase
        .from('assignments')
        .select('*')
        .order('created_at', { ascending: false });
      if (asgns) setAssignments(asgns);

      if (user) {
        const { data: subs } = isTeacher
          ? await supabase.from('assignment_submissions').select('*').order('submitted_at', { ascending: false })
          : await supabase.from('assignment_submissions').select('*').eq('user_id', user.id);
        if (subs) setSubmissions(subs);
      }

      setLoading(false);
    }
    load();
  }, [isTeacher, refreshKey]);

  function toggleExpand(id: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // ── Teacher: open grade form for a submission ────────────────────────────────
  function openGradeForm(sub: Submission) {
    setGradingId(sub.id);
    setGradeInput(sub.grade ?? '');
    setFeedbackInput(sub.feedback ?? '');
  }

  function closeGradeForm() {
    setGradingId(null);
    setGradeInput('');
    setFeedbackInput('');
  }

  async function saveGrade(subId: string) {
    setSavingGradeId(subId);
    const { data: updated } = await supabase
      .from('assignment_submissions')
      .update({
        grade: gradeInput.trim() || null,
        feedback: feedbackInput.trim() || null,
        graded_at: new Date().toISOString(),
      })
      .eq('id', subId)
      .select()
      .single();

    if (updated) {
      setSubmissions(prev =>
        prev.map(s => s.id === subId ? (updated as Submission) : s)
      );
    }
    setSavingGradeId(null);
    closeGradeForm();
  }

  // ── Student: file submit ─────────────────────────────────────────────────────
  function triggerSubmit(assignmentId: string) {
    setPendingSubmitId(assignmentId);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !pendingSubmitId || !user) return;

    const assignmentId = pendingSubmitId;
    setPendingSubmitId(null);
    setUploadingId(assignmentId);

    const meta = user.user_metadata;
    const userName: string = meta?.full_name ?? meta?.name ?? user.email ?? 'Unknown';
    const path = `submissions/${assignmentId}/${user.id}/${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('assignments')
      .upload(path, file, { upsert: true });

    if (!uploadError) {
      await supabase
        .from('assignment_submissions')
        .delete()
        .eq('assignment_id', assignmentId)
        .eq('user_id', user.id);

      const { data: newSub } = await supabase
        .from('assignment_submissions')
        .insert({
          assignment_id: assignmentId,
          user_id: user.id,
          user_name: userName,
          file_path: path,
          file_name: file.name,
        })
        .select()
        .single();

      if (newSub) {
        setSubmissions(prev => [
          ...prev.filter(s => !(s.assignment_id === assignmentId && s.user_id === user.id)),
          newSub as Submission,
        ]);
      }
    }

    setUploadingId(null);
  }

  // ── Shared layout pieces ─────────────────────────────────────────────────────
  const sectionStyle = {
    className: 'bg-gradient-to-br from-[#976d4c] to-[#7b583d] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-6 mb-6',
    style: { imageRendering: 'pixelated' as const },
  };
  const divider = (
    <div className="flex items-center gap-2 mb-6">
      <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[#FCD34D] to-transparent" />
      <div className="w-2 h-2 bg-[#FCD34D] rotate-45" />
      <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[#FCD34D] to-transparent" />
    </div>
  );
  const footer = (
    <div className="mt-6 flex justify-center gap-2">
      <div className="w-3 h-3 bg-[#FCD34D] border-2 border-black" />
      <div className="w-3 h-3 bg-[#FBBF24] border-2 border-black" />
      <div className="w-3 h-3 bg-[#F59E0B] border-2 border-black" />
    </div>
  );
  const heading = (
    <h3
      className="text-lg text-white mb-4 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]"
      style={{ fontFamily: 'monospace', letterSpacing: '2px' }}
    >
      ASSIGNMENTS
    </h3>
  );

  if (loading) {
    return (
      <div {...sectionStyle}>
        {heading}{divider}
        <div className="flex items-center gap-2 py-4 text-white/40 font-mono text-xs">
          <Loader2 size={14} className="animate-spin" />
          LOADING ASSIGNMENTS...
        </div>
        {footer}
      </div>
    );
  }

  // ── Teacher view ─────────────────────────────────────────────────────────────
  if (isTeacher) {
    return (
      <div {...sectionStyle}>
        {heading}{divider}

        {assignments.length === 0 ? (
          <p className="text-white/40 font-mono text-sm text-center py-6">
            No assignments yet. Click "UPLOAD ASSIGNMENT" to create one.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {assignments.map(asgn => {
              const asnSubs = submissions.filter(s => s.assignment_id === asgn.id);
              const gradedCount = asnSubs.filter(s => s.grade).length;
              const isOpen = expanded.has(asgn.id);
              const overdue = asgn.due_date && isOverdue(asgn.due_date);

              return (
                <div key={asgn.id} className="bg-[#3C3C3C] border-4 border-[#FCD34D]/60 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]">
                  {/* Assignment header row */}
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                    onClick={() => toggleExpand(asgn.id)}
                  >
                    <span className="text-white/40 shrink-0">
                      {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </span>
                    <span className="text-white font-mono text-sm font-bold flex-1 truncate">
                      {asgn.title}
                    </span>
                    {asgn.due_date && (
                      <span className={`font-mono text-xs shrink-0 hidden sm:flex items-center gap-1 ${overdue ? 'text-red-400' : 'text-[#FCD34D]'}`}>
                        <Calendar size={11} />
                        {overdue ? 'Past due: ' : 'Due: '}{formatDate(asgn.due_date)}
                      </span>
                    )}
                    <span className="bg-[#83aeff]/20 border border-[#83aeff]/40 text-[#83aeff] font-mono text-xs px-2 py-0.5 shrink-0">
                      {asnSubs.length} submitted
                    </span>
                    {gradedCount > 0 && (
                      <span className="bg-[#FCD34D]/20 border border-[#FCD34D]/40 text-[#FCD34D] font-mono text-xs px-2 py-0.5 shrink-0">
                        {gradedCount} graded
                      </span>
                    )}
                  </button>

                  {isOpen && (
                    <div className="border-t-2 border-black/40 px-4 pb-4 pt-3 flex flex-col gap-3">
                      {asgn.description && (
                        <p className="text-white/60 font-mono text-xs leading-relaxed">
                          {asgn.description}
                        </p>
                      )}
                      {asgn.rubric_path && (
                        <button
                          onClick={() => openSignedUrl(asgn.rubric_path!)}
                          className="flex items-center gap-2 text-[#83aeff] font-mono text-xs hover:text-white transition-colors w-fit"
                        >
                          <FileText size={12} />
                          Download Rubric
                        </button>
                      )}

                      <div className="mt-1">
                        {asnSubs.length === 0 ? (
                          <p className="text-white/30 font-mono text-xs py-2">No submissions yet.</p>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <p className="text-white/40 font-mono text-xs mb-1">STUDENT SUBMISSIONS:</p>
                            {asnSubs.map(sub => (
                              <div key={sub.id} className="flex flex-col">
                                {/* Submission row */}
                                <div className={`bg-black/30 border-l-4 px-3 py-2 flex items-center gap-3 ${sub.grade ? 'border-[#FCD34D]/60' : 'border-[#83aeff]/60'}`}>
                                  <span className="text-white font-mono text-xs font-bold flex-1 min-w-0 truncate">
                                    {sub.user_name}
                                  </span>
                                  <span className="text-white/40 font-mono text-xs shrink-0 hidden sm:block">
                                    {formatDate(sub.submitted_at)}
                                  </span>
                                  <span className="text-white/50 font-mono text-xs shrink-0 truncate max-w-[110px] hidden md:block">
                                    {sub.file_name}
                                  </span>

                                  {/* Grade badge if graded */}
                                  {sub.grade && (
                                    <span
                                      className="font-mono text-xs px-2 py-0.5 shrink-0 font-bold border"
                                      style={{
                                        color: getGradeColor(sub.grade).color,
                                        borderColor: `${getGradeColor(sub.grade).color}99`,
                                        backgroundColor: `${getGradeColor(sub.grade).color}33`,
                                      }}
                                    >
                                      {sub.grade}
                                    </span>
                                  )}

                                  <button
                                    onClick={() => openSignedUrl(sub.file_path)}
                                    className="flex items-center gap-1 text-[#83aeff] font-mono text-xs hover:text-white transition-colors shrink-0"
                                  >
                                    <Download size={12} />
                                    <span className="hidden sm:inline">Download</span>
                                  </button>

                                  {/* Grade / Edit button */}
                                  <button
                                    onClick={() => gradingId === sub.id ? closeGradeForm() : openGradeForm(sub)}
                                    className={`flex items-center gap-1 font-mono text-xs shrink-0 transition-colors ${
                                      gradingId === sub.id
                                        ? 'text-white/40 hover:text-white'
                                        : sub.grade
                                        ? 'text-[#FCD34D] hover:text-white'
                                        : 'text-[#72b149] hover:text-white'
                                    }`}
                                  >
                                    <Star size={12} />
                                    <span className="hidden sm:inline">{sub.grade ? 'Edit' : 'Grade'}</span>
                                  </button>
                                </div>

                                {/* Inline grade form */}
                                {gradingId === sub.id && (
                                  <div className="bg-black/20 border-l-4 border-[#FCD34D]/60 px-3 py-3 flex flex-col gap-2">
                                    <div className="flex gap-2 items-center">
                                      <label className="text-white/50 font-mono text-xs shrink-0 w-16">GRADE</label>
                                      <input
                                        type="text"
                                        value={gradeInput}
                                        onChange={e => setGradeInput(e.target.value)}
                                        placeholder='e.g. A, 85%, Pass'
                                        className="flex-1 bg-[#3C3C3C] border-2 border-black px-2 py-1 text-white font-mono text-xs placeholder:text-white/30 focus:outline-none focus:border-[#FCD34D]"
                                      />
                                    </div>
                                    <div className="flex gap-2 items-start">
                                      <label className="text-white/50 font-mono text-xs shrink-0 w-16 pt-1">FEEDBACK</label>
                                      <textarea
                                        value={feedbackInput}
                                        onChange={e => setFeedbackInput(e.target.value)}
                                        placeholder="Optional comments for the student..."
                                        rows={2}
                                        className="flex-1 bg-[#3C3C3C] border-2 border-black px-2 py-1 text-white font-mono text-xs placeholder:text-white/30 focus:outline-none focus:border-[#FCD34D] resize-none"
                                      />
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                      <button
                                        onClick={closeGradeForm}
                                        className="font-mono text-xs text-white/40 hover:text-white transition-colors px-3 py-1"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => saveGrade(sub.id)}
                                        disabled={savingGradeId === sub.id}
                                        className="flex items-center gap-1.5 bg-[#FCD34D] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] font-mono text-black text-xs px-3 py-1 hover:brightness-110 transition-all font-bold disabled:opacity-50"
                                      >
                                        {savingGradeId === sub.id
                                          ? <><Loader2 size={11} className="animate-spin" /> SAVING</>
                                          : <><Star size={11} /> SAVE GRADE</>
                                        }
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Existing feedback preview (shown when form is closed) */}
                                {sub.feedback && gradingId !== sub.id && (
                                  <div className="bg-black/15 border-l-4 border-[#FCD34D]/30 px-3 py-1.5 flex items-start gap-2">
                                    <MessageSquare size={11} className="text-[#FCD34D]/60 shrink-0 mt-0.5" />
                                    <p className="text-white/50 font-mono text-xs leading-relaxed italic">
                                      {sub.feedback}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {footer}
      </div>
    );
  }

  // ── Student view ─────────────────────────────────────────────────────────────
  return (
    <div {...sectionStyle}>
      {heading}{divider}

      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelected} />

      {assignments.length === 0 ? (
        <p className="text-white/40 font-mono text-sm text-center py-6">No assignments yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {assignments.map(asgn => {
            const mySub = submissions.find(s => s.assignment_id === asgn.id);
            const overdue = asgn.due_date && isOverdue(asgn.due_date) && !mySub;
            const isUploading = uploadingId === asgn.id;
            const isGraded = mySub?.grade != null;

            const borderColor = isGraded
              ? 'border-[#FCD34D]/70'
              : mySub
              ? 'border-[#72b149]/60'
              : overdue
              ? 'border-red-500/60'
              : 'border-[#FCD34D]/60';

            return (
              <div
                key={asgn.id}
                className={`bg-[#3C3C3C] border-4 ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-4 flex flex-col gap-3`}
              >
                {/* Title + badge */}
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-white font-mono text-sm font-bold leading-tight drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                    {asgn.title}
                  </h4>
                  {isGraded ? (
                    <span
                      className="font-mono text-xs px-2 py-0.5 shrink-0 font-bold flex items-center gap-1 border"
                      style={{
                        color: getGradeColor(mySub!.grade).color,
                        borderColor: `${getGradeColor(mySub!.grade).color}99`,
                        backgroundColor: `${getGradeColor(mySub!.grade).color}33`,
                      }}
                    >
                      <Star size={10} style={{ fill: getGradeColor(mySub!.grade).color }} />
                      {mySub!.grade}
                    </span>
                  ) : mySub ? (
                    <span className="bg-[#72b149]/20 border border-[#72b149]/40 text-[#72b149] font-mono text-xs px-2 py-0.5 shrink-0">
                      SUBMITTED
                    </span>
                  ) : overdue ? (
                    <span className="bg-red-500/20 border border-red-500/40 text-red-400 font-mono text-xs px-2 py-0.5 shrink-0">
                      OVERDUE
                    </span>
                  ) : null}
                </div>

                {asgn.description && (
                  <p className="text-white/60 font-mono text-xs leading-relaxed">
                    {asgn.description}
                  </p>
                )}

                {asgn.due_date && (
                  <div className={`flex items-center gap-1.5 font-mono text-xs ${overdue ? 'text-red-400' : 'text-[#FCD34D]'}`}>
                    <Calendar size={11} />
                    <span>Due: {formatDate(asgn.due_date)}</span>
                  </div>
                )}

                {asgn.rubric_path && (
                  <button
                    onClick={() => openSignedUrl(asgn.rubric_path!)}
                    className="flex items-center gap-2 text-[#83aeff] font-mono text-xs hover:text-white transition-colors w-fit"
                  >
                    <FileText size={12} />
                    View Rubric
                  </button>
                )}

                {/* Grade + feedback block */}
                {isGraded && (
                  <div className="bg-[#FCD34D]/10 border-2 border-[#FCD34D]/30 px-3 py-2 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <Star size={12} className="shrink-0" style={{ color: getGradeColor(mySub!.grade).color, fill: getGradeColor(mySub!.grade).color }} />
                      <span className="font-mono text-xs font-bold" style={{ color: getGradeColor(mySub!.grade).color }}>
                        Grade: {mySub!.grade}
                      </span>
                      {mySub!.graded_at && (
                        <span className="text-white/30 font-mono text-xs ml-auto">
                          {formatDate(mySub!.graded_at)}
                        </span>
                      )}
                    </div>
                    {mySub!.feedback && (
                      <div className="flex items-start gap-2">
                        <MessageSquare size={11} className="text-white/40 shrink-0 mt-0.5" />
                        <p className="text-white/70 font-mono text-xs leading-relaxed italic">
                          {mySub!.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Submit area */}
                <div className="mt-auto pt-2 border-t-2 border-black/30">
                  {isUploading ? (
                    <div className="flex items-center gap-2 text-white/50 font-mono text-xs py-1">
                      <Loader2 size={12} className="animate-spin" />
                      UPLOADING...
                    </div>
                  ) : mySub ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[#72b149] font-mono text-xs">
                        <CheckCircle size={12} />
                        <span>Submitted {formatDate(mySub.submitted_at)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-white/40 font-mono text-xs truncate">{mySub.file_name}</span>
                        <button
                          onClick={() => triggerSubmit(asgn.id)}
                          className="text-white/40 font-mono text-xs hover:text-white transition-colors shrink-0"
                        >
                          Resubmit
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => triggerSubmit(asgn.id)}
                      className="w-full bg-[#FCD34D] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] font-mono text-black text-xs py-2 hover:brightness-110 transition-all font-bold flex items-center justify-center gap-2"
                    >
                      <Upload size={12} />
                      SUBMIT ASSIGNMENT
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {footer}
    </div>
  );
}
