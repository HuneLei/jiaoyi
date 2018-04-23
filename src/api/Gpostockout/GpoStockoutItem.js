/**
 * GPO出库管理
 * 出库单明细
 */
import api from '../index';
import config from '../../config';

const path = {
  list: '/gpo/stockout/item/list',
  output: '/gpo/stockout/item/export',
};

// 数据列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空
      purchaseCode: filterForm.purchaseCode,
      stockoutCode: filterForm.stockoutCode,
      drugsCode: filterForm.drugsCode,
      drugsName: filterForm.drugsName,
      tradeName: filterForm.tradeName,
      formName: filterForm.formName,
      specName: filterForm.specName,
      approvalNumber: filterForm.approvalNumber,
      deliveryMemberName: filterForm.deliveryMemberName,
      producerName: filterForm.producerName,
      enrollName: filterForm.enrollName,
      stockoutType: filterForm.stockoutType,
      stockoutDate: filterForm.stockoutDate,
      page,
      size,
      orderName: null,
      orderSort: 'asc',
    },
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
  output,
};
