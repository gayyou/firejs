"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_base_1 = require("./webpack.base");
exports.default = (function (mode) {
    var config = webpack_base_1.getConfig(mode);
    if (mode === 'development') {
        // 开发环境下进行处理
    }
    else {
        // 生产环境下的处理
    }
    return config;
});
