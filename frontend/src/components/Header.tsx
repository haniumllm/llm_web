"use client";

import Link from "next/link";
import "../styles/header-footer.css";
import { useState } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo-box">
            <Link href="/" className="logo">
            🔍 Patent Navigator
            </Link>
        </div>

        <div className="header-nav-box">
            <nav className="nav-links">
            <Link href="/chatbot">특허 검색</Link>
            {/* <Link href="/pricing">요금제</Link> */}
            <Link href="/about">서비스 소개</Link>
            </nav>
        </div>

        <div className="header-auth-box">

            <div className="auth-buttons">
            {isLoggedIn ? (
                <Link href="/dashboard" className="register">
                내 대시보드
                </Link>
            ) : (
                <>
                <Link href="/auth/login" className="login">
                    로그인
                </Link>
                <Link href="/auth/register" className="register">
                    회원가입
                </Link>
                </>
            )}
            </div>
        </div>
      </div>
    </header>
  );
}
