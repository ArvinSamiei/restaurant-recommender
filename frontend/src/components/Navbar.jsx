import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center mb-6">
      <Link to="/" className="text-xl font-bold text-blue-600">
        🍽️ Bain Eats
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/" className="text-gray-700 hover:text-blue-600">
          Home
        </Link>
        {token ? (
          <>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-500 cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">
              Login
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
