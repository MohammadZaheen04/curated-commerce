import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminAPI } from "../../api/axiosClient";
import { Icons } from "../common/Icons";

export function AddProductModal({ categories, onClose }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    sku: "",
    slug: "",
    categoryId: categories[0]?.id || "",
    price: "",
    mrp: "",
    priceTier: "MID_RANGE",
    ratingAvg: 4.8,
    curatedVerdict: "",
    cdnUrl: "",
    specsJson:
      '{\n  "connectivity": "USB-C, Bluetooth",\n  "weight": "240g"\n}',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const sku = "TECH-" + slug.slice(0, 10).toUpperCase();
    setFormData((f) => ({ ...f, title, slug, sku }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let specs = {};
      try {
        specs = JSON.parse(formData.specsJson);
      } catch {
        throw new Error("Specs must be valid JSON");
      }

      await AdminAPI.createProduct({
        title: formData.title,
        sku: formData.sku,
        slug: formData.slug,
        categoryId: formData.categoryId,
        price: parseFloat(formData.price),
        mrp: parseFloat(formData.mrp || formData.price),
        priceTier: formData.priceTier,
        ratingAvg: parseFloat(formData.ratingAvg),
        curatedVerdict: formData.curatedVerdict,
        specs,
        media: [{ cdnUrl: formData.cdnUrl, isPrimary: true }],
      });

      queryClient.invalidateQueries(["catalog"]);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-dialog"
        style={{ maxWidth: "580px", padding: "32px" }}
      >
        <button
          className="btn-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <Icons.Close />
        </button>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "24px",
            marginBottom: "16px",
          }}
        >
          Publish Curated Product
        </h2>
        {error && (
          <div
            style={{
              padding: "8px 12px",
              background: "var(--rose-50)",
              color: "var(--rose-600)",
              borderRadius: "6px",
              fontSize: "13px",
              marginBottom: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <div>
            <label
              style={{
                fontSize: "12px",
                fontWeight: 600,
                display: "block",
                marginBottom: "4px",
              }}
            >
              Product Title
            </label>
            <input
              type="text"
              required
              className="search-input"
              style={{ borderRadius: "8px", padding: "0 12px" }}
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="e.g. Sony WH-1000XM5"
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                SKU
              </label>
              <input
                type="text"
                required
                className="search-input"
                style={{ borderRadius: "8px", padding: "0 12px" }}
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Category
              </label>
              <select
                className="facet-select"
                style={{ width: "100%", height: "38px" }}
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "12px",
            }}
          >
            <div>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                required
                className="search-input"
                style={{ borderRadius: "8px", padding: "0 12px" }}
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                MRP ($)
              </label>
              <input
                type="number"
                step="0.01"
                className="search-input"
                style={{ borderRadius: "8px", padding: "0 12px" }}
                value={formData.mrp}
                onChange={(e) =>
                  setFormData({ ...formData, mrp: e.target.value })
                }
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Rating (≥ 4.2)
              </label>
              <input
                type="number"
                step="0.1"
                min="4.2"
                max="5.0"
                required
                className="search-input"
                style={{ borderRadius: "8px", padding: "0 12px" }}
                value={formData.ratingAvg}
                onChange={(e) =>
                  setFormData({ ...formData, ratingAvg: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label
              style={{
                fontSize: "12px",
                fontWeight: 600,
                display: "block",
                marginBottom: "4px",
              }}
            >
              Editor's Verdict (Min 30 chars)
            </label>
            <textarea
              required
              rows={3}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid var(--slate-200)",
                fontSize: "13px",
              }}
              value={formData.curatedVerdict}
              onChange={(e) =>
                setFormData({ ...formData, curatedVerdict: e.target.value })
              }
              placeholder="Comprehensive testing confirmed exceptional acoustic precision..."
            />
          </div>

          <div>
            <label
              style={{
                fontSize: "12px",
                fontWeight: 600,
                display: "block",
                marginBottom: "4px",
              }}
            >
              Product Image CDN URL
            </label>
            <input
              type="url"
              required
              className="search-input"
              style={{ borderRadius: "8px", padding: "0 12px" }}
              value={formData.cdnUrl}
              onChange={(e) =>
                setFormData({ ...formData, cdnUrl: e.target.value })
              }
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-hero-primary"
            style={{
              width: "100%",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            {loading ? "Submitting to Catalog…" : "Publish to Catalog"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;
