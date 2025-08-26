"use client";

import { KeyboardEvent } from "react";
import { Send as PaperPlaneIcon, RotateCw as ArrowPathIcon, Plus as PlusIcon } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;

  onNewAnalysisClick?: () => void;
}

export default function ChatInput({
  input,
  setInput,
  onSend,
  isLoading,
  onNewAnalysisClick,
}: ChatInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="chat-input-wrapper" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <footer className="chat-input-container" style={{ display: "flex", gap: "0.8rem" }}>
        <button className="add-chat-button" onClick={onNewAnalysisClick}>
          <PlusIcon size={18} />
        </button>
        <input
          type="text"
          className="chat-input"
          placeholder="특허 분석 관련 질문을 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button className="send-button" onClick={onSend} disabled={!input.trim() || isLoading}>
          {isLoading ? 
          (<ArrowPathIcon className="animate-spin" size={16} />)
          : (<PaperPlaneIcon size={16}/>)}
        </button>
      </footer>
    </div>
  );
}
