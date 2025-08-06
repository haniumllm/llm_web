"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "@/styles/auth.module.css";

export default function RegisterForm() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          username: form.username,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "회원가입 실패");
        return;
      }

      const data = await res.json();
      console.log("회원가입 성공:", data);
      alert("회원가입이 완료되었습니다.");

      router.push("/auth/login");

    } catch (error) {
      console.error(error);
      alert("회원가입 중 오류 발생");
    }
  };

  return (
  <div className={styles.authPageBackground}>
    <div className={styles.authContainer}>
      <h1 className={styles.authTitle}>회원가입</h1>
      <form className={styles.authForm} onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="이메일"
          className={styles.authInput}
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />

        <input
          type="text"
          name="username"
          placeholder="닉네임"
          className={styles.authInput}
          value={form.username}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          className={styles.authInput}
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          className={styles.authInput}
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className={styles.authButton}>
          회원가입
        </button>
      </form>
      <p className={styles.authLink}>
        이미 계정이 있으신가요? <Link href="/auth/login">로그인</Link>
      </p>
    </div>
  </div>
  );
}
