/**
 * Created by lqy on 2017/9/9.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import api from '../index';

const path = {
  list: '/deliver/time/list', // 点配送时间列表
  item: '/deliver/time/item', // 点配送时间详情
  update: '/deliver/time/update', // 点配送时间修改更新
};

// 列表 list
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      page,
      size,
      gpoMemberId: filterForm.gpoMemberId, // gpoMemberId
      projectId: filterForm.projectId, // 集采项目Id
      projectSubName: filterForm.projectSubName, // 子项目名称
      orderName: null,
      orderSort: 'desc',
    },
  });

// 详情 item
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
      deliveryBtime: obj.deliveryBtime, // 生产企业选配送时间 -- 开始时间
      deliveryEtime: obj.deliveryEtime, // 生产企业选配送时间 -- 结束时间
      hospitalBtime: obj.hospitalBtime, // 配送确认时间 -- 开始时间
      hospitalEtime: obj.hospitalEtime, // 配送确认时间 -- 开始时间
      producerBtime: obj.producerBtime, // 医疗机构选配送时间 -- 开始时间
      producerEtime: obj.producerEtime, // 医疗机构选配送时间 -- 开始时间
    },
    {
      params: {
        id: obj.id,
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
