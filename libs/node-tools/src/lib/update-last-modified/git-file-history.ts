import { execSync } from 'child_process';

export class GitFileHistory {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  getLastModifiedTime(): string {
    const command = `git log -1 --format=%aI -- ${this.filePath}`;
    const lastModifiedTime = execSync(command, { encoding: 'utf-8' }).trim();
    return lastModifiedTime;
  }
}
