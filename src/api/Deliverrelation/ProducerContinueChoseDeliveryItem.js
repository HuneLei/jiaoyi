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
  list: '/changedeliveryaffirm/budrugs/list', // 确认列表
  all: '/common/project/list/all', // 获取集采项目下拉
  confirm: '/changedeliveryaffirm/batch/confirm', // 确认操作
  cancel: '/changedeliveryaffirm/batch/cancel', // 取消操作
  refuse: '/changedeliveryaffirm/batch/refuse', // 拒绝操作
  output: '/deliveryaffirm/export', //  导出
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
      unitName: filterForm.unitName,
      producerName: filterForm.producerName,
      idDeliveryAffirm: filterForm.idDeliveryAffirm,
      deliveryMemberName: filterForm.deliveryMemberName,
      packSpecName: filterForm.packSpecName,
      createTime: filterForm.createTime,
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
};
