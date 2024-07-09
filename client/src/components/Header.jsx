import "../style/component_style/header.scss";
import { Link, useLocation } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { FaMoon, FaSun } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";

export default function Header() {
  const [openmenu, setOpenMenu] = useState(false);
  const handleOpenMenu = () => {
    setOpenMenu(!openmenu);
  };
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const [profileInfo, setProfileInfo] = useState(false);
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="navbar">
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
        <button className="moon_btn" onClick={() => dispatch(toggleTheme())}>
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </button>

        {currentUser ? (
          <div className="profile" onClick={() => setProfileInfo(!profileInfo)}>
            <img src={currentUser.profilePictuer} alt={currentUser.username} />
          </div>
        ) : (
          <Link to="/login">로그인</Link>
        )}

        <button className="menu-icon" onClick={handleOpenMenu}>
          <IoMenu />
        </button>
      </div>

      {profileInfo ? (
        <div className="dropdown_menu">
          <span>{currentUser.username}</span>
          <span>{currentUser.email}</span>
          <Link to="/dashboard?tab=profile">프로필</Link>
          <Link to="/">로그아웃</Link>
        </div>
      ) : (
        ""
      )}

      {openmenu && (
        <div className="dropdown_menu">
          {/* <button onClick={() => setOpenMenu(false)}>
            <IoClose />
          </button> */}
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
    </div>
  );
}
