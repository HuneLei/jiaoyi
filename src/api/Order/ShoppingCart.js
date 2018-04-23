/**
 * 订单管理 接口
 * 购物车
 */
import api from '../index';
import config from '../../config';

const path = {
  create: '/purchase/plan/create', // 新增采购计划
  list: '/orders/shopping/cart/list', // 购物车列表
  update: '/orders/shopping/cart/update', // 修改购物车
  item: '/orders/shopping/cart/item', // 购物车列表详情
  detailList: '/contract/detail/summary/list', // 合同明细列表
  addresslist: '/common/address/list/all', // 获取当前用户的地址信息
  memberitem: '/orders/shopping/cart/member/item', // 获取当前用户的订单购物车信息
  input: '/orders/shopping/input/plan', // 导入-采购计划
  shopcreate: '/orders/shopping/create', // 生成订单
  outputItem: '/orders/shopping/export', // 购物车导出模板
  uploadItem: '/orders/shopping/import', // 购物车导入功能
  outputItemList: '/orders/shopping/export/list', // 购物车导出数据
};

//  购物车导入功能
const uploadItem = (formData, progress) =>
  api.post(path.uploadItem, formData, {
    onUploadProgress(e) {
      progress(e);
    },
  });

// 购物车导出功能
const outputItem = (gpoid) => {
  const token = config.getToken();
  let url = `${config.apiHost}${path.outputItem}?`;
  url += `access_token=${token}`;
  if (gpoid) {
    url += `&gpoMemberId=${gpoid}`;
  }
  return encodeURI(url);
};

// 购物车导出功能
const outputItemList = (id) => {
  const token = config.getToken();
  let url = `${config.apiHost}${path.outputItemList}?`;
  url += `access_token=${token}`;
  if (id) {
    url += `&id=${id}`;
  }
  return encodeURI(url);
};

// 获取当前用户的地址信息
const addresslist = (memberId) =>
  api.get(path.addresslist, {
    params: {
      memberId,
    },
  });

// 导入-采购计划
const input = (drugsCode, gpoMemberId) =>
  api.get(path.input, {
    params: {
      drugsCode,
      gpoMemberId,
    },
  });

// 获取当前用户的订单购物车信息
const memberitem = (gpoMemberId) =>
  api.get(path.memberitem, {
    params: {
      gpoMemberId,
    },
  });

// 购物车列表
const list = (page, size, form) =>
  api.get(path.list, {
    params: {
      page,
      size,
      hospitalMemberName: form.hospitalMemberName.value,
      gpoMemberId: form.getGpoId,
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
    },
  });

// 新增采购计划
const create = (form) => api.post(path.create, form);

// 生成订单
const shopcreate = (form) => api.post(path.shopcreate, form);

// 修改采购计划
const update = (form) => api.post(path.update, form);

// 采购计划详情
const item = (id) =>
  api.get(path.item, {
    params: {
      id,
    },
  });

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  ret.deliverPrint = true;
  Object.assign(ret, {
    createTrade: ret.shopcreate,
    saveTrade: ret.update,
  });
  return ret;
};

export default {
  authbtn,
  create,
  list,
  update,
  item,
  input,
  detailList,
  addresslist,
  memberitem,
  shopcreate,
  outputItem,
  uploadItem,
  outputItemList,
};
