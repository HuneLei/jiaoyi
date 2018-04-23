/**
 * Created by lqy on 2017/9/14.
 * <p>
 *     注：配送企业采购管理 - 采购单列表 API
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import api from '../index';
import config from '../../config';

const path = {
  create: '/delivery/purchase/list/create', // 创建
  list: '/delivery/purchase/list', // 配送企业采购单 -- 列表
  listItem: '/delivery/purchase/list/item', // 表头 -- 详情
  drugsList: '/delivery/purchase/list/drugs', // 列表-药品已选列表
  drugsCreateList: '/delivery/purchase/list/drugs/create/list', // 列表-配送企业采购单药品-排除已选药品
  update: '/delivery/purchase/list/update', // 采购单修改
  delete: '/delivery/purchase/list/delete', // 采购单删除
  // export: '/delivery/purchase/list/export',                        // 导出模板
  // import: '/delivery/purchase/list/import',                        // 导入模板
  itemCreate: '/delivery/purchase/list/item/create', // 新增 -- 表头信息
  output: '/delivery/purchase/list/export', // 配送企业采购单导出
  upload: '/delivery/purchase/list/import',
  deliveryLog: 'delivery/purchase/list/send/list', // 发货信息日志
};

// 创建
const create = (obj) =>
  api.post(path.create, {
    amount: obj.amount, // 金额
    deliveryMemberCode: obj.deliveryMemberCode, // 配送企业会员编码
    deliveryMemberId: obj.deliveryMemberId,
    deliveryMemberName: obj.deliveryMemberName,
    deliveryPerson: obj.deliveryPerson,
    deliveryPhone: obj.deliveryPhone,
    deliveryPurchaseDrugsItemFormList: obj.deliveryPurchaseDrugsItemFormList,
    gpoMemberId: obj.gpoMemberId,
    gpoMemberName: obj.gpoMemberName,
    id: obj.id,
    projectId: obj.projectId,
    receiveAddress: obj.receiveAddress,
    receiveAddressId: obj.receiveAddressId,
    remarks: obj.remarks,
    // salerMemberCode: obj.salerMemberCode,
    // salerMemberId: obj.salerMemberId,
    // salerMemberName: obj.salerMemberName,
    status: obj.status,
  });

// 采购单列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      page,
      size,
      projectId: filterForm.projectId, // 项目id  int
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id
      code: filterForm.code, // 采购单编码
      noOut: filterForm.noOut, // 外部采购单编号
      deliveryMemberId: filterForm.deliveryMemberId, // 配送企业会员名称
      deliveryMemberName: filterForm.deliveryMemberName, // 配送企业会员名称
      status: filterForm.status, // 采购单状态
      createTime: filterForm.createTime, // 创建时间
      orderName: null,
      orderSort: 'desc',
    },
  });

// 采购单明细列表
const item = (page, size, filterForm) =>
  api.get(path.item, {
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

// 表头详情
const listItem = (filterForm) =>
  api.get(path.listItem, {
    params: {
      id: filterForm.id, // 采购单ID
      projectId: filterForm.projectId, // 项目id  int
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id
      // memberId: filterForm.memberId,                            // 会员ID
    },
  });

// 已选药品列表
const drugsList = (filterForm) =>
  api.get(path.drugsList, {
    params: {
      purchaseId: filterForm.purchaseId, // 采购单ID
      projectId: filterForm.projectId, // 项目ID
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id
      orderName: null,
      orderSort: 'desc',
    },
  });

// 列表-配送企业采购单药品-排除已选药品
const drugsCreateList = (page, size, filterForm) =>
  api.get(path.drugsCreateList, {
    params: {
      page,
      size,
      drugsId: filterForm.drugsId, // 项目id  int
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id
      projectId: filterForm.projectId, // 集采项目ID
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

// 更新
const update = (obj) =>
  api.post(path.update, {
    amount: obj.amount,
    deliveryMemberCode: obj.deliveryMemberCode,
    deliveryMemberId: obj.deliveryMemberId,
    deliveryMemberName: obj.deliveryMemberName,
    deliveryPerson: obj.deliveryPerson,
    deliveryPhone: obj.deliveryPhone,
    deliveryPurchaseDrugsItemFormList: obj.deliveryPurchaseDrugsItemFormList,
    gpoMemberId: obj.gpoMemberId,
    gpoMemberName: obj.gpoMemberName,
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

// 删除
const deleteP = (ids) =>
  api.post(path.delete, {
    ids,
  });

// 表头详情
const itemCreate = (filterForm) =>
  api.get(path.itemCreate, {
    params: {
      id: filterForm.id, // 采购单ID
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id
      memberId: filterForm.memberId, // 会员ID
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
const upload = (formData, id, progress) =>
  api.post(
    path.upload,
    formData,
    {
      params: {
        id,
      },
    },
    {
      onUploadProgress(e) {
        progress(e);
      },
    },
  );

// 发货信息日志
const deliveryLog = (id) =>
  api.get(path.deliveryLog, {
    params: {
      id, // 合同ID
    },
  });

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  return ret;
};

export default {
  path,
  authbtn,
  create,
  list,
  item,
  listItem,
  drugsList,
  drugsCreateList,
  update,
  deleteP,
  itemCreate,
  output,
  upload,
  deliveryLog,
};
