import "../style/component_style/dsahboardProfile.scss";
import { useSelector } from "react-redux";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="dashProfile">
      <h1>프로필</h1>
      <form>
        <img src={currentUser.profilePictuer} alt={currentUser.username} />
        <input type="text" value={currentUser.username} />
        <input type="email" value={currentUser.email} />
        <input type="password" placeholder="비밀번호" />
        <button className="edit-btn">수정하기</button>
      </form>
      <div className="deleteAccount">
        <span>탈퇴하기</span>
      </div>
    </div>
  );
}
