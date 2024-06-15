// import { fileURLToPath } from 'url';
// import { dirname, resolve } from 'path';

/**
 *  node index.js byf
 * [项目名]: [生成的文件名]
 */
export const ProjNameMap = {
  "byf": {
    fileName: "柏奕府.xlsx",
    proj_id: 24939,
    pre_sell_id: 90613,
    buildingNum: {
      '4': "43506",
      '3': "43505",
      '2': "43504",
      '1': "43503"
    }
  },
  "hymy": {
    fileName: "汉园茗院.xlsx",
    proj_id: 31965,
    pre_sell_id: 132963,
    buildingNum: {
      '4': "43506",
      '3': "43505",
      '2': "43504",
      '1': "43503"
    }
  }
};

export const Columns = [
  []
];

/**
 * 字段名和Excel表头显示名映射，最终还是直接用字段名了。
 */
export const ColumnsDefined = [
  ["id"],
  ["buildingName", "楼栋号码"],
  ["floor", "楼层"],
  ["housenb", "房号"],
  ["lastStatusName", "销售状态"],
  ["ysinsidearea", "室面(㎡)"],
  ["ysexpandarea", "公摊(㎡)"],
  ["ysbuildingarea", "建面(㎡)"],
  ["askpriceeachB", "备案价(万元)"],
  ["askpricetotalB", "不知道什么价格(万元)"],
  ["totalPrice", "总价(万元)", {"customized": true}],
  ["useRate", "利用率", {"customized": true}],
  ["sellers"],
  ["buildingbranch"],
  ["useage", "用途"],
  ["jginsidearea"],
  ["jgexpandarea"],
  ["jgbuildingarea"],
  ["color"],
  ["strcontractid"]
];

export const GITHUB_CONFIG = {
  // 如果在github actions 运行环境，用户名密码从环境中读取
  Name : process.env.GIT_HUB_NAME,
  Password : process.env.GIT_HUB_PASSWORD,
  
  AuthUrl: "https://api.github.com/authorizations",

}