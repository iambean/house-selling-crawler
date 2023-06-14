'use strict';

// import ExcelJS from 'exceljs';
import XLSX from 'xlsx';
import fs from 'fs';

import { getAllSellingInfos } from './api.js'
import { ColumnsDefined, ExcelFileName } from './constant.js';

import cron from 'node-cron';

// const SheetColumns = ColumnsDefined.map(item => (item[1] ?? item[0]));
// const SheetColumns = ColumnsDefined.map(item => item[0]);

/**
 * 一个总的exls file，每天一个sheet。
 */
// 每天晚上8点定时触发
cron.schedule('0 20 * * *', async function cronTask (){
// cron.schedule('*/5 * * * *', async function cronTask (){
  let jsonData = await getAllSellingInfos();
  
  console.log('all data::', JSON.stringify(jsonData, null, 2));

  const sheetName = (new Date()).toLocaleDateString().replaceAll('/', '.');

  // 判断文件是否存在
  const fileExists = fs.existsSync(ExcelFileName);

  let workbook;

  if (fileExists) {
    // 读取现有的工作簿
    workbook = XLSX.readFile(ExcelFileName);

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
  const columnWidths = new Array(20).fill({ wpx: 120 }); //[{ wpx: 100 }, { wpx: 80 }, { wpx: 120 }];

  for (const cell in worksheet) {
    if (cell[1] === '1') {
      worksheet[cell].s = headerStyle;
    }
  }

  worksheet['!cols'] = columnWidths;

  // 将工作簿写入文件
  XLSX.writeFile(workbook, ExcelFileName);
});