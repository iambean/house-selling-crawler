/**
 * [项目名]: {[生成的文件名], [项目 id], [预售 id]}
 */
export const ProjNameMap = {
  "hymy": {
    fileName: "汉园茗院.xlsx",
    proj_id: 31965,
    pre_sell_id: 132963,
  },
  "byf": {
    fileName: "柏奕府.xlsx",
    proj_id: 24939,
    pre_sell_id: 90613,
  },
  "boyufu-1": {
    fileName: "博誉府一期.xlsx",
    proj_id: 24820,
    pre_sell_id: 82280,
  },
  "boyufu-2": {
    fileName: "博誉府二期.xlsx",
    proj_id: 26099,
    pre_sell_id: 97913,
  },
  "yingxi-1": {
    fileName: "中洲迎玺一期.xlsx",
    proj_id: 30605,
    pre_sell_id: 130103,
  },
  "yingxi-2": {
    fileName: "中洲迎玺二期.xlsx",
    proj_id: 32225,
    pre_sell_id: 133269,
  },
  "yunshanhai": {
    fileName: "金众云山海.xlsx",
    proj_id: 31565,
    pre_sell_id: 131848,
  }
};

export const Columns = {
  // field: [title, width]
  "id": ["ID", 100],
  "buildingName": ["楼栋", 80], 
  "buildingbranch": ["单元", 80], 
  "floor": ["楼层", 50], 
  "housenb":["户型编号", 50],
  "ysbuildingarea":[ "建筑面积(m²)", 100], 
  "ysinsidearea":["套内面积(m²)", 100], 
  "useRate":[ "利用率", 80],
  "askpriceeachB": ["折前单价(w)", 100], 
  "askpricetotalB": ["折前总价(w)", 100], 
  "lastStatusName": ["状态", 200],
}

/**
 * 字段名和Excel表头显示名映射，最终还是直接用字段名了。
 */
// export const ColumnsDefined = [
//   ["id"],
//   ["buildingName", "楼栋号码"],
//   ["floor", "楼层"],
//   ["housenb", "房号"],
//   ["lastStatusName", "销售状态"],
//   ["ysinsidearea", "室面(㎡)"],
//   ["ysexpandarea", "公摊(㎡)"],
//   ["ysbuildingarea", "建面(㎡)"],
//   ["askpriceeachB", "备案价(万元)"],
//   ["askpricetotalB", "不知道什么价格(万元)"],
//   ["totalPrice", "总价(万元)", {"customized": true}],
//   ["useRate", "利用率", {"customized": true}],
//   ["sellers"],
//   ["buildingbranch"],
//   ["useage", "用途"],
//   ["jginsidearea"],
//   ["jgexpandarea"],
//   ["jgbuildingarea"],
//   ["color"],
//   ["strcontractid"]
// ];

export const GITHUB_CONFIG = {
  // 如果在github actions 运行环境，用户名密码从环境中读取
  Name : process.env.GIT_HUB_NAME,
  Password : process.env.GIT_HUB_PASSWORD,
  
  AuthUrl: "https://api.github.com/authorizations",
}