import { useState, useEffect, useCallback, useRef } from "react";
import TOPICS from "../data/topics";
import { QUESTIONS, shuffleArray } from "../utils/study";
import { EXAM_Q_COUNT, XP_EXAM_PASS } from "../data/constants";

export default function ExamScreen({ onDone, onBack }) {
  const DURATION = 45 * 60;
  const [phase, setPhase] = useState("setup");
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
  const timerColor = timeLeft < 300 ? "#C8102E" : timeLeft < 600 ? "#D97706" : "#111";

  // ── Setup ──────────────────────────────────────────────────────────────────
  if (phase === "setup") {
    return (
      <div style={{ minHeight: "100vh", background: "#fff", padding: "60px 24px 40px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", fontSize: 18, padding: 0 }}>←</button>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", margin: 0, letterSpacing: "-0.02em" }}>Practice Exam</h2>
        </div>

        <div style={{ background: "#F9FAFB", border: "1px solid #F3F4F6", borderRadius: 12, padding: "16px 18px", marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#9CA3AF", marginBottom: 12 }}>RULES</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              `${EXAM_Q_COUNT} random questions from all topics`,
              "45 minutes time limit",
              "No hints or brochure references",
              `Pass mark: 60% (${Math.ceil(EXAM_Q_COUNT * 0.6)} correct)`,
              "Questions from both federal and cantonal levels",
            ].map(rule => (
              <div key={rule} style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#C8102E", flexShrink: 0, marginTop: 6 }}/>
                <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{rule}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#F9FAFB", borderRadius: 12, padding: "16px 18px", marginBottom: 36 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#9CA3AF", marginBottom: 12 }}>TOPIC DISTRIBUTION</div>
          {Object.entries(TOPICS).map(([name, cfg]) => {
            const c = QUESTIONS.filter(q => q.topic === name).length;
            const examShare = Math.round(c / 347 * EXAM_Q_COUNT);
            return (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{
                  width: 26, height: 16, borderRadius: 3, background: cfg.color,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: "0.04em", flexShrink: 0
                }}>{cfg.abbr}</span>
                <span style={{ fontSize: 12, flex: 1, color: "#374151" }}>{name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>~{examShare} Q</span>
              </div>
            );
          })}
        </div>

        <button onClick={startExam} style={{
          background: "#111", color: "#fff", border: "none", borderRadius: 12, padding: "17px",
          fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: "-0.01em"
        }}>
          Start Exam →
        </button>
      </div>
    );
  }

  // ── Exam ───────────────────────────────────────────────────────────────────
  if (phase === "exam" && examQs.length > 0) {
    const q = examQs[qIdx];
    const timerPct = timeLeft / DURATION;
    return (
      <div style={{ minHeight: "100vh", background: "#F9FAFB", display: "flex", flexDirection: "column" }}>
        <div style={{ background: "#fff", padding: "48px 20px 14px", borderBottom: "1px solid #F3F4F6" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: "#9CA3AF", fontVariantNumeric: "tabular-nums" }}>
              {qIdx + 1} / {EXAM_Q_COUNT}
            </span>
            <span style={{ fontSize: 16, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: timerColor, letterSpacing: "0.02em" }}>
              {fmt(timeLeft)}
            </span>
          </div>
          <div style={{ background: "#F3F4F6", borderRadius: 2, height: 3 }}>
            <div style={{ background: "#C8102E", height: 3, borderRadius: 2, width: `${(qIdx / EXAM_Q_COUNT) * 100}%`, transition: "width 0.3s" }}/>
          </div>
          <div style={{ background: "#F3F4F6", height: 2, borderRadius: 1, marginTop: 3 }}>
            <div style={{ background: timerColor, height: 2, borderRadius: 1, width: `${timerPct * 100}%`, transition: "width 1s linear" }}/>
          </div>
        </div>

        <div style={{ flex: 1, padding: "24px 20px" }}>
          <div style={{ display: "inline-flex", background: `${q.color}18`, borderRadius: 4, padding: "3px 8px", marginBottom: 16 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: q.color, letterSpacing: "0.08em" }}>{q.topic.toUpperCase()}</span>
          </div>
          <div style={{ fontSize: 17, fontWeight: 600, color: "#111", lineHeight: 1.55, marginBottom: 24 }}>{q.question}</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {["a","b","c","d"].map(key => {
              const isSel = selected === key;
              return (
                <button key={key} onClick={() => handleSelect(key)} style={{
                  background: isSel ? "#FFF0F0" : "#fff",
                  border: `1.5px solid ${isSel ? "#C8102E" : "#E5E7EB"}`,
                  borderRadius: 10, padding: "13px 14px", textAlign: "left",
                  cursor: selected ? "default" : "pointer",
                  display: "flex", alignItems: "flex-start", gap: 10, transition: "all 0.1s"
                }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                    background: isSel ? "#C8102E" : "#F3F4F6",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, color: isSel ? "#fff" : "#6B7280"
                  }}>
                    {key.toUpperCase()}
                  </span>
                  <span style={{ fontSize: 13, color: "#111", lineHeight: 1.5 }}>{q.options[key]}</span>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 14, padding: "10px 12px", background: "#F9FAFB", borderRadius: 8, border: "1px solid #F3F4F6" }}>
            <div style={{ fontSize: 11, color: "#C8102E", fontWeight: 600, letterSpacing: "0.04em" }}>
              BROCHURE LOCKED IN EXAM MODE
            </div>
          </div>
        </div>

        {selected !== null && (
          <div style={{ padding: "12px 20px 16px", background: "#fff", borderTop: "1px solid #F3F4F6" }}>
            <button onClick={handleNext} style={{
              width: "100%", background: "#111", color: "#fff", border: "none", borderRadius: 12,
              padding: "15px", fontSize: 14, fontWeight: 700, cursor: "pointer"
            }}>
              {qIdx >= EXAM_Q_COUNT - 1 ? "Submit Exam" : "Next →"}
            </button>
          </div>
        )}
        <div style={{ padding: "0 20px 24px", background: "#fff" }}>
          <button
            onClick={() => { if (window.confirm("Submit exam early?")) submitExam(); }}
            style={{ width: "100%", background: "none", border: "1px solid #F3F4F6", borderRadius: 10, padding: "10px", fontSize: 12, color: "#9CA3AF", cursor: "pointer" }}
          >
            Submit early
          </button>
        </div>
      </div>
    );
  }

  // ── Score ──────────────────────────────────────────────────────────────────
  if (phase === "score" && results) {
    const { correct, total, score, passed, topicBreak } = results;
    const weakTopics = Object.entries(topicBreak)
      .filter(([, v]) => v.total > 0)
      .map(([name, v]) => ({ name, pct: v.correct / v.total, ...v }))
      .sort((a, b) => a.pct - b.pct);

    return (
      <div style={{ minHeight: "100vh", background: "#fff", padding: "52px 24px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: passed ? "#15803D" : "#C8102E", marginBottom: 14 }}>
            {passed ? "EXAM PASSED" : "EXAM FAILED"}
          </div>
          <div style={{ fontSize: 80, fontWeight: 800, color: "#111", lineHeight: 1, letterSpacing: "-0.04em" }}>
            {score}<span style={{ fontSize: 40 }}>%</span>
          </div>
          <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 10 }}>{correct} / {total} correct · pass mark 60%</div>
          {passed && (
            <div style={{ fontSize: 12, color: "#15803D", marginTop: 8, fontWeight: 600, letterSpacing: "0.04em" }}>
              +{XP_EXAM_PASS} XP BONUS
            </div>
          )}
        </div>

        <div style={{ background: "#F9FAFB", borderRadius: 12, padding: "16px 18px", marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#9CA3AF", marginBottom: 14 }}>PERFORMANCE BY TOPIC</div>
          {weakTopics.map(({ name, pct, correct: c, total: t }) => {
            const cfg = TOPICS[name] || { color: "#6B7280", abbr: "—" };
            return (
              <div key={name} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <span style={{
                    width: 26, height: 16, borderRadius: 3, background: cfg.color,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: "0.04em", flexShrink: 0
                  }}>{cfg.abbr}</span>
                  <span style={{ fontSize: 12, flex: 1, color: "#374151" }}>{name}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: pct >= 0.6 ? "#15803D" : "#C8102E" }}>
                    {c}/{t} ({Math.round(pct * 100)}%)
                  </span>
                </div>
                <div style={{ background: "#E5E7EB", borderRadius: 2, height: 4 }}>
                  <div style={{ background: pct >= 0.6 ? "#22C55E" : "#C8102E", height: 4, borderRadius: 2, width: `${pct * 100}%` }}/>
                </div>
              </div>
            );
          })}
        </div>

        {weakTopics.length > 0 && weakTopics[0].pct < 0.6 && (
          <div style={{ background: "#FFF8F8", border: "1px solid #FEE2E2", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#C8102E", marginBottom: 6 }}>
              FOCUS AREA
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111", marginBottom: 4 }}>{weakTopics[0].name}</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>
              {Math.round(weakTopics[0].pct * 100)}% score — study this topic to improve.
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={onBack} style={{
            background: "#C8102E", color: "#fff", border: "none", borderRadius: 12,
            padding: "15px", fontSize: 14, fontWeight: 700, cursor: "pointer"
          }}>
            Back to Dashboard
          </button>
          <button onClick={() => { setPhase("setup"); setSubmitted(false); }} style={{
            background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 12,
            padding: "13px", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#374151"
          }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}
