import { MsgInFeed } from "@/types/types";

interface MessageItemProps {
  message: MsgInFeed;
  isMatch: boolean;
  isActive: boolean;
  messageRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  myUserId: string;
  showAuthor?: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isMatch,
  isActive,
  messageRefs,
  myUserId,
  showAuthor = false,
}) => {
  const isMine = message.fromId === myUserId;
  const isSystem = message.type === "system";

  return (
    <div
      className={`
        message
        ${isMine ? "message--you" : "message--other"}
        ${isSystem ? "message--system" : ""}
        ${isMatch ? "message--match" : ""}
        ${isActive ? "message--active" : ""}
      `}
      ref={(el) => {
        messageRefs.current[message.messageId] = el;
      }}
    >
      {showAuthor && !isMine && !isSystem && message.fromNick && (
        <span className="message__author">{message.fromNick}</span>
      )}

      <div className="message__body">{message.msg}</div>
    </div>
  );
};
