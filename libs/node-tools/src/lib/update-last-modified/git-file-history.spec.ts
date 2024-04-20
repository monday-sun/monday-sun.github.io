import { execSync } from 'child_process';
import { GitFileHistory } from './git-file-history';
import * as child_process from 'child_process';

jest.mock('child_process');

describe('GitFileHistory', () => {
  it('should return the last modified time of a file', () => {
    const execSyncMock = jest.spyOn(child_process, 'execSync');
    execSyncMock.mockReturnValue('2022-01-01T00:00:00Z\n');

    const gitFileHistory = new GitFileHistory('filePath');
    const result = gitFileHistory.getLastModifiedTime();

    expect(result).toEqual('2022-01-01T00:00:00Z');
    expect(execSyncMock).toHaveBeenCalledWith(
      'git log -1 --format=%aI -- filePath',
      { encoding: 'utf-8' }
    );
  });
});
