import React, { useState } from "react";
import {
  useConversationsHook,
  useCreateGroupHook,
} from "../hooks/conversationHooks";
import UserCard from "./UI/UserCard";

interface INewGroupProps {
  isOpen: boolean;
  handleOpenChange: () => void;
}

const NewGroup: React.FC<INewGroupProps> = ({ isOpen, handleOpenChange }) => {
  const { friends } = useConversationsHook();
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [newGroupName, setNewGroupName] = useState("");

  const { mutate, isLoading } = useCreateGroupHook();

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

  return (
    <div
      className={`h-full fixed w-[25rem] z-10 ${
        !isOpen && "-translate-x-[105%]"
      } transition-transform duration-500 whiteBg`}
    >
      <div className=" flxBtw items-center p-4 w-full">
        <h1 className="text-xl font-bold ">Select members</h1>
        <button onClick={handleOpenChange} className="hover:underline">
          Cancel
        </button>
      </div>
      <div className="relative px-2 flxColCenter py-1">
        <i className="fa-solid fa-magnifying-glass absolute left-4"></i>
        <input
          type="text"
          placeholder="Search"
          className="rounded-md h-[2rem] w-full pl-10"
        />
      </div>
      <ul className="full flxColStart py-4">
        {friends && friends.length ? (
          friends.map((friend) => (
            <UserCard
              key={friend._id}
              newGroupMember={{
                member: friend,
                selectedMembers: selectedMembers,
                handleAddMember: addMembers,
              }}
            />
          ))
        ) : (
          <p>Loading...</p>
        )}
      </ul>
      <div className="px-2 flxColStart gap-2">
        <h1 className="text-sm font-[530]">Enter group name</h1>
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
              name: newGroupName,
            });
            setNewGroupName("");
            setSelectedMembers([]);
          }}
          disabled={selectedMembers.length < 1}
          className="primaryBgCol whiteText px-3 py-2 rounded-md"
        >
          {isLoading ? "Loading..." : "Create"}
        </button>
      </div>
    </div>
  );
};

export default NewGroup;
