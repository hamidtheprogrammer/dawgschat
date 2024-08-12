import React, { useEffect, useState } from "react";
import {
  useAddMemberHook,
  useConversationsHook,
} from "../hooks/conversationHooks";

interface Props {
  isOpen: boolean;
  handleOpenChange: () => void;
}

const UpdateGroupMembers: React.FC<Props> = ({ isOpen, handleOpenChange }) => {
  const { friends, selectedConversation } = useConversationsHook();
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [newGroupName, setNewGroupName] = useState(
    selectedConversation?.groupName
  );
  const { mutate, isLoading } = useAddMemberHook();
  const addMembers = (member: string) => {
    if (selectedMembers.includes(member)) {
      setSelectedMembers((prev) => prev.filter((id) => id !== member));
    } else {
      setSelectedMembers((prev) => [...prev, member]);
    }
  };

  const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewGroupName(e.target.value);
  };

  const friendsNotAlreadyInGroup = friends.map((friend) => {
    const groupParticipants = selectedConversation?.participants.map(
      (participant) => participant._id
    );
    if (!groupParticipants?.includes(friend._id)) return friend;
  });

  useEffect(() => {
    console.log(selectedMembers);
    console.log(newGroupName);
  }, [selectedMembers, newGroupName]);

  return (
    <div
      className={`h-full fixed right-0  w-[25rem] z-10 ${
        !isOpen && "translate-x-[100%]"
      } transition-transform duration-500 whiteBg`}
    >
      <div className=" flxBtw items-center p-4 w-full">
        <h1 className="text-xl font-bold ">Select members</h1>
        <button onClick={handleOpenChange} className="hover:underline">
          Cancel
        </button>
      </div>
      <ul className="full flxColStart py-4">
        {friendsNotAlreadyInGroup && friendsNotAlreadyInGroup.length > 1 ? (
          friendsNotAlreadyInGroup.map(
            (friend) =>
              friend && (
                <li className={`conversation-li-1`}>
                  <input
                    type="checkbox"
                    onChange={() => {
                      addMembers(friend._id);
                    }}
                    checked={selectedMembers.includes(friend._id)}
                  />
                  <span className="user-icon uppercase">
                    {friend.username?.substring(0, 1)}
                  </span>
                  <h1>{friend.username}</h1>
                </li>
              )
          )
        ) : (
          <p>All your friends already belong to this group.</p>
        )}
      </ul>
      <div className="px-2 flxColStart gap-2">
        <h1 className="text-sm font-[530]">Edit group name</h1>
        <input
          onChange={(e) => {
            handleGroupNameChange(e);
          }}
          value={newGroupName}
          className="w-full whiteBg rounded-md focus:outline-none text-sm p-2"
          type="text"
        />
        <button
          onClick={() => {
            mutate({
              members: selectedMembers,
              groupName: newGroupName as string,
              conversationId: selectedConversation?._id as string,
            });
            setNewGroupName("");
            setSelectedMembers([]);
          }}
          disabled={selectedMembers.length < 1}
          className="primaryBgCol whiteText px-3 py-2 rounded-md"
        >
          {isLoading ? "Loading..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default UpdateGroupMembers;
