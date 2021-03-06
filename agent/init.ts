import path from 'path';
import * as fs from 'better-fs';

export default async function init(dir: string) {
  const workDir = '_agent';
  const configName = 'config.js';
  const mockDir = 'mock';
  if (await fs.isExist(dir)) {
    const configPath = path
      .normalize(path.join(__dirname, 'config.js'))
      .replace(/\\/g, '\\\\');
    await fs.copy(configPath, path.join(dir, workDir, configName));
    await fs.ensureMkdir(path.join(dir, workDir, mockDir));
    const file = await fs.readFile(
      path.join(__dirname, 'inject_script.js'),
      'utf-8',
    );
    await fs.writeFile(
      path.join(dir, workDir, 'inject_script.js'),
      file.replace('TO_REPLACE', configPath),
    );
  }
}
