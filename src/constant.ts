/**
 * [项目名]: {[生成的文件名], [项目 id], [预售 id]}
 */
interface ProjectInfo {
  fileName: string;
  proj_id: number;
  pre_sell_id: number;
}

export const ProjNameMap: Record<string, ProjectInfo> = {
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

type ColumnType = {
  [key: string]: [string, number];
};

export const Columns:ColumnType = {
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

export const GITHUB_CONFIG = {
  // 如果在github actions 运行环境，用户名密码从环境中读取
  Name : process.env.GIT_HUB_NAME,
  Password : process.env.GIT_HUB_PASSWORD,
  
  AuthUrl: "https://api.github.com/authorizations",
}