/**
 * Created by wuqian on 2017/10/25.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import api from '../index';

const path = {
  list: '/seal/list',
  item: '/seal/info',
  update: '/seal/update',
  create: '/seal/create',
  destory: '/seal/delete',
  commonReason: '/common/reason/list/all',
};

// list,列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      memberNo: filterForm.memberNo,
      memberName: filterForm.memberName,
      memberType: filterForm.memberType,
      typeId: filterForm.typeId,
      page,
      size,
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

// 下拉 印章类别
const commonReason = (paramKey) =>
  api.get(path.commonReason, {
    params: {
      paramKey,
    },
  });

// 新增
const create = (enclosure, memberId, remarks, typeId) =>
  api.post(path.create, {
    enclosure,
    memberId,
    remarks,
    typeId,
  });

// 更新
const update = (id, enclosure, memberId, remarks, typeId) =>
  api.post(path.update, {
    id,
    enclosure,
    memberId,
    remarks,
    typeId,
  });

// 删除
const destory = (ids) =>
  api.post(path.destory, {
    ids,
  });

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  return ret;
};

export default {
  list,
  authbtn,
  item,
  create,
  update,
  destory,
  commonReason,
};
