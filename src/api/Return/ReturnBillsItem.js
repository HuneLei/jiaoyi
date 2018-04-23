/**
 * 退货单管理 接口
 * 退货单明细详情
 */
import api from '../index';
import config from '../../config';

const path = {
  list: '/return/bills/item/list', // 列表-退货单详情
  cancel: '/deliver/bill/item/cancel', // 订单结案
  output: '/return/bills/item/output/export', // 退货单详情导出
};

// 列表-退货单详情
const list = (page, size, form) =>
  api.get(path.list, {
    params: {
      page,
      size,
      gpoMemberId: form.gpoMemberId,
      returnCode: form.returnCode.value,
      batchNo: form.batchNo.value,
      invoiceNumber: form.invoiceNumber.value,
      deliveryMemberName: form.deliveryMemberName.value,
      hospitalMemberName: form.hospitalMemberName.value,
      stockinCode: form.stockinCode.value,
      deliverCode: form.deliverCode.value,
      ordersCode: form.ordersCode.value,
      drugsCode: form.drugsCode.value,
      drugsName: form.drugsName.value,
      contractItemNo: form.contractItemNo.value,
      producerName: form.producerName.value,
      salerMemberName: form.salerMemberName.value,
      noOut: form.noOut.value,
      invoicedNum: form.invoicedNum.value,
      createTime: form.createTime.value === '' ? null : form.createTime.value,
      deliverAuditTime: form.deliverAuditTime.value,
      isDeletable: form.isDeletable.value,
    },
  });

// 列表-退货单导出
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
  authbtn,
};
