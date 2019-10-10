#  TypeScript + React + Webpack4 构建的项目

## 一、简介
  简化项目的构建的过程，能够自己DIY的项目，对包的增减都有把握

## 二、所用基础的包
所用技术|版本|
---|:--:|
nodeJs           | 6 +
typeScript       | 3.5.3
react            | 16.8.4
webpack          | 4.29.6

### 开发工具推荐
工具|链接|
---|:--:|
vscode| [下载工具](https://code.visualstudio.com)

### 项目目录结构

```
*
├--config                           # config系统配置文件
|  ├--dll                             # 提前打包好的包的信息，加快构建速度用
|  ├--utils                           # 工具类文件夹
|  |  ├--index.ejs                      # ejs html 文件的模版
|  |  ├--index.js                       # 工具类文件夹
|  |  └--theme.js                       # antd的主题配置
|  ├--dev-run.js                    # nodeJs 启动开发环境
|  ├--webapck.common.js             # webpack 公共环境配置
|  └--webapck.config.js             # webpack 自定义的配置
|  └--webapck.dev.js                # webpack 开发环境配置
|  └--webapck.dll.js                # webpack 提前打包的环境配置
|  └--webapck.prod.js               # webpack 生产环境配置
├--dist                             # 存放webpack打包后的文件
├--src                              # src 主目录
|  ├--assets                          # 样式 图片 字体 存放
|  ├--components                      # 公共组件存放
|  ├--containers                      # 业务组件存放
|  |  ├--pages                          # 不可复用组件
|  |  └--shared                         # 可复用组件
|  ├--router                          # 路由的存放文件夹
|  ├--server                          # 后台接口 管理
|  ├--store                           # 状态管理
|  ├--utils                           # 存放工具
|  ├--index.tsx                       #入口文件
├--statics                          # 静态文件的存放
├--typings                          # typescript 全局声明文件夹
├--.babelrc                         # babel的配置
├--.editorconfig                    # eslint 格式配置
├--.eslintignore                    # eslint 忽略文件设置
├--.eslintrc.js                     # eslint 代码检查配置
├--.gitignore                       # git 不提交的界面
├--package.json                     # webpack 配置文件
├--postcss.config.js                # postcss 配置文件
├--README.md                        # 文档规范
└--tsconfig.json                    # typeScript 文件配置

```

### 注释规范

```
/**
 * 文件说明
 * @authors 作者
 * @date    时间
 * @version 版本
 * @module  模块
 * @description 文件注释
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

```
