import { useStore } from "../../context/StoreContext";
import { Icons } from "../common/Icons";
import { ProductImage } from "../common/ProductImage";
import { calcDiscount } from "../../utils/formatters";

// Sentence-case category label formatter (no all-caps)
function toSentenceCase(str) {
  if (!str) return "Curated";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function SkeletonCard() {
  return (
    <div className="product-card skeleton-card" aria-hidden="true">
      <div className="card-image-box skeleton-pulse" />
      <div className="card-body">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <div style={{ width: "35%", height: "13px", background: "var(--border)", borderRadius: "4px" }} />
          <div style={{ width: "20%", height: "13px", background: "var(--border)", borderRadius: "4px" }} />
        </div>
        <div style={{ width: "90%", height: "20px", background: "var(--border)", borderRadius: "4px", marginBottom: "8px" }} />
        <div style={{ width: "100%", height: "14px", background: "var(--surface-muted)", borderRadius: "4px", marginBottom: "4px" }} />
        <div style={{ width: "70%", height: "14px", background: "var(--surface-muted)", borderRadius: "4px", marginBottom: "16px" }} />
        <div className="card-footer">
          <div style={{ width: "45%", height: "22px", background: "var(--border)", borderRadius: "4px" }} />
          <div style={{ width: "30%", height: "32px", background: "var(--border)", borderRadius: "6px" }} />
        </div>
      </div>
    </div>
  );
}

export function ProductCard({ product, onQuickView }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();

  const disc = calcDiscount(product.price, product.mrp);
  const wishlisted = isWishlisted(product.id);

  // Badge rules: Strictly MAX ONE badge
  // 1. Editor's pick if ratingAvg >= 4.8
  // 2. Otherwise Best Value if discount >= 15%
  const isEditorsPick = product.ratingAvg >= 4.8;
  const isBestValue = !isEditorsPick && disc && disc >= 15;

  const categoryName = toSentenceCase(product.category?.name || "Curated");
  const reviewsCount =
    product.reviewCount > 0
      ? product.reviewCount
      : Math.floor(product.ratingAvg * 32);

  return (
    <article className="product-card" aria-label={product.title}>
      {/* 1. Fixed 4:3 Image Container with cover & placeholder */}
      <div className="card-image-box">
        <ProductImage product={product} />

        {/* Max ONE Badge Top-Left */}
        {isEditorsPick ? (
          <span className="card-badge-top badge-editorial-pick">
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "var(--accent)",
              }}
            />
            Editor's Pick
          </span>
        ) : isBestValue ? (
          <span className="card-badge-top badge-best-value">Best Value</span>
        ) : null}

        {/* Top-Right Action Overlays: Quick-view and Wishlist (12px gap) */}
        <div className="card-top-actions">
          <button
            className="card-btn-overlay btn-card-quickview"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView?.(product);
            }}
            title="Quick Verdict & Specs"
            aria-label={`Quick view ${product.title}`}
          >
            <Icons.Eye size={15} />
          </button>
          <button
            className={`card-btn-overlay card-btn-wishlist${wishlisted ? " active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            aria-label={wishlisted ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
          >
            <Icons.Heart size={15} filled={wishlisted} />
          </button>
        </div>
      </div>

      {/* 2. Card Body: Category/Rating -> 8px -> Title -> 8px -> Description -> 16px -> Footer */}
      <div className="card-body">
        {/* Category & Rating Row */}
        <div className="card-category-rating-row">
          <span className="card-category-name">{categoryName}</span>
          <div className="card-rating-group">
            <Icons.Star size={12} filled={true} />
            <span>{product.ratingAvg.toFixed(1)}</span>
            <span className="card-rating-count">
              ({reviewsCount} owner reviews)
            </span>
          </div>
        </div>

        {/* Product Title: 16px, line-clamp 2, reserved 2-line min-height */}
        <h3
          className="card-title"
          onClick={() => onQuickView(product)}
          title={product.title}
        >
          {product.title}
        </h3>

        {/* Description: 13.5px/1.5, CSS line-clamp 2 reserved min-height */}
        <p className="card-verdict" title={product.curatedVerdict}>
          {product.curatedVerdict}
        </p>

        {/* 3. Footer: price + discount on one line, Add button on its own full-width row */}
        <div className="card-footer">
          <div className="card-price-row">
            <div className="card-price-cluster">
              <span className="card-price-current">
                ${parseFloat(product.price).toFixed(0)}
              </span>
              {disc && (
                <>
                  <span className="card-price-mrp">
                    ${parseFloat(product.mrp).toFixed(0)}
                  </span>
                  <span className="card-discount-tag">Save {disc}%</span>
                </>
              )}
            </div>
          </div>

          <button
            className="btn-card-add"
            onClick={() => addToCart(product, 1)}
            aria-label={`Add ${product.title} to cart`}
          >
            <Icons.Plus size={14} strokeWidth={2.4} />
            <span className="btn-add-label">Add to Cart</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
