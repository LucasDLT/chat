"use client";

import { FeedMessage } from "@/types/types";
import React from "react";

interface MessageItemProps {
  message: FeedMessage;
  isMatch: boolean;
  isActive: boolean;
  messageRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  myUserId?: number;
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
  const isSystem =  message.kind === "system";

  const baseClasses =
    "m-2.5 w-fit max-w-[70%] px-3 py-2 rounded-xl break-words whitespace-pre-wrap block";

  const alignmentClasses = isMine
    ? "text-right bg-[#a29714] mr-[1.6rem] xl:mr-52 self-end border border-[#0a0a0a]"
    : "text-left bg-[#a98543] ml-[1.6rem] xl:ml-56 self-start";

  const stateClasses = `
    ${isSystem ? "message--system" : ""}
    ${isMatch ? "message--match" : ""}
    ${isActive ? "message--active" : ""}
  `;

  return (
    <div
      className={`message ${baseClasses} ${alignmentClasses} ${stateClasses}`}
      ref={(el) => {
        if (messageRefs.current) {
          messageRefs.current[message.id] = el;
        }
      }}
    >
      {showAuthor && !isMine && !isSystem && message.fromNick && (
        <span className="message__author">{message.fromNick}</span>
      )}

      <div className="message__body">{message.text}</div>
    </div>
  );
};
