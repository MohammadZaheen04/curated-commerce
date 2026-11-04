import { Icons } from "../common/Icons";

export function OrderSuccessModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-dialog order-success-dialog"
        role="dialog"
        aria-modal="true"
      >
        <button
          className="btn-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <Icons.Close />
        </button>

        <div className="order-success-content">
          <div className="order-success-icon-badge">✓</div>
          <span className="order-pg-tag">
            ⚡ Settled via YOUPI-PG Sovereign UPI
          </span>
          <h2 className="order-success-heading">Order Verified & Confirmed!</h2>
          <p className="order-success-sub">
            Your transaction was authenticated and verified through banking
            observers. Our team is now bench-testing your selections for
            dispatch.
          </p>

          <div className="order-receipt-box">
            <div className="order-receipt-row">
              <span className="receipt-label">Order Reference</span>
              <span className="receipt-value receipt-mono">
                {order.orderId}
              </span>
            </div>
            <div className="order-receipt-row">
              <span className="receipt-label">Bank UTR / Reference</span>
              <span className="receipt-value receipt-mono">
                {order.utr || "123456789012"}
              </span>
            </div>
            <div className="order-receipt-row">
              <span className="receipt-label">Amount Paid</span>
              <span className="receipt-value receipt-price">
                ₹
                {order.amountInr?.toLocaleString("en-IN") ||
                  (order.amountUsd * 85).toLocaleString("en-IN")}{" "}
                (${parseFloat(order.amountUsd || 0).toFixed(0)})
              </span>
            </div>
            <div className="order-receipt-row">
              <span className="receipt-label">Payment Rail</span>
              <span className="receipt-value">
                Sovereign Direct-to-Bank UPI (0% Fee)
              </span>
            </div>
          </div>

          {order.items && order.items.length > 0 && (
            <div className="order-items-block">
              <h4 className="order-items-title">
                Purchased Items ({order.items.length})
              </h4>
              <div className="order-items-scroll">
                {order.items.map((it, idx) => (
                  <div className="order-item-line" key={idx}>
                    <span>
                      {it.title} × {it.qty}
                    </span>
                    <span className="item-price-tag">
                      ${(it.price * it.qty).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="order-guarantee-strip">
            <Icons.Check />
            <span>
              Backed by Curated Commerce 30-Day Benchmark Trial & Free Return
              Guarantee
            </span>
          </div>

          <button
            className="btn-hero-primary"
            style={{
              width: "100%",
              justifyContent: "center",
              marginTop: "16px",
            }}
            onClick={onClose}
          >
            Continue Browsing Catalog →
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessModal;
