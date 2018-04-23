/**
 * 退货管理 接口
 * 退货列表
 */
import api from '../index';

const path = {
  create: '/return/bills/create', // 新增-退货单
  list: '/return/bills/list', // 列表-退货单
  update: '/return/bills/update', // 修改-退货单
  item: '/return/bills/item', // 入库单详情
  remove: '/return/bills/delete', // 删除-入库单
  audit: '/return/bills/audit', // 审核-提交订单（入库单）
  deliverylist: '/contract/detail/summary/list', // 配送企业列表
  deliverlist: '/deliver/bill/item/list', // 配送企业列表
  deliveryall: '/common/delivery/list/all', // 配送企业下拉列表
  stockinlist: '/stockin/bill/item/create/list', // 列表-入库单详情
  reasonlist: '/common/reason/list/all', // 下拉-结案、拒绝、取消原因
};

// 下拉-结案、拒绝、取消原因
const reasonlist = (paramKey) =>
  api.get(path.reasonlist, {
    params: {
      paramKey,
    },
  });

// 列表-退货单
const list = (page, size, form) =>
  api.get(path.list, {
    params: {
      page,
      size,
      gpoMemberId: form.gpoMemberId,
      code: form.code.value,
      hospitalMemberName: form.hospitalMemberName.value,
      deliveryMemberName: form.deliveryMemberName.value,
      isDeletable: form.isDeletable.value,
      noOut: form.noOut.value,
      createTime: form.createTime.value === '' ? null : form.createTime.value,
    },
  });

// 配送企业下拉列表
const deliveryall = () => api.get(path.deliveryall);

// 退货单列表
const deliverlist = (page, size, form) =>
  api.get(path.deliverlist, {
    params: {
      page,
      size,
      code: form.code.value,
      hospitalMemberName: form.hospitalMemberName.value,
      deliveryMemberName: form.deliveryMemberName.value,
      isDeletable: form.isDeletable.value,
      noOut: form.noOut.value,
      createTime: form.createTime.value === '' ? null : form.createTime.value,
    },
  });

const stockinlist = (page, size, form) =>
  api.get(path.stockinlist, {
    params: {
      page,
      size,
      ids: form.ids,
      gpoMemberId: form.gpoMemberId,
      stockinCode: form.stockinCode.value,
      deliverCode: form.deliverCode.value,
      batchNo: form.batchNo.value,
      // number: form.number.value,
      ordersCode: form.ordersCode.value,
      drugsCode: form.drugsCode.value,
      drugsName: form.drugsName.value,
      producerName: form.producerName.value,
      salerMemberName: form.salerMemberName.value,
      sendTime: form.sendTime.value === '' ? null : form.sendTime.value,
      deliveryMemberId: form.deliveryMemberId,
    },
  });

// 新增-入库单
const create = (form) => api.post(path.create, form);

// 修改-入库单
const update = (form) => api.post(path.update, form);

// 修改-入库单
const audit = (form) => api.post(path.audit, form);

// 入库单详情
const item = (id) =>
  api.get(path.item, {
    params: {
      id,
    },
  });

// 删除采购计划
const remove = (ids) =>
  api.post(path.remove, {
    ids,
  });

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  ret.deliverPrint = true;
  Object.assign(ret, {
    saveTrade: ret.create,
    submitTrade: ret.update,
    destoryTrade: ret.remove,
    reagreeTrade: ret.audit,
    noreagreeTrade: ret.audit,
    returnsTrade: ret.audit,
    notreturnsTrade: ret.audit,
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
  audit,
  reasonlist,
  deliverlist,
  deliveryall,
  stockinlist,
};
