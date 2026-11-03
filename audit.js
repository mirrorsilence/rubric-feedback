/*
 * Audit: does the bot agree with the teacher?
 * Runs on GitHub Actions after every change to the rules or the samples.
 * Fails (red ✗) if the bot agrees with human scores less than 80% of the time.
 */
const fs = require('fs');
const path = require('path');
const bot = require(path.join(__dirname, 'scorer.js'));
const samples = require(path.join(__dirname, 'samples.js'));

const THRESHOLD = 0.8;
let agree = 0;
const rows = [];

for (const s of samples) {
  const r = bot.score(s.task, s.answer);
  const ok = r.score === s.human;
  if (ok) agree++;
  rows.push({ s, r, ok });
  const mark = ok ? 'AGREE   ' : 'DISAGREE';
  console.log(`[${mark}] ${s.task.padEnd(8)} teacher ${s.human} | bot ${r.score}/${r.maxScore} | ${s.answer.slice(0, 70)}`);
}

const rate = agree / samples.length;
const pct = Math.round(rate * 100);
console.log(`\nAgreement with the teacher: ${agree}/${samples.length} = ${pct}% (needed: ${THRESHOLD * 100}%)`);

const summary = process.env.GITHUB_STEP_SUMMARY;
if (summary) {
  let md = `## Rubric bot audit: ${pct}% agreement with the teacher\n\n`;
  md += `${agree} of ${samples.length} answers got the same score as the teacher. Needed: ${THRESHOLD * 100}%.\n\n`;
  md += '| Task | Answer | Teacher | Bot | Result |\n|---|---|---|---|---|\n';
  for (const { s, r, ok } of rows) {
    const ans = s.answer.replace(/\|/g, '/').slice(0, 90) + (s.answer.length > 90 ? '…' : '');
    md += `| ${s.task} | ${ans} | ${s.human} | ${r.score}/${r.maxScore} | ${ok ? '✅ agree' : '❌ disagree: teacher should review'} |\n`;
  }
  md += '\n**Disagreements show where the rules are too narrow.** Edit the word lists in `scorer.js` and push again.\n';
  fs.appendFileSync(summary, md);
}

process.exit(rate >= THRESHOLD ? 0 : 1);
