export interface Distro {
  id: string;
  name: string;
  family: 'Debian' | 'RedHat' | 'Arch' | 'Independent' | 'Security' | 'Special';
  logo: string;
  description: string;
  overview: {
    history: string;
    creator: string;
    firstRelease: string;
    philosophy: string;
    targetAudience: string;
  };
  technical: {
    base: string;
    kernel: string;
    packageManager: string;
    desktopEnvironment: string;
    initSystem: string;
    architectures: string[];
  };
  requirements: {
    minRam: string;
    recRam: string;
    cpu: string;
    disk: string;
    gpu: string;
  };
  installation: {
    step: string;
    details: string;
  }[];
  commands: {
    cmd: string;
    desc: string;
  }[];
  useCases: string[];
  securityFeatures: string[];
  pros: string[];
  cons: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  scenarios: {
    title: string;
    steps: string[];
  }[];
  popularTools: string[];
}

export const DISTRO_DATA: Distro[] = [
  {
    id: 'ubuntu',
    name: 'Ubuntu',
    family: 'Debian',
    logo: 'https://assets.ubuntu.com/v1/82818827-CoF_Orange_and_Black.png',
    description: 'The world\'s most popular Linux desktop OS and server platform.',
    overview: {
      history: 'First released in 2004 by Mark Shuttleworth and Canonical Ltd.',
      creator: 'Canonical Ltd / Mark Shuttleworth',
      firstRelease: 'October 20, 2004 (4.10 Warty Warthog)',
      philosophy: 'Linux for Human Beings. Focus on usability and accessibility.',
      targetAudience: 'Beginners, Developers, Enterprise, Cloud Engineers'
    },
    technical: {
      base: 'Debian',
      kernel: 'Linux (Monolithic)',
      packageManager: 'APT (Advanced Package Tool), Snap',
      desktopEnvironment: 'GNOME (Default), KDE, XFCE, MATE',
      initSystem: 'systemd',
      architectures: ['x86_64', 'ARM64', 'RISC-V', 's390x', 'ppc64el']
    },
    requirements: {
      minRam: '2 GB',
      recRam: '4 GB+',
      cpu: '2 GHz dual-core processor',
      disk: '25 GB',
      gpu: 'VGA capable of 1024x768 resolution'
    },
    installation: [
      { step: 'Download ISO', details: 'Get the latest LTS version from ubuntu.com/download.' },
      { step: 'Create Bootable USB', details: 'Use Rufus or BalenaEtcher to flash the ISO to a USB drive.' },
      { step: 'BIOS/UEFI Setup', details: 'Restart PC, enter BIOS (F2/Del), and set USB as primary boot device.' },
      { step: 'Disk Partitioning', details: 'Choose "Erase disk and install Ubuntu" for beginners or "Something else" for manual partitioning.' }
    ],
    commands: [
      { cmd: 'sudo apt update', desc: 'Refresh the local package database.' },
      { cmd: 'sudo apt upgrade', desc: 'Install available updates for all packages.' },
      { cmd: 'sudo apt install [package]', desc: 'Download and install a new software package.' }
    ],
    useCases: ['General Desktop', 'Web Servers', 'Cloud Computing', 'AI/ML Development'],
    securityFeatures: ['AppArmor', 'Uncomplicated Firewall (UFW)', 'Secure Boot support', 'Kernel Self-Protection'],
    pros: ['Massive community support', 'Great hardware compatibility', 'Stable LTS releases'],
    cons: ['Snap packages can be slow', 'Telemetry (minimal but present)', 'Heavier than some alternatives'],
    difficulty: 'Beginner',
    scenarios: [
      { title: 'Setup a Web Server', steps: ['sudo apt update', 'sudo apt install apache2', 'sudo ufw allow "Apache"', 'systemctl status apache2'] }
    ],
    popularTools: ['LibreOffice', 'Firefox', 'Thunderbird', 'Docker', 'VS Code']
  },
  {
    id: 'arch',
    name: 'Arch Linux',
    family: 'Arch',
    logo: 'https://archlinux.org/static/logos/archlinux-logo-dark-90dpi.png',
    description: 'A simple, lightweight distribution that you build from the ground up.',
    overview: {
      history: 'Created by Judd Vinet in 2002, inspired by CRUX Linux.',
      creator: 'Judd Vinet',
      firstRelease: 'March 11, 2002',
      philosophy: 'KISS (Keep It Simple, Stupid). User-centric, not user-friendly.',
      targetAudience: 'Advanced users, Linux enthusiasts, Minimalists'
    },
    technical: {
      base: 'Independent',
      kernel: 'Linux (Rolling)',
      packageManager: 'Pacman',
      desktopEnvironment: 'None (User choice)',
      initSystem: 'systemd',
      architectures: ['x86_64']
    },
    requirements: {
      minRam: '512 MB',
      recRam: '2 GB+',
      cpu: 'x86-64 compatible',
      disk: '2 GB (Base system)',
      gpu: 'Any'
    },
    installation: [
      { step: 'Boot Live Media', details: 'Boot into the Arch ISO environment.' },
      { step: 'Partition Disk', details: 'Use fdisk or cfdisk to create partitions.' },
      { step: 'Format & Mount', details: 'Format partitions (mkfs.ext4) and mount to /mnt.' },
      { step: 'Pacstrap', details: 'Run pacstrap /mnt base linux linux-firmware to install the core.' }
    ],
    commands: [
      { cmd: 'sudo pacman -Syu', desc: 'Synchronize and update the entire system.' },
      { cmd: 'sudo pacman -S [package]', desc: 'Install a new package.' },
      { cmd: 'sudo pacman -R [package]', desc: 'Remove a package and its dependencies.' }
    ],
    useCases: ['Custom Desktop', 'Learning Linux Internals', 'High Performance Workstations'],
    securityFeatures: ['No default open ports', 'User-defined security policy', 'Rolling security patches'],
    pros: ['Always up-to-date software', 'Arch User Repository (AUR)', 'Excellent documentation (Arch Wiki)'],
    cons: ['Difficult installation', 'Manual maintenance required', 'Can break on updates if not careful'],
    difficulty: 'Advanced',
    scenarios: [
      { title: 'Install a Desktop Environment', steps: ['pacman -S xorg', 'pacman -S gnome', 'systemctl enable gdm'] }
    ],
    popularTools: ['Pacman', 'Yay (AUR helper)', 'Vim', 'Git', 'Neofetch']
  },
  {
    id: 'kali',
    name: 'Kali Linux',
    family: 'Security',
    logo: 'https://www.kali.org/images/kali-logo.svg',
    description: 'The industry standard for penetration testing and ethical hacking.',
    overview: {
      history: 'Successor to BackTrack Linux, based on Debian Testing.',
      creator: 'Offensive Security',
      firstRelease: 'March 13, 2013',
      philosophy: 'The quieter you become, the more you are able to hear.',
      targetAudience: 'Pentesters, Security Researchers, Ethical Hackers'
    },
    technical: {
      base: 'Debian',
      kernel: 'Linux (Customized for injection)',
      packageManager: 'APT',
      desktopEnvironment: 'XFCE (Default), GNOME, KDE',
      initSystem: 'systemd',
      architectures: ['x86_64', 'ARM', 'Apple Silicon']
    },
    requirements: {
      minRam: '2 GB',
      recRam: '8 GB+',
      cpu: 'Intel Core i3 or equivalent',
      disk: '20 GB (Full install)',
      gpu: 'Any'
    },
    installation: [
      { step: 'Live Boot', details: 'Can be run directly from USB without installation.' },
      { step: 'Installer', details: 'Standard Debian-based graphical installer.' },
      { step: 'Persistence', details: 'Setup encrypted persistence on USB for mobile hacking.' }
    ],
    commands: [
      { cmd: 'sudo apt update', desc: 'Update tool repositories.' },
      { cmd: 'nmap -sV [target]', desc: 'Scan target for open ports and versions.' },
      { cmd: 'msfconsole', desc: 'Launch the Metasploit Framework.' }
    ],
    useCases: ['Penetration Testing', 'Digital Forensics', 'Reverse Engineering', 'Security Auditing'],
    securityFeatures: ['Kernel patches for wireless injection', 'Encrypted disk by default', 'Single-user root mode (optional)'],
    pros: ['600+ pre-installed security tools', 'Optimized for hacking', 'Great community support'],
    cons: ['Not for daily use', 'Security risks if used as primary OS', 'Steep learning curve for tools'],
    difficulty: 'Intermediate',
    scenarios: [
      { title: 'Network Discovery', steps: ['sudo netdiscover -r 192.168.1.0/24', 'nmap -sn 192.168.1.0/24'] }
    ],
    popularTools: ['Nmap', 'Metasploit', 'Burp Suite', 'Wireshark', 'John the Ripper']
  },
  {
    id: 'fedora',
    name: 'Fedora',
    family: 'RedHat',
    logo: 'https://getfedora.org/static/images/fedora.png',
    description: 'A forward-thinking distribution that brings the latest Linux features first.',
    overview: {
      history: 'Started in 2003 as a community project after Red Hat Linux was discontinued.',
      creator: 'Fedora Project / Red Hat',
      firstRelease: 'November 6, 2003',
      philosophy: 'Freedom, Friends, Features, First.',
      targetAudience: 'Developers, System Admins, Tech Enthusiasts'
    },
    technical: {
      base: 'Independent (Upstream for RHEL)',
      kernel: 'Linux (Latest Stable)',
      packageManager: 'DNF',
      desktopEnvironment: 'GNOME (Workstation)',
      initSystem: 'systemd',
      architectures: ['x86_64', 'ARM64']
    },
    requirements: {
      minRam: '2 GB',
      recRam: '4 GB+',
      cpu: '2 GHz dual-core',
      disk: '20 GB',
      gpu: 'Any'
    },
    installation: [
      { step: 'Fedora Media Writer', details: 'Use the official tool to create bootable media.' },
      { step: 'Anaconda Installer', details: 'Use the powerful Anaconda installer for setup.' }
    ],
    commands: [
      { cmd: 'sudo dnf update', desc: 'Update all system packages.' },
      { cmd: 'sudo dnf install [package]', desc: 'Install a new package.' },
      { cmd: 'sudo dnf search [package]', desc: 'Search for software.' }
    ],
    useCases: ['Software Development', 'Server Infrastructure', 'Workstation'],
    securityFeatures: ['SELinux (Enforcing by default)', 'Firewalld', 'Hardened build flags'],
    pros: ['Bleeding edge software', 'Pure GNOME experience', 'Excellent SELinux integration'],
    cons: ['Short support cycle (13 months)', 'Strict "Free Software" policy (requires extra repos for drivers)', 'Frequent updates'],
    difficulty: 'Intermediate',
    scenarios: [
      { title: 'Setup Development Environment', steps: ['sudo dnf groupinstall "Development Tools"', 'sudo dnf install python3-devel'] }
    ],
    popularTools: ['GNOME Software', 'DNF', 'Cockpit', 'Podman', 'Toolbox']
  },
  {
    id: 'debian',
    name: 'Debian',
    family: 'Debian',
    logo: 'https://www.debian.org/logos/openlogo-nd-100.png',
    description: 'The Universal Operating System. Known for extreme stability and freedom.',
    overview: {
      history: 'Founded by Ian Murdock in 1993. One of the oldest Linux distributions.',
      creator: 'Ian Murdock',
      firstRelease: 'August 16, 1993',
      philosophy: 'The Debian Social Contract. Focus on stability and free software.',
      targetAudience: 'Servers, Sysadmins, Stability Seekers'
    },
    technical: {
      base: 'Independent',
      kernel: 'Linux / kFreeBSD',
      packageManager: 'APT',
      desktopEnvironment: 'GNOME, KDE, XFCE, Cinnamon',
      initSystem: 'systemd',
      architectures: ['x86_64', 'i386', 'ARM', 'MIPS', 'PowerPC']
    },
    requirements: {
      minRam: '512 MB (Server)',
      recRam: '2 GB (Desktop)',
      cpu: '1 GHz',
      disk: '10 GB',
      gpu: 'Any'
    },
    installation: [
      { step: 'Download NetInst', details: 'Small ISO that downloads packages during install.' },
      { step: 'Debian Installer', details: 'Classic text-based or graphical installer.' }
    ],
    commands: [
      { cmd: 'sudo apt update', desc: 'Update package index.' },
      { cmd: 'sudo apt install [package]', desc: 'Install software.' }
    ],
    useCases: ['Enterprise Servers', 'Base for other distros', 'Mission critical systems'],
    securityFeatures: ['AppArmor', 'Security-focused patch backporting', 'Reproducible builds'],
    pros: ['Rock-solid stability', 'Huge software repository', 'Supports many architectures'],
    cons: ['Packages can be outdated (Stable branch)', 'Non-free firmware can be tricky to install', 'Conservative release cycle'],
    difficulty: 'Intermediate',
    scenarios: [
      { title: 'Setup Stable Server', steps: ['apt update', 'apt install nginx', 'ufw allow 80'] }
    ],
    popularTools: ['APT', 'Synaptic', 'GIMP', 'VLC', 'Apache']
  },
  {
    id: 'gentoo',
    name: 'Gentoo',
    family: 'Independent',
    logo: 'https://www.gentoo.org/assets/img/logo/gentoo-logo.png',
    description: 'A meta-distribution where you compile everything from source.',
    overview: {
      history: 'Created by Daniel Robbins in 2000, named after the fast penguin.',
      creator: 'Daniel Robbins',
      firstRelease: 'March 31, 2002',
      philosophy: 'Extreme configurability and performance through source compilation.',
      targetAudience: 'Power users, Developers, Performance enthusiasts'
    },
    technical: {
      base: 'Independent',
      kernel: 'Linux (Custom compiled)',
      packageManager: 'Portage (emerge)',
      desktopEnvironment: 'User choice',
      initSystem: 'OpenRC / systemd',
      architectures: ['x86_64', 'ARM', 'PPC', 'SPARC']
    },
    requirements: {
      minRam: '256 MB',
      recRam: '4 GB+',
      cpu: 'Any (Must be able to compile)',
      disk: '10 GB+',
      gpu: 'Any'
    },
    installation: [
      { step: 'Stage 3 Tarball', details: 'Download the base system archive.' },
      { step: 'Chroot', details: 'Enter the new environment from live media.' },
      { step: 'Compile Kernel', details: 'Configure and build your own kernel.' },
      { step: 'Emerge World', details: 'Compile the entire system for your CPU.' }
    ],
    commands: [
      { cmd: 'sudo emerge --sync', desc: 'Update the Portage tree.' },
      { cmd: 'sudo emerge -auvDN @world', desc: 'Update the entire system.' },
      { cmd: 'sudo emerge [package]', desc: 'Compile and install a package.' }
    ],
    useCases: ['High-performance computing', 'Learning Linux internals', 'Specific hardware optimization'],
    securityFeatures: ['Hardened Gentoo profile', 'Sandboxed compilation', 'Stack smashing protection'],
    pros: ['Ultimate control', 'Optimized for your specific CPU', 'Deep learning experience'],
    cons: ['Extremely long installation (days)', 'High power consumption during compile', 'Very complex maintenance'],
    difficulty: 'Advanced',
    scenarios: [
      { title: 'Optimize for CPU', steps: ['Edit make.conf', 'Set CFLAGS="-march=native -O2"', 'emerge -e @world'] }
    ],
    popularTools: ['Portage', 'Emerge', 'Eselect', 'GCC', 'Make']
  },
  {
    id: 'nixos',
    name: 'NixOS',
    family: 'Independent',
    logo: 'https://nixos.org/logo/nixos-logo-only-hires.png',
    description: 'A declarative Linux distribution with atomic upgrades and rollbacks.',
    overview: {
      history: 'Started as a research project by Eelco Dolstra in 2003.',
      creator: 'Eelco Dolstra',
      firstRelease: '2003',
      philosophy: 'Declarative configuration. Reproducible builds. Functional package management.',
      targetAudience: 'DevOps, Developers, Sysadmins'
    },
    technical: {
      base: 'Independent',
      kernel: 'Linux',
      packageManager: 'Nix',
      desktopEnvironment: 'User choice',
      initSystem: 'systemd',
      architectures: ['x86_64', 'ARM64']
    },
    requirements: {
      minRam: '1 GB',
      recRam: '4 GB+',
      cpu: 'x86-64',
      disk: '20 GB',
      gpu: 'Any'
    },
    installation: [
      { step: 'Partition', details: 'Standard partitioning.' },
      { step: 'Generate Config', details: 'nix-generate-config to create configuration.nix.' },
      { step: 'Edit Config', details: 'Define your entire system in one file.' },
      { step: 'Install', details: 'nixos-install to build the system from config.' }
    ],
    commands: [
      { cmd: 'sudo nixos-rebuild switch', desc: 'Apply changes in configuration.nix.' },
      { cmd: 'nix-env -i [package]', desc: 'Install package for current user.' },
      { cmd: 'nix-collect-garbage', desc: 'Remove old system generations.' }
    ],
    useCases: ['Reproducible infrastructure', 'Development environments', 'Immutable systems'],
    securityFeatures: ['Immutable system state', 'Atomic rollbacks', 'Sandboxed builds'],
    pros: ['Cannot "break" the system (just rollback)', 'Identical setup across machines', 'Declarative management'],
    cons: ['Steep learning curve for Nix language', 'Non-standard file structure (/bin/sh is almost the only thing in /bin)', 'Large disk usage'],
    difficulty: 'Advanced',
    scenarios: [
      { title: 'Rollback System', steps: ['nixos-rebuild switch --rollback', 'Select previous generation at boot'] }
    ],
    popularTools: ['Nix', 'Nix Flakes', 'Home Manager']
  },
  {
    id: 'mint',
    name: 'Linux Mint',
    family: 'Debian',
    logo: 'https://linuxmint.com/img/logo.png',
    description: 'A classic, comfortable, and easy-to-use desktop distribution.',
    overview: {
      history: 'Started in 2006 by Clement Lefebvre, based on Ubuntu.',
      creator: 'Clement Lefebvre',
      firstRelease: 'August 27, 2006',
      philosophy: 'From freedom came elegance. Focus on a traditional desktop experience.',
      targetAudience: 'Windows switchers, Beginners, Productivity users'
    },
    technical: {
      base: 'Ubuntu / Debian',
      kernel: 'Linux (LTS)',
      packageManager: 'APT',
      desktopEnvironment: 'Cinnamon (Default), MATE, XFCE',
      initSystem: 'systemd',
      architectures: ['x86_64']
    },
    requirements: {
      minRam: '2 GB',
      recRam: '4 GB+',
      cpu: '64-bit processor',
      disk: '20 GB',
      gpu: 'Any'
    },
    installation: [
      { step: 'Live Session', details: 'Boot into the live environment to test hardware.' },
      { step: 'Install Mint', details: 'Click the desktop icon to start the Ubiquity installer.' }
    ],
    commands: [
      { cmd: 'sudo apt update', desc: 'Update package lists.' },
      { cmd: 'sudo apt install [package]', desc: 'Install software.' }
    ],
    useCases: ['Home Desktop', 'Office Work', 'Media Consumption'],
    securityFeatures: ['Update Manager with safety levels', 'Timeshift for system snapshots', 'Firewall (GUFW)'],
    pros: ['Very stable', 'Traditional UI is familiar', 'Excellent out-of-the-box experience'],
    cons: ['Conservative updates', 'Based on Ubuntu (inherits some limitations)', 'No official Wayland support yet'],
    difficulty: 'Beginner',
    scenarios: [
      { title: 'System Snapshot', steps: ['Open Timeshift', 'Create a new snapshot', 'Schedule daily backups'] }
    ],
    popularTools: ['Cinnamon', 'Update Manager', 'Software Manager', 'Timeshift', 'Warpinator']
  },
  {
    id: 'manjaro',
    name: 'Manjaro',
    family: 'Arch',
    logo: 'https://manjaro.org/img/logo.svg',
    description: 'Arch Linux made easy. A user-friendly, rolling release distribution.',
    overview: {
      history: 'First released in 2011, aiming to make Arch accessible.',
      creator: 'Roland Singer and the Manjaro Team',
      firstRelease: 'July 10, 2011',
      philosophy: 'Enjoy the simplicity. Arch power without the Arch pain.',
      targetAudience: 'Gamers, Developers, Users who want Arch with less setup'
    },
    technical: {
      base: 'Arch Linux',
      kernel: 'Linux (Multiple versions available)',
      packageManager: 'Pamac / Pacman',
      desktopEnvironment: 'XFCE, KDE Plasma, GNOME',
      initSystem: 'systemd',
      architectures: ['x86_64', 'ARM']
    },
    requirements: {
      minRam: '2 GB',
      recRam: '4 GB+',
      cpu: '1 GHz+',
      disk: '30 GB',
      gpu: 'Any'
    },
    installation: [
      { step: 'Calamares', details: 'Use the user-friendly Calamares graphical installer.' },
      { step: 'Hardware Detection', details: 'Manjaro automatically detects and installs drivers (MHWD).' }
    ],
    commands: [
      { cmd: 'pamac checkupdates', desc: 'Check for updates via Pamac.' },
      { cmd: 'pamac install [package]', desc: 'Install software using Pamac.' }
    ],
    useCases: ['Gaming', 'Daily Driver', 'Development'],
    securityFeatures: ['Hardware detection for secure drivers', 'Rolling security updates', 'Steam integration'],
    pros: ['Arch software access', 'Easy installation', 'Great hardware support'],
    cons: ['Updates are delayed from Arch (can cause AUR issues)', 'Pre-installed software can be bloated', 'Community drama in the past'],
    difficulty: 'Intermediate',
    scenarios: [
      { title: 'Install NVIDIA Drivers', steps: ['sudo mhwd -a pci nonfree 0300', 'reboot'] }
    ],
    popularTools: ['Pamac', 'MHWD', 'Manjaro Settings Manager', 'Steam']
  },
  {
    id: 'tails',
    name: 'Tails',
    family: 'Security',
    logo: 'https://tails.net/lib/tails-logo.png',
    description: 'The Amnesic Incognito Live System. Privacy and anonymity by design.',
    overview: {
      history: 'First released in 2009, based on Debian.',
      creator: 'The Tails Project',
      firstRelease: 'June 23, 2009',
      philosophy: 'Preserving privacy and anonymity. Amnesic by default.',
      targetAudience: 'Journalists, Activists, Privacy-conscious users'
    },
    technical: {
      base: 'Debian',
      kernel: 'Linux (Hardened)',
      packageManager: 'APT',
      desktopEnvironment: 'GNOME',
      initSystem: 'systemd',
      architectures: ['x86_64']
    },
    requirements: {
      minRam: '2 GB',
      recRam: '4 GB+',
      cpu: 'x86-64',
      disk: '8 GB USB stick',
      gpu: 'Any'
    },
    installation: [
      { step: 'Flash USB', details: 'Tails is designed to be run from a USB stick.' },
      { step: 'Boot from USB', details: 'Never leaves a trace on the host computer.' }
    ],
    commands: [
      { cmd: 'tor-browser', desc: 'Launch the Tor Browser for anonymous web browsing.' },
      { cmd: 'sudo apt update', desc: 'Update (only if persistence is enabled).' }
    ],
    useCases: ['Anonymous Browsing', 'Secure Communication', 'Anti-Surveillance'],
    securityFeatures: ['All traffic routed through Tor', 'RAM is wiped on shutdown', 'Encrypted persistence'],
    pros: ['Extremely private', 'No trace on hardware', 'Pre-configured security'],
    cons: ['Slow browsing (Tor)', 'Not for daily use', 'Limited software persistence'],
    difficulty: 'Intermediate',
    scenarios: [
      { title: 'Secure File Transfer', steps: ['Open OnionShare', 'Select file to share', 'Send Tor link to recipient'] }
    ],
    popularTools: ['Tor Browser', 'OnionShare', 'Thunderbird', 'KeePassXC', 'Metadata Cleaner']
  },
  {
    id: 'steamos',
    name: 'SteamOS',
    family: 'Special',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Steam_icon_logo.svg',
    description: 'The gaming-focused operating system powering the Steam Deck.',
    overview: {
      history: 'Originally Debian-based, version 3.0 switched to Arch Linux.',
      creator: 'Valve Corporation',
      firstRelease: 'December 13, 2013',
      philosophy: 'Linux gaming made seamless. Console-like experience.',
      targetAudience: 'Gamers, Steam Deck users'
    },
    technical: {
      base: 'Arch Linux (v3.0+)',
      kernel: 'Linux (Custom for gaming)',
      packageManager: 'Pacman / Flatpak',
      desktopEnvironment: 'Gamescope / KDE Plasma',
      initSystem: 'systemd',
      architectures: ['x86_64']
    },
    requirements: {
      minRam: '4 GB',
      recRam: '16 GB',
      cpu: 'x86-64',
      disk: '64 GB+',
      gpu: 'Vulkan-capable'
    },
    installation: [
      { step: 'Steam Deck', details: 'Comes pre-installed on the device.' },
      { step: 'HoloISO', details: 'Community project to install on other hardware.' }
    ],
    commands: [
      { cmd: 'steamos-readonly disable', desc: 'Disable read-only mode to modify system.' },
      { cmd: 'flatpak install [app]', desc: 'Install desktop applications.' }
    ],
    useCases: ['Gaming', 'Handheld Computing', 'HTPC'],
    securityFeatures: ['Read-only root filesystem', 'Atomic updates', 'Sandboxed Flatpaks'],
    pros: ['Best Linux gaming support', 'Seamless UI', 'Optimized for handhelds'],
    cons: ['Restricted by default', 'Desktop mode is secondary', 'Hardware specific optimizations'],
    difficulty: 'Beginner',
    scenarios: [
      { title: 'Install Non-Steam App', steps: ['Switch to Desktop Mode', 'Open Discover', 'Search and install app'] }
    ],
    popularTools: ['Steam', 'Proton', 'Gamescope', 'Discover', 'Decky Loader']
  }
];
