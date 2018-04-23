import api from '../index';
import config from '../../config';

const path = {
  list: '/invoice/query/list',
};

// 数据列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      gpoMemberId: filterForm.gpoMemberId,
      hospitalMemberName: filterForm.hospitalMemberName,
      deliveryMemberName: filterForm.deliveryMemberName,
      number: filterForm.number,
      invoiceDate: filterForm.invoiceDate,
      drugsCode: filterForm.drugsCode,
      drugsName: filterForm.drugsName,
      producerName: filterForm.producerName,
      salerMemberName: filterForm.salerMemberName,
      batchNo: filterForm.batchNo,
      page,
      size,
      orderName: null,
      orderSort: 'asc',
    },
  });

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  return ret;
};

export default {
  path,
  authbtn,
  list,
};
