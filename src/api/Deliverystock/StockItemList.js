/**
 * Created by lqy on 2017/9/14.
 * <p>
 *     注：配送企业库存管理 - 库存明细列表API
 *        1、itemList -- 库存明细列表
 *        1、export -- 库存明细列表导出
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import api from '../index';
import config from '../../config';

const path = {
  itemList: '/deliverystock/item/list', // 配送企业采购单 -- 列表
  gather: '/deliverystock/item/gather', // 配送企业采购单 -- 數量
  output: '/deliverystock/item/export', // 导出模板
};

// 采购单明细列表
const itemList = (page, size, filterForm) =>
  api.get(path.itemList, {
    params: {
      page,
      size,
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id
      code: filterForm.code, // 采购单编码
      drugsCode: filterForm.drugsCode, // 药品编码
      drugsName: filterForm.drugsName, // 通用名
      producerName: filterForm.producerName, // 生产企业名称
      deliveryMemberName: filterForm.deliveryMemberName, // 配送企业会员名称
      salerMemberName: filterForm.salerMemberName, // 卖方会员名称
      'stockDate.start': filterForm.stockDateStart, // 库存日期开始
      'stockDate.end': filterForm.stockDateEnd, // 库存日期结束
      orderName: null,
      orderSort: 'desc',
    },
  });

// 采购单明细数量
const gather = (page, size, filterForm) =>
  api.get(path.gather, {
    params: {
      page,
      size,
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id
      code: filterForm.code, // 采购单编码
      drugsCode: filterForm.drugsCode, // 药品编码
      drugsName: filterForm.drugsName, // 通用名
      producerName: filterForm.producerName, // 生产企业名称
      deliveryMemberName: filterForm.deliveryMemberName, // 配送企业会员名称
      salerMemberName: filterForm.salerMemberName, // 卖方会员名称
      'stockDate.start': filterForm.stockDateStart, // 库存日期开始
      'stockDate.end': filterForm.stockDateEnd, // 库存日期结束
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
  // Object.assign(ret, {
  //   create: ret.saveorupdate,  // 详情页底部删除
  //   // saveTrade: ret.update,   // 详情页底部保存
  // });
  return ret;
};

export default {
  authbtn,
  itemList,
  gather,
  output,
};
