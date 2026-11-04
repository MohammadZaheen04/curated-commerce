import express, { Router } from "express";

const router = Router();

const YOUPI_API_URL = process.env.YOUPI_API_URL || "http://127.0.0.1:6100";
const YOUPI_MERCHANT_ID =
  process.env.YOUPI_MERCHANT_ID || "00000000-0000-0000-0000-000000000001";

// Conversion rate for display and UPI processing (1 USD = ₹85)
const USD_TO_INR_RATE = 85;

/**
 * POST /api/v1/checkout/youpi
 * Create a new YOUPI-PG payment session for the current cart
 */
router.post("/youpi", async (req, res) => {
  try {
    const { cart, customer, returnUrl } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart cannot be empty for checkout",
      });
    }

    // Calculate subtotal in USD
    const subtotalUsd = cart.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.qty,
      0,
    );
    // Handle direct ₹1 test item or convert USD to INR (YOUPI-PG native currency)
    const isOneRupeeTest =
      cart.length === 1 &&
      (cart[0].title?.includes("₹1") || cart[0].sku === "TEST-PAYMENT-1");
    const subtotalInr = isOneRupeeTest
      ? 1
      : Math.round(subtotalUsd * USD_TO_INR_RATE);
    const orderId = `CC-ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const customerPayload = {
      fullName: customer?.name || "Curated Shopper",
      email: customer?.email || "shopper@curatedcommerce.com",
      phoneNumber: customer?.phone || "9876543210",
    };

    const response = await fetch(`${YOUPI_API_URL}/api/v1/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Merchant-Id": YOUPI_MERCHANT_ID,
      },
      body: JSON.stringify({
        orderId,
        amount: subtotalInr.toFixed(2),
        currency: "INR",
        customer: customerPayload,
        description: `Curated Commerce Order (${cart.length} items)`,
        returnUrl: returnUrl || "http://localhost:5173/?payment=complete",
        metadata: {
          orderId,
          itemsCount: cart.length,
          subtotalUsd,
          subtotalInr,
          items: cart.map((i) => ({
            title: i.title,
            sku: i.sku,
            qty: i.qty,
            price: i.price,
          })),
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.checkoutUrl) {
      return res.status(response.status || 500).json({
        success: false,
        message:
          data.error || data.message || "Payment Gateway returned an error",
      });
    }

    let checkoutUrl = data.checkoutUrl;
    // Normalize checkoutUrl to 127.0.0.1 on macOS to avoid AirTunes port 7000 clash
    if (checkoutUrl && checkoutUrl.includes("localhost:7000")) {
      checkoutUrl = checkoutUrl.replace("localhost:7000", "127.0.0.1:7000");
    }

    res.status(200).json({
      success: true,
      data: {
        orderId,
        paymentId: data.paymentId,
        amountInr: subtotalInr,
        amountUsd: subtotalUsd,
        currency: "INR",
        checkoutUrl,
        status: data.status,
      },
    });
  } catch (error) {
    console.error("[YOUPI Checkout Error]:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to initialize payment gateway",
    });
  }
});

/**
 * GET /api/v1/checkout/session/:paymentId
 * Query payment status directly from YOUPI-PG
 */
router.get("/session/:paymentId", async (req, res) => {
  try {
    const { paymentId } = req.params;
    const response = await fetch(
      `${YOUPI_API_URL}/api/v1/payments/${paymentId}`,
    );
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: data.error || "Failed to query payment session",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to query payment session",
    });
  }
});

/**
 * POST /api/v1/checkout/youpi-webhook
 * Inbound webhook listener for YOUPI-PG real-time payment updates
 */
router.post(
  "/youpi-webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    try {
      const signature = req.headers["x-gateway-signature"];
      const event = req.headers["x-gateway-event"];
      console.log(
        `[YOUPI Webhook Received] Event: ${event}, Sig: ${signature}`,
      );

      let payload = {};
      if (Buffer.isBuffer(req.body)) {
        try {
          payload = JSON.parse(req.body.toString("utf8"));
        } catch {}
      } else if (typeof req.body === "object") {
        payload = req.body;
      }

      console.log(`[YOUPI Webhook Payload]:`, payload);

      // Acknowledge receipt to YOUPI PG webhook dispatcher
      res.status(200).json({ received: true });
    } catch (err) {
      console.error("[YOUPI Webhook Error]:", err.message);
      res.status(400).json({ error: "Webhook processing failed" });
    }
  },
);

export default router;
