/**
 * 药品管理
 * 药检报告列表
 */
import api from '../index';

const path = {
  list: '/drugsReportList/list',
  item: '/drugsReportList/item',
  createList: '/drugsReportList/create/list', // 新增药品弹框
  create: '/drugsReportList/create',
  update: '/drugsReportList/update',
  SalerAll: '/drugsReportList/seller/list/all', // 卖方会员-下拉
  DrugsReportsAll: '/drugsReportList/list/all', // 药检报告列表下拉
};

// 数据列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空
      drugsCode: filterForm.drugsCode,
      drugsName: filterForm.drugsName,
      batchNo: filterForm.batchNo,
      salerMemberName: filterForm.salerMemberName,
      producerName: filterForm.producerName,
      isGpoStamp: filterForm.isGpoStamp, // 0： 否，   1： 是
      page,
      size,
      orderName: 'drugsCode',
      orderSort: 'asc',
    },
  });

// 卖方会员下拉
const SalerAll = () => api.get(path.SalerAll);

// 药检报告列表下拉
const DrugsReportsAll = (gpoMemberId) =>
  api.get(path.DrugsReportsAll, {
    params: {
      gpoMemberId,
    },
  });

// 数据详情
const item = (id) =>
  api.get(path.item, {
    params: {
      id,
    },
  });

const createList = (page, size, filterForm) =>
  api.get(path.createList, {
    params: {
      enrollId: filterForm.enrollId,
      drugsCode: filterForm.drugsCode.value,
      drugsName: filterForm.drugsName.value,
      tradeName: filterForm.tradeName.value,
      formName: filterForm.formName.value,
      specificationName: filterForm.specificationName.value,
      producerName: filterForm.producerName.value,
      approvalNumber: filterForm.approvalNumber.value,
      drugsString: filterForm.drugsString,
      page,
      size,
      orderName: null,
      orderSort: 'asc',
    },
  });

// 新增
const create = (batchNo, drugsCode, drugsId, drugsReportFile, gpoMemberId, salerMemberId) =>
  api.post(path.create, {
    batchNo,
    drugsCode,
    drugsId,
    drugsReportFile,
    gpoMemberId,
    salerMemberId,
  });

// 更新
const update = (id, batchNo, drugsCode, drugsId, drugsReportFile, gpoMemberId, salerMemberId) =>
  api.post(
    path.update,
    {
      batchNo,
      drugsCode,
      drugsId,
      drugsReportFile,
      gpoMemberId,
      salerMemberId,
    },
    {
      params: {
        id,
      },
    },
  );

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  return ret;
};

export default {
  path,
  authbtn,
  list,
  item,
  createList,
  create,
  update,
  SalerAll,
  DrugsReportsAll,
};
