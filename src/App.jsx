import { useState } from "react";
import DashboardScreen from "./components/DashboardScreen";
import StudyScreen from "./components/StudyScreen";
import ExamScreen from "./components/ExamScreen";
import BadgesScreen from "./components/BadgesScreen";
import { checkBadges } from "./utils/gamification";
import { XP_EXAM_PASS } from "./data/constants";
import { useLocalStorage } from "./hooks/useLocalStorage";

export default function App() {
  const [screen, setScreen] = useState("dashboard");
  const [studyTopic, setStudyTopic] = useState(null);

  const [progress, setProgress] = useLocalStorage("progress", {});
  const [streak, setStreak] = useLocalStorage("streak", { current: 0, longest: 0, lastDate: null, xp: 0 });
  const [badgesArray, setBadgesArray] = useLocalStorage("badges", []);
  const [examSessions, setExamSessions] = useLocalStorage("examSessions", []);

  // badges is a Set in memory, stored as an array in localStorage
  const badges = new Set(badgesArray);
  const setBadges = (updater) => {
    setBadgesArray(prev => {
      const prevSet = new Set(prev);
      const nextSet = typeof updater === "function" ? updater(prevSet) : updater;
      return [...nextSet];
    });
  };

  const handleAnswer = (qId, correct, xpGained) => {
    setProgress(p => {
      const prev = p[qId] || { correct: 0, attempts: 0, lastCorrect: null };
      return { ...p, [qId]: { correct: prev.correct + (correct ? 1 : 0), attempts: prev.attempts + 1, lastCorrect: correct } };
    });
    if (xpGained > 0) {
      setStreak(s => {
        const today = new Date().toDateString();
        const newStreak = s.lastDate === today ? s.current : s.lastDate === new Date(Date.now() - 86400000).toDateString() ? s.current + 1 : 1;
        const newXP = s.xp + xpGained;
        return { current: newStreak, longest: Math.max(s.longest, newStreak), lastDate: today, xp: newXP };
      });
    }
    setTimeout(() => {
      setBadges(prev => {
        const newState = { progress: { ...progress, [qId]: { correct: correct ? 1 : 0, attempts: 1, lastCorrect: correct } }, streak, examSessions, badges: prev };
        return checkBadges(newState);
      });
    }, 100);
  };

  const handleExamDone = (result) => {
    setExamSessions(s => [...s, result]);
    if (result.passed) {
      setStreak(s => ({ ...s, xp: s.xp + XP_EXAM_PASS }));
    }
  };

  if (screen === "badges") return <BadgesScreen badges={badges} onBack={() => setScreen("dashboard")}/>;
  if (screen === "study") return (
    <StudyScreen
      topicFilter={studyTopic}
      progress={progress}
      streak={streak}
      onAnswer={handleAnswer}
      onBack={() => setScreen("dashboard")}
    />
  );
  if (screen === "exam") return (
    <ExamScreen
      progress={progress}
      onDone={handleExamDone}
      onBack={() => setScreen("dashboard")}
    />
  );

  return (
    <DashboardScreen
      streak={streak}
      progress={progress}
      badges={badges}
      examSessions={examSessions}
      onStudy={(topic) => { setStudyTopic(topic); setScreen("study"); }}
      onExam={() => setScreen("exam")}
      onBadges={() => setScreen("badges")}
    />
  );
}
