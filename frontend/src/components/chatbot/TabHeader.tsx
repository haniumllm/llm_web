import { 
  Plus as PlusIcon, 
  Clock as ClockIcon, 
  BookOpen as BookOpenIcon, 
  Star as StarIcon 
} from "lucide-react";
import { TabType } from "@/types/types";

interface TabHeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function TabHeader({ activeTab, setActiveTab }: TabHeaderProps) {
  const tabs = [
    { id: "analysis-history" as TabType, label: "분석 기록", icon: ClockIcon },
    { id: "analysis-tools" as TabType, label: "분석 도구", icon: BookOpenIcon },
    { id: "workspace" as TabType, label: "작업공간", icon: StarIcon },
  ];

  return (
    <div className="tab-header">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={`tab-button ${activeTab === id ? "active" : ""}`}
          onClick={() => setActiveTab(id)}
        >
          <Icon size={14} /> {label}
        </button>
      ))}
    </div>
  );
}