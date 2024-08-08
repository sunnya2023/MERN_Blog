import "../style/component_style/dashboardSidebar.scss";
import {
  HiUser,
  HiArrowSmRight,
  // HiDocumentText,
  // HiOutlineUserGroup,
  // HiAnnotation,
  // HiChartPie,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { logoutSuccess } from "../redux/user/userSlice";
import { Link } from "react-router-dom";
import { IoDocumentText } from "react-icons/io5";

export default function DashSidebar({ tab }) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  // const location = useLocation()
  // const[tab, setT]
  // useEffect(()=>{
  //     const params = new URLSearchParams(location.search)
  // const tabFromUrl = params.get('tab')
  // if(tabFromUrl){

  // }
  // })

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
    <div className="dashboardSidebar">
      <Link
        to="/dashboard?tab=profile"
        className={tab === "profile" ? "list active" : "list"}
      >
        <div className="profile">
          <HiUser />
          <p>프로필</p>
        </div>
        {currentUser.isAdmin ? <div className="badge">Admin</div> : ""}
      </Link>
      <Link
        to="/dashboard?tab=posts"
        className={tab === "posts" ? "list active" : "list"}
      >
        <div className="profile">
          <IoDocumentText />
          <p>게시글</p>
        </div>
      </Link>
      <div className="list" onClick={handleLogout}>
        <div className="profile">
          <HiArrowSmRight />
          <p>로그아웃</p>
        </div>
      </div>
    </div>
  );
}
