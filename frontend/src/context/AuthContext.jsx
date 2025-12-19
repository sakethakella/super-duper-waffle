import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const removetoken=async()=>{
    try{
      const response = await fetch("http://127.0.1:8000/api/logout",{method: "GET",credentials: "include"});
      if(response.ok){
        console.log("Logged out successfully");
      }
    }catch(error){
      console.error("Error during logout:", error);
    }
  };
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth === "true") setIsAuthenticated(true);
  }, []);

  const login = () => {
    localStorage.setItem("auth", "true");
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    removetoken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
