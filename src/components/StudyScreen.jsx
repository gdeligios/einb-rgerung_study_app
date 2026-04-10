import { useState } from "react";
import SwissCross from "./shared/SwissCross";
import BrochureViewer from "./shared/BrochureViewer";
import { getStudyQueue } from "../utils/study";
import { XP_CORRECT, XP_HINT_PENALTY } from "../data/constants";

export default function StudyScreen({ topicFilter, progress, streak, onAnswer, onBack }) {
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
    return (
      <div style={{ minHeight: "100vh", background: "#fff", padding: "60px 28px 40px", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>{pct >= 80 ? "🎉" : pct >= 60 ? "👍" : "💪"}</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#111", marginBottom: 8 }}>Session complete!</h2>
          <div style={{ fontSize: 48, fontWeight: 800, color: "#C8102E", marginBottom: 4 }}>{pct}%</div>
          <div style={{ color: "#6B7280", marginBottom: 32 }}>{sessionCorrect} / {sessionTotal} correct · +{sessionXP} XP</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: "100%", marginBottom: 32 }}>
            <div style={{ background: "#F0FDF4", borderRadius: 12, padding: "14px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#15803D" }}>{sessionCorrect}</div>
              <div style={{ fontSize: 12, color: "#16A34A" }}>CORRECT</div>
            </div>
            <div style={{ background: "#FFF8F8", borderRadius: 12, padding: "14px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#C8102E" }}>{sessionTotal - sessionCorrect}</div>
              <div style={{ fontSize: 12, color: "#C8102E" }}>TO REVIEW</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button onClick={() => { setQueue(getStudyQueue(progress, topicFilter)); setQIdx(0); setSessionDone(false); setSessionCorrect(0); setSessionTotal(0); setSessionXP(0); }} style={{ background: "#C8102E", color: "#fff", border: "none", borderRadius: 14, padding: "16px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            Study Again
          </button>
          <button onClick={onBack} style={{ background: "#F9FAFB", color: "#374151", border: "1px solid #E5E7EB", borderRadius: 14, padding: "14px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
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
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 20, padding: 0 }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: currentQ.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {currentQ.topic}
              </span>
              <span style={{ fontSize: 12, color: "#9CA3AF" }}>{qIdx + 1} / {queue.length}</span>
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ background: "#F3F4F6", borderRadius: 4, height: 4 }}>
          <div style={{ background: "#C8102E", height: 4, borderRadius: 4, width: `${(qIdx / queue.length) * 100}%`, transition: "width 0.3s" }}/>
        </div>
      </div>

      {/* Flash overlay */}
      {flashGreen && <div style={{ position: "fixed", inset: 0, background: "#22C55E", opacity: 0.15, zIndex: 50, pointerEvents: "none" }}/>}

      {/* Question */}
      <div style={{ flex: 1, padding: "24px 20px", overflow: "auto" }}>
        {/* Subtopic badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${currentQ.color}15`, borderRadius: 6, padding: "4px 10px", marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: currentQ.color, letterSpacing: "0.05em" }}>{currentQ.subtopic.toUpperCase()}</span>
        </div>
        {/* Question text */}
        <div key={shakeKey} style={{ fontSize: 18, fontWeight: 700, color: "#111", lineHeight: 1.5, marginBottom: 24,
          animation: shakeKey > 0 ? "shake 0.4s ease" : "none" }}>
          {currentQ.question}
        </div>
        <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }`}</style>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {optionKeys.map(key => {
            const text = currentQ.options[key];
            let bg = "#fff", border = "#E5E7EB", textColor = "#111";
            if (showResult) {
              if (key === currentQ.correct) { bg = "#F0FDF4"; border = "#22C55E"; textColor = "#15803D"; }
              else if (key === selected) { bg = "#FFF8F8"; border = "#C8102E"; textColor = "#C8102E"; }
            } else if (selected === key) { bg = "#F9FAFB"; }
            return (
              <button key={key} onClick={() => handleSelect(key)} style={{
                background: bg, border: `2px solid ${border}`, borderRadius: 12, padding: "14px 16px",
                textAlign: "left", cursor: showResult ? "default" : "pointer",
                display: "flex", alignItems: "flex-start", gap: 12, transition: "all 0.15s"
              }}>
                <span style={{ width: 26, height: 26, borderRadius: "50%", background: showResult && key === currentQ.correct ? "#22C55E" : "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: showResult && key === currentQ.correct ? "#fff" : "#6B7280", flexShrink: 0 }}>
                  {key.toUpperCase()}
                </span>
                <span style={{ fontSize: 14, color: textColor, lineHeight: 1.5 }}>{text}</span>
                {showResult && key === currentQ.correct && <span style={{ marginLeft: "auto", fontSize: 18 }}>✓</span>}
                {showResult && key === selected && key !== currentQ.correct && <span style={{ marginLeft: "auto", fontSize: 18 }}>✗</span>}
              </button>
            );
          })}
        </div>

        {/* Hint button */}
        {!showResult && (
          <button onClick={() => { setUsedHint(true); setShowBrochure(true); }} style={{
            width: "100%", background: "none", border: "1px dashed #D1D5DB", borderRadius: 12, padding: "12px",
            fontSize: 13, color: "#6B7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8
          }}>
            <SwissCross size={16}/>
            Read Brochure {usedHint ? `(-${XP_HINT_PENALTY} XP)` : ""}
          </button>
        )}

        {/* Result + XP */}
        {showResult && (
          <div style={{ background: isCorrect ? "#F0FDF4" : "#FFF8F8", border: `1px solid ${isCorrect ? "#BBF7D0" : "#FEE2E2"}`, borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: isCorrect ? "#15803D" : "#C8102E", marginBottom: 4 }}>
              {isCorrect ? `✅ Correct! +${usedHint ? XP_CORRECT - XP_HINT_PENALTY : XP_CORRECT} XP` : "❌ Incorrect"}
            </div>
            {!isCorrect && (
              <div style={{ fontSize: 13, color: "#374151" }}>
                Correct answer: <strong>{currentQ.correct.toUpperCase()})</strong> {currentQ.options[currentQ.correct]}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Next button */}
      {showResult && (
        <div style={{ padding: "12px 20px 32px", background: "#fff", borderTop: "1px solid #F3F4F6" }}>
          <button onClick={handleNext} style={{
            width: "100%", background: "#C8102E", color: "#fff", border: "none", borderRadius: 14, padding: "16px",
            fontSize: 16, fontWeight: 700, cursor: "pointer"
          }}>
            {qIdx >= queue.length - 1 ? "Finish Session" : "Next Question →"}
          </button>
        </div>
      )}

      {showBrochure && <BrochureViewer question={currentQ} onClose={() => setShowBrochure(false)}/>}
    </div>
  );
}
