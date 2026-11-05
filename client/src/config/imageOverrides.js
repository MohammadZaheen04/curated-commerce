/**
 * Resolves product image URLs directly from database media.
 * 100% database-driven from PostgreSQL ProductMedia (cdnUrl).
 */
export function getProductImageUrl(product) {
  if (!product) return null;
  const mediaItem = product.media?.[0];
  return (
    (typeof mediaItem === "string" ? mediaItem : mediaItem?.cdnUrl) ||
    product.mediaUrl ||
    null
  );
}

/**
 * Resolves descriptive alt text for a product from the database title.
 */
export function getProductAltText(product) {
  if (!product) return "";
  return product.title || "";
}
