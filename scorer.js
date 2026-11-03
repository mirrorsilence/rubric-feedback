/*
 * Rubric Feedback Bot — scoring rules (no AI).
 * Every score comes from the open rules below. A teacher can edit the word lists,
 * the feedback texts and the points without touching the rest of the code.
 * Works in the browser (index.html) and in Node (audit.js on GitHub Actions).
 *
 * Word list syntax: "word" = exact word, "stem*" = any ending (heat* = heat, heats, heating),
 * "two words" = a phrase. Answers can be in English, Russian or Kazakh.
 */
(function (root) {
  'use strict';

  // ---------- The rubrics ----------
  var TASKS = {
    spoon: {
      id: 'spoon',
      title: 'Science: the cold spoon',
      prompt: 'Why does a metal spoon feel colder than a wooden one, even when both are at room temperature?',
      maxScore: 2,
      minWords: 5,
      goal: 'Explain WHY with two ideas: (1) metal moves (conducts) heat better than wood; (2) that heat comes from your hand.',
      criteria: [
        {
          id: 'conducts', label: 'Metal moves heat faster', points: 1,
          // OR of AND-groups: "conducts" alone is enough, or a moving verb + a heat word
          match: [
            ['CONDUCT'],
            ['MOVE', 'HEAT']
          ],
          next: 'Explain what happens to the heat: which material moves (conducts) heat away faster, metal or wood?'
        },
        {
          id: 'hand', label: 'Heat comes from your hand', points: 1,
          match: [['HAND']],
          next: 'Say where the heat comes from: what is touching the spoon?'
        }
      ],
      words: {
        CONDUCT: ['conduct*', 'провод*', 'өткіз*'],
        MOVE: ['transfer*', 'carr*', 'mov*', 'take', 'takes', 'taking', 'took', 'pull*', 'draw*', 'drew', 'steal*', 'stole*', 'absorb*', 'flow*', 'leav*', 'escap*', 'go', 'goes', 'going', 'went', 'pass*', 'переда*', 'забира*', 'отбира*', 'впитыва*', 'уход*', 'тян*', 'алады', 'тартады', 'кетеді'],
        HEAT: ['heat', 'warmth', 'warm', 'thermal', 'energy', 'тепл*', 'энерги*', 'жылу*'],
        HAND: ['hand*', 'finger*', 'skin', 'palm*', 'body', 'рук*', 'руч*', 'пальц*', 'пальч*', 'кож*', 'тело', 'тела', 'телу', 'қол*', 'саусақ*', 'тері*', 'дене*']
      },
      misconceptions: [
        {
          // regular expressions (lower case)
          patterns: ['metal (is|was|has) (colder|cooler|more cold|cold)', 'cold (goes|moves|passes|flows|comes|enters|travels)', 'gives? (you )?(the )?cold', 'холод\\p{L}* (переда|ид|переход|пере)\\p{L}*', 'металл холоднее'],
          capAt: 1,
          message: 'Careful: both spoons are at the same temperature. Cold does not travel; heat moves from your hand into the metal.'
        }
      ]
    },

    argument: {
      id: 'argument',
      title: 'Writing: should phones be banned in school?',
      prompt: 'Should phones be banned in school? Write a paragraph of 3–5 sentences.',
      maxScore: 4,
      minWords: 12,
      goal: 'Write a paragraph with a clear claim, evidence and reasoning; add a counterargument for full marks.',
      criteria: [
        { id: 'claim', label: 'Claim', points: 1, match: [['CLAIM']],
          next: 'Start with your position. Try: “I think phones should…”' },
        { id: 'evidence', label: 'Evidence', points: 1, match: [['EVIDENCE']],
          next: 'Add one fact: a number, a study or a real example. Try: “For example, in PISA-2022…”' },
        { id: 'reason', label: 'Reasoning', points: 1, match: [['REASON']],
          next: 'Explain how your evidence supports your claim. Try: “This means…”' },
        { id: 'counter', label: 'Counterargument', points: 1, match: [['COUNTER']],
          next: 'Show the other side, then answer it. Try: “However, some people say…”' }
      ],
      words: {
        CLAIM: ['should', 'shouldn’t', "shouldn't", 'must', 'need to', 'needs to', 'have to', 'has to', 'ought to', 'i think', 'i believe', 'in my opinion', 'i agree', 'i disagree', 'долж*', 'нужно', 'надо', 'я считаю', 'я думаю', 'по-моему', 'по моему мнению', 'керек', 'менің ойымша'],
        EVIDENCE: ['#NUMBER', 'for example', 'for instance', 'such as', 'research*', 'study', 'studies', 'survey*', 'data', 'according to', 'pisa', 'oecd', 'report*', 'например', 'исследован*', 'по данным', 'опрос*', 'согласно', 'мысалы', 'зерттеу*'],
        REASON: ['because', 'so', 'therefore', 'this means', 'that means', 'which means', 'as a result', 'that is why', 'since', 'потому что', 'поэтому', 'так как', 'значит', 'следовательно', 'себебі', 'сондықтан'],
        COUNTER: ['however', 'but', 'on the other hand', 'although', 'though', 'some people', 'others say', 'однако', 'но', 'с другой стороны', 'хотя', 'некоторые', 'алайда', 'бірақ']
      },
      misconceptions: []
    }
  };

  // ---------- Helpers ----------
  var L = '\\p{L}\\p{N}';
  function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function termToRegex(term) {
    if (term === '#NUMBER') return new RegExp('(?<![' + L + '])\\d+(?:[.,]\\d+)?\\s*%?', 'giu');
    var stem = term.slice(-1) === '*';
    var body = escapeRe(stem ? term.slice(0, -1) : term).replace(/\s+/g, '\\s+');
    if (stem) body += '\\p{L}*';
    return new RegExp('(?<![' + L + '])' + body + '(?![' + L + '])', 'giu');
  }

  function normalize(text) {
    return String(text || '').toLowerCase().replace(/ё/g, 'е').replace(/[‘’]/g, '’');
  }

  function wordList(text) {
    return normalize(text).match(/[\p{L}\p{N}’']+/gu) || [];
  }

  function findAll(text, terms) {
    var hits = [];
    terms.forEach(function (t) {
      var re = termToRegex(t), m;
      while ((m = re.exec(text)) !== null) {
        hits.push({ start: m.index, end: m.index + m[0].length, text: m[0] });
        if (m[0].length === 0) re.lastIndex++;
      }
    });
    return hits;
  }

  // ---------- Scoring ----------
  function score(taskId, answer) {
    var task = TASKS[taskId];
    var text = normalize(answer);
    var words = wordList(answer);
    var unique = {};
    words.forEach(function (w) { unique[w] = true; });
    var uniqueRatio = words.length ? Object.keys(unique).length / words.length : 0;
    var sentences = String(answer || '').split(/[.!?…]+/).filter(function (s) { return s.trim().length > 0; }).length;

    var result = {
      task: task.id, maxScore: task.maxScore, score: 0, goal: task.goal,
      criteria: [], next: [], warnings: [], teacherCheck: [], highlights: []
    };

    // Guards: answers a machine should not trust
    if (words.length < task.minWords) {
      result.warnings.push('Too short: write at least ' + task.minWords + ' words in full sentences.');
      result.teacherCheck.push('very short answer');
      result.next.push('Write a full answer of at least ' + task.minWords + ' words.');
      task.criteria.forEach(function (c) { result.criteria.push({ id: c.id, label: c.label, ok: false, found: [] }); });
      return result;
    }
    if (words.length >= 4 && uniqueRatio < 0.6) {
      result.warnings.push('Your answer repeats the same words. Write it in your own words, as full sentences.');
      result.teacherCheck.push('repeated words (possible keyword stuffing)');
      result.next.push('Rewrite your answer as one or two real sentences.');
      task.criteria.forEach(function (c) { result.criteria.push({ id: c.id, label: c.label, ok: false, found: [] }); });
      return result;
    }

    // Criteria
    task.criteria.forEach(function (c) {
      var ok = false, found = [];
      c.match.forEach(function (andGroup) {
        var groupHits = andGroup.map(function (key) { return findAll(text, task.words[key]); });
        var all = groupHits.every(function (h) { return h.length > 0; });
        if (all) {
          ok = true;
          groupHits.forEach(function (h) { h.forEach(function (x) { found.push(x); }); });
        }
      });
      if (ok) {
        result.score += c.points;
        found.forEach(function (f) { result.highlights.push({ start: f.start, end: f.end, crit: c.id }); });
      } else {
        result.next.push(c.next);
      }
      var seen = {};
      result.criteria.push({
        id: c.id, label: c.label, ok: ok,
        found: found.map(function (f) { return f.text; }).filter(function (t) { if (seen[t]) return false; seen[t] = true; return true; })
      });
    });

    // Misconceptions
    task.misconceptions.forEach(function (mc) {
      var hit = mc.patterns.some(function (p) { return new RegExp(p, 'iu').test(text); });
      if (hit) {
        result.warnings.push(mc.message);
        if (result.score > mc.capAt) result.score = mc.capAt;
        result.next.unshift(mc.message);
      }
    });

    // When should a human look?
    if (task.id === 'argument' && sentences < 2) result.teacherCheck.push('only one sentence');
    if (result.score === task.maxScore && words.length < task.minWords * 2) result.teacherCheck.push('full marks for a short answer');

    if (result.next.length === 0) {
      result.next.push(task.id === 'spoon'
        ? 'Full marks. Next challenge: why does a metal bench feel hotter than a wooden one on a sunny day?'
        : 'Full marks. Next challenge: answer the counterargument with a second piece of evidence.');
    }
    return result;
  }

  var API = { TASKS: TASKS, score: score, normalize: normalize };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.RubricBot = API;
})(this);
