/**
 * Created by lqy on 2017/9/7.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import api from '../index';

const path = {
  list: '/delivery/list',
  item: '/delivery/item',
  update: '/delivery/update',
  updateStatus: '/delivery/status', // 经营企业启用禁用
};

// 获取列表 list
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      page,
      size,
      gpoMemberId: filterForm.gpoMemberId, // gpoMemberId
      projectId: filterForm.projectId, // 集采项目Id
      provinceId: filterForm.provinceId, // 省
      cityId: filterForm.cityId, // 市
      countyId: filterForm.countyId, // 区
      enable: filterForm.enable,
      enterpriseName: filterForm.enterpriseName, // 企业名称
      enterpriseCode: filterForm.enterpriseCode, // 企业编码
      enterpriseType: filterForm.enterpriseType, // 企业类型
      roleType: filterForm.roleType, // 角色类型
      outGpoNo: filterForm.outGpoNo, // 外部编码
      orderName: null,
      orderSort: 'desc',
    },
  });

// 获取详情
const item = (id) =>
  api.get(path.item, {
    params: {
      id,
    },
  });

// 编辑
const update = (id, outGpoNo) =>
  api.post(
    path.update,
    {},
    {
      params: {
        id,
        outGpoNo,
      },
    },
  );

//  可采药品列表状态
const updateStatus = (id, enable) =>
  api.post(
    path.updateStatus,
    {},
    {
      params: {
        id,
        enable,
      },
    },
  );

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  return ret;
};

export default {
  list,
  item,
  update,
  updateStatus,
  authbtn,
};
