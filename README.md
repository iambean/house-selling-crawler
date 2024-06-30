
自己写的爬虫，爬取一些深圳房地产信息网站数据，http://zjj.sz.gov.cn:8004/

+ zhuoyue-boyifu: 卓越.柏奕府

```shell
npm script excel #生成最新的Excel表格，并执行本地commit
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
