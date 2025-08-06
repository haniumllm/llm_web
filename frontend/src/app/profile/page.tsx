"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const { isLoggedIn, user, login } = useAuthStore();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // 새로운 state 추가
  const [activeTab, setActiveTab] = useState("profile");
  const [userStats, setUserStats] = useState({
    totalSearches: 127,
    duplicatePatents: 23,
    bypassStrategies: 18,
    savedPatents: 45
  });

  useEffect(() => {
    if (!isLoggedIn || !user) {
      alert("로그인이 필요합니다.");
      router.push("/auth/login");
    } else {
      setUsername(user.username);
    }
  }, [isLoggedIn, user, router]);

  const handleNicknameChange = (value: string) => {
    setUsername(value);
    setHasChanges(true);
    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setHasChanges(true);
    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:4000/api/v1/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorData: { message: string } = await res.json();
        throw new Error(errorData.message || "수정 실패");
      }

      const data: {
        user: { email: string; username: string };
      } = await res.json();

      login(
        data.user.email,
        data.user.username,
        localStorage.getItem("accessToken") || ""
      );

      setMessage("정보가 성공적으로 수정되었습니다.");
      setMessageType("success");
      setHasChanges(false);
      setPassword("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("알 수 없는 오류가 발생했습니다.");
      }
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn || !user) return null;

  return (
    <div className={styles.pageContainer}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.profileAvatar}>
            <div className={styles.avatarCircle}>
              <svg className={styles.avatarIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>안녕하세요, {user.username}님!</h1>
            <p className={styles.heroSubtitle}>AI 특허 분석 새로운 차원에서 혁신을 이끌어가세요</p>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{userStats.totalSearches.toLocaleString()}</div>
              <div className={styles.statLabel}>특허 검색</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{userStats.duplicatePatents}</div>
              <div className={styles.statLabel}>중복 특허 발견</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{userStats.bypassStrategies}</div>
              <div className={styles.statLabel}>우회 전략 생성</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{userStats.savedPatents}</div>
              <div className={styles.statLabel}>저장된 특허</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Tab Navigation */}
        <div className={styles.tabNavigation}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'profile' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <svg className={styles.tabIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            프로필 설정
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'activity' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <svg className={styles.tabIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            활동 기록
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'security' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <svg className={styles.tabIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            보안 설정
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'profile' && (
            <div className={styles.profileTab}>
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>계정 정보 수정</h2>
                  <p className={styles.sectionDescription}>개인 정보를 안전하게 관리하고 업데이트하세요</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.profileForm}>
                  {/* Email Field */}
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                      이메일 주소
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className={`${styles.formInput} ${styles.disabledInput}`}
                      />
                      <div className={styles.disabledBadge}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        변경불가
                      </div>
                    </div>
                  </div>

                  {/* username Field */}
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      닉네임
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => handleNicknameChange(e.target.value)}
                        className={styles.formInput}
                        placeholder="닉네임을 입력하세요"
                        required
                      />
                      <div className={styles.inputStatus}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <svg className={styles.labelIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      새 비밀번호
                      <span className={styles.optionalBadge}>선택사항</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        className={styles.formInput}
                        placeholder="변경하지 않으려면 비워두세요"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className={styles.passwordToggle}
                      >
                        {showPassword ? (
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.111 8.111m1.767 1.767l4.242 4.242m0 0L15.887 15.887m-4.242-4.242L8.111 8.111" />
                          </svg>
                        ) : (
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <div className={styles.passwordHint}>
                      <svg className={styles.hintIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      8자 이상, 숫자와 특수문자를 포함해주세요
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className={styles.submitSection}>
                    <button
                      type="submit"
                      disabled={!hasChanges || isSubmitting}
                      className={`${styles.submitButton} ${(!hasChanges || isSubmitting) ? styles.submitButtonDisabled : ''}`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className={styles.spinner}></div>
                          <span>수정 중...</span>
                        </>
                      ) : (
                        <>
                          <svg className={styles.submitIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>정보 수정하기</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Message Display */}
                  {message && (
                    <div className={`${styles.messageContainer} ${messageType === 'success' ? styles.successMessage : styles.errorMessage}`}>
                      <div className={styles.messageIcon}>
                        {messageType === 'success' ? (
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        )}
                      </div>
                      <span className={styles.messageText}>{message}</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className={styles.activityTab}>
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>최근 활동</h2>
                  <p className={styles.sectionDescription}>특허 검색 및 분석 활동을 확인하세요</p>
                </div>
                
                <div className={styles.activityList}>
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityTitle}>AI 기반 음성 인식 기술 검색</div>
                      <div className={styles.activityMeta}>
                        <span className={styles.activityTime}>2시간 전</span>
                        <span className={styles.activityResult}>중복 특허 1건 발견</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityTitle}>블록체인 보안 시스템 우회 전략 생성</div>
                      <div className={styles.activityMeta}>
                        <span className={styles.activityTime}>1일 전</span>
                        <span className={styles.activityResult}>전략 3가지 제안</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityTitle}>IoT 센서 네트워크 특허 저장</div>
                      <div className={styles.activityMeta}>
                        <span className={styles.activityTime}>3일 전</span>
                        <span className={styles.activityResult}>관심 목록에 추가</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className={styles.securityTab}>
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>보안 및 개인정보</h2>
                  <p className={styles.sectionDescription}>계정 보안을 강화하고 개인정보를 보호하세요</p>
                </div>
                
                <div className={styles.securityInfo}>
                  <div className={styles.securityItem}>
                    <div className={styles.securityIcon}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className={styles.securityContent}>
                      <h3 className={styles.securityTitle}>데이터 보안</h3>
                      <p className={styles.securityDescription}>모든 특허 검색 데이터는 256비트 SSL 암호화로 보호됩니다</p>
                    </div>
                  </div>
                  
                  <div className={styles.securityItem}>
                    <div className={styles.securityIcon}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div className={styles.securityContent}>
                      <h3 className={styles.securityTitle}>계정 보안</h3>
                      <p className={styles.securityDescription}>정기적인 비밀번호 변경을 권장하며, 2단계 인증을 지원합니다</p>
                    </div>
                  </div>
                  
                  <div className={styles.securityItem}>
                    <div className={styles.securityIcon}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                      </svg>
                    </div>
                    <div className={styles.securityContent}>
                      <h3 className={styles.securityTitle}>개인정보 보호</h3>
                      <p className={styles.securityDescription}>개인정보는 특허 검색 서비스 제공 목적으로만 사용되며, 제3자와 공유되지 않습니다</p>
                    </div>
                  </div>
                  
                  <div className={styles.securityItem}>
                    <div className={styles.securityIcon}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className={styles.securityContent}>
                      <h3 className={styles.securityTitle}>특허 데이터 관리</h3>
                      <p className={styles.securityDescription}>검색한 특허 정보는 안전하게 저장되며, 언제든지 삭제하실 수 있습니다</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}