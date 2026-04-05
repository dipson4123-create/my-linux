export interface FSNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: { [key: string]: FSNode };
  permissions?: string;
  owner?: string;
  group?: string;
  size?: number;
  modified?: Date;
}

export class VirtualFS {
  root: FSNode;
  currentPath: string[];

  constructor() {
    this.root = {
      name: '/',
      type: 'directory',
      owner: 'root',
      group: 'root',
      permissions: 'drwxr-xr-x',
      modified: new Date(),
      children: {
        bin: { name: 'bin', type: 'directory', owner: 'root', group: 'root', permissions: 'drwxr-xr-x', modified: new Date(), children: {} },
        etc: { name: 'etc', type: 'directory', owner: 'root', group: 'root', permissions: 'drwxr-xr-x', modified: new Date(), children: {} },
        home: {
          name: 'home',
          type: 'directory',
          owner: 'root',
          group: 'root',
          permissions: 'drwxr-xr-x',
          modified: new Date(),
          children: {
            user: {
              name: 'user',
              type: 'directory',
              owner: 'user',
              group: 'user',
              permissions: 'drwxr-xr-x',
              modified: new Date(),
              children: {
                Documents: { name: 'Documents', type: 'directory', owner: 'user', group: 'user', permissions: 'drwxr-xr-x', modified: new Date(), children: {} },
                Downloads: { name: 'Downloads', type: 'directory', owner: 'user', group: 'user', permissions: 'drwxr-xr-x', modified: new Date(), children: {} },
                scripts: { name: 'scripts', type: 'directory', owner: 'user', group: 'user', permissions: 'drwxr-xr-x', modified: new Date(), children: {} },
                'welcome.txt': { name: 'welcome.txt', type: 'file', owner: 'user', group: 'user', permissions: '-rw-r--r--', modified: new Date(), size: 45, content: 'Welcome to LinuxMastery Terminal Emulator!\n' }
              }
            }
          }
        },
        root: { name: 'root', type: 'directory', owner: 'root', group: 'root', permissions: 'drwx------', modified: new Date(), children: {} },
        tools: {
          name: 'tools',
          type: 'directory',
          owner: 'root',
          group: 'root',
          permissions: 'drwxr-xr-x',
          modified: new Date(),
          children: {
            nmap: { name: 'nmap', type: 'file', owner: 'root', group: 'root', permissions: '-rwxr-xr-x', modified: new Date(), size: 1024 },
            hydra: { name: 'hydra', type: 'file', owner: 'root', group: 'root', permissions: '-rwxr-xr-x', modified: new Date(), size: 850 },
            sqlmap: { name: 'sqlmap', type: 'file', owner: 'root', group: 'root', permissions: '-rwxr-xr-x', modified: new Date(), size: 1200 },
            metasploit: { name: 'metasploit', type: 'file', owner: 'root', group: 'root', permissions: '-rwxr-xr-x', modified: new Date(), size: 5000 },
            hashcat: { name: 'hashcat', type: 'file', owner: 'root', group: 'root', permissions: '-rwxr-xr-x', modified: new Date(), size: 900 },
            'aircrack-ng': { name: 'aircrack-ng', type: 'file', owner: 'root', group: 'root', permissions: '-rwxr-xr-x', modified: new Date(), size: 750 }
          }
        },
        usr: { name: 'usr', type: 'directory', owner: 'root', group: 'root', permissions: 'drwxr-xr-x', modified: new Date(), children: {} },
        var: { name: 'var', type: 'directory', owner: 'root', group: 'root', permissions: 'drwxr-xr-x', modified: new Date(), children: {} }
      }
    };
    this.currentPath = ['home', 'user'];
  }

  getCurrentNode(): FSNode {
    let current = this.root;
    for (const part of this.currentPath) {
      if (current.children && current.children[part]) {
        current = current.children[part];
      }
    }
    return current;
  }

  resolvePath(path: string): { node: FSNode | null; parent: FSNode | null; name: string | null } {
    if (!path) return { node: this.getCurrentNode(), parent: null, name: null };

    const parts = path.startsWith('/') ? path.split('/').filter(p => p) : [...this.currentPath, ...path.split('/').filter(p => p)];
    
    // Handle .. and .
    const resolvedParts: string[] = [];
    for (const part of parts) {
      if (part === '..') {
        resolvedParts.pop();
      } else if (part !== '.') {
        resolvedParts.push(part);
      }
    }

    let current = this.root;
    let parent: FSNode | null = null;
    let lastPart: string | null = null;

    for (let i = 0; i < resolvedParts.length; i++) {
      const part = resolvedParts[i];
      if (current.children && current.children[part]) {
        parent = current;
        current = current.children[part];
        lastPart = part;
      } else {
        return { node: null, parent: current, name: part };
      }
    }

    return { node: current, parent, name: lastPart };
  }

  cd(path: string): string | null {
    const { node } = this.resolvePath(path);
    if (!node) return `bash: cd: ${path}: No such file or directory`;
    if (node.type !== 'directory') return `bash: cd: ${path}: Not a directory`;

    // Update current path
    const parts = path.startsWith('/') ? path.split('/').filter(p => p) : [...this.currentPath, ...path.split('/').filter(p => p)];
    const resolvedParts: string[] = [];
    for (const part of parts) {
      if (part === '..') {
        resolvedParts.pop();
      } else if (part !== '.') {
        resolvedParts.push(part);
      }
    }
    this.currentPath = resolvedParts;
    return null;
  }

  ls(path: string = ''): string[] | string {
    const { node } = this.resolvePath(path);
    if (!node) return `ls: cannot access '${path}': No such file or directory`;
    if (node.type === 'file') return [node.name];
    
    return Object.keys(node.children || {}).sort();
  }

  pwd(): string {
    return '/' + this.currentPath.join('/');
  }

  mkdir(path: string): string | null {
    const parts = path.split('/').filter(p => p);
    const dirName = parts.pop();
    if (!dirName) return 'mkdir: missing operand';

    const parentPath = path.startsWith('/') ? '/' + parts.join('/') : parts.join('/');
    const { node: parentNode } = this.resolvePath(parentPath || '.');

    if (!parentNode) return `mkdir: cannot create directory '${path}': No such file or directory`;
    if (parentNode.type !== 'directory') return `mkdir: cannot create directory '${path}': Not a directory`;
    if (parentNode.children && parentNode.children[dirName]) return `mkdir: cannot create directory '${path}': File exists`;

    if (!parentNode.children) parentNode.children = {};
    parentNode.children[dirName] = {
      name: dirName,
      type: 'directory',
      owner: 'user',
      group: 'user',
      permissions: 'drwxr-xr-x',
      modified: new Date(),
      children: {}
    };
    return null;
  }

  touch(path: string): string | null {
    const parts = path.split('/').filter(p => p);
    const fileName = parts.pop();
    if (!fileName) return 'touch: missing operand';

    const parentPath = path.startsWith('/') ? '/' + parts.join('/') : parts.join('/');
    const { node: parentNode } = this.resolvePath(parentPath || '.');

    if (!parentNode) return `touch: cannot touch '${path}': No such file or directory`;
    if (parentNode.type !== 'directory') return `touch: cannot touch '${path}': Not a directory`;

    if (!parentNode.children) parentNode.children = {};
    if (!parentNode.children[fileName]) {
      parentNode.children[fileName] = {
        name: fileName,
        type: 'file',
        owner: 'user',
        group: 'user',
        permissions: '-rw-r--r--',
        modified: new Date(),
        size: 0,
        content: ''
      };
    } else {
      parentNode.children[fileName].modified = new Date();
    }
    return null;
  }

  cat(path: string): string {
    const { node } = this.resolvePath(path);
    if (!node) return `cat: ${path}: No such file or directory`;
    if (node.type === 'directory') return `cat: ${path}: Is a directory`;
    return node.content || '';
  }

  rm(path: string, recursive: boolean = false): string | null {
    const { node, parent, name } = this.resolvePath(path);
    if (!node || !parent || !name) return `rm: cannot remove '${path}': No such file or directory`;
    
    if (node.type === 'directory' && !recursive) {
      return `rm: cannot remove '${path}': Is a directory`;
    }

    delete parent.children![name];
    return null;
  }
}
