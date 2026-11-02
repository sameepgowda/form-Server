import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showResetPopup, setShowResetPopup] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState(null);
  const [sendingReset, setSendingReset] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
        email:formData.email,
        password:formData.password
    }
    try{
        const response = await axios.post("http://localhost:3000/expenseTracker/user/login",payload);
        console.log(response);
        if(response.status==200){
            sessionStorage.setItem("isPremium",(response.data.isPremium==1));
            
            sessionStorage.setItem("token",response.data.token);
            window.alert("Login Successful");
            navigate("/home");
        }
    }catch(err){
        window.alert(err.message);
        console.log(err);
    }
  };

  const sendPasswordResetLink = async () =>{
    const payload = {email : resetEmail.trim()} 
    try{
      setSendingReset(true);
      setResetStatus(null);

      const response = await axios.post("http://localhost:3000/expenseTracker/user/forgotPassword",
        payload
      );
      if(response.status >= 200 && response.status < 300){
        setResetStatus("success");
      }else{
        setResetStatus("failure");
      }
    }catch(err){
      console.log(err);
      setResetStatus("failure");
    }finally{
      setSendingReset(false);
    }
  }

  // Close the popup and reset its state
  const closeResetPopup = () => {
    setShowResetPopup(false);
    setResetEmail('');
    setResetStatus(null);
    setSendingReset(false);
  };

  return (
    <div className="signup-container">
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

        <button type="submit">Login</button>

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
