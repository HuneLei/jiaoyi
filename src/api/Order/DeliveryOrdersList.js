/**
 * 订单管理 接口
 * 配送企业
 */
import api from '../index';

const path = {
  audit: '/delivery/orders/audit', // 审核-确认订单（配送企业）
  item: '/delivery/orders/item', // 详情-订单（配送企业）
  list: '/delivery/orders/list', // 列表-订单（配送企业）
  delivery: '/delivery/orders/delivery', // 发货（货票同行）-订单（配送企业）
  drugslist: '/drugsBatchNo/list/all', // 下拉-药品
  notdelivery: '/delivery/orders/delivery/not', // 发货（非货票同行）-订单（配送企业）
  deliverylist: '/delivery/orders/delivery/list', // 配送单列表
  batchConfirm: '/delivery/orders/batch/audit', // 批量确认
  remarkTrade: '/delivery/orders/delivery/remarks',   // 备注保存
};

// 列表-订单（配送企业）
const list = (page, size, form) =>
  api.get(path.list, {
    params: {
      page,
      size,
      code: form.code.value,
      type: form.type.value,
      noOut: form.noOut.value,
      status: form.status.value ? form.status.value.toString() : null,
      gpoMemberId: form.gpoMemberId,
      createTime: form.createTime.value === '' ? null : form.createTime.value,
      closeStatus: form.closeStatus.value,
      hospitalMemberName: form.hospitalMemberName.value,
      deliveryMemberName: form.deliveryMemberName.value,
      receiveAddress: form.receiveAddress.value,
    },
  });

// 详情-订单（配送企业）
const item = (id) =>
  api.get(path.item, {
    params: {
      id,
    },
  });

// 配送单列表
const deliverylist = (id) =>
  api.get(path.deliverylist, {
    params: {
      id,
    },
  });

// 审核-确认订单（配送企业）
const audit = (id, remark, status) =>
  api.post(path.audit, {
    id,
    remark,
    status,
  });

// 发货（货票同行）-订单（配送企业）
const delivery = (form) => api.post(path.delivery, form);

// 发货（非货票同行）-订单（配送企业）
const notdelivery = (form) => api.post(path.notdelivery, form);

const remarkTrade = (form) => api.post(path.remarkTrade, form);

// 药品下拉
const drugslist = (drugsCode, deliveryMemberId) =>
  api.get(path.drugslist, {
    params: {
      drugsCode,
      deliveryMemberId,
    },
  });

// 确认操作
const batchConfirm = (form) => api.post(path.batchConfirm, form);

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  ret.deliverPrint = true;
  ret.deliveryorderPrint = true;
  ret.orderConfirmPrint = true;
  Object.assign(ret, {
    confirmTrade: ret.audit,
    deliveryTrade: ret.delivery,
    notdeliveryTrade: ret.notdelivery,
  });
  return ret;
};

export default {
  authbtn,
  list,
  item,
  deliverylist,
  audit,
  remarkTrade,
  delivery,
  notdelivery,
  drugslist,
  batchConfirm,
};
