/**
 * Created by lqy on 2017/9/4.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */

import api from '../index';

const path = {
  list: '/project/list', // 列表数据
  update: '/project/status/update', // 更新状态 -- 开关状态
  all: '/common/project/list/all', // 获取所有集采项目下拉
  defaultUpdate: '/project/default/update', // 改变集采项目是否默认选中
  numUpdate: '/project/num/update', // 改变集采项目是否默认选中
};

// 列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      page,
      size,
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空
      projectName: filterForm.projectName, // 集采项目名称id，可空，下拉
      pattern: filterForm.pattern, // 采购模式，可空
      releaseStatus: filterForm.releaseStatus, // 集采项目公布状态,可空
      beginTime: filterForm.beginTime, // 项目开始时间
      endTime: filterForm.endTime, // 项目结束时间
      orderName: null,
      orderSort: 'desc',
    },
  });

// 状态更新 -- 是否开启
const update = (id, openStatus) =>
  api.post(
    path.update,
    {},
    {
      params: {
        id,
        openStatus,
      },
    },
  );

// 状态更新 -- 是否默认
const defaultUpdate = (id, gpoMemberId) =>
  api.post(
    path.defaultUpdate,
    {},
    {
      params: {
        id,
        gpoMemberId,
      },
    },
  );

// 状态更新 -- 是否默认
const numUpdate = (id, deliveryNum, contractMoudleType) =>
  api.post(
    path.numUpdate,
    {},
    {
      params: {
        id,
        deliveryNum,
        contractMoudleType,
      },
    },
  );

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
  path,
  authbtn,
  list,
  update,
  defaultUpdate,
  numUpdate,
  all,
};
