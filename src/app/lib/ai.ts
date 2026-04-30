import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY ?? '',
  dangerouslyAllowBrowser: true,
});

async function extractTextFromPDF(bytes: ArrayBuffer): Promise<string> {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url,
  ).href;
  const pdf = await pdfjs.getDocument({ data: bytes }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    text += content.items.map((item: any) => ('str' in item ? item.str : '')).join(' ') + '\n';
  }
  return text;
}

async function parseFile(bytes: ArrayBuffer, name: string): Promise<string> {
  const lower = name.toLowerCase();
  if (lower.endsWith('.pdf')) {
    return extractTextFromPDF(bytes);
  }
  if (lower.endsWith('.docx') || lower.endsWith('.doc')) {
    const { extractRawText } = await import('mammoth');
    const { value } = await extractRawText({ arrayBuffer: bytes });
    return value;
  }
  return new TextDecoder().decode(bytes);
}

export interface AIGradeResult {
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
}): Promise<AIGradeResult> {
  const submissionText = await parseFile(params.submissionBytes, params.submissionName);
  const rubricText =
    params.rubricBytes && params.rubricName
      ? await parseFile(params.rubricBytes, params.rubricName)
      : null;

  const prompt = [
    `You are an expert teacher grading a student assignment.`,
    `Assignment title: "${params.assignmentTitle}"`,
    params.assignmentDescription ? `Assignment description: ${params.assignmentDescription}` : '',
    rubricText ? `\n--- RUBRIC ---\n${rubricText}` : '',
    `\n--- STUDENT SUBMISSION ---\n${submissionText}`,
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

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  const text = completion.choices[0].message.content ?? '';

  const gradeMatch = text.match(/^GRADE:\s*([A-F][+\-]?)/im);
  const studentFeedbackMatch = text.match(/^STUDENT_FEEDBACK:\s*([\s\S]+?)(?=^TEACHER_REPORT:)/im);
  const teacherReportMatch = text.match(/^TEACHER_REPORT:\s*([\s\S]+)/im);

  return {
    suggestedGrade: gradeMatch?.[1]?.toUpperCase().trim() ?? '',
    studentFeedback: studentFeedbackMatch?.[1]?.trim() ?? '',
    report: teacherReportMatch?.[1]?.trim() ?? text,
  };
}
