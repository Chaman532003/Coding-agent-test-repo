import { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage.jsx";
import LoginForm from "./components/LoginForm.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import Header from "./components/Header.jsx";
import { fetchUserProfile, clearToken } from "./services/session.js";
import { fetchCart, addToCart, removeFromCart } from "./services/cart.js";

export default function App() {
  const [appState, setAppState] = useState("loading");
  const [showLogin, setShowLogin] = useState(false);
  const [cart, setCart] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    const token = localStorage.getItem("token");
    if (!token) {
      setAppState("landing");
      return;
    }

    try {
      const profileData = await fetchUserProfile();
      setUser(profileData);
      const cartData = await fetchCart();
      setCart(cartData);
      setAppState("products");
    } catch (err) {
      clearToken();
      setAppState("landing");
    }
  }

  async function handleLogin(email) {
    try {
      const cartData = await fetchCart();
      setCart(cartData);
      setShowLogin(false);
      setAppState("products");
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
    setShowCart(false);
    setShowLogin(false);
    setAppState("landing");
  }

  if (appState === "loading") {
    return <div className="loading">Loading...</div>;
  }

  if (appState === "landing") {
    return showLogin ? (
      <LoginForm onLoggedIn={handleLogin} />
    ) : (
      <LandingPage onLogin={() => setShowLogin(true)} />
    );
  }

  if (appState === "products") {
    return (
      <>
        <Header
          cartCount={cart?.count || 0}
          onCartClick={() => setShowCart(!showCart)}
          onLogout={handleLogout}
          userEmail={user?.email}
        />
        {showCart ? (
          <CartPage cart={cart} onRemove={handleRemoveFromCart} />
        ) : (
          <ProductsPage onAdd={handleAddToCart} />
        )}
      </>
    );
  }
}
