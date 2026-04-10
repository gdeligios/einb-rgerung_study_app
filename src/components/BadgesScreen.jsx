import BADGE_DEFS from "../data/badges";

export default function BadgesScreen({ badges, onBack }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", paddingBottom: 40 }}>
      <div style={{ background: "#fff", padding: "52px 20px 16px", borderBottom: "1px solid #F3F4F6", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", fontSize: 18, padding: 0 }}>←</button>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111", margin: 0, letterSpacing: "-0.01em" }}>Badges</h2>
          <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, letterSpacing: "0.04em" }}>
            {badges.size} / {BADGE_DEFS.length}
          </span>
        </div>
      </div>

      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {BADGE_DEFS.map(b => {
            const earned = badges.has(b.key);
            return (
              <div key={b.key} style={{
                background: "#fff",
                borderRadius: 12,
                padding: "18px 16px",
                border: `1px solid ${earned ? "#FECACA" : "#F3F4F6"}`,
                opacity: earned ? 1 : 0.45,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: earned ? "#C8102E" : "#F3F4F6",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: b.icon.length > 1 ? 11 : 16,
                  fontWeight: 800, color: earned ? "#fff" : "#9CA3AF",
                  letterSpacing: "0.02em", marginBottom: 12
                }}>
                  {b.icon}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#111", marginBottom: 4 }}>{b.label}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.5 }}>{b.desc}</div>
                {earned && (
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#C8102E", letterSpacing: "0.08em", marginTop: 8 }}>
                    EARNED
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
