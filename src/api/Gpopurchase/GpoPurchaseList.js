/**
 * Created by lqy on 2017/9/16.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import api from '../index';
import config from '../../config';

const path = {
  list: '/gpo/purchase/list', // gpo采购单列表
  listItem: '/gpo/purchase/list/item', // gpo采购单 表头
  drugsCreateList: '/gpo/purchase/list/drugs/create/list', // gpo药品，排除已选
  create: '/gpo/purchase/list/create', // 创建
  update: '/gpo/purchase/list/update', // 更新
  drugsList: '/gpo/purchase/list/drugs', // 列表-药品已选列表
  delete: '/gpo/purchase/list/delete', // 采购单删除
  itemCreate: '/gpo/purchase/list/item/create', // 采购单新增表头
  output: '/gpo/purchase/list/export', // 配送企业采购单导出
  upload: '/gpo/purchase/list/import',
};

const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      page,
      size,
      projectId: filterForm.projectId, // 项目id  int
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id
      code: filterForm.code, // 采购单编码
      salerMemberName: filterForm.salerMemberName, // 卖方会员名称
      status: filterForm.status, // 采购单状态
      createTime: filterForm.createTime, // 创建时间
      orderName: null,
      orderSort: 'desc',
    },
  });

// 表头详情
const listItem = (filterForm) =>
  api.get(path.listItem, {
    params: {
      id: filterForm.id, // 采购单ID
      gpoMemberId: filterForm.gpoMemberId, // gpo会员ID
      salerMemberId: filterForm.salerMemberId, // 卖方会员ID
    },
  });

// 列表-配送企业采购单药品-排除已选药品
const drugsCreateList = (page, size, filterForm) =>
  api.get(path.drugsCreateList, {
    params: {
      page,
      size,
      drugsId: filterForm.drugsId, // 项目id  int
      gpoMemberId: filterForm.gpoMemberId, // gpo会员ID
      projectId: filterForm.projectId, // 项目id  int
      salerMemberId: filterForm.salerMemberId,
      drugsCode: filterForm.drugsCode, // gpo会员id
      drugsName: filterForm.drugsName, // 采购单编码
      tradeName: filterForm.tradeName, // 外部采购单编号
      formName: filterForm.formName, // 配送企业会员名称
      specificationName: filterForm.specificationName, // 采购单状态
      producerName: filterForm.producerName, // 创建时间
      approvalNumber: filterForm.approvalNumber, // 创建时间
      orderName: null,
      orderSort: 'desc',
    },
  });

// 创建
const create = (obj) =>
  api.post(path.create, {
    amount: obj.amount,
    gpoMemberId: obj.gpoMemberId,
    gpoMemberName: obj.gpoMemberName,
    gpoPerson: obj.gpoPerson,
    gpoPhone: obj.gpoPhone,
    gpoPurchaseDrugsItemFormList: obj.gpoPurchaseDrugsItemFormList,
    id: obj.id,
    projectId: obj.projectId,
    receiveAddress: obj.receiveAddress,
    receiveAddressId: obj.receiveAddressId,
    remarks: obj.remarks,
    salerMemberCode: obj.salerMemberCode,
    salerMemberId: obj.salerMemberId,
    salerMemberName: obj.salerMemberName,
    status: obj.status,
  });

// 更新
const update = (obj) =>
  api.post(path.update, {
    amount: obj.amount,
    gpoMemberId: obj.gpoMemberId,
    gpoMemberName: obj.gpoMemberName,
    gpoPerson: obj.gpoPerson,
    gpoPhone: obj.gpoPhone,
    gpoPurchaseDrugsItemFormList: obj.gpoPurchaseDrugsItemFormList,
    id: obj.id,
    projectId: obj.projectId,
    receiveAddress: obj.receiveAddress,
    receiveAddressId: obj.receiveAddressId,
    remarks: obj.remarks,
    salerMemberCode: obj.salerMemberCode,
    salerMemberId: obj.salerMemberId,
    salerMemberName: obj.salerMemberName,
    status: obj.status,
  });

// 已选药品列表
const drugsList = (filterForm) =>
  api.get(path.drugsList, {
    params: {
      purchaseId: filterForm.purchaseId, // 采购单ID
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id
      orderName: null,
      orderSort: 'desc',
    },
  });

// 删除
const deleteP = (ids) =>
  api.post(path.delete, {
    ids,
  });

// 表头详情 -- 新增
const itemCreate = (filterForm) =>
  api.get(path.itemCreate, {
    params: {
      memberId: filterForm.gpoMemberId, // gpo会员ID
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
  return ret;
};

export default {
  authbtn,
  list,
  listItem,
  drugsCreateList,
  create,
  update,
  drugsList,
  deleteP,
  itemCreate,
  output,
  upload,
};
