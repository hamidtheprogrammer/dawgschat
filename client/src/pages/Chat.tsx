import React, { useEffect, useState } from "react";
import {
  ChatNav,
  ConversationBar,
  Conversation,
  conversationBarE,
  NewGroup,
  UserCard,
} from "../constants/Imports";
import {
  useConversationsHook,
  useUpdateSeenStatus,
} from "../hooks/conversationHooks";
import { ICurrentConversation } from "../contexts/ConversationState";
import ProfileCard from "../components/UI/usercards/ProfileCard";
import { useAuthContext } from "../hooks/authHooks";
import { useNavigate } from "react-router";

const Chat: React.FC = () => {
  const [currentConversationBar, setCurrentConversationBar] = useState<string>(
    conversationBarE.CHAT
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSideProfileBarOpen, setIsSideProfileBarOpen] =
    useState<boolean>(false);
  const { currentConversation, selectedConversation, openConversationBar } =
    useConversationsHook();
  const { currentUser } = useAuthContext();
  const handleChangeBar = (bar: string) => {
    setCurrentConversationBar(bar);
  };

  const navigate = useNavigate();
  const { mutate } = useUpdateSeenStatus(
    currentConversation as ICurrentConversation
  );

  const handleIsOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSideProfile = () => {
    setIsSideProfileBarOpen((prev) => !prev);
  };

  useEffect(() => {
    if (currentConversation != null) {
      mutate();
    }
  }, [currentConversation]);

  useEffect(() => {
    if (!currentUser.isAuthenticated) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  return (
    <div className="flxRowStart h-[100vh] whiteBg">
      <section
        className={`flxRowStart sm:max-w-[23.5rem] flex-1 max-sm:fixed max-sm:w-full inset-0 z-30 ${
          !openConversationBar && "max-sm:-translate-x-full"
        } transition-transform duration-200`}
      >
        <section className="w-[3.5rem] bg-gray-50 z-20">
          <ChatNav
            changeBar={handleChangeBar}
            currentBar={currentConversationBar}
          />
        </section>
        <section className=" flex-1 px-2 whiteBg border-r-[1px]">
          <NewGroup handleOpenChange={handleIsOpen} isOpen={isOpen} />
          <div className=" flxBtw items-center p-4 w-full">
            <h1 className="text-xl font-bold ">Conversations</h1>
            <button
              onClick={() => {
                setIsOpen(true);
              }}
              className="relative group"
            >
              <i className="fa-regular fa-square-plus text-lg"></i>
              <p className="absolute bottom-0 translate-y-full primaryBgCol px-2 py-1 shadow-lg text-xs text-nowrap z-10 rounded-md hidden group-hover:block whiteText">
                New group
              </p>
            </button>
          </div>
          <ConversationBar currentBar={currentConversationBar} />
        </section>
      </section>
      <section className="flex-1 whiteBg relative">
        {currentConversation !== null && selectedConversation ? (
          <UserCard
            styles="grayBg"
            identifier={{
              user: selectedConversation,
              handleSideProfileOpen: handleSideProfile,
            }}
          />
        ) : (
          <h1 className="text-xl font-bold p-4 w-full border-b-[1px] ">Chat</h1>
        )}
        <Conversation />
      </section>
      {selectedConversation && (
        <>
          <div
            className={`fixed h-full w-full bg-black/30 left-0 z-20 ${
              !isSideProfileBarOpen && "hidden"
            }`}
          ></div>
          <section
            className={`flex-1 max-w-[20rem] border-l-[1px] border-black/20 whiteBg w-full max-lg:fixed h-full right-0 z-30 transform-translate duration-500 ${
              !isSideProfileBarOpen && "max-lg:translate-x-full"
            }`}
          >
            <button
              onClick={() => {
                setIsSideProfileBarOpen(false);
              }}
              className="user-icon absolute z-10 top-10 left-5 h-[2.5rem] w-[2.5rem] bg-transparent border-[1px] lg:hidden"
            >
              X
            </button>
            <ProfileCard conversation={selectedConversation} />
          </section>
        </>
      )}
    </div>
  );
};

export default Chat;
