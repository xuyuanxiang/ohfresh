ohFresh|探鲜家 买家版
==========

ohFresh|探鲜家买家版前端工程。
使用了html5部分API（localStorage)，不支持IE 6/7/8。

## 依赖

  * [NodeJS](http://nodejs.org/)
  * [Grunt](http://gruntjs.com/)
  * [Bower](http://bower.io/)
  * 任意一个你所喜爱的编辑器(推荐:[WebStorm](http://www.jetbrains.com/webstorm/))

## 运行

  * 克隆或者下载项目
      $ git clone https://github.com/xuyuanxiang/ohfresh_admin.git
  * 安装项目依赖
  ```
      $ npm install
  ```
  ```
      $ bower install
  ```
  * 构建项目
  ```
      $ grunt build
  ```
  * 启动项目
  ```
      $ grunt server
  ```

## 发布

  * 将项目打包发布到dist/目录下
  ```
      $ grunt publish
  ```