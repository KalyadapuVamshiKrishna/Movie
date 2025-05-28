import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png"; // Import the logo image

function Navbar() {
  const [isTransparent, setIsTransparent] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsTransparent(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar${isTransparent ? " transparent" : ""}`}>
      <div >
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
      </div>
      <div className="navbar-brand">
        <Link to="/" className="navbar-links">Movies</Link>
        <Link to="/favorites" className="navbar-links">Favorites</Link>
      </div>
    </nav>
  );
}

export default Navbar;