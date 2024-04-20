import * as fs from 'fs';
import * as path from 'path';
import { GitFileHistory } from './git-file-history';
import { Post } from './post';
import { UpdateLastModified } from './update-last-modified';

jest.mock('fs');
jest.mock('./git-file-history');
jest.mock('./post');

describe('UpdateLastModified', () => {
  it('should update last modified time of posts', () => {
    const readdirSyncMock = jest.spyOn(fs, 'readdirSync');
    readdirSyncMock.mockReturnValue(['post1.md', 'post2.md'] as any);

    const joinMock = jest.spyOn(path, 'join');
    joinMock.mockImplementation((...args) => args.join('/'));

    const getLastModifiedTimeMock = jest.spyOn(
      GitFileHistory.prototype,
      'getLastModifiedTime'
    );
    getLastModifiedTimeMock.mockReturnValue('2022-01-01T00:00:00Z');

    const postMock = {
      getFilePath: jest.fn().mockReturnValue('posts/post1.md'),
      addFrontMatter: jest.fn(),
      save: jest.fn(),
    };

    const parseMock = jest.spyOn(Post, 'parse');
    parseMock.mockReturnValue(postMock as any);

    const updateLastModified = new UpdateLastModified('posts');
    updateLastModified.updatePostsLastModified();

    expect(readdirSyncMock).toHaveBeenCalledWith('posts');
    expect(joinMock).toHaveBeenCalledTimes(2);
    expect(joinMock).toHaveBeenNthCalledWith(1, 'posts', 'post1.md');
    expect(joinMock).toHaveBeenNthCalledWith(2, 'posts', 'post2.md');
    expect(getLastModifiedTimeMock).toHaveBeenCalledTimes(2);
    expect(postMock.addFrontMatter).toHaveBeenCalledTimes(2);
    expect(postMock.addFrontMatter).toHaveBeenNthCalledWith(
      1,
      'last_modified',
      '2022-01-01T00:00:00Z'
    );
    expect(postMock.addFrontMatter).toHaveBeenNthCalledWith(
      2,
      'last_modified',
      '2022-01-01T00:00:00Z'
    );
    expect(postMock.save).toHaveBeenCalledTimes(2);
  });
});
