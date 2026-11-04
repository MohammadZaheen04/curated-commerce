import { useState } from "react";
import { UserButton, SignInButton, SignUpButton } from "@clerk/react";
import { Icons } from "../common/Icons";

export function Navbar({
  filters,
  setFilters,
  searchInputRef,
  scrollToCatalog,
  setShowGuidesModal,
  setShowCurateModal,
  setShowAddProductModal,
  setIsWishlistOpen,
  setIsCartOpen,
  wishlistCount,
  cartCount,
  user,
  logout,
  isEditorOrAdmin,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="navbar-sticky">
      <div className="container navbar-inner">
        <div className="brand-group">
          <img src=""></img>

          {/* Primary Navigation Links (Desktop) */}
          <nav className="nav-links-primary" aria-label="Main Navigation">
            <button className="nav-link-btn" onClick={scrollToCatalog}>
              Catalog
            </button>
            <button
              className="nav-link-btn"
              onClick={() => {
                setFilters((f) => ({
                  ...f,
                  onlyEditorsPick: !f.onlyEditorsPick,
                }));
                scrollToCatalog();
              }}
            >
              Editor's Picks
            </button>
            <button
              className="nav-link-btn"
              onClick={() => setShowGuidesModal(true)}
            >
              Buying Guides
            </button>
            <button
              className="nav-link-btn"
              onClick={() => setShowCurateModal(true)}
            >
              How We Curate
            </button>
          </nav>
        </div>

        {/* Desktop Search Input with ⌘K Hint */}
        <div className="search-wrapper desktop-search">
          <span className="search-icon-left">
            <Icons.Search size={15} />
          </span>
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder="Search products…"
            value={filters.q}
            onChange={(e) =>
              setFilters((f) => ({ ...f, q: e.target.value, page: 1 }))
            }
            aria-label="Search products"
          />
          {filters.q ? (
            <button
              className="search-clear-btn"
              onClick={() => setFilters((f) => ({ ...f, q: "" }))}
              aria-label="Clear search"
            >
              <Icons.Close size={12} />
            </button>
          ) : (
            <kbd className="search-kbd-hint">⌘K</kbd>
          )}
        </div>

        {/* Right Actions: Wishlist, Cart & Auth */}
        <div className="navbar-actions">
          {/* Mobile Search Toggle Button */}
          <button
            className="btn-icon-utility mobile-search-toggle"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            aria-label="Toggle search bar"
          >
            <Icons.Search size={18} strokeWidth={1.75} />
          </button>

          {isEditorOrAdmin && (
            <button
              className="btn-auth-outline desktop-only-btn"
              onClick={() => setShowAddProductModal(true)}
              title="Publish Curated Product"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Icons.Plus size={14} /> Add Product
            </button>
          )}

          {/* Wishlist Button */}
          <button
            className="btn-icon-utility"
            onClick={() => setIsWishlistOpen(true)}
            aria-label={`Open wishlist (${wishlistCount} items)`}
          >
            <Icons.Heart size={18} strokeWidth={1.75} filled={wishlistCount > 0} />
            {wishlistCount > 0 && (
              <span className="utility-badge">{wishlistCount}</span>
            )}
          </button>

          {/* Quiet Outlined Cart Button */}
          <button
            className="btn-cart-quiet"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Open cart (${cartCount} items)`}
          >
            <Icons.Bag size={18} strokeWidth={1.75} />
            <span className="cart-label-text">Cart</span>
            <span className="cart-count-badge">{cartCount}</span>
          </button>

          {/* User Auth Controls (Desktop) */}
          <div className="desktop-auth-cluster">
            {user ? (
              user.isClerk ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <UserButton />
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "13.5px", fontWeight: 600 }}>
                    {user.name?.split(" ")[0]}
                  </span>
                  <button
                    onClick={logout}
                    className="btn-auth-outline"
                    style={{ height: "32px", padding: "0 10px", fontSize: "12px" }}
                  >
                    Sign Out
                  </button>
                </div>
              )
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <SignInButton mode="modal">
                  <button className="btn-auth-outline">Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="btn-auth-primary">Sign Up</button>
                </SignUpButton>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="btn-mobile-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <Icons.Menu size={22} />
          </button>
        </div>
      </div>

      {/* Expandable Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="mobile-search-bar-wrap">
          <div className="container" style={{ padding: "8px 20px" }}>
            <div className="search-wrapper" style={{ maxWidth: "100%" }}>
              <span className="search-icon-left">
                <Icons.Search size={15} />
              </span>
              <input
                type="text"
                autoFocus
                className="search-input"
                placeholder="Search products, brands, verdicts…"
                value={filters.q}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, q: e.target.value, page: 1 }))
                }
                aria-label="Search products"
              />
              {filters.q && (
                <button
                  className="search-clear-btn"
                  onClick={() => setFilters((f) => ({ ...f, q: "" }))}
                  aria-label="Clear search"
                >
                  <Icons.Close size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="mobile-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: "16px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: "16px" }}>Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                style={{ color: "var(--text-tertiary)" }}
              >
                <Icons.Close size={18} />
              </button>
            </div>
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                paddingTop: "8px",
              }}
            >
              <button
                className="nav-link-btn"
                style={{ textAlign: "left", fontSize: "16px" }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollToCatalog();
                }}
              >
                Catalog
              </button>
              <button
                className="nav-link-btn"
                style={{ textAlign: "left", fontSize: "16px" }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setFilters((f) => ({
                    ...f,
                    onlyEditorsPick: !f.onlyEditorsPick,
                  }));
                  scrollToCatalog();
                }}
              >
                Editor's Picks
              </button>
              <button
                className="nav-link-btn"
                style={{ textAlign: "left", fontSize: "16px" }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowGuidesModal(true);
                }}
              >
                Buying Guides
              </button>
              <button
                className="nav-link-btn"
                style={{ textAlign: "left", fontSize: "16px" }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowCurateModal(true);
                }}
              >
                How We Curate
              </button>
            </nav>

            {/* Mobile Auth inside Drawer */}
            <div
              style={{
                marginTop: "auto",
                paddingTop: "24px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {user ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 600 }}>
                    Signed in as {user.name}
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="btn-auth-outline"
                    style={{ width: "100%" }}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button
                      className="btn-auth-outline"
                      style={{ width: "100%" }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button
                      className="btn-auth-primary"
                      style={{ width: "100%" }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;