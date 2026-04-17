"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Question, AnswerOption } from "@/lib/quiz";
import { calculateScore } from "@/lib/quiz";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type QuizStatus = "loading" | "error" | "active" | "finished";

export default function QuizClient() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [status, setStatus] = useState<QuizStatus>("loading");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerOption | null>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerOption | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    fetch("/api/questions")
      .then((r) => r.json())
      .then((data: Question[]) => {
        if (!Array.isArray(data) || data.length === 0) {
          setStatus("error");
          return;
        }
        setQuestions(data);
        setStatus("active");
      })
      .catch(() => setStatus("error"));
  }, []);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswerSelect = useCallback(
    (answer: AnswerOption) => {
      if (revealed) return;
      setSelectedAnswer(answer);
    },
    [revealed]
  );

  const handleConfirm = useCallback(() => {
    if (!selectedAnswer || !currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedAnswer }));
    setRevealed(true);
  }, [selectedAnswer, currentQuestion]);

  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      setStatus("finished");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setRevealed(false);
    }
  }, [isLastQuestion]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Ładowanie pytań…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Błąd</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Nie udało się załadować pytań. Upewnij się, że plik{" "}
              <code className="bg-muted px-1 rounded">data/questions.csv</code>{" "}
              istnieje i jest poprawny.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">← Powrót</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (status === "finished") {
    return <ResultsScreen questions={questions} answers={answers} />;
  }

  if (!currentQuestion) return null;

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answerOptions = [
    { label: "A" as AnswerOption, text: currentQuestion.answerA },
    { label: "B" as AnswerOption, text: currentQuestion.answerB },
    { label: "C" as AnswerOption, text: currentQuestion.answerC },
  ];

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col">
      {/* Top bar */}
      <div className="max-w-2xl mx-auto w-full mb-4">
        <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
          <span>
            Pytanie {currentIndex + 1} / {questions.length}
          </span>
          <Badge variant={currentQuestion.points === 3 ? "default" : "secondary"}>
            {currentQuestion.points} pkt
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question card */}
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="text-base font-medium leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
            {/* Media */}
            {currentQuestion.media && (
              <div className="w-full rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                {currentQuestion.mediaType === "video" ? (
                  <video
                    src={`/media/${currentQuestion.media}`}
                    controls
                    className="w-full max-h-64 object-contain"
                  />
                ) : (
                  <div className="relative w-full h-48">
                    <Image
                      src={`/media/${currentQuestion.media}`}
                      alt="Multimedia do pytania"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Answer options */}
            <div className="flex flex-col gap-2">
              {answerOptions.map(({ label, text }) => {
                const isSelected = selectedAnswer === label;
                const isCorrect = currentQuestion.correct === label;
                const isWrong = revealed && isSelected && !isCorrect;
                const showCorrect = revealed && isCorrect;

                return (
                  <button
                    key={label}
                    onClick={() => handleAnswerSelect(label)}
                    disabled={revealed}
                    className={[
                      "w-full text-left px-4 py-3 rounded-lg border text-sm transition-all",
                      "flex items-start gap-3",
                      "disabled:cursor-default",
                      !revealed && "hover:border-primary/50 hover:bg-muted cursor-pointer",
                      isSelected && !revealed
                        ? "border-primary bg-primary/10"
                        : "",
                      showCorrect
                        ? "border-green-500 bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300"
                        : "",
                      isWrong
                        ? "border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300"
                        : "",
                      !showCorrect && !isWrong && !isSelected
                        ? "border-border bg-background"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <span
                      className={[
                        "flex-shrink-0 w-6 h-6 rounded-full border text-xs font-bold flex items-center justify-center",
                        showCorrect
                          ? "border-green-500 text-green-700 dark:text-green-300"
                          : "",
                        isWrong ? "border-red-500 text-red-700 dark:text-red-300" : "",
                        isSelected && !revealed
                          ? "border-primary text-primary"
                          : "",
                        !showCorrect && !isWrong && !isSelected
                          ? "border-border text-muted-foreground"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {label}
                    </span>
                    <span className="flex-1 leading-snug">{text}</span>
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {revealed && (
              <div
                className={[
                  "p-3 rounded-lg text-sm font-medium",
                  answers[currentQuestion.id] === currentQuestion.correct
                    ? "bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300"
                    : "bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300",
                ].join(" ")}
              >
                {answers[currentQuestion.id] === currentQuestion.correct
                  ? "✓ Poprawna odpowiedź!"
                  : `✗ Błędna odpowiedź. Prawidłowa odpowiedź to: ${currentQuestion.correct}`}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            {!revealed ? (
              <Button
                className="w-full"
                onClick={handleConfirm}
                disabled={!selectedAnswer}
              >
                Zatwierdź odpowiedź
              </Button>
            ) : (
              <Button className="w-full" onClick={handleNext}>
                {isLastQuestion ? "Zakończ quiz" : "Następne pytanie →"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function ResultsScreen({
  questions,
  answers,
}: {
  questions: Question[];
  answers: Record<string, AnswerOption | null>;
}) {
  const { score, maxScore, passed } = calculateScore(questions, answers);
  const correctCount = questions.filter((q) => answers[q.id] === q.correct).length;
  const percentage = Math.round((score / maxScore) * 100);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Result icon */}
        <div className="text-center mb-6">
          <div
            className={[
              "inline-flex items-center justify-center w-20 h-20 rounded-full text-4xl mb-4",
              passed ? "bg-green-100 dark:bg-green-950" : "bg-red-100 dark:bg-red-950",
            ].join(" ")}
          >
            {passed ? "✓" : "✗"}
          </div>
          <h1
            className={[
              "text-2xl font-bold",
              passed ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400",
            ].join(" ")}
          >
            {passed ? "Egzamin zdany!" : "Egzamin niezdany"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {passed
              ? "Gratulacje! Wynik spełnia wymogi egzaminacyjne."
              : "Nie martw się – więcej ćwiczeń i następnym razem się uda!"}
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted">
                <span className="text-muted-foreground">Wynik punktowy</span>
                <span className="font-bold text-foreground text-xl">
                  {score} / {maxScore}
                </span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted">
                <span className="text-muted-foreground">Procent</span>
                <span className="font-bold text-foreground text-xl">{percentage}%</span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted">
                <span className="text-muted-foreground">Poprawne odpowiedzi</span>
                <span className="font-bold text-foreground text-xl">
                  {correctCount} / {questions.length}
                </span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted">
                <span className="text-muted-foreground">Próg zaliczenia</span>
                <span className="font-bold text-foreground text-xl">68 / 74</span>
              </div>
            </div>

            <Progress
              value={(score / maxScore) * 100}
              className={[
                "h-3",
                passed ? "[&>div]:bg-green-500" : "[&>div]:bg-red-500",
              ].join(" ")}
            />
          </CardContent>
          <CardFooter className="flex gap-2 flex-col sm:flex-row">
            <Button asChild variant="outline" className="w-full">
              <Link href="/">← Strona główna</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/quiz">Powtórz quiz</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Answer review */}
        <details className="mt-6">
          <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
            Przegląd odpowiedzi ({questions.length} pytań)
          </summary>
          <div className="mt-3 flex flex-col gap-2">
            {questions.map((q, idx) => {
              const userAnswer = answers[q.id];
              const correct = userAnswer === q.correct;
              return (
                <div
                  key={q.id}
                  className={[
                    "p-3 rounded-lg border text-sm",
                    correct
                      ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
                      : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-medium text-foreground">
                      {idx + 1}. {q.question}
                    </span>
                    <Badge
                      variant={correct ? "default" : "destructive"}
                      className="shrink-0"
                    >
                      {correct ? `+${q.points}` : "0"} pkt
                    </Badge>
                  </div>
                  {!correct && (
                    <p className="text-xs text-muted-foreground">
                      Twoja odpowiedź:{" "}
                      <strong>
                        {userAnswer ?? "brak"} –{" "}
                        {userAnswer
                          ? userAnswer === "A"
                            ? q.answerA
                            : userAnswer === "B"
                              ? q.answerB
                              : q.answerC
                          : "—"}
                      </strong>
                      <br />
                      Prawidłowa:{" "}
                      <strong className="text-green-700 dark:text-green-400">
                        {q.correct} –{" "}
                        {q.correct === "A"
                          ? q.answerA
                          : q.correct === "B"
                            ? q.answerB
                            : q.answerC}
                      </strong>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </details>
      </div>
    </div>
  );
}
