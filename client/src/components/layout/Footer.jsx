import { useState } from "react";
import { Icons } from "../common/Icons";

export function Footer({
  setFilters,
  scrollToCatalog,
  setShowCurateModal,
  setShowGuidesModal,
}) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState(null); // 'success' | 'error' | null
  const [newsletterMessage, setNewsletterMessage] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      setNewsletterStatus("error");
      setNewsletterMessage("Please enter a valid email address.");
      return;
    }

    setNewsletterStatus("success");
    setNewsletterMessage("Thank you for subscribing to our monthly verdict digest.");
    setNewsletterEmail("");
  };

  return (
    <footer className="footer-corporate">
      <div className="container">
        <div className="footer-grid-4col">
          {/* Col 1: Brand & Independent Mission */}
          <div>
            <div className="footer-brand-title">
              Curated Commerce
              <span className="brand-dot" />
            </div>
            <p className="footer-mission">
              The trust-first e-commerce catalog where products are independently
              bench-tested, verified by strict quality gates, and guaranteed zero
              sponsored placement.
            </p>
            <div className="footer-trust-badge">
              <Icons.Check size={14} strokeWidth={2.5} />
              <span>Independent Hardware Benchmarks</span>
            </div>
          </div>

          {/* Col 2: Top Tested Categories */}
          <div>
            <h4 className="footer-col-title">Top Categories</h4>
            <ul className="footer-links-list">
              <li>
                <button
                  onClick={() => {
                    setFilters((f) => ({ ...f, category: "computing", page: 1 }));
                    scrollToCatalog();
                  }}
                >
                  Computing
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilters((f) => ({ ...f, category: "audio", page: 1 }));
                    scrollToCatalog();
                  }}
                >
                  Audio
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilters((f) => ({ ...f, category: "wearables", page: 1 }));
                    scrollToCatalog();
                  }}
                >
                  Wearables
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilters((f) => ({ ...f, category: "accessories", page: 1 }));
                    scrollToCatalog();
                  }}
                >
                  Tech Accessories
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilters((f) => ({ ...f, category: "gaming", page: 1 }));
                    scrollToCatalog();
                  }}
                >
                  Gaming
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilters((f) => ({ ...f, category: "specialty-coffee", page: 1 }));
                    scrollToCatalog();
                  }}
                >
                  Specialty Coffee
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Editorial & Testing Standards */}
          <div>
            <h4 className="footer-col-title">Editorial &amp; Standards</h4>
            <ul className="footer-links-list">
              <li>
                <button onClick={() => setShowCurateModal(true)}>
                  How We Curate
                </button>
              </li>
              <li>
                <button onClick={() => setShowGuidesModal(true)}>
                  Buying Guides
                </button>
              </li>
              <li>
                <button onClick={() => setShowCurateModal(true)}>
                  Testing Methodology
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    alert(
                      "All curated listings qualify for 30-day trials and free returns.",
                    )
                  }
                >
                  Shipping &amp; Guarantees
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    alert("Support & inquiries: editorial@curatedcommerce.internal")
                  }
                >
                  Contact &amp; FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter / Monthly newsletter */}
          <div>
            <h4 className="footer-col-title">Monthly newsletter</h4>
            <p className="footer-digest-copy">
              Receive our monthly roundup of newly tested products that passed
              our rigorous bench standards.
            </p>

            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <label htmlFor="newsletter-email-input" className="newsletter-label">
                Email address
              </label>
              <div className="newsletter-input-group">
                <input
                  type="email"
                  id="newsletter-email-input"
                  name="email"
                  autoComplete="email"
                  aria-label="Email address for monthly verdict digest"
                  placeholder="alex@example.com"
                  className="newsletter-input"
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    if (newsletterStatus) setNewsletterStatus(null);
                  }}
                  required
                />
                <button type="submit" className="btn-newsletter-subscribe">
                  Subscribe
                </button>
              </div>

              <p className="newsletter-privacy-text">
                We’ll email monthly. Unsubscribe anytime.{" "}
                <a href="#privacy" onClick={(e) => e.preventDefault()}>
                  Privacy Policy
                </a>
              </p>

              {newsletterStatus === "success" && (
                <div className="newsletter-message-success" role="status">
                  ✓ {newsletterMessage}
                </div>
              )}
              {newsletterStatus === "error" && (
                <div className="newsletter-message-error" role="alert">
                  {newsletterMessage}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Clean Legal & Copyright Bar */}
        <div className="footer-legal-bar">
          <p>© 2026 Curated Commerce Inc. All rights reserved.</p>
          <div className="footer-legal-links">
            <a href="#privacy" onClick={(e) => e.preventDefault()}>
              Privacy Policy
            </a>
            <a href="#terms" onClick={(e) => e.preventDefault()}>
              Terms of Service
            </a>
            <a href="#independence" onClick={(e) => e.preventDefault()}>
              Independence Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;