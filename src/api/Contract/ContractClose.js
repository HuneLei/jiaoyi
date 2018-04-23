/**
 * 合同结案申请单接口
 * Created by txa on 2017/9/19.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */

import api from '../index';

const path = {
  list: '/contract/close/list', // 列表
  item: '/contract/close/info', // 详情
  audit: '/contract/close/audit', // 审核
  itemInfo: '/contract/close/item/list', // 合同明细
  remove: '/contract/close/delete', // 删除结案
};

// 列表 list
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      page,
      size,
      code: filterForm.code, // 合同结案单编码
      hospitalMemberName: filterForm.hospitalMemberName, // 医疗机构会员名称
      deliveryMemberName: filterForm.deliveryMemberName, // 配送企业会员名称
      auditStatus: filterForm.auditStatus, // 合审核状态
      closeType: filterForm.closeType,
      createTime: filterForm.createTime, // 申请时间
      projectId: filterForm.projectId, // 集采项目id
      gpoMemberId: filterForm.gpoMemberId, // GPO会员id
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

// 合同明细
const itemInfo = (contractCloseId) =>
  api.get(path.itemInfo, {
    params: {
      contractCloseId,
    },
  });

// 审核
const audit = (obj) => api.post(path.audit, obj);

// 删除结案
const remove = (id) =>
  api.post(
    path.remove,
    {},
    {
      params: {
        id,
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
  list,
  item,
  audit,
  itemInfo,
  remove,
  authbtn,
};
