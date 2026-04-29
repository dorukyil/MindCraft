import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY ?? '');

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 8192) {
    binary += String.fromCharCode(...Array.from(bytes.subarray(i, i + 8192)));
  }
  return btoa(binary);
}

type FilePart =
  | { type: 'inline'; mimeType: string; data: string }
  | { type: 'text'; content: string };

async function parseFile(bytes: ArrayBuffer, name: string): Promise<FilePart> {
  const lower = name.toLowerCase();
  if (lower.endsWith('.pdf')) {
    return { type: 'inline', mimeType: 'application/pdf', data: arrayBufferToBase64(bytes) };
  }
  if (lower.endsWith('.docx') || lower.endsWith('.doc')) {
    const { extractRawText } = await import('mammoth');
    const { value } = await extractRawText({ arrayBuffer: bytes });
    return { type: 'text', content: value };
  }
  return { type: 'text', content: new TextDecoder().decode(bytes) };
}

export interface GeminiGradeResult {
  suggestedGrade: string;
  studentFeedback: string;
  report: string;
}

export async function gradeSubmission(params: {
  submissionBytes: ArrayBuffer;
  submissionName: string;
  rubricBytes?: ArrayBuffer;
  rubricName?: string;
  assignmentTitle: string;
  assignmentDescription?: string | null;
}): Promise<GeminiGradeResult> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const submissionPart = await parseFile(params.submissionBytes, params.submissionName);
  const rubricPart =
    params.rubricBytes && params.rubricName
      ? await parseFile(params.rubricBytes, params.rubricName)
      : null;

  const prompt = [
    `You are an expert teacher grading a student assignment.`,
    `Assignment title: "${params.assignmentTitle}"`,
    params.assignmentDescription ? `Assignment description: ${params.assignmentDescription}` : '',
    rubricPart
      ? `A grading rubric is provided ${rubricPart.type === 'inline' ? 'as an attached file' : 'below'}.`
      : '',
    `The student submission is provided ${submissionPart.type === 'inline' ? 'as an attached file' : 'below'}.`,
    ``,
    `Grade the student's work thoroughly. Respond using exactly this format (no extra text outside these sections):`,
    `GRADE: [one of: A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F]`,
    `STUDENT_FEEDBACK:`,
    `[1-3 sentences of constructive feedback written directly to the student. Be encouraging and specific.]`,
    `TEACHER_REPORT:`,
    `[A detailed 2-4 paragraph report for the teacher: summarize the student's performance,`,
    ` highlight strengths, identify weaknesses, and justify the grade with specific references to the work.]`,
  ]
    .filter(Boolean)
    .join('\n');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parts: any[] = [{ text: prompt }];

  if (rubricPart) {
    if (rubricPart.type === 'inline') {
      parts.push({ text: '\n\n--- RUBRIC ---' });
      parts.push({ inlineData: { mimeType: rubricPart.mimeType, data: rubricPart.data } });
    } else {
      parts.push({ text: `\n\n--- RUBRIC ---\n${rubricPart.content}` });
    }
  }

  if (submissionPart.type === 'inline') {
    parts.push({ text: '\n\n--- STUDENT SUBMISSION ---' });
    parts.push({ inlineData: { mimeType: submissionPart.mimeType, data: submissionPart.data } });
  } else {
    parts.push({ text: `\n\n--- STUDENT SUBMISSION ---\n${submissionPart.content}` });
  }

  const response = await model.generateContent(parts);
  const text = response.response.text();

  const gradeMatch = text.match(/^GRADE:\s*([A-F][+\-]?)/im);
  const studentFeedbackMatch = text.match(/^STUDENT_FEEDBACK:\s*([\s\S]+?)(?=^TEACHER_REPORT:)/im);
  const teacherReportMatch = text.match(/^TEACHER_REPORT:\s*([\s\S]+)/im);

  return {
    suggestedGrade: gradeMatch?.[1]?.toUpperCase().trim() ?? '',
    studentFeedback: studentFeedbackMatch?.[1]?.trim() ?? '',
    report: teacherReportMatch?.[1]?.trim() ?? text,
  };
}
