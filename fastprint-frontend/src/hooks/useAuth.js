import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuth = () => {
  const { user, token, signup, login, logout } = useContext(AuthContext);
  return { user, token, signup, login, logout };
};

export default useAuth;
