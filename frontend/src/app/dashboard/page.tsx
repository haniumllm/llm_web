"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";

interface RecentSearch {
  id: number;
  query: string;
  date: string;
  status: "완료" | "중복발견" | "오류";
}

export default function DashboardPage() {
  const { isLoggedIn, user } = useAuthStore();
  const router = useRouter();

  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  const [stats, setStats] = useState({
    totalSearches: 0,
    duplicatePatents: 0,
    workaroundStrategies: 0,
  });

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      router.push("/auth/login");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    const loadUserStats = () => {
      setStats({
        totalSearches: 24,
        duplicatePatents: 3,
        workaroundStrategies: 8,
      });

      setRecentSearches([
        { id: 1, query: "스마트폰 배터리 기술", date: "2024-08-05", status: "완료" },
        { id: 2, query: "AI 음성인식 알고리즘", date: "2024-08-04", status: "중복발견" },
        { id: 3, query: "자율주행 센서 시스템", date: "2024-08-03", status: "완료" },
      ]);
    };

    if (isLoggedIn) {
      loadUserStats();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn || !user) {
    return <p className={styles.loadingText}>로딩 중...</p>;
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* 헤더 섹션 */}
      <div className={styles.dashboardHeader}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.dashboardTitle}>안녕하세요, {user.username}님!</h1>
          <p className={styles.dashboardSubtitle}>
            AI 특허 분석 새로운 차원으로 특허를 빠르게 검색하고, 정확하게 분석하며, 전략적으로 활용하세요.
          </p>
        </div>
        <div className={styles.userProfileCard}>
          <div className={styles.userAvatar}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userDetails}>
            <p className={styles.userNickname}>{user.username}</p>
            <p className={styles.userEmail}>{user.email}</p>
            <span className={styles.userBadge}>프리미엄 사용자</span>
          </div>
        </div>
      </div>

      {/* 통계 카드 섹션 */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🔍</div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>{stats.totalSearches}</h3>
            <p className={styles.statLabel}>총 특허 검색</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⚠️</div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>{stats.duplicatePatents}</h3>
            <p className={styles.statLabel}>중복 특허 발견</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💡</div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>{stats.workaroundStrategies}</h3>
            <p className={styles.statLabel}>우회 전략 제공</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>95%</h3>
            <p className={styles.statLabel}>정확도</p>
          </div>
        </div>
      </div>

      {/* 주요 기능 카드 섹션 */}
      <div className={styles.mainSection}>
        <div className={styles.sectionTitle}>
          <h2>주요 기능</h2>
          <p>AI 기반 특허 분석 시스템을 활용해보세요</p>
        </div>
        
        <div className={styles.featureGrid}>
          <a href="/patent-search" className={`${styles.featureCard} ${styles.cardPrimary}`}>
            <div className={styles.cardIcon}>🔍</div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>특허 검색 & 분석</h3>
              <p className={styles.cardDescription}>
                최신 AI 기술로 특허를 빠르게 검색하고 상세 분석 결과를 제공합니다.
              </p>
              <div className={styles.cardButton}>
                지금 시작하기
                <span className={styles.buttonArrow}>→</span>
              </div>
            </div>
          </a>

          <a href="/duplicate-check" className={`${styles.featureCard} ${styles.cardSecondary}`}>
            <div className={styles.cardIcon}>🔍</div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>중복 특허 검증</h3>
              <p className={styles.cardDescription}>
                기존 특허와의 중복 여부를 정밀하게 분석하여 리스크를 사전에 예방합니다.
              </p>
              <div className={styles.cardButton}>
                검증하기
                <span className={styles.buttonArrow}>→</span>
              </div>
            </div>
          </a>

          <a href="/workaround-strategy" className={`${styles.featureCard} ${styles.cardTertiary}`}>
            <div className={styles.cardIcon}>💡</div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>우회 전략 생성</h3>
              <p className={styles.cardDescription}>
                중복 특허 발견 시 효과적인 우회 전략과 대안을 AI가 제안합니다.
              </p>
              <div className={styles.cardButton}>
                전략 받기
                <span className={styles.buttonArrow}>→</span>
              </div>
            </div>
          </a>

          <a href="/ai-chatbot" className={`${styles.featureCard} ${styles.cardQuaternary}`}>
            <div className={styles.cardIcon}>🤖</div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>AI 특허 상담</h3>
              <p className={styles.cardDescription}>
                24/7 AI 챗봇이 특허 관련 궁금증을 즉시 해결해드립니다.
              </p>
              <div className={styles.cardButton}>
                상담하기
                <span className={styles.buttonArrow}>→</span>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* 최근 활동 섹션 */}
      <div className={styles.recentSection}>
        <div className={styles.sectionTitle}>
          <h2>최근 활동</h2>
          <p>최근 검색한 특허 목록을 확인하세요</p>
        </div>
        
        <div className={styles.recentList}>
          {recentSearches.map((search) => (
            <div key={search.id} className={styles.recentItem}>
              <div className={styles.recentIcon}>📄</div>
              <div className={styles.recentContent}>
                <h4 className={styles.recentTitle}>{search.query}</h4>
                <p className={styles.recentDate}>{search.date}</p>
              </div>
              <div className={`${styles.recentStatus} ${
                search.status === '중복발견' ? styles.statusWarning : styles.statusComplete
              }`}>
                {search.status}
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.viewAllButton}>
          <a href="/history">전체 기록 보기 →</a>
        </div>
      </div>

      {/* 빠른 액션 섹션 */}
      <div className={styles.quickActions}>
        <div className={styles.actionCard}>
          <h3>프로필 관리</h3>
          <p>계정 정보를 업데이트하세요</p>
          <a href="/profile" className={styles.actionButton}>내 정보 수정</a>
        </div>
        
        <div className={styles.actionCard}>
          <h3>고객 지원</h3>
          <p>궁금한 점이 있으신가요?</p>
          <a href="/support" className={styles.actionButton}>문의하기</a>
        </div>
        
        <div className={styles.actionCard}>
          <h3>서비스 가이드</h3>
          <p>특허 검색 활용법을 배워보세요</p>
          <a href="/guide" className={styles.actionButton}>가이드 보기</a>
        </div>
      </div>
    </div>
  );
}