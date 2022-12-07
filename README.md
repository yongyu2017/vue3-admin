# 介绍

此项目是基于vue3+ElementPlus+webpack开发，一个中后台管理系统基础解决方案。提供基于express的本地接口服务，便于整个项目流程的查看。

超级管理员：admin 123456
测试人员：test 123456

## 技术栈

Vue3 + Pinia + Vue-router + Axios + Element-plus

## 功能

```
系统管理：基本功能
---菜单管理：配置修改目录、菜单、按钮
---角色管理：角色菜单权限分配，角色支持配置数据权限
---用户管理：分配用户角色，根据角色拥有的菜单权限展示不同的页面
```

## 项目运行

```
npm install

npm run serve（开发）

npm run mock（本地接口服务，需安装express、nodemon）

npm run build（生产）

访问: http://localhost:8002

```
## Git 贡献提交规范

- 参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) 规范 

  - `feat` 增加新功能
  - `fix` 修复问题/BUG
  - `style` 代码风格相关无影响运行结果的
  - `perf` 优化/性能提升
  - `refactor` 重构
  - `revert` 撤销修改
  - `test` 测试相关
  - `docs` 文档/注释
  - `chore` 依赖更新/脚手架配置修改等
  - `workflow` 工作流改进
  - `ci` 持续集成
  - `types` 类型定义文件更改
  - `wip` 开发中
  
## 备注

#### 1.注意项目安装node-sass（v7.0.3）、sass-loader（v13.1.0）依赖包时，node.js运行环境为v17.9.0；
#### 2.node-sass安装失败时，可以使用taobao镜像；
```
2.1 采用taobao的镜像地址，进入cmd之后输入：
npm config set registry https://registry.npm.taobao.org 
2.2 查看是否安装成功：
npm config get registry 
```