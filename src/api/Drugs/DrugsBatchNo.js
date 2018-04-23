/**
 * Created by wuqian on 2017/9/20.
 * 药品管理
 * 药品批号管理
 */
import api from '../index';

const path = {
  list: '/drugsBatchNo/list',
  item: '/drugsBatchNo/item',
  update: '/drugsBatchNo/batchNo/update',
  stampUpdate: '/drugsBatchNo/stamp/update',
  updataStatus: '/drugsBatchNo/enable',
};

// 数据列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空
      drugsCode: filterForm.drugsCode,
      drugsName: filterForm.drugsName,
      batchNo: filterForm.batchNo,
      producerName: filterForm.producerName,
      deliveryMemberName: filterForm.deliveryMemberName,
      isUploadReport: filterForm.isUploadReport, // 0： 否，   1： 是
      isGpoStamp: filterForm.isGpoStamp, // 0： 否，   1： 是
      isDeliveryStamp: filterForm.isDeliveryStamp, // 0： 否，   1： 是
      salerMemberName: filterForm.salerMemberName,
      page,
      size,
      orderName: 'drugsCode,batchNo',
      orderSort: 'asc',
    },
  });

// 数据详情
const item = (id) =>
  api.get(path.item, {
    params: {
      id,
    },
  });

// 更新
const update = (id, batchNo) =>
  api.post(
    path.update,
    {},
    {
      params: {
        id,
        batchNo,
      },
    },
  );

// 更新状态
const updataStatus = (id, enable) =>
  api.post(
    path.updataStatus,
    {},
    {
      params: {
        id,
        enable,
      },
    },
  );

// 更新
const stampUpdate = (id, drugsReportFile) =>
  api.post(
    path.stampUpdate,
    {},
    {
      params: {
        id,
        drugsReportFile,
      },
    },
  );

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  return ret;
};

export default {
  path,
  authbtn,
  list,
  item,
  update,
  stampUpdate,
  updataStatus,
};
