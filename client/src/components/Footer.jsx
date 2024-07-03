import "./footer.scss";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <div className="footer">
      <div className="top">
        <div className="left">
          <Link to="/" className="logo">
            <span>Sunny's</span>
            Blog
          </Link>
        </div>
        <div className="right">
          <div className="menu">
            <h1>ABOUT</h1>
            <Link to="/">Sunny's Blog </Link>
          </div>
          <div className="menu">
            <h1>FOLLOW US</h1>
            <a
              href="https://github.com/sunnya2023/MERN_Blog.git"
              target="_blank"
            >
              Github
            </a>
          </div>
          <div className="menu">
            <h1>LEGAL</h1>
            <Link to="/">Privacy Policy </Link>
          </div>
        </div>
      </div>
      <div className="bottom">
        <span>© 2024 Sunny's blog</span>
        <div className="sns_icon">
          <a href="https://www.facebook.com/" target="_blank">
            <FaFacebook />
          </a>
          <a href="https://www.instagram.com/" target="_blank">
            <FaInstagram />
          </a>
          <a href="https://github.com/" target="_blank">
            <FaGithub />
          </a>
          <a href="https://x.com/" target="_blank">
            <FaXTwitter />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
