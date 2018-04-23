/**
 * 公共接口
 */
import api from './index';

const path = {
  parameterListAll: '/common/parameter/list/all', // 获取 [医疗机构级别 -- 23] -- [机构类型 -- 27]
  salerListAll: '/common/saler/list/all', // 获取 卖方会员下拉列表
  addressListAll: '/common/address/list/all', // 获取 地址下拉列表
  commonParameter: '/common/parameter/list/all', // 下拉 获取数据中心的基础参数详情
  commonParameterKey: '/common/parameter/list/all/key', // 下拉 获取数据中心的基础参数详情
};

// 获取基础参数下拉接口，
const parameterListAll = (parentId) =>
  api.get(path.parameterListAll, {
    params: {
      parentId,
    },
  });

// 获取卖方会员下拉列表，
const salerListAll = (projectId) =>
  api.get(path.salerListAll, {
    params: {
      projectId,
    },
  });

// 获取地址下拉
const addressListAll = (memberId) =>
  api.get(path.addressListAll, {
    params: {
      memberId,
    },
  });

// 下拉 基础参数
const commonParameter = (parentId) =>
  api.get(path.commonParameter, {
    params: {
      parentId,
    },
  });

// 下拉 基础参数 kEY查询
const commonParameterKey = (paramKey) =>
  api.get(path.commonParameterKey, {
    params: {
      paramKey,
    },
  });

export default {
  parameterListAll,
  salerListAll,
  addressListAll,
  commonParameter,
  commonParameterKey,
};
