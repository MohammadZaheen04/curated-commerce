import { Icons } from "../common/Icons";

function getCategoryIcon(slug) {
  switch (slug) {
    case "audio":
      return <Icons.Headphones size={22} />;
    case "computing":
      return <Icons.Laptop size={22} />;
    case "wearables":
      return <Icons.Watch size={22} />;
    case "accessories":
      return <Icons.Zap size={22} />;
    case "cameras":
      return <Icons.Camera size={22} />;
    case "smarthome":
      return <Icons.Home size={22} />;
    case "gaming":
      return <Icons.Gamepad size={22} />;
    case "specialty-coffee":
      return <Icons.Coffee size={22} />;
    case "everyday-carry":
      return <Icons.Tag size={22} />;
    default:
      return <Icons.Award size={22} />;
  }
}

export function CategoryBrowseSection({
  categories,
  categoryCounts = {},
  onSelectCategory,
}) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="browse-category-section" aria-label="Browse by Category">
      <div className="container">
        <div className="section-header-centered">
          <div className="section-pill-tag">
            <span>Categories</span>
          </div>
          <h2 className="section-title-editorial">Browse by category</h2>
          <p className="section-subtitle-editorial">
            Explore independently audited essentials across curated hardware disciplines.
          </p>
        </div>

        <div className="category-cards-grid">
          {categories.map((cat) => {
            const count = categoryCounts[cat.slug] ?? cat._count?.products ?? 0;
            return (
              <button
                key={cat.id || cat.slug}
                className="category-card"
                onClick={() => onSelectCategory(cat.slug)}
                aria-label={`Browse ${cat.name} (${count} products)`}
              >
                <div className="category-card-icon-wrap">
                  {getCategoryIcon(cat.slug)}
                </div>
                <div className="category-card-text">
                  <h3 className="category-card-name">{cat.name}</h3>
                  <span className="category-card-count">
                    {count} {count === 1 ? "product" : "products"}
                  </span>
                </div>
                <div className="category-card-arrow">
                  <Icons.ArrowRight size={14} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CategoryBrowseSection;

