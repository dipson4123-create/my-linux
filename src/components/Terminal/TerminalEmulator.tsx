import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { VirtualFS } from './VirtualFS';

interface TerminalEmulatorProps {
  onClose?: () => void;
  initialCommand?: string;
}

const TerminalEmulator: React.FC<TerminalEmulatorProps> = ({ onClose, initialCommand }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const fsRef = useRef(new VirtualFS());
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const currentInputRef = useRef('');

  const PROMPT = '\x1b[1;32mroot@linuxmastery\x1b[0m:\x1b[1;34m~\x1b[0m# ';

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      theme: {
        background: '#000000',
        foreground: '#00ff41',
        cursor: '#00ff41',
        selectionBackground: 'rgba(0, 255, 65, 0.3)',
      },
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      fontSize: window.innerWidth < 640 ? 12 : 14,
      letterSpacing: 0.5,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    
    // Initial fit with a small delay to ensure container is ready
    setTimeout(() => fitAddon.fit(), 100);

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Use ResizeObserver for more robust fitting
    const resizeObserver = new ResizeObserver(() => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    });
    resizeObserver.observe(terminalRef.current);

    term.writeln('\x1b[1;32mWelcome to LinuxMastery Professional Terminal Emulator v2.0\x1b[0m');
    term.writeln('Type \x1b[1;33mhelp\x1b[0m to see available commands.');
    term.writeln('');

    if (initialCommand) {
      term.write(getPrompt() + initialCommand);
      term.writeln('');
      handleCommand(initialCommand);
    }

    term.write(getPrompt());

    term.onData((data) => {
      const code = data.charCodeAt(0);

      if (code === 13) { // Enter
        term.writeln('');
        handleCommand(currentInputRef.current);
        currentInputRef.current = '';
        historyIndexRef.current = -1;
        term.write(getPrompt());
      } else if (code === 127) { // Backspace
        if (currentInputRef.current.length > 0) {
          currentInputRef.current = currentInputRef.current.slice(0, -1);
          term.write('\b \b');
        }
      } else if (code === 9) { // Tab
        const suggestions = autocomplete(currentInputRef.current);
        if (suggestions.length === 1) {
          const toAdd = suggestions[0].slice(currentInputRef.current.split(' ').pop()?.length || 0);
          currentInputRef.current += toAdd;
          term.write(toAdd);
        } else if (suggestions.length > 1) {
          term.writeln('');
          term.writeln(suggestions.join('  '));
          term.write(getPrompt() + currentInputRef.current);
        }
      } else if (data === '\x1b[A') { // Up arrow
        if (historyRef.current.length > 0) {
          const newIndex = historyIndexRef.current === -1 ? historyRef.current.length - 1 : Math.max(0, historyIndexRef.current - 1);
          historyIndexRef.current = newIndex;
          const histCmd = historyRef.current[newIndex];
          term.write('\b \b'.repeat(currentInputRef.current.length));
          term.write(histCmd);
          currentInputRef.current = histCmd;
        }
      } else if (data === '\x1b[B') { // Down arrow
        if (historyIndexRef.current !== -1) {
          const newIndex = historyIndexRef.current + 1;
          if (newIndex >= historyRef.current.length) {
            historyIndexRef.current = -1;
            term.write('\b \b'.repeat(currentInputRef.current.length));
            currentInputRef.current = '';
          } else {
            historyIndexRef.current = newIndex;
            const histCmd = historyRef.current[newIndex];
            term.write('\b \b'.repeat(currentInputRef.current.length));
            term.write(histCmd);
            currentInputRef.current = histCmd;
          }
        }
      } else if (code < 32) {
        // Ignore other control chars
      } else {
        currentInputRef.current += data;
        term.write(data);
      }
    });

    return () => {
      term.dispose();
      resizeObserver.disconnect();
    };
  }, []);

  const getPrompt = () => {
    const path = fsRef.current.pwd();
    const displayPath = path === '/home/user' ? '~' : path;
    return `\x1b[1;32mroot@linuxmastery\x1b[0m:\x1b[1;34m${displayPath}\x1b[0m# `;
  };

  const autocomplete = (line: string) => {
    const parts = line.split(' ');
    const lastPart = parts[parts.length - 1];
    const commands = ['ls', 'cd', 'pwd', 'mkdir', 'touch', 'cat', 'rm', 'clear', 'help', 'nmap', 'whoami', 'uname', 'apt', 'explain'];
    
    if (parts.length === 1) {
      return commands.filter(c => c.startsWith(lastPart));
    }
    
    // File autocomplete could be added here
    return [];
  };

  const handleCommand = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const [cmd, ...args] = trimmed.split(' ');
    const term = xtermRef.current;
    if (!term) return;

    historyRef.current = [...historyRef.current, trimmed];
    historyIndexRef.current = -1;

    switch (cmd) {
      case 'clear':
        term.clear();
        break;
      case 'help':
        term.writeln('Available commands:');
        term.writeln('  ls, cd, pwd, mkdir, touch, cat, rm, clear, help, explain');
        term.writeln('  whoami, uname, hostname, uptime, date, id');
        term.writeln('  apt, nmap, hydra, sqlmap, metasploit');
        term.writeln('');
        term.writeln('Use "explain <command>" for details.');
        break;
      case 'ls':
        const files = fsRef.current.ls(args[0] || '');
        if (Array.isArray(files)) {
          term.writeln(files.join('  '));
        } else {
          term.writeln(files);
        }
        break;
      case 'pwd':
        term.writeln(fsRef.current.pwd());
        break;
      case 'cd':
        const cdErr = fsRef.current.cd(args[0] || '~');
        if (cdErr) term.writeln(cdErr);
        break;
      case 'whoami':
        term.writeln('root');
        break;
      case 'uname':
        if (args[0] === '-a') {
          term.writeln('Linux linuxmastery 6.1.0-kali-amd64 #1 SMP Debian x86_64 GNU/Linux');
        } else {
          term.writeln('Linux');
        }
        break;
      case 'hostname':
        term.writeln('linuxmastery');
        break;
      case 'uptime':
        term.writeln(' 01:12:38 up 12 days,  4:20,  1 user,  load average: 0.00, 0.01, 0.05');
        break;
      case 'date':
        term.writeln(new Date().toString());
      break;
      case 'mkdir':
        if (!args[0]) term.writeln('mkdir: missing operand');
        else {
          const err = fsRef.current.mkdir(args[0]);
          if (err) term.writeln(err);
        }
        break;
      case 'touch':
        if (!args[0]) term.writeln('touch: missing operand');
        else {
          const err = fsRef.current.touch(args[0]);
          if (err) term.writeln(err);
        }
        break;
      case 'cat':
        if (!args[0]) term.writeln('cat: missing operand');
        else term.writeln(fsRef.current.cat(args[0]));
        break;
      case 'rm':
        if (!args[0]) term.writeln('rm: missing operand');
        else {
          const recursive = args.includes('-r') || args.includes('-rf');
          const path = args.find(a => !a.startsWith('-'));
          if (path) {
            const err = fsRef.current.rm(path, recursive);
            if (err) term.writeln(err);
          }
        }
        break;
      case 'nmap':
        simulateNmap(args);
        break;
      case 'hydra':
        simulateHydra(args);
        break;
      case 'sqlmap':
        simulateSqlmap(args);
        break;
      case 'metasploit':
      case 'msfconsole':
        simulateMetasploit();
        break;
      case 'apt':
        simulateApt(args);
        break;
      case 'explain':
        explainCommand(args[0]);
        break;
      default:
        term.writeln(`bash: ${cmd}: command not found`);
    }
  };

  const simulateNmap = (args: string[]) => {
    const term = xtermRef.current;
    if (!term) return;
    term.writeln('Starting Nmap 7.93 ( https://nmap.org ) at ' + new Date().toISOString());
    term.writeln('Nmap scan report for 192.168.1.1');
    term.writeln('Host is up (0.0020s latency).');
    term.writeln('Not shown: 998 closed tcp ports (reset)');
    term.writeln('PORT     STATE SERVICE');
    term.writeln('22/tcp   open  ssh');
    term.writeln('80/tcp   open  http');
    term.writeln('443/tcp  open  https');
    term.writeln('');
    term.writeln('Nmap done: 1 IP address (1 host up) scanned in 0.45 seconds');
  };

  const simulateHydra = (args: string[]) => {
    const term = xtermRef.current;
    if (!term) return;
    term.writeln('Hydra v9.4 (c) 2022 by van Hauser/THC - Please do not use in military or secret service organizations, or for illegal purposes.');
    term.writeln('Hydra (http://www.thc.org/thc-hydra) starting at ' + new Date().toISOString());
    term.writeln('[DATA] attacking ssh://192.168.1.1:22/');
    term.writeln('[22][ssh] host: 192.168.1.1   login: admin   password: password123');
    term.writeln('1 of 1 target successfully completed, 1 valid password found');
    term.writeln('Hydra (http://www.thc.org/thc-hydra) finished at ' + new Date().toISOString());
  };

  const simulateSqlmap = (args: string[]) => {
    const term = xtermRef.current;
    if (!term) return;
    term.writeln('        ___');
    term.writeln('       __H__');
    term.writeln(' ___ ___[)]_____ ___ ___  {1.7.2#stable}');
    term.writeln('|_ -| . [,]     | .\'| . |');
    term.writeln('|___|_  [)]_|_|_|__,|  _|');
    term.writeln('      |_|V...       |_|   https://sqlmap.org');
    term.writeln('');
    term.writeln('[*] starting @ ' + new Date().toLocaleTimeString());
    term.writeln('[INFO] testing connection to the target URL');
    term.writeln('[INFO] checking if the target is protected by some kind of WAF/IPS');
    term.writeln('[INFO] testing if the target URL is stable');
    term.writeln('[INFO] testing if GET parameter \'id\' is dynamic');
    term.writeln('[INFO] confirming that GET parameter \'id\' is dynamic');
    term.writeln('[INFO] the target URL content is stable');
    term.writeln('[INFO] testing for SQL injection on GET parameter \'id\'');
    term.writeln('[INFO] testing \'AND boolean-based blind - WHERE or HAVING clause\'');
    term.writeln('[INFO] GET parameter \'id\' appears to be \'AND boolean-based blind - WHERE or HAVING clause\' injectable');
  };

  const simulateMetasploit = () => {
    const term = xtermRef.current;
    if (!term) return;
    term.writeln('                                   _');
    term.writeln('                                  | |');
    term.writeln('  _ __ ___   ___| |_ __ _ ___ _ __ | | ___ (_) |_');
    term.writeln(' | \'_ ` _ \\ / _ \\ __/ _` / __| \'_ \\| |/ _ \\| | __|');
    term.writeln(' | | | | | |  __/ || (_| \\__ \\ |_) | | (_) | | |_');
    term.writeln(' |_| |_| |_|\\___|\\__\\__,_|___/ .__/|_|\\___/|_|\\__|');
    term.writeln('                             | |');
    term.writeln('                             |_|');
    term.writeln('');
    term.writeln('       =[ metasploit v6.3.5-dev                           ]');
    term.writeln('+ -- --=[ 2295 exploits - 1201 auxiliary - 409 post       ]');
    term.writeln('+ -- --=[ 968 payloads - 45 encoders - 11 nops            ]');
    term.writeln('+ -- --=[ 9 evasion                                       ]');
    term.writeln('');
    term.writeln('Metasploit tip: Use the "help" command to learn more');
    term.writeln('');
    term.write('\x1b[1;31mmsf6\x1b[0m > ');
  };

  const simulateApt = (args: string[]) => {
    const term = xtermRef.current;
    if (!term) return;
    const sub = args[0];
    if (sub === 'update') {
      term.writeln('Hit:1 http://http.kali.org/kali kali-rolling InRelease');
      term.writeln('Reading package lists... Done');
      term.writeln('Building dependency tree... Done');
    } else if (sub === 'install') {
      term.writeln(`Reading package lists... Done`);
      term.writeln(`Building dependency tree... Done`);
      term.writeln(`The following NEW packages will be installed:`);
      term.writeln(`  ${args[1] || 'unknown'}`);
      term.writeln(`0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.`);
      term.writeln(`Need to get 0 B/124 kB of archives.`);
      term.writeln(`After this operation, 456 kB of additional disk space will be used.`);
      term.writeln(`Selecting previously unselected package ${args[1]}.`);
      term.writeln(`(Reading database ... 100%)`);
      term.writeln(`Unpacking ${args[1]} ...`);
      term.writeln(`Setting up ${args[1]} ...`);
    } else {
      term.writeln('Usage: apt [update|install|remove|search]');
    }
  };

  const explainCommand = (cmd: string) => {
    const term = xtermRef.current;
    if (!term) return;
    const explanations: Record<string, string> = {
      ls: 'ls lists directory contents.',
      cd: 'cd changes the current working directory.',
      pwd: 'pwd prints the name of the current/working directory.',
      mkdir: 'mkdir creates a new directory.',
      touch: 'touch changes file timestamps or creates an empty file.',
      cat: 'cat concatenates files and prints on the standard output.',
      rm: 'rm removes files or directories.',
      nmap: 'nmap is a network exploration tool and security / port scanner.',
      apt: 'apt is a command-line utility for installing, updating and removing software packages.',
    };
    if (explanations[cmd]) {
      term.writeln(`\x1b[1;36m${cmd}\x1b[0m: ${explanations[cmd]}`);
    } else {
      term.writeln(`No explanation found for: ${cmd}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black rounded-xl overflow-hidden border border-[#00ff41]/30 shadow-[0_0_20px_rgba(0,255,65,0.2)]">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-[#00ff41]/20">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs font-mono text-zinc-400 ml-4">root@linuxmastery: ~</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Terminal Body */}
      <div ref={terminalRef} className="flex-1 p-2 overflow-hidden" />

      {/* Terminal Status Bar */}
      <div className="px-4 py-1 bg-zinc-900 border-t border-[#00ff41]/10 flex justify-between text-[10px] font-mono text-zinc-500">
        <div className="flex space-x-4">
          <span>USER: root</span>
          <span>HOST: linuxmastery</span>
          <span>KERNEL: 6.1.0-kali</span>
        </div>
        <div className="flex space-x-4">
          <span>MEM: 1.2GB / 8GB</span>
          <span>NET: CONNECTED</span>
        </div>
      </div>
    </div>
  );
};

export default TerminalEmulator;
