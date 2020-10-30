### 初始化

- webpack初始化：webpack使用chainConfig，允许webpack配置通过方法进行修改。这样允许用户在插件中对webpack配置进行修改，那么要进行两步操作：
  - 初始化webpack chainConfig基础配置。使用到`webpack-chain`这个插件以链式的方式进行配置webpack
  - 搜集所有plugin中对于webpack配置进行修改的方法
- 

