# Rubric Feedback Bot (no AI)

A website that scores short **written** answers with an open rubric and gives
three-part feedback (Where am I going? How am I going? Where to next?).
No AI: every point comes from word lists and rules in `scorer.js`.
GitHub Actions audits the bot after every change by comparing it with a teacher's scores.

## Files

| File | What it does |
|---|---|
| `index.html` | The website (GitHub Pages) |
| `scorer.js` | The rubric: criteria, word lists (EN / RU / KZ), feedback texts, safety rules |
| `samples.js` | Answers with the teacher's scores (calibration set) |
| `audit.js` | Compares the bot with the teacher; fails if agreement < 80% |
| `.github/workflows/audit.yml` | Runs `audit.js` on every commit |

## Set up (about 5 minutes)

1. github.com → **+** → **New repository** → name `rubric-feedback`, **Public** → **Create repository**.
2. **uploading an existing file** → choose `index.html`, `scorer.js`, `samples.js`, `audit.js`, `README.md` → **Commit changes**.
3. **Add file → Create new file**, name `.github/workflows/audit.yml`, paste the contents of that file → **Commit changes**.
4. **Settings → Pages** → Source: **Deploy from a branch**, Branch: **main**, folder **/ (root)** → **Save**.
   After 1–2 minutes the site link appears at the top of the Pages settings.
5. **Actions** tab: the audit run should be green ✓ with "88% agreement".

## Live demo (2 minutes)

1. Open the site. Click samples **A**, **B**, **C** (the answers from the "fool the machine" slide):
   A → 2/2, B → 0/2 + teacher check (keyword stuffing), C → 2/2 (own words: *pulls*, *warmth*, *fingers*).
2. Writing tab → **Weak** → 2/4 and the next step "Add one fact…". Then **Russian** → 4/4.
3. Show the **Audit** table: 88% agreement, and the two rows where the bot disagrees with the teacher.
4. Optional: let the audience scan the QR code and write their own answer.

## Change the rules (shows the audit working)

Open `scorer.js` → pencil icon → for example add `'highway'` to the `MOVE` word list → **Commit**.
Watch **Actions**: the audit runs again and shows whether agreement went up or down.

---

## Кратко по-русски

1. Создайте публичный репозиторий `rubric-feedback` и загрузите все файлы.
2. Файл `.github/workflows/audit.yml` создайте вручную через **Add file → Create new file** и вставьте текст.
3. **Settings → Pages → main / root → Save** — через 1–2 минуты появится ссылка на сайт.
4. На демо: кнопки **A, B, C** → 2/2, 0/2 с проверкой учителем, 2/2. Потом вкладка Writing → **Weak** и **Russian**.
5. Таблица **Audit**: бот совпадает с учителем в 88% случаев, два расхождения показывают пределы правил.
