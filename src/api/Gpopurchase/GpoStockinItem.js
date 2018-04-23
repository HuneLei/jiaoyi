/**
 * Created by lqy on 2017/10/23.
 *  GPO入库单明细
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */

import api from '../index';
import config from '../../config';

const path = {
  list: '/gpo/stockin/item/list', // gpo采购单明细列表
  output: '/gpo/stockin/item/export',
};

const list = (page, size, filterForm, orderSort, orderName) =>
  api.get(path.list, {
    params: {
      page,
      size,
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id
      stockinCode: filterForm.stockinCode, // 入库单编码
      batchNo: filterForm.batchNo, // 批号
      salerMemberName: filterForm.salerMemberName, // 卖方会员
      producerName: filterForm.producerName, // 生产企业名称
      drugsCode: filterForm.drugsCode, // 药品编码
      drugsName: filterForm.drugsName, // 通用名
      tradeName: filterForm.tradeName, // 商品名
      formName: filterForm.formName, // 剂型
      specName: filterForm.specName, // 规格
      approvalNumber: filterForm.approvalNumber, // 批准文号
      createTime: filterForm.createTime, // 创建时间
      orderName,
      orderSort,
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
  list,
  output,
};
