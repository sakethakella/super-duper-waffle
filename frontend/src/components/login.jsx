import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [credentials, setCredentials] = useState({
      username: "",
      password: "",
    });
    const { login } = useAuth();
    const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Logging in with:", credentials);
    try{
      const response = await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(credentials)});
      let result = await response.json();
      console.log("Login successful:", result,response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } 
    }catch(error){
      console.error("Error during login:", error);
      return;
    }
    
    login();
    navigate("/");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-md
          bg-black/70 backdrop-blur-xl
          border border-violet-500/20
          rounded-2xl shadow-2xl
          p-8
        "
      >
        {/* ================= Header ================= */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">
            Pi<span className="text-pink-500">Drive</span>
          </h2>
          <p className="mt-2 text-gray-400 text-sm">
            Sign in to access your files
          </p>
        </div>

        {/* ================= Username ================= */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter username"
            className="
              w-full px-4 py-2.5 rounded-lg
              bg-black/40 text-white
              border border-gray-700
              focus:outline-none focus:ring-2
              focus:ring-pink-500/60
              focus:border-pink-500
              transition
            "
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
            required
          />
        </div>

        {/* ================= Password ================= */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            className="
              w-full px-4 py-2.5 rounded-lg
              bg-black/40 text-white
              border border-gray-700
              focus:outline-none focus:ring-2
              focus:ring-violet-500/60
              focus:border-violet-500
              transition
            "
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            required
          />
        </div>

        {/* ================= Button ================= */}
        <button
          type="submit"
          className="
            w-full py-3 rounded-lg font-semibold text-white
            bg-gradient-to-r from-pink-500 to-violet-600
            shadow-lg shadow-pink-500/30
            hover:shadow-violet-500/40
            hover:scale-[1.02]
            transition-all
          "
        >
          Sign In
        </button>

        {/* ================= Footer ================= */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Secure login powered by your Raspberry Pi
        </p>
      </form>
    </div>
  );
};

export default Login;
