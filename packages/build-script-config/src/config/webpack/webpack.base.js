import setWebpackLoaders from "./setWebpackLoaders";
import setWebpackPlugins from "./setWebpackPlugins";
const Config = require('webpack-chain');

export function getConfig(mode) {
  const config = new Config();

  config.mode = mode;
  config.resolve.extensions
    .merge(['.js', '.json', '.jsx', '.ts', '.tsx']);

  setWebpackLoaders(config);

  setWebpackPlugins(config);

  return config;
}
