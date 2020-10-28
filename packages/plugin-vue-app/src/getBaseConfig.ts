/**
 * 先读取 config/defaultConfig 对象内容，并且去userConfig目录下读取相应的文件的内容（获得修改webpack-chain的函数），最后
 * 存入到Context的configArr函数中。
 * 入口：api
 */
import {FPluginApi} from "@firejs/build-script";
import {getWebpackConfig} from "@firejs/build-script-config"

export function getBaseConfig(api: FPluginApi) {
  let {onGetWebpackConfig, registerTask} = api;
  let chainConfig = getWebpackConfig('build');

  registerTask('base', chainConfig);


}
