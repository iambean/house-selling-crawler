'use strict';

// import ExcelJS from 'exceljs';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import XLSX from 'xlsx';

import { getAllSellingInfos, getProjectSellingDetails } from './api.js';
import { getExcelOutputPath } from './util.js';
import { ProjNameMap, ColumnsDefined } from './constant.js';
import { pushToGithubServer } from './github.js';

import cron from 'node-cron';

const projName = process.argv[2];
if(projName && (projName in ProjNameMap)){
  global.projName = projName;
  global.projInfo = ProjNameMap[projName]
}else{
  throw new Error('need project name param, e.g: 【node index.js byf】');
}

// const SheetColumns = ColumnsDefined.map(item => (item[1] ?? item[0]));
// const SheetColumns = ColumnsDefined.map(item => item[0]);

/**
 * 一个总的exls file，每天一个sheet。
 */
const cronTask = async function () {
  // let jsonData = await getAllSellingInfos({});
  let jsonData = await getProjectSellingDetails();

  const excelFile = await getExcelOutputPath();
  
  // console.log('all data::', JSON.stringify(jsonData, null, 2));
  console.log('all data size:', jsonData.length);

  const sheetName = (new Date()).toLocaleDateString().replaceAll('/', '.');

  let workbook;

  // 判断文件是否存在
  const fileExists = fs.existsSync(excelFile);

  if (fileExists) {
    // 读取现有的工作簿
    workbook = XLSX.readFile(excelFile);

    // 判断是否存在指定的表
    const sheetExists = workbook.SheetNames.includes(sheetName);

    if (sheetExists) {
      // 存在指定的表，覆盖写入数据
      const worksheet = workbook.Sheets[sheetName];

      // 清除原有数据
      for (const cell in worksheet) {
        if (cell[0] !== '!') {
          delete worksheet[cell];
        }
      }

      // 写入数据
      const sheet = XLSX.utils.json_to_sheet(jsonData, { header: Object.keys(jsonData[0]) });
      // const sheet = XLSX.utils.json_to_sheet(jsonData, { header: SheetColumns });
      worksheet['!ref'] = sheet['!ref'];
      Object.assign(worksheet, sheet);
    } else {
      // 不存在指定的表，追加一个新表并写入数据
      const sheet = XLSX.utils.json_to_sheet(jsonData, { header: Object.keys(jsonData[0]) });
      // const sheet = XLSX.utils.json_to_sheet(jsonData, { header: SheetColumns });
      workbook.SheetNames.push(sheetName);
      workbook.Sheets[sheetName] = sheet;
    }
  } else {
    // 创建新的工作簿并写入数据
    workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(jsonData, { header: Object.keys(jsonData[0]) });
    // const sheet = XLSX.utils.json_to_sheet(jsonData, { header: SheetColumns });
    workbook.SheetNames.push(sheetName);
    workbook.Sheets[sheetName] = sheet;
  }

  // 设置表头样式和列宽
  const worksheet = workbook.Sheets[sheetName];
  const headerStyle = { fill: { bgColor: { rgb: 'CCC' } } };
  const columnWidths = [
    50/*A:id*/, 10, 50/*C:楼栋*/, 10, 50/*E:楼层*/, 50/*F:房号*/, 100/*G:用途*/, 80/*H:套内*/, 80/*I:公摊*/, 
    100/*J:建面*/, 0, 1, 5, 100/*N:单价*/,10, 10, 100/*Q:销售状态*/, 20/*R:备案字*/, 100/*S:使用率*/, 100/*T:总价*/,
    100/*U:86折后价*/
  ].map(width => ({ wpx: width }));
  // const columnWidths = new Array(20).fill({ wpx: 120 });

  for (const cell in worksheet) {
    if (cell[1] === '1') {
      worksheet[cell].s = headerStyle;
    }
  }

  worksheet['!cols'] = columnWidths;

  // 将工作簿写入文件
  XLSX.writeFile(workbook, excelFile);

  const hadPushToGithub = await pushToGithubServer(`${sheetName}# 自动生成.`);
  console.log(`git push ${(hadPushToGithub ? "成功" : "失败")}. - ${new Date().toLocaleString()}`);
}
// [+]每天晚上定时触发
// cron.schedule('0 20 * * *', cronTask);

// [+]每5分钟触发一次
// cron.schedule('*/5 * * * *', cronTask);

// [+]立即执行，在Github上利用github actions的schedule去配置定时执行
// cronTask();

;;; 
(async function(){
  await getProjectSellingDetails();
})();
