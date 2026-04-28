import { useRef, useState } from 'react';
import { X, Loader2, CheckCircle, Calendar, FileText, ClipboardList, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase/client';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export function UploadAssignmentModal({ onClose, onCreated }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [rubricFile, setRubricFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const rubricRef = useRef<HTMLInputElement>(null);

  async function handleSave() {
    if (!title.trim()) { setError('Title is required.'); return; }
    setSaving(true);
    setError('');

    const { data: assignment, error: insertError } = await supabase
      .from('assignments')
      .insert({
        title: title.trim(),
        description: description.trim() || null,
        due_date: dueDate || null,
        rubric_path: null,
      })
      .select()
      .single();

    if (insertError || !assignment) {
      setError(insertError?.message ?? 'Failed to create assignment.');
      setSaving(false);
      return;
    }

    if (rubricFile) {
      const path = `rubrics/${assignment.id}/${rubricFile.name}`;
      const { error: storageError } = await supabase.storage
        .from('assignments')
        .upload(path, rubricFile, { upsert: true });

      if (!storageError) {
        await supabase.from('assignments')
          .update({ rubric_path: path })
          .eq('id', assignment.id);
      }
    }

    setDone(true);
    setTimeout(() => { onCreated(); onClose(); }, 1200);
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
            <ClipboardList size={18} className="text-white" />
            <h2
              className="text-white text-lg drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: 'monospace', letterSpacing: '2px' }}
            >
              NEW ASSIGNMENT
            </h2>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {error && (
            <div className="bg-red-900/40 border-2 border-red-500/60 p-3 flex items-start gap-2">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-300 font-mono text-xs">{error}</p>
            </div>
          )}

          {done ? (
            <div className="flex items-center justify-center gap-3 py-8 text-[#72b149] font-mono text-sm">
              <CheckCircle size={18} />
              ASSIGNMENT CREATED!
            </div>
          ) : saving ? (
            <div className="flex items-center justify-center gap-3 py-8 text-white/60 font-mono text-sm">
              <Loader2 size={18} className="animate-spin" />
              SAVING...
            </div>
          ) : (
            <>
              {/* Title */}
              <div>
                <label className="block text-white/70 font-mono text-xs mb-1.5">ASSIGNMENT TITLE *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Persuasive Essay — Term 2"
                  className="w-full bg-[#3C3C3C] border-4 border-black px-3 py-2 text-white font-mono text-sm placeholder:text-white/30 focus:outline-none focus:border-[#83aeff] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-white/70 font-mono text-xs mb-1.5">INSTRUCTIONS / DESCRIPTION</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe what students need to submit..."
                  rows={3}
                  className="w-full bg-[#3C3C3C] border-4 border-black px-3 py-2 text-white font-mono text-sm placeholder:text-white/30 focus:outline-none focus:border-[#83aeff] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] resize-none"
                />
              </div>

              {/* Due date */}
              <div>
                <label className="block text-white/70 font-mono text-xs mb-1.5">DUE DATE</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full bg-[#3C3C3C] border-4 border-black pl-9 pr-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#83aeff] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Rubric */}
              <div>
                <label className="block text-white/70 font-mono text-xs mb-1.5">RUBRIC (OPTIONAL)</label>
                <input
                  ref={rubricRef}
                  type="file"
                  className="hidden"
                  onChange={e => setRubricFile(e.target.files?.[0] ?? null)}
                />
                <button
                  onClick={() => rubricRef.current?.click()}
                  className="w-full bg-[#3C3C3C] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all p-3 flex items-center gap-3 hover:brightness-110 text-left"
                >
                  <FileText size={16} className={rubricFile ? 'text-[#72b149]' : 'text-white/40'} />
                  <span className={`font-mono text-xs truncate ${rubricFile ? 'text-white' : 'text-white/40'}`}>
                    {rubricFile ? rubricFile.name : 'Click to attach rubric file...'}
                  </span>
                </button>
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-[#FCD34D] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] font-mono text-black text-sm py-3 hover:brightness-110 transition-all font-bold"
              >
                CREATE ASSIGNMENT
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
