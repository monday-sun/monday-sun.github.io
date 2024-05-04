import * as child_process from 'child_process';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { Post } from './post';

jest.mock('fs');
jest.mock('js-yaml');

describe('Post', () => {
  it('should parse a post', () => {
    const readFileSyncMock = jest.spyOn(fs, 'readFileSync');
    readFileSyncMock.mockReturnValue('---\ntitle: Test\n---\ncontent');

    const loadMock = jest.spyOn(yaml, 'load');
    loadMock.mockReturnValue({ title: 'Test' });

    const post = Post.parse('filePath');

    expect(readFileSyncMock).toHaveBeenCalledWith('filePath', 'utf-8');
    expect(loadMock).toHaveBeenCalledWith('title: Test\n');
    expect(post.getFrontMatter()).toEqual({ title: 'Test' });
    expect(post.getContent()).toEqual('content');
  });

  it('should add front matter to a post', () => {
    const post = new Post('filePath', { title: 'Test' }, 'content');
    post.addFrontMatter('author', 'Author');
    expect(post.getFrontMatter()).toEqual({ title: 'Test', author: 'Author' });
  });

  it('should save a post', () => {
    const dumpMock = jest.spyOn(yaml, 'dump');
    dumpMock.mockReturnValue('title: Test\nauthor: Author\n');

    const writeFileSyncMock = jest.spyOn(fs, 'writeFileSync');

    const post = new Post(
      'filePath',
      { title: 'Test', author: 'Author' },
      'content'
    );
    post.save();

    expect(dumpMock).toHaveBeenCalledWith({ title: 'Test', author: 'Author' });
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      'filePath',
      '---\ntitle: Test\nauthor: Author\n---\ncontent'
    );
  });

  it('should get the last modified time', () => {
    const execSyncMock = jest.spyOn(child_process, 'execSync');
    execSyncMock.mockReturnValue('2022-01-01T12:00:00Z');

    const post = new Post('filePath', { title: 'Test' }, 'content');
    const lastModifiedTime = post.getLastModifiedTime();

    expect(execSyncMock).toHaveBeenCalledWith(
      'git log -1 --format=%aI -- filePath',
      { encoding: 'utf-8' }
    );
    expect(lastModifiedTime).toEqual('2022-01-01T12:00:00Z');
  });
});
