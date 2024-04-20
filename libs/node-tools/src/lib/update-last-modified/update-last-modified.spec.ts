import { Post } from './post';
import {
  lastModifedKey,
  updatePostsLastModified,
} from './update-last-modified';

jest.mock('./post');

describe('updatePostsLastModified', () => {
  let postMock: any;
  let parseMock: jest.SpyInstance;

  beforeEach(() => {
    postMock = {
      getFilePath: jest
        .fn()
        .mockReturnValue('../../../../../dev-blog/_posts/post1.md'),
      addFrontMatter: jest.fn(),
      getLastModifiedTime: jest.fn().mockReturnValue('2022-01-01T00:00:00Z'),
      save: jest.fn(),
    };

    parseMock = jest.spyOn(Post, 'parse');
    parseMock.mockReturnValue(postMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should parse and update last modified time of a single post', () => {
    updatePostsLastModified(['dev-blog/_posts/post1.md', 'other-file.md']);

    expect(parseMock).toHaveBeenCalledWith(
      '../../../../../dev-blog/_posts/post1.md'
    );
    expect(postMock.getLastModifiedTime).toHaveBeenCalledTimes(1);
    expect(postMock.addFrontMatter).toHaveBeenCalledTimes(1);
    expect(postMock.addFrontMatter).toHaveBeenCalledWith(
      lastModifedKey,
      '2022-01-01T00:00:00Z'
    );
    expect(postMock.save).toHaveBeenCalledTimes(1);
  });

  it('should parse and update last modified time of multiple posts', () => {
    updatePostsLastModified([
      'dev-blog/_posts/post1.md',
      'dev-blog/_posts/post2.md',
    ]);

    expect(parseMock).toHaveBeenCalledWith(
      '../../../../../dev-blog/_posts/post1.md'
    );
    expect(parseMock).toHaveBeenCalledWith(
      '../../../../../dev-blog/_posts/post2.md'
    );
    expect(postMock.getLastModifiedTime).toHaveBeenCalledTimes(2);
    expect(postMock.addFrontMatter).toHaveBeenCalledTimes(2);
    expect(postMock.addFrontMatter).toHaveBeenCalledWith(
      lastModifedKey,
      '2022-01-01T00:00:00Z'
    );
    expect(postMock.save).toHaveBeenCalledTimes(2);
  });
});
