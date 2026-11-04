import { ProductCard, SkeletonCard } from "./ProductCard";
import { Icons } from "../common/Icons";

export function ProductGrid({
  products,
  visibleCount,
  onLoadMore,
  isLoading,
  resetAllFilters,
  onQuickView,
}) {
  const displayedProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  // Dev-only check for duplicate product ids
  if (import.meta.env.DEV) {
    const seen = new Set();
    displayedProducts.forEach((p) => {
      if (seen.has(p.id)) {
        console.warn(
          `[Dev Warning] Duplicate product ID detected in grid: "${p.id}" (${p.title})`,
        );
      }
      seen.add(p.id);
    });
  }

  return (
    <div className="catalog-grid-wrapper">
      <div className="container">
        {isLoading ? (
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="catalog-empty-state">
            <div className="catalog-empty-icon">
              <Icons.Search size={36} />
            </div>
            <h3 className="catalog-empty-title">
              No products match this filter combination
            </h3>
            <p className="catalog-empty-copy">
              Try adjusting your price range, rating threshold, or clear filters
              to discover other bench-tested recommendations.
            </p>
            <button className="btn-empty-reset" onClick={resetAllFilters}>
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="product-grid">
              {displayedProducts.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
              ))}
            </div>

            {/* Pagination / Load More Footer */}
            {products.length > 0 && (
              <div className="catalog-pagination-footer">
                <p className="catalog-pagination-count">
                  Showing {Math.min(visibleCount, products.length)} of {products.length} products
                </p>

                {hasMore && (
                  <button
                    className="btn-load-more"
                    onClick={onLoadMore}
                    aria-label="Load 12 more products"
                  >
                    Load more
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProductGrid;
