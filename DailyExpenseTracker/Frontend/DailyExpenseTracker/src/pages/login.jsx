import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = '/api/expenseTracker/user';
const LOGIN_URL = `${BASE_URL}/login`;
const FORGOT_PASSWORD_URL = `${BASE_URL}/forgotPassword`;

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loggingIn, setLoggingIn] = useState(false);

  // Toast popup: { type: 'success' | 'error', message: string }
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const [showResetPopup, setShowResetPopup] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState(null);
  const [sendingReset, setSendingReset] = useState(false);

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

    if (loggingIn) return;

    const payload = {
      email: formData.email,
      password: formData.password
    };

    try {
      setLoggingIn(true);

      const response = await axios.post(LOGIN_URL, payload);

      if (response.status === 200) {
        sessionStorage.setItem("isPremium", response.data.isPremium == 1);

        // Button stays disabled until we navigate away
        showToast("success", "Login successful", () => navigate("/home"));
      } else {
        setLoggingIn(false);
      }
    } catch (err) {
      console.log(err);
      setLoggingIn(false);
      showToast(
        "error",
        err.response?.data?.message || err.message || "Login failed"
      );
    }
  };

  const sendPasswordResetLink = async () => {
    const payload = { email: resetEmail.trim() };
    try {
      setSendingReset(true);
      setResetStatus(null);

      const response = await axios.post(FORGOT_PASSWORD_URL, payload);
      if (response.status >= 200 && response.status < 300) {
        setResetStatus("success");
      } else {
        setResetStatus("failure");
      }
    } catch (err) {
      console.log(err);
      setResetStatus("failure");
    } finally {
      setSendingReset(false);
    }
  };

  // Close the popup and reset its state
  const closeResetPopup = () => {
    setShowResetPopup(false);
    setResetEmail('');
    setResetStatus(null);
    setSendingReset(false);
  };

  return (
    <div className="signup-container">
      {/* Login success / error toast (auto-hides after 2 seconds) */}
      {toast && (
        <div className={`toast ${toast.type}`} role="status">
          {toast.message}
        </div>
      )}

      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <p>Login to your account</p>

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
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loggingIn}>
          {loggingIn ? "Logging in..." : "Login"}
        </button>

        <button
          type="button"
          className="forgot-password-link"
          onClick={() => setShowResetPopup(true)}
        >
          Forgot password?
        </button>

        <p>Don't have an account?</p>
        <button
          type="button"
          onClick={() => navigate('/')}
        >
          Sign Up
        </button>
      </form>

      {/* Forgot password popup */}
      {showResetPopup && (
        <div
          className="reset-modal-overlay"
          onClick={closeResetPopup}
        >
          <div
            className="reset-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="reset-close-button"
              onClick={closeResetPopup}
              aria-label="Close"
            >
              ×
            </button>

            {resetStatus === "success" ? (
              <div className="reset-result">
                <div className="reset-icon success">✓</div>

                <h2 id="reset-modal-title">Check your inbox</h2>

                <p className="reset-description">
                  Password reset link sent successfully to{' '}
                  <strong>{resetEmail.trim()}</strong>
                </p>

                <button
                  type="button"
                  className="reset-primary-button"
                  onClick={closeResetPopup}
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="reset-icon">✉</div>

                <h2 id="reset-modal-title">Forgot password?</h2>

                <p className="reset-description">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendPasswordResetLink();
                  }}
                >
                  <label htmlFor="reset-email">Email Address</label>
                  <input
                    id="reset-email"
                    type="email"
                    placeholder="Enter your email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />

                  {resetStatus === "failure" && (
                    <div className="reset-error" role="alert">
                      Failed to send password reset link
                    </div>
                  )}

                  <button
                    type="submit"
                    className="reset-primary-button"
                    disabled={sendingReset}
                  >
                    {sendingReset ? (
                      <>
                        <span className="reset-spinner"></span>
                        Sending...
                      </>
                    ) : (
                      "Send password reset link"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;