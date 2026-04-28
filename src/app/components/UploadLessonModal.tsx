import { useRef, useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader2, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase/client';
import { parseLessonDocx } from '../utils/parseLesson';
import type { Lesson } from '../../data/lessons';

interface Props {
  onClose: () => void;
  onUploaded: () => void;
}

type Stage = 'idle' | 'parsing' | 'preview' | 'saving' | 'done' | 'error';

const TEMPLATE = `MODULE:BECE
TITLE:My New Lesson
DESCRIPTION:A short description of this lesson
XP:200

LEARN
Introduction Title
Write the main content of this step here. It can be multiple lines and will be joined together as one paragraph.

BULLETS
First bullet point
Second bullet point
Third bullet point

HIGHLIGHT
An important phrase to remember

MCQ
Which spelling is CORRECT?
wrong option A
correct answer B
wrong option C
wrong option D
CORRECT:2
EXPLANATION:Option B is correct because it follows the rule.

LEARN
Another Step Title
Content for this step goes here.

MCQ
Another question?
option 1
option 2
option 3
option 4
CORRECT:3
EXPLANATION:Option 3 is correct.`;

export function UploadLessonModal({ onClose, onUploaded }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>('idle');
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState('');

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStage('parsing');
    setError('');
    setLesson(null);

    try {
      const buffer = await file.arrayBuffer();
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ arrayBuffer: buffer });
      const parsed = parseLessonDocx(result.value);

      if (!parsed) {
        setError('Could not parse the document. Make sure it follows the template format.');
        setStage('error');
        return;
      }

      setLesson(parsed);
      setStage('preview');
    } catch (err) {
      console.error(err);
      setError('Failed to read the file. Make sure it is a valid .docx document.');
      setStage('error');
    }
  }

  async function handleSave() {
    if (!lesson) return;
    setStage('saving');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Not signed in.'); setStage('error'); return; }

    const { error: dbError } = await supabase.from('uploaded_lessons').insert({
      created_by: user.id,
      lesson_data: lesson,
    });

    if (dbError) {
      setError(dbError.message);
      setStage('error');
      return;
    }

    setStage('done');
    setTimeout(() => {
      onUploaded();
      onClose();
    }, 1200);
  }

  function downloadTemplate() {
    const blob = new Blob([TEMPLATE], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lesson_template.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div
        className="relative w-full max-w-lg bg-gradient-to-br from-[#976d4c] to-[#7b583d] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)]"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b-4 border-black">
          <div className="flex items-center gap-3">
            <Upload size={18} className="text-white" />
            <h2
              className="text-white text-lg drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: 'monospace', letterSpacing: '2px' }}
            >
              UPLOAD LESSON
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Template download hint */}
          {stage === 'idle' && (
            <div className="bg-[#3C3C3C] border-2 border-black p-3 flex flex-col gap-2">
              <p className="text-white/70 font-mono text-xs leading-relaxed">
                Upload a <span className="text-[#FCD34D]">.docx</span> file formatted using the lesson template.
                The document must include MODULE, TITLE, DESCRIPTION, XP, and LEARN/MCQ sections.
              </p>
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-2 text-[#83aeff] font-mono text-xs hover:text-white transition-colors"
              >
                <FileText size={12} />
                Download template (.txt)
              </button>
            </div>
          )}

          {/* File picker */}
          {(stage === 'idle' || stage === 'error') && (
            <div>
              <input
                ref={fileRef}
                type="file"
                accept=".docx"
                className="hidden"
                onChange={handleFile}
              />
              <button
                onClick={() => { setStage('idle'); fileRef.current?.click(); }}
                className="w-full bg-[#3C3C3C] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all p-4 flex flex-col items-center gap-2 hover:brightness-110"
              >
                <Upload size={24} className="text-[#83aeff]" />
                <span className="text-white font-mono text-sm">CLICK TO SELECT .DOCX FILE</span>
              </button>
            </div>
          )}

          {/* Parsing spinner */}
          {stage === 'parsing' && (
            <div className="flex items-center justify-center gap-3 py-8 text-white/60 font-mono text-sm">
              <Loader2 size={18} className="animate-spin" />
              READING DOCUMENT...
            </div>
          )}

          {/* Error */}
          {stage === 'error' && (
            <div className="bg-red-900/40 border-2 border-red-500/60 p-3 flex items-start gap-2">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-300 font-mono text-xs leading-relaxed">{error}</p>
            </div>
          )}

          {/* Preview */}
          {stage === 'preview' && lesson && (
            <div className="flex flex-col gap-3">
              <p className="text-white/50 font-mono text-xs">PARSED LESSON PREVIEW:</p>
              <div className="bg-[#3C3C3C] border-4 border-[#72b149]/60 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/50 font-mono text-xs">{lesson.module}</span>
                  <span className="text-[#FCD34D] font-mono text-xs">+{lesson.xp} XP</span>
                </div>
                <h3
                  className="text-white font-mono text-sm font-bold drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]"
                >
                  {lesson.title}
                </h3>
                {lesson.description && (
                  <p className="text-white/60 font-mono text-xs">{lesson.description}</p>
                )}
                <div className="flex items-center gap-3 mt-1 pt-2 border-t-2 border-black/30">
                  <span className="text-[#83aeff] font-mono text-xs">
                    {lesson.steps.filter(s => s.type === 'learn').length} learn steps
                  </span>
                  <span className="text-white/30 font-mono text-xs">•</span>
                  <span className="text-[#83aeff] font-mono text-xs">
                    {lesson.steps.filter(s => s.type === 'mcq').length} questions
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-1">
                <button
                  onClick={() => { setLesson(null); setStage('idle'); if (fileRef.current) fileRef.current.value = ''; }}
                  className="flex-1 bg-[#3C3C3C] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] font-mono text-white/70 text-xs py-2.5 hover:brightness-110 transition-all"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-[#72b149] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] font-mono text-white text-xs py-2.5 hover:brightness-110 transition-all"
                >
                  SAVE LESSON
                </button>
              </div>
            </div>
          )}

          {/* Saving spinner */}
          {stage === 'saving' && (
            <div className="flex items-center justify-center gap-3 py-8 text-white/60 font-mono text-sm">
              <Loader2 size={18} className="animate-spin" />
              SAVING LESSON...
            </div>
          )}

          {/* Done */}
          {stage === 'done' && (
            <div className="flex items-center justify-center gap-3 py-8 text-[#72b149] font-mono text-sm">
              <CheckCircle size={18} />
              LESSON SAVED!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
