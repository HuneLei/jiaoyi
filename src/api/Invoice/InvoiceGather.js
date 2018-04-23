/**
 * GPO出库管理
 * 出库单明细
 */
import api from '../index';
import config from '../../config';

const path = {
  list: '/invoice/collect/list',
  gpoList: '/invoice/collect/gpo/list',
  delList: '/invoice/collect/del/list',
  salList: '/invoice/collect/sal/list',
};

// 数据列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      producerName: filterForm.producerName, // gpo会员id，全局，不可空
      drugsName: filterForm.drugsName,
      drugsCode: filterForm.drugsCode,
      batchNo: filterForm.batchNo,
      deliveryMemberName: filterForm.deliveryMemberName,
      num: filterForm.num,
      page,
      size,
      orderName: null,
      orderSort: 'asc',
    },
  });

// GPO数据列表
const gpoList = (page, size, filterForm) =>
  api.get(path.gpoList, {
    params: {
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空
      deliveryMemberId: filterForm.deliveryMemberId,
      drugsCode: filterForm.drugsCode,
      batchNo: filterForm.batchNo,
      number: filterForm.number,
      invoiceDate: filterForm.invoiceDate,
      hospitalMemberName: filterForm.hospitalMemberName,
      deliveryMemberName: filterForm.deliveryMemberName,
      page,
      size,
      orderName: null,
      orderSort: 'asc',
    },
  });

// 数据列表
const delList = (page, size, filterForm) =>
  api.get(path.delList, {
    params: {
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空
      deliveryMemberId: filterForm.deliveryMemberId,
      drugsCode: filterForm.drugsCode,
      batchNo: filterForm.batchNo,
      number: filterForm.number,
      invoiceDate: filterForm.invoiceDate,
      hospitalMemberName: filterForm.hospitalMemberName,
      deliveryMemberName: filterForm.deliveryMemberName,
      page,
      size,
      orderName: null,
      orderSort: 'asc',
    },
  });

// 数据列表
const salList = (page, size, filterForm) =>
  api.get(path.salList, {
    params: {
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空
      drugsCode: filterForm.drugsCode,
      batchNo: filterForm.batchNo,
      number: filterForm.number,
      invoiceDate: filterForm.invoiceDate,
      hospitalMemberName: filterForm.hospitalMemberName,
      deliveryMemberName: filterForm.deliveryMemberName,
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
  gpoList,
  delList,
  salList,
};
