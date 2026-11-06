import { useEffect } from "react";
import { useStore } from "../../context/StoreContext";
import { useAuth } from "../../context/AuthContext";
import { Icons } from "../common/Icons";

export function OrdersDrawer() {
  const { isOrdersOpen, setIsOrdersOpen, orders, fetchOrders, lastOrder } =
    useStore();
  const { user } = useAuth();

  useEffect(() => {
    if (isOrdersOpen) {
      fetchOrders(user?.email, user?.id);
    }
  }, [isOrdersOpen, user, fetchOrders]);

  if (!isOrdersOpen) return null;

  // Combine database orders with lastOrder if not yet returned in list
  const allOrders = [...orders];
  if (
    lastOrder &&
    !allOrders.some((o) => o.orderNumber === lastOrder.orderId)
  ) {
    allOrders.unshift({
      id: lastOrder.orderId,
      orderNumber: lastOrder.orderId,
      orderStatus: lastOrder.status || "CONFIRMED",
      paymentStatus: "COMPLETED",
      totalAmountUsd: lastOrder.amountUsd,
      totalAmountInr: lastOrder.amountInr,
      createdAt: new Date().toISOString(),
      items: lastOrder.items || [],
    });
  }

  return (
    <>
      <div
        className="drawer-backdrop"
        onClick={() => setIsOrdersOpen(false)}
      />
      <aside
        className="drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Order History"
      >
        <div className="drawer-header">
          <h3 className="drawer-title">Order History ({allOrders.length})</h3>
          <button
            className="drawer-close-btn"
            onClick={() => setIsOrdersOpen(false)}
            aria-label="Close orders"
          >
            <Icons.Close size={18} />
          </button>
        </div>

        <div className="drawer-items">
          {allOrders.length === 0 ? (
            <div className="drawer-empty">
              <p className="drawer-empty-title">No orders yet</p>
              <p className="drawer-empty-desc">
                When you check out with our verified bench selections, your
                orders and tracking receipts will appear here.
              </p>
              <button
                className="btn-drawer-browse"
                onClick={() => setIsOrdersOpen(false)}
              >
                Browse catalog
              </button>
            </div>
          ) : (
            allOrders.map((order) => {
              const formattedDate = new Date(
                order.createdAt,
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div
                  className="drawer-item"
                  key={order.id || order.orderNumber}
                  style={{
                    flexDirection: "column",
                    alignItems: "stretch",
                    gap: "8px",
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono, monospace)",
                        fontWeight: 600,
                        fontSize: "12px",
                        color: "var(--text-main)",
                      }}
                    >
                      {order.orderNumber}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "12px",
                        backgroundColor:
                          order.orderStatus === "CONFIRMED" ||
                          order.orderStatus === "DELIVERED"
                            ? "var(--badge-verified-bg, #ecfdf5)"
                            : "var(--surface-subtle)",
                        color:
                          order.orderStatus === "CONFIRMED" ||
                          order.orderStatus === "DELIVERED"
                            ? "var(--badge-verified-text, #059669)"
                            : "var(--text-secondary)",
                      }}
                    >
                      {order.orderStatus || "CONFIRMED"}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{formattedDate}</span>
                    <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
                      ${parseFloat(order.totalAmountUsd || 0).toFixed(0)}
                      {order.totalAmountInr && (
                        <span style={{ color: "var(--text-muted)", marginLeft: "4px" }}>
                          (₹{Number(order.totalAmountInr).toLocaleString("en-IN")})
                        </span>
                      )}
                    </span>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div
                      style={{
                        marginTop: "4px",
                        paddingTop: "6px",
                        borderTop: "1px dashed var(--border)",
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {order.items.map((it, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "2px",
                          }}
                        >
                          <span
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "200px",
                            }}
                          >
                            {it.title} × {it.quantity || it.qty || 1}
                          </span>
                          <span>
                            $
                            {(
                              parseFloat(it.price || 0) *
                              (it.quantity || it.qty || 1)
                            ).toFixed(0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
}

export default OrdersDrawer;

