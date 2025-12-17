import { MsgInFeed } from "@/types/types";

interface MessageItemProps {
  message: MsgInFeed;
  isMatch: boolean;
  isActive: boolean;
  messageRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  myUserId: string;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isMatch,
  isActive,
  messageRefs,
  myUserId,
}) => {
  const isMine = message.fromId === myUserId;

  return (
    <div
      className={`
        message 
        ${isMatch ? "message--match" : ""}
        ${isActive ? "message--active" : ""}
        
      `}
      ref={(el) => {
        messageRefs.current[message.messageId] = el;
      }}
    >
      {message.msg}
      {isMine && " (you)"}
    </div>
  );
};
