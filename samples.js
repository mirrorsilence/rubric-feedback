/*
 * Calibration set: real-style answers with the score a TEACHER gave.
 * audit.js (on GitHub Actions) and the website compare the bot with these human scores.
 * Add your own students' answers here to check the bot on your class.
 */
(function (root) {
  var SAMPLES = [
    // ----- Science: the cold spoon (max 2) -----
    { task: 'spoon', human: 2, label: 'A', answer: 'Metal conducts heat away from your hand faster than wood.' },
    { task: 'spoon', human: 0, label: 'B', answer: 'Metal heat conducts metal heat conducts.' },
    { task: 'spoon', human: 2, label: 'C', answer: 'The steel one pulls warmth out of my fingers much quicker.' },
    { task: 'spoon', human: 0, answer: 'Because metal is colder than wood.' },
    { task: 'spoon', human: 2, answer: 'Metal is a good conductor, so it takes heat from your skin quickly.' },
    { task: 'spoon', human: 2, answer: 'Металл лучше проводит тепло и быстро забирает его от руки.' },
    { task: 'spoon', human: 1, answer: 'Wood is an insulator, so it does not take heat from you.' },
    { task: 'spoon', human: 0, answer: 'The metal spoon just feels colder than the wooden one.' },
    { task: 'spoon', human: 2, answer: 'Heat flows quickly from your fingers into the metal.' },
    { task: 'spoon', human: 1, answer: 'Metal is like a highway for heat and wood is like a traffic jam.' },

    // ----- Writing: phones in school (max 4) -----
    { task: 'argument', human: 2, label: 'Weak', answer: 'Phones should be banned in school because they are distracting. Many students use phones in lessons. So phones are bad.' },
    { task: 'argument', human: 4, label: 'Strong', answer: 'I think phones should be limited in lessons. In PISA-2022, 23% of students in Kazakhstan said devices distract them in most maths lessons. This means many students lose focus, so they learn less. However, phones can help when the teacher uses them for quizzes.' },
    { task: 'argument', human: 0, label: 'Stuffing', answer: 'Should because for example however 23%.' },
    { task: 'argument', human: 4, label: 'Russian', answer: 'Я считаю, что телефоны нужно ограничить на уроках. Например, по данным PISA, 23% учеников отвлекаются на гаджеты. Поэтому они хуже учатся. Однако телефоны полезны для тестов.' },
    { task: 'argument', human: 3, answer: 'Phones are useful in school. Students can search for information and use dictionaries. Teachers can make quick quizzes. So phones should stay.' },
    { task: 'argument', human: 3, answer: 'In my opinion phones must be banned in class. A study from 2023 found that students remember less when phones are on the desk, because their attention is divided.' }
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = SAMPLES;
  else root.RUBRIC_SAMPLES = SAMPLES;
})(this);
