/**
 * 订单结案单申请 接口
 * 采购计划
 */
import api from '../index';

const path = {
  list: '/orders/close/list', // 列表-订单结案单申请
  item: '/orders/close/item', // 详情-订单结案单申请
  audit: '/orders/close/audit', // 审核-订单结案单申请
  delete: '/orders/close/delete', // 删除-订单结案单申请
  closelog: '/orders/close/log', // 结案单日志
};

// 列表-订单结案单申请
const list = (page, size, form) =>
  api.get(path.list, {
    params: {
      page,
      size,
      code: form.code.value,
      deliveryMemberName: form.deliveryMemberName.value,
      hospitalMemberName: form.hospitalMemberName.value,
      auditStatus: form.auditStatus.value,
      noOut: form.noOut.value,
      createTime: form.createTime.value === '' ? null : form.createTime.value,
    },
  });

// 审核-订单结案单申请
const audit = (form) => api.post(path.audit, form);

// 详情-订单结案单申请
const item = (id) =>
  api.get(path.item, {
    params: {
      id,
    },
  });

// 结案单日志
const closelog = (id) =>
  api.get(path.closelog, {
    params: {
      id,
    },
  });

// 删除-订单结案单申请
const remove = (ids) =>
  api.post(path.delete, {
    ids,
  });

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  Object.assign(ret, {
    removeTrade: ret.delete,
    agreeTrade: ret.audit,
    noagreeTrade: ret.audit,
  });
  return ret;
};

export default {
  list,
  audit,
  item,
  remove,
  closelog,
  authbtn,
};
