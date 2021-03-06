/**
 * Created by lqy on 2017/9/14.
 * <p>
 *     注：配送企业采购管理 - 采购单明细 API
 *        1、itemList -- 配送企业采购单列表
 *        1、export -- 配送企业采购单导出
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import api from '../index';
import config from '../../config';

const path = {
  itemList: '/delivery/purchase/item/list', // 配送企业采购单 -- 列表
  output: '/delivery/purchase/item/export', // 配送企业采购单导出
};

// 采购单明细列表
const itemList = (page, size, filterForm) =>
  api.get(path.itemList, {
    params: {
      page,
      size,
      projectId: filterForm.projectId, // 项目id  int
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id
      code: filterForm.code, // 采购单编码
      drugsCode: filterForm.drugsCode, // 药品编码
      drugsName: filterForm.drugsName, // 通用名
      producerName: filterForm.producerName, // 生产企业名称
      deliveryMemberName: filterForm.deliveryMemberName, // 配送企业会员名称
      salerMemberName: filterForm.salerMemberName, // 卖方会员名称
      noOut: filterForm.noOut, // 外部采购单编号
      createTime: filterForm.createTime, // 创建时间
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
  authbtn,
  itemList,
  output,
};
