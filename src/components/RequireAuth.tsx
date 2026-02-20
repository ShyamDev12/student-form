import { Navigate } from "react-router-dom";

const RequireMode = ({ children }: { children: JSX.Element }) => {
  const unlocked = sessionStorage.getItem("admin_unlock");

  if (!unlocked) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireMode;