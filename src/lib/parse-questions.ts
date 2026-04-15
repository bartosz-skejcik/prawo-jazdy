import type { Question, AnswerOption } from "./quiz";

/**
 * Parses questions from a CSV string.
 *
 * Expected CSV columns (with header row):
 * id,question,answer_a,answer_b,answer_c,correct,media,points,category
 *
 * The CSV can also be in the official Polish gov.pl format with Polish column
 * headers. Both formats are auto-detected.
 */
export function parseQuestionsCSV(csvText: string): Question[] {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const header = parseCSVLine(lines[0]);
  const questions: Question[] = [];

  // Detect column indices – support both English and Polish header names
  const colIdx = detectColumns(header);

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 6) continue;

    const id = cols[colIdx.id]?.trim() || String(i);
    const question = cols[colIdx.question]?.trim();
    const answerA = cols[colIdx.answerA]?.trim();
    const answerB = cols[colIdx.answerB]?.trim();
    const answerC = cols[colIdx.answerC]?.trim();
    const correctRaw = cols[colIdx.correct]?.trim().toUpperCase();
    const media = cols[colIdx.media]?.trim() || undefined;
    const pointsRaw = parseInt(cols[colIdx.points]?.trim() || "1", 10);
    const category = cols[colIdx.category]?.trim() || "B";

    if (!question || !answerA || !answerB || !answerC) continue;
    if (!["A", "B", "C"].includes(correctRaw)) continue;

    const points = pointsRaw === 3 ? 3 : 1;
    const mediaType = media
      ? /\.(mp4|webm|avi|mov)$/i.test(media)
        ? "video"
        : "image"
      : undefined;

    questions.push({
      id,
      question,
      answerA,
      answerB,
      answerC,
      correct: correctRaw as AnswerOption,
      media: media || undefined,
      mediaType,
      points: points as 1 | 3,
      category,
    });
  }

  return questions;
}

function detectColumns(header: string[]): {
  id: number;
  question: number;
  answerA: number;
  answerB: number;
  answerC: number;
  correct: number;
  media: number;
  points: number;
  category: number;
} {
  const h = header.map((s) => s.toLowerCase().trim());

  const find = (...names: string[]): number | undefined => {
    for (const name of names) {
      const idx = h.findIndex((col) => col.includes(name));
      if (idx !== -1) return idx;
    }
    return undefined;
  };

  return {
    id: find("id", "numer", "number") ?? 0,
    question: find("question", "pytanie", "treść", "tresc") ?? 1,
    answerA: find("answer_a", "odpowiedź a", "odp_a", "a)") ?? 2,
    answerB: find("answer_b", "odpowiedź b", "odp_b", "b)") ?? 3,
    answerC: find("answer_c", "odpowiedź c", "odp_c", "c)") ?? 4,
    correct: find("correct", "prawidłowa", "prawidlowa", "poprawna") ?? 5,
    media: find("media", "multimedia", "plik") ?? 6,
    points: find("points", "pkt", "punkty", "waga") ?? 7,
    category: find("category", "kategori") ?? 8,
  };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
