import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router";
function RotaPrivada({children}) {
  const {logado} = useAuth();
  if (!logado) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
export default RotaPrivada;