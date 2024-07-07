'use strict'; 
import SuperAgent from "superagent";
import _ from 'lodash';

import { sleep } from './util';
import { Columns } from "./constant";

const POST_BODY_CONTENT_TYPE = {
  FORM: 'application/x-www-form-urlencoded',
  RAW: 'application/json',
}

const URL_AND_SETTINGS = {
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

async function getBlockList (){
  const {url, type} = URL_AND_SETTINGS.blockList;
  return await _post({url, type});
}
export async function getProjectSellingDetails(){
  const blocks = await getBlockList();
  console.log('blocks::', blocks);
  
  if(!blocks || (Array.isArray(blocks) && blocks.length < 1)){
    return false;
  }

  const {url, type} = URL_AND_SETTINGS.sellingInfo;
  const result = [];
  for(const block of blocks){
    const sellInfo = await _post({url, type, params: {fybId: block.key}});
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
          housenb: String(housenb).slice(-2),
          ysinsidearea: Math.ceil(ysinsidearea),
          ysbuildingarea: Math.ceil(ysbuildingarea),
          useRate: Number((ysinsidearea/ysbuildingarea).toFixed(2)),
          askpriceeachB: askpriceeachB/1e4,
          askpricetotalB: askpricetotalB/1e4
        });
        // 只需要 Columns 指定的几个几个字段。
        return _.pick(house, Object.keys(Columns));
        
        // return {
        //   id,
        //   buildingName,
        //   buildingbranch,
        //   floor,
        //   housenb: housenb.substring(-2),
        //   ysinsidearea: Math.ceil(ysinsidearea),
        //   ysbuildingarea: Math.ceil(ysbuildingarea),
        //   useRate: (ysinsidearea/ysbuildingarea).toFixed(2),
        //   askpriceeachB: askpriceeachB/1e4,
        //   askpricetotalB: askpricetotalB/1e4
        // }
      })
    );
    result.push(filterItems.flat());
    // 多个楼栋的请求间隔一会儿，保护一下服务器。
    sleep(1500);
  }
  return result.flat();
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
      response = await SuperAgent.post(url).send(JSON.stringify(finalParams)).set('Content-Type', 'application/json; charset=utf-8');
      break;
    case POST_BODY_CONTENT_TYPE.FORM:
      response = await SuperAgent.post(url).send(finalParams).set('Content-Type', 'application/x-www-form-urlencoded');
      break;
  }
  const content = response?.body;
  if(content?.status === 200){
    return content.data;
  }else{
    return [];
  }
}
