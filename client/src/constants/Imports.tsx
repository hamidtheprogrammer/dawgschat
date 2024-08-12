import Login from "../pages/Login";
import Register from "../pages/Register";
import Header from "../components/Header";
import Layout from "../Layout";
import Chat from "../pages/Chat";
import { customError } from "../apiClient/authApi";
import AuthState from "../contexts/AuthState";
import ConversationsState from "../contexts/ConversationState";
import ConversationBar from "../components/ConversationBar";
import ChatNav from "../components/ChatNav";
import Conversation from "../components/Conversation";
import LogOut from "../components/LogOut";
import ConversationList from "../components/ConversationList";
import UserCard from "../components/UI/UserCard";
import FriendsList from "../components/FriendsList";
import NewGroup from "../components/NewGroup";
import SocketState from "../contexts/SocketState";
import Home from "../pages/Home";
import MyProfile from "../components/MyProfile";
export {
  Login,
  Register,
  Header,
  Layout,
  customError,
  Chat,
  AuthState,
  ConversationsState,
  ConversationBar,
  ChatNav,
  Conversation,
  LogOut,
  ConversationList,
  UserCard,
  FriendsList,
  NewGroup,
  SocketState,
  Home,
  MyProfile,
};

export enum conversationBarE {
  CHAT = "chat",
  FRIENDS = "friends",
  GROUPS = "groups",
}

export interface IUsers {
  username: string;
  email: string;
  password: string;
}
