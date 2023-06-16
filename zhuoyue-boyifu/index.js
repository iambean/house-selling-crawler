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
const cronTask = async function () {
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
  const columnWidths = [
    50/*A:id*/, 10, 50/*C:楼栋*/, 10, 50/*E:楼层*/, 50/*F:房号*/, 100/*G:用途*/, 80/*H:套内*/, 80/*I:公摊*/, 
    100/*J:建面*/, 0, 1, 5, 100/*N:单价*/,10, 10, 100/*Q:销售状态*/, 20/*R:备案字*/, 100/*S:总价*/, 100/*T:使用率*/
  ].map(width => ({ wpx: width }));
  // const columnWidths = new Array(20).fill({ wpx: 120 });

  for (const cell in worksheet) {
    if (cell[1] === '1') {
      worksheet[cell].s = headerStyle;
    }
  }

  worksheet['!cols'] = columnWidths;

  // 将工作簿写入文件
  XLSX.writeFile(workbook, ExcelFileName);
}
// 每天晚上6点定时触发
// cron.schedule('0 18 * * *', cronTask);
// 每5分钟触发一次
// cron.schedule('*/5 * * * *', cronTask);
cronTask();