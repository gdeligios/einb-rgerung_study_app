import { useState } from "react";
import SwissCross from "./shared/SwissCross";
import BrochureViewer from "./shared/BrochureViewer";
import { getStudyQueue } from "../utils/study";
import { XP_CORRECT, XP_HINT_PENALTY } from "../data/constants";

export default function StudyScreen({ topicFilter, progress, onAnswer, onBack }) {
  const [queue, setQueue] = useState(() => getStudyQueue(progress, topicFilter));
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showBrochure, setShowBrochure] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);
  const [sessionXP, setSessionXP] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const [flashGreen, setFlashGreen] = useState(false);

  const currentQ = queue[qIdx];
  const optionKeys = ["a", "b", "c", "d"];

  const handleSelect = (key) => {
    if (showResult) return;
    setSelected(key);
    setShowResult(true);
    const correct = key === currentQ.correct;
    const xpGained = correct ? (usedHint ? XP_CORRECT - XP_HINT_PENALTY : XP_CORRECT) : 0;
    if (correct) {
      setFlashGreen(true);
      setTimeout(() => setFlashGreen(false), 600);
    } else {
      setShakeKey(k => k + 1);
    }
    setSessionTotal(t => t + 1);
    if (correct) setSessionCorrect(c => c + 1);
    setSessionXP(x => x + xpGained);
    onAnswer(currentQ.id, correct, xpGained);
  };

  const handleNext = () => {
    setShowResult(false);
    setSelected(null);
    setUsedHint(false);
    if (qIdx >= queue.length - 1) {
      setSessionDone(true);
    } else {
      setQIdx(i => i + 1);
    }
  };

  if (sessionDone) {
    const pct = Math.round(sessionCorrect / sessionTotal * 100);
    const passed = pct >= 60;
    return (
      <div style={{ minHeight: "100vh", background: "#fff", padding: "60px 28px 40px", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: passed ? "#15803D" : "#C8102E", marginBottom: 12 }}>
            SESSION COMPLETE
          </div>
          <div style={{ fontSize: 72, fontWeight: 800, color: "#111", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 8 }}>
            {pct}<span style={{ fontSize: 36 }}>%</span>
          </div>
          <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 40 }}>
            {sessionCorrect} / {sessionTotal} correct · +{sessionXP} XP
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%" }}>
            <div style={{ background: "#F0FDF4", borderRadius: 12, padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#15803D", letterSpacing: "-0.02em" }}>{sessionCorrect}</div>
              <div style={{ fontSize: 10, color: "#16A34A", fontWeight: 600, letterSpacing: "0.08em", marginTop: 4 }}>CORRECT</div>
            </div>
            <div style={{ background: "#FFF8F8", borderRadius: 12, padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#C8102E", letterSpacing: "-0.02em" }}>{sessionTotal - sessionCorrect}</div>
              <div style={{ fontSize: 10, color: "#C8102E", fontWeight: 600, letterSpacing: "0.08em", marginTop: 4 }}>TO REVIEW</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={() => { setQueue(getStudyQueue(progress, topicFilter)); setQIdx(0); setSessionDone(false); setSessionCorrect(0); setSessionTotal(0); setSessionXP(0); }}
            style={{ background: "#C8102E", color: "#fff", border: "none", borderRadius: 12, padding: "16px", fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: "-0.01em" }}
          >
            Study Again
          </button>
          <button
            onClick={onBack}
            style={{ background: "#F9FAFB", color: "#374151", border: "1px solid #E5E7EB", borderRadius: 12, padding: "14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;
  const isCorrect = selected === currentQ.correct;

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "#fff", padding: "52px 20px 16px", borderBottom: "1px solid #F3F4F6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", fontSize: 18, padding: 0, lineHeight: 1 }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: currentQ.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {currentQ.topic}
              </span>
              <span style={{ fontSize: 11, color: "#9CA3AF", fontVariantNumeric: "tabular-nums" }}>{qIdx + 1} / {queue.length}</span>
            </div>
          </div>
        </div>
        <div style={{ background: "#F3F4F6", borderRadius: 2, height: 3 }}>
          <div style={{ background: "#C8102E", height: 3, borderRadius: 2, width: `${(qIdx / queue.length) * 100}%`, transition: "width 0.3s" }}/>
        </div>
      </div>

      {flashGreen && <div style={{ position: "fixed", inset: 0, background: "#22C55E", opacity: 0.1, zIndex: 50, pointerEvents: "none" }}/>}

      {/* Question */}
      <div style={{ flex: 1, padding: "24px 20px", overflow: "auto" }}>
        <div style={{
          display: "inline-flex", alignItems: "center",
          background: `${currentQ.color}18`, borderRadius: 4, padding: "3px 8px", marginBottom: 16
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: currentQ.color, letterSpacing: "0.08em" }}>
            {currentQ.subtopic.toUpperCase()}
          </span>
        </div>

        <div key={shakeKey} style={{ fontSize: 17, fontWeight: 600, color: "#111", lineHeight: 1.55, marginBottom: 24,
          animation: shakeKey > 0 ? "shake 0.4s ease" : "none" }}>
          {currentQ.question}
        </div>
        <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }`}</style>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {optionKeys.map(key => {
            const text = currentQ.options[key];
            let bg = "#fff", border = "#E5E7EB", textColor = "#111";
            if (showResult) {
              if (key === currentQ.correct) { bg = "#F0FDF4"; border = "#86EFAC"; textColor = "#15803D"; }
              else if (key === selected) { bg = "#FFF8F8"; border = "#FECACA"; textColor = "#C8102E"; }
            }
            return (
              <button key={key} onClick={() => handleSelect(key)} style={{
                background: bg, border: `1.5px solid ${border}`, borderRadius: 10, padding: "13px 14px",
                textAlign: "left", cursor: showResult ? "default" : "pointer",
                display: "flex", alignItems: "flex-start", gap: 10, transition: "border-color 0.15s, background 0.15s"
              }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                  background: showResult && key === currentQ.correct ? "#15803D" : showResult && key === selected ? "#C8102E" : "#F3F4F6",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: showResult && (key === currentQ.correct || key === selected) ? "#fff" : "#6B7280"
                }}>
                  {key.toUpperCase()}
                </span>
                <span style={{ fontSize: 13, color: textColor, lineHeight: 1.5 }}>{text}</span>
              </button>
            );
          })}
        </div>

        {!showResult && (
          <button onClick={() => { setUsedHint(true); setShowBrochure(true); }} style={{
            width: "100%", background: "none", border: "1px dashed #D1D5DB", borderRadius: 10, padding: "11px",
            fontSize: 12, color: "#9CA3AF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8
          }}>
            <SwissCross size={14} color="#9CA3AF"/>
            Read Brochure{usedHint ? ` (−${XP_HINT_PENALTY} XP)` : ""}
          </button>
        )}

        {showResult && (
          <div style={{
            background: isCorrect ? "#F0FDF4" : "#FFF8F8",
            border: `1px solid ${isCorrect ? "#86EFAC" : "#FECACA"}`,
            borderRadius: 10, padding: "13px 15px"
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: isCorrect ? "#15803D" : "#C8102E", marginBottom: isCorrect ? 0 : 6 }}>
              {isCorrect ? `Correct  +${usedHint ? XP_CORRECT - XP_HINT_PENALTY : XP_CORRECT} XP` : "Incorrect"}
            </div>
            {!isCorrect && (
              <div style={{ fontSize: 12, color: "#374151" }}>
                Correct answer: <strong>{currentQ.correct.toUpperCase()})</strong> {currentQ.options[currentQ.correct]}
              </div>
            )}
          </div>
        )}
      </div>

      {showResult && (
        <div style={{ padding: "12px 20px 32px", background: "#fff", borderTop: "1px solid #F3F4F6" }}>
          <button onClick={handleNext} style={{
            width: "100%", background: "#C8102E", color: "#fff", border: "none", borderRadius: 12, padding: "15px",
            fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: "-0.01em"
          }}>
            {qIdx >= queue.length - 1 ? "Finish Session" : "Next Question →"}
          </button>
        </div>
      )}

      {showBrochure && <BrochureViewer question={currentQ} onClose={() => setShowBrochure(false)}/>}
    </div>
  );
}
