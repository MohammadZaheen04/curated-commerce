import { Icons } from "../common/Icons";

export function HowWeCurateModal({ onClose }) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-dialog"
        style={{ maxWidth: "600px", padding: "36px" }}
      >
        <button
          className="btn-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <Icons.Close />
        </button>
        <div
          style={{
            display: "inline-flex",
            padding: "4px 10px",
            borderRadius: "100px",
            background: "var(--emerald-50)",
            color: "var(--emerald-700)",
            fontSize: "12px",
            fontWeight: 700,
            marginBottom: "12px",
          }}
        >
          ✓ Trust Manifesto
        </div>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "26px",
            marginBottom: "8px",
          }}
        >
          How We Test & Curate
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "var(--slate-600)",
            lineHeight: "1.6",
            marginBottom: "20px",
          }}
        >
          We started Curated Commerce because online shopping has become an
          endless sea of sponsored algorithms and low-quality dropshipped
          inventory. Here is how our quality gate operates:
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              borderLeft: "3px solid var(--emerald-600)",
              paddingLeft: "14px",
            }}
          >
            <h4 style={{ fontSize: "14px", fontWeight: 700 }}>
              1. The Strict 4.2★ Quality Gate
            </h4>
            <p
              style={{
                fontSize: "13px",
                color: "var(--slate-600)",
                marginTop: "2px",
              }}
            >
              No product is ever added to our directory unless it has earned and
              maintained at least a 4.2-star verified rating across trusted user
              benchmarks.
            </p>
          </div>
          <div
            style={{
              borderLeft: "3px solid var(--slate-900)",
              paddingLeft: "14px",
            }}
          >
            <h4 style={{ fontSize: "14px", fontWeight: 700 }}>
              2. Hands-On Editor's Verdict
            </h4>
            <p
              style={{
                fontSize: "13px",
                color: "var(--slate-600)",
                marginTop: "2px",
              }}
            >
              Every entry must carry an editor's verified opinion explaining why
              the product justifies its price, where it shines, and its
              potential caveats.
            </p>
          </div>
          <div
            style={{
              borderLeft: "3px solid var(--amber-500)",
              paddingLeft: "14px",
            }}
          >
            <h4 style={{ fontSize: "14px", fontWeight: 700 }}>
              3. Automatic Quality Demotion
            </h4>
            <p
              style={{
                fontSize: "13px",
                color: "var(--slate-600)",
                marginTop: "2px",
              }}
            >
              If a product's rating drops below 4.0 after customer reviews
              accumulate, the item is immediately placed UNDER_REVIEW and
              removed from public discovery.
            </p>
          </div>
          <div
            style={{
              borderLeft: "3px solid var(--indigo-600)",
              paddingLeft: "14px",
            }}
          >
            <h4 style={{ fontSize: "14px", fontWeight: 700 }}>
              4. Zero Paid Placements
            </h4>
            <p
              style={{
                fontSize: "13px",
                color: "var(--slate-600)",
                marginTop: "2px",
              }}
            >
              Manufacturers cannot buy placement, sponsor listings, or pay to
              bypass our quality gates. Inclusion is 100% earned.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowWeCurateModal;
