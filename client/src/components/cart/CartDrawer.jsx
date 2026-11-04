import { useStore } from "../../context/StoreContext";
import { Icons } from "../common/Icons";
import { ProductImage } from "../common/ProductImage";

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    cartCount,
    cartSubtotal,
    cartSubtotalInr,
    cartSavings,
    updateCartQty,
    removeFromCart,
    checkoutWithYoupi,
    isCheckingOut,
  } = useStore();

  const freeShippingThreshold = 150;
  const shippingProgress = Math.min(
    100,
    Math.round((cartSubtotal / freeShippingThreshold) * 100),
  );
  const diffToFree = Math.max(0, freeShippingThreshold - cartSubtotal);

  if (!isCartOpen) return null;

  return (
    <>
      <div className="drawer-backdrop" onClick={() => setIsCartOpen(false)} />
      <aside
        className="drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="drawer-header">
          <h3 className="drawer-title">Your bag ({cartCount})</h3>
          <button
            className="drawer-close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            <Icons.Close size={18} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="drawer-shipping">
          <p className="drawer-shipping-text">
            {diffToFree === 0
              ? "You unlocked free express shipping!"
              : `Add $${diffToFree.toFixed(0)} more for free express shipping`}
          </p>
          <div className="drawer-progress-track">
            <div
              className="drawer-progress-fill"
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="drawer-items">
          {cart.length === 0 ? (
            <div className="drawer-empty">
              <p className="drawer-empty-title">Your bag is empty</p>
              <p className="drawer-empty-desc">
                Explore our curated picks and add tested essentials.
              </p>
              <button
                className="btn-drawer-browse"
                onClick={() => setIsCartOpen(false)}
              >
                Browse products
              </button>
            </div>
          ) : (
            cart.map((item) => (
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
                  <div className="drawer-item-qty">
                    <button
                      className="drawer-qty-btn"
                      onClick={() => updateCartQty(item.id, -1)}
                      aria-label="Decrease quantity"
                    >
                      <Icons.Minus size={14} />
                    </button>
                    <span className="drawer-qty-val">{item.qty}</span>
                    <button
                      className="drawer-qty-btn"
                      onClick={() => updateCartQty(item.id, 1)}
                      aria-label="Increase quantity"
                    >
                      <Icons.Plus size={14} />
                    </button>
                  </div>
                  <button
                    className="drawer-item-remove"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                  >
                    <Icons.Trash size={14} />
                    <span>Remove</span>
                  </button>
                </div>
                <span className="drawer-item-price">
                  ${(item.price * item.qty).toFixed(0)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            {cartSavings > 0 && (
              <div className="drawer-summary-row">
                <span>Editorial savings</span>
                <span className="drawer-savings-val">
                  −${cartSavings.toFixed(0)}
                </span>
              </div>
            )}
            <div className="drawer-summary-row drawer-subtotal-row">
              <span>Subtotal</span>
              <span>${cartSubtotal.toFixed(0)}</span>
            </div>
            <p className="drawer-helper-text">
              Shipping &amp; taxes calculated at checkout
            </p>
            <button
              className="btn-drawer-checkout"
              disabled={isCheckingOut}
              onClick={() => checkoutWithYoupi()}
            >
              <span>
                {isCheckingOut
                  ? "Processing…"
                  : `Checkout · $${cartSubtotal.toFixed(0)}`}
              </span>
              {!isCheckingOut && cartSubtotalInr > 0 && (
                <span className="drawer-checkout-inr">
                  ≈ ₹{cartSubtotalInr.toLocaleString("en-IN")}
                </span>
              )}
            </button>
            <button
              className="btn-drawer-continue"
              onClick={() => setIsCartOpen(false)}
            >
              Continue shopping
            </button>
            <div className="drawer-trust-line">
              <Icons.Shield size={14} />
              <span>Secure payment · No extra fees</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;
