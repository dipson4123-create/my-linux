/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, 
  Search, 
  Book, 
  Shield, 
  Cpu, 
  Info, 
  ChevronRight, 
  Command, 
  ExternalLink,
  Menu,
  X,
  Send,
  Loader2,
  Github,
  Monitor,
  CheckCircle,
  ArrowRight,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LINUX_COMMANDS, KALI_TOOLS, type LinuxCommand, type KaliTool } from './data/linuxData';
import { LINUX_CHALLENGES, type Challenge } from './data/challenges';
import { getLinuxAssistantResponse } from './services/gemini';
import { DistroHub } from './components/DistroHub/DistroHub';
import TerminalEmulator from './components/Terminal/TerminalEmulator';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any; 
  label: string; 
  active: boolean; 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
      active 
        ? "bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/20" 
        : "text-zinc-500 hover:bg-zinc-800/50 hover:text-[#00ff41]"
    )}
  >
    <Icon size={18} className={cn(active ? "text-[#00ff41]" : "text-zinc-600 group-hover:text-[#00ff41]")} />
    <span className="font-medium text-sm">{label}</span>
    {active && (
      <motion.div 
        layoutId="active-pill"
        className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00ff41] shadow-[0_0_8px_rgba(0,255,65,0.6)]"
      />
    )}
  </button>
);

const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-6 sm:mb-8">
    <h2 className="text-2xl sm:text-3xl font-bold text-[#00ff41] tracking-tight mb-2">{title}</h2>
    <p className="text-zinc-500 text-xs sm:text-sm max-w-2xl">{subtitle}</p>
  </div>
);

const CommandCard = ({ cmd }: { cmd: LinuxCommand }) => (
  <div className="bg-black/40 border border-[#00ff41]/10 rounded-xl p-4 sm:p-5 hover:border-[#00ff41]/40 transition-all group">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-zinc-900 rounded-lg text-[#00ff41]">
          <Command size={16} />
        </div>
        <h3 className="font-mono font-bold text-[#00ff41] group-hover:text-[#00ff41] transition-colors">{cmd.name}</h3>
      </div>
      <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-600 bg-zinc-900 px-2 py-1 rounded">
        {cmd.category}
      </span>
    </div>
    <p className="text-zinc-500 text-sm mb-4 line-clamp-2">{cmd.description}</p>
    <div className="bg-black/60 rounded-lg p-3 font-mono text-xs text-[#00ff41]/80 border border-[#00ff41]/10">
      <span className="text-zinc-700 mr-2">$</span>
      {cmd.usage}
    </div>
  </div>
);

const ToolCard = ({ tool }: { tool: KaliTool }) => (
  <div className="bg-black/40 border border-[#00ff41]/10 rounded-xl p-4 sm:p-5 hover:border-red-500/30 transition-all group">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-zinc-900 rounded-lg text-red-500">
          <Shield size={16} />
        </div>
        <h3 className="font-bold text-zinc-200 group-hover:text-red-500 transition-colors">{tool.name}</h3>
      </div>
      <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-600 bg-zinc-900 px-2 py-1 rounded">
        {tool.category}
      </span>
    </div>
    <p className="text-zinc-500 text-sm mb-4 line-clamp-2">{tool.description}</p>
    <div className="bg-black/60 rounded-lg p-3 font-mono text-xs text-red-500/80 border border-[#00ff41]/10">
      <span className="text-zinc-700 mr-2">#</span>
      {tool.usage}
    </div>
  </div>
);

const DipSonLogo = () => (
  <div className="flex items-center gap-2 px-2 py-1 rounded bg-[#00ff41]/10 border border-[#00ff41]/20">
    <div className="w-6 h-6 rounded bg-[#00ff41] flex items-center justify-center text-black font-black text-xs">DS</div>
    <span className="text-[10px] font-bold text-[#00ff41] uppercase tracking-tighter">it is make by dip_son</span>
  </div>
);

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'commands' | 'kali' | 'distros' | 'assistant' | 'intro' | 'terminal' | 'lab'>('intro');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Assistant State
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Lab State
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [labInput, setLabInput] = useState('');
  const [labFeedback, setLabFeedback] = useState<{ type: 'success' | 'error' | null; message: string; explanation?: string }>({ type: null, message: '' });
  const [labScore, setLabScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const response = await getLinuxAssistantResponse(userMessage, history);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  // Lab Handlers
  const handleVerifyCommand = () => {
    if (!labInput.trim()) return;

    const challenge = LINUX_CHALLENGES[currentChallengeIndex];
    const normalizedInput = labInput.trim().replace(/\s+/g, ' ');
    
    const isCorrect = challenge.expectedPatterns.some(pattern => pattern.test(normalizedInput));

    if (isCorrect) {
      setLabFeedback({
        type: 'success',
        message: 'Correct! Excellent work.',
        explanation: challenge.explanation
      });
      if (!completedChallenges.includes(challenge.id)) {
        setCompletedChallenges(prev => [...prev, challenge.id]);
        setLabScore(prev => prev + 10);
      }
    } else {
      setLabFeedback({
        type: 'error',
        message: 'Incorrect command. Try again or use a hint.',
        explanation: 'Check your syntax and ensure you are using the correct flags for the scenario.'
      });
    }
  };

  const handleNextChallenge = () => {
    if (currentChallengeIndex < LINUX_CHALLENGES.length - 1) {
      setCurrentChallengeIndex(prev => prev + 1);
      setLabInput('');
      setLabFeedback({ type: null, message: '' });
      setShowHint(false);
    }
  };

  const filteredCommands = LINUX_COMMANDS.filter(cmd => 
    cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTools = KALI_TOOLS.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-[#00ff41] font-sans selection:bg-[#00ff41]/30 selection:text-white">
      {/* Mobile/Tablet Header */}
      <div className="xl:hidden flex items-center justify-between p-4 border-b border-[#00ff41]/20 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <TerminalIcon className="text-[#00ff41]" size={24} />
          <span className="font-bold text-[#00ff41] tracking-tight">LinuxMastery</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-zinc-400 hover:text-[#00ff41] transition-colors">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-black border-r border-[#00ff41]/20 transition-transform duration-300 xl:relative xl:translate-x-0",
          !isSidebarOpen && "-translate-x-full"
        )}>
          <div className="flex flex-col h-full p-4">
            <div className="hidden xl:flex items-center gap-3 px-2 mb-8 mt-2">
              <div className="w-10 h-10 rounded-xl bg-[#00ff41]/10 flex items-center justify-center border border-[#00ff41]/20">
                <TerminalIcon className="text-[#00ff41]" size={22} />
              </div>
              <div>
                <h1 className="font-bold text-[#00ff41] tracking-tight leading-none">LinuxMastery</h1>
                <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">v2.4.0-stable</span>
              </div>
            </div>

            <nav className="space-y-1 flex-1">
              <SidebarItem 
                icon={Info} 
                label="Introduction" 
                active={activeTab === 'intro'} 
                onClick={() => { setActiveTab('intro'); setIsSidebarOpen(false); }} 
              />
              <SidebarItem 
                icon={Monitor} 
                label="Live Terminal" 
                active={activeTab === 'terminal'} 
                onClick={() => { setActiveTab('terminal'); setIsSidebarOpen(false); }} 
              />
              <SidebarItem 
                icon={CheckCircle} 
                label="Command Lab" 
                active={activeTab === 'lab'} 
                onClick={() => { setActiveTab('lab'); setIsSidebarOpen(false); }} 
              />
              <SidebarItem 
                icon={Command} 
                label="Linux Commands" 
                active={activeTab === 'commands'} 
                onClick={() => { setActiveTab('commands'); setIsSidebarOpen(false); }} 
              />
              <SidebarItem 
                icon={Shield} 
                label="Kali Linux Tools" 
                active={activeTab === 'kali'} 
                onClick={() => { setActiveTab('kali'); setIsSidebarOpen(false); }} 
              />
              <SidebarItem 
                icon={Cpu} 
                label="Distro Guide" 
                active={activeTab === 'distros'} 
                onClick={() => { setActiveTab('distros'); setIsSidebarOpen(false); }} 
              />
              <div className="pt-4 pb-2 px-4">
                <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Intelligence</span>
              </div>
              <SidebarItem 
                icon={TerminalIcon} 
                label="AI Linux Assistant" 
                active={activeTab === 'assistant'} 
                onClick={() => { setActiveTab('assistant'); setIsSidebarOpen(false); }} 
              />
            </nav>

            <div className="mt-auto pt-4 border-t border-[#00ff41]/20">
              <div className="mb-4">
                <DipSonLogo />
              </div>
              <div className="bg-zinc-900/30 rounded-xl p-4 border border-[#00ff41]/10">
                <p className="text-[11px] text-zinc-600 mb-2">System Status</p>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" />
                  <span className="text-xs text-zinc-400 font-medium">Kernel Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" />
                  <span className="text-xs text-zinc-400 font-medium">AI Core Ready</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#0a0f0a] relative">
          {/* Top Bar */}
          <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-[#00ff41]/20 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input 
                  type="text" 
                  placeholder="Search commands, tools, or distros..." 
                  className="w-full bg-black border border-[#00ff41]/20 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00ff41]/20 focus:border-[#00ff41]/50 transition-all text-[#00ff41]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-4 ml-4">
              <DipSonLogo />
              <button className="p-2 text-zinc-500 hover:text-[#00ff41] transition-colors">
                <Github size={20} />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'intro' && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-16"
                >
                  {/* Hero Section: Technical Split Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    <div className="lg:col-span-7 relative overflow-hidden rounded-3xl bg-zinc-950 border border-[#00ff41]/20 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                      <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff41]/10 border border-[#00ff41]/20 text-[#00ff41] text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse" />
                          System Version 2.4.0-Stable
                        </div>
                        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-white tracking-tighter mb-8 leading-[0.9]">
                          MASTER THE <span className="text-[#00ff41]">KERNEL.</span>
                        </h1>
                        <p className="text-zinc-500 text-lg sm:text-xl mb-10 leading-relaxed max-w-xl">
                          The definitive technical resource for Linux architecture, penetration testing, and system administration. 
                          Engineered for the next generation of security professionals.
                        </p>
                        <div className="flex flex-wrap gap-4">
                          <button 
                            onClick={() => setActiveTab('terminal')}
                            className="group px-8 py-4 bg-[#00ff41] hover:bg-[#00ff41]/90 text-black font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(0,255,65,0.2)] flex items-center gap-3"
                          >
                            INITIALIZE TERMINAL 
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                          <button 
                            onClick={() => setActiveTab('lab')}
                            className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl transition-all border border-white/10 flex items-center gap-3"
                          >
                            ENTER LAB
                            <Zap size={18} className="text-yellow-500" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Decorative Grid Background */}
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                           style={{ backgroundImage: 'radial-gradient(#00ff41 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                    </div>

                    {/* System Monitor Widget */}
                    <div className="lg:col-span-5 bg-black border border-[#00ff41]/20 rounded-3xl p-8 flex flex-col relative overflow-hidden group">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#00ff41]/10 flex items-center justify-center border border-[#00ff41]/20">
                            <Cpu className="text-[#00ff41]" size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white tracking-tight">System Monitor</p>
                            <p className="text-[10px] text-zinc-600 font-mono uppercase">Node: linuxmastery-core</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <div className="w-1 h-4 bg-[#00ff41]/20 rounded-full" />
                          <div className="w-1 h-6 bg-[#00ff41]/40 rounded-full" />
                          <div className="w-1 h-3 bg-[#00ff41]/60 rounded-full" />
                        </div>
                      </div>

                      <div className="space-y-6 flex-1">
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                            <span>CPU Usage</span>
                            <span className="text-[#00ff41]">12.4%</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '12.4%' }}
                              className="h-full bg-[#00ff41]" 
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                            <span>Memory Load</span>
                            <span className="text-cyan-400">4.2GB / 16GB</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '26%' }}
                              className="h-full bg-cyan-400" 
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                            <span>Network Traffic</span>
                            <span className="text-yellow-500">842 KB/s</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '45%' }}
                              className="h-full bg-yellow-500" 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-white/5">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5">
                            <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1">Uptime</p>
                            <p className="text-sm font-mono text-white">12d 04h 20m</p>
                          </div>
                          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5">
                            <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1">Active Users</p>
                            <p className="text-sm font-mono text-white">1,284</p>
                          </div>
                        </div>
                      </div>

                      {/* Animated Scan Line */}
                      <div className="absolute inset-x-0 top-0 h-[1px] bg-[#00ff41]/30 blur-sm animate-scan-line pointer-events-none" />
                    </div>
                  </div>

                  {/* Feature Bento Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-8 rounded-3xl bg-zinc-950 border border-white/5 hover:border-[#00ff41]/30 transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                        <Book size={80} className="text-[#00ff41]" />
                      </div>
                      <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-[#00ff41]/10 flex items-center justify-center text-[#00ff41] mb-6 border border-[#00ff41]/20">
                          <Book size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Command Library</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                          Access a comprehensive repository of 10,000+ Linux commands with detailed syntax, examples, and use cases.
                        </p>
                        <button onClick={() => setActiveTab('commands')} className="text-[#00ff41] text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                          Explore Docs <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="p-8 rounded-3xl bg-zinc-950 border border-white/5 hover:border-red-500/30 transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                        <Shield size={80} className="text-red-500" />
                      </div>
                      <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6 border border-red-500/20">
                          <Shield size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Security Toolset</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                          Master the industry-standard tools for penetration testing and ethical hacking, curated from the Kali Linux ecosystem.
                        </p>
                        <button onClick={() => setActiveTab('kali')} className="text-red-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                          View Tools <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="p-8 rounded-3xl bg-zinc-950 border border-white/5 hover:border-cyan-400/30 transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                        <TerminalIcon size={80} className="text-cyan-400" />
                      </div>
                      <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400 mb-6 border border-cyan-400/20">
                          <TerminalIcon size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">AI Assistant</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                          Leverage our neural-trained assistant to explain complex shell scripts, debug errors, and optimize your workflow.
                        </p>
                        <button onClick={() => setActiveTab('assistant')} className="text-cyan-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                          Launch AI <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Trust/Status Bar */}
                  <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 flex flex-wrap items-center justify-between gap-8">
                    <div className="flex items-center gap-8">
                      <div>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Kernel Status</p>
                        <p className="text-sm font-bold text-[#00ff41]">v6.1.0-kali-amd64</p>
                      </div>
                      <div className="w-px h-8 bg-white/10" />
                      <div>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Database</p>
                        <p className="text-sm font-bold text-white">PostgreSQL 15.2</p>
                      </div>
                      <div className="w-px h-8 bg-white/10" />
                      <div>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Encryption</p>
                        <p className="text-sm font-bold text-white">AES-256-GCM</p>
                      </div>
                    </div>
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center overflow-hidden">
                          <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-full border-2 border-black bg-[#00ff41] flex items-center justify-center text-black text-[10px] font-bold">
                        +12k
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'terminal' && (
                <motion.div
                  key="terminal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-[calc(100vh-180px)] flex flex-col"
                >
                  <SectionHeader 
                    title="Professional Linux Terminal" 
                    subtitle="A highly realistic Kali Linux terminal environment with filesystem navigation, package management, and security tools." 
                  />
                  <div className="flex-1 min-h-0">
                    <TerminalEmulator />
                  </div>
                </motion.div>
              )}

              {activeTab === 'lab' && (
                <motion.div
                  key="lab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <SectionHeader 
                    title="Command Lab (Check Area)" 
                    subtitle="Test if you know the right command for the task. Enter a task and the command you think solves it." 
                  />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-black border border-[#00ff41]/20 rounded-2xl p-6 space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-[#00ff41] flex items-center gap-2">
                          <CheckCircle size={20} /> Validator
                        </h3>
                        <span className="text-[10px] font-mono text-zinc-500">
                          Challenge {currentChallengeIndex + 1} of {LINUX_CHALLENGES.length}
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-zinc-600 uppercase mb-2">Scenario</label>
                          <div className="p-4 bg-zinc-900 rounded-lg text-sm text-zinc-300 border border-[#00ff41]/10 leading-relaxed">
                            {LINUX_CHALLENGES[currentChallengeIndex].scenario}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-zinc-600 uppercase mb-2">Your Command</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 font-mono text-sm">$</span>
                            <input 
                              type="text" 
                              value={labInput}
                              onChange={(e) => setLabInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleVerifyCommand()}
                              placeholder="Enter command here..."
                              className="w-full bg-black border border-[#00ff41]/20 rounded-lg py-3 pl-8 pr-4 text-sm focus:outline-none focus:border-[#00ff41] text-[#00ff41] font-mono transition-all"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button 
                            onClick={handleVerifyCommand}
                            className="flex-1 py-3 bg-[#00ff41] text-black font-bold rounded-lg hover:bg-[#00ff41]/80 transition-all active:scale-95"
                          >
                            Verify Command
                          </button>
                          <button 
                            onClick={() => setShowHint(!showHint)}
                            className="px-4 py-3 bg-zinc-900 text-zinc-400 font-bold rounded-lg hover:text-[#00ff41] transition-all border border-[#00ff41]/10"
                            title="Get a hint"
                          >
                            <Info size={20} />
                          </button>
                        </div>

                        <AnimatePresence>
                          {showHint && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="p-3 bg-zinc-900/50 border border-yellow-500/20 rounded-lg text-xs text-yellow-500/80 italic"
                            >
                              <span className="font-bold uppercase mr-2">Hint:</span>
                              {LINUX_CHALLENGES[currentChallengeIndex].hint}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <AnimatePresence>
                          {labFeedback.type && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={cn(
                                "p-4 rounded-lg border",
                                labFeedback.type === 'success' ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"
                              )}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                {labFeedback.type === 'success' ? <CheckCircle size={16} /> : <X size={16} />}
                                <span className="font-bold text-sm">{labFeedback.message}</span>
                              </div>
                              {labFeedback.explanation && (
                                <p className="text-xs opacity-80 leading-relaxed">
                                  {labFeedback.explanation}
                                </p>
                              )}
                              {labFeedback.type === 'success' && currentChallengeIndex < LINUX_CHALLENGES.length - 1 && (
                                <button 
                                  onClick={handleNextChallenge}
                                  className="mt-4 w-full py-2 bg-green-500 text-black font-bold rounded text-xs hover:bg-green-400 transition-all flex items-center justify-center gap-2"
                                >
                                  Next Challenge <ChevronRight size={14} />
                                </button>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="bg-black border border-[#00ff41]/20 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-[#00ff41] mb-6 flex items-center gap-2">
                        <Cpu size={20} /> Lab Status
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-[#00ff41]/5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#00ff41]/10 flex items-center justify-center text-[#00ff41]">
                              <Book size={20} />
                            </div>
                            <div>
                              <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Total Challenges</p>
                              <p className="text-lg font-bold text-[#00ff41]">{LINUX_CHALLENGES.length}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-[#00ff41]/5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                              <CheckCircle size={20} />
                            </div>
                            <div>
                              <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Completed</p>
                              <p className="text-lg font-bold text-cyan-400">{completedChallenges.length}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-[#00ff41]/5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                              <Shield size={20} />
                            </div>
                            <div>
                              <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Total Score</p>
                              <p className="text-lg font-bold text-yellow-400">{labScore} XP</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8">
                          <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mb-3">Overall Progress</p>
                          <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-[#00ff41]/10">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(completedChallenges.length / LINUX_CHALLENGES.length) * 100}%` }}
                              className="h-full bg-gradient-to-r from-[#00ff41] to-cyan-500 shadow-[0_0_10px_rgba(0,255,65,0.5)]"
                            />
                          </div>
                        </div>

                        <div className="mt-8 p-4 bg-[#00ff41]/5 rounded-xl border border-[#00ff41]/10">
                          <p className="text-xs text-zinc-500 leading-relaxed italic">
                            "The command line is the ultimate interface of power. Master it, and you master the machine."
                            <br /><span className="text-[#00ff41] font-bold not-italic mt-2 block">— dip_son</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'commands' && (
                <motion.div
                  key="commands"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SectionHeader 
                    title="Linux Command Reference" 
                    subtitle="A comprehensive list of essential Linux commands for everyday use. Search by name, description, or category." 
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCommands.map((cmd, i) => (
                      <motion.div
                        key={cmd.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <CommandCard cmd={cmd} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'kali' && (
                <motion.div
                  key="kali"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SectionHeader 
                    title="Kali Linux Toolset" 
                    subtitle="The industry standard for penetration testing. Explore the tools that make Kali the choice for security professionals." 
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTools.map((tool, i) => (
                      <motion.div
                        key={tool.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <ToolCard tool={tool} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'distros' && (
                <motion.div
                  key="distros"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <SectionHeader 
                    title="Linux Distribution Encyclopedia" 
                    subtitle="Explore the vast ecosystem of Linux distributions. From beginner-friendly desktops to advanced security platforms." 
                  />
                  <DistroHub />
                </motion.div>
              )}

              {activeTab === 'assistant' && (
                <motion.div
                  key="assistant"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-[calc(100vh-180px)] flex flex-col"
                >
                  <SectionHeader 
                    title="AI Linux Assistant" 
                    subtitle="Ask anything about Linux, Kali, or privacy. Our AI is ready to explain complex concepts or help you debug." 
                  />
                  
                  <div className="flex-1 bg-black border border-[#00ff41]/20 rounded-2xl flex flex-col overflow-hidden">
                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                          <div className="w-16 h-16 rounded-full bg-[#00ff41]/10 flex items-center justify-center text-[#00ff41] mb-2">
                            <TerminalIcon size={32} />
                          </div>
                          <h4 className="text-xl font-bold text-[#00ff41]">System Ready</h4>
                          <p className="text-zinc-600 text-sm max-w-xs">
                            Try asking: "How do I use nmap to scan for open ports?" or "Explain the Linux file permission system."
                          </p>
                        </div>
                      )}
                      {messages.map((msg, i) => (
                        <div key={i} className={cn(
                          "flex",
                          msg.role === 'user' ? "justify-end" : "justify-start"
                        )}>
                          <div className={cn(
                            "max-w-[85%] rounded-2xl p-4 shadow-lg",
                            msg.role === 'user' 
                              ? "bg-[#00ff41] text-black font-bold" 
                              : "bg-zinc-900 text-[#00ff41] border border-[#00ff41]/20"
                          )}>
                            <div className="prose prose-invert prose-sm max-w-none">
                              <Markdown>{msg.content}</Markdown>
                            </div>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-zinc-900 border border-[#00ff41]/20 rounded-2xl p-4 flex items-center gap-3">
                            <Loader2 size={18} className="animate-spin text-[#00ff41]" />
                            <span className="text-sm text-zinc-500 font-mono">Processing request...</span>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-black border-t border-[#00ff41]/20">
                      <form onSubmit={handleSendMessage} className="relative">
                        <input 
                          type="text" 
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Type your command or question..."
                          className="w-full bg-zinc-950 border border-[#00ff41]/20 rounded-xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-[#00ff41]/20 focus:border-[#00ff41]/50 transition-all text-[#00ff41]"
                        />
                        <button 
                          type="submit"
                          disabled={isLoading || !input.trim()}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#00ff41] text-black rounded-lg hover:bg-[#00ff41]/80 disabled:opacity-50 transition-all"
                        >
                          <Send size={18} />
                        </button>
                      </form>
                      <p className="text-[10px] text-zinc-700 mt-2 text-center uppercase tracking-widest font-bold">
                        Powered by Gemini 3.1 Flash Lite | it is make by dip_son
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Global Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-[#00ff41]/20 py-2 px-6 flex items-center justify-between z-50 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#00ff41] flex items-center justify-center text-black font-black text-[8px]">DS</div>
          <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">LinuxMastery © 2026 | Respect the code</span>
        </div>
        <div className="text-[10px] text-[#00ff41]/40 font-mono">it is make by dip_son</div>
      </footer>
    </div>
  );
}
