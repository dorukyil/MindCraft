import type { Lesson, LearnStep, MCQStep } from '../../data/lessons';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Parses raw text extracted from a .docx file (via mammoth) into a Lesson object.
 *
 * Expected docx template format:
 *
 *   MODULE:BECE
 *   TITLE:My Lesson Title
 *   DESCRIPTION:Short description
 *   XP:200
 *
 *   LEARN
 *   Step Title Here
 *   Main content paragraph goes here.
 *
 *   BULLETS
 *   First bullet point
 *   Second bullet point
 *
 *   HIGHLIGHT
 *   An important phrase to remember
 *
 *   MCQ
 *   What is the correct answer?
 *   Wrong option A
 *   Correct answer B
 *   Wrong option C
 *   Wrong option D
 *   CORRECT:2
 *   EXPLANATION:Option B is correct because...
 */
export function parseLessonDocx(rawText: string): Lesson | null {
  const lines = rawText
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  let module = 'CUSTOM';
  let title = 'Untitled';
  let description = '';
  let xp = 100;
  const steps: (LearnStep | MCQStep)[] = [];

  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const upper = line.toUpperCase();

    if (upper.startsWith('MODULE:')) {
      module = line.slice(7).trim();
      i++;
    } else if (upper.startsWith('TITLE:')) {
      title = line.slice(6).trim();
      i++;
    } else if (upper.startsWith('DESCRIPTION:')) {
      description = line.slice(12).trim();
      i++;
    } else if (upper.startsWith('XP:')) {
      xp = parseInt(line.slice(3).trim(), 10) || 100;
      i++;
    } else if (upper === 'LEARN' || upper === 'MCQ') {
      break;
    } else {
      i++;
    }
  }

  while (i < lines.length) {
    const upper = lines[i].toUpperCase();

    if (upper === 'LEARN') {
      i++;
      const stepTitle = lines[i] ?? '';
      i++;

      const contentLines: string[] = [];
      const bullets: string[] = [];
      let highlight = '';
      let inBullets = false;

      while (i < lines.length) {
        const cur = lines[i].toUpperCase();
        if (cur === 'LEARN' || cur === 'MCQ') break;

        if (cur === 'BULLETS') {
          inBullets = true;
          i++;
          continue;
        }
        if (cur.startsWith('HIGHLIGHT:')) {
          highlight = lines[i].slice(10).trim();
          inBullets = false;
          i++;
          continue;
        }
        if (cur === 'HIGHLIGHT') {
          inBullets = false;
          i++;
          if (
            i < lines.length &&
            lines[i].toUpperCase() !== 'LEARN' &&
            lines[i].toUpperCase() !== 'MCQ' &&
            lines[i].toUpperCase() !== 'BULLETS'
          ) {
            highlight = lines[i];
            i++;
          }
          continue;
        }

        if (inBullets) {
          bullets.push(lines[i]);
        } else {
          contentLines.push(lines[i]);
        }
        i++;
      }

      const step: LearnStep = {
        type: 'learn',
        icon: 'learn',
        title: stepTitle,
        content: contentLines.join(' ').trim(),
      };
      if (bullets.length) step.bullets = bullets;
      if (highlight) step.highlight = highlight;
      steps.push(step);

    } else if (upper === 'MCQ') {
      i++;
      const question = lines[i] ?? '';
      i++;

      const options: string[] = [];
      while (i < lines.length && options.length < 4) {
        const cur = lines[i].toUpperCase();
        if (cur === 'LEARN' || cur === 'MCQ' || cur.startsWith('CORRECT:') || cur.startsWith('EXPLANATION:')) break;
        options.push(lines[i]);
        i++;
      }

      let correctIndex = 0;
      let explanation = '';

      if (i < lines.length && lines[i].toUpperCase().startsWith('CORRECT:')) {
        correctIndex = (parseInt(lines[i].slice(8).trim(), 10) || 1) - 1;
        i++;
      }
      if (i < lines.length && lines[i].toUpperCase().startsWith('EXPLANATION:')) {
        explanation = lines[i].slice(12).trim();
        i++;
      }

      steps.push({
        type: 'mcq',
        question,
        options,
        correctIndex: Math.max(0, Math.min(correctIndex, Math.max(0, options.length - 1))),
        explanation,
      } as MCQStep);

    } else {
      i++;
    }
  }

  if (!title || steps.length === 0) return null;

  return {
    id: `uploaded-${slugify(module)}-${slugify(title)}-${Date.now()}`,
    module,
    title,
    description,
    xp,
    status: 'locked',
    steps,
  };
}
