import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = '/api/expenseTracker/user';
const CREATE_USER_URL = `${BASE_URL}/createUser`;

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [signingUp, setSigningUp] = useState(false);

  // Toast popup: { type: 'success' | 'error', message: string }
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // Show a popup for 2 seconds, then run an optional callback
  const showToast = (type, message, onDone) => {
    clearTimeout(toastTimer.current);
    setToast({ type, message });

    toastTimer.current = setTimeout(() => {
      setToast(null);
      if (onDone) onDone();
    }, 2000);
  };

  // Clear the timer if the component unmounts
  useEffect(() => {
    return () => clearTimeout(toastTimer.current);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (signingUp) return;

    const payload = {
      username: formData.name,
      email: formData.email,
      password: formData.password
    };

    try {
      setSigningUp(true);

      await axios.post(CREATE_USER_URL, payload);

      // Button stays disabled until we navigate away
      showToast("success", "Account created successfully", () => navigate("/login"));
    } catch (err) {
      console.log(err.message);
      setSigningUp(false);
      showToast(
        "error",
        err.response?.data?.message || err.message || "Signup failed"
      );
    }
  };

  return (
    <div className="signup-container">
      {/* Signup success / error toast (auto-hides after 2 seconds) */}
      {toast && (
        <div className={`toast ${toast.type}`} role="status">
          {toast.message}
        </div>
      )}

      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <p>Sign up to get started</p>

        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={8}
        />

        <button type="submit" disabled={signingUp}>
          {signingUp ? "Signing up..." : "Sign Up"}
        </button>
        <p>Already have an account?</p>
        <button
          type="button"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Signup;