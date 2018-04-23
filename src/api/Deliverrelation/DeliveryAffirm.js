/**
 * 药品配送关系管理
 * 生产企业选择配送商
 */

/**
 * Created by yaoling on 2017/9/8.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import api from '../index';
import config from '../../config';

const path = {
  list: '/deliveryaffirm/budrugs/list', // 确认列表
  all: '/common/project/list/all', // 获取集采项目下拉
  confirm: '/deliveryaffirm/batch/confirm', // 确认操作
  cancel: '/deliveryaffirm/batch/cancel', // 取消操作
  refuse: '/deliveryaffirm/batch/refuse', // 拒绝操作
  output: '/deliveryaffirm/export', //  导出
  subAll: '/common/project/sub/list/all', // 集采子项目
};

const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      page,
      size,
      deliveryMemberId: filterForm.deliveryMemberId,
      projectId: filterForm.projectId,
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空 ,暂时写死
      drugsCode: filterForm.drugsCode,
      drugsName: filterForm.drugsName,
      specName: filterForm.specName,
      tradeName: filterForm.tradeName,
      formName: filterForm.formName,
      approvalNumber: filterForm.approvalNumber,
      enrollName: filterForm.enrollName,
      producerName: filterForm.producerName,
      idDeliveryAffirm: filterForm.idDeliveryAffirm,
      deliveryMemberName: filterForm.deliveryMemberName,
      hospitalMemberName: filterForm.hospitalMemberName,
      projectSubId: filterForm.projectSubId,
      orderName: 'id',
      orderSort: 'DESC',
    },
  });
// 获取所有集采项目下拉
const all = (gpoMemberId) =>
  api.get(path.all, {
    params: {
      gpoMemberId,
    },
  });

// 集采子项目表-下拉
const subAll = (gpoMemberId, projectId) =>
  api.get(path.subAll, {
    params: {
      gpoMemberId,
      projectId,
    },
  });

// 确认操作
const confirm = (form) => api.post(path.confirm, form);

// 取消操作
const cancel = (form) => api.post(path.cancel, form);
// 取消操作
const refuse = (form) => api.post(path.refuse, form);

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  Object.assign(ret, {
    affirmChoose: ret.confirm, // 当赋给用户申请结案权限时,显示申请结案按钮
  });
  return ret;
};

// 文件导出
const output = (form) => {
  const token = config.getToken();
  let url = `${config.apiHost}${path.output}?`;
  url += `access_token=${token}`;
  const keys = Object.keys(form);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    url += `&${key}=${form[key]}`;
  }
  return encodeURI(url);
};

// 已选配送商查看
export default {
  path,
  authbtn,
  list,
  all,
  confirm,
  cancel,
  refuse,
  output,
  subAll,
};
