const fs = require('fs');
const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const globImporter = require('node-sass-glob-importer');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const ServiceWorkerWebpackPlugin = require( 'serviceworker-webpack-plugin');


let plugins = [];
let page;
let links = [];

fs.readdirSync('./src/').forEach(file => {
  if(String(file).endsWith('.pug')){
    page = new HtmlWebPackPlugin({
      template: `./src/${path.basename(file, '.pug')}.pug`,
      filename: `./${path.basename(file, '.pug')}.html`,
      minify: true,
      hash: true
    });
    links.push({
      link: `./${path.basename(file, '.pug')}.html`,
      title: path.basename(file, '.pug')
    });
    plugins.push(page)
  }
});

plugins.push(new MiniCssExtractPlugin({
  filename: "[name].css",
  chunkFilename: "[id].css"
}));
plugins.push(new SpriteLoaderPlugin());
plugins.push(new SpriteLoaderPlugin(new CopyWebpackPlugin([
  {from: 'src/public', to: './'}
])));
plugins.push(new ImageminPlugin({
  pngquant: {
    quality: '95-100'
  }
}));

module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: '8080',
    disableHostCheck: true,
    open: false,
  },
  // watch: true,
  // watchOptions: {
  //   poll: 1000,
  //   ignored: /node_modules/
  // },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules[\/\\](?!(swiper|dom7)[\/\\])/,
        use: {
          loader: "babel-loader",
          options: { presets: ['@babel/preset-env' ] }
        }
      },
      {
        test: /\.pug$/,
        use: [
          {
            loader: "html-loader",
            options: {
              attrs: ['img:src', 'link:href', 'image:xlink:href']
            },
          },
          {
            loader: 'pug-html-loader',
            query: {
              data: {
                header: require('./src/data/header.json'),
              },
              pretty: true
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              // sourceMap: true,
              // minimize: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer({
                  browsers: ['ie >= 9', 'last 8 version']
                })
              ],
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              importer: globImporter()
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name(file) {
                if (process.env.NODE_ENV === 'development') {
                  return 'assets/images/[hash].[ext]';
                }

                return 'assets/images/[name].[ext]';
              },
            }
          }
        ]
      },
      {
        test: /\.(eot|ttf|woff|woff2|)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name(file) {
                if (process.env.NODE_ENV === 'development') {
                  return 'assets/fonts/[hash].[ext]';
                }

                return 'assets/fonts/[name].[ext]';
              },
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {loader: 'svg-sprite-loader', options: {symbolId: filePath => path.basename(filePath, '.svg')}},
          'svg-fill-loader',
          'svgo-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: [ '.js' ]
  },
  plugins: plugins
};




