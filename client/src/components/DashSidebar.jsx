import "../style/component_style/dashboardSidebar.scss";
import {
  HiUser,
  HiArrowSmRight,
  // HiDocumentText,
  // HiOutlineUserGroup,
  // HiAnnotation,
  // HiChartPie,
} from "react-icons/hi";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../redux/user/userSlice";

export default function DashSidebar({ tab }) {
  const dispatch = useDispatch();
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
      <div className={tab === "profile" ? "list active" : "list"}>
        <HiUser />
        <p>프로필</p>
      </div>
      <div className="list" onClick={handleLogout}>
        <HiArrowSmRight />
        <p>로그아웃</p>
      </div>
    </div>
  );
}
