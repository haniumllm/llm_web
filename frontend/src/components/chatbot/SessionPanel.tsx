"use client";

import { useState } from "react";
import { Clock, Edit2, Trash2, Check, X } from "lucide-react";

interface Session {
  id: string;
  title: string;
  updatedAt: Date | string;
}

interface SessionPanelProps {
  sessions: Session[];
  onSelectSession: (sessionId: string) => Promise<void>;
  onUpdateSession?: (sessionId: string, newTitle: string) => Promise<void>;
  onDeleteSession?: (sessionId: string) => Promise<void>;
}

export default function SessionPanel({ 
  sessions, 
  onSelectSession,
  onUpdateSession,
  onDeleteSession
}: SessionPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const handleEditStart = (session: Session, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditingTitle(session.title);
  };

  const handleEditSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!editingId || !editingTitle.trim()) {
      setEditingId(null);
      setEditingTitle("");
      return;
    }

    if (onUpdateSession) {
      try {
        await onUpdateSession(editingId, editingTitle.trim());
      } catch (error) {
        console.error("세션 제목 업데이트 실패:", error);
      }
    }

    setEditingId(null);
    setEditingTitle("");
  };

  const handleEditCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
    setEditingTitle("");
  };

  const handleDelete = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!window.confirm('이 대화를 삭제하시겠습니까?')) {
      return;
    }

    if (onDeleteSession) {
      try {
        await onDeleteSession(sessionId);
      } catch (error) {
        console.error("세션 삭제 실패:", error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEditSave(e as any);
    } else if (e.key === 'Escape') {
      handleEditCancel(e as any);
    }
  };

  return (
    <div className="session-panel">
      <h3>채팅</h3>
      {sortedSessions.length === 0 ? (
        <div className="empty-state">
          <Clock className="empty-icon" />
          <p>대화를 시작하세요!</p>
        </div>
      ) : (
        <ul className="session-list">
          {sortedSessions.map((session) => (
            <li
              key={session.id}
              className={`session-item ${editingId === session.id ? 'editing' : ''}`}
              onClick={() => editingId !== session.id && onSelectSession(session.id)}
            >
              <div className="session-content">
                {editingId === session.id ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="edit-input"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <div className="session-title">{session.title}</div>
                )}
              </div>
              
              {editingId === session.id ? (
                <div className="edit-actions">
                  <button
                    className="action-button save"
                    onClick={handleEditSave}
                    title="저장"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    className="action-button cancel"
                    onClick={handleEditCancel}
                    title="취소"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="session-actions">
                  {onUpdateSession && (
                    <button
                      className="action-button edit"
                      onClick={(e) => handleEditStart(session, e)}
                      title="제목 수정"
                    >
                      <Edit2 size={14} />
                    </button>
                  )}
                  {onDeleteSession && (
                    <button
                      className="action-button delete"
                      onClick={(e) => handleDelete(session.id, e)}
                      title="삭제"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}