import { Post } from './post';

export const lastModifedKey = 'last_modified_at';

export function updatePostsLastModified(fileList: string[]): void {
  const posts = getPosts(fileList);
  posts.forEach((post) => {
    const lastModifiedTime = post.getLastModifiedTime();
    post.addFrontMatter(lastModifedKey, lastModifiedTime);
    post.save();
  });
}

function getPosts(fileList: string[]): Post[] {
  return fileList
    .filter((filePath) => filePath.includes('dev-blog/_posts'))
    .map((filePath) => Post.parse(`../../../../../${filePath}`));
}

if (require.main === module) {
  // Pass the files as an argument to updatePostsLastModified
  const fileList = process.argv.slice(2);
  updatePostsLastModified(fileList);
}
