/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { CheckoutAPI } from "../api/axiosClient";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  // Cart state persisted in localStorage
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("curated_cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state persisted in localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem("curated_wishlist");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [lastOrder, setLastOrder] = useState(() => {
    try {
      const stored = localStorage.getItem("curated_last_order");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [showOrderSuccessModal, setShowOrderSuccessModal] = useState(false);

  const clearCart = useCallback(() => setCart([]), []);

  const fetchOrders = useCallback(async (email, userId) => {
    try {
      const res = await CheckoutAPI.getOrders({ email, userId });
      if (res?.data) {
        setOrders(res.data);
      }
    } catch (e) {
      console.warn("Failed to fetch user orders:", e.message);
    }
  }, []);

  useEffect(() => {
    try {
      if (lastOrder) {
        localStorage.setItem("curated_last_order", JSON.stringify(lastOrder));
      }
    } catch {
      // ignore storage errors
    }
  }, [lastOrder]);

  useEffect(() => {
    try {
      localStorage.setItem("curated_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("curated_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist to localStorage", e);
    }
  }, [wishlist]);

  // Global listener for YOUPI PG DOM CustomEvents
  useEffect(() => {
    const handleYoupiSuccess = (e) => {
      const detail = e.detail || {};
      console.log(
        "⚡ [YOUPI PG] Received youpi:payment:success event:",
        detail,
      );
      setLastOrder((prev) => ({
        ...(prev || {}),
        orderId: detail.order_id || prev?.orderId || "CC-ORD-CONFIRMED",
        utr:
          detail.utr ||
          detail.bankRef ||
          "UPI-" + Date.now().toString().slice(-8),
        status: "CONFIRMED",
      }));
      clearCart();
      setIsCartOpen(false);
      setShowOrderSuccessModal(true);
      setIsCheckingOut(false);
    };

    window.addEventListener("youpi:payment:success", handleYoupiSuccess);
    return () =>
      window.removeEventListener("youpi:payment:success", handleYoupiSuccess);
  }, [clearCart]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item,
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          sku: product.sku,
          title: product.title,
          price: parseFloat(product.price),
          mrp: parseFloat(product.mrp || product.price),
          mediaUrl: product.media?.[0]?.cdnUrl || "",
          category: product.category?.name || "",
          qty,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateCartQty = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean),
    );
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [
        ...prev,
        {
          id: product.id,
          sku: product.sku,
          title: product.title,
          slug: product.slug,
          price: parseFloat(product.price),
          mrp: parseFloat(product.mrp || product.price),
          ratingAvg: product.ratingAvg,
          curatedVerdict: product.curatedVerdict,
          mediaUrl: product.media?.[0]?.cdnUrl || "",
          category: product.category?.name || "",
        },
      ];
    });
  };

  const isWishlisted = (productId) =>
    wishlist.some((item) => item.id === productId);

  // Derived totals
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartSubtotal = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  const cartOriginalTotal = cart.reduce(
    (acc, item) => acc + (item.mrp || item.price) * item.qty,
    0,
  );
  const cartSavings = Math.max(0, cartOriginalTotal - cartSubtotal);
  const isOneRupeeCart =
    cart.length === 1 &&
    (cart[0]?.title?.includes("₹1") || cart[0]?.sku === "TEST-PAYMENT-1");
  const cartSubtotalInr = isOneRupeeCart ? 1 : Math.round(cartSubtotal * 85);

  /**
   * Initiate Checkout with YOUPI-PG
   */
  const checkoutWithYoupi = async (customer = {}) => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);

    try {
      const response = await CheckoutAPI.createYoupiSession({
        cart,
        customer,
      });

      const session = response.data;
      if (!session) {
        throw new Error("Failed to create order session");
      }

      // If running on production without local gateway or sandbox mode, complete directly
      if (session.isSandbox || !session.checkoutUrl || session.status === "CONFIRMED") {
        setLastOrder({
          orderId: session.orderId,
          paymentId: session.paymentId,
          amountInr: session.amountInr,
          amountUsd: session.amountUsd,
          items: [...cart],
          status: "CONFIRMED",
          isSandbox: !!session.isSandbox,
        });
        clearCart();
        setIsCartOpen(false);
        setShowOrderSuccessModal(true);
        setIsCheckingOut(false);
        return;
      }

      setLastOrder({
        orderId: session.orderId,
        paymentId: session.paymentId,
        amountInr: session.amountInr,
        amountUsd: session.amountUsd,
        items: [...cart],
        status: "PENDING",
      });

      // Programmatic invocation of YOUPI PG universal SDK
      if (
        typeof window !== "undefined" &&
        window.Youpi &&
        typeof window.Youpi.pay === "function"
      ) {
        window.Youpi.pay({
          checkoutUrl: session.checkoutUrl,
          order_id: session.orderId,
          amount: session.amountInr,
          currency: "INR",
          name: "Curated Commerce",
          description: `Checkout for ${cartCount} curated items`,
          customer: {
            name: customer.name || "Curated Shopper",
            email: customer.email || "shopper@curatedcommerce.com",
            phone: customer.phone || "9876543210",
          },
          handler: async (result) => {
            console.log("⚡ [YOUPI PG Callback] Success result:", result);
            const utr =
              result.utr ||
              result.bankRef ||
              "UPI-" + Date.now().toString().slice(-8);

            try {
              await CheckoutAPI.confirmOrder({
                orderId: result.order_id || session.orderId,
                utr,
                paymentId: session.paymentId,
              });
            } catch (e) {
              console.warn("Order confirmation notice:", e.message);
            }

            setLastOrder((prev) => ({
              ...(prev || {}),
              orderId: result.order_id || session.orderId,
              utr,
              status: "CONFIRMED",
            }));
            clearCart();
            setIsCartOpen(false);
            setShowOrderSuccessModal(true);
            setIsCheckingOut(false);
          },
          onClose: () => {
            console.log("[YOUPI PG] Customer closed checkout modal");
            setIsCheckingOut(false);
          },
          onFailed: (err) => {
            alert(
              "Payment was not completed: " +
                (err.reason || err.error || "Declined"),
            );
            setIsCheckingOut(false);
          },
        });
      } else {
        // Fallback if script loading was delayed: open direct hosted portal
        window.open(
          session.checkoutUrl,
          "_blank",
          "width=520,height=750,toolbar=no,menubar=no",
        );
        setIsCheckingOut(false);
      }
    } catch (err) {
      console.error("Checkout failed:", err);
      alert(
        "Unable to complete checkout: " + (err.message || "Server error"),
      );
      setIsCheckingOut(false);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        cartSubtotalInr,
        cartSavings,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        wishlist,
        wishlistCount: wishlist.length,
        isWishlistOpen,
        setIsWishlistOpen,
        isOrdersOpen,
        setIsOrdersOpen,
        orders,
        fetchOrders,
        toggleWishlist,
        isWishlisted,
        checkoutWithYoupi,
        isCheckingOut,
        lastOrder,
        showOrderSuccessModal,
        setShowOrderSuccessModal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
