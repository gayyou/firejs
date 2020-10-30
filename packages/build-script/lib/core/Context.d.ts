interface WebpackConfigItem {
    name: string;
    chainConfig: any;
    modifyFn: Array<Function>;
}
export interface FPluginApi {
    onGetWebpackConfig: Function;
    applyMethod: Function;
    registerMethod: Function;
    registerTask: (taskName: string, chainConfig: any) => void;
}
export interface FPluginContext {
    plugins: FPlugin[];
}
export declare type FPlugin = (api: FPluginApi, context: any) => any;
export declare class Context {
    private readonly plugins;
    private readonly webpackConfigArray;
    private registeredMethods;
    private readonly getBuildInPlugins;
    rootDir: string;
    private userRegistration;
    private modifyWebpackConfig;
    webpack: any;
    private hooks;
    constructor({ getBuildInPlugins, rootDir, plugins }: {
        getBuildInPlugins?: () => any[];
        rootDir?: string;
        plugins: any;
    });
    registerMethod: (key: string, func: Function) => void;
    applyMethod: (key: string, payload?: any) => void;
    registerTask: (taskName: string, chainConfig: any) => void;
    setup(): Promise<WebpackConfigItem[]>;
    onGetWebpackConfig: (...item: Array<any>) => void;
    /**
     * @desc 使用webpack-chain配置能够通过自定义 plugin对webpack配置进行修改，并且能够针对不同环境下，针对于各自环境下
     *       进行注册webpack修改函数，在webpack配置下能够使用
     *       通过registerTask函数初始化不同环境下的webpack-chain，注册到webpackConfigArr，是一个对象数组，这个对象数组中具
     *       有modifyFn，modifyFn存放所有注册修改webpack配置函数（通过onGetWebpackConfig函数注册）
     */
    private runWebpackFunctions;
    private runPlugins;
    onHook(hookName: string, cb: Function): void;
    applyHook(hookName: string, payload?: any): Promise<void>;
    getWebpackConfigArray(): WebpackConfigItem[];
}
export {};
