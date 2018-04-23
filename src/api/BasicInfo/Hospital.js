/**
 * Created by lqy on 2017/9/4.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */

import api from '../index';

const path = {
  list: '/hospital/list', // 医疗机构列表
  item: '/hospital/item', // 详情
  update: '/hospital/status/update', // 发票是否允许跨订单
  listAll: '/parameter/list/all', // 获取 [医疗机构级别 -- 23] -- [机构类型 -- 27]
  updateCode: '/hospital/outCode/update', // 修改医疗机构外部编码
  all: '/common/project/list/all', // 获取所有集采项目下拉
  hospitalList: '/hospital/popup/hospital/list', // 获取医疗机构
  create: '/hospital/create', // 医疗机构新增
  updateifSync: '/hospital/status', //  发票同步
};

// list,列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      page,
      size,
      gpoMemberId: filterForm.gpoMemberId, // gpoMemberId
      projectId: filterForm.projectId, // 项目名称  string
      provinceId: filterForm.provinceId, // 省，可空  int
      cityId: filterForm.cityId, // 市，可空  int
      countyId: filterForm.countyId, // 县，可空（拼成所在地区）  int
      hospitalCode: filterForm.hospitalCode, // 医疗机构编码   string
      hospitalName: filterForm.hospitalName, // 医疗机构名称   string
      levels: filterForm.levels, // 级别  int
      ifCrossOrder: filterForm.ifCrossOrder, // 发票是否允许跨订单  int
      hospitalCatalog: filterForm.hospitalCatalog, // 机构类型
      outCode: filterForm.outCode, // 医疗机构外部编码
      orderName: null,
      orderSort: 'desc',
    },
  });

// list,列表
const hospitalList = (page, size, filterForm) =>
  api.get(path.hospitalList, {
    params: {
      page,
      size,
      hospitalCode: filterForm.hospitalCode,
      hospitalName: filterForm.hospitalName,
      orderName: null,
      orderSort: 'desc',
    },
  });

// item,详情
const item = (id) =>
  api.get(path.item, {
    params: {
      id,
    },
  });

// 状态更新
const update = (id, ifCrossOrder) =>
  api.post(
    path.update,
    {},
    {
      params: {
        id,
        ifCrossOrder,
      },
    },
  );

// 状态更新
const updateifSync = (id, enable) =>
  api.post(
    path.updateifSync,
    {},
    {
      params: {
        id,
        enable,
      },
    },
  );

const updateCode = (id, outCode) =>
  api.post(
    path.updateCode,
    {},
    {
      params: {
        id,
        outCode,
      },
    },
  );

const create = (obj) => api.post(path.create, obj);

// 获取基础参数
const listAll = (parentId) =>
  api.get(path.listAll, {
    params: {
      parentId,
    },
  });

// 获取所有集采项目下拉
const all = (gpoMemberId) =>
  api.get(path.all, {
    params: {
      gpoMemberId,
    },
  });

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  return ret;
};

export default {
  list,
  item,
  update,
  updateCode,
  listAll,
  authbtn,
  all,
  hospitalList,
  create,
  updateifSync,
};
