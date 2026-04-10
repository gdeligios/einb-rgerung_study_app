import { useState, useEffect, useCallback, useRef } from "react";
import TOPICS from "../data/topics";
import { QUESTIONS, shuffleArray } from "../utils/study";
import { EXAM_Q_COUNT, XP_EXAM_PASS } from "../data/constants";

export default function ExamScreen({ progress, onDone, onBack }) {
  const DURATION = 45 * 60; // 45 minutes
  const [phase, setPhase] = useState("setup"); // setup | exam | score
  const [examQs, setExamQs] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const timerRef = useRef(null);

  const startExam = () => {
    const shuffled = shuffleArray(QUESTIONS).slice(0, EXAM_Q_COUNT);
    setExamQs(shuffled);
    setQIdx(0);
    setAnswers({});
    setSelected(null);
    setTimeLeft(DURATION);
    setPhase("exam");
  };

  useEffect(() => {
    if (phase !== "exam" || submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); submitExam(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, submitted]);

  const submitExam = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    clearInterval(timerRef.current);
    const correct = examQs.filter(q => answers[q.id] === q.correct).length;
    const score = Math.round(correct / EXAM_Q_COUNT * 100);
    const passed = score >= 60;
    const topicBreak = {};
    examQs.forEach(q => {
      if (!topicBreak[q.topic]) topicBreak[q.topic] = { correct: 0, total: 0 };
      topicBreak[q.topic].total++;
      if (answers[q.id] === q.correct) topicBreak[q.topic].correct++;
    });
    const res = { correct, total: EXAM_Q_COUNT, score, passed, topicBreak, date: new Date().toLocaleDateString() };
    setResults(res);
    onDone(res);
    setPhase("score");
  }, [examQs, answers, submitted, onDone]);

  const handleSelect = (key) => {
    if (selected !== null) return;
    setSelected(key);
    setAnswers(a => ({ ...a, [examQs[qIdx].id]: key }));
  };

  const handleNext = () => {
    setSelected(null);
    if (qIdx >= EXAM_Q_COUNT - 1) { submitExam(); }
    else setQIdx(i => i + 1);
  };

  const fmt = (s) => `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;
  const timerColor = timeLeft < 300 ? "#C8102E" : timeLeft < 600 ? "#F59E0B" : "#111";

  if (phase === "setup") {
    return (
      <div style={{ minHeight: "100vh", background: "#fff", padding: "60px 28px 40px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 20 }}>←</button>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111", margin: 0 }}>Practice Exam</h2>
        </div>
        <div style={{ background: "#FFF8F8", border: "1px solid #FEE2E2", borderRadius: 14, padding: "16px", marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#C8102E", marginBottom: 8 }}>⚠️ Exam Rules</div>
          <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>
            • {EXAM_Q_COUNT} random questions from all topics<br/>
            • 45 minutes time limit<br/>
            • No hints or brochure references<br/>
            • Pass mark: 60% ({Math.ceil(EXAM_Q_COUNT * 0.6)} correct)<br/>
            • Questions from both federal and cantonal levels
          </div>
        </div>
        <div style={{ background: "#F9FAFB", borderRadius: 14, padding: "16px", marginBottom: 32 }}>
          {Object.entries(TOPICS).map(([name, cfg]) => {
            const c = QUESTIONS.filter(q => q.topic === name).length;
            const examShare = Math.round(c / 347 * EXAM_Q_COUNT);
            return (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 14 }}>{cfg.emoji}</span>
                <span style={{ fontSize: 13, flex: 1, color: "#374151" }}>{name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>~{examShare} Q</span>
              </div>
            );
          })}
        </div>
        <button onClick={startExam} style={{ background: "#111", color: "#fff", border: "none", borderRadius: 14, padding: "18px", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
          Start Exam →
        </button>
      </div>
    );
  }

  if (phase === "exam" && examQs.length > 0) {
    const q = examQs[qIdx];
    const timerPct = timeLeft / DURATION;
    return (
      <div style={{ minHeight: "100vh", background: "#F9FAFB", display: "flex", flexDirection: "column" }}>
        <div style={{ background: "#fff", padding: "48px 20px 14px", borderBottom: "1px solid #F3F4F6" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: "#6B7280" }}>Question {qIdx + 1} / {EXAM_Q_COUNT}</span>
            <span style={{ fontSize: 18, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: timerColor }}>⏱ {fmt(timeLeft)}</span>
          </div>
          <div style={{ background: "#F3F4F6", borderRadius: 4, height: 4 }}>
            <div style={{ background: "#C8102E", height: 4, borderRadius: 4, width: `${((qIdx)/EXAM_Q_COUNT)*100}%`, transition: "width 0.3s" }}/>
          </div>
          <div style={{ background: timerColor === "#C8102E" ? "#FEE2E2" : "#F3F4F6", height: 3, borderRadius: 2, marginTop: 4 }}>
            <div style={{ background: timerColor, height: 3, borderRadius: 2, width: `${timerPct*100}%`, transition: "width 1s linear" }}/>
          </div>
        </div>
        <div style={{ flex: 1, padding: "24px 20px" }}>
          <div style={{ display: "inline-flex", gap: 6, background: `${q.color}15`, borderRadius: 6, padding: "4px 10px", marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: q.color }}>{q.topic.toUpperCase()}</span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#111", lineHeight: 1.5, marginBottom: 24 }}>{q.question}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["a","b","c","d"].map(key => {
              const isSel = selected === key;
              return (
                <button key={key} onClick={() => handleSelect(key)} style={{
                  background: isSel ? "#FFF0F0" : "#fff", border: `2px solid ${isSel ? "#C8102E" : "#E5E7EB"}`,
                  borderRadius: 12, padding: "14px 16px", textAlign: "left", cursor: selected ? "default" : "pointer",
                  display: "flex", alignItems: "flex-start", gap: 12, transition: "all 0.1s"
                }}>
                  <span style={{ width: 26, height: 26, borderRadius: "50%", background: isSel ? "#C8102E" : "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: isSel ? "#fff" : "#6B7280", flexShrink: 0 }}>
                    {key.toUpperCase()}
                  </span>
                  <span style={{ fontSize: 14, color: "#111", lineHeight: 1.5 }}>{q.options[key]}</span>
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: 16, padding: "10px 12px", background: "#F9FAFB", borderRadius: 8, border: "1px solid #E5E7EB" }}>
            <div style={{ fontSize: 12, color: "#9CA3AF" }}>🔒 Brochure reference not available in exam mode</div>
          </div>
        </div>
        {selected !== null && (
          <div style={{ padding: "12px 20px 32px", background: "#fff", borderTop: "1px solid #F3F4F6" }}>
            <button onClick={handleNext} style={{ width: "100%", background: "#111", color: "#fff", border: "none", borderRadius: 14, padding: "16px", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              {qIdx >= EXAM_Q_COUNT - 1 ? "Submit Exam" : "Next →"}
            </button>
          </div>
        )}
        <div style={{ padding: "0 20px 20px", background: "#fff" }}>
          <button onClick={() => { if(window.confirm("Submit exam early?")) submitExam(); }} style={{ width: "100%", background: "none", border: "1px solid #E5E7EB", borderRadius: 12, padding: "10px", fontSize: 13, color: "#9CA3AF", cursor: "pointer" }}>
            Submit early
          </button>
        </div>
      </div>
    );
  }

  if (phase === "score" && results) {
    const { correct, total, score, passed, topicBreak } = results;
    const weakTopics = Object.entries(topicBreak)
      .filter(([,v]) => v.total > 0)
      .map(([name, v]) => ({ name, pct: v.correct / v.total, ...v }))
      .sort((a, b) => a.pct - b.pct);
    return (
      <div style={{ minHeight: "100vh", background: "#fff", padding: "52px 24px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>{passed ? "🎓" : "💪"}</div>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: passed ? "#15803D" : "#C8102E", marginBottom: 8 }}>
            {passed ? "EXAM PASSED" : "EXAM FAILED"}
          </div>
          <div style={{ fontSize: 60, fontWeight: 800, color: passed ? "#15803D" : "#C8102E", lineHeight: 1 }}>{score}%</div>
          <div style={{ color: "#6B7280", marginTop: 8 }}>{correct} / {total} correct · Pass mark: 60%</div>
          {passed && <div style={{ fontSize: 13, color: "#15803D", marginTop: 8, fontWeight: 600 }}>+{XP_EXAM_PASS} XP bonus!</div>}
        </div>
        <div style={{ background: "#F9FAFB", borderRadius: 14, padding: "16px", marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 14 }}>Performance by topic</div>
          {weakTopics.map(({ name, pct, correct: c, total: t }) => {
            const cfg = TOPICS[name] || { color: "#6B7280", emoji: "📋" };
            return (
              <div key={name} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: "#374151" }}>{cfg.emoji} {name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: pct >= 0.6 ? "#15803D" : "#C8102E" }}>{c}/{t} ({Math.round(pct*100)}%)</span>
                </div>
                <div style={{ background: "#E5E7EB", borderRadius: 3, height: 5 }}>
                  <div style={{ background: pct >= 0.6 ? "#22C55E" : "#C8102E", height: 5, borderRadius: 3, width: `${pct*100}%` }}/>
                </div>
              </div>
            );
          })}
        </div>
        {weakTopics.length > 0 && weakTopics[0].pct < 0.6 && (
          <div style={{ background: "#FFF8F8", border: "1px solid #FEE2E2", borderRadius: 12, padding: "14px", marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#C8102E", marginBottom: 4 }}>📚 Focus area: {weakTopics[0].name}</div>
            <div style={{ fontSize: 13, color: "#374151" }}>
              You scored {Math.round(weakTopics[0].pct * 100)}% on this topic. Study this topic in Study Mode to improve.
            </div>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button onClick={onBack} style={{ background: "#C8102E", color: "#fff", border: "none", borderRadius: 14, padding: "16px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            Back to Dashboard
          </button>
          <button onClick={() => { setPhase("setup"); setSubmitted(false); }} style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 14, padding: "14px", fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#374151" }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}
