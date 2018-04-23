/**
 * Created by lqy on 2017/10/23.
 *  GPO入库单列表
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */

import api from '../index';
import config from '../../config';

const path = {
  list: '/gpo/stockin/list', // gpo入库单列表
  drugsList: '/gpo/stockin/list/drugs', // 药品列表
  listItem: '/gpo/stockin/list/item', // 表头
  update: '/gpo/stockin/list/update',
};

const list = (page, size, filterForm, orderSort, orderName) =>
  api.get(path.list, {
    params: {
      page,
      size,
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id
      stockinCode: filterForm.stockinCode, // 入库单编码
      salerMemberName: filterForm.salerMemberName, // 卖方会员
      createTime: filterForm.createTime, // 创建时间
      orderName,
      orderSort,
    },
  });

// 表头详情
const listItem = (filterForm) =>
  api.get(path.listItem, {
    params: {
      gpoMemberId: filterForm.gpoMemberId, // gpo会员ID
      stockinCode: filterForm.stockinCode,
    },
  });

// 已选药品列表
const drugsList = (filterForm) =>
  api.get(path.drugsList, {
    params: {
      stockinCode: filterForm.stockinCode,
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id
      orderName: null,
      orderSort: 'desc',
    },
  });

// update
const update = (id, file) =>
  api.post(
    path.update,
    {},
    {
      params: {
        id,
        file,
      },
    },
  );

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  return ret;
};

export default {
  authbtn,
  list,
  listItem,
  update,
  drugsList,
};
