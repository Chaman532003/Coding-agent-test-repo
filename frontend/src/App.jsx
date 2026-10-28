import { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage.jsx";
import LoginForm from "./components/LoginForm.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import Header from "./components/Header.jsx";
import { fetchUserProfile, clearToken } from "./services/session.js";
import { fetchCart, addToCart, removeFromCart } from "./services/cart.js";

const PAGES = ["/", "/login", "/products", "/cart"];

function currentPage() {
  const path = window.location.pathname;
  return PAGES.includes(path) ? path : "/";
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState(currentPage());
  const [cart, setCart] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    restoreSession();
    const onPopState = () => setPage(currentPage());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function goTo(path) {
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
    setPage(path);
  }

  async function restoreSession() {
    const token = localStorage.getItem("token");
    if (!token) {
      setReady(true);
      return;
    }

    try {
      const profileData = await fetchUserProfile();
      setUser(profileData);
      const cartData = await fetchCart();
      setCart(cartData);
      if (currentPage() === "/" || currentPage() === "/login") {
        goTo("/products");
      }
    } catch (err) {
      clearToken();
    } finally {
      setReady(true);
    }
  }

  async function handleLogin(email) {
    try {
      const cartData = await fetchCart();
      setCart(cartData);
      setUser({ email });
      goTo("/products");
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  }

  async function handleAddToCart(productId) {
    try {
      const updatedCart = await addToCart(productId, 1);
      setCart(updatedCart);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  }

  async function handleRemoveFromCart(productId) {
    try {
      const updatedCart = await removeFromCart(productId);
      setCart(updatedCart);
    } catch (err) {
      console.error("Failed to remove from cart:", err);
    }
  }

  function handleLogout() {
    clearToken();
    setCart(null);
    setUser(null);
    goTo("/");
  }

  if (!ready) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    if (page === "/login") {
      return <LoginForm onLoggedIn={handleLogin} />;
    }
    if (page === "/products") {
      return (
        <>
          <Header onLogin={() => goTo("/login")} />
          <ProductsPage onAdd={() => goTo("/login")} />
        </>
      );
    }
    if (page === "/cart") {
      return (
        <>
          <Header onLogin={() => goTo("/login")} />
          <main className="cart-page">
            <p>Log in to see your cart</p>
          </main>
        </>
      );
    }
    return <LandingPage onLogin={() => goTo("/login")} />;
  }

  return (
    <>
      <Header
        cartCount={cart?.count || 0}
        onCartClick={() => goTo(page === "/cart" ? "/products" : "/cart")}
        onLogout={handleLogout}
        userEmail={user?.email}
      />
      {page === "/cart" ? (
        <CartPage cart={cart} onRemove={handleRemoveFromCart} />
      ) : (
        <ProductsPage onAdd={handleAddToCart} />
      )}
    </>
  );
}
