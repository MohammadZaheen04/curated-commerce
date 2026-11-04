/**
 * Product Image Overrides & Descriptive Alt Text Configuration
 * Sets verified, high-resolution product photography for catalog items
 * and provides descriptive, WCAG-compliant alt text.
 */
export const ENABLE_IMAGE_OVERRIDES = true;

export const IMAGE_OVERRIDES = {
  // 1. Fellow Stagg EKG kettle (matte black electric pour-over gooseneck kettle)
  "fellow-stagg-ekg": "https://images.unsplash.com/photo-1592417766326-088bf3da80c5?w=800&auto=format&fit=crop&q=80",
  "cmw0a5mnz0007avlzor3wdpqf": "https://images.unsplash.com/photo-1592417766326-088bf3da80c5?w=800&auto=format&fit=crop&q=80",

  // 2. WD_BLACK SN850X SSD (Western Digital NVMe PCIe M.2 SSD)
  "wd-black-sn850x-2tb": "https://images.unsplash.com/photo-1686705562930-4f3e46f620d8?w=800&auto=format&fit=crop&q=80",
  "cmw0brnfw001nqzib2lik8s5i": "https://images.unsplash.com/photo-1686705562930-4f3e46f620d8?w=800&auto=format&fit=crop&q=80",

  // 3. Logitech MX Master 3S (Logitech wireless ergonomic mouse with MagSpeed wheel)
  "logitech-mx-master-3s": "https://images.unsplash.com/photo-1623371748986-9a829391f7c9?w=800&auto=format&fit=crop&q=80",
  "cmw0bgahr0007qzibudzgiszh": "https://images.unsplash.com/photo-1623371748986-9a829391f7c9?w=800&auto=format&fit=crop&q=80",

  // 4. Apple AirPods Pro 2 (in-ear earbuds with silicone tips and charging case)
  "apple-airpods-pro-2": "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&auto=format&fit=crop&q=80",
  "cmw0bg5uy0001qzibfmyw1hfi": "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&auto=format&fit=crop&q=80",

  // 5. Apple AirTag (AirTag tracking disc with stainless steel Apple logo)
  "apple-airtag-4-pack": "https://images.unsplash.com/photo-1620787259628-39a4d9937bac?w=800&auto=format&fit=crop&q=80",
  "cmw0bsknj0025qzibs8kwodgd": "https://images.unsplash.com/photo-1620787259628-39a4d9937bac?w=800&auto=format&fit=crop&q=80",

  // 6. Logitech MX Keys S (Logitech MX series illuminated wireless keyboard, graphite)
  "logitech-mx-keys-s": "https://images.unsplash.com/photo-1623371748986-9a829391f7c9?w=800&auto=format&fit=crop&q=80",
  "cmw0bricg001eqzibv5ef80h6": "https://images.unsplash.com/photo-1623371748986-9a829391f7c9?w=800&auto=format&fit=crop&q=80",

  // 7. Valve Steam Deck OLED (Steam Deck OLED handheld gaming PC console)
  "valve-steam-deck-oled-512gb": "https://images.unsplash.com/photo-1665608130535-d9a71bce53b9?w=800&auto=format&fit=crop&q=80",
  "cmw0bswp4002qqziblka406jq": "https://images.unsplash.com/photo-1665608130535-d9a71bce53b9?w=800&auto=format&fit=crop&q=80",

  // 8. Anker 735 charger (Anker compact multi-port fast wall charger)
  "anker-735-nano-ii-65w": "https://images.unsplash.com/photo-1596877445530-ad74838754c6?w=800&auto=format&fit=crop&q=80",
  "cmw0bsiza0022qzib29h7e0h6": "https://images.unsplash.com/photo-1596877445530-ad74838754c6?w=800&auto=format&fit=crop&q=80",

  // 9. Samsung T7 Shield SSD (Samsung rugged rubberized portable external SSD)
  "samsung-t7-shield-2tb": "https://images.unsplash.com/photo-1721333084639-0f64b0583875?w=800&auto=format&fit=crop&q=80",
  "cmw0bgdzi000dqzibemkt8gir": "https://images.unsplash.com/photo-1721333084639-0f64b0583875?w=800&auto=format&fit=crop&q=80",

  // 10. Elgato Stream Deck MK.2 (Elgato Stream Deck controller with LCD studio keys)
  "elgato-stream-deck-mk2": "https://upload.wikimedia.org/wikipedia/commons/6/67/Elgato_Stream_Deck_%2B.jpg",
  "cmw0brso1001wqzibko9tuz3r": "https://upload.wikimedia.org/wikipedia/commons/6/67/Elgato_Stream_Deck_%2B.jpg",
};

export const PRODUCT_ALT_TEXT = {
  "fellow-stagg-ekg": "Fellow Stagg EKG electric kettle, matte black with precision gooseneck spout",
  "wd-black-sn850x-2tb": "Western Digital WD_BLACK NVMe PCIe M.2 solid-state drive",
  "logitech-mx-master-3s": "Logitech MX Master 3S wireless ergonomic mouse with MagSpeed scroll wheel",
  "sony-wh-1000xm5": "Sony WH-1000XM5 wireless noise-canceling headphones, matte black finish",
  "nintendo-switch-oled": "Nintendo Switch OLED Model handheld gaming console with Joy-Con controllers",
  "apple-airpods-pro-2": "Apple AirPods Pro 2 wireless in-ear earbuds with silicone tips and charging case",
  "apple-airtag-4-pack": "Apple AirTag tracking disc with stainless steel and white finish",
  "logitech-mx-keys-s": "Logitech MX Keys S advanced wireless keyboard, graphite finish",
  "valve-steam-deck-oled-512gb": "Valve Steam Deck OLED handheld gaming PC console with 7.4-inch display",
  "anker-735-nano-ii-65w": "Anker 735 GaN fast wall charger with multi-port power delivery",
  "samsung-t7-shield-2tb": "Samsung T7 Shield 2TB rugged portable external SSD, drop-resistant rubber finish",
  "elgato-stream-deck-mk2": "Elgato Stream Deck controller with 15 customizable LCD studio keys",
};

/**
 * Resolves the effective image URL for a product, honoring overrides
 */
export function getProductImageUrl(product) {
  if (!product) return null;
  const mediaItem = product.media?.[0];
  const originalUrl =
    (typeof mediaItem === "string" ? mediaItem : mediaItem?.cdnUrl) ||
    product.mediaUrl;
  if (!ENABLE_IMAGE_OVERRIDES) return originalUrl;

  const override = IMAGE_OVERRIDES[product.slug] || IMAGE_OVERRIDES[product.id];
  if (override && typeof override === "string" && override !== "placeholder") {
    return override;
  }
  return originalUrl;
}

/**
 * Resolves descriptive, WCAG-compliant alt text for a product
 */
export function getProductAltText(product) {
  if (!product) return "";
  return PRODUCT_ALT_TEXT[product.slug] || PRODUCT_ALT_TEXT[product.id] || product.title;
}
