"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "@/styles/auth.module.css";

export default function RegisterForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

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
      const res = await fetch("http://localhost:4000/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      if (!res.ok) {
        throw new Error("회원가입 실패");
      }

      const data = await res.json();
      console.log("회원가입 성공:", data);
      alert("회원가입이 완료되었습니다.");
    } catch (error) {
      console.error(error);
      alert("회원가입 중 오류 발생");
    }
  };


  return (
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
        />

        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          className={styles.authInput}
          value={form.password}
          onChange={handleChange}
          required
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
  );
}
