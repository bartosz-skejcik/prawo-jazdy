export type AnswerOption = "A" | "B" | "C";

export interface Question {
  id: string;
  question: string;
  answerA: string;
  answerB: string;
  answerC: string;
  correct: AnswerOption;
  media?: string;
  mediaType?: "image" | "video";
  points: 1 | 3;
  category: string;
}

export interface QuizState {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, AnswerOption | null>;
  isFinished: boolean;
}

export function calculateScore(
  questions: Question[],
  answers: Record<string, AnswerOption | null>
): { score: number; maxScore: number; passed: boolean } {
  let score = 0;
  let maxScore = 0;

  for (const q of questions) {
    maxScore += q.points;
    if (answers[q.id] === q.correct) {
      score += q.points;
    }
  }

  // Polish driving test pass threshold: 68 out of 74 points
  const passed = score >= 68;
  return { score, maxScore, passed };
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function selectQuizQuestions(
  allQuestions: Question[],
  count = 32
): Question[] {
  const categoryB = allQuestions.filter((q) =>
    q.category.toUpperCase().includes("B")
  );

  // Split by point value
  const highPoints = categoryB.filter((q) => q.points === 3);
  const lowPoints = categoryB.filter((q) => q.points === 1);

  // Official test: 20 × 3pts + 12 × 1pt = 74 points max (pass: 68)
  // If count=32, use 20 high-point + 12 low-point questions
  const highCount = Math.min(20, highPoints.length);
  const lowCount = Math.min(count - highCount, lowPoints.length);

  const selectedHigh = shuffleArray(highPoints).slice(0, highCount);
  const selectedLow = shuffleArray(lowPoints).slice(0, lowCount);

  // If not enough split by points, just pick randomly
  if (selectedHigh.length + selectedLow.length < count) {
    return shuffleArray(categoryB).slice(0, count);
  }

  return shuffleArray([...selectedHigh, ...selectedLow]);
}
