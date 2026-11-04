import { useStore } from "../../context/StoreContext";
import { Icons } from "../common/Icons";
import { ProductImage } from "../common/ProductImage";

export function WishlistDrawer() {
  const {
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
  } = useStore();

  if (!isWishlistOpen) return null;

  return (
    <>
      <div
        className="drawer-backdrop"
        onClick={() => setIsWishlistOpen(false)}
      />
      <aside
        className="drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Saved items"
      >
        <div className="drawer-header">
          <h3 className="drawer-title">Saved items ({wishlist.length})</h3>
          <button
            className="drawer-close-btn"
            onClick={() => setIsWishlistOpen(false)}
            aria-label="Close wishlist"
          >
            <Icons.Close size={18} />
          </button>
        </div>

        <div className="drawer-items">
          {wishlist.length === 0 ? (
            <div className="drawer-empty">
              <p className="drawer-empty-title">No saved items yet</p>
              <p className="drawer-empty-desc">
                Tap the heart on any product to save it for later.
              </p>
              <button
                className="btn-drawer-browse"
                onClick={() => setIsWishlistOpen(false)}
              >
                Browse products
              </button>
            </div>
          ) : (
            wishlist.map((item) => (
              <div className="drawer-item" key={item.id}>
                <div className="drawer-item-thumb">
                  <ProductImage
                    product={item}
                    aspectRatio="1 / 1"
                    showNameInPlaceholder={false}
                  />
                </div>
                <div className="drawer-item-content">
                  <h4 className="drawer-item-title">{item.title}</h4>
                  <span className="drawer-item-category">{item.category}</span>
                  <div className="drawer-wishlist-actions">
                    <button
                      className="btn-drawer-add"
                      onClick={() => {
                        addToCart(item, 1);
                        setIsWishlistOpen(false);
                      }}
                    >
                      <Icons.Plus size={14} />
                      Add to cart
                    </button>
                    <button
                      className="drawer-item-remove"
                      onClick={() => toggleWishlist(item)}
                      aria-label="Remove from wishlist"
                    >
                      <Icons.Trash size={14} />
                    </button>
                  </div>
                </div>
                <span className="drawer-item-price">
                  ${parseFloat(item.price).toFixed(0)}
                </span>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}

export default WishlistDrawer;
