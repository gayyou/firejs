"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
// @ts-ignore
var lodash_1 = require("lodash");
var constant_1 = require("./constant");
var isUndef = function (tar) { return typeof tar === 'undefined' || tar === null; };
var Context = /** @class */ (function () {
    function Context(_a) {
        var _this = this;
        var _b = _a.getBuildInPlugins, getBuildInPlugins = _b === void 0 ? function () { return []; } : _b, _c = _a.rootDir, rootDir = _c === void 0 ? process.cwd() : _c, plugins = _a.plugins;
        this.registerMethod = function (key, func) {
            var funcArray = _this.registeredMethods.get(key);
            if (isUndef(funcArray)) {
                _this.registeredMethods.set(key, funcArray = []);
            }
            funcArray.push(func);
        };
        this.applyMethod = function (key, payload) {
            var funcArray = _this.registeredMethods.get(key);
            if (isUndef(funcArray)) {
                return;
            }
            for (var i = 0; i < funcArray.length; i++) {
                funcArray[i](payload);
            }
        };
        this.registerTask = function (taskName, chainConfig) {
            var isExist = !isUndef(_this.webpackConfigArray.find(function (item) { return item.name === taskName; }));
            if (isExist) {
                console.error("Webpack config task " + taskName + " is exist!");
                return;
            }
            _this.webpackConfigArray.push({
                chainConfig: chainConfig,
                name: taskName,
                modifyFn: []
            });
        };
        this.onGetWebpackConfig = function () {
            var item = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                item[_i] = arguments[_i];
            }
            _this.modifyWebpackConfig.push(item);
        };
        this.plugins = __spreadArrays(plugins);
        this.webpackConfigArray = [];
        this.registeredMethods = new Map();
        this.getBuildInPlugins = getBuildInPlugins;
        this.userRegistration = {};
        this.rootDir = rootDir;
        this.hooks = new Map();
        this.webpack = require('webpack');
    }
    Context.prototype.setup = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.runPlugins()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.runWebpackFunctions()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this.webpackConfigArray];
                }
            });
        });
    };
    /**
     * @desc 使用webpack-chain配置能够通过自定义 plugin对webpack配置进行修改，并且能够针对不同环境下，针对于各自环境下
     *       进行注册webpack修改函数，在webpack配置下能够使用
     *       通过registerTask函数初始化不同环境下的webpack-chain，注册到webpackConfigArr，是一个对象数组，这个对象数组中具
     *       有modifyFn，modifyFn存放所有注册修改webpack配置函数（通过onGetWebpackConfig函数注册）
     */
    Context.prototype.runWebpackFunctions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i, webpackConfigItem, j;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // 将注册的修改webpack配置放到各个webpack环境中
                        this.modifyWebpackConfig.forEach(function (_a) {
                            var name = _a[0], func = _a[1];
                            var isAll = isUndef(func);
                            if (isAll) {
                                _this.webpackConfigArray.forEach(function (config) {
                                    config.modifyFn.push(name);
                                });
                            }
                            else {
                                _this.webpackConfigArray.forEach(function (config) {
                                    if (config.name === name) {
                                        config.modifyFn.push(func);
                                    }
                                });
                            }
                        });
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.webpackConfigArray.length)) return [3 /*break*/, 6];
                        webpackConfigItem = this.webpackConfigArray[i];
                        j = 0;
                        _a.label = 2;
                    case 2:
                        if (!(j < webpackConfigItem.modifyFn.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, webpackConfigItem.modifyFn[j](webpackConfigItem.chainConfig)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        j++;
                        return [3 /*break*/, 2];
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Context.prototype.runPlugins = function () {
        return __awaiter(this, void 0, void 0, function () {
            var plugins, apis, context, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        plugins = __spreadArrays(this.getBuildInPlugins(), this.plugins);
                        apis = {
                            onGetWebpackConfig: this.onGetWebpackConfig,
                            applyMethod: this.applyMethod,
                            registerMethod: this.registerMethod,
                            registerTask: this.registerTask,
                        };
                        context = lodash_1.default.pick(this, constant_1.contextShadowProperty);
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < plugins.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, plugins[i](apis, context)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Context.prototype.onHook = function (hookName, cb) {
        var funcArray = this.hooks.get(hookName);
        if (lodash_1.default.isUndefined(funcArray)) {
            this.hooks.set(hookName, funcArray = []);
        }
        funcArray.push(cb);
    };
    Context.prototype.applyHook = function (hookName, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var funcArray, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        funcArray = this.hooks.get(hookName);
                        if (lodash_1.default.isUndefined(funcArray)) {
                            return [2 /*return*/];
                        }
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < funcArray.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, funcArray[i](payload)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Context.prototype.getWebpackConfigArray = function () {
        return this.webpackConfigArray;
    };
    return Context;
}());
exports.Context = Context;
