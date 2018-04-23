import * as types from './types.js';

/**
 * 初始化key
 * @param {*} baseId 唯一表示id的key
 * @param {*} basePrice 单价
 * @param {*} baseAmount 总价格
 * @param {*} baseMapNum 未入库总数量
 * @param {*} baseStockinNum 入库数量
 * @param {*} baseRefusedNum 拒收数量
 * @param {*} baseRefusedType 拒收类型
 */
const CalcSet_initKey = ({ commit }, data) => {
  commit(types.INITKEY, data);
};

//  重置所有数据
const CalcSet_initData = ({ commit }, data) => {
  commit(types.INITDATA, data);
};

//  是不是直接进入页面的
const CalcSet_isFirst = ({ commit }, data) => {
  commit(types.ISFIRST, data);
};

//  修改明细表格
const CalcSet_dataList = ({ commit }, data) => {
  commit(types.DATALIST, data);
};

//  修改添加明细弹框表格数据
const CalcSet_dialogList = ({ commit }, data) => {
  commit(types.DIALOGLIST, data);
};

//  添加明细
const CalcSet_addDetail = ({ commit }, data) => {
  commit(types.ADDDETAIL, data);
};

//  删除明细
const CalcSet_deleteDetail = ({ commit }, data) => {
  commit(types.DELETEDETAIL, data);
};

export default {
  CalcSet_initKey,
  CalcSet_initData,
  CalcSet_isFirst,
  CalcSet_dataList,
  CalcSet_dialogList,
  CalcSet_addDetail,
  CalcSet_deleteDetail,
};
