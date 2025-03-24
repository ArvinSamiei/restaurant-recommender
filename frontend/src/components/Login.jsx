// components/Login.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import { setUser } from "../store/user-slice";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const token = await login({
        username,
        password,
      });
      dispatch(setUser(token));
      localStorage.setItem("token", token);
      navigate("/");
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-4 border rounded">
      {error && (
        <div className="bg-red-100 text-red-700 px-3 py-2 mb-4 rounded">
          {error.message}
        </div>
      )}
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <input
        type="email"
        className="w-full border mb-2 p-2"
        placeholder="Email"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
      <input
        type="password"
        className="w-full border mb-4 p-2"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Log In
      </button>
    </div>
  );
}
