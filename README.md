
自己写的爬虫，爬取一些深圳房地产信息网站数据，http://zjj.sz.gov.cn:8004/


```shell
npm script start [楼盘名] #根据配置信息(constant.ts)，生成本地excel
npm script push-to-github #将本地分支推到github remote。
```
---
<h1>记录：</h1>

1. `JSLint/ESLint/TSLint/prettier`?
  + JSLint已过时，TSLint 也被 MS 放弃了，只需要 ESLint 来保证静态语法检查即可；
  + prettier 用于代码格式风格一致化，可以使用；
2. 不使用 `webpack/vite` 的情况下，使用 `typescript`：
  + `npm install --save-dev typescript ts-node`
  + `npx tsc --init` 在根目录下自动创建了一个tsconfig.json， 修改下面配置: 
    ```json
      {
        "compilerOptions": {
          "target": "es6", // 或者你项目需要的ES版本
          "module": "commonjs", // Node.js 默认使用commonjs模块
          "outDir": "./dist", // 编译后的文件存放位置
          "rootDir": "./src", // 源代码目录
          "strict": true, // 启用所有严格类型检查选项
          "esModuleInterop": true // 允许使用import xx from 'module';语法
        },
        "include": ["src/**/*"],
        "exclude": ["node_modules"]
      }
    ```
  + 修改 `package.json`:
    ```json
    "scripts": {
      "start": "tsx src/index.ts"
    }
    ```
  + `npm run start` 即可在内存中编译ts to js 而无需落到硬盘上。


---
8.20： 计划改造系统为微信小程序，用户可以查询指定小区的成交记录，也可以订阅某个小区的成交信息（按天更新）


大概想法：

1. 从项目在生产环境上线时，初始化利用已有的爬虫接口从第三方爬取数据产生一个原始表，写进 DB，其中逐条记录了某个房屋的不变的基本信息（如位置、编码、所属开发商、）销售状态（待售、已认购、销售中、银行按揭中、已过户共五种状态）；
2. 这个第三方接口只能爬取全量数据，不记录状态变更, 也不提供数据更新订阅服务，这些数据除了房屋的销售状态外，其他字段均不会改变；
3. 用户可以在我的应用上订阅数据更新服务， 这样我们就会在每日定时（如下午 6 点）推送变更信息（短信、邮件、微信等），例如用户订阅了 X 小区， 那么我们针对 X 小区， 当日的房屋状态更新推送给用户（如“X 小区今日有1 栋 21C 由待售状态变为已认购状态；3 栋 5E 由银行按揭中变更为已过户状态。”）
4. 从上线日起，后面每天都在北京时间下午 6 点定时爬取数据（同初始化时的爬取接口）， 爬取到数据后需要在我的应用内做对比，计算出需要推送的变更数据；
5. 用户除了订阅每日变更外，还可以主动查询任意小区的最新销售状态以及 过去一段时间的状态变化（如今天和上周的比较，上月的比较等）
6. 后端的技术选型我使用 Nodejs（Nestjs/TS），阿里云服务器部署，阿里云 RDS 做存储；
7. 对于用户订阅数据的处理，我不确认是使用 redis 还是 db 存储更加合理；