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
  const isSystem = !message.fromId;

  return (
    <div
      className={`
        message 
        ${isMine ? "message--you" : "message--other"}
        ${isMatch ? "message--match" : ""}
        ${isActive ? "message--active" : ""}
        ${isSystem ? "message--system" : ""}
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
