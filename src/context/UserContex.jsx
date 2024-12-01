import axios from "axios";
import PropTypes from "prop-types";
import { createContext, useState } from "react";

const BACKEND_URI=import.meta.env.BACKEND_URI || "http://localhost:3001";

export const UserContext = createContext();


const UserProvider = ({ children })=>{
    const[userDetails,setUserDetails] = useState({
        name: "",
        email: "",
        password: "",
        role: "employee"
    })

    const registerUser = async ()=>{
        try{
            const response = await axios.post(`${BACKEND_URI}/api/auth/register`,userDetails);
            return response.data;
        }catch(err){
            return err
        }
    }
    const loginUser = async ()=>{
        try{
            const response = await axios.post(`${BACKEND_URI}/api/auth/login`,userDetails);
            return response.data;
        }catch(err){
            return err
        }
    }
    const updatedUser = async (email)=>{
        try{
            const response = await axios.put(`${BACKEND_URI}/api/users/${email}`,userDetails)
            return response.data;
        }catch(err){
            return err
        }
    }
    return (
        <UserContext.Provider value={{userDetails, setUserDetails, registerUser, loginUser ,updatedUser}}>
            {children}
        </UserContext.Provider>
    )
} 


UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default UserProvider;


