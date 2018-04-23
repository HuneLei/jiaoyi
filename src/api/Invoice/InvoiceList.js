/**
 * GPO出库管理
 * 出库单列表
 */
import api from '../index';

const path = {
  list: '/invoice/list',
  item: '/invoice/detailed/list',
  itemInfo: '/invoice/header/list',
  logList: '/invoice/log/list',
  hospitalInvoice: '/invoice/hospital/list', // 医疗机构下拉
  scanningItem: '/invoice/scanning/item', // 查看-发票扫描件
  scanningUpdata: '/invoice/upload', // 保存-发票扫描件
  deliveryList: '/invoice/delivery/list', // 列表-普通发票配送单列表弹框
  redDeliveryList: '/invoice/redDelivery/list', // 列表-冲红发票退货单列表弹框
  outRedDeliveryList: '/invoice/nodelivery/list', // 列表-冲红发票（拒收）退货单列表弹框
  withdraw: '/invoice/withdraw', // 撤回发票
  obsolete: '/invoice/invalid', // 作废发票
  determine: '/invoice/determine', // 确认发票
  submitUpdate: '/invoice/submit', // 提交发票
  keepUpdate: '/invoice/keep/item/create', //   保存发票
  submitCreate: '/invoice/submit/create', // 提交发票--新增里
  keepCreate: '/invoice/keep/create', //   保存发票 -- 新增里
  returnMoney: '/invoice/returned', //   回款
  affirmReturnMoney: '/invoice/affirm/returned', //   回款确认
};

// 数据列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空
      deliveryMemberName: filterForm.deliveryMemberName,
      hospitalMemberName: filterForm.hospitalMemberName,
      code: filterForm.code,
      number: filterForm.number,
      invoiceDate: filterForm.invoiceDate,
      invoiceStatus: filterForm.invoiceStatus,
      invoiceType: filterForm.invoiceType,
      ifUpload: filterForm.ifUpload,
      returned: filterForm.returned,
      returnedTime: filterForm.returnedTime,
      affirmReturned: filterForm.affirmReturned,
      noOut: filterForm.noOut,
      montage: '-1',
      page,
      size,
      //  orderName: 'invoiceDate',
      orderSort: 'desc',
    },
  });

// 数据详情
const itemInfo = (id) =>
  api.get(path.itemInfo, {
    params: {
      id,
    },
  });

const logList = (invoiceId) =>
  api.get(path.logList, {
    params: {
      invoiceId,
    },
  });

const item = (invoiceId) =>
  api.get(path.item, {
    params: {
      invoiceId,
    },
  });

const hospitalInvoice = (gpoMemberId, deliveryMemberId) =>
  api.get(path.hospitalInvoice, {
    params: {
      gpoMemberId,
      deliveryMemberId,
    },
  });

const scanningItem = (id) =>
  api.get(path.scanningItem, {
    params: {
      id,
    },
  });

const scanningUpdata = (id, scanFile) =>
  api.get(path.scanningUpdata, {
    params: {
      id,
      scanFile,
    },
  });

const deliveryList = (page, size, filterForm) =>
  api.get(path.deliveryList, {
    params: {
      gpoMemberId: filterForm.gpoMemberId,
      deliveryMemberId: filterForm.deliveryMemberId,
      hospitalMemberId: filterForm.hospitalMemberId,
      ordersItemNo: filterForm.ordersItemNo.value,
      deliverCode: filterForm.deliverCode.value,
      batchNo: filterForm.batchNo.value,
      drugsCode: filterForm.drugsCode.value,
      drugsName: filterForm.drugsName.value,
      producerName: filterForm.producerName.value,
      arr: filterForm.arr,
      itemArr: filterForm.itemArr,
      invoiceId: filterForm.invoiceId,
      page,
      size,
      orderName: null,
      orderSort: 'asc',
    },
  });

const redDeliveryList = (page, size, filterForm) =>
  api.get(path.redDeliveryList, {
    params: {
      gpoMemberId: filterForm.gpoMemberId,
      deliveryMemberId: filterForm.deliveryMemberId,
      hospitalMemberId: filterForm.hospitalMemberId,
      returnCode: filterForm.returnCode.value,
      batchNo: filterForm.batchNo.value,
      ordersItemNo: filterForm.ordersItemNo.value,
      deliverItemNo: filterForm.deliverItemNo.value,
      stockinItemNo: filterForm.stockinItemNo.value,
      drugsCode: filterForm.drugsCode.value,
      drugsName: filterForm.drugsName.value,
      producerName: filterForm.producerName.value,
      arr: filterForm.arr,
      itemArr: filterForm.itemArr,
      invoiceId: filterForm.invoiceId,
      page,
      size,
      orderName: null,
      orderSort: 'asc',
    },
  });

const outRedDeliveryList = (page, size, filterForm) =>
  api.get(path.outRedDeliveryList, {
    params: {
      gpoMemberId: filterForm.gpoMemberId,
      deliveryMemberId: filterForm.deliveryMemberId,
      hospitalMemberId: filterForm.hospitalMemberId,
      ordersItemNo: filterForm.ordersItemNo.value,
      deliverCode: filterForm.deliverCode.value,
      batchNo: filterForm.batchNo.value,
      drugsCode: filterForm.drugsCode.value,
      drugsName: filterForm.drugsName.value,
      producerName: filterForm.producerName.value,
      arr: filterForm.arr,
      itemArr: filterForm.itemArr,
      invoiceId: filterForm.invoiceId,
      page,
      size,
      orderName: null,
      orderSort: 'asc',
    },
  });

const withdraw = (id) =>
  api.get(path.withdraw, {
    params: {
      id,
    },
  });

const obsolete = (id) =>
  api.get(path.obsolete, {
    params: {
      id,
    },
  });

const determine = (form) => api.post(path.determine, form);

const returnMoney = (form) => api.post(path.returnMoney, form);

// 回款确认
const affirmReturnMoney = (form) => api.post(path.affirmReturnMoney, form);

const keepUpdate = (form) => api.post(path.keepUpdate, form);

const submitCreate = (form) => api.post(path.submitCreate, form);

const keepCreate = (form) => api.post(path.keepCreate, form);

const submitUpdate = (form) => api.post(path.submitUpdate, form);

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  Object.assign(ret, {
    create: ret.keepCreate || ret.submitCreate, // 当赋给用户新增提交或保存权限时,显示show新增按钮
    saveTrade: ret.keepCreate || ret.keepUpdate, // 当赋给用户新增保存或编辑保存权限时,就显示详情底部保存按钮
    submitTrade: ret.submitCreate || ret.submitUpdate, // 当赋给用户新增提交或编辑提交权限时,就显示详情底部提交按钮
    confirmInvoiceTrade: ret.determine, // 当赋给用户新增提交或保存权限时,显示show新增按钮
    batchConfirm: ret.determine, // 当赋给用户新增提交或保存权限时,显示show新增按钮
  });
  return ret;
};

export default {
  path,
  authbtn,
  list,
  itemInfo,
  item,
  logList,
  hospitalInvoice,
  scanningItem,
  scanningUpdata,
  deliveryList,
  redDeliveryList,
  withdraw,
  obsolete,
  determine,
  submitUpdate,
  keepUpdate,
  submitCreate,
  keepCreate,
  outRedDeliveryList,
  returnMoney,
  affirmReturnMoney,
};
