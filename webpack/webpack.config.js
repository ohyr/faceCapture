const loaders = require('./loaders');
const plugins = require('./plugins');

module.exports = (env, options) => {
  const config = {
    entry: {
      main: './src/index.js',
    },
    plugins: [
      plugins.HtmlWebpackPlugin,
      plugins.MiniCssExtractPlugin,
    ],
    module: {
      rules: [
        loaders.JSLoader,
        loaders.CSSLoader,
      ],
    },
  };

  if (options.mode === 'development') {
    config.devtool = 'eval-source-map';
  }

  return config;
};
