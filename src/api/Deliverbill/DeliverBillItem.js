/**
 * 入库单明细 接口
 * 配送单明细
 */
import api from '../index';
import config from '../../config';

const path = {
  audit: '/delivery/orders/audit', // 审核-确认订单（配送企业）
  list: '/deliver/bill/item/list', // 列表-订单详情
  invoicelist: '/invoice/item/stockin/list', // 列表-订单详情
  cancel: '/deliver/bill/item/cancel', // 订单结案
  output: '/deliver/bill/item/output/export', // 配送单详情导出
};

// 发票单列表
const invoicelist = (page, size, filterForm) =>
  api.get(path.invoicelist, {
    params: {
      deliverItemNo: filterForm.deliverItemNo, // 配送单明细
      returnItemNo: filterForm.returnItemNo, // 退货单明细号
      page,
      size,
      orderName: null,
      orderSort: 'asc',
    },
  });

// 配送企业列表
const list = (page, size, form) =>
  api.get(path.list, {
    params: {
      page,
      size,
      gpoMemberId: form.gpoMemberId,
      deliverCode: form.deliverCode.value,
      ordersCode: form.ordersCode.value,
      contractCode: form.contractCode.value,
      drugsCode: form.drugsCode.value,
      drugsName: form.drugsName.value,
      hospitalMemberName: form.hospitalMemberName.value,
      producerName: form.producerName.value,
      salerMemberName: form.salerMemberName.value,
      deliveryMemberName: form.deliveryMemberName.value,
      noOut: form.noOut.value,
      sendTime: form.sendTime.value === '' ? null : form.sendTime.value,
      formName: form.formName.value,
      specName: form.specName.value,
      batchNo: form.batchNo.value,
      barcode: form.barcode.value,
      ifInvoice: form.ifInvoice.value,
      // number: form.number.value,
    },
  });

// 订单结案
const cancel = (form) => api.post(path.cancel, form);

//  导出
const output = (form, gpoid) => {
  const token = config.getToken();
  let url = `${config.apiHost}${path.output}?`;
  url += `access_token=${token}`;
  const keys = Object.keys(form);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (key === 'removed') {
      url += `&${key}=${form[key]}`;
    } else if (form[key].value || Number(form[key].value) === 0) {
      if (form[key].op) {
        url += `&${key}.op=${form[key].op}`;
      }
      url += `&${key}=${form[key].value}`;
    }
  }
  if (gpoid) {
    url += `&gpoMemberId=${gpoid}`;
  }
  return encodeURI(url);
};

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  ret.deliverPrint = true;
  Object.assign(ret, {
    output: ret.output,
  });
  return ret;
};

export default {
  list,
  output,
  cancel,
  invoicelist,
  authbtn,
};
