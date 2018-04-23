/**
 * Created by lqy on 2017/9/7.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import api from '../index';

const path = {
  list: '/producer/list',
  item: '/producer/item',
  licenseItem: '/producer/license/item',
  permitItem: '/producer/item',
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
      enterpriseName: filterForm.enterpriseName, // 企业名称   string
      enterpriseCode: filterForm.enterpriseCode, // 企业编码   string
      enterpriseType: filterForm.enterpriseType, // 企业类型  int
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

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  return ret;
};

export default {
  list,
  item,
  authbtn,
};
