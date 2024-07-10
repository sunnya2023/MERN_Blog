import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const { crrunetUser } = useSelector((state) => state.user);
  return crrunetUser ? <Outlet /> : <Navigate to="/login" />;
}
