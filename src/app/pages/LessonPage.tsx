import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import type { User } from '@supabase/supabase-js';
import { lessons, LessonStep } from '../../data/lessons';
import { supabase } from '../lib/supabase/client';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { BookOpen, AlertTriangle, Pencil, CheckCircle, XCircle, ArrowLeft, Star, Loader2 } from 'lucide-react';

const STEP_ICONS = {
  learn: <BookOpen size={22} className="text-[#72b149]" />,
  warn:  <AlertTriangle size={22} className="text-[#FCD34D]" />,
  quiz:  <Pencil size={22} className="text-[#83aeff]" />,
  write: <Pencil size={22} className="text-[#c084fc]" />,
};

interface AnswerRecord {
  step_index: number;
  question: string;
  selected_option: string;
  correct_option: string;
  is_correct: boolean;
}

// ─── Progress bar ────────────────────────────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-white/60 font-mono text-xs">STEP {current} / {total}</span>
        <span className="text-white/60 font-mono text-xs">{pct}%</span>
      </div>
      <div className="h-4 bg-black/40 border-2 border-black">
        <div className="h-full bg-[#72b149] transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── Learn card ──────────────────────────────────────────────────────────────
function LearnCard({ step }: { step: Extract<LessonStep, { type: 'learn' }> }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-1">
        {STEP_ICONS[step.icon]}
        <h2 className="text-white font-mono text-lg font-bold drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)] leading-tight">
          {step.title}
        </h2>
      </div>
      <p className="text-white/80 font-mono text-sm leading-relaxed whitespace-pre-line">
        {step.content}
      </p>
      {step.highlight && (
        <div className="bg-[#FCD34D]/15 border-l-4 border-[#FCD34D] px-4 py-3">
          <p className="text-[#FCD34D] font-mono text-sm font-bold leading-snug">{step.highlight}</p>
        </div>
      )}
      {step.bullets && step.bullets.length > 0 && (
        <ul className="flex flex-col gap-2">
          {step.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-[#72b149] font-mono text-xs mt-0.5 shrink-0">▶</span>
              <span className="text-white/75 font-mono text-sm leading-relaxed">{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── MCQ card ────────────────────────────────────────────────────────────────
function MCQCard({
  step, onAnswer, answered, selectedIndex,
}: {
  step: Extract<LessonStep, { type: 'mcq' }>;
  onAnswer: (i: number) => void;
  answered: boolean;
  selectedIndex: number | null;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-3">
        {STEP_ICONS['quiz']}
        <p className="text-white font-mono text-base font-bold leading-snug drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
          {step.question}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {step.options.map((opt, i) => {
          let borderCls = 'border-white/30 hover:border-[#83aeff]';
          let bgCls = 'bg-[#2a2a2a] hover:bg-[#353535]';
          let textCls = 'text-white/80';
          const cursor = answered ? 'cursor-default' : 'cursor-pointer';

          if (answered) {
            if (i === step.correctIndex) {
              borderCls = 'border-[#72b149]'; bgCls = 'bg-[#72b149]/20'; textCls = 'text-[#72b149] font-bold';
            } else if (i === selectedIndex) {
              borderCls = 'border-red-500'; bgCls = 'bg-red-500/15'; textCls = 'text-red-400';
            } else {
              borderCls = 'border-white/10'; textCls = 'text-white/30';
            }
          }

          return (
            <button
              key={i}
              disabled={answered}
              onClick={() => onAnswer(i)}
              className={`w-full text-left px-4 py-3 border-2 ${borderCls} ${bgCls} ${cursor} shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] transition-all active:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:pointer-events-none`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-white/40 w-5 shrink-0">{String.fromCharCode(65 + i)}.</span>
                <span className={`font-mono text-sm ${textCls} leading-snug`}>{opt}</span>
                {answered && i === step.correctIndex && <CheckCircle size={16} className="text-[#72b149] ml-auto shrink-0" />}
                {answered && i === selectedIndex && i !== step.correctIndex && <XCircle size={16} className="text-red-400 ml-auto shrink-0" />}
              </div>
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={`border-l-4 px-4 py-3 ${selectedIndex === step.correctIndex ? 'border-[#72b149] bg-[#72b149]/10' : 'border-red-500 bg-red-500/10'}`}>
          <div className="flex items-center gap-2 mb-1">
            {selectedIndex === step.correctIndex
              ? <CheckCircle size={14} className="text-[#72b149]" />
              : <XCircle size={14} className="text-red-400" />}
            <span className={`font-mono text-xs font-bold ${selectedIndex === step.correctIndex ? 'text-[#72b149]' : 'text-red-400'}`}>
              {selectedIndex === step.correctIndex ? 'CORRECT!' : 'NOT QUITE...'}
            </span>
          </div>
          <p className="text-white/70 font-mono text-xs leading-relaxed">{step.explanation}</p>
        </div>
      )}
    </div>
  );
}

// ─── Completion screen ───────────────────────────────────────────────────────
function CompletionScreen({ lessonTitle, xp, correct, total, saving, onBack }: {
  lessonTitle: string;
  xp: number;
  correct: number;
  total: number;
  saving: boolean;
  onBack: () => void;
}) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 100;
  const stars = pct >= 80 ? 3 : pct >= 50 ? 2 : 1;
  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <Star key={i} size={40} className={i < stars ? 'text-[#FCD34D] fill-[#FCD34D]' : 'text-white/20'} />
        ))}
      </div>
      <h2 className="text-white font-mono text-2xl font-bold drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]">
        LESSON COMPLETE!
      </h2>
      <p className="text-white/60 font-mono text-sm">{lessonTitle}</p>
      <div className="flex gap-4">
        <div className="bg-[#3C3C3C] border-4 border-black px-6 py-3 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
          <p className="text-[#FCD34D] font-mono text-2xl font-bold">+{xp}</p>
          <p className="text-white/60 font-mono text-xs">XP EARNED</p>
        </div>
        <div className="bg-[#3C3C3C] border-4 border-black px-6 py-3 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
          <p className="text-[#72b149] font-mono text-2xl font-bold">{pct}%</p>
          <p className="text-white/60 font-mono text-xs">ACCURACY</p>
        </div>
      </div>
      {total > 0 && (
        <p className="text-white/50 font-mono text-xs">{correct} / {total} questions correct</p>
      )}
      {saving ? (
        <div className="flex items-center gap-2 text-white/50 font-mono text-xs">
          <Loader2 size={14} className="animate-spin" />
          SAVING PROGRESS...
        </div>
      ) : (
        <button
          onClick={onBack}
          className="font-mono text-sm px-8 py-3 bg-[#72b149] text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all hover:brightness-110"
        >
          BACK TO DASHBOARD
        </button>
      )}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const lesson = lessons.find(l => l.id === id);

  const [user, setUser] = useState<User | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  // Use refs to always have up-to-date values inside async handleNext
  const correctCountRef = useRef(0);
  const quizTotalRef = useRef(0);
  const answersRef = useRef<AnswerRecord[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#83aeff] to-[#8fb9ff]">
        <p className="text-white font-mono text-lg">Lesson not found.</p>
      </div>
    );
  }

  const steps = lesson.steps;
  const currentStep = steps[stepIndex];
  const isMCQ = currentStep.type === 'mcq';

  function handleAnswer(i: number) {
    if (answered) return;
    const step = currentStep as Extract<LessonStep, { type: 'mcq' }>;
    setSelectedIndex(i);
    setAnswered(true);
    const isCorrect = i === step.correctIndex;

    const newTotal = quizTotalRef.current + 1;
    const newCorrect = correctCountRef.current + (isCorrect ? 1 : 0);
    quizTotalRef.current = newTotal;
    correctCountRef.current = newCorrect;
    setQuizTotal(newTotal);
    setCorrectCount(newCorrect);

    const record: AnswerRecord = {
      step_index: stepIndex,
      question: step.question,
      selected_option: step.options[i],
      correct_option: step.options[step.correctIndex],
      is_correct: isCorrect,
    };
    answersRef.current = [...answersRef.current, record];
    setAnswers(answersRef.current);
  }

  async function handleNext() {
    const isLastStep = stepIndex + 1 >= steps.length;

    if (isLastStep) {
      setDone(true);
      if (user) {
        setSaving(true);
        const meta = user.user_metadata;
        const userName: string = meta?.full_name ?? meta?.name ?? user.email ?? 'Unknown';

        const { data: attempt, error } = await supabase
          .from('lesson_attempts')
          .insert({
            user_id: user.id,
            user_name: userName,
            lesson_id: lesson.id,
            correct_count: correctCountRef.current,
            total_questions: quizTotalRef.current,
            xp_earned: lesson.xp,
          })
          .select()
          .single();

        if (!error && attempt && answersRef.current.length > 0) {
          await supabase.from('lesson_answers').insert(
            answersRef.current.map(a => ({
              attempt_id: attempt.id,
              user_id: user.id,
              lesson_id: lesson.id,
              ...a,
            }))
          );
        }
        setSaving(false);
      }
    } else {
      setStepIndex(s => s + 1);
      setAnswered(false);
      setSelectedIndex(null);
    }
  }

  const canAdvance = !isMCQ || answered;

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

      <div className="relative z-10 min-h-screen p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-white/70 hover:text-white font-mono text-xs transition-colors"
          >
            <ArrowLeft size={16} />
            DASHBOARD
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <ImageWithFallback src="/mindCraft_logo_border.png" alt="MindCraft Logo" className="w-8 h-8" />
            <h1
              className="text-xl text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: 'monospace', letterSpacing: '2px' }}
            >
              MINDCRAFT
            </h1>
          </div>
        </div>

        <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col gap-4">
          {/* Module + title bar */}
          <div className="bg-gradient-to-br from-[#976d4c] to-[#7b583d] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="text-white/50 font-mono text-xs">{lesson.module}</span>
              <span className="text-white/30 font-mono text-xs">›</span>
              <h1 className="text-white font-mono text-sm font-bold drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                {lesson.title}
              </h1>
            </div>
            {!done && (
              <div className="mt-3">
                <ProgressBar current={stepIndex + 1} total={steps.length} />
              </div>
            )}
          </div>

          {/* Content card */}
          <div className="flex-1 bg-[#3C3C3C] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-6">
            {done ? (
              <CompletionScreen
                lessonTitle={lesson.title}
                xp={lesson.xp}
                correct={correctCount}
                total={quizTotal}
                saving={saving}
                onBack={() => navigate('/dashboard')}
              />
            ) : (
              <div className="flex flex-col gap-6 h-full">
                <div className="flex-1">
                  {currentStep.type === 'learn' && <LearnCard step={currentStep} />}
                  {currentStep.type === 'mcq' && (
                    <MCQCard
                      step={currentStep}
                      onAnswer={handleAnswer}
                      answered={answered}
                      selectedIndex={selectedIndex}
                    />
                  )}
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleNext}
                    disabled={!canAdvance}
                    className={`font-mono text-sm px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                      canAdvance ? 'bg-[#72b149] text-white hover:brightness-110' : 'bg-white/10 text-white/30'
                    }`}
                  >
                    {stepIndex + 1 >= steps.length ? 'FINISH' : 'NEXT'}
                  </button>
                </div>
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
