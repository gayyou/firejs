import * as execa from 'execa';

export function run(cmd: string) {
  console.log(`run ${cmd}`);
  return execa.command(cmd, { stdio: 'inherit' });
}
