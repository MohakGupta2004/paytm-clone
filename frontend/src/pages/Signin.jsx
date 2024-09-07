import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    try {
      const response = await axios.post('http://localhost:5000/api/v1/user/signin', { username, password });
      console.log(response)
      localStorage.setItem('token', response.data.token)
      navigate('/dashboard');
    } catch (error) {
      console.error('Error signing in. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Sign In</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Enter your credentials to access your account
        </p>

        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 mb-2">Username</label>
          <input
            type="text"
            name="username"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter your username"
            onChange={handleChange}
            value={formData.username}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">Password</label>
          <input
            type="password"
            name="password"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter your password"
            onChange={handleChange}
            value={formData.password}
            required
          />
        </div>

        <button onClick={handleClick} className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
          Log In
        </button>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signin;
