import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    forenames: "",
    surname: "",
    username: "",
    email: "",
    password: "",
    dateOfBirth: "",
    country: "",
    city: "",
    isPrivate: true
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!/^[a-zA-Z0-9]{3,20}$/.test(formData.username)) {
      newErrors.username = "Username must be 3-20 characters long and contain only letters and numbers";
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
      newErrors.password = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    }

    // Date of Birth validation
    const today = new Date();
    const birthDate = new Date(formData.dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 13) {
      newErrors.dateOfBirth = "You must be at least 13 years old to sign up";
    }

    // Forename validation
    if (!/^[a-zA-Z\s]{2,50}$/.test(formData.forenames)) {
      newErrors.forenames = "Forename must be 2-50 characters long and contain only letters";
    }

    // Surname validation
    if (!/^[a-zA-Z\s]{2,50}$/.test(formData.surname)) {
      newErrors.surname = "Surname must be 2-50 characters long and contain only letters";
    }

    // Country validation (if provided)
    if (formData.country && !/^[a-zA-Z\s]{2,50}$/.test(formData.country)) {
      newErrors.country = "Country must be 2-50 characters long and contain only letters";
    }

    // City validation (if provided)
    if (formData.city && !/^[a-zA-Z\s]{2,50}$/.test(formData.city)) {
      newErrors.city = "City must be 2-50 characters long and contain only letters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting to register with:', formData);
      const response = await fetch("http://localhost:5001/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      const contentType = response.headers.get("content-type");
      console.log('Content type:', contentType);

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Registration failed");
        }
        // Save token and user data to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        window.dispatchEvent(new Event("storage")); 
        // Redirect to welcome page
        navigate("/");
      } else {
        const text = await response.text();
        console.error('Received non-JSON response:', text);
        throw new Error("Received invalid response from server");
      }
    } catch (err) {
      console.error('Registration error:', err);
      setErrors({ submit: err.message || "An error occurred during registration" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-teal-500 text-white">
      <div className="bg-gray-900 text-white p-10 rounded-2xl shadow-xl max-w-md w-full border border-gray-700">
        <h2 className="text-4xl font-bold text-center mb-6">Sign Up</h2>
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-100">
            {errors.submit}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 font-medium">Forename</label>
            <input
              type="text"
              name="forenames"
              value={formData.forenames}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.forenames ? 'border-red-500' : 'border-gray-600'} rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your forename"
              required
            />
            {errors.forenames && (
              <p className="mt-1 text-sm text-red-400">{errors.forenames}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 font-medium">Surname</label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.surname ? 'border-red-500' : 'border-gray-600'} rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your surname"
              required
            />
            {errors.surname && (
              <p className="mt-1 text-sm text-red-400">{errors.surname}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.username ? 'border-red-500' : 'border-gray-600'} rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Choose a username"
              required
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-400">{errors.username}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your email"
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.password ? 'border-red-500' : 'border-gray-600'} rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your password"
              required
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 font-medium">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-600'} rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
            {errors.dateOfBirth && (
              <p className="mt-1 text-sm text-red-400">{errors.dateOfBirth}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 font-medium">Country (Optional)</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.country ? 'border-red-500' : 'border-gray-600'} rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your country"
            />
            {errors.country && (
              <p className="mt-1 text-sm text-red-400">{errors.country}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 font-medium">City (Optional)</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.city ? 'border-red-500' : 'border-gray-600'} rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your city"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-400">{errors.city}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-500 transition duration-200 disabled:opacity-50"
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;