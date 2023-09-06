'use strict'; 
import SuperAgent from "superagent";
import _ from 'lodash';

// import { ColumnsDefined } from './constant.js'


export const TotalUrl = 'http://zjj.sz.gov.cn/szfdcscjy/projectPublish/getHouseInfoListToPublicity'

// 基础参数，需要结合下面的楼栋参数才完整
export const BaseParams = {
  buildingbranch: "未知",
  floor: "",
  // 不同楼栋参数不一样
  fybId: "", 
  housenb: "",
  status: -1,
  type: "",
  ysProjectId: 24939,
  preSellId: 90613,
};

// 楼栋序号：分别是四栋、三栋、二栋、一栋
export const BuildingNumMaps = {
  '4': "43506",
  '3': "43505",
  '2': "43504",
  '1': "43503"
};

// 按照楼栋号码获取各层的销售情况
async function getBuildings(buildingNum){

  const fybId = BuildingNumMaps[buildingNum];
  // 序号非法
  if(!fybId){
    return [];
  }
  const params = Object.assign({}, BaseParams, {fybId});
  // console.log(params)
  try{
    const response = await SuperAgent.post(TotalUrl).send(params);
    const content = response.body;
    if(content.status !== 200){
      return [];
    }
    const items = content.data.map(floorItem =>
      floorItem.list
        .filter(house => {
          console.log(house, house.useage === " 住宅")
          return house => house.useage === " 住宅";
        })
        .map(house => {
          let totalPrice = house['askpriceeachB'] * house['ysbuildingarea'] / 1e4;
          house['useRate'] = (house['ysinsidearea'] / house['ysbuildingarea'] * 100).toFixed(4) + '%';
          house['totalPrice'] = totalPrice;
          house['discountedPrice'] = totalPrice * (0.99 ** 15).toFixed(4);
          return house;
          // return _.pick(house, ColumnsDefined.map(item => item[0]));
        })
    );
    return items.flat()
  }catch(e){
    console.log('Error:', e);
    return [];
  }
}

/**
 * 
 */
export async function getAllSellingInfos () {
  return [
    await getBuildings(1),
    await getBuildings(2),
    await getBuildings(3),
    await getBuildings(4)
  ].flat();
}


// // 楼栋号码
// 'buildingName',
// // 楼层
// 'floor',
// // 房号
// 'housenb',
// // 当前状态
// 'lastStatusName',
// // 用途
// 'useage',
// // 总面积
// 'ysbuildingarea',
// // 室内面积
// 'ysinsidearea',
// // 公摊面积
// 'ysexpandarea',
// // 备案价
// 'askpriceeachB',
// // 另外一个什么价格
// 'askpricetotalB',
// // 后面的不知道什么字段
// 'buildingbranch',
// // // 自定义增加字段，总价
// // '总价',
// // // 自定义增加的字段，总价85折
// // '总价85折'