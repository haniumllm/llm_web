// 북마크 리스트
import { Star as StarIcon, Trash2 as TrashIcon } from "lucide-react";
import { BookmarkItem } from "@/types/types";
import { formatDateString } from "@/utils/dateUtils";

interface BookmarkListProps {
  bookmarks: BookmarkItem[];
  removeBookmark: (id: string) => void;
}

export default function BookmarkList({ bookmarks, removeBookmark }: BookmarkListProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="empty-state">
        <StarIcon className="empty-icon" />
        <p>북마크된 항목이 없습니다</p>
      </div>
    );
  }

  return (
    <ul className="bookmark-list">
      {bookmarks.map((bookmark) => (
        <li key={bookmark.id} className="bookmark-item">
          <div className="bookmark-content">
            <h4>{bookmark.title}</h4>
            <p>{bookmark.content.slice(0, 80)}...</p>
            <span className="bookmark-date">
              {formatDateString(bookmark.timestamp)}
            </span>
          </div>
          <button
            className="remove-button"
            onClick={() => removeBookmark(bookmark.id)}
          >
            <TrashIcon size={14} />
          </button>
        </li>
      ))}
    </ul>
  );
}
