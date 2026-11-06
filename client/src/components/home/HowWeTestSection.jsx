import { Icons } from "../common/Icons";

export function HowWeTestSection({ onOpenManifesto, productsCount }) {
  return (
    <section className="how-we-test-section" aria-label="Testing Methodology">
      <div className="container">
        <div className="section-header-editorial">
          <div className="section-pill-tag">
            <Icons.Check size={12} strokeWidth={2.4} />
            <span>Editorial Verification</span>
          </div>
          <h2 className="section-title-editorial">How we test &amp; curate</h2>
          <p className="section-subtitle-editorial">
            Every entry undergoes rigorous empirical evaluation before publication.
            No paid slots, no sponsored rankings.
          </p>
          <div className="test-stat-badge" title="Lab benchmark testing pipeline">
            <span>{productsCount || 34} products bench-tested</span>
            <span className="dot-divider">•</span>
            <span>Empirical Testing Pipeline</span>
          </div>
        </div>

        {/* 3-Step Strip: Three equal columns */}
        <div className="how-we-test-grid">
          {/* Step 1 */}
          <div className="test-step-card">
            <div className="test-step-icon">
              <Icons.Award size={20} strokeWidth={2} />
            </div>
            <div className="test-step-num">01</div>
            <h3 className="test-step-title">Strict 4.2★ quality floor</h3>
            <p className="test-step-copy">
              No product enters our directory unless it maintains at least a 4.2-star
              verified owner satisfaction rating across trusted benchmarks.
            </p>
          </div>

          {/* Step 2 */}
          <div className="test-step-card">
            <div className="test-step-icon">
              <Icons.Sliders size={20} strokeWidth={2} />
            </div>
            <div className="test-step-num">02</div>
            <h3 className="test-step-title">Hands-on bench testing</h3>
            <p className="test-step-copy">
              Every entry is verified for real-world efficiency, tactile build precision,
              thermal performance, and long-term hardware durability.
            </p>
          </div>

          {/* Step 3 */}
          <div className="test-step-card">
            <div className="test-step-icon">
              <Icons.Shield size={20} strokeWidth={2} />
            </div>
            <div className="test-step-num">03</div>
            <h3 className="test-step-title">Zero paid placements</h3>
            <p className="test-step-copy">
              Manufacturers cannot buy placement, sponsor reviews, or pay to bypass our
              bench standards. Inclusion is 100% earned.
            </p>
          </div>
        </div>

        {onOpenManifesto && (
          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <button
              className="btn-link-action"
              onClick={onOpenManifesto}
              aria-label="Read our full testing manifesto"
            >
              Read full testing manifesto <Icons.ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default HowWeTestSection;

