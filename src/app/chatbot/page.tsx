'use client';

import React, {useState, useRef, useEffect} from "react";
import "./ChatBotPage.css";

// 타입 정의
interface PatentResult {
    number: number;
    title: string;
    applicationNumber: string;
    summary: string;
    status: string;
    link: string;
}

interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
}

// Mock 데이터
const mockPatentResults: PatentResult[] = [
    {
        number: 1,
        title: "개인맞춤형 약물치료관리 방법 및 이를 위한 시스템",
        applicationNumber: "1020220182493",
        summary: "본 발명은 개인맞춤형 약물치료관리 방법 및 이를 위한 시스템에 관한 것이다. 구체적으로 본 발명은 사용자의 의약품 및 약물치료에 대한 현황을" +
                " 관리해 주는 주체로 약국 또는 약국서버를 활용함으로써 사용자의 개인맞춤형 약물치료관리 서비스를 제공하는 것에 관한 것이다.",
        status: "공개",
        link: "https://kpat.kipris.or.kr/kpat/biblioa.do?method=biblio&applicationNumber=1020" +
                "220182493"
    }, {
        number: 2,
        title: "개인맞춤형 뇌 자극 시스템 및 이를 이용한 뇌 자극 방법",
        applicationNumber: "1020230194662",
        summary: "본 발명의 일 실시예에 따른 개인맞춤형 뇌 자극 시스템은 사용자의 우울증 증상을 평가하고, 이에 따라 맞춤형 뇌 자극을 제공하는 시스템이다.",
        status: "등록",
        link: "https://kpat.kipris.or.kr/kpat/biblioa.do?method=biblio&applicationNumber=1020" +
                "230194662"
    }, {
        number: 3,
        title: "개인맞춤형 생활체육 추천 플랫폼 시스템",
        applicationNumber: "1020180166967",
        summary: "본 발명의 일 실시예에 따른 개인맞춤형 생활체육 추천 플랫폼 시스템은 사용자 정보, 신체 정보, 관심 정보를 포함하는 개인 데이터를 제공하는" +
                " 사용자 단말; 및 상기 개인 데이터를 수집하고, 복수의 공공 데이터를 연계 서버로부터 크롤링하며, 상기 개인 데이터와 공공 데이터를 기초로" +
                " 미리 설정된 기계 학습 및 추천 알고리즘을 통하여 개인화된 맞춤형 생활 체육 종목과 지역 기반의 생활체육 시설 정보를 상기 사용자 단말로 " +
                "제공하는 정보제공서버를 포함한다.",
        status: "등록",
        link: "https://kpat.kipris.or.kr/kpat/biblioa.do?method=biblio&applicationNumber=1020" +
                "180166967"
    }
];

const ChatBotPage: React.FC = () => {
    // State 타입 지정
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState<string>("");
    const [results, setResults] = useState<PatentResult[]>([]);
    const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

    // Ref 타입 지정
    const chatEndRef = useRef<HTMLDivElement>(null);

    const handleSend = () : void => {
        if (!input.trim()) 
            return;
        
        const userMessage: ChatMessage = {
            sender: "user",
            text: input
        };

        setMessages(prev => [
            ...prev,
            userMessage
        ]);

        const lowerInput = input.toLowerCase();
        let botResponse: string;

        if (lowerInput.includes("개인 맞춤형 학습 경로 추천 교육 플랫폼")) {
            botResponse = "🔍 관련 특허를 찾았습니다. 아래에서 확인해보세요!";
            setResults(mockPatentResults);
        } else {
            botResponse = "❌ 해당 키워드에 대한 특허를 찾을 수 없습니다.";
            setResults([]);
        }

        const botMessage: ChatMessage = {
            sender: "bot",
            text: botResponse
        };

        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                botMessage
            ]);
        }, 500);

        setInput("");
    };

    const toggleSummary = (index : number): void => {
        setExpandedIndexes(
            prev => prev.includes(index)
                ? prev.filter(i => i !== index)
                : [
                    ...prev,
                    index
                ]
        );
    };

    const handleKeyDown = (e : React.KeyboardEvent<HTMLInputElement>) : void => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) : void => {
        setInput(e.target.value);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        < div className = "chatbot-wrapper" > <div className = "results-section" > <div className = "results-header" > 🔍 검색된 특허 목록</div> {
            results.length === 0
                ? (< div style = {{ color: "#888", fontStyle: "italic" }} > 검색 결과가 없습니다.</div>)
                : (< ul className = "results-list" > {
                    results.map((item, idx) => (< li key = {
                        `patent-${item.number}-${idx}`
                    } > <div className = "result-title" > 📌 번호
                    : {
                        item.number
                    }
                    — {
                        item.title
                    }</div> < div className = "result-sub" > 📌 출원번호
                    : {
                        item.applicationNumber
                    } | 📌 등록상태
                    : {
                        item.status
                    }</div> < div className = "result-actions" > <button type = "button" onClick = {
                        () => toggleSummary(idx)
                    } > 요약 보기</button> < a href = {
                        item.link
                    }
                    target = "_blank" rel = "noopener noreferrer" style = {{ textDecoration: "none" }} > <button type = "button" > 상세보기</button></a></div> {
                        expandedIndexes.includes(idx) && (
                            < div className = "result-summary" > <strong> 📄 특허내용
                            : </strong> {
                                item.summary
                            }</div>
                        )
                    }</li>))
                }</ul>)
        }</div> < div className = "chat-section" > <div className = "chat-header" > 💬 특허정보 챗봇</div> < div className = "chat-box" > {
            messages.map((msg, i) => (< div key = {
                `message-${i}-${msg.sender}`
            }
            className = {
                `chat-message ${msg.sender}`
            } > {
                msg.text
            }</div>))
        } < div ref = {
            chatEndRef
        } /> </div> < div className = "chat-input-area" > <input className = "chat-input" type = "text" placeholder = "질문을 입력하세요" value = {
            input
        }
        onChange = {
            handleInputChange
        }
        onKeyDown = {
            handleKeyDown
        } /> <button className = "chat-send-button" type = "button" onClick = {
            handleSend
        } > SEND</button></div></div></div>
    );
};

export default ChatBotPage;