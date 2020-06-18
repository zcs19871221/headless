import { spawn } from 'child_process';
export default function getCurBranch(): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
    child.stdout?.on('data', data => {
      resolve(
        String(data)
          .trim()
          .replace(/\\n/g, ''),
      );
    });
    child.on('error', error => {
      reject(error);
    });
  });
}
