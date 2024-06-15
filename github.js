import request from "superagent";
import { exec } from 'child_process';
// import { promisify } from 'util';
// const execPromise = promisify(exec);

import { GITHUB_CONFIG } from './constant.js'

async function loginAndGetToken () {
  const { Name, Password } = GITHUB_CONFIG;
  console.log('github password and name:', Name, Password);
  try {
    const response = await request
      .post('https://api.github.com/authorizations')
      .auth(Name, Password)
      .send({
        note: 'GitHub API Login',
        scopes: ['repo'],
      });

    const { token } = response.body;
    return token;
  } catch (error) {
    console.error('GitHub login failed:', error.message);
    return false;
  }
}

async function commitAndPush (token) {
  console.log("Token:::, ", token);
}

export async function pushToGithubServer (message) {
  // 如果在github actions环境，则需要用github rest api进行commit & push； 否则在本地运行git命令；
  const IsInGithubAction = (process.env.CI === 'true' && process.env.GITHUB_ACTIONS === 'true');
  if(IsInGithubAction){
    const token = await loginAndGetToken();
    if(token === false){
      return false;
    }else{
      await commitAndPush(token);
    }
  }else{
    // try{
    //   await execPromise('git add .');
    //   await execPromise(`git commit -m "${message}"`);
    //   await execPromise('git push');
    //   return true;
    // }catch(e){
    //   console.log('git 操作出错,', e);
    //   return false;
    // }
  }
}
