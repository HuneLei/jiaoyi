/**
 * GPO出库管理
 * 出库单明细
 */
import api from '../index';
import config from '../../config';

const path = {
  list: '/invoice/item/list',
  listNum: '/invoice/item/num',
  output: '/invoice/item/export',
  confirm: '/invoice/item/deliver/create', // 勾稽确定
  submit: '/invoice/item/deliver/submit', // 勾稽提交
  upInvoiceList: '/invoice/item/deliver/list',
};

// 数据列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空
      number: filterForm.number,
      // stockinCode: filterForm.stockinCode,
      producerName: filterForm.producerName,
      invoiceType: filterForm.invoiceType,
      invoiceStatus: filterForm.invoiceStatus,
      ordersCode: filterForm.ordersCode,
      returnCode: filterForm.returnCode,
      drugsCode: filterForm.drugsCode,
      salerMemberName: filterForm.salerMemberName,
      batchNo: filterForm.batchNo,
      hospitalMemberName: filterForm.hospitalMemberName,
      drugsName: filterForm.drugsName,
      invoiceDate: filterForm.invoiceDate,
      deliverCode: filterForm.deliverCode,
      deliveryMemberName: filterForm.deliveryMemberName,
      code: filterForm.code,
      page,
      size,
      orderName: null,
      orderSort: 'asc',
    },
  });

const listNum = (page, size, filterForm) =>
  api.get(path.listNum, {
    params: {
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空
      number: filterForm.number,
      stockinCode: filterForm.stockinCode,
      producerName: filterForm.producerName,
      invoiceType: filterForm.invoiceType,
      ordersCode: filterForm.ordersCode,
      returnCode: filterForm.returnCode,
      drugsCode: filterForm.drugsCode,
      salerMemberName: filterForm.salerMemberName,
      batchNo: filterForm.batchNo,
      hospitalMemberName: filterForm.hospitalMemberName,
      drugsName: filterForm.drugsName,
      invoiceDate: filterForm.invoiceDate,
      deliverCode: filterForm.deliverCode,
      deliveryMemberName: filterForm.deliveryMemberName,
      code: filterForm.code,
      page,
      size,
      orderName: null,
      orderSort: 'asc',
    },
  });

const confirm = (form) =>
  api.post(path.confirm, {
    ...form,
  });

const upInvoiceList = (page, size, filterForm) =>
  api.get(path.upInvoiceList, {
    params: {
      number: filterForm.number,
      drugsCode: filterForm.drugsCode,
      batchNo: filterForm.batchNo,
      code: filterForm.code,
      drugsNum: filterForm.drugsNum,
      gpoMemberId: filterForm.gpoMemberId,
      deliverinvoiceItemId: filterForm.deliverinvoiceItemId,
      page,
      size,
      orderName: null,
      orderSort: 'asc',
    },
  });

const submit = (form) =>
  api.post(path.submit, {
    ...form,
  });

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

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  return ret;
};

export default {
  path,
  authbtn,
  list,
  listNum,
  output,
  confirm,
  upInvoiceList,
  submit,
};
