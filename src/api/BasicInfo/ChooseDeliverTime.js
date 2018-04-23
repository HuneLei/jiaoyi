import api from '../index';

const path = {
  list: '/saler/delivery/time/list',
  header: '/saler/delivery/time/header',
  item: '/saler/delivery/time/item',
  drugsList: '/saler/delivery/time/drugs/list',
  create: '/saler/delivery/time/create',
  deletes: '/saler/delivery/time/delete',
};

// 列表 list
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      page,
      size,
      gpoMemberId: filterForm.gpoMemberId, // gpoMemberId
      projectId: filterForm.projectId, // 集采项目Id
      orderName: null,
      orderSort: 'desc',
    },
  });

// 详情 header
const header = (id) =>
  api.get(path.header, {
    params: {
      id,
    },
  });

// 详情 item
const item = (id) =>
  api.get(path.item, {
    params: {
      id,
    },
  });

const drugsList = (page, size, filterForm) =>
  api.get(path.drugsList, {
    params: {
      projectId: filterForm.projectId,
      gpoMemberId: filterForm.gpoMemberId,
      drugsCode: filterForm.drugsCode.value,
      drugsName: filterForm.drugsName.value,
      tradeName: filterForm.tradeName.value,
      formName: filterForm.formName.value,
      specName: filterForm.specName.value,
      producerName: filterForm.producerName.value,
      approvalNumber: filterForm.approvalNumber.value,
      brr: filterForm.brr ? filterForm.brr.toString() : null,
      page,
      size,
      //  orderName: 'creatTime',
      //  orderSort: 'asc',
    },
  });

const create = (form) =>
  api.post(path.create, {
    ...form,
  });

// 删除操作
const deletes = (form) =>
  api.post(path.deletes, {
    ...form,
  });

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  Object.assign(ret, {
    saveTrade: ret.create,
  });
  return ret;
};

export default {
  list,
  item,
  header,
  drugsList,
  create,
  deletes,
  authbtn,
};
