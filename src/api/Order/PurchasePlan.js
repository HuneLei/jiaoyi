/**
 * 订单管理 接口
 * 采购计划
 */
import api from '../index';
import config from '../../config';

const path = {
  create: '/purchase/plan/create', // 新增采购计划
  list: '/purchase/plan/list', // 采购计划列表
  update: '/purchase/plan/update', // 修改采购计划
  item: '/purchase/plan/item', // 采购计划详情
  remove: '/purchase/plan/delete', // 删除采购计划
  detailList: '/contract/detail/summary/list', // 合同明细列表
  outputItem: '/purchase/plan/export', // 采购计划导出功能
  uploadItem: '/purchase/plan/import', // 采购计划导入功能
};

//  采购计划导入功能
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

// 采购计划导出功能
const outputItem = (gpoid) => {
  const token = config.getToken();
  let url = `${config.apiHost}${path.outputItem}?`;
  url += `access_token=${token}`;
  if (gpoid) {
    url += `&gpoMemberId=${gpoid}`;
  }
  return encodeURI(url);
};

// 采购计划列表
const list = (page, size, form) =>
  api.get(path.list, {
    params: {
      page,
      size,
      createTime: form.createTime.value === '' ? null : form.createTime.value,
      gpoMemberId: form.gpoMemberId,
      code: form.code.value,
      name: form.name.value,
      hospitalMemberName: form.hospitalMemberName.value,
    },
  });

// 合同明细列表
const detailList = (page, size, form) =>
  api.get(path.detailList, {
    params: {
      page,
      size,
      drugsString: form.drugsString,
      drugsCode: form.drugsCode.value,
      drugsName: form.drugsName.value,
      formName: form.formName.value,
      producerName: form.producerName.value,
      deliveryMemberName: form.deliveryMemberName.value,
      specName: form.specName.value,
      tradeName: form.tradeName.value,
      gpoMemberId: form.gpoMemberId,
    },
  });

// 新增采购计划
const create = (form) => api.post(path.create, form);

// 修改采购计划
const update = (form) => api.post(path.update, form);

// 采购计划详情
const item = (id) =>
  api.get(path.item, {
    params: {
      id,
    },
  });

// 删除采购计划
const remove = (id) =>
  api.post(
    path.remove,
    {},
    {
      params: {
        id,
      },
    },
  );

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  Object.assign(ret, {
    create: ret.create || ret.update,
    saveTrade: ret.create,
    destoryTrade: ret.remove,
  });
  return ret;
};

export default {
  authbtn,
  create,
  list,
  update,
  item,
  remove,
  detailList,
  outputItem,
  uploadItem,
};
