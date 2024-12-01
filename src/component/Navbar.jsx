import PropTypes from "prop-types";
import { useState } from "react";
import { deleteUserByEmail } from "../constants/apiService";
import { useNavigate } from "react-router-dom";

const Navbar = ({ name, role }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const email = localStorage.getItem("email");
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await deleteUserByEmail(email);
      if (response.status === 200) {
        localStorage.removeItem("email");
        navigate("/");
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  return (
    <div className="bg-gray-800 text-white flex justify-between items-center p-4 sticky top-0 z-50">
      {/* Logo */}
      <p className="text-2xl font-semibold">MyLogo</p>

      {/* Profile icon and dropdown */}
      <div className="relative">
        <button
          className="bg-gray-700 p-2 rounded-full"
          onClick={toggleDropdown}
        >
          <i className="text-xl">👤</i> {/* Profile Icon */}
        </button>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-12 bg-white text-gray-800 p-4 rounded-lg shadow-lg w-48">
            <p className="text-sm mb-2">Name: {name}</p>
            <p className="text-sm mb-4">Role: {role}</p>
            <button
              onClick={handleLogout}
              className="bg-orange-400 text-white w-full py-2 rounded hover:bg-orange-600"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

Navbar.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
};

export default Navbar;
