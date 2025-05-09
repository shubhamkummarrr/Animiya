import { useState } from "react";
import "./Navbar.css"; // We'll create this CSS file
import { NavLink } from "react-router-dom";
const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <header className="header">
                <NavLink to="/" className="logo cursor-pointer " onClick={toggleMenu}>
                    Animiya
                </NavLink>
                <i
                    className={`bx ${isMenuOpen ? "bx-x" : "bx-menu"}`}
                    id="menu-icon"
                    onClick={toggleMenu}
                ></i>
                <nav className={`navbar ${isMenuOpen ? "active" : ""}`}>
                    <NavLink to="/animehome" className="nav-link" onClick={toggleMenu}>
                        Anime
                    </NavLink>
                    <a href="/profile" >
                        Profile
                    </a>
                </nav>
            </header>
            <div className={`nav-bg ${isMenuOpen ? "active" : ""}`}></div>
        </>
    );
};

export default Navbar;