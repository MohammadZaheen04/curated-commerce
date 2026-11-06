import { useStore } from "../../context/StoreContext";
import { Icons } from "../common/Icons";
import { ProductImage } from "../common/ProductImage";

export function EditorialHero({
  spotlightProduct,
  scrollToCatalog,
  setShowCurateModal,
}) {
  const { addToCart } = useStore();

  return (
    <section className="hero-editorial">
      <div className="container hero-grid">
        {/* Left Column: Value Proposition & Clear Actions */}
        <div className="hero-left-content">
          {/* Legible Single-Row Trust Line */}
          <div className="trust-line-row">
            <div className="trust-item">
              <span className="trust-item-icon">
                <Icons.Check size={14} strokeWidth={2.5} />
              </span>
              <span>4.2★ Quality Floor</span>
            </div>
            <div className="trust-item">
              <span className="trust-item-icon">
                <Icons.Check size={14} strokeWidth={2.5} />
              </span>
              <span>Independent Bench Tests</span>
            </div>
            <div className="trust-item">
              <span className="trust-item-icon">
                <Icons.Check size={14} strokeWidth={2.5} />
              </span>
              <span>Zero Sponsored Listings</span>
            </div>
          </div>

          <h1 className="hero-headline">
            Only the best,
            <br />
            bench-tested &amp; curated.
          </h1>

          <p className="hero-subhead">
            Every product in our directory meets strict lab performance standards,
            long-term reliability thresholds, and verified owner satisfaction.
            No promoted listings, no affiliate noise.
          </p>

          <div className="hero-cta-group">
            <button className="btn-primary-hero" onClick={scrollToCatalog}>
              Explore tested picks <Icons.ArrowDown size={15} />
            </button>
            <button
              className="btn-secondary-hero"
              onClick={() => setShowCurateModal(true)}
            >
              How we test
            </button>
          </div>
        </div>

        {/* Right Column: Distinct Feature Spotlight Card */}
        {spotlightProduct ? (
          <aside className="spotlight-card" aria-label="Featured Product">
            <div className="spotlight-top-badge">
              <Icons.Award size={13} strokeWidth={2} />
              <span>Editorial Top Pick</span>
            </div>

            <div className="spotlight-img-wrap">
              <ProductImage
                product={spotlightProduct}
                aspectRatio="unset"
                priority={true}
              />
            </div>

            <div>
              <div className="spotlight-meta-row">
                <Icons.Star size={13} filled={true} />
                <span>{spotlightProduct.ratingAvg.toFixed(1)} Rating</span>
                <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>
                  • {spotlightProduct.category?.name || "Tested Pick"}
                </span>
              </div>
              <h3 className="spotlight-title">{spotlightProduct.title}</h3>
            </div>

            <p className="spotlight-verdict">
              {spotlightProduct.curatedVerdict}
            </p>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginTop: "-8px",
                marginBottom: "12px",
                display: "block",
              }}
            >
              — Curated Bench Verdict
            </span>

            <div className="spotlight-footer">
              <div>
                <span className="spotlight-price">
                  ${parseFloat(spotlightProduct.price).toFixed(0)}
                </span>
                {parseFloat(spotlightProduct.mrp) > parseFloat(spotlightProduct.price) && (
                  <span className="spotlight-mrp">
                    ${parseFloat(spotlightProduct.mrp).toFixed(0)}
                  </span>
                )}
              </div>
              <button
                className="btn-spotlight-add"
                onClick={() => addToCart(spotlightProduct, 1)}
                aria-label={`Quick add ${spotlightProduct.title} to cart`}
              >
                Quick Add
              </button>
            </div>
          </aside>
        ) : (
          <aside className="spotlight-card" aria-hidden="true" style={{ opacity: 0.6 }}>
            <div className="spotlight-top-badge" style={{ background: "var(--surface-muted)", color: "transparent", width: "120px", height: "24px" }}>
              Loading…
            </div>
            <div className="spotlight-img-wrap" style={{ background: "var(--border)" }} />
            <div style={{ width: "70%", height: "20px", background: "var(--border)", borderRadius: "4px" }} />
            <div style={{ width: "100%", height: "14px", background: "var(--surface-muted)", borderRadius: "4px" }} />
          </aside>
        )}
      </div>
    </section>
  );
}

export default EditorialHero;