import { Icons } from "../common/Icons";

const GUIDES_DATA = [
  {
    id: "audiophile-guide-2026",
    title: "The 2026 Audiophile Guide: Active Noise Canceling vs Pure Fidelity",
    author: "David Sterling, Head Audio Editor",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
    summary:
      "Why battery isolation, dual-DAC processing, and acoustic seal matter more than raw decibel specs when selecting daily listening cans.",
  },
  {
    id: "mechanical-keyboards-guide",
    title: "Minimalist Mechanical Keyboards: Hot-Swap Switches & CNC Acoustics",
    author: "Elena Rostova, Computing Editor",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80",
    summary:
      "Tactile vs Linear switches, double-gasket acoustic mounting, and our benchmark tests for all-day typing comfort.",
  },
  {
    id: "pour-over-coffee-precision",
    title: "Pour-Over Coffee Precision: PID Thermostats & Spout Geometry",
    author: "Marcus Chen, Lifestyle Specialist",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1592417766326-088bf3da80c5?w=600&auto=format&fit=crop&q=80",
    summary:
      "How flow rate restriction, to-the-degree holding, and counterbalanced handles unlock true extraction consistency.",
  },
];

export function BuyingGuidesTeaser({ onOpenGuides }) {
  return (
    <section className="buying-guides-section" aria-label="Buying Guides Teaser">
      <div className="container">
        <div className="section-header-editorial">
          <div className="section-pill-tag">
            <span>In-Depth Analysis</span>
          </div>
          <h2 className="section-title-editorial">Editorial buying guides</h2>
          <p className="section-subtitle-editorial">
            Comprehensive comparative analyses, lab measurements, and teardowns from our staff editors.
          </p>
        </div>

        <div className="guides-cards-grid">
          {GUIDES_DATA.map((guide) => (
            <article className="guide-card" key={guide.id}>
              {guide.image && (
                <div className="guide-card-thumb">
                  <img
                    src={guide.image}
                    alt={guide.title}
                    width={600}
                    height={340}
                    loading="lazy"
                  />
                </div>
              )}
              <div className="guide-card-meta">
                <span className="guide-card-author">{guide.author}</span>
                <span className="guide-card-time">{guide.readTime}</span>
              </div>
              <h3 className="guide-card-title">{guide.title}</h3>
              <p className="guide-card-summary">{guide.summary}</p>
              <button
                className="guide-card-cta"
                onClick={onOpenGuides}
                aria-label={`Read guide: ${guide.title}`}
              >
                <span>Read guide</span>
                <Icons.ArrowRight size={14} />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BuyingGuidesTeaser;


