import React, { useState } from "react";
import { IConversations, IUsers } from "../../../contexts/ConversationState";
import { getReceiverName } from "../UserCard";
import { formatDate } from "../../../utils/formatDate";
import { useAuthContext } from "../../../hooks/authHooks";
import { useKickMemberHook } from "../../../hooks/conversationHooks";
import UpdateGroupMembers from "../../UpdateGroupMembers";
import { isUser } from "./ConversationCard";

interface IProps {
  conversation: IConversations;
}

const ProfileCard: React.FC<IProps> = ({ conversation }) => {
  const { mutate, isLoading } = useKickMemberHook();
  const { currentUser } = useAuthContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleIsOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const receiver = !conversation.isGroup
    ? (getReceiverName({ conversation, getUser: true }) as IUsers)
    : conversation;
  if (conversation)
    return (
      <div className="flex flex-col items-center overflow-y-auto bg-gray-200 h-full">
        {conversation.isGroup && (
          <UpdateGroupMembers isOpen={isOpen} handleOpenChange={handleIsOpen} />
        )}
        {conversation.isGroup && (
          <button onClick={handleIsOpen} className="font-[530]">
            Add members
          </button>
        )}
        <div className="primaryBgCol h-[12rem] w-full relative ">
          {conversation.isGroup && conversation.coverImageUrl ? (
            <img
              src={conversation.coverImageUrl}
              alt=""
              className="w-full h-full aspect-square object-cover"
            />
          ) : (
            isUser(receiver) &&
            receiver.coverImageUrl && (
              <img
                src={receiver.coverImageUrl}
                alt=""
                className="w-full h-full aspect-square object-cover"
              />
            )
          )}
          <span className="absolute user-icon w-[8rem] h-[8rem] left-1/2 -translate-x-1/2 bottom-0 text-7xl translate-y-1/2 uppercase">
            {conversation.isGroup ? (
              conversation.groupName?.substring(0, 1)
            ) : isUser(receiver) && receiver.profileImageUrl ? (
              <img
                src={receiver.profileImageUrl}
                alt=""
                className="w-full h-full aspect-square object-cover"
              />
            ) : (
              isUser(receiver) && receiver.username.substring(0, 1)
            )}
          </span>
        </div>
        <div className="p-3 w-full">
          <p className="w-full pl-3 mt-[6rem] flxColStart gap-3 whiteBg text-xs py-4 rounded-lg">
            <span className="font-bold">
              {conversation.isGroup ? "Created on" : "Joined on"}
            </span>
            <span>
              {conversation.isGroup
                ? formatDate(conversation.createdAt as string)
                : isUser(receiver) && formatDate(receiver.createdAt)}
            </span>
          </p>
        </div>
        {conversation.isGroup && (
          <>
            <h1 className="font-bold text-sm px-2 mt-7">Members</h1>

            <ul className="w-full mt-5 overflow-y-scroll h-[12rem]">
              {conversation.participants.map(
                (particpant) =>
                  particpant._id !== currentUser._id && (
                    <li
                      className="px-2 border-b-[1px] py-4 cursor-pointer flxBtw group"
                      key={particpant._id}
                    >
                      <p>{particpant.username}</p>
                      {conversation?.admins?.includes(
                        currentUser._id as string
                      ) && (
                        <button
                          onClick={() => {
                            mutate({
                              conversationId: conversation._id,
                              member: particpant._id,
                            });
                          }}
                          className="bg-red-600 py-1 px-2 rounded-sm text-sm whiteText"
                        >
                          {isLoading ? "Loading..." : "kick"}
                        </button>
                      )}
                    </li>
                  )
              )}
            </ul>
          </>
        )}
      </div>
    );
};

export default ProfileCard;
