import { promisify } from 'util';
const execPromise = promisify(exec);

try{
  await execPromise('git add .');
  await execPromise(`git commit -m "自动提交最新Excel --- ${new Date().toLocaleString()}"`);
  await execPromise('git push');
  return true;
}catch(e){
  console.log('git 操作出错,', e);
  return false;
}