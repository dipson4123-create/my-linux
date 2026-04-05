export interface Challenge {
  id: number;
  scenario: string;
  expectedPatterns: RegExp[];
  hint: string;
  explanation: string;
}

export const LINUX_CHALLENGES: Challenge[] = [
  {
    id: 1,
    scenario: "You need to find all .log files in the /var/log directory.",
    expectedPatterns: [
      /^find\s+\/var\/log\s+(-name\s+['"]\*\.log['"]|-type\s+f\s+-name\s+['"]\*\.log['"]|-name\s+\*\.log)$/i,
      /^find\s+\/var\/log\s+(-type\s+f\s+-name\s+['"]\*\.log['"]|-name\s+['"]\*\.log['"])$/i
    ],
    hint: "Use the 'find' command with the directory path and the '-name' flag.",
    explanation: "The 'find' command searches for files in a directory hierarchy. '/var/log' is the starting point, and '-name' specifies the pattern to match."
  },
  {
    id: 2,
    scenario: "List all files in the current directory, including hidden ones, in a detailed format.",
    expectedPatterns: [
      /^ls\s+(-la|-al|-l\s+-a|-a\s+-l)$/i
    ],
    hint: "The 'ls' command has flags for 'all' and 'long' format.",
    explanation: "ls -l shows detailed information, and -a includes hidden files (those starting with a dot)."
  },
  {
    id: 3,
    scenario: "Create a new directory named 'backup' in your home folder (~).",
    expectedPatterns: [
      /^mkdir\s+(~\/backup|backup)$/i
    ],
    hint: "Use the 'mkdir' command followed by the directory name.",
    explanation: "mkdir (make directory) creates a new folder at the specified path."
  },
  {
    id: 4,
    scenario: "Change the permissions of a file named 'script.sh' so that the owner can execute it.",
    expectedPatterns: [
      /^chmod\s+(u\+x|700|755|744|a\+x|\+x)\s+script\.sh$/i
    ],
    hint: "Use 'chmod' with 'u+x' or a numeric mode.",
    explanation: "chmod (change mode) modifies file permissions. 'u+x' adds execute permission for the user (owner)."
  },
  {
    id: 5,
    scenario: "Search for the word 'error' in a file named 'syslog' located in /var/log.",
    expectedPatterns: [
      /^grep\s+(['"]?error['"]?)\s+\/var\/log\/syslog$/i
    ],
    hint: "The 'grep' command is used for searching text patterns.",
    explanation: "grep searches the named input files for lines containing a match to the given pattern."
  },
  {
    id: 6,
    scenario: "Display the last 20 lines of a file named 'access.log'.",
    expectedPatterns: [
      /^tail\s+-n\s+20\s+access\.log$/i,
      /^tail\s+-20\s+access\.log$/i
    ],
    hint: "Use the 'tail' command with the '-n' flag.",
    explanation: "tail outputs the last part of a file. -n specifies the number of lines."
  },
  {
    id: 7,
    scenario: "Copy a file named 'config.json' to a directory named '/etc/myapp/'.",
    expectedPatterns: [
      /^cp\s+config\.json\s+\/etc\/myapp\/?$/i
    ],
    hint: "Use the 'cp' command.",
    explanation: "cp (copy) duplicates files or directories."
  },
  {
    id: 8,
    scenario: "Move all files ending in '.tmp' from the current directory to '/tmp/trash/'.",
    expectedPatterns: [
      /^mv\s+\*\.tmp\s+\/tmp\/trash\/?$/i
    ],
    hint: "Use the 'mv' command with a wildcard (*).",
    explanation: "mv (move) relocates files. The asterisk (*) is a wildcard matching any characters."
  },
  {
    id: 9,
    scenario: "Delete a directory named 'old_data' and all its contents recursively.",
    expectedPatterns: [
      /^rm\s+-rf\s+old_data\/?$/i,
      /^rm\s+-r\s+-f\s+old_data\/?$/i
    ],
    hint: "Use 'rm' with the recursive (-r) and force (-f) flags.",
    explanation: "rm -rf is a powerful command that deletes a directory and everything inside it without prompting."
  },
  {
    id: 10,
    scenario: "Change the owner of 'data.csv' to a user named 'admin'.",
    expectedPatterns: [
      /^chown\s+admin\s+data\.csv$/i,
      /^sudo\s+chown\s+admin\s+data\.csv$/i
    ],
    hint: "Use the 'chown' command.",
    explanation: "chown (change owner) changes the user and/or group ownership of a file."
  }
];
