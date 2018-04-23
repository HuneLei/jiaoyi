/**
 * GPO出库管理
 * 出库单列表
 */
import api from '../index';

const path = {
  list: '/gpo/stockout/list',
  item: '/gpo/stockout/detai/list',
  itemInfo: '/gpo/stockout/info',
  fileUpdata: '/gpo/stockout/detai/order/file', // 保存-附件
};

// 数据列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空
      purchaseCode: filterForm.purchaseCode,
      stockoutCode: filterForm.stockoutCode,
      deliveryMemberName: filterForm.deliveryMemberName,
      stockoutType: filterForm.stockoutType,
      stockoutDate: filterForm.stockoutDate,
      page,
      size,
      orderName: null,
      orderSort: 'asc',
    },
  });

// 数据详情
const itemInfo = (id) =>
  api.get(path.itemInfo, {
    params: {
      id,
    },
  });

const item = (stockoutCode) =>
  api.get(path.item, {
    params: {
      stockoutCode,
    },
  });

const fileUpdata = (id, orderFile) =>
  api.post(path.fileUpdata, {
    id,
    orderFile,
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
  item,
  itemInfo,
  fileUpdata,
};
