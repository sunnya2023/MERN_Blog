import "./header.scss";
import { Link, useLocation } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { FaMoon } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

export default function Header() {
  const [openmenu, setOpenMenu] = useState(false);
  const handleOpenMenu = () => {
    setOpenMenu(!openmenu);
  };
  const path = useLocation().pathname;
  return (
    <nav>
      <Link to="/" className="logo">
        <span>Sunny's</span>
        Blog
      </Link>
      <form>
        <input type="text" placeholder="Search..." />
        <button className="btn">
          <IoSearch />
        </button>
      </form>

      <button className="search_btn">
        <IoSearch />
      </button>

      <div className="link-menu">
        <Link to="/" className={path === "/" ? "active" : ""}>
          Home
        </Link>
        <Link to="/about" className={path === "/about" ? "active" : ""}>
          About
        </Link>
        <Link to="/projects" className={path === "/projects" ? "active" : ""}>
          Projects
        </Link>
      </div>

      <div className="user-menu">
        <button className="moon_btn">
          <FaMoon />
        </button>
        <Link to="/sign-in">회원가입</Link>
        {/* <Link to="/sign-in">Sign Up</Link> */}

        <button className="menu-icon" onClick={handleOpenMenu}>
          <IoMenu />
        </button>
      </div>

      {openmenu && (
        <div className="dropdown_munu">
          <button onClick={() => setOpenMenu(false)}>
            <IoClose />
          </button>
          <Link to="/" className={path === "/" ? "active" : ""}>
            Home
          </Link>
          <Link to="/about" className={path === "/about" ? "active" : ""}>
            About
          </Link>
          <Link to="/projects" className={path === "/projects" ? "active" : ""}>
            Projects
          </Link>
        </div>
      )}
    </nav>
  );
}
