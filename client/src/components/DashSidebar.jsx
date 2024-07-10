import { useLocation } from "react-router-dom";
import "../style/component_style/dashboardSidebar.scss";
import {
  HiUser,
  HiArrowSmRight,
  // HiDocumentText,
  // HiOutlineUserGroup,
  // HiAnnotation,
  // HiChartPie,
} from "react-icons/hi";
// import { useEffect } from 'react';

export default function DashSidebar({ tab }) {
  // const location = useLocation()
  // const[tab, setT]
  // useEffect(()=>{
  //     const params = new URLSearchParams(location.search)
  // const tabFromUrl = params.get('tab')
  // if(tabFromUrl){

  // }
  // })

  return (
    <div className="dashboardSidebar">
      <div className={tab === "profile" ? "list active" : "list"}>
        <HiUser />
        <p>프로필</p>
      </div>
      <div className="list">
        <HiArrowSmRight />
        <p>로그아웃</p>
      </div>
    </div>
  );
}
