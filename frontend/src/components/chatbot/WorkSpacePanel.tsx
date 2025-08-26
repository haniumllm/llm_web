// 작업 공간 패널
import { StickyNoteIcon, PlusIcon, BookmarkIcon } from "lucide-react";
import { BookmarkItem, NoteItem } from "@/types/types";
import BookmarkList from "./BookmarkList";
import NoteForm from "./NoteForm";
import NotesList from "./NotesList";

interface WorkspacePanelProps {
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

export default function WorkspacePanel({
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
  addNote
}: WorkspacePanelProps) {
  const handleCancelNote = () => {
    setShowNewNoteForm(false);
    setNewNoteTitle("");
    setNewNoteContent("");
  };

  return (
    <div className="workspace-panel">
      <div className="workspace-section">
        <div className="section-header">
          <h3>
            <BookmarkIcon size={16} /> 북마크
          </h3>
        </div>
        <BookmarkList bookmarks={bookmarks} removeBookmark={removeBookmark} />
      </div>

      <div className="workspace-section">
        <div className="section-header">
          <h3>
            <StickyNoteIcon size={16} /> 메모
          </h3>
          <button
            className="add-note-button"
            onClick={() => setShowNewNoteForm(true)}
          >
            <PlusIcon size={14} /> 추가
          </button>
        </div>

        {showNewNoteForm && (
          <NoteForm
            newNoteTitle={newNoteTitle}
            setNewNoteTitle={setNewNoteTitle}
            newNoteContent={newNoteContent}
            setNewNoteContent={setNewNoteContent}
            onSave={addNote}
            onCancel={handleCancelNote}
          />
        )}

        <NotesList notes={notes} removeNote={removeNote} />
      </div>
    </div>
  );
}