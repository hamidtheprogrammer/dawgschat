import React from "react";
import { useLogOutHook } from "../hooks/authHooks";

const LogOut: React.FC = () => {
  const { mutate, isLoading } = useLogOutHook();

  const handleLogOutClick = () => {
    mutate();
  };

  if (isLoading) {
    return <p>...</p>;
  }
  return <i onClick={handleLogOutClick} className="fa-solid fa-arrow-left"></i>;
};

export default LogOut;
