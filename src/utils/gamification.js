import { LEVEL_XP } from "../data/constants";
import { QUESTIONS } from "./study";

export function getLevel(xp) {
  return Math.floor(xp / LEVEL_XP) + 1;
}

export function getLevelProgress(xp) {
  return (xp % LEVEL_XP) / LEVEL_XP;
}

export function checkBadges(state) {
  const { progress, streak, examSessions, badges } = state;
  const newBadges = new Set(badges);
  const correctCount = Object.values(progress).filter(p => p.correct > 0).length;
  const totalAnswered = Object.keys(progress).length;

  if (correctCount >= 1) newBadges.add("first_step");
  if (streak.current >= 3) newBadges.add("streak_3");
  if (streak.current >= 7) newBadges.add("streak_7");
  if (streak.current >= 30) newBadges.add("streak_30");
  if (correctCount >= 50) newBadges.add("q50");
  if (correctCount >= 100) newBadges.add("q100");
  if (totalAnswered >= 347) newBadges.add("q347");

  const passed = examSessions.some(s => s.passed);
  const perfect = examSessions.some(s => s.score === 100);
  if (passed) newBadges.add("exam_pass");
  if (perfect) newBadges.add("exam_perfect");

  const topicMastery = (topic) => {
    const qs = QUESTIONS.filter(q => q.topic === topic);
    return qs.every(q => progress[q.id]?.correct >= 1);
  };
  if (topicMastery("Demokratie & Föderalismus")) newBadges.add("topic_demo");
  if (topicMastery("Geografie")) newBadges.add("topic_geo");
  if (topicMastery("Geschichte")) newBadges.add("topic_hist");
  if (topicMastery("Kultur & Alltagskultur")) newBadges.add("topic_kult");
  if (topicMastery("Sozialstaat & Zivilgesellschaft")) newBadges.add("topic_soz");

  return newBadges;
}
