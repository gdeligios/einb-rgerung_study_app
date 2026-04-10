import SwissCross from "./SwissCross";
import { getBrochureContent } from "../../data/brochureContext";

export default function BrochureViewer({ question, onClose }) {
  const content = getBrochureContent(question.brochurePages);
  const pageList = question.brochurePages.join(", ");
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} onClick={onClose}/>
      <div style={{ position: "relative", background: "#fff", borderRadius: "20px 20px 0 0", maxHeight: "75vh", overflow: "auto", padding: "0 0 32px" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 8px" }}>
          <div style={{ width: 40, height: 4, background: "#D1D5DB", borderRadius: 2 }}/>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 20px 16px", borderBottom: "1px solid #F3F4F6" }}>
          <SwissCross size={28}/>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>Vorbereitungsbroschüre</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>Pages {pageList} • {content.title}</div>
          </div>
          <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", fontSize: 22, color: "#9CA3AF", cursor: "pointer" }}>×</button>
        </div>
        <div style={{ padding: "16px 20px" }}>
          <div style={{ background: "#FFF8F8", border: "1px solid #FEE2E2", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: "#C8102E", fontWeight: 600 }}>📖 RELEVANT CONTEXT FOR THIS QUESTION</div>
          </div>
          {content.sections.map((sec, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ background: "#C8102E", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>
                  p. {sec.pages}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{sec.heading}</div>
              </div>
              <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.65, paddingLeft: 4 }}>{sec.content}</div>
            </div>
          ))}
          <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "12px 14px", marginTop: 8 }}>
            <div style={{ fontSize: 12, color: "#6B7280" }}>
              💡 In the full app, this opens the actual scanned brochure page at the exact passage relevant to this question.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
