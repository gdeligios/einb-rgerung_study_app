import SwissCross from "./shared/SwissCross";
import TOPICS from "../data/topics";
import BADGE_DEFS from "../data/badges";
import { QUESTIONS } from "../utils/study";
import { getLevel, getLevelProgress } from "../utils/gamification";

export default function DashboardScreen({ streak, progress, badges, examSessions, onStudy, onExam, onBadges }) {
  const totalCorrect = Object.values(progress).filter(p => p.correct > 0).length;
  const xp = streak.xp;
  const level = getLevel(xp);
  const lvlProg = getLevelProgress(xp);
  const recentExam = examSessions[examSessions.length - 1];
  const examWinRate = examSessions.length > 0
    ? Math.round(examSessions.filter(s => s.passed).length / examSessions.length * 100) : null;

  const topicStats = Object.entries(TOPICS).map(([name, cfg]) => {
    const topicQs = QUESTIONS.filter(q => q.topic === name);
    const done = topicQs.filter(q => progress[q.id]?.correct > 0).length;
    return { name, cfg, done, total: topicQs.length, pct: done / topicQs.length };
  });

  const earnedBadges = BADGE_DEFS.filter(b => badges.has(b.key));

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ background: "#fff", padding: "52px 24px 20px", borderBottom: "1px solid #F3F4F6" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#111", letterSpacing: "-0.01em" }}>Einbürgerungstest</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Level {level} · {xp.toLocaleString()} XP</div>
          </div>
          <SwissCross size={28}/>
        </div>
        <div style={{ background: "#F3F4F6", borderRadius: 2, height: 4, marginBottom: 6 }}>
          <div style={{ background: "#C8102E", height: 4, borderRadius: 2, width: `${lvlProg * 100}%`, transition: "width 0.6s ease" }}/>
        </div>
        <div style={{ fontSize: 11, color: "#9CA3AF", letterSpacing: "0.04em" }}>{Math.round(lvlProg * 100)}% TO LEVEL {level + 1}</div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[
            { value: streak.current, label: "DAY STREAK" },
            { value: totalCorrect,   label: "MASTERED" },
            { value: examWinRate !== null ? examWinRate + "%" : "—", label: "EXAM RATE" },
          ].map(({ value, label }) => (
            <div key={label} style={{ background: "#fff", borderRadius: 12, padding: "16px 10px", textAlign: "center", border: "1px solid #F3F4F6" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#111", letterSpacing: "-0.02em" }}>{value}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600, letterSpacing: "0.08em", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          <button onClick={() => onStudy(null)} style={{
            background: "#C8102E", color: "#fff", border: "none", borderRadius: 12, padding: "20px 16px",
            cursor: "pointer", textAlign: "left", boxShadow: "0 2px 12px rgba(200,16,46,0.2)"
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", opacity: 0.75, marginBottom: 8 }}>STUDY</div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em" }}>Study Mode</div>
            <div style={{ fontSize: 11, opacity: 0.75, marginTop: 3 }}>Practice at your pace</div>
          </button>
          <button onClick={onExam} style={{
            background: "#111", color: "#fff", border: "none", borderRadius: 12, padding: "20px 16px",
            cursor: "pointer", textAlign: "left"
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", opacity: 0.6, marginBottom: 8 }}>EXAM</div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em" }}>Exam Mode</div>
            <div style={{ fontSize: 11, opacity: 0.6, marginTop: 3 }}>30Q · 45 min · no hints</div>
          </button>
        </div>

        {/* Overall progress */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "18px", border: "1px solid #F3F4F6", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>Overall Progress</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#C8102E" }}>{totalCorrect} / 347</div>
          </div>
          <div style={{ background: "#F3F4F6", borderRadius: 2, height: 6, marginBottom: 18 }}>
            <div style={{ background: "#C8102E", height: 6, borderRadius: 2, width: `${totalCorrect/347*100}%`, transition: "width 0.6s" }}/>
          </div>
          {topicStats.map(({ name, cfg, pct }) => (
            <button key={name} onClick={() => onStudy(name)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "7px 0", textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                <span style={{
                  width: 24, height: 16, borderRadius: 3, background: cfg.color,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: "0.04em", flexShrink: 0
                }}>{cfg.abbr}</span>
                <span style={{ fontSize: 12, color: "#374151", flex: 1 }}>{name}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color }}>{Math.round(pct * 100)}%</span>
              </div>
              <div style={{ background: "#F3F4F6", borderRadius: 2, height: 4 }}>
                <div style={{ background: cfg.color, height: 4, borderRadius: 2, width: `${pct * 100}%`, transition: "width 0.6s" }}/>
              </div>
            </button>
          ))}
        </div>

        {/* Recent exam */}
        {recentExam && (
          <div style={{ background: "#fff", border: `1px solid ${recentExam.passed ? "#D1FAE5" : "#FEE2E2"}`, borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: recentExam.passed ? "#15803D" : "#C8102E", marginBottom: 4 }}>
                  {recentExam.passed ? "LAST EXAM — PASSED" : "LAST EXAM — FAILED"}
                </div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{recentExam.date} · {recentExam.correct}/{recentExam.total} correct</div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: recentExam.passed ? "#15803D" : "#C8102E", letterSpacing: "-0.02em" }}>
                {recentExam.score}%
              </div>
            </div>
          </div>
        )}

        {/* Badges preview */}
        {earnedBadges.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", border: "1px solid #F3F4F6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>Badges earned</div>
              <button onClick={onBadges} style={{ fontSize: 11, color: "#C8102E", fontWeight: 600, background: "none", border: "none", cursor: "pointer", letterSpacing: "0.04em" }}>VIEW ALL</button>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {earnedBadges.slice(0, 6).map(b => (
                <div key={b.key} title={b.label} style={{
                  width: 40, height: 40, borderRadius: 8, background: "#F9FAFB", border: "1px solid #E5E7EB",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: "0.02em"
                }}>
                  {b.icon}
                </div>
              ))}
              {earnedBadges.length > 6 && (
                <div style={{
                  width: 40, height: 40, borderRadius: 8, background: "#F9FAFB", border: "1px solid #E5E7EB",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#9CA3AF", fontWeight: 700
                }}>
                  +{earnedBadges.length - 6}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
