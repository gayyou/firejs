import {getConfig} from "./webpack.base";

export function getWebpackConfig(mode: string) {
  let config = getConfig(mode);

  if (mode === 'development') {
    // 开发环境下进行处理
  } else {
    // 生产环境下的处理
  }

  return config;
}
