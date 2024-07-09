import { Link, useNavigate } from "react-router-dom";
import "../style/page_style/signup.scss";
import { useState } from "react";
import OAuth from "../components/OAuth";

export default function Signup() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };
  // console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        return setErrorMsg(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="signup">
      <div className="content">
        <div className="left">
          <Link to="/" className="logo">
            <span>Sunny's</span>
            Blog
          </Link>
          <p>
            내 관심사를 내 스타일대로
            <br /> 독특하고 멋진 블로그를 만들어 보세요.
          </p>
        </div>

        <div className="right">
          <form onSubmit={handleSubmit}>
            <div className="formdata">
              <label htmlFor="username">이름</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="이름을 입력해 주세요"
                onChange={handleChange}
              />
            </div>
            <div className="formdata">
              <label htmlFor="email">이메일</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="이메일을 입력해주세요"
                onChange={handleChange}
              />
            </div>
            <div className="formdata">
              <label htmlFor="password">비밀번호</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="비밀번호를 입력해주세요"
                onChange={handleChange}
              />
            </div>
            <button type="submit" disabled={loading} className="btn">
              {loading ? "로딩중" : "회원가입"}
            </button>
            <OAuth />
          </form>

          <span>
            이미 계정이 있으신가요? <Link to="/login">로그인</Link>
          </span>
          {errorMsg && <div className="error">{errorMsg}</div>}
        </div>
      </div>
    </div>
  );
}
