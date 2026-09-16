import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router";
function RotaPrivada({children}) {
  const {token} = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
export default RotaPrivada;