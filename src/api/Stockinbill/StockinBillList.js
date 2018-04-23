/**
 * 订单管理 接口
 * 入库单管理
 */
import api from '../index';

const path = {
  create: '/stockin/bill/create', // 新增-入库单
  list: '/stockin/bill/list', // 列表-入库单
  update: '/stockin/bill/update', // 修改-入库单
  item: '/stockin/bill/item', // 入库单详情
  remove: '/stockin/bill/delete', // 删除-入库单
  deliverlist: '/deliver/bill/item/create/list', // 配送企业列表
  deliveryall: '/common/delivery/list/all', // 配送企业下拉列表
};

// 配送企业下拉列表
const deliveryall = () => api.get(path.deliveryall);

// 配送企业列表
const deliverlist = (page, size, form) =>
  api.get(path.deliverlist, {
    params: {
      page,
      size,
      barcode: form.barcode.value,
      deliverCode: form.deliverCode.value,
      batchNo: form.batchNo.value,
      number: form.number.value,
      ordersCode: form.ordersCode.value,
      producerName: form.producerName.value,
      drugsCode: form.drugsCode.value,
      drugsName: form.drugsName.value,
      salerMemberName: form.salerMemberName.value,
      sendTime: form.sendTime.value === '' ? null : form.sendTime.value,
      deliveryMemberId: form.deliveryMemberId,
      gpoMemberId: form.gpoMemberId,
      inIds: form.inIds && form.inIds.length ? String(form.inIds) : 0,
      notInIds: form.notInIds && form.notInIds.length ? String(form.notInIds) : 0,
    },
  });

// 列表-入库单
const list = (page, size, form) =>
  api.get(path.list, {
    params: {
      page,
      size,
      gpoMemberId: form.gpoMemberId,
      code: form.code.value,
      hospitalMemberName: form.hospitalMemberName.value,
      deliveryMemberName: form.deliveryMemberName.value,
      status: form.status.value,
      noOut: form.noOut.value,
      createTime: form.createTime.value === '' ? null : form.createTime.value,
      sendTime: form.sendTime.value === '' ? null : form.sendTime.value,
    },
  });

// 新增-入库单
const create = (form) =>
  api.post(path.create, {
    ...form,
  });

// 修改-入库单
const update = (form) =>
  api.post(path.update, {
    ...form,
  });

// 入库单详情
const item = (id) =>
  api.get(path.item, {
    params: {
      id,
    },
  });

// 删除-入库单
const remove = (ids) =>
  api.post(path.remove, {
    ids,
  });

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  ret.deliverPrint = true;
  Object.assign(ret, {
    saveTrade: ret.create || ret.update,
    submitTrade: ret.create || ret.update,
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
  deliverlist,
  deliveryall,
};
