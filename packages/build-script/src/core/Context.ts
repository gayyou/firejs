// @ts-ignore
import _ from 'lodash';
import {contextShadowProperty} from "./constant";
const fs = require('fs');
const isUndef = (tar) => typeof tar === 'undefined' || tar === null;
const isDef = (tar) => !isUndef(tar);

interface WebpackConfigItem {
  name: string;
  chainConfig: any;
  modifyFn: Array<Function>;
}

export interface FPluginApi {
  onGetWebpackConfig: (...item: Array<any>) => void;
  applyMethod: (key: string, payload?: any) => void;
  registerMethod: (key: string, func: Function) => void;
  registerTask: (taskName: string, chainConfig: any) => void;
  registerUserWebpackConfig: (item: RegisterUserWebpackItem) => void;
}

export interface FPluginContext {
  plugins: FPlugin[];
}

export interface RegisterUserWebpackItem {
  name: string;
  validation: (value: any) => boolean;
  configWebpack: Function;
  defaultValue: any;
}

export type FPlugin = (api: FPluginApi, context: any) => any;

export class Context {

  private readonly plugins: Array<FPlugin>;

  private readonly webpackConfigArray: WebpackConfigItem[];

  private registeredMethods: Map<string, Function[]>;

  private readonly getBuildInPlugins: () => Array<FPlugin>;

  public readonly rootDir: string;

  private command: string;

  private pkg: any;

  private userRegistration: {
    [key: string]: RegisterUserWebpackItem;
  };

  private modifyWebpackConfig: Array<Array<any>>

  public webpack: any;

  private hooks: Map<string, Function[]>;

  private userConfig: any;

  constructor({getBuildInPlugins = () => [], rootDir = process.cwd(), plugins, command = 'build'}) {
    this.plugins = [...plugins];
    this.webpackConfigArray = [];
    this.registeredMethods = new Map<string, Function[]>();
    this.getBuildInPlugins = getBuildInPlugins;
    this.userRegistration = {};
    this.rootDir = rootDir;
    this.hooks = new Map<string, Function[]>();
    this.webpack = require('webpack');
    this.command = command;
    this.userConfig = this.readJSONConfig('build.json');
    this.pkg = this.readJSONConfig('package.json');
  }

  readJSONConfig(fileName: string) {
    let configIsExist = fs.existsSync(`${fileName}`);

    if (!configIsExist) {
      console.warn(`build.json is not exist`);
      return {};
    }

    return JSON.parse(fs.readFileSync(`${fileName}`).toString());
  }

  public registerUserWebpackConfig(item: RegisterUserWebpackItem) {
    this.userRegistration[item.name] = item;
  }

  registerMethod = (key: string, func: Function) => {
    let funcArray = this.registeredMethods.get(key);

    if (isUndef(funcArray)) {
      this.registeredMethods.set(key, funcArray = []);
    }

    funcArray.push(func);
  }

  applyMethod = (key: string, payload?: any) => {
    let funcArray = this.registeredMethods.get(key);

    if (isUndef(funcArray)) {
      return ;
    }

    for (let i = 0; i < funcArray.length; i++) {
      funcArray[i](payload);
    }
  }

  public registerTask = (taskName: string, chainConfig: any) => {
    let isExist = !isUndef(this.webpackConfigArray.find(item => item.name === taskName));

    if (isExist) {
      console.error(`Webpack config task ${taskName} is exist!`);
      return ;
    }

    this.webpackConfigArray.push({
      chainConfig,
      name: taskName,
      modifyFn: []
    });
  }

  public async runUserConfig() {
    Object.keys(this.userRegistration).forEach(key => {
      let {name, configWebpack, defaultValue, validation} = this.userRegistration[key];

      if (isDef(validation)) {

      }
    });
  }

  public async setup(): Promise<WebpackConfigItem[]> {
    await this.runPlugins();
    await this.runUserConfig();
    await this.runWebpackFunctions();
    return this.webpackConfigArray;
  }

  onGetWebpackConfig = (...item: Array<any>) => {
    this.modifyWebpackConfig.push(item);
  }

  /**
   * @desc 使用webpack-chain配置能够通过自定义 plugin对webpack配置进行修改，并且能够针对不同环境下，针对于各自环境下
   *       进行注册webpack修改函数，在webpack配置下能够使用
   *       通过registerTask函数初始化不同环境下的webpack-chain，注册到webpackConfigArr，是一个对象数组，这个对象数组中具
   *       有modifyFn，modifyFn存放所有注册修改webpack配置函数（通过onGetWebpackConfig函数注册）
   */
  private async runWebpackFunctions() {
    // 将注册的修改webpack配置放到各个webpack环境中
    this.modifyWebpackConfig.forEach(([name, func]) => {
      let isAll = isUndef(func);

      if (isAll) {
        this.webpackConfigArray.forEach(config => {
          config.modifyFn.push(name);
        });
      } else {
        this.webpackConfigArray.forEach(config => {
          if (config.name === name) {
            config.modifyFn.push(func);
          }
        })
      }
    });

    // 对于每个场景下的webpack配置修改函数都执行一遍
    for (let i = 0; i < this.webpackConfigArray.length; i++) {
      let webpackConfigItem = this.webpackConfigArray[i];

      for (let j = 0; j < webpackConfigItem.modifyFn.length; j++) {
        await webpackConfigItem.modifyFn[j](webpackConfigItem.chainConfig);
      }
    }
  }

  private async runPlugins() {
    let plugins: Array<FPlugin> = [...this.getBuildInPlugins(), ...this.plugins];
    let apis: FPluginApi = {
      onGetWebpackConfig: this.onGetWebpackConfig,
      applyMethod: this.applyMethod,
      registerMethod: this.registerMethod,
      registerTask: this.registerTask,
      registerUserWebpackConfig: this.registerUserWebpackConfig
    };
    let context = _.pick(this, contextShadowProperty);

    for (let i = 0; i < plugins.length; i++) {
      await plugins[i](apis, context);
    }
  }

  public onHook(hookName: string, cb: Function) {
    let funcArray = this.hooks.get(hookName);

    if (_.isUndefined(funcArray)) {
      this.hooks.set(hookName, funcArray = []);
    }

    funcArray.push(cb);
  }

  public async applyHook(hookName: string, payload?: any) {
    let funcArray = this.hooks.get(hookName);

    if (_.isUndefined(funcArray)) {
      return ;
    }

    for (let i = 0; i < funcArray.length; i++) {
      await funcArray[i](payload);
    }
  }

  public getWebpackConfigArray() {
    return this.webpackConfigArray;
  }

  public async runWebpackFn(fn: Function, value: any) {
    for (let webpackConfigInfo of this.webpackConfigArray) {
      let context = {
        ..._.pick(this, contextShadowProperty),
        taskName: webpackConfigInfo.name
      };

      await fn(webpackConfigInfo.chainConfig, value, context);
    }
  }
}
