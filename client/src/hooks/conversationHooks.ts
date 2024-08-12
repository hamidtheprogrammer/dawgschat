import { useContext } from "react";
import {
  ConversationsContext,
  IConversationsContext,
  ICurrentConversation,
} from "../contexts/ConversationState";
import { useMutation, useQueryClient } from "react-query";
import {
  addMember,
  createGroup,
  kickMember,
  sendMessage,
  updateConversationSeenStatus,
} from "../apiClient/conversationApi";
import { toast } from "react-toast";
import { SocketContext } from "../contexts/SocketState";
import { Socket } from "socket.io-client";

export const useConversationsHook = (): IConversationsContext => {
  const {
    conversations,
    setConversations,
    currentConversation,
    setCurrentConversation,
    friends,
    setFriends,
    selectedConversation,
    setSelectedConversation,
    openConversationBar,
    setOpenConversationBar,
  } = useContext(ConversationsContext);

  return {
    conversations,
    setConversations,
    currentConversation,
    setCurrentConversation,
    friends,
    setFriends,
    selectedConversation,
    setSelectedConversation,
    openConversationBar,
    setOpenConversationBar,
  };
};

export const useSocketHook = () => {
  const { socket } = useContext(SocketContext);
  return { socket };
};

export const useSendMessage = () => {
  const { socket } = useSocketHook();
  const {
    setSelectedConversation,
    selectedConversation,
    currentConversation,
    conversations,
  } = useConversationsHook();
  const queryClient = useQueryClient();
  const { mutate, isLoading, isError } = useMutation({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      queryClient.invalidateQueries("getconversationbyid");

      setSelectedConversation((prev: any) => ({
        ...prev,
        messages: [...prev.messages, data],
      }));

      conversations.map((conversation) => {
        return conversation._id === selectedConversation?._id
          ? { ...conversation, lastMessage: data }
          : conversation;
      });

      (socket as Socket).emit("send-message", {
        receiverId:
          currentConversation?.receiverId ||
          currentConversation?.conversationId,
        content: data,
      });
    },
  });

  return { mutate, isLoading, isError };
};

export const useUpdateSeenStatus = (data: ICurrentConversation) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () => updateConversationSeenStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries("get-conversations");
    },
  });

  return { mutate };
};

export const useCreateGroupHook = () => {
  const { setCurrentConversation } = useConversationsHook();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: createGroup,
    onSuccess: (data) => {
      queryClient.invalidateQueries("get-conversations");

      toast.success("Group Created");
      setCurrentConversation({ conversationId: data._id });
    },
    onError: () => {
      toast.error("Failed to create group");
    },
  });

  return { mutate, isLoading };
};

export const useAddMemberHook = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: addMember,
    onSuccess: () => {
      queryClient.invalidateQueries("get-conversations");
      toast.success("Member(s) Added");
    },
    onError: () => {
      toast.error("Failed to Add member(s)");
    },
  });

  return { mutate, isLoading };
};

export const useKickMemberHook = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: kickMember,
    onSuccess: () => {
      queryClient.invalidateQueries("get-conversations");
      toast.success("Member Kicked");
    },
    onError: () => {
      toast.error("Failed to kick member");
    },
  });

  return { mutate, isLoading };
};
