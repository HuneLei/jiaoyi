/**
 * Created by wuqian on 2017/11/11.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import api from '../index';
import config from '../../config';

const path = {
  list: '/report/monthly/summary/list',
  output: '/report/monthly/summary/export',
};

// list,列表
const list = (filterForm) =>
  api.get(path.list, {
    params: {
      gpoMemberId: filterForm.gpoMemberId, // gpoMemberId
      countYear: filterForm.countYear, // 机构类型
      hospitalMemberName: filterForm.hospitalMemberName,
      deliveryMemberName: filterForm.deliveryMemberName,
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
