import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
    const [open, setOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
    logout();
    navigate("/login");
    };

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-violet-500/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* ================= Logo ================= */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-violet-600 group-hover:scale-105 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="8" x="2" y="2" rx="2" />
                <rect width="20" height="8" x="2" y="14" rx="2" />
                <line x1="6" x2="6.01" y1="6" y2="6" />
                <line x1="6" x2="6.01" y1="18" y2="18" />
              </svg>
            </div>

            <span className="text-xl font-bold tracking-wide text-white">
              Pi<span className="text-pink-500">Drive</span>
              <span className="ml-1 text-xs font-mono text-violet-400">
                1TB
              </span>
            </span>
          </Link>

          {/* ================= Desktop Links ================= */}
          <div className="hidden md:flex items-center gap-8">

            <NavItem to="/" label="Files" />
            <NavItem to="/upload" label="Upload" />

           <Link
                onClick={handleLogout}
                className="
                    px-5 py-2 rounded-lg font-medium
                    bg-gradient-to-r from-pink-500 to-violet-600
                    text-white shadow-lg
                    hover:scale-[1.03]
                    transition-all
                "
                >
                Logout
            </Link>
          </div>

          {/* ================= Mobile Button ================= */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-300 hover:text-pink-500 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {open ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ================= Mobile Menu ================= */}
      {open && (
        <div className="md:hidden bg-black/95 border-t border-violet-500/20">
          <div className="flex flex-col px-6 py-4 gap-4">

            <MobileNavItem to="/" label="Files" onClick={() => setOpen(false)} />
            <MobileNavItem to="/upload" label="Upload" onClick={() => setOpen(false)} />

            <Link
                onClick={handleLogout}
                className="
                    px-5 py-2 rounded-lg font-medium
                    bg-gradient-to-r from-pink-500 to-violet-600
                    text-white shadow-lg
                    hover:scale-[1.03]
                    transition-all
                "
                >
                Logout
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

/* ================= Reusable Components ================= */

const NavItem = ({ to, label }) => (
  <Link
    to={to}
    className="relative text-gray-300 font-medium transition
               hover:text-pink-500"
  >
    {label}
    <span
      className="absolute -bottom-1 left-0 w-0 h-[2px]
                 bg-gradient-to-r from-pink-500 to-violet-600
                 transition-all duration-300 hover:w-full"
    />
  </Link>
);

const MobileNavItem = ({ to, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-gray-300 font-medium text-lg
               hover:text-pink-500 transition"
  >
    {label}
  </Link>
);

export default Navbar;
