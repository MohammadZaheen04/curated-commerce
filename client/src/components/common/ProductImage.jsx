import { useState } from "react";
import { Icons } from "./Icons";
import { getProductImageUrl, getProductAltText } from "../../config/imageOverrides";
import { extractBrand } from "../../utils/formatters";

function getCategoryPlaceholderIcon(catSlug) {
  switch (catSlug) {
    case "audio":
      return <Icons.Headphones size={28} strokeWidth={1.5} />;
    case "computing":
      return <Icons.Laptop size={28} strokeWidth={1.5} />;
    case "wearables":
      return <Icons.Watch size={28} strokeWidth={1.5} />;
    case "accessories":
      return <Icons.Zap size={28} strokeWidth={1.5} />;
    case "cameras":
      return <Icons.Camera size={28} strokeWidth={1.5} />;
    case "smarthome":
      return <Icons.Home size={28} strokeWidth={1.5} />;
    case "gaming":
      return <Icons.Gamepad size={28} strokeWidth={1.5} />;
    case "specialty-coffee":
      return <Icons.Coffee size={28} strokeWidth={1.5} />;
    case "everyday-carry":
      return <Icons.Tag size={28} strokeWidth={1.5} />;
    default:
      return <Icons.PlaceholderImage size={28} strokeWidth={1.5} />;
  }
}

export function ProductImage({
  product,
  aspectRatio = "4 / 3",
  objectFit = "cover",
  priority = false,
  className = "",
  showNameInPlaceholder = true,
  alt,
}) {
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  const resolvedUrl = getProductImageUrl(product);
  const brand = extractBrand(product.title);
  const categorySlug =
    product.category?.slug ||
    (typeof product.category === "string" ? product.category.toLowerCase() : "");

  const hasValidImage = resolvedUrl && !imgError;
  const effectiveAlt = alt !== undefined ? alt : getProductAltText(product);

  return (
    <div
      className={`product-image-container ${className}`}
      style={{
        width: "100%",
        height: "100%",
        aspectRatio: aspectRatio !== "unset" ? aspectRatio : undefined,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--surface-muted)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {hasValidImage ? (
        <img
          src={resolvedUrl}
          alt={effectiveAlt}
          loading={priority ? "eager" : "lazy"}
          onError={() => setImgError(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: objectFit,
            display: "block",
          }}
        />
      ) : (
        <div
          className="product-image-placeholder-panel"
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            textAlign: "center",
            gap: "8px",
            backgroundColor: "var(--surface-subtle)",
            border: "1px dashed var(--border)",
            borderRadius: "inherit",
            color: "var(--text-secondary)",
          }}
        >
          <div style={{ color: "var(--accent)" }}>
            {getCategoryPlaceholderIcon(categorySlug)}
          </div>
          {showNameInPlaceholder && (
            <div style={{ minWidth: 0, maxWidth: "100%" }}>
              <span
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--text-main)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {product.title}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  marginTop: "2px",
                }}
              >
                {product.category?.name || brand || "Curated Pick"}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductImage;

