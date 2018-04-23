/**
 * Created by lqy on 2017/9/14.
 * <p>
 *     注：配送企业库存管理 - 期间库存
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import api from '../index';

const path = {
  itemList: '/deliverystock/sum/list', // 期间库存列表
};

// 采购单明细列表
const itemList = (page, size, filterForm) =>
  api.get(path.itemList, {
    params: {
      page,
      size,
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id
      drugsCode: filterForm.drugsCode, // 药品编码
      drugsName: filterForm.drugsName, // 通用名
      producerName: filterForm.producerName, // 生产企业名称
      deliveryMemberName: filterForm.deliveryMemberName, // 配送企业会员名称
      dateRangeStr: filterForm.dateRangeStr, // 查询日期
      orderName: null,
      orderSort: 'desc',
    },
  });

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  return ret;
};

export default {
  authbtn,
  itemList,
};
