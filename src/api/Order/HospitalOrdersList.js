/**
 * 订单管理 接口
 * 医疗机构
 */
import api from '../index';

const path = {
  audit: '/hospital/orders/audit', // 审核-取消订单（医疗机构）
  cancel: '/hospital/orders/cancel', // 结案-订单（医疗机构）
  detail: '/hospital/orders/detail', // 详情-订单不带权限（医疗机构）
  item: '/hospital/orders/item', // 详情-订单（医疗机构）
  list: '/hospital/orders/list', // 列表-订单（医疗机构）
  delivery: '/delivery/orders/delivery/list', // 配送单列表
  orderslog: '/hospital/orders/log', // 日志信息
  reasonlist: '/common/reason/list/all', // 下拉-结案、拒绝、取消原因
};

// 列表-订单（医疗机构）
const list = (page, size, form) =>
  api.get(path.list, {
    params: {
      page,
      size,
      code: form.code.value,
      type: form.type.value,
      noOut: form.noOut.value,
      status: form.status.value ? form.status.value.toString() : form.status.value,
      gpoMemberId: form.gpoMemberId,
      createTime: form.createTime.value === '' ? null : form.createTime.value,
      closeStatus: form.closeStatus.value,
      hospitalMemberName: form.hospitalMemberName.value,
      deliveryMemberName: form.deliveryMemberName.value,
      receiveAddress: form.receiveAddress.value,
    },
  });

// 详情-订单（医疗机构）
const item = (id) =>
  api.get(path.item, {
    params: {
      id,
    },
  });

// 下拉-结案、拒绝、取消原因
const reasonlist = (paramKey) =>
  api.get(path.reasonlist, {
    params: {
      paramKey,
    },
  });

// 详情-订单（医疗机构）
const orderslog = (id) =>
  api.get(path.orderslog, {
    params: {
      id,
    },
  });

// 配送单列表
const delivery = (id) =>
  api.get(path.delivery, {
    params: {
      id,
    },
  });

// 审核-取消订单（医疗机构）
const audit = (id, remark, status) =>
  api.post(path.audit, {
    id,
    remark,
    status,
  });

// 结案-订单（医疗机构）
const cancel = (form) => api.post(path.cancel, form);

// 详情-订单不带权限（医疗机构）
const detail = (ids) =>
  api.post(path.detail, {
    ids,
  });

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  Object.assign(ret, {
    cancelTrade: ret.audit,
    applyTrade: ret.cancel,
  });
  return ret;
};

export default {
  authbtn,
  delivery,
  audit,
  list,
  cancel,
  detail,
  item,
  orderslog,
  reasonlist,
};
