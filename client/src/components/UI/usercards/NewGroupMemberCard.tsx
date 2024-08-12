import React from "react";
import { IUsers } from "../../../contexts/ConversationState";

export interface INewGroupMember {
  member: IUsers;
  selectedMembers: string[];
  handleAddMember: (id: string) => void;
}

interface Props {
  newGroupMember?: INewGroupMember;
}

const NewGroupMemberCard: React.FC<Props> = ({ newGroupMember }) => {
  return (
    <li className={`conversation-li-1`}>
      <input
        type="checkbox"
        onChange={() => {
          newGroupMember &&
            newGroupMember.handleAddMember(newGroupMember.member._id);
        }}
        checked={
          newGroupMember &&
          newGroupMember.selectedMembers.includes(newGroupMember.member._id)
        }
      />
      <span className="user-icon uppercase">
        {newGroupMember && newGroupMember.member.username?.substring(0, 1)}
      </span>
      <h1>{newGroupMember && newGroupMember.member.username}</h1>
    </li>
  );
};

export default NewGroupMemberCard;
