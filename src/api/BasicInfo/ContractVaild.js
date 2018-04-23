/**
 * Created by lqy on 2017/9/8.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import api from '../index';

const path = {
  list: '/contract/valid/list',
  item: '/contract/valid/item',
  update: '/contract/valid/update',
};

// 列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      page,
      size,
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空
      id: filterForm.id, // 集采项目名称id，s可空，下拉
      contractValid: filterForm.contractValid, // 合同有效期方式
      orderName: null,
      orderSort: 'desc',
    },
  });

const item = (id) =>
  api.get(path.item, {
    params: {
      id,
    },
  });

const update = (obj) =>
  api.post(
    path.update,
    {
      // contractBtime: obj.contractBtime,        // 合同开始时间
      contractEtime: obj.contractEtime, // 合同结束时间
      contractValid: obj.contractValid, // 合同有效期方式
      validLength: obj.validLength, // 有效时长
    },
    {
      params: {
        id: obj.id, // 集采项目ID
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
  authbtn,
};
