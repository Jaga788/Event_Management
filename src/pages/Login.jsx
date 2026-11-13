import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const goBackTo = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      const currentUser = isSignup
        ? await signup(name, email, password)
        : await login(email, password);
      navigate(
        goBackTo !== "/" ? goBackTo
          : currentUser?.role === "admin" ? "/admin"
            : currentUser?.role === "organizer" ? "/organizer" : "/",
        { replace: true },
      );
    } catch (requestError) {
      setError(requestError.message || "Unable to authenticate. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleSubmit}>
        <div className="brand-mark big">E</div>
        <p className="eyebrow">EVENTORA · EVENT MANAGEMENT</p>
        <h2>{isSignup ? "Your next event starts here" : "Welcome back"}</h2>
        <p className="muted">{isSignup ? "Create a customer account to plan and book with confidence." : "Sign in to manage your events and bookings."}</p>

        {isSignup && (
          <input type="text" placeholder="Full name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required />
        )}
        <input type="email" placeholder="Email address" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password (at least 8 characters)" autoComplete={isSignup ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} maxLength={128} required />

        {error && <p className="error" role="alert">{error}</p>}

        <button className="btn full" type="submit">{isSignup ? "Sign Up" : "Login"}</button>

        <p className="switch">
          {isSignup ? "Already have an account?" : "New to Eventora?"}{" "}
          <button type="button" className="link-btn" onClick={() => { setIsSignup(!isSignup); setError(""); }}>
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
        {isSignup && <p className="hint">New accounts are registered as customers. Admins can assign organizer access.</p>}
      </form>
    </div>
  );
}

export default Login;
