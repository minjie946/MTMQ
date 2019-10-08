/**
 * 配置文件，基础的配置
 * @authors minjie
 * @date    2019/09/29
 * @version 1.0.0 firstVersion
 * @module common
 * @description webpack 公共的配置
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
'use strict'
const utils = require('./utils/index')
const theme = require('./utils/theme.js')
const config = require('./webpack.config.js')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CheckerPlugin } = require('awesome-typescript-loader')

const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
})

module.exports = function (webpackEnv) {
  // 生产环境和开发环境的变量
  const isEnvDevelopment = webpackEnv === 'development'
  const isEnvProduction = webpackEnv === 'production'

  // 生成之后的html的界面的标题
  let title = config.html.title || ''
  if (process.env.tag) {
    switch (process.env.tag) {
      case 'pre': title = config.html.title + '预发'; break
      case 'tes': title = config.html.title + '测试'; break
      case 'pro': title = config.html.title; break
      case 'dev': title = config.html.title + '开发'; break
    }
  }

  // publicPath 路径
  const publicPath = isEnvDevelopment ? '/' : './'

  return {
    devtool: isEnvDevelopment ? 'inline-source-map' : false,
    target: config.target || 'web',
    mode: isEnvProduction ? 'production' : 'development',
    output: {
      filename: isEnvDevelopment ? '[name].[hash:8].js' : isEnvProduction && 'js/[name].[chunkhash:8].js',
      path: utils.resolveApp('dist'),
      publicPath: publicPath
    },
    plugins: [
      new CheckerPlugin(),
      new HtmlWebpackPlugin({
        title: title,
        filename: 'index.html',
        template: config.html.template,
        favicon: config.html.favicon || '',
        hash: true,
        cache: false,
        inject: true,
        minify: {
          removeComments: true,
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          minifyJS: true, // 在脚本元素和事件属性中缩小JavaScript(使用UglifyJS)
          minifyCSS: true // 缩小CSS样式元素和样式属性
        },
        nodeModules: utils.resolveApp('node_modules')
      }),
      new MiniCssExtractPlugin({
        filename: isEnvDevelopment ? 'css/[name].css' : 'css/[name].[contenthash:8].css'
      }),
      new webpack.DefinePlugin(config.definePlugin),
      new HappyPack({
        id: 'css',
        loaders: ['css-loader', 'postcss-loader'],
        threadPool: happyThreadPool
      }),
      new HappyPack({
        id: 'less',
        loaders: ['css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              modifyVars: theme,
              javascriptEnabled: true
            }
          }
        ],
        threadPool: happyThreadPool
      }),
      new HappyPack({
        id: 'stylus',
        loaders: ['css-loader', 'postcss-loader', 'stylus-loader'],
        threadPool: happyThreadPool
      }),
      new HappyPack({
        id: 'tsxs',
        loaders: [{
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        }],
        threadPool: happyThreadPool
      })
    ],
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          exclude: /node_modules/,
          use: {
            loader: 'url-loader',
            query: {
              name: 'assets/images/[name].[ext]'
            }
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          exclude: /node_modules/,
          use: {
            loader: 'url-loader',
            query: {
              limit: 10000,
              name: 'css/fonts/[name]--[folder].[ext]'
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            isEnvDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            'happypack/loader?id=css'
          ]
        },
        {
          test: /\.less$/,
          use: [
            isEnvDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            'happypack/loader?id=less'
          ]
        },
        {
          test: /\.styl$/,
          exclude: /node_modules/,
          use: [
            isEnvDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            'happypack/loader?id=stylus'
          ]
        },
        {
          test: /\.js$/,
          enforce: 'pre',
          exclude: /node_modules/,
          loader: 'source-map-loader'
        },
        {
          test: /\.(j|t)sx?$/,
          include: /node_modules/,
          use: ['react-hot-loader/webpack']
        },
        {
          test: /\.(ts|tsx)?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'awesome-typescript-loader',
              options: {
                transplieOnly: true,
                useCache: true,
                cacheDirectory: utils.resolveApp('.cache-loader'),
                useBabel: true,
                babelCore: '@babel/core'
              }
            }
          ]
        },
        {
          test: /\.(ts|tsx)$/,
          enforce: 'pre',
          exclude: /node_modules/,
          use: ['happypack/loader?id=tsxs']
        }
      ]
    },
    resolve: {
      alias: config.alias,
      extensions: ['.ts', '.tsx', '.js', '.css', '.less', '.styl', '.json']
    }
  }
}
