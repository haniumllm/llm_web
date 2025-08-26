// 사이드 패널
import { TabType, AnalysisToolType, BookmarkItem, NoteItem } from "@/types/types";
import TabHeader from "./TabHeader";
import SessionPanel from "./SessionPanel";
import AnalysisToolsPanel from "./AnalysisToolsPanel";
import WorkspacePanel from "./WorkSpacePanel";

interface NewAnalysisPanel {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

interface SidePanelProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  sessions: { id: string; title: string; updatedAt: Date }[];
  onSelectSession: (sessionId: string) => Promise<void>;
  onUpdateSession?: (sessionId: string, newTitle: string) => Promise<void>;
  onDeleteSession?: (sessionId: string) => Promise<void>;
  addBookmark: (item: Omit<BookmarkItem, 'id' | 'timestamp'>) => void;
  activeAnalysisTool: AnalysisToolType;
  setActiveAnalysisTool: (tool: AnalysisToolType) => void;
  runAnalysisTool: (tool: string, content: string) => void;
  bookmarks: BookmarkItem[];
  removeBookmark: (id: string) => void;
  notes: NoteItem[];
  removeNote: (id: string) => void;
  showNewNoteForm: boolean;
  setShowNewNoteForm: (show: boolean) => void;
  newNoteTitle: string;
  setNewNoteTitle: (title: string) => void;
  newNoteContent: string;
  setNewNoteContent: (content: string) => void;
  addNote: () => void;
}

export default function SidePanel({
  activeTab,
  setActiveTab,
  input,
  setInput,
  onSend,
  isLoading,
  sessions,
  onSelectSession,
  onUpdateSession,
  onDeleteSession,
  addBookmark,
  activeAnalysisTool,
  setActiveAnalysisTool,
  runAnalysisTool,
  bookmarks,
  removeBookmark,
  notes,
  removeNote,
  showNewNoteForm,
  setShowNewNoteForm,
  newNoteTitle,
  setNewNoteTitle,
  newNoteContent,
  setNewNoteContent,
  addNote,
}: SidePanelProps) {
  const renderTabContent = () => {
    switch (activeTab) {
      case "analysis-history":
        return (
          <SessionPanel
            sessions={sessions}
            onSelectSession={onSelectSession}
            onUpdateSession={onUpdateSession}
            onDeleteSession={onDeleteSession}
          />
        );
      case "analysis-tools":
        return (
          <AnalysisToolsPanel
            activeAnalysisTool={activeAnalysisTool}
            setActiveAnalysisTool={setActiveAnalysisTool}
            input={input}
            setInput={setInput}
            runAnalysisTool={runAnalysisTool}
            isLoading={isLoading}
          />
        );
      case "workspace":
        return (
          <WorkspacePanel
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
        );
      default:
        return null;
    }
  };

  return (
    <aside className="results-panel">
      <TabHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="results-content">{renderTabContent()}</div>
    </aside>
  );
}