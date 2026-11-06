import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CatalogAPI } from "./api/axiosClient";
import { useAuth } from "./context/AuthContext";
import { useStore } from "./context/StoreContext";
import { calcDiscount } from "./utils/formatters";
import { Icons } from "./components/common/Icons";

// Layout & Home Components
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { EditorialHero } from "./components/home/EditorialHero";
import { HowWeTestSection } from "./components/home/HowWeTestSection";
import { EditorsPicksSection } from "./components/home/EditorsPicksSection";
import { BuyingGuidesTeaser } from "./components/home/BuyingGuidesTeaser";

// Product Catalog Components
import { FilterBar } from "./components/product/FilterBar";
import { ProductGrid } from "./components/product/ProductGrid";
import { ProductDetailModal } from "./components/product/ProductDetailModal";

// Cart, Wishlist & Orders Drawers
import { CartDrawer } from "./components/cart/CartDrawer";
import { WishlistDrawer } from "./components/cart/WishlistDrawer";
import { OrdersDrawer } from "./components/cart/OrdersDrawer";

// Modals
import { HowWeCurateModal } from "./components/modals/HowWeCurateModal";
import { BuyingGuidesModal } from "./components/modals/BuyingGuidesModal";
import { AuthModal } from "./components/modals/AuthModal";
import { AddProductModal } from "./components/modals/AddProductModal";
import { OrderSuccessModal } from "./components/modals/OrderSuccessModal";
import fallbackCatalog from "./config/fallbackData.json";

import "./App.css";

export default function App() {
  const { user, logout, isEditorOrAdmin } = useAuth();
  const {
    cartCount,
    cartSubtotal,
    setIsCartOpen,
    wishlistCount,
    setIsWishlistOpen,
    setIsOrdersOpen,
    showOrderSuccessModal,
    setShowOrderSuccessModal,
    lastOrder,
  } = useStore();

  const searchInputRef = useRef(null);

  // Filter & Search states
  const [filters, setFilters] = useState({
    category: null,
    priceRange: "ALL",
    ratingTier: "ANY",
    onlyEditorsPick: false,
    onlyOnSale: false,
    sort: "rating",
    q: "",
    page: 1,
  });

  // Pagination in Collection: start with 12 products
  const [visibleCount, setVisibleCount] = useState(12);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const [selectedQuickViewSlug, setSelectedQuickViewSlug] = useState(null);
  const [showCurateModal, setShowCurateModal] = useState(false);
  const [showGuidesModal, setShowGuidesModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // Keyboard shortcut listener: Cmd+K or / focuses search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (
        e.key === "/" &&
        document.activeElement !== searchInputRef.current &&
        document.activeElement?.tagName !== "INPUT"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Back-to-top visibility listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 800);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset pagination whenever any filter criteria changes
  const updateFilters = (updater) => {
    setVisibleCount(12);
    setFilters(updater);
  };

  // Compute price query parameters for backend
  const priceParams = useMemo(() => {
    switch (filters.priceRange) {
      case "UNDER_100":
        return { maxPrice: 100 };
      case "100_300":
        return { maxPrice: 300 };
      default:
        return {};
    }
  }, [filters.priceRange]);

  const apiParams = {
    minRating: filters.onlyEditorsPick ? 4.8 : 4.2,
    sort: filters.sort === "discount" ? "rating" : filters.sort,
    page: 1,
    limit: 60,
    ...(filters.category && { category: filters.category }),
    ...(filters.q && { q: filters.q }),
    ...priceParams,
  };

  const { data: catalogData, isLoading } = useQuery({
    queryKey: ["catalog", apiParams],
    queryFn: () => CatalogAPI.getFeed(apiParams),
  });

  const { data: catData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CatalogAPI.getCategories(),
    staleTime: 5 * 60 * 1000,
  });

  // Filter out internal test products, falling back to static catalog if backend is unreachable
  const rawProducts = useMemo(() => {
    const list =
      catalogData?.data && catalogData.data.length > 0
        ? catalogData.data
        : fallbackCatalog.data;
    return list.filter(
      (p) =>
        p.sku !== "TEST-PAYMENT-1" &&
        p.slug !== "payment-test-product-1-rupee" &&
        !p.title.toLowerCase().includes("test product"),
    );
  }, [catalogData]);

  const categories = useMemo(() => {
    if (catData?.data && catData.data.length > 0) return catData.data;
    const catMap = new Map();
    for (const p of fallbackCatalog.data) {
      if (p.category && !catMap.has(p.category.slug)) {
        catMap.set(p.category.slug, {
          id: p.categoryId,
          name: p.category.name,
          slug: p.category.slug,
        });
      }
    }
    return Array.from(catMap.values());
  }, [catData]);

  // Compute live category counts from the exact dataset
  const categoryCounts = useMemo(() => {
    const counts = {};
    for (const p of rawProducts) {
      const slug = p.category?.slug;
      if (slug) counts[slug] = (counts[slug] || 0) + 1;
    }
    return counts;
  }, [rawProducts]);

  // Spotlight product: Sony WH-1000XM5 in Hero
  const spotlightProduct = useMemo(() => {
    if (!rawProducts || rawProducts.length === 0) return null;
    return rawProducts.find((p) => p.slug === "sony-wh-1000xm5") || rawProducts[0];
  }, [rawProducts]);

  // Editor's picks IDs for carousel
  const editorsPicksList = useMemo(() => {
    return rawProducts.filter((p) => p.ratingAvg >= 4.8);
  }, [rawProducts]);

  // Client-side facet filtering with de-duplication
  const products = useMemo(() => {
    let list = [...rawProducts];

    // De-duplicate: If user is not explicitly viewing only editors picks or filtering,
    // exclude the Spotlight product and Carousel picks from the main grid
    if (!filters.onlyEditorsPick && !filters.category && !filters.q) {
      const carouselIds = new Set(editorsPicksList.map((p) => p.id));
      if (spotlightProduct) carouselIds.add(spotlightProduct.id);
      list = list.filter((p) => !carouselIds.has(p.id));
    }

    // Price filter
    if (filters.priceRange === "UNDER_100") {
      list = list.filter((p) => parseFloat(p.price) < 100);
    } else if (filters.priceRange === "100_300") {
      list = list.filter(
        (p) => parseFloat(p.price) >= 100 && parseFloat(p.price) <= 300,
      );
    } else if (filters.priceRange === "300_PLUS") {
      list = list.filter((p) => parseFloat(p.price) > 300);
    }

    // Rating filter (4.5+ or 4.7+)
    if (filters.ratingTier === "4.5") {
      list = list.filter((p) => p.ratingAvg >= 4.5);
    } else if (filters.ratingTier === "4.7") {
      list = list.filter((p) => p.ratingAvg >= 4.7);
    }

    // Editor's picks toggle
    if (filters.onlyEditorsPick) {
      list = list.filter((p) => p.ratingAvg >= 4.8);
    }

    // On sale toggle (at least 10% discount)
    if (filters.onlyOnSale) {
      list = list.filter((p) => {
        const disc = calcDiscount(p.price, p.mrp);
        return disc && disc >= 10;
      });
    }

    // Sorting
    if (filters.sort === "discount") {
      list.sort(
        (a, b) =>
          (calcDiscount(b.price, b.mrp) || 0) -
          (calcDiscount(a.price, a.mrp) || 0),
      );
    } else if (filters.sort === "price_asc") {
      list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (filters.sort === "price_desc") {
      list.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (filters.sort === "rating") {
      list.sort((a, b) => b.ratingAvg - a.ratingAvg);
    }

    return list;
  }, [
    rawProducts,
    filters.priceRange,
    filters.ratingTier,
    filters.onlyEditorsPick,
    filters.onlyOnSale,
    filters.sort,
    filters.category,
    filters.q,
    editorsPicksList,
    spotlightProduct,
  ]);

  const resetAllFilters = () => {
    updateFilters({
      category: null,
      priceRange: "ALL",
      ratingTier: "ANY",
      onlyEditorsPick: false,
      onlyOnSale: false,
      sort: "rating",
      q: "",
      page: 1,
    });
  };

  const scrollToCatalog = () => {
    const el = document.getElementById("collection");
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  };

  const handleViewAllEditorsPicks = () => {
    updateFilters((f) => ({
      ...f,
      onlyEditorsPick: true,
      category: null,
      page: 1,
    }));
    scrollToCatalog();
  };

  return (
    <div className="app">
      {/* 1. Light, Calm Navbar */}
      <Navbar
        filters={filters}
        setFilters={updateFilters}
        searchInputRef={searchInputRef}
        scrollToCatalog={scrollToCatalog}
        setShowGuidesModal={setShowGuidesModal}
        setShowCurateModal={setShowCurateModal}
        setShowAddProductModal={setShowAddProductModal}
        setIsWishlistOpen={setIsWishlistOpen}
        setIsOrdersOpen={setIsOrdersOpen}
        setIsCartOpen={setIsCartOpen}
        wishlistCount={wishlistCount}
        cartCount={cartCount}
        cartSubtotal={cartSubtotal}
        user={user}
        logout={logout}
        isEditorOrAdmin={isEditorOrAdmin}
      />

      {/* 2. Editorial Hero Section */}
      <EditorialHero
        spotlightProduct={spotlightProduct}
        scrollToCatalog={scrollToCatalog}
        setShowCurateModal={setShowCurateModal}
      />

      {/* 3. How We Test Section (3-Step Strip) */}
      <HowWeTestSection
        productsCount={rawProducts.length}
        onOpenManifesto={() => setShowCurateModal(true)}
      />

      {/* 4. Editor's Picks Carousel Row */}
      <EditorsPicksSection
        products={rawProducts}
        onQuickView={(prod) => setSelectedQuickViewSlug(prod.slug)}
        onViewAll={handleViewAllEditorsPicks}
      />

      {/* 5. Collection Section (Section Heading & Description -> Sticky Filters -> Grid) */}
      <section className="collection-section" id="collection">
        {/* Section Heading & Description */}
        <div className="container collection-heading-block">
          <h2 className="catalog-title">Tested &amp; Curated Collection</h2>
          <p className="catalog-subtitle">
            Every product independently bench-tested and verified against strict
            build, efficiency, and real-world durability benchmarks.
          </p>
        </div>

        {/* Sticky Filter Bar (Chips + Control Bar) */}
        <FilterBar
          categories={categories}
          filters={filters}
          setFilters={updateFilters}
          totalCount={rawProducts.length}
          filteredCount={products.length}
          resetAllFilters={resetAllFilters}
          categoryCounts={categoryCounts}
        />

        {/* Product Grid with 12-item Pagination & Empty State */}
        <ProductGrid
          products={products}
          visibleCount={visibleCount}
          onLoadMore={() => setVisibleCount((prev) => prev + 12)}
          isLoading={isLoading}
          resetAllFilters={resetAllFilters}
          onQuickView={(prod) => setSelectedQuickViewSlug(prod.slug)}
        />
      </section>

      {/* 7. Buying Guides Teaser */}
      <BuyingGuidesTeaser onOpenGuides={() => setShowGuidesModal(true)} />

      {/* 8. Softened 4-Column Footer */}
      <Footer
        setFilters={setFilters}
        scrollToCatalog={scrollToCatalog}
        setShowCurateModal={setShowCurateModal}
        setShowGuidesModal={setShowGuidesModal}
      />

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          className="btn-back-to-top"
          onClick={() => {
            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
          }}
          aria-label="Back to top of page"
        >
          <Icons.ArrowUp size={18} />
        </button>
      )}

      {/* Modals & Drawers */}
      <CartDrawer />
      <WishlistDrawer />
      <OrdersDrawer />

      {selectedQuickViewSlug && (
        <ProductDetailModal
          slug={selectedQuickViewSlug}
          onClose={() => setSelectedQuickViewSlug(null)}
        />
      )}

      {showCurateModal && (
        <HowWeCurateModal onClose={() => setShowCurateModal(false)} />
      )}

      {showGuidesModal && (
        <BuyingGuidesModal onClose={() => setShowGuidesModal(false)} />
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {showAddProductModal && (
        <AddProductModal
          categories={categories}
          onClose={() => setShowAddProductModal(false)}
        />
      )}

      {showOrderSuccessModal && (
        <OrderSuccessModal
          order={lastOrder}
          onClose={() => setShowOrderSuccessModal(false)}
        />
      )}
    </div>
  );
}
