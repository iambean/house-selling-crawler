import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import fs from 'node:fs/promises';

import { ProjNameMap } from './constant'

let __proj:string = '';
export function getProjName(): string{
  if (__proj) {
    return __proj;
  } else {
    const proj = process.argv[2] || Object.keys(ProjNameMap)[0];
    __proj = proj;
    return proj;
  }
}

export async function getExcelOutputPath () {
  const currentFilePath = fileURLToPath(import.meta.url);
  const srcDir = dirname(currentFilePath);
  // const proj = process.argv[2] || Object.keys(ProjNameMap)[0];
  const proj = getProjName();

  const outputDir = join(srcDir, '../output', proj);

  // 如果目录不存在，则创建一个
  try{
    await fs.access(outputDir, fs.constants.F_OK)
  }catch(e){
    await fs.mkdir(outputDir, { recursive: true });
  }
  

  const excelName = ProjNameMap[proj].fileName;
  const outputFilePath = resolve(outputDir, excelName);
  
  console.log('outputFilePath:::', outputFilePath);
  
  return outputFilePath;
}

export async function sleep(millisecond: number){
  // 不允许 sleep 1 分钟以上。
  if(millisecond > 60 * 1000){
    throw('sleep time too long.');
  }
  const t0 = Date.now();
  while((Date.now() - t0 ) < millisecond){
    continue;
  }
  return true;
}