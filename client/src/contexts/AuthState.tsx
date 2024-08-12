import React, { ReactNode, useEffect, useState } from "react";
import { createContext } from "react";
import { useQuery } from "react-query";
import * as authApi from "../apiClient/authApi";

interface props {
  children: ReactNode;
}

export interface IUser {
  _id: string | null;
  username: string | null;
  isAuthenticated: boolean | null;
}

export interface IAuthContext {
  currentUser: IUser;
  setCurrentUser: (currentUser: IUser) => void;
  profileBar: boolean;
  setProfileBar: (profileBar: boolean) => void;
}

const defaultAuthContext: IAuthContext = {
  currentUser: { _id: null, username: null, isAuthenticated: null },
  setCurrentUser: () => {},
  profileBar: false,
  setProfileBar: () => {},
};

export const AuthContext = createContext(defaultAuthContext);

const AuthState: React.FC<props> = ({ children }) => {
  const [profileBar, setProfileBar] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<IUser>({
    _id: null,
    username: null,
    isAuthenticated: null,
  });

  const { data, isError } = useQuery({
    queryFn: authApi.verifyToken,
    queryKey: ["validate-token"],
    retry: false,
  });

  useEffect(() => {
    setCurrentUser((prev) => ({ ...prev, isAuthenticated: !isError }));
  }, [isError]);

  useEffect(() => {
    currentUser.isAuthenticated &&
      setCurrentUser((prev) => ({
        ...prev,
        _id: data._id,
        username: data.username,
      }));
  }, [data]);

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, profileBar, setProfileBar }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
