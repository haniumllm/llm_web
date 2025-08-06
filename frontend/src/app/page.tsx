"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, Zap, Brain, Shield, ArrowRight, Sparkles, TrendingUp, FileText } from "lucide-react";
import styles from "./Home.module.css";

export default function Home() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChatBotRedirect = () => {
    router.push("/chatbot");
  };

  const features = [
    {
      icon: <Search className={styles.featureIcon} />,
      title: "빠른 검색",
      description: "수천 건의 특허를 AI가 신속하게 찾아드립니다.",
      colorClass: styles.colorBlue,
      delay: styles.delay100
    },
    {
      icon: <Brain className={styles.featureIcon} />,
      title: "심층 분석",
      description: "복잡한 특허 내용을 쉽게 이해할 수 있도록 정리합니다.",
      colorClass: styles.colorPurple,
      delay: styles.delay200
    },
    {
      icon: <Shield className={styles.featureIcon} />,
      title: "전략 수립",
      description: "경쟁사 분석과 특허 회피 전략까지 제안합니다.",
      colorClass: styles.colorGreen,
      delay: styles.delay300
    }
  ];

  const stats = [
    { number: "10,000+", label: "분석된 특허" },
    { number: "95%", label: "정확도" },
    { number: "24/7", label: "서비스 운영" }
  ];

  return (
    <div className={styles.container}>
      {/* Animated background elements */}
      <div className={styles.backgroundElements}>
        <div className={`${styles.blob} ${styles.blob1}`}></div>
        <div className={`${styles.blob} ${styles.blob2}`}></div>
        <div className={`${styles.blob} ${styles.blob3}`}></div>
      </div>

      {/* Grid background */}
      <div className={styles.gridBackground}></div>

      <div className={styles.content}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={`${styles.heroContent} ${isVisible ? styles.visible : ''}`}>
            
            {/* Badge */}
            <div className={styles.badge}>
              <Sparkles className={styles.badgeIcon} />
              <span className={styles.badgeText}>AI 기반 특허 분석 시스템</span>
              <div className={styles.statusDot}></div>
            </div>

            {/* Main Title */}
            <h1 className={styles.mainTitle}>
              AI 특허 분석
              <br />
              <span className={styles.subTitle}>새로운 차원</span>
            </h1>

            {/* Subtitle */}
            <p className={styles.subtitle}>
              최신 인공지능으로 특허를 <span className={styles.highlightPurple}>빠르게 검색</span>하고, 
              <span className={styles.highlightCyan}> 정확하게 분석</span>하며, 
              <span className={styles.highlightPink}> 전략적으로 활용</span>하세요.
            </p>

            {/* CTA Button */}
            <div className={styles.ctaSection}>
              <button 
                onClick={handleChatBotRedirect}
                className={styles.ctaButton}
              >
                <span>챗봇 시작하기</span>
                <ArrowRight className={styles.ctaIcon} />
                <div className={styles.ctaButtonGlow}></div>
              </button>
              
              <div className={styles.freeTrialNote}>
                <div className={styles.freeTrialDot}></div>
                <span>로그인 없이 무료 체험</span>
              </div>
            </div>

            {/* Stats */}
            <div className={styles.stats}>
              {stats.map((stat, index) => (
                <div key={index} className={styles.stat}>
                  <div className={styles.statNumber}>
                    {stat.number}
                  </div>
                  <div className={styles.statLabel}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <div className={styles.featuresContainer}>
            <div className={styles.featuresHeader}>
              <h2 className={styles.featuresTitle}>
                혁신적인 <span className={styles.featuresHighlight}>AI 기능</span>
              </h2>
              <p className={styles.featuresSubtitle}>
                복잡한 특허 분석을 간단하게 만드는 첨단 AI 기술을 경험해보세요
              </p>
            </div>

            <div className={styles.featuresGrid}>
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`${styles.featureCard} ${feature.delay}`}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className={`${styles.featureCardBg} ${feature.colorClass}`}></div>
                  
                  <div className={`${styles.featureIconContainer} ${feature.colorClass}`}>
                    {feature.icon}
                  </div>

                  <h3 className={styles.featureTitle}>
                    {feature.title}
                  </h3>
                  <p className={styles.featureDescription}>
                    {feature.description}
                  </p>

                  <div className={styles.featureIndicator}>
                    <TrendingUp className={styles.featureIndicatorIcon} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className={styles.finalCtaSection}>
          <div className={styles.finalCtaContainer}>
            <div className={styles.finalCtaCard}>
              <div className={styles.finalCtaCardBg}></div>
              
              <div className={styles.finalCtaContent}>
                <FileText className={styles.finalCtaIcon} />
                <h2 className={styles.finalCtaTitle}>
                  지금 바로 시작하세요
                </h2>
                <p className={styles.finalCtaText}>
                  복잡한 특허 분석, 이제 AI가 대신합니다. 
                  몇 분 안에 원하는 결과를 얻어보세요.
                </p>
                
                <button 
                  onClick={handleChatBotRedirect}
                  className={styles.finalCtaButton}
                >
                  <Zap className={styles.finalCtaButtonIcon} />
                  <span>무료로 시작하기</span>
                  <ArrowRight className={styles.finalCtaButtonArrow} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}