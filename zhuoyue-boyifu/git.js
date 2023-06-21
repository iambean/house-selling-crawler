import { exec } from 'child_process';
import { promisify } from 'util';
const execPromise = promisify(exec);

export async function gitPush (message) {
  try{
    await execPromise('git add .');
    await execPromise(`git commit -m "${message}"`);
    await execPromise('git push');
    return true;
  }catch(e){
    console.log('git 操作出错,', e);
    return false;
  }
}