'use strict'; 
import SuperAgent from "superagent";
import _ from 'lodash';

// import { ColumnsDefined } from './constant.js'
import { sleep } from './util.js';


const URLs = {
  // 获取楼栋列表
  getBuildingList : 'http://zjj.sz.gov.cn/szfdcscjy/projectPublish/getBuildingNameListToPublicity',
  // 楼盘指定楼栋的销售情况，注：原始接口区分楼栋，我们在本地遍历楼栋后合并在一起。
  getSellingInfo : 'http://zjj.sz.gov.cn/szfdcscjy/projectPublish/getHouseInfoListToPublicity',
  
  // 获取单元列表
  getBlockList : '',
};

const POST_BODY_CONTENT_TYPE = {
  FORM: 'application/x-www-form-urlencoded',
  RAW: 'application/json',
}

const url_and_settings = {
  // 获取楼栋列表
  blockList: {
    url: 'http://zjj.sz.gov.cn/szfdcscjy/projectPublish/getBuildingNameListToPublicity',
    method: 'POST',
    type: POST_BODY_CONTENT_TYPE.FORM,
  },
  // 楼盘指定楼栋的销售情况，注：原始接口区分楼栋，我们在本地遍历楼栋后合并在一起。
  sellingInfo: {
    url: 'http://zjj.sz.gov.cn/szfdcscjy/projectPublish/getHouseInfoListToPublicity',
    method: 'POST',
    type: POST_BODY_CONTENT_TYPE.RAW,
  },
}


// 基础参数，需要结合下面的楼栋参数才完整
const BaseParams = {
  // 项目 ID
  ysProjectId: 0,
  // 预售ID
  preSellId: 0,
  // 楼栋 ID
  fybId: "", 
  // 单元
  buildingbranch: "",
  // 楼层
  floor: "",
  housenb: "",
  status: -1,
  type: "",
};

// 楼栋序号：分别是四栋、三栋、二栋、一栋
// export const BuildingNumMaps = {
//   '4': "43506",
//   '3': "43505",
//   '2': "43504",
//   '1': "43503"
// };

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
    const response = await SuperAgent.post(getSellingInfo).send(params);
    const content = response.body;
    if(content.status !== 200){
      return [];
    }
    const items = content.data.map(floorItem =>
      floorItem.list
        .filter(house => {
          // console.log(house, house.useage === "住宅")
          return house.useage === "住宅";
        })
        // .map(house => {
        //   let totalAreaSize = house['ysbuildingarea'] * 1;
        //   let totalPrice = house['askpriceeachB'] * totalAreaSize / 1e4;
        //   house['useRate'] = (house['ysinsidearea'] / totalAreaSize * 100).toFixed(4) + '%';
        //   house['totalPrice'] = totalPrice;
        //   house['discountedPrice'] = totalPrice * (0.99 ** 15).toFixed(4);
        //   // 面积数值调整
        //   house['ysbuildingarea'] = (a => {
        //     return a < 109.5 ? 108 : ( a < 111 ? 110 : ( a < 124 ? 117 : 125 ));
        //   })(totalAreaSize)
        //   return house;
        //   // return _.pick(house, ColumnsDefined.map(item => item[0]));
        // })
    );
    return items.flat()
  }catch(e){
    console.log('Error:', e);
    return [];
  }
}

export async function getProjectSellingDetails(){
  const blocks = await getBlockList();
  console.log('blocks::', blocks);
  
  if(!blocks || (Array.isArray(blocks) && blocks.length < 1)){
    return false;
  }

  const {url, type} = url_and_settings.sellingInfo;
  const result = [];
  for(const block of blocks){
    console.log('block...', 111111111)
    const sellInfo = await _post({url, type, params: {fybId: block.key}});
    console.log('block...', 222222222);
    const filterItems = sellInfo.map(floorItem => floorItem
      .list
      .filter(house => {
        return house.useage === "住宅";
      }).map(house => {
        const {
          id, buildingName, buildingbranch, floor, ysinsidearea, housenb,
          ysbuildingarea, askpriceeachB, askpricetotalB, lastStatusName
        } = house;
        Object.assign(house, {
          housenb: housenb.substring(-2),
          ysinsidearea: Math.ceil(ysinsidearea),
          ysbuildingarea: Math.ceil(ysbuildingarea),
          useRate: (ysinsidearea/ysbuildingarea).toFixed(2),
          askpriceeachB: askpriceeachB/1e4,
          askpricetotalB: askpricetotalB/1e4
        });
        // house.housenb = house.housenb.substring(-2);
        return house;
      })
    );
    console.log('-----------\n', filterItems, result, '-----------\n');
    result.push(filterItems.flat());
    sleep(1500);
  }
  return result.flat();
  // blocks.forEach(async block => {
  //   console.log('block...')
  //   const sellInfo = await _post({url, type, params: {fybId: block.key}});
  //   console.log(1111111111122222222);
  //   const filterItems = sellInfo.map(floorItem =>
  //     floorItem.list
  //       .filter(house => {
  //         return house.useage === "住宅";
  //       })
  //       // .map(house => {
  //       //   let totalAreaSize = house['ysbuildingarea'] * 1;
  //       //   let totalPrice = house['askpriceeachB'] * totalAreaSize / 1e4;
  //       //   house['useRate'] = (house['ysinsidearea'] / totalAreaSize * 100).toFixed(4) + '%';
  //       //   house['totalPrice'] = totalPrice;
  //       //   house['discountedPrice'] = totalPrice * (0.99 ** 15).toFixed(4);
  //       //   // 面积数值调整
  //       //   house['ysbuildingarea'] = (a => {
  //       //     return a < 109.5 ? 108 : ( a < 111 ? 110 : ( a < 124 ? 117 : 125 ));
  //       //   })(totalAreaSize)
  //       //   return house;
  //       //   // return _.pick(house, ColumnsDefined.map(item => item[0]));
  //       // })
  //   );
    
  //   console.log('-----------\n', filterItems, result, '-----------\n');
  //   result.push(filterItems.flat());
  // });
  // return result.flat();
}

async function getBlockList (){
  const {url, type} = url_and_settings.blockList;
  return await _post({url, type});
}

async function _post({
  url,
  type=POST_BODY_CONTENT_TYPE.FORM,
  params={},
}){
  // url, method='POST', params={}
  const projConfig = {
    ysProjectId: global.projInfo.proj_id,
    preSellId: global.projInfo.pre_sell_id
  }
  const finalParams = Object.assign({}, BaseParams, projConfig, params);
  console.log('\r\n\r\nurl / type / finalParams:\r\n', url, '\r\n',type, '\r\n', finalParams, '\r\n');

  let response = null;
  switch(type){
    case POST_BODY_CONTENT_TYPE.RAW:
      response = await SuperAgent.post(url).send(JSON.stringify(finalParams)).set('Content-Type', 'application/json');
      break;
    case POST_BODY_CONTENT_TYPE.FORM:
      response = await SuperAgent.post(url).send(finalParams).set('Content-Type', 'application/x-www-form-urlencoded');
      break;
  }
  const content = response?.body;
  if(content?.status === 200){
    return content.data;
  }else{
    return {};
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