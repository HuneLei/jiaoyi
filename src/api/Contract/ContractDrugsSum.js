/**
 * 合同药品统计接口
 * Created by txa on 2017/9/19.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */

import api from '../index';
import config from '../../config';

const path = {
  list: '/contract/drugs/sum/list', // 列表
  output: '/contract/drugs/sum/export', // 导出
};

// 列表 list
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      page,
      size,
      drugsCode: filterForm.drugsCode,
      drugsName: filterForm.drugsName,
      hospitalMemberName: filterForm.hospitalMemberName,
      deliveryMemberName: filterForm.deliveryMemberName,
      producerName: filterForm.producerName,
      contractStatus: filterForm.contractStatus ? filterForm.contractStatus.toString() : null,
      closeStatus: filterForm.closeStatus,
      purchaseStatus: filterForm.purchaseStatus,
      executeStatus: filterForm.executeStatus,
      createTime: filterForm.createTime,
      specName: filterForm.specName,
      formName: filterForm.formName,
      tradeName: filterForm.tradeName,
      approvalNumber: filterForm.approvalNumber,
      salerMemberName: filterForm.salerMemberName,
      projectId: filterForm.projectId,
      gpoMemberId: filterForm.gpoMemberId,
      orderName: null,
      orderSort: 'desc',
    },
  });

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

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  return ret;
};

export default {
  path,
  authbtn,
  list,
  output,
};
