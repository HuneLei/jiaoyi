import api from '../index';
import config from '../../config';

const path = {
  list: '/report/composition/analysis/list',
  output: '/report/composition/analysis/export',
};

// list,列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      gpoMemberId: filterForm.gpoMemberId,
      drugsCode: filterForm.drugsCode,
      drugsName: filterForm.drugsName,
      tradeName: filterForm.tradeName,
      salerMemberName: filterForm.salerMemberName,
      approvalNumber: filterForm.approvalNumber,
      drugStandardCode: filterForm.drugStandardCode,
      objectType: filterForm.objectType,
      dataTime: filterForm.dataTime,
      hospitalMemberName: filterForm.hospitalMemberName,
      deliveryMemberName: filterForm.deliveryMemberName,
      producerName: filterForm.producerName,
      page,
      size,
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
