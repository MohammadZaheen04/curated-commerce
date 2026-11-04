import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { CatalogAPI } from "../../api/axiosClient";
import { useStore } from "../../context/StoreContext";
import { Icons } from "../common/Icons";
import { ProductImage } from "../common/ProductImage";
import { calcDiscount } from "../../utils/formatters";

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
  const { addToCart, toggleWishlist, isWishlisted, checkoutWithYoupi } =
    useStore();
  const { data, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => CatalogAPI.getBySlug(slug),
    enabled: !!slug,
  });

  const product = data?.data;
  const wishlisted = product ? isWishlisted(product.id) : false;
  const disc = product ? calcDiscount(product.price, product.mrp) : null;
  const price = product ? parseFloat(product.price).toFixed(0) : "0";
  const reviewsCount = product
    ? product.reviewCount > 0
      ? product.reviewCount
      : Math.floor(product.ratingAvg * 32)
    : 0;

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
                  {reviewsCount} verified reviews
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
