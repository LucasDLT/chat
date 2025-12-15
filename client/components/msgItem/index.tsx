import { MsgInFeed } from "@/types/types";

interface MessageItemProps {
  message: MsgInFeed;
  isMatch: boolean;
  isActive: boolean;
}

export const MessageItem:React.FC<MessageItemProps> = ({ message, isMatch, isActive }) => {
  return (
    <div
      className={`
        message
        ${isMatch ? "message--match" : ""}
        ${isActive ? "message--active" : ""}
      `}
    >
      {message.msg}
    </div>
  );
};
