// src/LoginSignup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import logo from './assets/logo.png';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState(''); // Used for both login and signup
  const [email, setEmail] = useState(''); // Only used during signup
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = isLogin
      ? { username: username, password: password } // Adjusted for login
      : { username: username, email: email, password: password }; // Adjusted for signup

    console.log('Submitting:', payload);

    try {
      const response = await axios.post(
        isLogin 
          ? 'https://finance-tracking-system.onrender.com/auth/login' 
          : 'https://finance-tracking-system.onrender.com/auth/register',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        setSuccessMessage('Login successful!');
        setErrorMessage('');
      } else if (response.status === 201) {
        setSuccessMessage('Account created successfully!');
        setErrorMessage('');
      } else {
        console.log('Unexpected status code:', response.status);
      }
    } catch (error) {
      if (error.response) {
        console.log('Error response:', error.response.data);
        // Display the error messages received from the server
        setErrorMessage(Object.values(error.response.data).flat().join(', ') || 'An error occurred');
      } else {
        console.log('Network or other error:', error);
        setErrorMessage('Network error. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center h-screen justify-between">
      <div className="ml-32 mb-16 flex-shrink-0 p-4 flex flex-col items-center">
        <img src={logo} alt="Logo" className="h-32" /> {/* Adjust height as needed */}
        <p className="mt-4 text-xl">Your Journey to Financial Freedom Starts Here</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md w-96 mr-64">
        <h2 className="text-3xl font-bold mb-4 text-center">{isLogin ? 'Log In' : 'Sign Up'}</h2>
        <div className="mt-4">
          <button className="text-blue-500 hover:underline mb-4 text-center w-full" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Are you new to Finance Tracker? Sign Up" : "Already have an account? Log In"}
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        
        {successMessage && <p className="mt-4 text-green-500 text-center">{successMessage}</p>}
        {errorMessage && <p className="mt-4 text-red-500 text-center">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default LoginSignup;
