/**
 * 三方合同列表接口
 * Created by txa on 2017/9/19.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */

import api from '../index';
import config from '../../config';

const path = {
  list: '/contract/list', // 列表
  item: '/contract/info', // 详情
  itemInfo: '/contract/item/list', // 合同明细列表
  drugUsableList: '/contract/drugs/usable/list', // 合同明细新增药品列表
  itemSave: '/contract/item/save', // 修改合同保存
  deletes: '/contract/item/delete', // 删除明细
  copy: '/contract/copy', // 复制合同
  close: '/contract/close', // 合同结案
  cancel: '/contract/cancel', // 取合同
  refuse: '/contract/refuse', // 拒绝合同
  deleteContract: '/contract/delete', // 删除合同
  create: '/contract/create', // 新增合同保存
  submit: '/contract/submit', // 提交
  threeList: '/contract/three/list', // 查看已生成三方合同列表
  log: '/contract/log', // 查看合同日志
  fileSeal: '/contract/file/seal', // 合同签章
  output: '/contract/export', // 导出
  reportList: '/contract/reportnum/list', // 查询导报量单列表
  importItem: '/contract/reportnum/item/list', // 导入报量明细
  dropReason: '/common/reason/list/all', // 下拉原因
  upload: '/contract/import', // 导入
  signatureCheck: '/contract/check', // 验证签章
};

// 列表 list
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      page,
      size,
      code: filterForm.code, // 合同编码
      hospitalMemberName: filterForm.hospitalMemberName, // 医疗机构会员名称
      deliveryMemberName: filterForm.deliveryMemberName, // 配送企业会员名称
      contractStatus: filterForm.contractStatus, // 合同状态
      closeStatus: filterForm.closeStatus, // 结案状态
      validBtime: filterForm.validBtime, // 合同有效期开始时间
      validEtime: filterForm.validEtime, // 合同有效期结束时间
      createTime: filterForm.createTime, // 合同创建日期
      kind: filterForm.kind, // 是否显示草稿合同
      projectId: filterForm.projectId, // 集采项目id
      gpoMemberId: filterForm.gpoMemberId, // GPO会员id
      outNo: filterForm.outNo, // 外部合同编号
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

// 合同明细
const itemInfo = (contractId) =>
  api.get(path.itemInfo, {
    params: {
      contractId,
    },
  });

// 合同明细新增药品列表
const drugUsableList = (page, size, filterForm) =>
  api.get(path.drugUsableList, {
    params: {
      page,
      size,
      drugsIds: filterForm.drugsIds,
      drugsCode: filterForm.drugsCode,
      drugsName: filterForm.drugsName,
      producerName: filterForm.producerName,
      deliveryMemberName: filterForm.deliveryMemberName,
      specName: filterForm.specName,
      approvalNumber: filterForm.approvalNumber,
      tradeName: filterForm.tradeName,
      formName: filterForm.formName,
      salerMemberName: filterForm.salerMemberName,
      projectId: filterForm.projectId,
      gpoMemberId: filterForm.gpoMemberId,
      orderName: null,
      orderSort: 'desc',
    },
  });

// 修改合同保存
const itemSave = (obj) => api.post(path.itemSave, obj);

// 删除合同明细
const deletes = (obj) => api.post(path.deletes, obj);

// 复制合同
const copy = (id) =>
  api.post(
    path.copy,
    {},
    {
      params: {
        id, // 合同ID
      },
    },
  );

// 合同结案
const close = (obj) => api.post(path.close, obj);

// 取消合同
const cancel = (id, remark, status) =>
  api.post(path.cancel, {
    id, // 合同ID
    remark, // 备注
    status, // 状态
  });

// 拒绝合同
const refuse = (obj) => api.post(path.refuse, obj);

// 删除合同
const deleteContract = (id) =>
  api.post(
    path.deleteContract,
    {},
    {
      params: {
        id, // 合同ID
      },
    },
  );

// 新增合同保存
const create = (obj) => api.post(path.create, obj);

// 提交
const submit = (obj) => api.post(path.submit, obj);

// 查看三方合同列表
const threeList = (id) =>
  api.get(path.threeList, {
    params: {
      id, // 合同ID
    },
  });

// 合同日志
const log = (contractId) =>
  api.get(path.log, {
    params: {
      contractId, // 合同ID
    },
  });

// 签章
const fileSeal = (id, url, key) =>
  api.post(
    path.fileSeal,
    {},
    {
      params: {
        id, // 合同ID
        url,
        key,
      },
    },
  );

// 验签
const signatureCheck = (id, key) =>
  api.post(
    path.signatureCheck,
    {},
    {
      params: {
        id, // 合同ID
        key,
      },
    },
  );

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

// 导入报量明细列表
const reportList = (page, size, projectId) =>
  api.get(path.reportList, {
    params: {
      page,
      size,
      projectId,
      orderName: null,
      orderSort: 'desc',
    },
  });

// 导入报量明细
const importItem = (reportnumId) =>
  api.get(path.importItem, {
    params: {
      reportnumId,
    },
  });

// 下拉原因
const dropReason = (paramKey) =>
  api.get(path.dropReason, {
    params: {
      paramKey, // 合同ID
    },
  });

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  Object.assign(ret, {
    saveTrade: ret.itemSave,
    copyTrade: ret.copy,
    submitTrade: ret.submit,
    destoryTrade: ret.deleteContract,
    lookTrade: ret.threeList,
    cancelTrade: ret.cancel,
    applyTrade: ret.close,
    refuseTrade: ret.refuse,
  });
  return ret;
};

export default {
  path,
  authbtn,
  list,
  item,
  itemInfo,
  drugUsableList,
  itemSave,
  deletes,
  copy,
  close,
  cancel,
  refuse,
  deleteContract,
  create,
  submit,
  threeList,
  log,
  fileSeal,
  output,
  upload,
  importItem,
  reportList,
  dropReason,
  signatureCheck,
};
