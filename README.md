# Prawo Jazdy – Quiz Kategoria B

Aplikacja do ćwiczenia przed egzaminem na prawo jazdy kategorii B. Zbudowana z [Next.js](https://nextjs.org) i [shadcn/ui](https://ui.shadcn.com).

## Funkcje

- Losuje **32 pytania** z bazy (20 × 3 pkt + 12 × 1 pkt = maks. 74 pkt)
- Próg zaliczenia: **68 pkt** (jak na prawdziwym egzaminie)
- Obsługa multimediów (zdjęcia, filmy) dołączonych do pytań
- Przegląd odpowiedzi po zakończeniu quizu

---

## Szybki start

```bash
npm install
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000).

---

## Dodanie oficjalnej bazy pytań

### 1. Pobierz pliki

| Plik | URL |
|---|---|
| Baza pytań (XLSX) | https://www.gov.pl/attachment/921380de-3ac3-480d-b802-30aa03a67462 |
| Multimedia cz. 1 | https://www.gov.pl/pliki/mi/multimedia_do_pytan.zip |
| Multimedia cz. 2 | https://www.gov.pl/attachment/10d143bf-9e93-4d82-935d-48c89353d3ce |

### 2. Konwertuj XLSX → CSV

```bash
pip install openpyxl
python scripts/convert-questions.py pytania.xlsx data/questions.csv
```

### 3. Dodaj multimedia

Wypakuj archiwa z multimediami i skopiuj zawartość do folderu:

```
public/media/
├── PB001.jpg
├── PB002.mp4
└── ...
```

Nazwy plików muszą być zgodne z kolumną `media` w bazie pytań.

---

## Struktura projektu

```
prawo-jazdy/
├── data/
│   └── questions.csv          # baza pytań (CSV)
├── public/
│   └── media/                 # multimedia (obrazy, filmy)
├── scripts/
│   └── convert-questions.py   # konwerter XLSX → CSV
└── src/
    ├── app/
    │   ├── api/questions/     # endpoint API (GET /api/questions)
    │   ├── quiz/              # strona quizu
    │   └── page.tsx           # strona główna
    ├── components/ui/         # komponenty shadcn/ui
    └── lib/
        ├── quiz.ts            # logika quizu
        ├── parse-questions.ts # parser CSV
        └── load-questions.ts  # wczytywanie danych
```

## Format CSV

Aplikacja przyjmuje CSV z następującymi kolumnami:

```
id,question,answer_a,answer_b,answer_c,correct,media,points,category
```

- `correct` – `A`, `B` lub `C`
- `media` – nazwa pliku w `public/media/` (opcjonalne)
- `points` – `1` lub `3`
- `category` – kategoria (np. `B`)
