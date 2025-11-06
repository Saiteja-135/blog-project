import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const EnvelopeIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  );

  const LockIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
  );

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      alert("Account not found. Please register.");
      return;
    }
    if (user.password !== password) {
      alert("Invalid credentials. Check your password.");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    navigate("/navbar");
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-br from-sky-100 to-sky-300 pt-20 sm:pt-16">
      <div className="flex bg-sky-100 rounded-2xl shadow-lg overflow-hidden w-[90%] max-w-5xl h-auto sm:h-[80vh] flex-col sm:flex-row">
        <div className="w-full sm:w-1/2 flex flex-col justify-center p-8">
          <h2 className="text-2xl font-semibold mb-6">Welcome Back</h2>
          <div className="mb-1"><h3>please enter your details</h3></div>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="relative">
              <div className="absolute right-3 top-3 text-gray-400">
                <EnvelopeIcon />
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 pr-10 rounded-md border"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute right-3 top-3 text-gray-400">
                <LockIcon />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pr-10 rounded-md border"
                required
              />
            </div>

            <button type="submit" className="w-full bg-blue-800 text-white py-3 rounded-md hover:bg-blue-900">
              Login
            </button>
          </form>

          <p className="text-blue-800 text-sm mt-3 cursor-pointer hover:underline text-center sm:text-left" onClick={() => navigate("/register")}>
            Don't have an account? Register
          </p>
        </div>

        {/* Right panel: image fills the panel area */}
        <div className="hidden sm:block sm:w-1/2 bg-gradient-to-br from-sky-200 to-sky-400">
          <img src={"/public/loginpageimage.png"} alt="login" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default Login;