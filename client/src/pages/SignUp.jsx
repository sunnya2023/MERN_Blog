import { Link } from "react-router-dom";
import "./signup.scss";

export default function Signup() {
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
          <form>
            <div className="formdata">
              <label htmlFor="username">이름</label>
              <input
                id="username"
                type="text"
                placeholder="이름을 입력해 주세요"
              />
            </div>
            <div className="formdata">
              <label htmlFor="email">이메일</label>
              <input
                id="email"
                type="email"
                placeholder="이메일을 입력해주세요"
              />
            </div>
            <div className="formdata">
              <label htmlFor="password">비밀번호</label>
              <input
                id="password"
                type="password"
                placeholder="비밀번호를 입력해주세요"
              />
            </div>
            <button>회원가입</button>
          </form>

          <span>
            이미 계정이 있으신가요? <Link to="/login">로그인</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
