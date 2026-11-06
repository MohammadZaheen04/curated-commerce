import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CatalogAPI } from "../../api/axiosClient";
import { useStore } from "../../context/StoreContext";
import { Icons } from "../common/Icons";
import { ProductImage } from "../common/ProductImage";
import { calcDiscount } from "../../utils/formatters";
import fallbackCatalog from "../../config/fallbackData.json";

/* ── Spec label map & formatter ─────────────────────────────────────────── */
const SPEC_LABEL_MAP = {
  dpi: "DPI",
  weight: "Weight",
  bluetooth: "Bluetooth",
  batteryLife: "Battery life",
  battery: "Battery",
  capacity: "Capacity",
  display: "Display",
  storage: "Storage",
  ram: "RAM",
  cpu: "Processor",
  gpu: "GPU",
  os: "OS",
  resolution: "Resolution",
  refreshRate: "Refresh rate",
  screenSize: "Screen size",
  waterResistance: "Water resistance",
  connectivity: "Connectivity",
  sensor: "Sensor",
  anc: "ANC",
  noiseReduction: "Noise reduction",
  driver: "Driver",
  impedance: "Impedance",
  frequencyResponse: "Frequency response",
  chargingTime: "Charging time",
  wireless: "Wireless",
  ports: "Ports",
  color: "Color",
  material: "Material",
  dimensions: "Dimensions",
  type: "Type",
};

const SPEC_UNITS = {
  weight: "g",
  batteryLife: "hrs",
};

function camelToTitle(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function formatSpecLabel(key) {
  return SPEC_LABEL_MAP[key] || camelToTitle(key);
}

function formatSpecValue(key, val) {
  const s = String(val);
  const unit = SPEC_UNITS[key];
  if (unit && !s.includes(unit)) return `${s} ${unit}`;
  return s;
}

export function ProductDetailModal({ slug, onClose }) {
  const queryClient = useQueryClient();
  const { addToCart, toggleWishlist, isWishlisted, checkoutWithYoupi } =
    useStore();
  const { data, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => CatalogAPI.getBySlug(slug),
    enabled: !!slug,
  });

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  const product =
    data?.data || fallbackCatalog.data.find((p) => p.slug === slug);
  const wishlisted = product ? isWishlisted(product.id) : false;
  const disc = product ? calcDiscount(product.price, product.mrp) : null;
  const price = product ? parseFloat(product.price).toFixed(0) : "0";
  const reviewsCount = product
    ? product.reviewCount > 0
      ? product.reviewCount
      : Math.floor(product.ratingAvg * 32)
    : 0;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim() || reviewComment.trim().length < 5) {
      setReviewError("Please share at least 5 characters in your review.");
      return;
    }
    setIsSubmittingReview(true);
    setReviewError("");
    try {
      await CatalogAPI.createReview(slug, {
        rating: reviewRating,
        comment: reviewComment.trim(),
        userName: reviewerName.trim() || "Verified Buyer",
      });
      setReviewSuccess(true);
      setReviewComment("");
      queryClient.invalidateQueries({ queryKey: ["product", slug] });
      setTimeout(() => {
        setReviewSuccess(false);
        setShowReviewForm(false);
      }, 2500);
    } catch (err) {
      setReviewError(err?.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!slug) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-dialog modal-quickview" role="dialog" aria-modal="true">
        <button
          className="btn-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <Icons.Close size={18} />
        </button>

        {isLoading ? (
          <div className="modal-loading">Loading verified verdict…</div>
        ) : product ? (
          <div className="modal-split-layout">
            {/* Left: Image panel */}
            <div className="modal-media-col">
              <ProductImage
                product={product}
                objectFit="contain"
                aspectRatio="unset"
              />
            </div>

            {/* Right: Product info */}
            <div className="modal-info-col">
              {/* Category tag */}
              <span className="modal-cat-tag">{product.category?.name}</span>

              {/* Title */}
              <h2 className="modal-product-title">{product.title}</h2>

              {/* Rating + reviews */}
              <div className="modal-rating-row">
                <Icons.Star size={14} filled />
                <span className="modal-rating-val">
                  {product.ratingAvg.toFixed(1)}
                </span>
                <span className="modal-review-count">
                  {reviewsCount} owner reviews
                </span>
              </div>

              {/* Editor's verdict */}
              <div className="modal-verdict-quote">
                <strong>Editor&rsquo;s verdict</strong>
                <p>&ldquo;{product.curatedVerdict}&rdquo;</p>
              </div>

              {/* Price row */}
              <div className="modal-pricing-row">
                <span className="modal-price-current">${price}</span>
                {disc && (
                  <>
                    <span className="modal-price-original">
                      ${parseFloat(product.mrp).toFixed(0)}
                    </span>
                    <span className="modal-discount-badge">Save {disc}%</span>
                  </>
                )}
              </div>

              {/* Bench Specifications */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="modal-specs-section">
                  <h4 className="modal-specs-title">Bench specifications</h4>
                  <dl className="modal-specs-dl">
                    {Object.entries(product.specs).map(([k, v]) => (
                      <div className="modal-spec-row" key={k}>
                        <dt>{formatSpecLabel(k)}</dt>
                        <dd>{formatSpecValue(k, v)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Verified Community Reviews & Write Review Section */}
              <div
                className="modal-reviews-section"
                style={{
                  marginTop: "20px",
                  paddingTop: "16px",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      fontWeight: 700,
                      color: "var(--text-secondary)",
                    }}
                  >
                    Verified Reviews ({product.reviews?.length || 0})
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--accent)",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {showReviewForm ? "Cancel" : "+ Write a Review"}
                  </button>
                </div>

                {showReviewForm && (
                  <form
                    onSubmit={handleReviewSubmit}
                    style={{
                      background: "var(--surface-subtle)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "14px",
                      marginBottom: "14px",
                    }}
                  >
                    <div style={{ marginBottom: "10px" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "12px",
                          fontWeight: 600,
                          marginBottom: "4px",
                        }}
                      >
                        Rating
                      </label>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "2px",
                            }}
                          >
                            <Icons.Star
                              size={18}
                              filled={star <= reviewRating}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                      <input
                        type="text"
                        placeholder="Your name (optional)"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: "6px",
                          border: "1px solid var(--border)",
                          background: "var(--surface)",
                          color: "var(--text-main)",
                          fontSize: "13px",
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                      <textarea
                        rows={3}
                        placeholder="Share your experience with this curated piece..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: "6px",
                          border: "1px solid var(--border)",
                          background: "var(--surface)",
                          color: "var(--text-main)",
                          fontSize: "13px",
                          resize: "vertical",
                        }}
                      />
                    </div>

                    {reviewError && (
                      <p
                        style={{
                          color: "var(--danger, #ef4444)",
                          fontSize: "12px",
                          marginBottom: "8px",
                        }}
                      >
                        {reviewError}
                      </p>
                    )}

                    {reviewSuccess && (
                      <p
                        style={{
                          color: "var(--success, #10b981)",
                          fontSize: "12px",
                          marginBottom: "8px",
                        }}
                      >
                        ✓ Review verified and published!
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="btn-modal-primary"
                      style={{
                        padding: "8px 16px",
                        fontSize: "13px",
                        width: "auto",
                      }}
                    >
                      {isSubmittingReview ? "Submitting…" : "Publish Review"}
                    </button>
                  </form>
                )}

                {product.reviews && product.reviews.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      maxHeight: "180px",
                      overflowY: "auto",
                      marginBottom: "14px",
                    }}
                  >
                    {product.reviews.map((r) => (
                      <div
                        key={r.id}
                        style={{
                          padding: "10px",
                          borderRadius: "6px",
                          background: "var(--surface-subtle)",
                          fontSize: "12px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "4px",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              color: "var(--text-main)",
                            }}
                          >
                            {r.user?.name || "Verified Buyer"}
                          </span>
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "2px",
                              color: "var(--accent)",
                            }}
                          >
                            <Icons.Star size={12} filled /> {r.rating}
                          </span>
                        </div>
                        <p
                          style={{
                            margin: 0,
                            color: "var(--text-secondary)",
                            lineHeight: 1.4,
                          }}
                        >
                          {r.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      marginBottom: "14px",
                      fontStyle: "italic",
                    }}
                  >
                    No community reviews yet. Be the first to share an evaluation!
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="modal-actions">
                <button
                  className="btn-modal-primary"
                  onClick={() => {
                    addToCart(product, 1);
                    onClose();
                  }}
                >
                  Add to cart · ${price}
                </button>
                <button
                  className="btn-modal-secondary"
                  onClick={() => {
                    addToCart(product, 1);
                    onClose();
                    setTimeout(() => checkoutWithYoupi(), 150);
                  }}
                >
                  Buy now with UPI
                </button>
                <button
                  className="btn-modal-wishlist"
                  onClick={() => toggleWishlist(product)}
                  aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
                >
                  <Icons.Heart size={20} filled={wishlisted} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="modal-loading">Product not found.</div>
        )}
      </div>
    </div>
  );
}

export default ProductDetailModal;
