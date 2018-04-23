/**
 * Created by lqy on 2017/9/21.
 * <p>
 *     注：配送企业库存管理 - 库存列表 API
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import api from '../index';
import config from '../../config';

const path = {
  saveorupdate: '/deliverystock/saveorupdate', // 保存提交
  list: '/deliverystock/list', // 库存列表
  item: '/deliverystock/item', // 表头 -- 详情
  itemAll: '/deliverystock/item/all', // 列表-药品已选列表
  stockoutList: '/deliverystock/stockout/list', // 列表-配送企业采购单药品-排除已选药品
  delete: '/deliverystock/delete', // 采购单删除
  output: '/deliverystock/export', // 导出模板GET /deliverystock/export
  upload: '/deliverystock/import',
};

// 保存提交
const saveorupdate = (obj) =>
  api.post(path.saveorupdate, {
    deliveryMemberCode: obj.deliveryMemberCode, // 配送企业会员编码
    deliveryMemberId: obj.deliveryMemberId,
    deliveryMemberName: obj.deliveryMemberName,
    deliveryPerson: obj.deliveryPerson,
    deliveryPhone: obj.deliveryPhone,
    gpoMemberId: obj.gpoMemberId,
    gpoMemberName: obj.gpoMemberName,
    // gpoPerson: obj.gpoPerson,
    // gpoPhone: obj.gpoPhone,
    remarks: obj.remarks,
    status: obj.status,
    stockId: obj.id,
    stockItemFormList: obj.stockItemFormList,
  });

// 库存列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      page,
      size,
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id
      code: filterForm.code, // 库存单号
      deliveryMemberName: filterForm.deliveryMemberName, // 配送企业
      deliveryMemberId: filterForm.deliveryMemberId, // 配送企业会员id
      status: filterForm.status, // 采购单状态
      stockDate: filterForm.stockDate, // 上报日期
      reportTime: filterForm.reportTime, // 上报日期
      orderName: null,
      orderSort: 'desc',
    },
  });

// 表头 -- 根据库存单获取
const item = (obj) =>
  api.get(path.item, {
    params: {
      id: obj.id,
    },
  });

// 已选药品列表 不分页 下面表格
const itemAll = (stockId) =>
  api.get(path.itemAll, {
    params: {
      stockId,
      orderName: null,
      orderSort: 'desc',
    },
  });

// 库存药品  排除已选
const stockoutList = (page, size, filterForm) =>
  api.get(path.stockoutList, {
    params: {
      page,
      size,
      gpoMemberId: filterForm.gpoMemberId, // GPO
      drugsIds: filterForm.drugsIds ? filterForm.drugsIds.toString() : 0,
      drugsCode: filterForm.drugsCode, // gpo会员id
      drugsName: filterForm.drugsName, // 采购单编码
      producerName: filterForm.producerName, // 创建时间
      batchNo: filterForm.batchNo, // 批号
      enable: filterForm.enable, // 创建时间
      orderName: null,
      orderSort: 'desc',
    },
  });

// 删除
const deleteP = (ids) =>
  api.post(path.delete, {
    ids,
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

//  文件导入
const upload = (formData, progress) =>
  api.post(path.upload, formData, {
    onUploadProgress(e) {
      progress(e);
    },
  });

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  Object.assign(ret, {
    create: ret.saveorupdate,
    update: ret.saveorupdate,
    drugsCreateList: ret.stockoutList,
  });
  return ret;
};

export default {
  authbtn,
  saveorupdate,
  list,
  item,
  itemAll,
  stockoutList,
  deleteP,
  output,
  upload,
};
