'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

    const handleChatBotRedirect = () => {
        router.push("/chatbot");
    };

    return (
        <div className="container">
            <div className="card">
                <div className="header">특허 분석 챗봇</div>
                <button className="button" onClick={handleChatBotRedirect}>
                    챗봇 시작
                </button>
            </div>
        </div>
    );
}
