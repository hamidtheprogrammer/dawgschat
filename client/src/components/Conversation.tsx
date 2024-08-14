import React, { FormEvent, useEffect, useState } from "react";
import { useMutation } from "react-query";
import * as conversationApi from "../apiClient/conversationApi";
import {
  useConversationsHook,
  useSendMessage,
} from "../hooks/conversationHooks";
import { ICurrentConversation } from "../contexts/ConversationState";
import { useAuthContext } from "../hooks/authHooks";
import { formatDate } from "../utils/formatDate";
import EmojiPicker from "emoji-picker-react";

const Conversation: React.FC = () => {
  const [newConversation, setNewConversation] = useState<boolean>(false);
  const { currentConversation, conversations } = useConversationsHook();
  const { selectedConversation, setSelectedConversation } =
    useConversationsHook();
  const { currentUser } = useAuthContext();
  const [message, setMessage] = useState("");
  const [openEmoji, setOpenEmoji] = useState(false);
  const [refMessage, setRefMessage] = useState<{
    username: string;
    messageId: string;
  } | null>(null);

  const messageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value as string);
  };

  const { mutate, data, isLoading, isError } = useMutation({
    mutationFn: () =>
      conversationApi.getConversationById(
        currentConversation as ICurrentConversation
      ),
    mutationKey: ["getconversationbyid", currentConversation],
  });

  const { mutate: sendMessage, isLoading: isSendMessageLoading } =
    useSendMessage();

  const emojiClick = (e: any) => {
    setMessage((prev) => prev + e.emoji);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setRefMessage(null);
    if (currentConversation != null) {
      sendMessage({
        ...currentConversation,
        message,
        reference: refMessage?.messageId,
      });
      setMessage("");
    }
  };

  useEffect(() => {
    if (currentConversation != null) {
      let conversationExists;

      if (currentConversation.receiverId) {
        conversationExists = conversations.find((conversation) => {
          const participantsId = conversation.participants.map(
            (participant) => participant._id
          );

          return participantsId.every((id) =>
            [currentUser._id, currentConversation?.receiverId].includes(id)
          );
        });
      } else if (currentConversation.conversationId) {
        conversationExists = conversations.find(
          (conversation) =>
            conversation._id === currentConversation.conversationId
        );
      }

      conversationExists
        ? (mutate(), setNewConversation(false))
        : setNewConversation(true);
    }
  }, [currentConversation]);

  useEffect(() => {
    setSelectedConversation(data);
  }, [data]);

  return (
    <div className="h-[90%] flxColStart relative conversation">
      {currentConversation == null ? (
        <div>Chats will appear here</div>
      ) : isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Chat not found</p>
      ) : (
        !newConversation && (
          <ul className="flxColStart gap-1 px-[1rem] pt-3 overflow-y-auto relative w-full h-[85%] chat-container pb-5">
            {selectedConversation?.messages?.map((message) => (
              <li
                className={` relative w-fit max-w-[70%] ${
                  message?.senderId?._id === currentUser._id && "self-end"
                }`}
                key={message._id}
              >
                {selectedConversation.isGroup &&
                  message.senderId?._id !== currentUser._id && (
                    <span className="text-[0.8rem] md:text-xs ">
                      {message.senderId?.username}
                    </span>
                  )}
                <span
                  className={`relative group text-[0.8rem] md:text-xs  primaryTextCol flxColStart gap-3 px-3 py-2 rounded-xl shadow-sm shadow-black/40 transition-transform duration-500 ${
                    message?.senderId?._id === currentUser._id
                      ? " primaryBgCol whiteText rounded-br-none hover:translate-x-5"
                      : "bg-gray-100 rounded-bl-none hover:-translate-x-5"
                  }`}
                >
                  <button
                    onClick={() => {
                      setRefMessage({
                        username: message.senderId?.username as string,
                        messageId: message._id as string,
                      });
                    }}
                    className={`text-[0.8rem] md:text-xs  absolute font-bold rounded-md px-4 py-3 hidden group-hover:block ${
                      message?.senderId?._id === currentUser._id
                        ? "left-0 -translate-x-full bg-black"
                        : "right-0 translate-x-full bg-white"
                    }`}
                  >
                    reply
                  </button>
                  {message.reference && (
                    <span
                      className={`${
                        message?.senderId?._id !== currentUser._id &&
                        "bg-slate-300"
                      } flxColStart tagMessageBg rounded-xl p-1`}
                    >
                      <p className="text-[0.8rem] md:text-xs text-black/70">
                        .
                        {message.reference.senderId &&
                          message.reference.senderId.username}
                      </p>
                      <p>{message.reference.message}</p>
                    </span>
                  )}
                  <p>{message.message}</p>
                  <p
                    className={`text-[0.65rem]  ${
                      message?.senderId?._id === currentUser._id && "self-end"
                    }`}
                  >
                    {formatDate(message.createdAt as string)}
                  </p>
                </span>
              </li>
            ))}
          </ul>
        )
      )}
      {newConversation && <p>Start chat</p>}
      {currentConversation && (
        <form
          className="w-full flxBtw space-x-2 p-2 py-4 absolute bottom-4"
          onSubmit={(e) => {
            onSubmit(e);
          }}
          action="POST"
        >
          {refMessage && (
            <div className="text-[0.8rem] md:text-xs rounded-xl flxBtw gap-8 font-bold py-4 shadow-sm shadow-black whiteBg px-3 w-fit text-black absolute -translate-y-[110%]">
              <p>Replying to {refMessage.username}</p>
              <button
                type="button"
                onClick={() => {
                  setRefMessage(null);
                }}
              >
                x
              </button>
            </div>
          )}
          <input
            value={message}
            onChange={(e) => {
              messageChange(e);
            }}
            type="text"
            className="text-[0.8rem] max-sm:text-[16px] md:text-xs rounded-xl h-[2rem] whiteBg px-3 w-[86%] focus:outline-none"
            placeholder="Type a message"
          />
          <div className="absolute left-0 bottom-[3rem]">
            <EmojiPicker
              open={openEmoji}
              onEmojiClick={(e) => {
                emojiClick(e);
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setOpenEmoji((prev) => !prev);
            }}
          >
            <i className="fa-solid fa-face-smile text-xl icon-col"></i>
          </button>
          <button
            disabled={
              currentConversation == null ||
              message === "" ||
              isSendMessageLoading
            }
            type="submit"
            className="primaryBgCol whiteText rounded-[999px] w-[2rem] cursor-pointer h-[2rem] text-sm"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      )}
    </div>
  );
};

export default Conversation;
