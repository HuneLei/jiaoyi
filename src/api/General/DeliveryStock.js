/**
 * Created by wuqian on 2017/11/11.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import api from '../index';
import config from '../../config';

const path = {
  list: '/delivery/stock/list',
};

// list,列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      gpoMemberId: filterForm.gpoMemberId,
      deliveryMemberCode: filterForm.deliveryMemberCode,
      deliveryMemberName: filterForm.deliveryMemberName,
      drugsCode: filterForm.drugsCode,
      drugsName: filterForm.drugsName,
      batchNo: filterForm.batchNo,
      producerName: filterForm.producerName,
      drugStandardCode: filterForm.drugStandardCode,
      approvalNumber: filterForm.approvalNumber,
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
