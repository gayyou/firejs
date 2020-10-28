import {Context} from "../core/Context";
import {readUserConfig} from "../utils/readUserConfig";
const path = require('path');
const fs = require('fs');

export default async ({getBuildInPlugins, rootDir, plugins}) => {
  const command = 'build';
  const userConfig = readUserConfig();
  const context = new Context({
    getBuildInPlugins,
    rootDir,
    plugins
  });
  let {applyHook, webpack: webpackInstance, rootDir: ctxRoot} = context;
  let webpackConfigArray;

  try {
    webpackConfigArray = await context.setup();
  } catch (e) {
    console.log(e);
  }

  // 清除输出文件夹
  webpackConfigArray.forEach(v => {
    try {
      const userBuildPath = v.chainConfig.output.get('path');
      const buildPath = path.resolve(ctxRoot, userBuildPath);
      if (fs.existsSync(buildPath)) {
        fs.removeSync(buildPath);
      }
    }
    catch (e) {
      console.log(e);
    }
  });

  await applyHook(`before.${command}.load`);

  let webpackConfig = webpackConfigArray.map(item => item.chainConfig.toConfig());

  await applyHook(`before.${command}.run`);

  let compiler;
  try {
    compiler = webpackInstance(webpackConfig);
  } catch (e) {
    console.log(e);
  }
  const result = await new Promise((res, rej) => {
    compiler.run((err, stats) => {
      if (err) {
        rej(err);
        return ;
      }

      res({
        stats
      })
    });
  });

  await applyHook(`after.${command}.compile`, result);
}
