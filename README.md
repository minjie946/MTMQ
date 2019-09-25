#  TypeScript + React + Webpack4 构建的项目

## 一、简介
  简化项目的构建的过程，能够自己DIY的项目，对包的增减都有把握

## 二、所用基础的包
所用技术|版本|
---|:--:|
nodeJs           | 6 +
typeScript       | 3.5.3
react            | 16.8.4
react-router-dom | 4.4.0
webpack          | 4.29.6

### 开发工具推荐
工具|链接|
---|:--:|
vscode| [-->下载工具](https://code.visualstudio.com)

### 项目目录结构

```
*
├--config                           # config系统配置文件
|  ├--index.ejs                     # ejs html 模板
|  ├--theme.js                      # antd 重置样式
|  ├--webapck.dev.js                # webpack 开发环境配置
|  ├--webapck.prod.js               # webpack 正式环境配置
|  └--webapck.web.js                # webpack 公共环境配置
├--dist                             # 存放webpack打包后的文件
├--src                              # src 主目录
|  ├--assets                        # 样式 图片 字体 存放
|  ├--components                    # 公共组件存放
|  ├--containers                    # 业务组件存放
|  |  ├--pages                      # 不可复用组件
|  |  └--shared                     # 可复用组件
|  ├--interface                     # 接口声明文件
|  ├--server                        # 后台接口 管理
|  ├--store                         # 状态管理
|  ├--utils                         # 存放工具
|  ├--index.tsx                     #入口文件
├--.editorconfig                    # eslint 配置
├--.eslintignore                    # eslint 忽略文件设置
├--.eslintrc.js                     # eslint 代码检查配置
├--.gitignore                       # git 不提交的界面
├--package-lock.json
├--package.json                     # webpack 配置文件
├--README.md                        # 文档规范
└--tsconfig.json                    # typeScript 文件配置

```
