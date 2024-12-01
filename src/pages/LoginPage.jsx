import { useState, useContext } from "react";
import { UserContext } from "../context/UserContex.jsx";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [toggle, setToggle] = useState(false); // Toggle between login/register
  const [forget, setForget] = useState(false); // Forget password toggle
  const { userDetails, setUserDetails, loginUser, registerUser, updateUser } =
    useContext(UserContext); // Context methods
  const navigate = useNavigate();
  const [error, setError] = useState(""); // Error state

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error

    if (forget) {
      // Handle Forget Password Logic
      if (!userDetails.email || !userDetails.password) {
        setError("Email and new password are required!");
        return;
      }
      // Call resetPassword API (implementation needed)
      // resetPassword(userDetails.email, userDetails.password);
      setForget(false); // Exit forget password mode
      updateUser(userDetails.email);
      alert("Password updated successfully! Please log in.");
      return;
    }

    if (toggle) {
      // Login Logic
      if (!userDetails.email || !userDetails.password) {
        setError("Email and password are required!");
        return;
      }
      try {
        const response = await loginUser(); // Call login function from context
        if (response) {
          localStorage.setItem("email", userDetails.email);
          navigate("/home");
        } else {
          setError("Invalid credentials! Please try again.");
        }
      } catch (err) {
        console.error("Login failed:", err);
        setError("Something went wrong during login. Please try again.");
      }
    } else {
      // Registration Logic
      if (
        !userDetails.name ||
        !userDetails.email ||
        !userDetails.password ||
        !userDetails.role
      ) {
        setError("All fields are required for registration!");
        return;
      }
      try {
        const response = await registerUser(); // Call register function from context
        if (response) {
          localStorage.setItem("email", userDetails.email);
          navigate("/home");
        } else {
          setError("Registration failed. Please try again.");
        }
      } catch (err) {
        console.error("Registration failed:", err);
        setError("Something went wrong during registration. Please try again.");
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {forget ? "Reset Password" : toggle ? "Welcome Back" : "Join Us"}
        </h1>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input (only for registration) */}
          {!toggle && !forget && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={userDetails.name || ""}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, name: e.target.value })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={userDetails.email || ""}
              onChange={(e) =>
                setUserDetails({ ...userDetails, email: e.target.value })
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              {forget ? "New Password" : "Password"}
            </label>
            <input
              type="password"
              id="password"
              value={userDetails.password || ""}
              onChange={(e) =>
                setUserDetails({ ...userDetails, password: e.target.value })
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Role Dropdown (only for registration) */}
          {!toggle && !forget && (
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <select
                id="role"
                value={userDetails.role || ""}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, role: e.target.value })
                }
                className="mt-1 block w-full cursor-pointer p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                required
              >
                <option value="" disabled>
                  Select a role
                </option>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            {forget ? "Reset Password" : toggle ? "Sign In" : "Sign Up"}
          </button>

          {/* Forget Password Option */}
          {toggle && (
            <p
              className="text-blue-600 text-sm text-center cursor-pointer"
              onClick={() => setForget(!forget)}
            >
              Forget Password?
            </p>
          )}

          {/* Toggle Between Login and Registration */}
          <p className="text-sm text-center">
            {forget
              ? "Remembered your password?"
              : toggle
              ? "New here?"
              : "Already have an account?"}{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => {
                setToggle(!toggle);
                setForget(false); // Reset forget state
              }}
            >
              {forget ? "Login" : toggle ? "Sign Up" : "Sign In"}
            </span>
          </p>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
