import api from '../index';
import config from '../../config';

const path = {
  list: '/report/hospital/purchase/list',
};

// list,列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      projectId: filterForm.projectId,
      drugsCode: filterForm.drugsCode,
      drugsName: filterForm.drugsName,
      objectType: filterForm.objectType,
      dataTime: filterForm.dataTime,
      hospitalMemberName: filterForm.hospitalMemberName,
      deliveryMemberName: filterForm.deliveryMemberName,
      producerName: filterForm.producerName,
      page,
      size,
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
