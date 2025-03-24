import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { register } from "../api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await register({ username, password });
      setError("");
      setSuccess(true);

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err.response?.status === 400) {
        setError("This username is already registered.");
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-4 border rounded">
      <h1 className="text-xl font-bold mb-4">Register</h1>

      {error && (
        <div className="bg-red-100 text-red-700 px-3 py-2 mb-4 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 text-green-700 px-3 py-2 mb-4 rounded">
          Account created! Redirecting to login...
        </div>
      )}

      <input
        type="username"
        className="w-full border mb-2 p-2"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        className="w-full border mb-4 p-2"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleRegister}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Register
      </button>
    </div>
  );
}
