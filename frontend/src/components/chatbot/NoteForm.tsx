// 노트 폼
interface NoteFormProps {
  newNoteTitle: string;
  setNewNoteTitle: (title: string) => void;
  newNoteContent: string;
  setNewNoteContent: (content: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function NoteForm({
  newNoteTitle,
  setNewNoteTitle,
  newNoteContent,
  setNewNoteContent,
  onSave,
  onCancel
}: NoteFormProps) {
  return (
    <div className="note-form">
      <input
        type="text"
        placeholder="메모 제목"
        value={newNoteTitle}
        onChange={(e) => setNewNoteTitle(e.target.value)}
        className="note-title-input"
      />
      <textarea
        placeholder="메모 내용"
        rows={4}
        value={newNoteContent}
        onChange={(e) => setNewNoteContent(e.target.value)}
        className="note-content-input"
      />
      <div className="note-form-actions">
        <button onClick={onSave} className="save-note-button">
          저장
        </button>
        <button onClick={onCancel} className="cancel-note-button">
          취소
        </button>
      </div>
    </div>
  );
}