/**
 * 药品管理
 * 药品上架管理
 */
import api from '../index';
import config from '../../config';

const path = {
  list: '/drugsUp/list',
  all: '/common/drugs/list/all',
  item: '/drugsUp/item',
  create: '/drugsUp/create',
  update: '/drugsUp/update',
  upStatusUpdate: '/drugsUp/upStatus/update', // 上下架状态
  isChangeDeliveryUpdate: '/drugsUp/isChangeDelivery/update', // 更改配送企业
  createList: '/drugsUp/create/list', // 排除已选药品上架管理
  SalerAll: '/drugsReportList/seller/list/all', // 卖方会员-下拉
  drugsProjectSubAll: '/drugsUp/project/sub/list/all', // 卖方会员-下拉
  mdmdrugsItem: '/sallerchosedelivery/mdmdrugs/list', // 药品详情
  output: '/drugsUp/export', //  导出
  stockItem: '/drugsUp/erpstock/item',
};

// 药品详情
const mdmdrugsItem = (id) =>
  api.get(path.mdmdrugsItem, {
    params: {
      id,
    },
  });

// 卖方会员下拉
const SalerAll = () => api.get(path.SalerAll);

// 集采子项目
const drugsProjectSubAll = (projectId) =>
  api.get(path.drugsProjectSubAll, {
    params: {
      projectId,
    },
  });

// 数据列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空
      projectId: filterForm.projectId, // 集采项目id，可空，下拉
      projectSubId: filterForm.projectSubId, // 集采子项目id
      drugsCode: filterForm.drugsCode,
      drugsName: filterForm.drugsName,
      formName: filterForm.formName,
      specName: filterForm.specName,
      qualityLevel: filterForm.qualityLevel,
      producerName: filterForm.producerName,
      tradeName: filterForm.tradeName,
      approvalNumber: filterForm.approvalNumber,
      drugStandardCode: filterForm.drugStandardCode,
      upStatus: filterForm.upStatus,
      isChangeDelivery: filterForm.isChangeDelivery,
      enrollName: filterForm.enrollName,
      basicType: filterForm.basicType,
      medicalInsuranceDirectory: filterForm.medicalInsuranceDirectory,
      remarks: filterForm.remarks,
      page,
      size,
      //  orderName: 'creatTime',
      //  orderSort: 'asc',
    },
  });

// 数据详情
const item = (id) =>
  api.get(path.item, {
    params: {
      id,
    },
  });

// 药品下拉
const all = (gpoMemberId, projectId) =>
  api.get(path.all, {
    params: {
      gpoMemberId,
      projectId,
    },
  });

// 新增
const create = (drugsUpCreateForms) =>
  api.post(path.create, {
    drugsUpCreateForms,
  });

// 更新
const update = (
  id,
  drugsCode,
  enrollId,
  gpoPrice,
  hospitalUnitPrice,
  projectId,
  projectSubId,
  qualityLevel,
  basicType,
  taxesRate,
  removeFactor,
  middlePack,
  bigPack,
  tradeName,
  approvalNumber,
  drugStandardCode,
  medicalInsuranceDirectory,
  remarks,
) =>
  api.post(
    path.update,
    {
      enrollId,
      gpoPrice,
      hospitalUnitPrice,
      projectId,
      projectSubId,
      qualityLevel,
      basicType,
      taxesRate,
      removeFactor,
      middlePack,
      bigPack,
      tradeName,
      approvalNumber,
      drugStandardCode,
      medicalInsuranceDirectory,
      remarks,
    },
    {
      params: {
        id,
        drugsCode,
      },
    },
  );

const upStatusUpdate = (ids, upStatus) =>
  api.post(
    path.upStatusUpdate,
    {
      ids,
    },
    {
      params: {
        upStatus,
      },
    },
  );

const isChangeDeliveryUpdate = (id, isChangeDelivery) =>
  api.post(
    path.isChangeDeliveryUpdate,
    {},
    {
      params: {
        id,
        isChangeDelivery,
      },
    },
  );

const createList = (page, size, filterForm) =>
  api.get(path.createList, {
    params: {
      projectId: filterForm.projectId,
      gpoMemberId: filterForm.gpoMemberId,
      drugsCode: filterForm.drugsCode.value,
      drugsName: filterForm.drugsName.value,
      tradeName: filterForm.tradeName.value,
      formName: filterForm.formName.value,
      specificationName: filterForm.specificationName.value,
      producerName: filterForm.producerName.value,
      approvalNumber: filterForm.approvalNumber.value,
      // drugsString: filterForm.drugsString,
      page,
      size,
      orderName: null,
      orderSort: 'asc',
    },
  });

const stockItem = (drugsCode) =>
  api.get(path.stockItem, {
    params: {
      sFilter: drugsCode,
    },
  });

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
  authbtn,
  list,
  all,
  item,
  create,
  update,
  upStatusUpdate,
  isChangeDeliveryUpdate,
  createList,
  stockItem,
  SalerAll,
  drugsProjectSubAll,
  mdmdrugsItem,
  output,
};
