/**
 * 配送单管理管理 接口
 * 配送单列表
 */
import api from '../index';

const path = {
  audit: '/delivery/orders/audit', // 审核-确认订单（配送企业）
  delivery: '/deliver/bill/delivery', // 发货（货票同行）-订单（配送企业）
  notdelivery: '/deliver/bill/delivery/not', // 发货（非货票同行）-订单（配送企业）
  item: '/deliver/bill/item', // 详情-配送单列表
  deliverylist: '/delivery/orders/delivery/list', // 配送单列表
  list: '/deliver/bill/list', // 列表-配送单列表
  drugslist: '/drugsBatchNo/list/all', // 下拉-药品
  hospitallist: '/common/hospital/list/all', // 下拉-医疗机构-跨订单
  createlist: '/orders/item/create/list', // 列表-订单详情
  backout: '/deliver/bill/delete', // 撤销配送单
  billupdate: '/deliver/bill/update', // 上传随货同行单
};

// 详情-配送单列表
const billupdate = (id, billAccessories) =>
  api.post(path.billupdate, {
    id,
    billAccessories,
  });

// 列表-配送单列表
const list = (page, size, form) =>
  api.get(path.list, {
    params: {
      page,
      size,
      gpoMemberId: form.gpoMemberId,
      code: form.code.value,
      barcode: form.barcode.value,
      noOut: form.noOut.value,
      createTime: form.createTime.value === '' ? null : form.createTime.value,
      sendTime: form.sendTime.value === '' ? null : form.sendTime.value,
      hospitalMemberName: form.hospitalMemberName.value,
      deliveryMemberName: form.deliveryMemberName.value,
      stockinStatus:
        form.stockinStatus && form.stockinStatus.value
          ? form.stockinStatus.value.toString()
          : undefined,
    },
  });

// 列表-订单详情
const createlist = (page, size, form) =>
  api.get(path.createlist, {
    params: {
      page,
      size,
      ids: form.ids,
      code: form.code.value,
      // drugsString: form.drugsString,
      gpoMemberId: form.gpoMemberId,
      contractCode: form.contractCode.value,
      drugsCode: form.drugsCode.value,
      drugsName: form.drugsName.value,
      hospitalMemberId: form.hospitalMemberId,
      receiveAddressId: form.receiveAddressId,
    },
  });

// 详情-配送单列表
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

// 撤销配送单
const backout = (ids) =>
  api.post(path.backout, {
    ids,
  });

// 发货（货票同行）-订单（配送企业）
const delivery = (form) => api.post(path.delivery, form);

// 发货（非货票同行）-订单（配送企业）
const notdelivery = (form) => api.post(path.notdelivery, form);

// 药品下拉
const drugslist = (drugsCode) =>
  api.get(path.drugslist, {
    params: {
      drugsCode,
    },
  });

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  ret.deliverPrint = true;
  Object.assign(ret, {
    create: ret.notdelivery || ret.delivery,
    deliveryTrade: ret.delivery,
    notdeliveryTrade: ret.notdelivery,
    backout: ret.backout,
  });
  return ret;
};

// 药品下拉
const hospitallist = () => api.get(path.hospitallist, {});

export default {
  authbtn,
  list,
  item,
  deliverylist,
  audit,
  delivery,
  notdelivery,
  drugslist,
  hospitallist,
  createlist,
  backout,
  billupdate,
};
