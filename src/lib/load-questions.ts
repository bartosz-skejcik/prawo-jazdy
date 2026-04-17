import fs from "fs";
import path from "path";
import { parseQuestionsCSV } from "./parse-questions";
import type { Question } from "./quiz";

let cachedQuestions: Question[] | null = null;

export function loadQuestions(): Question[] {
  if (cachedQuestions) return cachedQuestions;

  const csvPath = path.join(process.cwd(), "data", "questions.csv");

  if (!fs.existsSync(csvPath)) {
    console.warn(
      "questions.csv not found at", csvPath,
      "— returning empty list"
    );
    return [];
  }

  const csvText = fs.readFileSync(csvPath, "utf-8");
  cachedQuestions = parseQuestionsCSV(csvText);
  return cachedQuestions;
}
