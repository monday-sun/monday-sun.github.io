import { execSync } from 'child_process';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

type FrontMatter = any;
type Content = string;

export class Post {
  static parse(filePath: string): Post {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const frontMatterEndIndex = fileContent.indexOf('---', 3);
    const frontMatter = yaml.load(
      fileContent.substring(4, frontMatterEndIndex)
    );
    const contentStartIndex = frontMatterEndIndex + 4;
    const content = fileContent.substring(contentStartIndex).trim();
    return new Post(filePath, frontMatter, content);
  }

  constructor(
    private filePath: string,
    private frontMatter: FrontMatter,
    private content: Content
  ) {}

  getFrontMatter(): FrontMatter {
    return this.frontMatter;
  }
  getFilePath(): string {
    return this.filePath;
  }

  getContent(): Content {
    return this.content;
  }

  getLastModifiedTime(): string {
    const command = `git log -1 --format=%aI -- ${this.filePath}`;
    const lastModifiedTime = execSync(command, { encoding: 'utf-8' }).trim();
    return lastModifiedTime;
  }

  addFrontMatter(key: string, value: any): void {
    this.frontMatter[key] = value;
  }

  save(): void {
    const frontMatterString = yaml.dump(this.frontMatter);
    const fileContent = `---\n${frontMatterString}---\n${this.content}`;
    fs.writeFileSync(this.filePath, fileContent);
  }
}
