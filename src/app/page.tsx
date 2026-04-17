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
import { Car, ClipboardCheck, Star, Trophy } from "lucide-react";

export default function HomePage() {
  const questions = loadQuestions();
  const categoryBCount = questions.filter((q) =>
    q.category.toUpperCase().includes("B")
  ).length;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-10 sm:py-16">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary text-primary-foreground text-3xl font-black mb-5 shadow-lg shadow-primary/30">
            <Car className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Prawo Jazdy
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Kat. B · Oficjalna baza pytań egzaminacyjnych
          </p>
        </div>

        {/* Main card */}
        <Card className="shadow-xl border-border/60">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Symulacja egzaminu</CardTitle>
                <CardDescription>
                  32 losowe pytania · wynik jak na prawdziwym egzaminie
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex flex-col gap-1 p-3 rounded-xl bg-muted">
                <span className="text-muted-foreground text-xs uppercase tracking-wide font-medium">Pytań w teście</span>
                <span className="font-bold text-foreground text-2xl">32</span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-xl bg-muted">
                <span className="text-muted-foreground text-xs uppercase tracking-wide font-medium">Wynik zaliczający</span>
                <span className="font-bold text-foreground text-2xl">68 / 74</span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-xl bg-muted">
                <span className="text-muted-foreground text-xs uppercase tracking-wide font-medium">Baza pytań</span>
                <span className="font-bold text-foreground text-2xl">
                  {categoryBCount > 0 ? categoryBCount : "–"}
                </span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-xl bg-muted">
                <span className="text-muted-foreground text-xs uppercase tracking-wide font-medium">Punktacja</span>
                <div className="flex gap-1.5 mt-1">
                  <Badge variant="default" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    3 pkt
                  </Badge>
                  <Badge variant="secondary" className="text-xs">1 pkt</Badge>
                </div>
              </div>
            </div>

            {categoryBCount === 0 && (
              <div className="mt-4 p-3 rounded-xl border border-red-300 bg-red-50 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                <strong>Brak bazy pytań.</strong> Uruchom skrypt konwersji:{" "}
                <code className="bg-muted px-1 rounded text-xs">
                  python scripts/convert-questions.py pytania.xlsx
                </code>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button asChild size="lg" className="w-full text-base font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-shadow">
              <Link href="/quiz">
                <Trophy className="w-4 h-4 mr-2" />
                Rozpocznij egzamin
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-5">
          Pytania pochodzą z oficjalnego serwisu{" "}
          <span className="font-medium">gov.pl</span>.{" "}
          Multimedia umieść w{" "}
          <code className="bg-muted px-1 rounded">public/media/</code>.
        </p>
      </div>
    </main>
  );
}
