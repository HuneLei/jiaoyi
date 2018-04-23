/**
 * 订单结案单申请明细 接口
 * 订单结案单申请明细
 */
import api from '../index';
import config from '../../config';

const path = {
  list: '/orders/close/item/list', // 列表-订单结案单申请明细
  upload: '/orders/close/item/input/import', // 列表-订单结案单申请明细导出
  output: '/orders/close/item/output/export', // 订单结案单申请明细导出
};

// 订单结案单申请明细列表
const list = (page, size, form) =>
  api.get(path.list, {
    params: {
      page,
      size,
      code: form.code.value,
      gpoMemberId: form.gpoMemberId,
      deliveryMemberName: form.deliveryMemberName.value,
      hospitalMemberName: form.hospitalMemberName.value,
      producerName: form.producerName.value,
      drugsCode: form.drugsCode.value,
      drugsName: form.drugsName.value,
      formName: form.formName.value,
      specName: form.specName.value,
      auditStatus: form.auditStatus.value,
      noOut: form.noOut.value,
      ordersCode: form.ordersCode.value,
      createTime: form.createTime.value === '' ? null : form.createTime.value,
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
    confirmTrade: ret.audit,
    output: ret.output,
    deliveryTrade: ret.delivery,
    notdeliveryTrade: ret.notdelivery,
  });
  return ret;
};

export default {
  list,
  output,
  authbtn,
};
