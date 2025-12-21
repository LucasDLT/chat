"use client"
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
        ${isMine ? "text-right bg-[#a29714] m-2.5 mr-[1.6rem] xl:mr-52 w-fit max-w-[70%] px-3 py-2 rounded-xl wrap-break-word overflow-wrap break-word whitespace-pre-wrap block self-end border border-[#0a0a0a]" : "text-left bg-[#a98543] m-2.5 ml-[1.6rem] xl:ml-56 w-fit max-w-[70%] px-3 py-2 rounded-xl wrap-break-word overflow-wrap break-word whitespace-pre-wrap block self-start"}
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
