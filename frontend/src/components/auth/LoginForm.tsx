"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/styles/auth.module.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "로그인 실패");
        return;
      }

      const data = await res.json();
      console.log("로그인 성공:", data);

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      alert("로그인 성공!");
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("로그인 중 오류 발생");
    }
  };

  return (
    <div className={styles.authContainer}>
      <h1 className={styles.authTitle}>로그인</h1>
      <form className={styles.authForm} onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="이메일"
          className={styles.authInput}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="비밀번호"
          className={styles.authInput}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className={styles.authButton}>
          로그인
        </button>
      </form>
      <p className={styles.authLink}>
        계정이 없으신가요? <Link href="/auth/register">회원가입</Link>
      </p>
    </div>
  );
}