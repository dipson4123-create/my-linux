export interface LinuxCommand {
  name: string;
  description: string;
  category: string;
  usage: string;
}

export interface KaliTool {
  name: string;
  description: string;
  category: string;
  usage: string;
}

export const LINUX_COMMANDS: LinuxCommand[] = [
  // 1. Basic Navigation
  { name: 'pwd', description: 'Show current directory', category: 'Basic Navigation', usage: 'pwd' },
  { name: 'ls', description: 'List directory contents', category: 'Basic Navigation', usage: 'ls' },
  { name: 'ls -l', description: 'Detailed list of files', category: 'Basic Navigation', usage: 'ls -l' },
  { name: 'ls -a', description: 'Show hidden files', category: 'Basic Navigation', usage: 'ls -a' },
  { name: 'cd folder', description: 'Enter a folder', category: 'Basic Navigation', usage: 'cd Documents' },
  { name: 'cd ..', description: 'Go back one directory', category: 'Basic Navigation', usage: 'cd ..' },
  { name: 'cd /', description: 'Go to root directory', category: 'Basic Navigation', usage: 'cd /' },
  { name: 'tree', description: 'Show folder tree structure', category: 'Basic Navigation', usage: 'tree' },
  { name: 'clear', description: 'Clear terminal screen', category: 'Basic Navigation', usage: 'clear' },
  { name: 'history', description: 'Show command history', category: 'Basic Navigation', usage: 'history' },

  // 2. File & Folder Management
  { name: 'mkdir name', description: 'Create a new folder', category: 'File Management', usage: 'mkdir my_folder' },
  { name: 'rmdir name', description: 'Remove an empty folder', category: 'File Management', usage: 'rmdir old_folder' },
  { name: 'rm file', description: 'Delete a file', category: 'File Management', usage: 'rm data.txt' },
  { name: 'rm -rf folder', description: 'Delete folder forcefully', category: 'File Management', usage: 'rm -rf target_folder' },
  { name: 'cp file1 file2', description: 'Copy file', category: 'File Management', usage: 'cp source.txt backup.txt' },
  { name: 'mv file1 file2', description: 'Move or rename file', category: 'File Management', usage: 'mv old.txt new.txt' },
  { name: 'touch file', description: 'Create an empty file', category: 'File Management', usage: 'touch index.html' },
  { name: 'stat file', description: 'Show detailed file info', category: 'File Management', usage: 'stat config.json' },
  { name: 'file name', description: 'Show file type', category: 'File Management', usage: 'file image.png' },
  { name: 'basename path', description: 'Extract file name from path', category: 'File Management', usage: 'basename /etc/passwd' },
  { name: 'dirname path', description: 'Extract directory from path', category: 'File Management', usage: 'dirname /etc/passwd' },
  { name: 'realpath file', description: 'Show full absolute path', category: 'File Management', usage: 'realpath script.sh' },
  { name: 'unlink file', description: 'Remove a file', category: 'File Management', usage: 'unlink temp.log' },
  { name: 'chattr', description: 'Change file attributes', category: 'File Management', usage: 'sudo chattr +i file.txt' },
  { name: 'lsattr', description: 'Show file attributes', category: 'File Management', usage: 'lsattr file.txt' },

  // 3. File Viewing & Editing
  { name: 'cat file', description: 'Show file content', category: 'File Viewing', usage: 'cat /etc/hosts' },
  { name: 'tac file', description: 'Show content in reverse', category: 'File Viewing', usage: 'tac log.txt' },
  { name: 'less file', description: 'Scrollable file view', category: 'File Viewing', usage: 'less large_file.txt' },
  { name: 'more file', description: 'Paginated file view', category: 'File Viewing', usage: 'more file.txt' },
  { name: 'head file', description: 'Show first 10 lines', category: 'File Viewing', usage: 'head -n 5 file.txt' },
  { name: 'tail file', description: 'Show last 10 lines', category: 'File Viewing', usage: 'tail -n 5 file.txt' },
  { name: 'tail -f file', description: 'Live log view', category: 'File Viewing', usage: 'tail -f /var/log/syslog' },
  { name: 'nano file', description: 'Simple text editor', category: 'File Editing', usage: 'nano config.conf' },
  { name: 'vi file', description: 'Advanced text editor', category: 'File Editing', usage: 'vi script.py' },
  { name: 'wc file', description: 'Count words/lines', category: 'Text Processing', usage: 'wc -l file.txt' },
  { name: 'nl file', description: 'Number lines in file', category: 'Text Processing', usage: 'nl file.txt' },
  { name: 'column file', description: 'Format text into columns', category: 'Text Processing', usage: 'column -t data.csv' },

  // 4. Search & Text Processing
  { name: 'find / -name file', description: 'Find file by name', category: 'Search', usage: 'find /home -name "*.txt"' },
  { name: 'locate file', description: 'Fast file search using database', category: 'Search', usage: 'locate passwd' },
  { name: 'which cmd', description: 'Show path of a command', category: 'Search', usage: 'which python3' },
  { name: 'whereis cmd', description: 'Find binary, source, and manual', category: 'Search', usage: 'whereis ls' },
  { name: 'grep word file', description: 'Search for a word in file', category: 'Text Processing', usage: 'grep "error" app.log' },
  { name: 'egrep', description: 'Extended grep (regex)', category: 'Text Processing', usage: 'egrep "admin|root" users.txt' },
  { name: 'awk', description: 'Pattern scanning and processing', category: 'Text Processing', usage: "awk '{print $1}' file.txt" },
  { name: 'sed', description: 'Stream editor for filtering/transforming', category: 'Text Processing', usage: "sed 's/old/new/g' file.txt" },
  { name: 'cut', description: 'Extract columns from text', category: 'Text Processing', usage: "cut -d':' -f1 /etc/passwd" },
  { name: 'paste', description: 'Merge lines of files', category: 'Text Processing', usage: 'paste file1.txt file2.txt' },
  { name: 'sort', description: 'Sort lines of text', category: 'Text Processing', usage: 'sort file.txt' },
  { name: 'uniq', description: 'Remove duplicate lines', category: 'Text Processing', usage: 'sort file.txt | uniq' },
  { name: 'tr', description: 'Translate or delete characters', category: 'Text Processing', usage: "cat file.txt | tr 'a-z' 'A-Z'" },
  { name: 'xargs', description: 'Pass output as arguments', category: 'Text Processing', usage: 'find . -name "*.tmp" | xargs rm' },
  { name: 'strings file', description: 'Extract readable text from binary', category: 'Text Processing', usage: 'strings /bin/ls' },

  // 5. User & Permission
  { name: 'whoami', description: 'Show current user', category: 'User Info', usage: 'whoami' },
  { name: 'who', description: 'Show logged in users', category: 'User Info', usage: 'who' },
  { name: 'w', description: 'Show user activity', category: 'User Info', usage: 'w' },
  { name: 'id', description: 'Show user and group IDs', category: 'User Info', usage: 'id root' },
  { name: 'groups', description: 'Show user groups', category: 'User Info', usage: 'groups user' },
  { name: 'passwd', description: 'Change user password', category: 'User Management', usage: 'passwd' },
  { name: 'useradd', description: 'Add a new user', category: 'User Management', usage: 'sudo useradd newuser' },
  { name: 'userdel', description: 'Delete a user', category: 'User Management', usage: 'sudo userdel olduser' },
  { name: 'usermod', description: 'Modify user account', category: 'User Management', usage: 'sudo usermod -aG sudo user' },
  { name: 'chmod 777 file', description: 'Change file permissions', category: 'Permissions', usage: 'chmod 755 script.sh' },
  { name: 'chown user file', description: 'Change file owner', category: 'Permissions', usage: 'sudo chown root:root file.txt' },
  { name: 'umask', description: 'Set default file permissions', category: 'Permissions', usage: 'umask 022' },

  // 6. Process Management
  { name: 'ps aux', description: 'Show all running processes', category: 'Processes', usage: 'ps aux' },
  { name: 'top', description: 'Live process monitor', category: 'Processes', usage: 'top' },
  { name: 'htop', description: 'Interactive process monitor', category: 'Processes', usage: 'htop' },
  { name: 'kill pid', description: 'Stop a process by ID', category: 'Processes', usage: 'kill 1234' },
  { name: 'kill -9 pid', description: 'Force stop a process', category: 'Processes', usage: 'kill -9 1234' },
  { name: 'killall name', description: 'Kill process by name', category: 'Processes', usage: 'killall firefox' },
  { name: 'pkill name', description: 'Kill process by pattern', category: 'Processes', usage: 'pkill -u root' },
  { name: 'bg', description: 'Send job to background', category: 'Processes', usage: 'bg %1' },
  { name: 'fg', description: 'Bring job to foreground', category: 'Processes', usage: 'fg %1' },
  { name: 'jobs', description: 'Show background jobs', category: 'Processes', usage: 'jobs' },
  { name: 'nice', description: 'Run command with priority', category: 'Processes', usage: 'nice -n 10 backup.sh' },
  { name: 'renice', description: 'Change priority of running process', category: 'Processes', usage: 'renice +5 -p 1234' },

  // 7. Network Commands
  { name: 'ip a', description: 'Show IP addresses', category: 'Networking', usage: 'ip a' },
  { name: 'ifconfig', description: 'Show network interface info', category: 'Networking', usage: 'ifconfig' },
  { name: 'ping google.com', description: 'Test network connectivity', category: 'Networking', usage: 'ping -c 4 google.com' },
  { name: 'traceroute site', description: 'Show network path to host', category: 'Networking', usage: 'traceroute google.com' },
  { name: 'mtr site', description: 'Advanced network diagnostics', category: 'Networking', usage: 'mtr google.com' },
  { name: 'netstat -tulnp', description: 'Show open ports and connections', category: 'Networking', usage: 'sudo netstat -tulnp' },
  { name: 'ss -tulnp', description: 'Show socket statistics', category: 'Networking', usage: 'ss -tulnp' },
  { name: 'tcpdump', description: 'Capture network packets', category: 'Networking', usage: 'sudo tcpdump -i eth0' },
  { name: 'wireshark', description: 'GUI network protocol analyzer', category: 'Networking', usage: 'wireshark' },
  { name: 'nc', description: 'Netcat - Swiss army knife for networking', category: 'Networking', usage: 'nc -zv 192.168.1.1 80' },
  { name: 'curl url', description: 'Transfer data from/to server', category: 'Networking', usage: 'curl -I https://google.com' },
  { name: 'wget url', description: 'Download files from web', category: 'Networking', usage: 'wget https://example.com/file.zip' },
  { name: 'ssh user@ip', description: 'Secure remote login', category: 'Networking', usage: 'ssh root@192.168.1.100' },
  { name: 'scp file user@ip:', description: 'Secure remote file copy', category: 'Networking', usage: 'scp local.txt user@remote:/tmp/' },
  { name: 'ftp', description: 'File transfer protocol', category: 'Networking', usage: 'ftp 192.168.1.1' },

  // 8. Disk & System
  { name: 'df -h', description: 'Show disk space usage', category: 'System', usage: 'df -h' },
  { name: 'du -h', description: 'Show directory size', category: 'System', usage: 'du -sh /home/user' },
  { name: 'lsblk', description: 'List block devices (disks)', category: 'System', usage: 'lsblk' },
  { name: 'blkid', description: 'Show disk UUID and info', category: 'System', usage: 'sudo blkid' },
  { name: 'mount', description: 'Mount a filesystem', category: 'System', usage: 'sudo mount /dev/sdb1 /mnt' },
  { name: 'umount', description: 'Unmount a filesystem', category: 'System', usage: 'sudo umount /mnt' },
  { name: 'fdisk -l', description: 'Show disk partitions', category: 'System', usage: 'sudo fdisk -l' },
  { name: 'reboot', description: 'Restart the system', category: 'System', usage: 'sudo reboot' },
  { name: 'shutdown now', description: 'Power off the system', category: 'System', usage: 'sudo shutdown now' },
  { name: 'uptime', description: 'Show system running time', category: 'System', usage: 'uptime' },
  { name: 'free -h', description: 'Show RAM usage', category: 'System', usage: 'free -h' },
  { name: 'uname -a', description: 'Show system and kernel info', category: 'System', usage: 'uname -a' },

  // 9. Package Management
  { name: 'apt update', description: 'Update package lists', category: 'Package Management', usage: 'sudo apt update' },
  { name: 'apt upgrade', description: 'Upgrade all installed packages', category: 'Package Management', usage: 'sudo apt upgrade' },
  { name: 'apt install name', description: 'Install a package', category: 'Package Management', usage: 'sudo apt install nmap' },
  { name: 'apt remove name', description: 'Remove a package', category: 'Package Management', usage: 'sudo apt remove nmap' },
  { name: 'apt autoremove', description: 'Clean unused dependencies', category: 'Package Management', usage: 'sudo apt autoremove' },
  { name: 'apt search name', description: 'Search for a package', category: 'Package Management', usage: 'apt search python3' },
  { name: 'dpkg -i file.deb', description: 'Install a .deb file', category: 'Package Management', usage: 'sudo dpkg -i app.deb' },
  { name: 'dpkg -l', description: 'List all installed packages', category: 'Package Management', usage: 'dpkg -l' },
];

export const KALI_TOOLS: KaliTool[] = [
  // 10. Kali Security Tools
  { name: 'Nmap', description: 'Network exploration and security auditing', category: 'Information Gathering', usage: 'nmap -sV 192.168.1.1' },
  { name: 'Masscan', description: 'Fastest internet port scanner', category: 'Information Gathering', usage: 'masscan -p80 10.0.0.0/8' },
  { name: 'Netdiscover', description: 'Active/passive network discovery', category: 'Information Gathering', usage: 'sudo netdiscover -r 192.168.1.0/24' },
  { name: 'Metasploit', description: 'Advanced exploitation framework', category: 'Exploitation Tools', usage: 'msfconsole' },
  { name: 'Searchsploit', description: 'Command-line search tool for Exploit-DB', category: 'Exploitation Tools', usage: 'searchsploit wordpress' },
  { name: 'Burp Suite', description: 'Web application security testing', category: 'Web Applications', usage: 'burpsuite' },
  { name: 'Nikto', description: 'Web server security scanner', category: 'Web Applications', usage: 'nikto -h http://example.com' },
  { name: 'Gobuster', description: 'Directory/File/DNS brute forcing', category: 'Web Applications', usage: 'gobuster dir -u http://site.com -w wordlist.txt' },
  { name: 'Dirb', description: 'Web content scanner', category: 'Web Applications', usage: 'dirb http://example.com' },
  { name: 'SQLmap', description: 'Automatic SQL injection tool', category: 'Database Assessment', usage: 'sqlmap -u "http://site.com/id=1"' },
  { name: 'Hydra', description: 'Fast network login cracker', category: 'Password Attacks', usage: 'hydra -l admin -P pass.txt ssh://192.168.1.1' },
  { name: 'John', description: 'John the Ripper password cracker', category: 'Password Attacks', usage: 'john --wordlist=rockyou.txt hashes.txt' },
  { name: 'Hashcat', description: 'World\'s fastest password cracker', category: 'Password Attacks', usage: 'hashcat -m 0 hashes.txt rockyou.txt' },
  { name: 'Airmon-ng', description: 'Enable monitor mode on wireless interface', category: 'Wireless Attacks', usage: 'sudo airmon-ng start wlan0' },
  { name: 'Airodump-ng', description: 'Capture packets from wireless networks', category: 'Wireless Attacks', usage: 'sudo airodump-ng wlan0mon' },
  { name: 'Aireplay-ng', description: 'Wireless packet injection tool', category: 'Wireless Attacks', usage: 'sudo aireplay-ng --deauth 0 -a [BSSID] wlan0mon' },
  { name: 'Aircrack-ng', description: 'Crack WEP and WPA/WPA2-PSK keys', category: 'Wireless Attacks', usage: 'aircrack-ng capture.cap' },
  { name: 'Ettercap', description: 'Comprehensive suite for MITM attacks', category: 'Sniffing & Spoofing', usage: 'sudo ettercap -G' },
  { name: 'Bettercap', description: 'The Swiss army knife for network attacks', category: 'Sniffing & Spoofing', usage: 'sudo bettercap -iface eth0' },
  { name: 'Wireshark', description: 'Network protocol analyzer', category: 'Sniffing & Spoofing', usage: 'wireshark' },
];

export const DISTROS = [
  {
    name: 'Kali Linux',
    description: 'An advanced penetration testing Linux distribution used for Penetration Testing, Ethical Hacking and network security assessments.',
    useCase: 'Cybersecurity, Penetration Testing',
    logo: 'https://www.kali.org/images/kali-logo.svg'
  },
  {
    name: 'Tails',
    description: 'The Amnesic Incognito Live System. A security-focused Debian-based Linux distribution aimed at preserving privacy and anonymity.',
    useCase: 'Privacy, Anonymity, Anti-Surveillance',
    logo: 'https://tails.net/lib/tails-logo.png'
  },
  {
    name: 'Ubuntu',
    description: 'The most popular Linux distribution for desktops and servers. Known for its user-friendliness and large community support.',
    useCase: 'General Purpose, Desktop, Server',
    logo: 'https://assets.ubuntu.com/v1/82818827-CoF_Orange_and_Black.png'
  },
  {
    name: 'Arch Linux',
    description: 'A lightweight and flexible Linux distribution that tries to Keep It Simple. It follows a rolling release model.',
    useCase: 'Advanced Users, Customization',
    logo: 'https://archlinux.org/static/logos/archlinux-logo-dark-90dpi.png'
  }
];
