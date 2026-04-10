import BADGE_DEFS from "../data/badges";

export default function BadgesScreen({ badges, onBack }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", paddingBottom: 32 }}>
      <div style={{ background: "#fff", padding: "52px 20px 16px", borderBottom: "1px solid #F3F4F6", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 20 }}>←</button>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111", margin: 0 }}>Badges</h2>
          <span style={{ fontSize: 13, color: "#9CA3AF", marginLeft: 4 }}>{badges.size} / {BADGE_DEFS.length}</span>
        </div>
      </div>
      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {BADGE_DEFS.map(b => {
            const earned = badges.has(b.key);
            return (
              <div key={b.key} style={{ background: "#fff", borderRadius: 14, padding: "16px", border: `1px solid ${earned ? "#C8102E40" : "#F3F4F6"}`, opacity: earned ? 1 : 0.5 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{b.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: earned ? "#111" : "#9CA3AF", marginBottom: 4 }}>{b.label}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.4 }}>{b.desc}</div>
                {earned && <div style={{ fontSize: 11, color: "#C8102E", fontWeight: 700, marginTop: 6 }}>✓ EARNED</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
