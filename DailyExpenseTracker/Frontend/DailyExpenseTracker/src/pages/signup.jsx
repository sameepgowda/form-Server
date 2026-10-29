import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';





function Signup() {

    
const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
        username:formData.name,
        email:formData.email,
        password:formData.password
    }
    try{
       const response =  await axios.post("http://localhost:3000/expenseTracker/user/signup",payload);

    }catch(err){
        console.log(err.message);
    }
    
  };

  return (
    <div className="signup-container">
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

        <button type="submit">Sign Up</button>
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