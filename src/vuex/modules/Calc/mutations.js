import * as types from './types.js';

/**
 * 初始化key
 * @param {*} baseId 唯一表示id的key
 * @param {*} basePrice 单价
 * @param {*} baseAmount 总价格
 * @param {*} baseAllNum 总数量
 * @param {*} baseMapNum 未入库数量
 * @param {*} baseStockinNum 入库数量
 * @param {*} baseRefusedNum 拒收数量
 * @param {*} baseRefusedType 拒收类型
 */
let _baseId = 'baseId';
let _basePrice = 'basePrice';
let _baseAmount = 'baseAmount';
let _baseAllNum = 'baseAllNum';
let _baseMapNum = 'baseMapNum';
let _baseStockinNum = 'baseStockinNum';
let _baseRefusedNum = 'baseRefusedNum';
let _baseRefusedType = 'baseRefusedType';

//  重置 key 值
const initBaseKey = (state) => {
  _baseId = state.View.baseId;
  _basePrice = state.View.basePrice;
  _baseAmount = state.View.baseAmount;
  _baseAllNum = state.View.baseAllNum;
  _baseMapNum = state.View.baseMapNum;
  _baseStockinNum = state.View.baseStockinNum;
  _baseRefusedNum = state.View.baseRefusedNum;
  _baseRefusedType = state.View.baseRefusedType;
};

//  根据现有的入库数量算出金额并返回列表，总入库数量
const calcAmountNum = (data, dataAllNum) => {
  const retList = [];
  let sumStockinNum = 0;
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];
    retList.push({
      ...item,
      num: i + 1,
      [_baseAmount]: Number(item[_basePrice]) * Number(item[_baseStockinNum]),
      [_baseRefusedType]:
        item[_baseRefusedType] || item[_baseRefusedType] === 0 ? item[_baseRefusedType] : undefined,
      [_baseAllNum]: dataAllNum[item[_baseId]][_baseAllNum],
      [_baseMapNum]: Number(item[_baseMapNum]),
      [_baseStockinNum]: Number(item[_baseStockinNum]),
      [_baseRefusedNum]: Number(item[_baseRefusedNum]),
    });
    sumStockinNum += Number(item[_baseStockinNum]);
  }
  return {
    retList,
    sumStockinNum,
  };
};

//  根据真实的详情列表返回 inIds 跟 notInIds
const calcIds = (data) => {
  const dataArr = Object.entries(data);
  const inIds = [];
  const notInIds = [];
  if (dataArr && dataArr.length) {
    for (let i = 0; i < dataArr.length; i += 1) {
      const item = dataArr[i];
      if (item[1][_baseStockinNum] || item[1][_baseRefusedNum]) {
        notInIds.push(item[0]);
      } else {
        inIds.push(item[0]);
      }
    }
  }
  return {
    inIds,
    notInIds,
  };
};

export default {
  [types.ISFIRST](state, data) {
    state.View.isFirst = false;
  },
  //  key 值初始化
  [types.INITKEY](state, data) {
    _baseId = state.View.baseId = data.baseId || state.View.baseId;
    _basePrice = state.View.basePrice = data.basePrice || state.View.basePrice;
    _baseAmount = state.View.baseAmount = data.baseAmount || state.View.baseAmount;
    _baseAllNum = state.View.baseAllNum = data.baseAllNum || state.View.baseAllNum;
    _baseMapNum = state.View.baseMapNum = data.baseMapNum || state.View.baseMapNum;
    _baseStockinNum = state.View.baseStockinNum = data.baseStockinNum || state.View.baseStockinNum;
    _baseRefusedNum = state.View.baseRefusedNum = data.baseRefusedNum || state.View.baseRefusedNum;
  },
  //  重置所有数据
  [types.INITDATA](state, data) {
    state.View.dataList = [];
    state.View.dialogList = [];
    state.View.dataAllNum = {};
    state.View.inIds = [];
    state.View.notInIds = [];
    state.View.sumStockinNum = 0;
  },
  //  设置明细表格列表
  [types.DATALIST](state, data) {
    initBaseKey(state);

    const dataAllNum = state.View.dataAllNum;
    const idKeys = Object.keys(dataAllNum);
    const retData = {};

    if (data.length) {
      for (let i = 0; i < data.length; i += 1) {
        const item = data[i];
        if (idKeys.indexOf(String(item[_baseId])) === -1) {
          retData[item[_baseId]] = {
            [_basePrice]: Number(item[_basePrice]),
            [_baseAllNum]: Number(item[_baseMapNum]),
            [_baseMapNum]:
              Number(item[_baseMapNum]) -
              Number(item[_baseStockinNum]) -
              Number(item[_baseRefusedNum]),
            [_baseStockinNum]: Number(item[_baseStockinNum]),
            [_baseRefusedNum]: Number(item[_baseRefusedNum]),
          };
        } else {
          retData[item[_baseId]] = {
            ...dataAllNum[item[_baseId]],
            [_baseMapNum]:
              Number(dataAllNum[item[_baseId]][_baseAllNum]) -
              Number(item[_baseStockinNum]) -
              Number(item[_baseRefusedNum]),
            [_baseStockinNum]: Number(item[_baseStockinNum]),
            [_baseRefusedNum]: Number(item[_baseRefusedNum]),
          };
        }
      }
    } else {
      for (let i = 0; i < idKeys.length; i += 1) {
        const id = idKeys[i];
        const item = dataAllNum[id];
        retData[id] = {
          ...item,
          [_baseMapNum]: Number(item[_baseAllNum]),
          [_baseStockinNum]: 0,
          [_baseRefusedNum]: 0,
        };
      }
    }
    state.View.dataAllNum = retData;

    const ret = calcAmountNum(data, state.View.dataAllNum);
    state.View.dataList = ret.retList;
    state.View.sumStockinNum = ret.sumStockinNum;

    const retIds = calcIds(state.View.dataAllNum);
    state.View.inIds = retIds.inIds;
    state.View.notInIds = retIds.notInIds;
  },
  //  设置添加明细弹框表格数据
  [types.DIALOGLIST](state, data) {
    const dataAllNum = state.View.dataAllNum;
    const retList = [];
    for (let i = 0; i < data.length; i += 1) {
      const item = data[i];
      if (dataAllNum[item.id]) {
        retList.push({
          ...item,
          [_baseAllNum]: Number(dataAllNum[item.id][_baseAllNum]),
          [_baseMapNum]: Number(dataAllNum[item.id][_baseMapNum]),
          [_baseStockinNum]: Number(dataAllNum[item.id][_baseStockinNum]),
          [_baseRefusedNum]: Number(dataAllNum[item.id][_baseRefusedNum]),
        });
      } else {
        retList.push({
          ...item,
          [_baseAllNum]: Number(item[_baseMapNum]),
          [_baseMapNum]: Number(item[_baseMapNum]),
          [_baseStockinNum]: 0,
          [_baseRefusedNum]: 0,
        });
      }
    }
    state.View.dialogList = retList;
  },
  //  添加明细
  [types.ADDDETAIL](state, data) {
    initBaseKey(state);

    if (data && data.length) {
      let dataList = state.View.dataList;

      const retData = {};
      let retList = [];
      for (let i = 0; i < data.length; i += 1) {
        const item = data[i];
        retData[item.id] = {
          [_basePrice]: Number(item[_basePrice]),
          [_baseAllNum]: Number(item[_baseMapNum]),
          [_baseMapNum]: 0,
          [_baseStockinNum]: Number(item[_baseMapNum]),
          [_baseRefusedNum]: 0,
        };
        retList.push({
          ...item,
          id: 0,
          [_baseMapNum]: 0,
          [_baseStockinNum]: Number(item[_baseMapNum]),
          [_baseRefusedNum]: 0,
        });
      }
      retList = [...dataList, ...retList];

      state.View.dataAllNum = {
        ...state.View.dataAllNum,
        ...retData,
      };

      const ret = calcAmountNum(retList, state.View.dataAllNum);
      state.View.dataList = ret.retList;
      state.View.sumStockinNum = ret.sumStockinNum;
      const retIds = calcIds(state.View.dataAllNum);
      state.View.inIds = retIds.inIds;
      state.View.notInIds = retIds.notInIds;
    }
  },
  //  删除明细
  [types.DELETEDETAIL](state, data) {
    const dataAllNum = state.View.dataAllNum;
    const dataList = state.View.dataList;

    const retList = [];
    const retData = {
      ...dataAllNum,
    };
    for (let i = 0; i < dataList.length; i += 1) {
      const item = dataList[i];
      if (data.indexOf(item) === -1) {
        retList.push(item);
      } else {
        retData[item[_baseId]] = {
          ...dataAllNum[item[_baseId]],
          [_baseMapNum]: Number(dataAllNum[item[_baseId]][_baseAllNum]),
          [_baseStockinNum]: 0,
          [_baseRefusedNum]: 0,
        };
      }
    }

    state.View.dataAllNum = retData;

    const ret = calcAmountNum(retList, state.View.dataAllNum);
    state.View.dataList = ret.retList;
    state.View.sumStockinNum = ret.sumStockinNum;

    const retIds = calcIds(state.View.dataAllNum);
    state.View.inIds = retIds.inIds;
    state.View.notInIds = retIds.notInIds;
  },
};
