'use strict';

// import ExcelJS from 'exceljs';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import XLSX from 'xlsx';

import { getProjectSellingDetails } from './api';
import { getExcelOutputPath, getProjName } from './util';
import { ProjNameMap, Columns } from './constant';
import { pushToGithubServer } from './github';

import cron from 'node-cron';

// const projName = process.argv[2];
console.log('process.argv::',process.argv);
const projName = getProjName();
if(projName && (projName in ProjNameMap)){
  global.projName = projName;
  global.projInfo = ProjNameMap[projName]
}else{
  throw new Error('需要指定项目名。need project name param, e.g: 【node index.js byf】');
}

/**
 * 一个总的exls file，每天一个sheet。
 */
const cronTask = async function () {
  // let jsonData = await getAllSellingInfos({});
  let jsonData = await getProjectSellingDetails();
  // const sheet = XLSX.utils.json_to_sheet(jsonData, { header: excelHeader });
  const sheet = XLSX.utils.json_to_sheet(jsonData);

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
      
      worksheet['!ref'] = sheet['!ref'];
      Object.assign(worksheet, sheet);
    } else {      
      // workbook.SheetNames.push(sheetName);
      workbook.SheetNames.unshift(sheetName);
      workbook.Sheets[sheetName] = sheet;
    }
  } else {
    // 创建新的工作簿并写入数据
    workbook = XLSX.utils.book_new();
    
    // const sheet = XLSX.utils.json_to_sheet(jsonData, { header: SheetColumns });
    workbook.SheetNames.push(sheetName);
    workbook.Sheets[sheetName] = sheet;
  }

  // 设置表头样式和列宽
  const worksheet = workbook.Sheets[sheetName];
  const headerStyle = { fill: { bgColor: { rgb: 'CCC' } } };
  const columnWidths = Object.keys(Columns).map(fieldName=>({ wpx: Number(Columns[fieldName][1]) }));
  
  for (const cell in worksheet) {
    if (cell[1] === '1') {
      worksheet[cell].s = headerStyle;
    }
  }

  worksheet['!cols'] = columnWidths;

  // set header title
  Object.keys(jsonData[0]).forEach((name, colIndex) => {
    worksheet[XLSX.utils.encode_cell({ r: 0, c: colIndex })] = { 
      t: 's', 
      v: Columns[name][0]
    };
  });

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
cronTask();

// ;;; 
// (async function(){
//   await getProjectSellingDetails();
// })();
