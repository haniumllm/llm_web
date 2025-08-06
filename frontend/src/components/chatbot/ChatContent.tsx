import { useRef, useEffect, useState } from "react";
import { Bot as RobotIconSolid, RotateCw as ArrowPathIcon, ArrowUp as ArrowUpIcon } from "lucide-react";
import MessageItem from "./MessageItem";
import { UiMessage } from "@/types/types";

interface ChatContentProps {
  messages: UiMessage[];
  isLoading: boolean;
}

export default function ChatContent({ messages, isLoading }: ChatContentProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setShowScrollButton(container.scrollTop > 200);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    chatContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="chat-content" ref={chatContainerRef}>
      {messages.map((message, index) => (
        <div key={index} className="chat-block">
          <MessageItem message={message} />
        </div>
      ))}

      {isLoading && (
        <div className="message-wrapper bot">
          <div className="message-avatar">
            <RobotIconSolid size={16} />
          </div>
          <div className="message-bubble loading">
            <ArrowPathIcon className="animate-spin" size={14} /> 분석중...
          </div>
        </div>
      )}

      <div ref={chatEndRef} />

      {showScrollButton && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <ArrowUpIcon size={18} />
        </button>
      )}
    </div>
  );
}
