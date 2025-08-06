// 채팅 헤더
import { Bot as RobotIconSolid } from "lucide-react";

export default function ChatHeader() {
  return (
    <header className="chat-header">
      <div className="chat-header-left">
        <div className="bot-avatar">
          <RobotIconSolid size={20} />
        </div>
        <div>
          <h2>특허분석 챗봇</h2>
          <p>AI 기반 특허 검색 및 분석 도우미</p>
        </div>
      </div>
      <div className="status-indicator">
        <span className="status-dot" /> 온라인
      </div>
    </header>
  );
}