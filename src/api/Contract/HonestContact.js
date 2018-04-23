/**
 * 廉洁合同接口
 * Created by txa on 2017/9/19.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */

import api from '../index';
import config from '../../config';

const path = {
  list: '/incorruptible/contract/list', // 列表
  item: '/incorruptible/contract/info', // 详情
  check: '/incorruptible/contract/check', // 验签
  fileSeal: '/incorruptible/contract/file/seal', // 签章
  output: '/incorruptible/contract/export', // 签章
};

// 列表 list
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      page,
      size,
      gpoMemberId: filterForm.gpoMemberId,
      firstPartyName: filterForm.firstPartyName,
      secondPartyName: filterForm.secondPartyName,
      contractType: filterForm.contractType ? filterForm.contractType.toString() : null,
      contractStatus: filterForm.contractStatus ? filterForm.contractStatus.toString() : null,
      createTime: filterForm.createTime,
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

const check = (id, key) =>
  api.post(
    path.check,
    {},
    {
      params: {
        id,
        key,
      },
    },
  );

const fileSeal = (id, url, sealName, key) =>
  api.post(
    path.fileSeal,
    {},
    {
      params: {
        id,
        url,
        sealName,
        key,
      },
    },
  );

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
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

export default {
  path,
  list,
  item,
  fileSeal,
  check,
  authbtn,
  output,
};
