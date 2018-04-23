/**
 * 覆盖率管理接口
 * Created by lqy on 2017/9/11.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */

import api from '../index';
import config from '../../config';

const path = {
  list: '/cover/rate/list', // 列表
  item: '/cover/rate/item', // 详情
  create: '/cover/rate/create', // 新增
  all: '/cover/rate/list/all', // 列表 -- 医疗机构
  aduitStatusUpdate: '/cover/rate/auditStatus/update', // 审核状态 -- 修改
  enableUpdate: '/cover/rate/enable/update', // 启用状态
};

// 列表 list
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      page,
      size,
      enterpriseName: filterForm.enterpriseName, // 企业名称
      audtiStatus: filterForm.audtiStatus, // 审核状态
      orderName: null,
      orderSort: 'desc',
    },
  });

// 详情 item
const item = (id) =>
  api.get(path.item, {
    params: {
      id, // 覆盖率Id
    },
  });

// 创建
const create = (obj) =>
  api.post(path.create, {
    deliverProtocol: obj.deliverProtocol, // 配送协议
    hospitalId: obj.hospitalId, // 医疗机构ID
  });

// 医疗机构列表
const all = (page, size, filterForm) =>
  api.get(path.all, {
    params: {
      page,
      size,
      hospitalName: filterForm.hospitalName, // 名称
      provinceId: filterForm.provinceId, // 省
      cityId: filterForm.cityId, // 市
      orderName: null,
      orderSort: 'desc',
    },
  });

// 更新 -- 启用状态
const enableUpdate = (id, enable) =>
  api.post(
    path.enableUpdate,
    {},
    {
      params: {
        id, // 覆盖率ID
        enable, // 启用状态（0 禁用，1启用）
      },
    },
  );

// 更新 -- 审核状态
const aduitStatusUpdate = (id, auditStatus) =>
  api.post(
    path.aduitStatusUpdate,
    {},
    {
      params: {
        id, // 覆盖率ID
        auditStatus, // 审核状态(0待审核，1审核通过，2审核不通过)
      },
    },
  );

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  return ret;
};

export default {
  path,
  authbtn,
  list,
  item,
  create,
  all,
  enableUpdate,
  aduitStatusUpdate,
};
