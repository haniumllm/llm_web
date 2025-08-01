"use client";

import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./ChatBot.css";

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface PatentResult {
  id: number;
  title: string;
  applicationNumber: string;
  status: string;
  summary: string;
  link: string;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [results, setResults] = useState<PatentResult[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const sessionId = "session-" + new Date().toISOString().split("T")[0];

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    const userMsg: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId, message: input }),
      });

      const data = await res.json();

      if (data.results) setResults(data.results);

      if (data.reply) {
        const botMsg: Message = { sender: "bot", text: data.reply };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    }

    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chatbot-wrapper">
      {/* 좌측: 특허 결과 */}
      <aside className="results-section">
        <div className="results-header">🔍 검색된 특허 목록</div>
        {results.length === 0 ? (
          <p style={{ color: "#888", fontStyle: "italic" }}>
            검색 결과가 없습니다.
          </p>
        ) : (
          <ul className="results-list">
            {results.map((patent) => (
              <li key={patent.id}>
                <div className="result-title">{patent.title}</div>
                <div className="result-sub">
                  출원번호: {patent.applicationNumber} | 상태: {patent.status}
                </div>
                <div className="result-actions">
                  <button type="button">요약 보기</button>
                  <a
                    href={patent.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button type="button">상세보기</button>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* 우측: 챗봇 */}
      <main className="chat-section">
        <header className="chat-header">💬 특허정보 챗봇</header>

        <div className="chat-box">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-message ${msg.sender}`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            className="chat-input"
            placeholder="특허 관련 질문을 입력하세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="chat-send-button"
            onClick={handleSend}
          >
            <FontAwesomeIcon icon={faPaperPlane} className="rotated" />
          </button>
        </div>
      </main>
    </div>
  );
}
