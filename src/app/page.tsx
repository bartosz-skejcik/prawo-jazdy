import Link from "next/link";
import { loadQuestions } from "@/lib/load-questions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const questions = loadQuestions();
  const categoryBCount = questions.filter((q) =>
    q.category.toUpperCase().includes("B")
  ).length;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
            B
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Prawo Jazdy
          </h1>
          <p className="text-muted-foreground mt-2">
            Przygotuj się do egzaminu na kategorię B
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Quiz – Kategoria B</CardTitle>
            <CardDescription>
              Test losuje 32 pytania z oficjalnej bazy pytań egzaminacyjnych.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted">
                <span className="text-muted-foreground">Liczba pytań</span>
                <span className="font-semibold text-foreground text-lg">32</span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted">
                <span className="text-muted-foreground">Wynik zaliczający</span>
                <span className="font-semibold text-foreground text-lg">68 / 74 pkt</span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted">
                <span className="text-muted-foreground">Baza pytań</span>
                <span className="font-semibold text-foreground text-lg">
                  {categoryBCount > 0 ? categoryBCount : "–"}
                </span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted">
                <span className="text-muted-foreground">Warianty punktowe</span>
                <div className="flex gap-1 mt-0.5">
                  <Badge variant="default">3 pkt</Badge>
                  <Badge variant="secondary">1 pkt</Badge>
                </div>
              </div>
            </div>

            {categoryBCount === 0 && (
              <div className="mt-4 p-3 rounded-lg border border-red-300 bg-red-50 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                <strong>Brak bazy pytań.</strong> Uruchom skrypt konwersji:{" "}
                <code className="bg-muted px-1 rounded text-xs">
                  python scripts/convert-questions.py pytania.xlsx
                </code>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild size="lg" className="w-full">
              <Link href="/quiz">Rozpocznij quiz →</Link>
            </Button>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Baza pytań pochodzi z oficjalnego serwisu gov.pl.{" "}
          Multimedia należy umieścić w folderze{" "}
          <code className="bg-muted px-1 rounded">public/media/</code>.
        </p>
      </div>
    </main>
  );
}
