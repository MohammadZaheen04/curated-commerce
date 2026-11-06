import { Icons } from "../common/Icons";

export function FilterBar({
  categories,
  filters,
  setFilters,
  totalCount,
  filteredCount,
  resetAllFilters,
  categoryCounts = {},
}) {
  const isAnyFilterActive =
    filters.category !== null ||
    filters.priceRange !== "ALL" ||
    (filters.ratingTier !== "ANY" && filters.ratingTier !== "4.2") ||
    filters.onlyEditorsPick ||
    filters.onlyOnSale ||
    filters.q !== "";

  // Filter chips: hide categories with fewer than 3 products to keep catalog dense & curated
  const visibleCategories = categories.filter(
    (c) => (categoryCounts[c.slug] ?? c._count?.products ?? 0) >= 3,
  );

  return (
    <div className="sticky-filters-bar" aria-label="Catalog filters">
      <div className="container">
        {/* Category Chip Row: Single horizontally scrollable row */}
        <div className="chips-wrapper-scrollable">
          <div className="chips-container-scrollable">
            {/* "All" chip */}
            <button
              className={`chip-btn${filters.category === null ? " active" : ""}`}
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  category: null,
                  page: 1,
                }))
              }
              aria-pressed={filters.category === null}
            >
              All
              <span className="chip-count">{totalCount}</span>
            </button>

            {/* Individual Category Chips with accurate dataset counts (>= 3 products) */}
            {visibleCategories.map((c) => {
              const isActive = filters.category === c.slug;
              const count = categoryCounts[c.slug] ?? c._count?.products ?? 0;
              return (
                <button
                  key={c.id || c.slug}
                  className={`chip-btn${isActive ? " active" : ""}`}
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      category: isActive ? null : c.slug,
                      page: 1,
                    }))
                  }
                  aria-pressed={isActive}
                >
                  {c.name}
                  {count > 0 && <span className="chip-count">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Unified Control Bar (all controls 40px tall with same radius) */}
        <div className="filter-bar-controls">
          <div className="filter-controls-left">
            {/* Price Dropdown */}
            <select
              className="control-select"
              value={filters.priceRange}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  priceRange: e.target.value,
                  page: 1,
                }))
              }
              aria-label="Filter by price range"
            >
              <option value="ALL">Price: Any</option>
              <option value="UNDER_100">Under $100</option>
              <option value="100_300">$100 – $300</option>
              <option value="300_PLUS">$300+</option>
            </select>

            {/* Rating Dropdown (4.2 is the catalog baseline floor, so options start at 4.5) */}
            <select
              className="control-select"
              value={filters.ratingTier}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  ratingTier: e.target.value,
                  page: 1,
                }))
              }
              aria-label="Filter by minimum rating"
            >
              <option value="ANY">Rating: Any</option>
              <option value="4.5">4.5★+</option>
              <option value="4.7">4.7★+</option>
            </select>

            {/* Editor's Picks Toggle (single presence on page) */}
            <button
              className={`control-toggle-btn${filters.onlyEditorsPick ? " active" : ""}`}
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  onlyEditorsPick: !f.onlyEditorsPick,
                  page: 1,
                }))
              }
              aria-pressed={filters.onlyEditorsPick}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: filters.onlyEditorsPick
                    ? "var(--accent)"
                    : "var(--border-hover)",
                  display: "inline-block",
                }}
              />
              Editor's picks
            </button>

            {/* On Sale Toggle (single presence on page) */}
            <button
              className={`control-toggle-btn${filters.onlyOnSale ? " active" : ""}`}
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  onlyOnSale: !f.onlyOnSale,
                  page: 1,
                }))
              }
              aria-pressed={filters.onlyOnSale}
            >
              <Icons.Tag size={13} />
              On sale
            </button>

            {/* Clear All text button (only visible when filters are active) */}
            {isAnyFilterActive && (
              <button
                className="btn-filter-clear"
                onClick={resetAllFilters}
                aria-label="Clear all active filters"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="filter-controls-right">
            {/* Live Result Count */}
            <span className="results-count">
              <strong>{filteredCount}</strong> {filteredCount === 1 ? "product" : "products"}
            </span>

            {/* Sort Dropdown */}
            <select
              className="control-select"
              value={filters.sort}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  sort: e.target.value,
                  page: 1,
                }))
              }
              aria-label="Sort products"
            >
              <option value="rating">Top Rated First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
