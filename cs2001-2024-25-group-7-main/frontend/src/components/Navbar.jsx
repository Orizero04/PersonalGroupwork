import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import {
  UserCircleIcon,
  ChevronDownIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  function getInitials(forename = "", surname = "") {
    const firstInitial = forename.trim().charAt(0).toUpperCase();
    const secondInitial = surname.trim().charAt(0).toUpperCase();
    return firstInitial + secondInitial;
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };
  
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Resources", path: "/resources" },
    { name: "Fitness", path: "/fitness" },
    { name: "Support", path: "/support" },
    { name: "Contact Us", path: "/contact" },
  ];

  const isActiveLink = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsDropdownOpen(false);
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  return (
    <>
      <header className="bg-heroBg text-white py-4 px-4 fixed top-0 left-0 right-0 z-10 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/mentalhealthlogo.png" alt="Mental Health Logo" className="w-12 h-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${isActiveLink(link.path) ? "text-primary" : ""
                  } hover:text-primary transition-colors duration-200`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* User Info / Login & Sign Up Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative inline-block text-left">
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 text-white transition-colors focus:outline-none"
                >
                  <UserCircleIcon className="w-6 h-6" />
                  <span className="text-sm">
                    {user.forenames} {user.surname}
                  </span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg z-50 py-2">
                    {/* User Info Header */}
                    <div className="flex items-center px-4 py-3 border-b">
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                        {getInitials(user.forenames, user.surname)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800">
                          {user.forenames} {user.surname}
                        </span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <UserIcon className="w-4 h-4 mr-2" />
                      Account
                    </Link>


                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={handleToggle}
            className="block md:hidden focus:outline-none"
            aria-label="Toggle menu"
          >
            <HiOutlineMenuAlt3 size={24} />
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <nav className="bg-heroBg md:hidden mt-2 px-4 py-4 rounded-md">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-2 text-white hover:text-primary transition-colors duration-200 ${isActiveLink(link.path) ? "text-primary" : ""
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/signup"
              className="block py-2 text-white bg-primary mt-2 text-center rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="block py-2 text-white bg-primary mt-2 text-center rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          </nav>
        )}
      </header>
    </>
  );
};

export default Navbar;
