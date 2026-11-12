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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const result = isSignup ? signup(name, email, password) : login(email, password);
    if (result.success) navigate(goBackTo, { replace: true });
    else setError(result.message);
  };

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleSubmit}>
        <div className="brand-mark big">E</div>
        <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>
        <p className="muted">{isSignup ? "Join Eventora to book your events." : "Login to manage your bookings."}</p>

        {isSignup && (
          <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
        )}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && <p className="error">{error}</p>}

        <button className="btn full" type="submit">{isSignup ? "Sign Up" : "Login"}</button>

        <p className="switch">
          {isSignup ? "Already have an account?" : "New to Eventora?"}{" "}
          <button type="button" className="link-btn" onClick={() => { setIsSignup(!isSignup); setError(""); }}>
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;
