/**
 * 客服中心
 * 假期设置
 */
import api from '../index';

const path = {
  list: '/Customer/HolidaySets/list',
};

// 数据列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空
      invoiceDate: filterForm.invoiceDate,
      page,
      size,
      orderName: null,
      orderSort: 'asc',
    },
  });

export default {
  path,
  list,
};
