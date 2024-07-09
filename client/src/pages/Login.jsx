import { Link, useNavigate } from "react-router-dom";
import "../style/page_style/signup.scss";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function Login() {
  const [formData, setFormData] = useState({});
  // const [loading, setLoading] = useState(false);
  // const [errorMsg, setErrorMsg] = useState(null);
  const { loading, error: errorMsg } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };
  // console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(loginStart());
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        // setLoading(false);
        return dispatch(loginFailure(data.message));
      }
      if (res.ok) {
        dispatch(loginSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(loginFailure(error.message));
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
              {loading ? "로딩중" : "로그인"}
            </button>
            <OAuth />
          </form>

          <span>
            아직 회원이 아니세요? <Link to="/sign-up">회원가입</Link>
          </span>
          {errorMsg && <div className="error">{errorMsg}</div>}
        </div>
      </div>
    </div>
  );
}
