/**
 * Created by wuqian on 2017/10/25.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import api from './index';

const path = {
  pageItem: '/page/item', // 首页获取数量
  pageOrdersItem: '/page/orders/item', // 首页订单金额
  pageContrctItem: '/page/contrct/item', // 首页合同总金额
  pageOrderItem: '/page/order/item', // 首页订单统计
  orderDrugsItem: '/page/orderdrugs/item', // 首页订单药品占比
  orderContItem: '/page/cont/item', // 首页 合同进度
};

// 首页获取数量
const pageItem = (gpoMemerId) =>
  api.get(path.pageItem, {
    params: {
      gpoMemerId,
    },
  });

const pageOrdersItem = (gpoMemerId, stauts) =>
  api.get(path.pageOrdersItem, {
    params: {
      gpoMemerId,
      stauts,
    },
  });

const pageContrctItem = (gpoMemerId, stauts) =>
  api.get(path.pageContrctItem, {
    params: {
      gpoMemerId,
      stauts,
    },
  });

const pageOrderItem = (gpoMemerId, stauts) =>
  api.get(path.pageOrderItem, {
    params: {
      gpoMemerId,
      stauts,
    },
  });

const orderDrugsItem = (gpoMemerId) =>
  api.get(path.orderDrugsItem, {
    params: {
      gpoMemerId,
    },
  });

const orderContItem = (gpoMemerId) =>
  api.get(path.orderContItem, {
    params: {
      gpoMemerId,
    },
  });

export default {
  pageItem,
  pageOrdersItem,
  pageContrctItem,
  pageOrderItem,
  orderDrugsItem,
  orderContItem,
};
