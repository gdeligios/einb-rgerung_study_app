import SwissCross from "./SwissCross";
import { getBrochureContent } from "../../data/brochureContext";

export default function BrochureViewer({ question, onClose }) {
  const content = getBrochureContent(question.brochurePages);
  const pageList = question.brochurePages.join(", ");
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} onClick={onClose}/>
      <div style={{ position: "relative", background: "#fff", borderRadius: "16px 16px 0 0", maxHeight: "75vh", overflow: "auto", padding: "0 0 36px" }}>
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 10px" }}>
          <div style={{ width: 36, height: 3, background: "#E5E7EB", borderRadius: 2 }}/>
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 20px 14px", borderBottom: "1px solid #F3F4F6" }}>
          <SwissCross size={24}/>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111", letterSpacing: "-0.01em" }}>Vorbereitungsbroschüre</div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>p. {pageList} · {content.title}</div>
          </div>
          <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", fontSize: 20, color: "#9CA3AF", cursor: "pointer", lineHeight: 1, padding: 0 }}>×</button>
        </div>

        {/* Context label */}
        <div style={{ margin: "14px 20px 0" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#C8102E", marginBottom: 14 }}>
            RELEVANT CONTEXT FOR THIS QUESTION
          </div>

          {content.sections.map((sec, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ background: "#C8102E", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 3, letterSpacing: "0.04em" }}>
                  p. {sec.pages}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>{sec.heading}</span>
              </div>
              <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.65 }}>{sec.content}</div>
            </div>
          ))}

          <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 12px", marginTop: 4 }}>
            <div style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.5 }}>
              In the full app, this opens the scanned brochure at the exact relevant passage.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
