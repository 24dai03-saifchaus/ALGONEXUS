import React, { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import { Language } from "../types";
import { cn } from "../utils";

interface CodePanelProps {
  code: string;
  language: Language;
  activeLine: number;
}

const CodePanel: React.FC<CodePanelProps> = ({ code, language, activeLine }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  useEffect(() => {
    if (activeLine > 0 && scrollContainerRef.current) {
      const lineElement = scrollContainerRef.current.querySelector(`.line-highlight`);
      if (lineElement) {
        lineElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [activeLine]);

  return (
    <div className="relative font-mono text-sm overflow-hidden h-full flex flex-col bg-slate-50">
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200">
        <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">
          {language === "cpp" ? "C++" : language.toUpperCase()}
        </span>
      </div>
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-auto custom-scrollbar relative p-4"
      >
        <pre className={cn(`language-${language}`, "relative z-10 !m-0 !p-0")}>
          <code className={`language-${language}`}>
            {code}
          </code>
        </pre>
        {/* Line Highlight Overlay */}
        {activeLine > 0 && (
          <div 
            className="line-highlight absolute left-0 right-0 z-0 transition-all duration-300"
            style={{ 
              top: `${(activeLine - 1) * 1.5}rem`, // Approximate line height
              height: "1.5rem",
              background: "rgba(37, 99, 235, 0.1)",
              borderLeft: "4px solid #2563eb",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CodePanel;
