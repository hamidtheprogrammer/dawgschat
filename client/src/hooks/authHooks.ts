import { useMutation, useQueryClient } from "react-query";
import * as apiAuth from "../apiClient/authApi";
import { toast } from "react-toast";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext, IAuthContext } from "../contexts/AuthState";
import {
  useConversationsHook,
  useSocketHook,
} from "../hooks/conversationHooks";

export const useAuthContext = (): IAuthContext => {
  const { currentUser, setCurrentUser, profileBar, setProfileBar } =
    useContext(AuthContext);
  return { currentUser, setCurrentUser, profileBar, setProfileBar };
};

const useLoginHook = () => {
  const navigate = useNavigate();
  const { mutate, isLoading, data, error } = useMutation({
    mutationFn: apiAuth.login,
    onSuccess: () => {
      toast.success("Login successful");
      navigate("/chat");
    },
    onError: (error: apiAuth.customError) => {
      console.log(error);
      toast.error("Login failed");
    },
  });

  return { mutate, isLoading, data, error };
};

const useRegisterHook = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate, isLoading, data, error } = useMutation({
    mutationFn: apiAuth.register,
    onSuccess: () => {
      toast.success("Registration successful");
      queryClient.invalidateQueries("verify-token");
      navigate("/chat");
    },
    onError: (error: apiAuth.customError) => {
      console.log(error);
      toast.error("Registration failed");
    },
  });

  return { mutate, isLoading, data, error };
};

const useLogOutHook = () => {
  const { setSocket } = useSocketHook();
  const {
    setCurrentConversation,
    setConversations,
    setSelectedConversation,
    setFriends,
    setOpenConversationBar,
  } = useConversationsHook();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutation({
    mutationFn: apiAuth.logout,
    onSuccess: () => {
      queryClient.invalidateQueries("verify-token");
      setSocket(null);
      setCurrentConversation(null);
      setConversations([]);
      setSelectedConversation(null);
      setFriends([]);
      setOpenConversationBar(false);
      navigate("/login");
    },
  });

  return { mutate, isLoading };
};

const useUpdateProfileHook = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: apiAuth.updateProfile,
    mutationKey: ["update-profile"],
    onSuccess: () => {
      toast.success("New profile saved");
      queryClient.invalidateQueries("get-profile");
    },
  });

  return { mutate, isLoading };
};

export { useLoginHook, useRegisterHook, useLogOutHook, useUpdateProfileHook };
