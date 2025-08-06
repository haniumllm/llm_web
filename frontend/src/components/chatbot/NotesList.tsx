// 노트 리스트
import { StickyNote as StickyNoteIcon, Trash2 as TrashIcon } from "lucide-react";
import { NoteItem } from "@/types/types";

interface NotesListProps {
  notes: NoteItem[];
  removeNote: (id: string) => void;
}

export default function NotesList({ notes, removeNote }: NotesListProps) {
  if (notes.length === 0) {
    return (
      <div className="empty-state">
        <StickyNoteIcon className="empty-icon" />
        <p>작성된 메모가 없습니다</p>
      </div>
    );
  }

  return (
    <ul className="notes-list">
      {notes.map((note) => (
        <li key={note.id} className="note-item">
          <div className="note-content">
            <h4>{note.title}</h4>
            <p>{note.content}</p>
            <span className="note-date">
              {note.timestamp.toLocaleDateString('ko-KR')}
            </span>
          </div>
          <button
            className="remove-button"
            onClick={() => removeNote(note.id)}
          >
            <TrashIcon size={14} />
          </button>
        </li>
      ))}
    </ul>
  );
}