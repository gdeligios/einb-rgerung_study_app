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
    <div style={{ minHeight: "100vh", background: "#F9FAFB", paddingBottom: 32 }}>
      {/* Header */}
      <div style={{ background: "#fff", padding: "52px 24px 20px", borderBottom: "1px solid #F3F4F6" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#111" }}>Einbürgerungstest</div>
            <div style={{ fontSize: 13, color: "#9CA3AF" }}>Level {level} · {xp.toLocaleString()} XP</div>
          </div>
          <SwissCross size={28}/>
        </div>
        {/* XP Bar */}
        <div style={{ background: "#F3F4F6", borderRadius: 4, height: 6, marginBottom: 4 }}>
          <div style={{ background: "#C8102E", height: 6, borderRadius: 4, width: `${lvlProg * 100}%`, transition: "width 0.6s ease" }}/>
        </div>
        <div style={{ fontSize: 11, color: "#9CA3AF" }}>{Math.round(lvlProg * 100)}% to Level {level + 1}</div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        {/* Streak + stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: "14px 12px", textAlign: "center", border: "1px solid #F3F4F6" }}>
            <div style={{ fontSize: 24 }}>🔥</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#111" }}>{streak.current}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>DAY STREAK</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 14, padding: "14px 12px", textAlign: "center", border: "1px solid #F3F4F6" }}>
            <div style={{ fontSize: 24 }}>✅</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#111" }}>{totalCorrect}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>MASTERED</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 14, padding: "14px 12px", textAlign: "center", border: "1px solid #F3F4F6" }}>
            <div style={{ fontSize: 24 }}>🎯</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#111" }}>{examWinRate !== null ? examWinRate + "%" : "—"}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>EXAM RATE</div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <button onClick={() => onStudy(null)} style={{
            background: "#C8102E", color: "#fff", border: "none", borderRadius: 14, padding: "18px 16px",
            fontSize: 15, fontWeight: 700, cursor: "pointer", textAlign: "left",
            boxShadow: "0 4px 16px rgba(200,16,46,0.25)"
          }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>📖</div>
            Study Mode
            <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.8, marginTop: 2 }}>Practice at your pace</div>
          </button>
          <button onClick={onExam} style={{
            background: "#111", color: "#fff", border: "none", borderRadius: 14, padding: "18px 16px",
            fontSize: 15, fontWeight: 700, cursor: "pointer", textAlign: "left"
          }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>⏱️</div>
            Exam Mode
            <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.7, marginTop: 2 }}>30Q · 45min · no hints</div>
          </button>
        </div>

        {/* Overall progress */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "16px", border: "1px solid #F3F4F6", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>Overall Progress</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#C8102E" }}>{totalCorrect} / 347</div>
          </div>
          <div style={{ background: "#F3F4F6", borderRadius: 4, height: 8, marginBottom: 16 }}>
            <div style={{ background: "#C8102E", height: 8, borderRadius: 4, width: `${totalCorrect/347*100}%`, transition: "width 0.6s" }}/>
          </div>
          {/* Topic breakdown */}
          {topicStats.map(({ name, cfg, done, total, pct }) => (
            <button key={name} onClick={() => onStudy(name)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "8px 0", textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                <span style={{ fontSize: 14 }}>{cfg.emoji}</span>
                <span style={{ fontSize: 13, color: "#374151", flex: 1 }}>{name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>{Math.round(pct * 100)}%</span>
              </div>
              <div style={{ background: "#F3F4F6", borderRadius: 3, height: 5 }}>
                <div style={{ background: cfg.color, height: 5, borderRadius: 3, width: `${pct * 100}%`, transition: "width 0.6s" }}/>
              </div>
            </button>
          ))}
        </div>

        {/* Recent exam */}
        {recentExam && (
          <div style={{ background: recentExam.passed ? "#F0FDF4" : "#FFF8F8", border: `1px solid ${recentExam.passed ? "#BBF7D0" : "#FEE2E2"}`, borderRadius: 14, padding: "14px 16px", marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: recentExam.passed ? "#15803D" : "#C8102E", marginBottom: 4 }}>
              {recentExam.passed ? "✅ Last exam: PASSED" : "❌ Last exam: FAILED"} — {recentExam.score}%
            </div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>{recentExam.date} · {recentExam.correct}/{recentExam.total} correct</div>
          </div>
        )}

        {/* Badges preview */}
        {earnedBadges.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 14, padding: "16px", border: "1px solid #F3F4F6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>Badges earned</div>
              <button onClick={onBadges} style={{ fontSize: 12, color: "#C8102E", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>View all →</button>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {earnedBadges.slice(0, 6).map(b => (
                <div key={b.key} title={b.label} style={{ width: 44, height: 44, borderRadius: "50%", background: "#F9FAFB", border: "2px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                  {b.icon}
                </div>
              ))}
              {earnedBadges.length > 6 && (
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#F9FAFB", border: "2px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#6B7280", fontWeight: 700 }}>
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
