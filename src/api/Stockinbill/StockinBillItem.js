/**
 * 订单结案单申请明细 接口
 * 入库单管理
 */
import api from '../index';
import config from '../../config';

const path = {
  list: '/stockin/bill/item/list', // 列表-入库单详情
  output: '/stockin/bill/item/output/export', // 入库单详情导出
};

// 列表-入库单详情
const list = (page, size, form) =>
  api.get(path.list, {
    params: {
      page,
      size,
      gpoMemberId: form.gpoMemberId,
      stockinCode: form.stockinCode.value,
      ordersCode: form.ordersCode.value,
      deliverCode: form.deliverCode.value,
      batchNo: form.batchNo.value,
      number: form.number.value,
      contractCode: form.contractCode.value,
      drugsCode: form.drugsCode.value,
      drugsName: form.drugsName.value,
      producerName: form.producerName.value,
      salerMemberName: form.salerMemberName.value,
      hospitalMemberName: form.hospitalMemberName.value,
      sendTime: form.sendTime.value === '' ? null : form.sendTime.value,
      noOut: form.noOut.value,
      deliveryMemberName: form.deliveryMemberName.value,
    },
  });

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
  authbtn,
};
