import { MsgInFeed } from "@/types/types";

interface MessageItemProps {
  message: MsgInFeed;
  isMatch: boolean;
  isActive: boolean;
  messageRefs: React.RefObject<Record<string, HTMLDivElement | null>>
}

export const MessageItem:React.FC<MessageItemProps> = ({ message, isMatch, isActive, messageRefs }) => {
  return (
    <div
      className={`
        message 
        ${isMatch ? "message--match" : ""}
        ${isActive ? "message--active" : ""}
      `}
      ref={(el)=> {messageRefs.current[message.messageId]=el}}
    >
      {message.msg}
    </div>
  );
};
