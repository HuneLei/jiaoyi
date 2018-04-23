/**
 * 医疗机构报量管理
 * 医疗机构报量
 */

import api from '../index';
import config from '../../config';

const path = {
  list: '/reportnum/list',
  reportnumProjectAll: '/reportnum/project/list/all',
  reportnumProjectSubAll: '/reportnum/project/sub/list/all',
  reportnumTimeNameAll: '/reportnum/time/list/all',
  item: '/reportnum/item',
  reportnumItem: '/reportnum/item/list', // 列表-编辑页报量明细
  reportnumDrugs: '/reportnum/drugs/list', // 列表-上架药品弹框
  create: '/reportnum/create',
  update: '/reportnum/update',
  destory: '/reportnum/delete',
  uploadItem: '/reportnum/import', // 明细导入
  outputItem: '/reportnum/export', // 明细导出
  producerItem: '/reportnum/producer/item', // 生产企业详情
  projectSubList: '/reportnum/project/sub/list/alls',
};

const producerItem = (id) =>
  api.get(path.producerItem, {
    params: {
      id,
    },
  });

// 数据列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      timeName: filterForm.timeName,
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空
      projectId: filterForm.projectId,
      projectSubId: filterForm.projectSubId, // 集采子项目id
      hospitalMemberName: filterForm.hospitalMemberName,
      reportnumValidBtime: filterForm.reportnumValidBtime,
      reportnumValidEtime: filterForm.reportnumValidEtime,
      createTime: filterForm.createTime,
      page,
      size,
      orderName: null,
      orderSort: 'asc',
    },
  });

// 下拉-报量时间内的集采项目
const reportnumProjectAll = (gpoMemberId) =>
  api.get(path.reportnumProjectAll, {
    params: {
      gpoMemberId,
    },
  });

// 下拉-报量时间内的集采子项目
const reportnumProjectSubAll = (gpoMemberId, projectId) =>
  api.get(path.reportnumProjectSubAll, {
    params: {
      gpoMemberId,
      projectId,
    },
  });

// 期间名称-下拉
const reportnumTimeNameAll = (projectId) =>
  api.get(path.reportnumTimeNameAll, {
    params: {
      projectId,
    },
  });

// 数据详情
const item = (id) =>
  api.get(path.item, {
    params: {
      id,
    },
  });

const reportnumItem = (reportnumId) =>
  api.get(path.reportnumItem, {
    params: {
      reportnumId,
    },
  });

const reportnumDrugs = (page, size, filterForm) =>
  api.get(path.reportnumDrugs, {
    params: {
      projectIdIn: filterForm.projectId,
      hospitalMemberIdIn: filterForm.hospitalMemberId,
      timeId: filterForm.timeId,
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空
      projectId: filterForm.projectId, // 集采项目id，可空，下拉
      projectSubId: filterForm.projectSubId,
      hospitalMemberId: filterForm.hospitalMemberId,
      hospitalInnerCode: filterForm.hospitalInnerCode.value,
      superviseCode: filterForm.superviseCode.value,
      drugsCode: filterForm.drugsCode.value,
      drugsName: filterForm.drugsName.value,
      formName: filterForm.formName.value,
      specName: filterForm.specName.value,
      producerName: filterForm.producerName.value,
      tradeName: filterForm.tradeName.value,
      approvalNumber: filterForm.approvalNumber.value,
      qualityLevel: filterForm.qualityLevel.value,
      enrollName: filterForm.enrollName.value,
      ids: filterForm.ids,
      id: filterForm.id,
      page,
      size,
      orderName: null,
      orderSort: 'asc',
    },
  });

// 新增
const create = (form) => api.post(path.create, form);

// 编辑
const update = (form) => api.post(path.update, form);

// 删除-报量单
const destory = (id) =>
  api.post(
    path.destory,
    {},
    {
      params: {
        id,
      },
    },
  );

// 获取集采子项目
const projectSubList = (projectSubId) =>
  api.get(path.projectSubList, {
    params: {
      projectSubId,
    },
  });

//  文件导入
const uploadItem = (formData, progress, projectId, projectSubId) =>
  api.post(path.uploadItem, formData, {
    onUploadProgress(e) {
      progress(e);
    },
    params: {
      projectId,
      projectSubId,
    },
  });

// 文件导出
const outputItem = (form) => {
  const token = config.getToken();
  let url = `${config.apiHost}${path.outputItem}?`;
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
  Object.assign(ret, {
    destoryTrade: ret.destory, // 详情页底部删除
    saveTrade: ret.update, // 详情页底部保存
  });
  return ret;
};

export default {
  path,
  authbtn,
  list,
  reportnumProjectAll,
  reportnumProjectSubAll,
  reportnumTimeNameAll,
  item,
  reportnumItem,
  reportnumDrugs,
  create,
  update,
  destory,
  uploadItem,
  outputItem,
  producerItem,
  projectSubList,
};
