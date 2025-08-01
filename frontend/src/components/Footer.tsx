import Link from "next/link";
import "../styles/header-footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>© 2025 Patent Navigator. All rights reserved.</p>
        <div className="footer-links">
          <Link href="/terms">이용약관</Link>
          <Link href="/privacy">개인정보처리방침</Link>
        </div>
      </div>
    </footer>
  );
}
