import React, { useState, useEffect, useCallback } from "react";
import { 
  Play, Pause, SkipBack, SkipForward, RotateCcw, 
  Settings, Code, Info, ChevronRight, BarChart3, Search,
  Cpu, Zap, Layers
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AlgorithmType, Language, Step, AlgorithmInfo } from "./types";
import { ALGORITHMS, CODE_SNIPPETS } from "./constants";
import { generateBubbleSortSteps, generateBinarySearchSteps } from "./algorithms";
import VisualizationCanvas from "./components/VisualizationCanvas";
import CodePanel from "./components/CodePanel";
import { cn } from "./utils";
import confetti from "canvas-confetti";

export default function App() {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmInfo>(ALGORITHMS[0]);
  const [arrayInput, setArrayInput] = useState<string>("64, 34, 25, 12, 22, 11, 90");
  const [targetInput, setTargetInput] = useState<string>("22");
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [delay, setDelay] = useState(1500); // Slower default delay
  const [language, setLanguage] = useState<Language>("cpp");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const initSteps = useCallback(() => {
    const arr = arrayInput.split(",").map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    if (arr.length === 0) return;

    let generatedSteps: Step[] = [];
    if (selectedAlgo.id === AlgorithmType.BUBBLE_SORT) {
      generatedSteps = generateBubbleSortSteps(arr);
    } else if (selectedAlgo.id === AlgorithmType.BINARY_SEARCH) {
      generatedSteps = generateBinarySearchSteps(arr, parseInt(targetInput));
    }

    setSteps(generatedSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [arrayInput, selectedAlgo, targetInput]);

  useEffect(() => {
    initSteps();
  }, [initSteps]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentStepIndex < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, delay);
    } else if (currentStepIndex === steps.length - 1) {
      setIsPlaying(false);
      if (steps[currentStepIndex]?.description.includes("complete") || steps[currentStepIndex]?.found !== undefined) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f2ff', '#bc13fe', '#ff00ff']
        });
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps, delay]);

  const handleRandomize = () => {
    const randomArr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100));
    setArrayInput(randomArr.join(", "));
    if (selectedAlgo.id === AlgorithmType.BINARY_SEARCH) {
      setTargetInput(randomArr[Math.floor(Math.random() * randomArr.length)].toString());
    }
  };

  const currentStep = steps[currentStepIndex] || { array: [], highlights: [], swaps: [], line: 0, description: "" };

  return (
    <div className="flex h-screen w-screen bg-bg-main overflow-hidden text-slate-900 font-sans">
      {/* Sidebar - Algorithm Selection & Input */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="w-80 h-full glass-panel m-4 mr-0 flex flex-col z-20 overflow-hidden border-r border-slate-200"
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Cpu className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-xl font-bold tracking-tighter text-slate-900">ALGONEXUS</h1>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 block">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs hover:bg-slate-100 transition-colors flex items-center gap-2">
                      <BarChart3 className="w-3 h-3 text-secondary" /> Sorting
                    </button>
                    <button className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs hover:bg-slate-100 transition-colors flex items-center gap-2">
                      <Search className="w-3 h-3 text-primary" /> Searching
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 block">Select Algorithm</label>
                  <select 
                    value={selectedAlgo.id}
                    onChange={(e) => setSelectedAlgo(ALGORITHMS.find(a => a.id === e.target.value) || ALGORITHMS[0])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                  >
                    {ALGORITHMS.map(algo => (
                      <option key={algo.id} value={algo.id} className="bg-white">{algo.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 block">Data Input</label>
                <textarea
                  value={arrayInput}
                  onChange={(e) => setArrayInput(e.target.value)}
                  className="w-full h-24 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-mono outline-none focus:border-primary transition-colors resize-none"
                  placeholder="e.g. 5, 2, 9, 1"
                />
                {selectedAlgo.id === AlgorithmType.BINARY_SEARCH && (
                  <div className="mt-3">
                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 block">Target Value</label>
                    <input
                      type="text"
                      value={targetInput}
                      onChange={(e) => setTargetInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono outline-none focus:border-primary transition-colors"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button 
                    onClick={handleRandomize}
                    className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Zap className="w-3 h-3 text-yellow-500" /> Random
                  </button>
                  <button 
                    onClick={initSteps}
                    className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider">Complexity</span>
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Time</span>
                    <span className="text-secondary font-mono">{selectedAlgo.timeComplexity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Space</span>
                    <span className="text-primary font-mono">{selectedAlgo.spaceComplexity}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 gap-4 relative">
        {/* Top Bar */}
        <div className="flex items-center justify-between glass-panel px-6 py-3">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Layers className="w-5 h-5 text-slate-400" />
            </button>
            <div className="h-4 w-[1px] bg-slate-200" />
            <h2 className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <span className="text-primary">{selectedAlgo.category}</span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span>{selectedAlgo.name}</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-50 rounded-lg p-1 border border-slate-200">
              {(['cpp', 'java', 'python'] as Language[]).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-md transition-all",
                    language === lang ? "bg-white shadow-sm text-primary" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {lang === 'cpp' ? 'C++' : lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visualization Area */}
        <div className="flex-1 flex gap-4 min-h-0">
          <div className="flex-[2] glass-panel relative overflow-hidden flex flex-col">
            <div className="absolute top-6 left-6 z-10 right-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Live Simulation Analysis</span>
              </div>
              <motion.div 
                key={currentStepIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm max-w-2xl"
              >
                <p className="text-sm md:text-base font-medium text-slate-700 leading-relaxed">
                  {currentStep.description}
                </p>
              </motion.div>
            </div>

            <div className="flex-1">
              <VisualizationCanvas 
                step={currentStep} 
                prevStep={steps[currentStepIndex - 1]}
                delay={delay} 
              />
            </div>

            {/* Controls */}
            <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentStepIndex(0)}
                  className="p-3 rounded-xl bg-white hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm"
                >
                  <RotateCcw className="w-5 h-5 text-slate-600" />
                </button>
                <button 
                  onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                  className="p-3 rounded-xl bg-white hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm"
                >
                  <SkipBack className="w-5 h-5 text-slate-600" />
                </button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-4 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                </button>
                <button 
                  onClick={() => setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
                  className="p-3 rounded-xl bg-white hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm"
                >
                  <SkipForward className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col gap-2 w-48">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    <span>Simulation Delay</span>
                    <span className="text-primary">{delay}ms</span>
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="4000" 
                    step="100"
                    value={delay}
                    onChange={(e) => setDelay(parseInt(e.target.value))}
                    className="w-full accent-primary h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="h-8 w-[1px] bg-slate-200" />
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Progress</div>
                  <div className="text-sm font-mono text-secondary">
                    {currentStepIndex + 1} <span className="text-slate-300">/</span> {steps.length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Code Panel */}
          <div className="flex-1 glass-panel overflow-hidden flex flex-col">
            <CodePanel 
              code={CODE_SNIPPETS[selectedAlgo.id][language]} 
              language={language} 
              activeLine={currentStep.line}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
