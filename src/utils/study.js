import RAW_Q from "../data/questions.json";

export const QUESTIONS = RAW_Q.map(q => ({
  id: q.id,
  section: q.s,
  topic: q.t,
  subtopic: q.st,
  level: q.lv,
  color: q.c,
  question: q.q,
  options: { a: q.a, b: q.b, c: q.c2, d: q.d },
  correct: q.ans,
  brochurePages: q.bp,
}));

export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getStudyQueue(topicFilter = null) {
  let pool = QUESTIONS;
  if (topicFilter) pool = pool.filter(q => q.topic === topicFilter);
  return shuffleArray(pool);
}
