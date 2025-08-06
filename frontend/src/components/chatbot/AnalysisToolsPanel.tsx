// 분석 도구 패널
import { BookOpen as BookOpenIcon, RotateCw as ArrowPathIcon } from "lucide-react";
import { AnalysisToolType } from "@/types/types";

interface AnalysisToolsPanelProps {
  activeAnalysisTool: AnalysisToolType;
  setActiveAnalysisTool: (tool: AnalysisToolType) => void;
  input: string;
  setInput: (value: string) => void;
  runAnalysisTool: (tool: string, content: string) => void;
  isLoading: boolean;
}

export default function AnalysisToolsPanel({
  activeAnalysisTool,
  setActiveAnalysisTool,
  input,
  setInput,
  runAnalysisTool,
  isLoading
}: AnalysisToolsPanelProps) {
  const tools = [
    { id: "summary" as AnalysisToolType, label: "특허 요약" },
    { id: "similarity" as AnalysisToolType, label: "유사 특허 검색" },
    { id: "infringement" as AnalysisToolType, label: "침해 위험도" },
  ];

  const getPlaceholder = () => {
    switch (activeAnalysisTool) {
      case 'summary': return '요약할';
      case 'similarity': return '유사도 분석할';
      case 'infringement': return '침해 위험도를 평가할';
      default: return '';
    }
  };

  const getButtonLabel = () => {
    switch (activeAnalysisTool) {
      case 'summary': return '요약 분석';
      case 'similarity': return '유사도 분석';
      case 'infringement': return '침해위험도 분석';
      default: return '분석';
    }
  };

  return (
    <div className="analysis-tools-panel">
      <h3>분석 도구</h3>
      <div className="tool-selector">
        {tools.map(({ id, label }) => (
          <button
            key={id}
            className={`tool-button ${activeAnalysisTool === id ? "active" : ""}`}
            onClick={() => setActiveAnalysisTool(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="tool-content">
        <textarea
          placeholder={`${getPlaceholder()} 특허 내용을 입력하세요...`}
          rows={8}
          className="tool-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="tool-execute-button"
          onClick={() => runAnalysisTool(activeAnalysisTool, input)}
          disabled={!input.trim() || isLoading}
        >
          {isLoading ? (
            <ArrowPathIcon className="animate-spin" size={16} />
          ) : (
            <BookOpenIcon size={16} />
          )}
          {getButtonLabel()}
        </button>
      </div>
    </div>
  );
}