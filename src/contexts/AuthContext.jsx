import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "../api/axios";

const AuthContext = createContext();
// const API_URL = import.meta.env.VITE_API_URL || "http://192.168.171.101:5000/api";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user from localStorage safely
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      localStorage.removeItem("user"); // Clean corrupted data
      setUser(null);
    }
    setLoading(false);
  }, []);

  // ✅ Register user
  const registerUser = async (userData) => {
    try {
      const payload = {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
      };

      const res = await axios.post(`${API_URL}/auth/register`, payload);

      if (res.data.success) {
        const user = res.data.user;
        const token = res.data.token;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setUser(user);
        toast.success("Registration successful!");
      } else {
        toast.error(res.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error(
        error?.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };

  // ✅ Login user
  const login = async ({ email, password }) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const data = res.data;

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // ✅ Logout user
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out");
  };

  return (
    <AuthContext.Provider value={{ user, register: registerUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);





















// import { createContext, useContext, useState } from "react";

// const AuthContext = createContext();

//     export const AuthProvider = ({ children }) => {
//         const [user, setUser] = useState(null);

//         const login = (userData) => setUser(userData);
//         const logout = () => setUser(null);

// //   // ✅ Check token from localStorage on page refresh
// // //   useEffect(() => {
// // //     const storedToken = localStorage.getItem("token");
// // //     const storedUser = localStorage.getItem("user");
// // //     if (storedToken && storedUser) {
// // //       setUser(JSON.parse(storedUser));
// // //     }
// // //   }, []);

// // //   const register = async (userData) => {
// // //     try {
// // //       const response = await fetch("https://instructor-api-xi.vercel.app/api/auth/register", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify(userData),
// // //       });

// // //       const data = await response.json();
// // //       if (!response.ok) throw new Error(data.message || "Registration failed");
// // //       if (!data.token) throw new Error("Token not found");

// // //       localStorage.setItem("token", data.token);
// // //       localStorage.setItem("user", JSON.stringify(data.user));
// // //       setUser(data.user);

// // //       return { success: true };
// // //     } catch (error) {
// // //       return { success: false, message: error.message };
// // //     }
// // //   };

// // //   const login = async (email: string, password: string) => {
// // //     try {
// // //       const response = await api.post("/auth/login", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify(credentials),
// // //       });

// // //       const data = await response.json();
// // //       if (!response.ok) throw new Error(data.message || "Login failed");
// // //       if (!data.token) throw new Error("Token not found");

// // //       localStorage.setItem("token", data.token);
// // //       localStorage.setItem("user", JSON.stringify(data.user));
// // //       setUser(data.user);

// // //       return { success: true };
// // //     } catch (error) {
// // //       return { success: false, message: error.message };
// // //     }
// // //   };

// // //   const logout = () => {
// // //     localStorage.removeItem("token");
// // //     localStorage.removeItem("user");
// // //     setUser(null);
// // //   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout}}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

//  export const useAuth = () => useContext(AuthContext);