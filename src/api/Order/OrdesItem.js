/**
 * 订单结案单申请明细 接口
 * 订单明细
 */
import api from '../index';
import config from '../../config';

const path = {
  list: '/orders/item/list', // 列表-订单详情
  cancel: '/orders/item/cancel', // 订单结案
  output: '/orders/item/output/export', // 订单明细导出
};

// 订单明细列表
const list = (page, size, form) =>
  api.get(path.list, {
    params: {
      page,
      size,
      code: form.code.value,
      gpoMemberId: form.gpoMemberId,
      tradeName: form.tradeName.value,
      drugStandardCode: form.drugStandardCode.value,
      contractCode: form.contractCode.value,
      contractItemNo: form.contractItemNo.value,
      deliveryMemberName: form.deliveryMemberName.value,
      hospitalMemberName: form.hospitalMemberName.value,
      producerName: form.producerName.value,
      drugsCode: form.drugsCode.value,
      drugsName: form.drugsName.value,
      formName: form.formName.value,
      specName: form.specName.value,
      status: form.status.value ? form.status.value.toString() : form.status.value,
      sendStatus: form.sendStatus.value ? form.sendStatus.value.toString() : form.sendStatus.value,
      closeStatus: form.closeStatus.value,
      salerMemberName: form.salerMemberName.value,
      noOut: form.noOut.value,
      receiveAddress: form.receiveAddress.value,
      createTime: form.createTime.value === '' ? null : form.createTime.value,
      confirmTime: form.confirmTime.value === '' ? null : form.confirmTime.value,
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
  Object.assign(ret, {
    applyClosure: ret.cancel,
    output: ret.output,
  });
  return ret;
};

export default {
  list,
  output,
  cancel,
  authbtn,
};
