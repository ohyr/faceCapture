const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const JSLoader = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      configFile: path.join(__dirname, 'babel.config.json'),
    },
  },
};

const CSSLoader = {
  test: /\.s[ac]ss$/i,
  // Applying css-module with HTML
  // ref. https://stackoverflow.com/questions/59568928/how-to-emit-css-chunk-for-styles-from-htmlwebpackplugin-chunk
  oneOf: [
    {
      issuer: /\.html$/,
      use: [
        {
          loader: 'css-loader',
          options: {
            onlyLocals: true,
            modules: true,
            importLoaders: 2,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            config: {
              path: path.join(__dirname, '/'),
            },
          },
        },
        'sass-loader',
      ],
    },
    {
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
        },
        {
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: 2,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            config: {
              path: path.join(__dirname, '/'),
            },
          },
        },
        'sass-loader',
      ],
    },
  ],
  // End of applying css-module with HTML
};

module.exports = {
  JSLoader,
  CSSLoader,
};
