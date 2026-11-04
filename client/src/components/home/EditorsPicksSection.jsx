import { useRef } from "react";
import { ProductCard } from "../product/ProductCard";
import { Icons } from "../common/Icons";

export function EditorsPicksSection({
  products,
  onQuickView,
  onViewAll,
}) {
  const carouselRef = useRef(null);

  // Filter products strictly flagged as Editor's Pick (ratingAvg >= 4.8)
  const editorsPicks = products.filter((p) => p.ratingAvg >= 4.8);

  const scrollPrev = () => {
    carouselRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollNext = () => {
    carouselRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      scrollPrev();
    } else if (e.key === "ArrowRight") {
      scrollNext();
    }
  };

  if (editorsPicks.length === 0) return null;

  return (
    <section className="editors-picks-section" aria-label="Editor's Picks">
      <div className="container">
        {/* Section Header with Title & Action Controls */}
        <div className="editors-section-header">
          <div>
            <div className="section-pill-tag">
              <span className="brand-dot" />
              <span>Top rated</span>
            </div>
            <h2 className="section-title-editorial">Editor&rsquo;s picks</h2>
            <p className="section-subtitle-editorial">
              Standout gear evaluated with exceptional lab benchmark scores (4.8★+).
            </p>
          </div>

          <div className="editors-header-actions">
            <button
              className="btn-view-all-link"
              onClick={onViewAll}
              aria-label="View all Editor's Picks in collection"
            >
              View all ({editorsPicks.length})
            </button>

            <div className="carousel-nav-arrows" role="group" aria-label="Carousel navigation">
              <button
                className="btn-carousel-arrow"
                onClick={scrollPrev}
                aria-label="Previous editor's pick"
              >
                <Icons.ChevronLeft size={16} />
              </button>
              <button
                className="btn-carousel-arrow"
                onClick={scrollNext}
                aria-label="Next editor's pick"
              >
                <Icons.ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll-Snap Carousel (4 cards on desktop, touch/keyboard accessible) */}
        <div
          className="editors-carousel"
          ref={carouselRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          role="region"
          aria-label="Editor's picks carousel. Use arrow keys to navigate."
        >
          {editorsPicks.map((p) => (
            <div className="editors-carousel-slide" key={p.id}>
              <ProductCard product={p} onQuickView={onQuickView} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EditorsPicksSection;

