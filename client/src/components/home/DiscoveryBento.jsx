export function DiscoveryBento({ filters, setFilters, scrollToCatalog }) {
  return (
    <section className="collections-strip">
      <div className="container">
        <div className="collections-grid">
          <button
            className={`collection-card${filters.priceRange === "UNDER_100" ? " active" : ""}`}
            onClick={() => {
              setFilters((f) => ({
                ...f,
                priceRange: f.priceRange === "UNDER_100" ? "ALL" : "UNDER_100",
              }));
              scrollToCatalog();
            }}
          >
            <div className="collection-icon">⚡</div>
            <div className="collection-text">
              <h4>Best Under $100</h4>
              <p>Budget picks with luxury standards</p>
            </div>
          </button>

          <button
            className={`collection-card${filters.category === "computing" ? " active" : ""}`}
            onClick={() => {
              setFilters((f) => ({
                ...f,
                category: f.category === "computing" ? null : "computing",
              }));
              scrollToCatalog();
            }}
          >
            <div className="collection-icon">💻</div>
            <div className="collection-text">
              <h4>Workstation & Desk</h4>
              <p>Mice, mechanical boards & monitors</p>
            </div>
          </button>

          <button
            className={`collection-card${filters.ratingTier === "4.8" ? " active" : ""}`}
            onClick={() => {
              setFilters((f) => ({
                ...f,
                ratingTier: f.ratingTier === "4.8" ? "4.2" : "4.8",
              }));
              scrollToCatalog();
            }}
          >
            <div className="collection-icon">🏆</div>
            <div className="collection-text">
              <h4>4.8★+ Champions</h4>
              <p>The highest rated products in test</p>
            </div>
          </button>

          <button
            className={`collection-card${filters.onlyOnSale ? " active" : ""}`}
            onClick={() => {
              setFilters((f) => ({ ...f, onlyOnSale: !f.onlyOnSale }));
              scrollToCatalog();
            }}
          >
            <div className="collection-icon">🏷️</div>
            <div className="collection-text">
              <h4>On Sale Picks</h4>
              <p>Discounts of 10% to 25% off</p>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}

export default DiscoveryBento;
