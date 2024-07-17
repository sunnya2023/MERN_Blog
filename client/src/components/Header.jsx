import "../style/component_style/header.scss";
import { Link, useLocation } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { FaMoon, FaSun } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { logoutSuccess } from "../redux/user/userSlice";

export default function Header() {
  const [openmenu, setOpenMenu] = useState(false);
  // const handleOpenMenu = () => {
  //   setOpenMenu(!openmenu);
  // };
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const [profileMenu, setProfileMenu] = useState(false);
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/user/logout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(logoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

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
          <div className="profile" onClick={() => setProfileMenu(!profileMenu)}>
            <img src={currentUser.profilePicture} alt={currentUser.username} />
          </div>
        ) : (
          <Link to="/login">로그인</Link>
        )}

        <button className="menu-icon" onClick={() => setOpenMenu(!openmenu)}>
          <IoMenu />
        </button>
      </div>

      {currentUser && profileMenu ? (
        <div className="dropdown_menu" onClick={() => setProfileMenu(false)}>
          <button className="close-btn">
            <IoClose />
          </button>
          <span>{currentUser.username}</span>
          <span>{currentUser.email}</span>
          <Link to="/dashboard?tab=profile">프로필</Link>
          <Link to="/" onClick={handleLogout}>
            로그아웃
          </Link>
        </div>
      ) : (
        ""
      )}

      {openmenu && (
        <div className="dropdown_menu">
          <button onClick={() => setOpenMenu(false)} className="close-btn">
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
    </div>
  );
}
