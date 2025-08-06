"use client";

import Link from "next/link";
import Image from "next/image";
import "../styles/header-footer.css";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";

export default function Header() {
  const { isLoggedIn, user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo-box">
          <Link href="/" className="logo">
            <Image
              src="/logo.svg"
              alt="AI 특허 로고"
              width={120}
              height={40}
              priority
            />
          </Link>
        </div>

        <div className="header-right-box">
          <div className="navbar">
            <nav className="nav-links">
              <Link href="/chatbot">특허 검색</Link>
              <Link href="/about">서비스 소개</Link>
            </nav>
          </div>

          <div className="auth">
            <div className="auth-buttons">
              {isLoggedIn && user ? (
                <div className="dropdown">
                  <button
                    onClick={() => setOpen(!open)}
                    className="dropdown-toggle"
                  >
                    <span>{user.username}</span>
                    <i className="fa-solid fa-caret-down"></i>
                  </button>

                  {open && (
                    <div className="dropdown-menu">
                      <Link href="/dashboard" className="dropdown-item">
                        내 대시보드
                      </Link>
                      <Link href="/profile" className="dropdown-item">
                        내 정보 수정
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setOpen(false);
                        }}
                        className="dropdown-item logout"
                      >
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
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
      </div>
    </header>
  );
}
