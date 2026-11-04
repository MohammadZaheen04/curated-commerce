/**
 * Extract leading brand from product title
 */
export function extractBrand(title) {
  if (!title) return "";
  return title
    .trim()
    .split(/\s+/)[0]
    .replace(/[^A-Za-z0-9_]/g, "");
}

/**
 * Calculate percentage discount between current price and MRP
 */
export function calcDiscount(price, mrp) {
  const p = parseFloat(price),
    m = parseFloat(mrp);
  if (!m || m <= p) return null;
  return Math.round((1 - p / m) * 100);
}
