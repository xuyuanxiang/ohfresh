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

#### 在Window命令行工具(CMD)下：

  * 键入如下命令，使用[Git](http://git-scm.com/)(版本控制工具)克隆至本地，或者直接[下载](https://github.com/xuyuanxiang/ohfresh/archive/master.zip)；

    ```
      $ git clone https://github.com/xuyuanxiang/ohfresh_admin.git
    ```

  * 进入到项目目录下，依次键入如下两个命令，等待至项目依赖安装完成；

    ```
      $ npm install
    ```

    ```
      $ bower install
    ```

  * 键入如下命令，构建项目；

    ```
      $ grunt build
    ```

  * 键入如下命令，启动服务器并打开你的默认浏览器。

    ```
      $ grunt server
    ```

## 发布

  * 将项目打包压缩发布到dist/目录下，复制dist目录下所有文件至正式服务器即可。

    ```
      $ grunt publish
    ```