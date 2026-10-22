import { useState } from "react";
import LandingPage from "./components/LandingPage.jsx";
import LoginForm from "./components/LoginForm.jsx";

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  return showLogin ? <LoginForm /> : <LandingPage onLogin={() => setShowLogin(true)} />;
}
