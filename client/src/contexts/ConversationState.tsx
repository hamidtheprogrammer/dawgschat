import React, { ReactNode, createContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { getConversations, getUsers } from "../apiClient/conversationApi";

interface IProps {
  children: ReactNode;
}

export interface message {
  createdAt?: string;
  _id?: string;
  message: string;
  senderId?: { _id: string; username: string };
  seenBy?: string[];
  reference?: { message: string; senderId: IUsers };
}

export interface IConversations {
  _id: string;
  messages: message[];
  lastMessage: message;
  groupName?: string;
  participants: { _id: string; username: string }[];
  profileImageUrl?: string;
  coverImageUrl?: string;
  isGroup: boolean;
  createdAt?: string;
  admins?: string;
}

export interface IUsers {
  _id: string;
  username: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  createdAt: string;
}

export interface ICurrentConversation {
  receiverId?: string;
  conversationId?: string;
}

export interface IConversationsContext {
  conversations: IConversations[];
  setConversations: (conversations: IConversations[]) => void;
  currentConversation: ICurrentConversation | null;
  setCurrentConversation: (conversation: ICurrentConversation | null) => void;
  friends: IUsers[];
  setFriends: (friends: IUsers[]) => void;
  selectedConversation: IConversations | null;
  setSelectedConversation: (selectedConversation: any) => void;
  openConversationBar: boolean;
  setOpenConversationBar: (openBar: boolean) => void;
}

const defaultConversationsContext: IConversationsContext = {
  conversations: [],
  setConversations: () => {},
  currentConversation: null,
  setCurrentConversation: () => {},
  friends: [],
  setFriends: () => {},
  selectedConversation: null,
  setSelectedConversation: () => {},
  openConversationBar: true,
  setOpenConversationBar: () => {},
};

export const ConversationsContext = createContext<IConversationsContext>(
  defaultConversationsContext
);

const ConversationsState: React.FC<IProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const [conversations, setConversations] = useState<IConversations[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<ICurrentConversation | null>(null);
  const [selectedConversation, setSelectedConversation] =
    useState<IConversations | null>(null);
  const [friends, setFriends] = useState<IUsers[]>([]);
  const [openConversationBar, setOpenConversationBar] = useState<boolean>(true);

  const { data } = useQuery({
    queryFn: getConversations,
    queryKey: ["get-conversations"],
  });

  const { data: friendsData } = useQuery({
    queryFn: getUsers,
    queryKey: ["get-users"],
  });

  useEffect(() => {
    friendsData && setFriends(friendsData);
  }, [friendsData]);

  useEffect(() => {
    data && setConversations(data);
  }, [data]);

  useEffect(() => {
    queryClient.invalidateQueries("getconversationbyid");
  }, [currentConversation]);

  return (
    <ConversationsContext.Provider
      value={{
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
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
};

export default ConversationsState;
