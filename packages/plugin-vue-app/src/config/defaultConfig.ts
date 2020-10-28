export default  {
  alias: {},
  define: {},
  devPublicPath: '/',
  filename: '[name].js',
  // resolve.extensions
  extensions: ['.js', '.jsx', '.json', '.html', '.ts', '.tsx'],
  // resolve.modules
  modules: ['node_modules'],
  entry: 'src/index.jsx',
  externals: {},
  hash: false,
  injectBabel: 'polyfill',
  minify: true,
  outputAssetsPath: {
    js: 'js',
    css: 'css',
  },
  outputDir: 'build',
  publicPath: '/',
  browserslist: 'last 2 versions, Firefox ESR, > 1%, ie >= 9, iOS >= 8, Android >= 4'
}
