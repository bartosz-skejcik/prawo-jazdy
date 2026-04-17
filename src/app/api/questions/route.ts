import { NextResponse } from "next/server";
import { loadQuestions } from "@/lib/load-questions";
import { selectQuizQuestions } from "@/lib/quiz";

export async function GET() {
  const allQuestions = loadQuestions();
  const quizQuestions = selectQuizQuestions(allQuestions, 32);
  return NextResponse.json(quizQuestions);
}
