"use client";

import "./ChatBot.css";
import { useState, useEffect } from "react";
import { ChatMessage } from "@/libs/schemas/chat";
import { 
  UiMessage,
  SearchHistory, 
  BookmarkItem, 
  NoteItem,
  TabType, 
  AnalysisToolType, 
  PatentSearchResult,
  ApiResponse
} from "@/types/types";
import { ChatHeader } from "@/components/chatbot";
import { ChatContent } from "@/components/chatbot";
import { ChatInput } from "@/components/chatbot";
import { SidePanel } from "@/components/chatbot";
import { jwtDecode } from "jwt-decode";

// 헬퍼 함수
const getRiskLevelText = (level?: 'HIGH' | 'MEDIUM' | 'LOW'): string => {
  const riskTexts = {
    HIGH: '🔴 높음 (주의 필요)',
    MEDIUM: '🟡 보통 (검토 권장)', 
    LOW: '🟢 낮음 (안전)'
  };
  return level ? riskTexts[level] : '⚪ 위험도 정보 없음';
};

const formatDate = (dateStr: string): string => {
  if (dateStr.length === 8) {
    return `${dateStr.slice(0,4)}.${dateStr.slice(4,6)}.${dateStr.slice(6,8)}`;
  }
  return dateStr;
};

// 분석 메시지 생성 함수
const generateAnalysisMessage = (
  analysis: ApiResponse['results'], 
  query: string, 
  results?: PatentSearchResult[]
): string => {
  if (!analysis) return "분석 결과를 처리하는 중 오류가 발생했습니다.";
  
  const { totalResults, riskLevel, topPatents, recommendedActions, bypassStrategies } = analysis;
  
  let message = `🔍 **"${query}" 검색 분석 결과**\n\n`;
  
  message += `📊 **검색 통계**\n`;
  message += `• 총 ${totalResults}건의 관련 특허 발견\n`;
  message += `• 중복 위험도: ${getRiskLevelText(riskLevel)}\n\n`;

  if (results && results.length > 0) {
    message += `📌 **대표 특허 예시**\n`;
    results.slice(0, 3).forEach((patent, idx) => {
      message += `${idx + 1}. **${patent.inventionTitle}**\n`;
      message += `   • 출원번호: ${patent.applicationNumber}\n`;
      message += `   • 출원인: ${patent.applicantName}\n`;
      message += `   • 상태: ${patent.registerStatus}\n\n`;
    });
  }

  if (topPatents && topPatents.length > 0) {
    message += `🎯 **주요 유사 특허 TOP 3**\n`;
    topPatents.slice(0, 3).forEach((patent, idx) => {
      message += `${idx + 1}. **${patent.inventionTitle}**\n`;
      message += `   • 출원인: ${patent.applicantName}\n`;
      message += `   • 출원일: ${formatDate(patent.applicationDate)}\n`;
      message += `   • 상태: ${patent.registerStatus}\n`;
      if (patent.similarity !== undefined) {
        message += `   • 유사도: ${(patent.similarity * 100).toFixed(1)}%\n`;
      }
      message += `\n`;
    });
  }
  
  if (riskLevel) {
    message += `⚠️ **위험도 평가**\n`;
    message += `${getRiskLevelText(riskLevel)} 위험이 감지되었습니다.\n\n`;
  }
  
  if (recommendedActions && recommendedActions.length > 0) {
    message += `💡 **권장 조치사항**\n`;
    recommendedActions.forEach((action, idx) => {
      message += `${idx + 1}. ${action}\n`;
    });
    message += `\n`;
  }
  
  const strategies = Array.isArray(bypassStrategies) ? bypassStrategies : (bypassStrategies ? [bypassStrategies] : []);

  if (strategies.length > 0) {
    message += `🛠️ **우회 등록 전략**\n`;
    strategies.forEach((s, i) => {
      const percent = s.feasibility <= 1 ? Math.round(s.feasibility * 100) : Math.round(s.feasibility);
      message += `**${i + 1}. ${s.type}**\n`;
      message += `• 설명: ${s.description}\n`;
      message += `• 실현 가능성: ${percent}%\n`;
      message += `• 예상 소요시간: ${s.timeline}\n\n`;
    });
}

message += `---\n`;
message += `💬 더 자세한 분석이나 특정 특허에 대한 질문이 있으시면 언제든 말씀해 주세요!`;

return message;

};

const generateToolAnalysisMessage = (data: ApiResponse, tool: string): string => {
  const toolTitles = {
    summary: '📋 특허 요약 분석',
    similarity: '🔍 유사성 분석',
    infringement: '⚖️ 침해 위험도 분석'
  } as const;

  let message = `${toolTitles[tool as keyof typeof toolTitles] ?? '📌 분석 결과'}\n\n`;

  if (data.response) {
    message += data.response;
  }

  if (data.results) {
    message += '\n\n---\n';
    message += `📊 **상세 분석 결과**\n`;

    if (data.results.riskLevel) {
      message += `• 위험도: ${getRiskLevelText(data.results.riskLevel)}\n`;
    }

    // ✅ 배열 기준으로 처리
    const strategies = Array.isArray(data.results.bypassStrategies)
      ? data.results.bypassStrategies
      : (data.results.bypassStrategies ? [data.results.bypassStrategies] : []);

    if (strategies.length > 0) {
      message += `\n🛠️ **우회 전략**\n`;
      strategies.forEach((s, i) => {
        const percent = s.feasibility <= 1 ? Math.round(s.feasibility * 100) : Math.round(s.feasibility);
        message += `\n**${i + 1}. ${s.type}**\n`;
        message += `• 설명: ${s.description}\n`;
        message += `• 실현성: ${percent}%\n`;
        message += `• 예상 소요시간: ${s.timeline}\n`;
      });
    }
  }

  return message;
};


// ChatBot 시작
export default function ChatBot() {
  const createUiMessage = (
  sender: "user" | "bot",
  text: string,
  analysisData?: UiMessage["analysisData"]
  ): UiMessage => ({
    sender,
    text,
    timestamp: new Date(),
    analysisData,
  });

  /* --- State --- */
  const [messages, setMessages] = useState<UiMessage[]>([
    {
      sender: "bot",
      text: "안녕하세요! 특허 분석 도우미입니다. 새 분석을 시작하거나 기존 분석 결과를 확인해보세요.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [results, setResults] = useState<PatentSearchResult[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("analysis-history");
  const [activeAnalysisTool, setActiveAnalysisTool] = useState<AnalysisToolType>("summary");
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);


  /* --- 토큰·세션 --- */
  const token =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("llm_web_auth") || "{}")?.state?.token
      : null;

  // useRef 대신 useState 사용
  const [sessionId, setSessionId] = useState<string | null>(null);

  interface JwtPayload {
    sub: number;
    email: string;
    role: string;
    username: string;
    iat?: number;
    exp?: number;
  }


  function getCurrentUserId(): number {
    const raw = localStorage.getItem("llm_web_auth");
    if (!raw) throw new Error("로그인 정보가 없습니다.");

    try {
      const parsed = JSON.parse(raw);
      const token = parsed.state?.token;
      if (!token) throw new Error("토큰이 없습니다.");

      const decoded = jwtDecode<JwtPayload>(token);
      console.log("✅ 디코딩된 JWT:", decoded);

      if (!decoded.sub) throw new Error("JWT에 사용자 ID(sub)가 없습니다.");
      return decoded.sub;
    } catch (err) {
      console.error("JWT 파싱 실패:", err);
      throw new Error("유효하지 않은 로그인 정보");
    }
  }

  // 세션 생성 함수
  const createSession = async () => {
    try {
      const raw = localStorage.getItem("llm_web_auth");
      if (!raw) throw new Error("로그인 정보가 없습니다.");
      const parsed = JSON.parse(raw);
      const token = parsed.state?.token;
      if (!token) throw new Error("토큰이 없습니다.");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/session`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
          title: "새 대화",
          user_id: getCurrentUserId()
        }),
      });

      const data = await res.json();
      console.log("세션 생성 응답:", data);

      if (!data.sessionId) {
        throw new Error("백엔드에서 sessionId가 응답되지 않았습니다.");
      }

      setSessionId(data.sessionId.toString());
      
      await loadUserSessions();
      
      setMessages([{
        sender: "bot",
        text: "안녕하세요! 특허 분석 도우미입니다. 새 분석을 시작하거나 기존 분석 결과를 확인해보세요.",
        timestamp: new Date(),
      }]);
      
      return data.sessionId.toString();
    } catch (err) {
      console.error("세션 생성 실패:", err);
      throw err;
    }
  };

  // 최근 세션 로드
  useEffect(() => {
    if (!token) return;

    let mounted = true;

    (async () => {
      try {
        await loadUserSessions();

        // 사용자 세션 목록 조회
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/sessions/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (mounted) {
          if (data.sessions && data.sessions.length > 0) {
            // 가장 최근 세션 사용
            const latestSession = data.sessions[0];
            setSessionId(latestSession.id.toString());

            // 대화 메시지 로드
            await loadChatMessages(latestSession.id);
          } else {
            // ✅ 세션 없으면 새로 생성
            const newSessionId = await createSession();
            setSessionId(newSessionId);
            await loadChatMessages(newSessionId);
          }
        }
      } catch (err) {
        console.error("초기화 오류:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [token]);

    // 세션 목록 불러오기
  const loadUserSessions = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/sessions/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("세션 목록 불러오기 실패");
      const data = await res.json();

      setSessions(
        data.sessions.map((s: any) => ({
          id: s.id.toString(),
          title: s.title,
          updatedAt: new Date(s.updatedAt),
        }))
      );
    } catch (e) {
      console.error("세션 목록 로드 실패:", e);
    }
  };
  
  // 세션 + 대화 기록 로드
  const loadChatMessages = async (targetSessionId: string) => {
    if (!targetSessionId) {
      console.warn("세션 ID가 없어 메시지 로드를 건너뜁니다.");
      return;
    }

    try {
      setSessionId(targetSessionId);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/${targetSessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) {
        console.error("대화 기록 HTTP 오류:", await res.text());
        return;
      }

      const { history = [] } = await res.json();
      setMessages(
        history.map((m: any) => ({
          sender: m.sender,
          text: m.text || m.message,
          timestamp: new Date(m.createdAt || m.timestamp),
          analysisData: m.analysisData,
        }))
      );
    } catch (error) {
      console.error("세션 복원 실패:", error);
    }
  };

  /* --- 대화 저장 --- */
  const saveChatMessage = async (
    sender: "user" | "bot",
    text: string,
    analysisData?: UiMessage["analysisData"]
  ) => {
    if (!sessionId) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${sessionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sender,
          text,
          analysisData,
        }),
      });
    } catch (e) {
      console.error("대화 저장 실패:", e);
    }
  };

/* ---------- 메시지 전송 ---------- */
const handleSend = async () => {
  if (!input.trim() || !token) return;

  const userMessage = createUiMessage("user", input);
  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setIsLoading(true);

  try {
    await saveChatMessage("user", userMessage.text);

    const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/chat/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: userMessage.text,
        session_id: sessionId,
        analysis_type: "enhanced_search",
        options: {
          includeDuplicateCheck: true,
          includeBypassStrategies: true,
          includeRiskAssessment: true,
          maxResults: 10,
        },
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || "서버 오류");
    }

    const data: ApiResponse = await res.json();

    if (data.results) {
      const list = data.results.topPatents ?? [];
      setResults(list);

      const analysisMessage = generateAnalysisMessage(
        data.results,
        userMessage.text,
        list
      );

      const botMessage = createUiMessage("bot", analysisMessage, {
        type: "search_analysis",
        totalResults: data.results.totalResults || 0,
        riskLevel: data.results.riskLevel,
        topPatents: data.results.topPatents || [],
        bypassStrategies: data.results.bypassStrategies,
        recommendedActions: data.results.recommendedActions || [],
      });

      setMessages((prev) => [...prev, botMessage]);
      await saveChatMessage("bot", botMessage.text, botMessage.analysisData);

      setSearchHistory((prev) => [
        {
          id: Date.now().toString(),
          query: userMessage.text,
          timestamp: new Date(),
          resultCount: data.results?.totalResults || 0,
          results: list,
          riskLevel: data.results?.riskLevel || "LOW",
          analysisType: "enhanced_search",
        },
        ...prev,
      ]);

    } else {
      const botResponse = data.response || "응답을 받을 수 없습니다.";
      const botMessage = createUiMessage("bot", botResponse);

      setMessages((prev) => [...prev, botMessage]);
      await saveChatMessage("bot", botResponse);
    }
  } catch (err) {
    console.error("LLM 요청 실패:", err);

    const errorMessage = "죄송합니다. 분석 중 오류가 발생했습니다. 다시 시도해 주세요.";
    const errorMsg = createUiMessage("bot", errorMessage);

    setMessages((prev) => [...prev, errorMsg]);
    await saveChatMessage("bot", errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  /* ---------- 분석 도구 실행 (Python LLM API) ---------- */
  const runAnalysisTool = async (tool: string, content: string) => {
    if (!content.trim() || !token) return;

    const enhancedAnalysisPrompts = {
      summary: {
        prompt: `다음 특허 문서를 분석하여 상세한 요약을 제공해주세요:\n\n${content}`,
        analysisType: 'detailed_summary'
      },
      similarity: {
        prompt: `다음 특허와 유사한 특허들을 찾아 상세 분석해주세요:\n\n${content}`,
        analysisType: 'similarity_analysis'
      },
      infringement: {
        prompt: `다음 특허에 대한 침해 위험도를 평가하고 우회 전략을 제시해주세요:\n\n${content}`,
        analysisType: 'infringement_analysis'
      },
    };

    const analysisConfig = enhancedAnalysisPrompts[tool as keyof typeof enhancedAnalysisPrompts];
    const displayMessage = `[${tool} 분석] ${content.slice(0, 100)}...`;
    
    setMessages((prev) => [...prev, { 
      sender: "user", 
      text: displayMessage, 
      timestamp: new Date() 
    }]);
    setIsLoading(true);

    await saveChatMessage("user", displayMessage);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/chat/analyze`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          message: analysisConfig.prompt,
          session_id: sessionId,
          analysis_type: analysisConfig.analysisType,
          options: {
            includeDetailedAnalysis: true,
            includeRecommendations: true,
            includeVisualization: tool === 'similarity'
          }
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.detail || "서버 오류");
      }

      const data: ApiResponse = await res.json();

      if (data.response) {
        const analysisResult = generateToolAnalysisMessage(data, tool);
        
        setMessages((prev) => [
          ...prev,
          { 
            sender: "bot", 
            text: analysisResult, 
            timestamp: new Date(),
            analysisData: data.results
          },
        ]);

        await saveChatMessage("bot", analysisResult);
      }
    } catch (err) {
      console.error("분석 도구 실행 실패:", err);
      const errorMessage = "분석 중 오류가 발생했습니다. 다시 시도해 주세요.";
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: errorMessage, timestamp: new Date() },
      ]);
      await saveChatMessage("bot", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- 북마크 관리 ---------- */
  const addBookmark = (item: Omit<BookmarkItem, 'id' | 'timestamp'>) => {
    const newBookmark: BookmarkItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setBookmarks(prev => [newBookmark, ...prev]);
    localStorage.setItem('patent-bookmarks', JSON.stringify([newBookmark, ...bookmarks]));
  };

  const removeBookmark = (id: string) => {
    const updated = bookmarks.filter(b => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem('patent-bookmarks', JSON.stringify(updated));
  };

  /* ---------- 노트 관리 ---------- */
  const addNote = () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    const newNote: NoteItem = {
      id: Date.now().toString(),
      title: newNoteTitle,
      content: newNoteContent,
      timestamp: new Date(),
    };
    setNotes(prev => [newNote, ...prev]);
    localStorage.setItem('patent-notes', JSON.stringify([newNote, ...notes]));
    
    setNewNoteTitle("");
    setNewNoteContent("");
    setShowNewNoteForm(false);
  };

  const removeNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem('patent-notes', JSON.stringify(updated));
  };

  const updateSessionTitle = async (targetSessionId: string, newTitle: string) => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/sessions/${targetSessionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });

      if (!res.ok) {
        throw new Error("세션 제목 업데이트 실패");
      }

      if (targetSessionId === sessionId) {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === targetSessionId ? { ...s, title: newTitle } : s
          )
        );
      }

      await loadUserSessions();
    } catch (error) {
      console.error("세션 제목 업데이트 실패:", error);
      alert("제목 수정에 실패했습니다.");
    }
  };

  const deleteSession = async (targetSessionId: string) => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${targetSessionId}/archive`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("세션 삭제 실패");
      }

      if (targetSessionId === sessionId) {
        const newSessionId = await createSession();
        setSessionId(newSessionId);
        setMessages([
          {
            sender: "bot",
            text: "안녕하세요! 특허 분석 도우미입니다.",
            timestamp: new Date(),
          },
        ]);
      }

      await loadUserSessions();
    } catch (error) {
      console.error("세션 삭제 실패:", error);
      alert("대화 삭제에 실패했습니다.");
    }
  };

  /* ---------- JSX ---------- */
  return (
    <div className="chatbot-container">
      <ChatHeader />
      <main className="chat-panel">
        <SidePanel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          input={input}
          setInput={setInput}
          onSend={handleSend}
          isLoading={isLoading}
          sessions={sessions}
          onSelectSession={loadChatMessages}
          onUpdateSession={updateSessionTitle} 
          onDeleteSession={deleteSession}
          addBookmark={addBookmark}
          activeAnalysisTool={activeAnalysisTool}
          setActiveAnalysisTool={setActiveAnalysisTool}
          runAnalysisTool={runAnalysisTool}
          bookmarks={bookmarks}
          removeBookmark={removeBookmark}
          notes={notes}
          removeNote={removeNote}
          showNewNoteForm={showNewNoteForm}
          setShowNewNoteForm={setShowNewNoteForm}
          newNoteTitle={newNoteTitle}
          setNewNoteTitle={setNewNoteTitle}
          newNoteContent={newNoteContent}
          setNewNoteContent={setNewNoteContent}
          addNote={addNote}
        />
        <div className="chat-body">
          <ChatContent messages={messages} isLoading={isLoading} />
          <ChatInput
            input={input}
            setInput={setInput}
            onSend={handleSend}
            isLoading={isLoading}
            onNewAnalysisClick={createSession}
          />
        </div>
      </main>
    </div>
  );
}