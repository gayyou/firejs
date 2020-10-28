import {compilerSpecialOrder} from "./compilerOptions";
const fs = require('fs');

/**
 * 获取优先编译的内容和普通编译内容：
 * 优先编译内容: 按照数组顺序进行编译
 * 普通编译内容: 不按顺序编译
 */
export const getCompileOrder = (): {
  specialCompile: string[];
  normalCompile: string[];
} | null => {
  let tsConfigIsExist = fs.existsSync('tsconfig.json');

  if (!tsConfigIsExist) {
    console.error('tsconfig.json is not exist');
    return null;
  }

  let refPackages = JSON.parse(fs.readFileSync('tsconfig.json').toString()).references.map(item => item.path);
  let normalCompile = getOtherArrayMember(compilerSpecialOrder, refPackages);

  if (normalCompile === null) {
    console.error(`special compiler packages is not in tsconfig.json`);
    return null;
  }

  return {
    specialCompile: compilerSpecialOrder,
    normalCompile
  }
}

function getOtherArrayMember<T>(sub: Array<T>, sup: Array<T>): T[] | null {
  let supSet = new Set(sup);

  for (let i = 0; i < sub.length; i++) {
    if (!supSet.has(sub[i])) {
      return null;
    }

    supSet.delete(sub[i]);
  }

  return Array.from(supSet);
}
