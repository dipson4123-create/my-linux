import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  ArrowRight, 
  Cpu, 
  Shield, 
  Terminal as TerminalIcon, 
  Info, 
  Layers, 
  Download, 
  CheckCircle,
  X,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Zap,
  BookOpen,
  GitBranch,
  BarChart3
} from 'lucide-react';
import { DISTRO_DATA, type Distro } from '../../data/distroData';
import TerminalEmulator from '../Terminal/TerminalEmulator';

// --- Sub-components ---

const TerminalSimulator = ({ initialCommand = '' }: { initialCommand?: string }) => {
  return (
    <div className="h-80">
      <TerminalEmulator initialCommand={initialCommand} />
    </div>
  );
};

const Badge = ({ children, color = 'green' }: { children: React.ReactNode, color?: 'green' | 'blue' | 'yellow' | 'red' | 'purple' }) => {
  const colors = {
    green: 'bg-[#00ff41]/10 text-[#00ff41] border-[#00ff41]/20',
    blue: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${colors[color]}`}>
      {children}
    </span>
  );
};

const DistroCard = ({ distro, onClick }: { distro: Distro, onClick: () => void }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="bg-black border border-[#00ff41]/10 rounded-2xl p-6 hover:border-[#00ff41]/40 transition-all cursor-pointer group relative overflow-hidden h-full flex flex-col"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
        <Layers size={48} className="text-[#00ff41]" />
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/5 p-2 flex items-center justify-center border border-[#00ff41]/10">
          <img src={distro.logo} alt={distro.name} className="max-w-full max-h-full object-contain grayscale brightness-200" referrerPolicy="no-referrer" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#00ff41] group-hover:text-white transition-colors">{distro.name}</h3>
          <div className="flex gap-2 mt-1">
            <Badge color={distro.difficulty === 'Beginner' ? 'green' : distro.difficulty === 'Intermediate' ? 'yellow' : 'red'}>
              {distro.difficulty}
            </Badge>
            <Badge color="blue">{distro.family}</Badge>
          </div>
        </div>
      </div>
      
      <p className="text-zinc-500 text-sm line-clamp-2 mb-6 flex-grow">{distro.description}</p>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#00ff41]/5">
        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{distro.technical.packageManager}</span>
        <div className="flex items-center gap-1 text-[#00ff41] text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
          Explore <ArrowRight size={14} />
        </div>
      </div>
    </motion.div>
  );
};

const DistroDetail = ({ distro, onClose }: { distro: Distro, onClose: () => void }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'technical', label: 'Technical', icon: Cpu },
    { id: 'installation', label: 'Installation', icon: Download },
    { id: 'commands', label: 'Commands', icon: TerminalIcon },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'scenarios', label: 'Labs', icon: Zap },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-zinc-950 border border-[#00ff41]/30 w-full max-w-6xl h-full max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,255,65,0.1)]"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 md:p-8 border-b border-[#00ff41]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-black gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-white/5 p-2 sm:p-3 flex items-center justify-center border border-[#00ff41]/20 shrink-0">
              <img src={distro.logo} alt={distro.name} className="max-w-full max-h-full object-contain grayscale brightness-200" referrerPolicy="no-referrer" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#00ff41]">{distro.name}</h2>
                <Badge color={distro.difficulty === 'Beginner' ? 'green' : distro.difficulty === 'Intermediate' ? 'yellow' : 'red'}>
                  {distro.difficulty}
                </Badge>
              </div>
              <p className="text-zinc-400 text-xs sm:text-sm md:text-base max-w-2xl line-clamp-2 sm:line-clamp-none">{distro.description}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 sm:static w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-red-500/20 transition-all"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-20 md:w-64 border-r border-[#00ff41]/10 bg-black/50 overflow-y-auto">
            <div className="p-4 space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all group",
                    activeSection === section.id 
                      ? "bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/20" 
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                  )}
                >
                  <section.icon size={20} className={activeSection === section.id ? "text-[#00ff41]" : "text-zinc-600 group-hover:text-zinc-400"} />
                  <span className="hidden md:block font-bold text-sm">{section.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 bg-zinc-950/50">
            <AnimatePresence mode="wait">
              {activeSection === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-[#00ff41] flex items-center gap-2">
                        <BookOpen size={20} /> Philosophy & History
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-zinc-900/50 rounded-2xl border border-white/5">
                          <p className="text-xs font-bold text-zinc-600 uppercase mb-1">Philosophy</p>
                          <p className="text-zinc-300 leading-relaxed italic">"{distro.overview.philosophy}"</p>
                        </div>
                        <div className="p-4 bg-zinc-900/50 rounded-2xl border border-white/5">
                          <p className="text-xs font-bold text-zinc-600 uppercase mb-1">History</p>
                          <p className="text-zinc-300 leading-relaxed">{distro.overview.history}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
                        <Layers size={20} /> Use Cases
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {distro.useCases.map((use, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-cyan-500/5 rounded-xl border border-cyan-500/10">
                            <CheckCircle size={16} className="text-cyan-500" />
                            <span className="text-sm text-zinc-300">{use}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-6 bg-zinc-900/30 rounded-2xl border border-white/5 text-center">
                      <p className="text-[10px] font-bold text-zinc-600 uppercase mb-2">Creator</p>
                      <p className="text-lg font-bold text-white">{distro.overview.creator}</p>
                    </div>
                    <div className="p-6 bg-zinc-900/30 rounded-2xl border border-white/5 text-center">
                      <p className="text-[10px] font-bold text-zinc-600 uppercase mb-2">First Release</p>
                      <p className="text-lg font-bold text-white">{distro.overview.firstRelease}</p>
                    </div>
                    <div className="p-6 bg-zinc-900/30 rounded-2xl border border-white/5 text-center">
                      <p className="text-[10px] font-bold text-zinc-600 uppercase mb-2">Target Audience</p>
                      <p className="text-lg font-bold text-white">{distro.overview.targetAudience}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 'technical' && (
                <motion.div
                  key="technical"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-[#00ff41] flex items-center gap-2">
                        <Cpu size={20} /> Core Architecture
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'Base Distro', value: distro.technical.base },
                          { label: 'Kernel', value: distro.technical.kernel },
                          { label: 'Package Manager', value: distro.technical.packageManager },
                          { label: 'Init System', value: distro.technical.initSystem },
                          { label: 'Desktop Env', value: distro.technical.desktopEnvironment },
                        ].map((item, i) => (
                          <div key={i} className="p-4 bg-zinc-900/50 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1">{item.label}</p>
                            <p className="text-sm font-bold text-white">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-yellow-500 flex items-center gap-2">
                        <BarChart3 size={20} /> System Requirements
                      </h3>
                      <div className="space-y-3">
                        {[
                          { label: 'Minimum RAM', value: distro.requirements.minRam },
                          { label: 'Recommended RAM', value: distro.requirements.recRam },
                          { label: 'CPU', value: distro.requirements.cpu },
                          { label: 'Disk Space', value: distro.requirements.disk },
                          { label: 'GPU', value: distro.requirements.gpu },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-yellow-500/5 rounded-xl border border-yellow-500/10">
                            <span className="text-xs font-bold text-zinc-500 uppercase">{item.label}</span>
                            <span className="text-sm font-bold text-yellow-400">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 'installation' && (
                <motion.div
                  key="installation"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <h3 className="text-xl font-bold text-[#00ff41] flex items-center gap-2">
                    <Download size={20} /> Installation Guide
                  </h3>
                  <div className="space-y-6">
                    {distro.installation.map((step, i) => (
                      <div key={i} className="flex gap-6 group">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-[#00ff41]/10 border border-[#00ff41]/30 flex items-center justify-center text-[#00ff41] font-bold text-sm z-10 group-hover:bg-[#00ff41] group-hover:text-black transition-all">
                            {i + 1}
                          </div>
                          {i < distro.installation.length - 1 && (
                            <div className="w-0.5 flex-1 bg-zinc-800 my-2" />
                          )}
                        </div>
                        <div className="pb-8">
                          <h4 className="text-lg font-bold text-white mb-2">{step.step}</h4>
                          <p className="text-zinc-500 text-sm leading-relaxed">{step.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeSection === 'commands' && (
                <motion.div
                  key="commands"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-8">
                      <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
                        <TerminalIcon size={20} /> Essential Commands
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {distro.commands.map((cmd, i) => (
                          <div key={i} className="bg-black border border-white/5 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group">
                            <div className="flex items-center justify-between mb-4">
                              <code className="text-cyan-400 font-mono text-lg font-bold">$ {cmd.cmd}</code>
                              <button className="text-zinc-600 hover:text-cyan-400 transition-colors">
                                <ExternalLink size={16} />
                              </button>
                            </div>
                            <p className="text-zinc-500 text-sm">{cmd.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-8">
                      <h3 className="text-xl font-bold text-[#00ff41] flex items-center gap-2">
                        <TerminalIcon size={20} /> Live Practice
                      </h3>
                      <p className="text-zinc-500 text-sm">Try running the commands listed on the left in this simulated environment.</p>
                      <TerminalSimulator />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-red-500 flex items-center gap-2">
                        <Shield size={20} /> Security Hardening
                      </h3>
                      <div className="space-y-3">
                        {distro.securityFeatures.map((feat, i) => (
                          <div key={i} className="flex items-center gap-3 p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                            <Shield size={16} className="text-red-500" />
                            <span className="text-sm font-bold text-zinc-300">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-purple-500 flex items-center gap-2">
                        <Zap size={20} /> Popular Tools
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {distro.popularTools.map((tool, i) => (
                          <span key={i} className="px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl text-xs font-bold">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 'scenarios' && (
                <motion.div
                  key="scenarios"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-8">
                      <h3 className="text-xl font-bold text-yellow-500 flex items-center gap-2">
                        <Zap size={20} /> Real-World Labs
                      </h3>
                      <div className="space-y-6">
                        {distro.scenarios.map((scenario, i) => (
                          <div key={i} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8">
                            <h4 className="text-xl font-bold text-white mb-6">{scenario.title}</h4>
                            <div className="space-y-4">
                              {scenario.steps.map((step, j) => (
                                <div key={j} className="flex items-center gap-4 group">
                                  <span className="text-zinc-700 font-mono text-xs">{j + 1}.</span>
                                  <div className="flex-1 p-3 bg-black rounded-xl border border-white/5 font-mono text-sm text-[#00ff41] group-hover:border-[#00ff41]/30 transition-all">
                                    {step}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-8">
                      <h3 className="text-xl font-bold text-[#00ff41] flex items-center gap-2">
                        <TerminalIcon size={20} /> Lab Environment
                      </h3>
                      <p className="text-zinc-500 text-sm">Execute the lab steps in the terminal below to simulate the scenario.</p>
                      <TerminalSimulator />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const DistroFamilyTree = () => {
  return (
    <div className="bg-black border border-[#00ff41]/10 rounded-3xl p-8 overflow-x-auto">
      <div className="min-w-[800px] flex flex-col items-center">
        <div className="px-6 py-3 bg-[#00ff41] text-black font-bold rounded-xl mb-12 shadow-[0_0_20px_rgba(0,255,65,0.3)]">
          Linux Kernel
        </div>
        
        <div className="grid grid-cols-3 gap-20 w-full relative">
          {/* Connection Lines */}
          <div className="absolute top-[-48px] left-1/2 -translate-x-1/2 w-[66%] h-12 border-t-2 border-l-2 border-r-2 border-[#00ff41]/20 rounded-t-3xl" />
          
          {/* Debian Branch */}
          <div className="flex flex-col items-center space-y-6">
            <div className="px-4 py-2 bg-zinc-900 border border-red-500/30 text-red-500 font-bold rounded-lg mb-4">Debian</div>
            <div className="w-0.5 h-8 bg-zinc-800" />
            <div className="grid grid-cols-1 gap-3 w-full">
              {['Ubuntu', 'Mint', 'Kali', 'Pop!_OS', 'Tails'].map(d => (
                <div key={d} className="px-3 py-2 bg-zinc-900/50 border border-white/5 rounded-lg text-xs text-zinc-400 text-center hover:border-[#00ff41]/30 transition-all cursor-default">
                  {d}
                </div>
              ))}
            </div>
          </div>

          {/* RedHat Branch */}
          <div className="flex flex-col items-center space-y-6">
            <div className="px-4 py-2 bg-zinc-900 border border-blue-500/30 text-blue-500 font-bold rounded-lg mb-4">RedHat</div>
            <div className="w-0.5 h-8 bg-zinc-800" />
            <div className="grid grid-cols-1 gap-3 w-full">
              {['Fedora', 'RHEL', 'CentOS', 'Rocky', 'Alma'].map(d => (
                <div key={d} className="px-3 py-2 bg-zinc-900/50 border border-white/5 rounded-lg text-xs text-zinc-400 text-center hover:border-[#00ff41]/30 transition-all cursor-default">
                  {d}
                </div>
              ))}
            </div>
          </div>

          {/* Arch Branch */}
          <div className="flex flex-col items-center space-y-6">
            <div className="px-4 py-2 bg-zinc-900 border border-cyan-500/30 text-cyan-500 font-bold rounded-lg mb-4">Arch</div>
            <div className="w-0.5 h-8 bg-zinc-800" />
            <div className="grid grid-cols-1 gap-3 w-full">
              {['Manjaro', 'Endeavour', 'Garuda', 'Arco'].map(d => (
                <div key={d} className="px-3 py-2 bg-zinc-900/50 border border-white/5 rounded-lg text-xs text-zinc-400 text-center hover:border-[#00ff41]/30 transition-all cursor-default">
                  {d}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LearningPaths = () => {
  const paths = [
    {
      title: 'Beginner Path',
      desc: 'Start your Linux journey with user-friendly systems.',
      color: 'green',
      steps: ['Linux Mint', 'Ubuntu', 'Fedora']
    },
    {
      title: 'Security Path',
      desc: 'Master networking and penetration testing tools.',
      color: 'red',
      steps: ['Ubuntu', 'Kali Linux', 'Parrot OS', 'Tails']
    },
    {
      title: 'Advanced Path',
      desc: 'Deep dive into system internals and source code.',
      color: 'purple',
      steps: ['Arch Linux', 'Gentoo', 'NixOS']
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {paths.map((path, i) => (
        <div key={i} className="bg-black border border-white/5 rounded-3xl p-8 hover:border-[#00ff41]/20 transition-all">
          <h4 className={`text-xl font-bold mb-2 ${
            path.color === 'green' ? 'text-[#00ff41]' : path.color === 'red' ? 'text-red-500' : 'text-purple-500'
          }`}>{path.title}</h4>
          <p className="text-zinc-500 text-sm mb-8">{path.desc}</p>
          
          <div className="space-y-4">
            {path.steps.map((step, j) => (
              <div key={j} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                  {j + 1}
                </div>
                <div className="flex-1 p-3 bg-zinc-900/50 rounded-xl border border-white/5 text-sm text-zinc-300 font-bold">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const ComparisonTool = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleDistro = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedDistros = DISTRO_DATA.filter(d => selectedIds.includes(d.id));

  return (
    <div className="space-y-10">
      <div className="bg-black border border-[#00ff41]/10 rounded-3xl p-8">
        <h4 className="text-xl font-bold text-[#00ff41] mb-6 flex items-center gap-2">
          <BarChart3 size={20} /> Compare Distributions
        </h4>
        <p className="text-zinc-500 text-sm mb-8">Select up to 3 distributions to compare their technical specifications side-by-side.</p>
        
        <div className="flex flex-wrap gap-3">
          {DISTRO_DATA.map(d => (
            <button
              key={d.id}
              onClick={() => toggleDistro(d.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2",
                selectedIds.includes(d.id)
                  ? "bg-[#00ff41]/10 border-[#00ff41]/40 text-[#00ff41]"
                  : "bg-zinc-900 border-white/5 text-zinc-500 hover:border-white/20"
              )}
            >
              {selectedIds.includes(d.id) ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-zinc-700" />}
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {selectedDistros.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left text-xs font-bold text-zinc-600 uppercase border-b border-white/5">Feature</th>
                {selectedDistros.map(d => (
                  <th key={d.id} className="p-4 text-left border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <img src={d.logo} alt={d.name} className="w-8 h-8 object-contain grayscale brightness-200" referrerPolicy="no-referrer" />
                      <span className="text-[#00ff41] font-bold">{d.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { label: 'Family', key: 'family' },
                { label: 'Base', key: 'technical.base' },
                { label: 'Package Manager', key: 'technical.packageManager' },
                { label: 'Difficulty', key: 'difficulty' },
                { label: 'Init System', key: 'technical.initSystem' },
                { label: 'Kernel', key: 'technical.kernel' },
                { label: 'Min RAM', key: 'requirements.minRam' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 border-b border-white/5 text-zinc-500 font-bold">{row.label}</td>
                  {selectedDistros.map(d => {
                    const keys = row.key.split('.');
                    let val: any = d;
                    keys.forEach(k => val = val[k]);
                    return (
                      <td key={d.id} className="p-4 border-b border-white/5 text-zinc-300">
                        {row.label === 'Difficulty' ? (
                          <Badge color={val === 'Beginner' ? 'green' : val === 'Intermediate' ? 'yellow' : 'red'}>
                            {val}
                          </Badge>
                        ) : val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// --- Main Component ---

export const DistroHub = () => {
  const [search, setSearch] = useState('');
  const [familyFilter, setFamilyFilter] = useState<string | null>(null);
  const [selectedDistro, setSelectedDistro] = useState<Distro | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'tree' | 'paths' | 'compare'>('grid');

  const filteredDistros = useMemo(() => {
    return DISTRO_DATA.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || 
                            d.description.toLowerCase().includes(search.toLowerCase());
      const matchesFamily = familyFilter ? d.family === familyFilter : true;
      return matchesSearch && matchesFamily;
    });
  }, [search, familyFilter]);

  const families = Array.from(new Set(DISTRO_DATA.map(d => d.family)));

  return (
    <div className="space-y-10">
      {/* Navigation & Search */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex bg-black border border-white/10 p-1 rounded-2xl">
          <button 
            onClick={() => setViewMode('grid')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all",
              viewMode === 'grid' ? "bg-[#00ff41] text-black shadow-[0_0_15px_rgba(0,255,65,0.3)]" : "text-zinc-500 hover:text-white"
            )}
          >
            Distro Grid
          </button>
          <button 
            onClick={() => setViewMode('tree')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all",
              viewMode === 'tree' ? "bg-[#00ff41] text-black shadow-[0_0_15px_rgba(0,255,65,0.3)]" : "text-zinc-500 hover:text-white"
            )}
          >
            Family Tree
          </button>
          <button 
            onClick={() => setViewMode('paths')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all",
              viewMode === 'paths' ? "bg-[#00ff41] text-black shadow-[0_0_15px_rgba(0,255,65,0.3)]" : "text-zinc-500 hover:text-white"
            )}
          >
            Learning Paths
          </button>
          <button 
            onClick={() => setViewMode('compare')}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all",
              viewMode === 'compare' ? "bg-[#00ff41] text-black shadow-[0_0_15px_rgba(0,255,65,0.3)]" : "text-zinc-500 hover:text-white"
            )}
          >
            Comparison Tool
          </button>
        </div>

        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
          <input 
            type="text"
            placeholder="Search distributions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#00ff41]/50 transition-all text-white"
          />
        </div>
      </div>

      {viewMode === 'grid' && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setFamilyFilter(null)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all",
                familyFilter === null ? "bg-[#00ff41]/10 border-[#00ff41]/40 text-[#00ff41]" : "bg-black border-white/5 text-zinc-500 hover:border-white/20"
              )}
            >
              All Families
            </button>
            {families.map(f => (
              <button 
                key={f}
                onClick={() => setFamilyFilter(f)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all",
                  familyFilter === f ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400" : "bg-black border-white/5 text-zinc-500 hover:border-white/20"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredDistros.map((distro) => (
                <DistroCard 
                  key={distro.id} 
                  distro={distro} 
                  onClick={() => setSelectedDistro(distro)} 
                />
              ))}
            </AnimatePresence>
          </div>

          {filteredDistros.length === 0 && (
            <div className="text-center py-20">
              <p className="text-zinc-600 font-mono">No distributions found matching your criteria.</p>
            </div>
          )}
        </>
      )}

      {viewMode === 'tree' && <DistroFamilyTree />}
      {viewMode === 'paths' && <LearningPaths />}
      {viewMode === 'compare' && <ComparisonTool />}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedDistro && (
          <DistroDetail 
            distro={selectedDistro} 
            onClose={() => setSelectedDistro(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
