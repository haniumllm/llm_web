import { useState } from "react";
import { UiMessage } from "@/types/types";

interface MessageItemProps {
  message: UiMessage;
}

export default function MessageItem({ message }: MessageItemProps) {
  const [showAll, setShowAll] = useState(false);

  const topPatents = message.analysisData?.topPatents ?? [];
  const recommendedActions = message.analysisData?.recommendedActions ?? [];
  const bypassStrategies = message.analysisData?.bypassStrategies ?? [];

  return (
    <div className={`message-wrapper ${message.sender}`}>
      <div className="message-bubble">
        {/* user 메시지: text */}
        {message.sender === "user" && <p>{message.text}</p>}
        {/* bot 메시지: analysisData*/}
        {message.sender === "bot" && (
          <>
            {message.analysisData ? (
              <div className="analysis-block">
                
                {/* 📊 검색 통계 */}
                <div className="analysis-section">
                  <h4>📊 검색 통계</h4>
                  <p>총 {message.analysisData.totalResults ?? 0}건</p>
                  <p>위험도: {message.analysisData.riskLevel ?? "정보 없음"}</p>
                </div>

                {/* TOP 3 */}
                {topPatents.length > 0 ? (
                  <div className="analysis-section">
                    <h4>🎯 대표 유사 특허 TOP 3</h4>
                    <div className="patent-card-container">
                      {topPatents.slice(0, 3).map((patent, idx) => (
                        <div key={idx} className="patent-card">
                          <h5>{patent.inventionTitle}</h5>
                          <p>출원인: {patent.applicantName}</p>
                          <p>출원번호: {patent.applicationNumber}</p>
                          <p>출원일: {patent.applicationDate}</p>
                          <p>상태: {patent.registerStatus}</p>
                          {patent.similarity !== undefined && (
                            <p>유사도: {(patent.similarity * 100).toFixed(1)}%</p>
                          )}
                          <a
                            href={`https://kpat.kipris.or.kr/kpat/biblioa.do?method=biblio&applicationNumber=${patent.applicationNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="patent-link"
                          >
                            상세보기 →
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p>관련 특허 데이터가 없습니다.</p>
                )}

                {/* 📋 추가 특허 */}
                {topPatents.length > 3 && (
                  <div className="analysis-section">
                    <h4>📋 추가 특허 목록</h4>
                    {showAll && (
                      <div className="scrollable-card-list">
                        {topPatents.slice(3).map((patent, idx) => (
                          <div key={idx} className="patent-card">
                            <h5>{patent.inventionTitle}</h5>
                            <p>출원인: {patent.applicantName}</p>
                            <p>출원번호: {patent.applicationNumber}</p>
                            <p>출원일: {patent.applicationDate}</p>
                            <p>상태: {patent.registerStatus}</p>
                            {patent.similarity !== undefined && (
                              <p>유사도: {(patent.similarity * 100).toFixed(1)}%</p>
                            )}
                            <a
                              href={`https://kpat.kipris.or.kr/kpat/biblioa.do?method=biblio&applicationNumber=${patent.applicationNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="patent-link"
                            >
                              상세보기 →
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      className="show-more-btn"
                      onClick={() => setShowAll(!showAll)}
                    >
                      {showAll ? "접기 ▲" : "더 보기 ▼"}
                    </button>
                  </div>
                )}

                {/* 💡 권장 조치사항 */}
                {recommendedActions.length > 0 && (
                  <div className="analysis-section">
                    <h4>💡 권장 조치사항</h4>
                    <ul>
                      {recommendedActions.map((action, idx) => (
                        <li key={idx}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 🛠️ 우회 전략 */}
                {bypassStrategies.length > 0 && (
                  <div className="analysis-section">
                    <h4>🛠️ 우회 전략</h4>
                    {bypassStrategies.map((s, idx) => (
                      <div key={idx} className="strategy-card">
                        <strong>{s.type}</strong>
                        <p>{s.description}</p>
                        <p>실현 가능성: {s.feasibility}%</p>
                        <p>예상 소요시간: {s.timeline}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p>분석 데이터가 없습니다.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
