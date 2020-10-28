import * as glob from "glob";
import * as path from "path";
import * as fs from "fs";
import {run} from "../fn/shell";
import {getCompileOrder} from "./config/verification";

(async function() {
  let compileOrder = getCompileOrder();

  if (compileOrder === null) {
    return ;
  }

  // 先清除所有的node_module
  run('lerna clean --yes');

  let {specialCompile, normalCompile} = compileOrder;

  for (let i = 0; i < specialCompile.length; i++) {
    await buildPackage(specialCompile[i]);
  }

  for (let i = 0; i < normalCompile.length; i++) {
    buildPackage(normalCompile[i]);
  }
})().catch(e => {
  console.error(e);
});

async function buildPackage(pkgPath: string) {
  await run(`rimraf ${pkgPath}/lib/*`);
  await run(`npx tsc --build ${pkgPath}/tsconfig.json`);
}
