import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Employee from "../component/Employee";
import AdminPage from "../component/Admin";
import { fetchUserByEmail } from "../constants/apiService";
import Navbar from "../component/Navbar";

const Home = () => {
  const [role, setRole] = useState(null); // Initially null
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  useEffect(() => {
    if (!email) {
      navigate("/"); // Redirect if no email is found
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetchUserByEmail(email);
        if (response.data && response.data.role) {
          setRole(response.data.role);
          setName(response.data.name); 
        } else {
          console.error("Invalid response: Role not found");
          navigate("/"); // Redirect if role not found
        }
      } catch (e) {
        console.error("Error fetching user data:", e);
        navigate("/"); // Redirect on fetch failure
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUser();
  }, [email, navigate]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching
  }

  return (
    <main>
      <Navbar name={name} role={role}  />
      {role === "employee" ? (
        <Employee/>
      ) : role === "admin" ? (
        <AdminPage />
      ) : (
        <div>Unauthorized Access</div> // Fallback if role is invalid
      )}
    </main>
  );
};

export default Home;
