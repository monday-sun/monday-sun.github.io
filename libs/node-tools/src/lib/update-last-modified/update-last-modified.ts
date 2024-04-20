import path = require('path');
import { GitFileHistory } from './git-file-history';
import { Post } from './post';
import * as fs from 'fs';

export const lastModifedKey = 'last_modified_at';

export class UpdateLastModified {
  constructor(private postsPath: string) {}

  updatePostsLastModified(): void {
    const posts = this.getPosts();
    posts.forEach((post) => {
      const gitFileHistory = new GitFileHistory(post.getFilePath());
      const lastModifiedTime = gitFileHistory.getLastModifiedTime();
      post.addFrontMatter(lastModifedKey, lastModifiedTime);
      post.save();
    });
  }

  private getPosts() {
    return fs.readdirSync(this.postsPath).map((fileName) => {
      const filePath = path.join(this.postsPath, fileName);
      return Post.parse(filePath);
    });
  }
}

if (require.main === module) {
  const postsPath = path.join(__dirname, '../../../../../dev-blog/_posts');
  const updateLastModified = new UpdateLastModified(postsPath);
  updateLastModified.updatePostsLastModified();
}
