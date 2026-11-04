import { Icons } from "../common/Icons";

export function BuyingGuidesModal({ onClose }) {
  const guides = [
    {
      title:
        "The 2026 Audiophile Guide: Active Noise Canceling vs Pure Fidelity",
      author: "David Sterling, Head Audio Editor",
      readTime: "6 min read",
      excerpt:
        "Why battery isolation, dual-DAC processing, and acoustic seal matter more than raw decibel specs when selecting daily listening cans.",
    },
    {
      title:
        "Minimalist Mechanical Keyboards: Hot-Swap Switches & CNC Acoustics",
      author: "Elena Rostova, Computing Editor",
      readTime: "8 min read",
      excerpt:
        "Tactile vs Linear switches, double-gasket acoustic mounting, and our benchmark tests for all-day typing comfort.",
    },
    {
      title: "Pour-Over Coffee Precision: PID Thermostats & Spout Geometry",
      author: "Marcus Chen, Lifestyle & Coffee Specialist",
      readTime: "5 min read",
      excerpt:
        "How flow rate restriction, to-the-degree holding, and counterbalanced handles unlock true extraction consistency.",
    },
  ];

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-dialog"
        style={{ maxWidth: "640px", padding: "36px" }}
      >
        <button
          className="btn-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <Icons.Close />
        </button>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "26px",
            marginBottom: "8px",
          }}
        >
          Editorial Buying Guides
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "var(--slate-600)",
            marginBottom: "24px",
          }}
        >
          In-depth technical breakdowns and comparative bench analyses written
          by our category editors.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {guides.map((g, idx) => (
            <div
              key={idx}
              style={{
                padding: "16px",
                borderRadius: "12px",
                background: "var(--slate-50)",
                border: "1px solid var(--slate-200)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11px",
                  color: "var(--slate-500)",
                  marginBottom: "4px",
                }}
              >
                <span>{g.author}</span>
                <span>{g.readTime}</span>
              </div>
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--slate-950)",
                  marginBottom: "6px",
                }}
              >
                {g.title}
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--slate-600)",
                  lineHeight: "1.5",
                }}
              >
                {g.excerpt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BuyingGuidesModal;
