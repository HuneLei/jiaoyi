/**
 * 药品配送关系管理
 * 生产企业选择配送商
 */

/**
 * Created by yaoling on 2017/9/8.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import api from '../index';

const path = {
  list: '/sallerchosedelivery/upper/drugs/list', // 药品列表
  all: '/common/project/list/all', // 获取集采项目下拉
  salerMemberList: '/sallerchosedelivery/distribu/list', // 卖方会员选配送企业列表
  diliverMember: '/sallerchosedelivery/member/list', // 配送商信息
  item: '/sallerchosedelivery/mdmdrugs/list', // 药品列表详细信息
  deliverList: '/sallerchosedelivery/item/list', // 已选配送商查看
  coverage: '/sallerchosedelivery/disfugai/list', // 覆盖率列表
  specific: '/sallerchosedelivery/drugs/list', // 药品独配列表
  drugsNumber: '/sallerchosedelivery/drugsNumber/list', // 药品独配数量
  submit: '/sallerchosedelivery/create', // 新增卖方选配送
  deletes: '/sallerchosedelivery/delete', // 删除卖方选配送
  enterprise: '/buyerchosedelivery/enterprise/list', // 详情-企业配送区域省市县信息
  storage: '/buyerchosedelivery/storage/list', // 详情-企业配送仓储表
  transport: '/buyerchosedelivery/transport/list', // 详情-企业配送运输车辆表
  subAll: '/common/project/sub/list/all',
};

// 药品列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      page,
      size,
      projectId: filterForm.projectId,
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空
      drugsCode: filterForm.drugsCode,
      drugsName: filterForm.drugsName,
      specName: filterForm.specName,
      tradeName: filterForm.tradeName,
      formName: filterForm.formName,
      approvalNumber: filterForm.approvalNumber,
      enrollName: filterForm.enrollName,
      producerName: filterForm.producerName,
      nametype: filterForm.nametype,
      projectSubId: filterForm.projectSubId,
      orderName: 'id',
      orderSort: 'asc',
    },
  });

// 获取所有集采项目下拉
const all = (gpoMemberId) =>
  api.get(path.all, {
    params: {
      gpoMemberId,
    },
  });

// 集采子项目表-下拉
const subAll = (gpoMemberId, projectId) =>
  api.get(path.subAll, {
    params: {
      gpoMemberId,
      projectId,
    },
  });

// 卖方会员选配送企业列表
const salerMemberList = (page, size, filterForm) =>
  api.get(path.salerMemberList, {
    params: {
      page,
      size,
      projectId: filterForm.projectId,
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空
      drugsId: filterForm.drugsId,
      salerMemberId: filterForm.salerMemberId,
      provinceId: filterForm.provinceId, // 省
      cityId: filterForm.cityId, // 市
      countyId: filterForm.countyId, // 区
      memberName: filterForm.memberName, // 企业名称
      memberNo: filterForm.memberNo, // 企业编码
      roleType: filterForm.roleType, // 角色类型
      orderName: 'id',
      orderSort: 'asc',
    },
  });

// 配送商详情
const diliverMember = (id) =>
  api.get(path.item, {
    params: {
      id,
    },
  });

// 药品列表详细信息
const item = (id) =>
  api.get(path.item, {
    params: {
      id,
    },
  });

// 已选配送商查看
const deliverList = (projectId, gpoMemberId, drugsId) =>
  api.get(path.deliverList, {
    params: {
      projectId,
      gpoMemberId,
      drugsId,
    },
  });

// 查看覆盖率
const coverage = (page, size, filterForm) =>
  api.get(path.coverage, {
    params: {
      page,
      size,
      id: filterForm.id,
      projectId: filterForm.projectId,
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空 ,
      orderName: 'id',
      orderSort: 'asc',
    },
  });

// 药品独配列表
const specific = (drugsId, projectId, gpoMemberId, salerMemberId, nameType, deliveryMemberId) =>
  api.get(path.specific, {
    params: {
      drugsId,
      projectId,
      gpoMemberId,
      salerMemberId,
      nameType,
      deliveryMemberId,
    },
  });

// 药品独配列表数量
const drugsNumber = (page, size, filterForm) =>
  api.get(path.drugsNumber, {
    params: {
      page,
      size,
      drugsId: filterForm.drugsId,
      projectId: filterForm.projectId,
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空 ,
      deliveryMemberId: filterForm.deliveryMemberId,
      orderName: 'id',
      orderSort: 'asc',
    },
  });

// 新增卖方选配送
const submit = (form) => api.post(path.submit, form);

// 删除卖方选配送
const deletes = (form) => api.post(path.deletes, form);

// 企业配送区域省市县信息
const enterprise = (gpoMemberId, projectId, memberId) =>
  api.get(path.enterprise, {
    params: {
      gpoMemberId,
      projectId,
      memberId,
    },
  });

// 企业配送仓储表
const storage = (gpoMemberId, projectId, memberId) =>
  api.get(path.storage, {
    params: {
      gpoMemberId,
      projectId,
      memberId,
    },
  });

// 企业配送运输车辆表
const transport = (gpoMemberId, projectId, memberId) =>
  api.get(path.transport, {
    params: {
      gpoMemberId,
      projectId,
      memberId,
    },
  });

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  Object.assign(ret, {
    saveTrade: ret.submit, // 当赋给用户申请结案权限时,显示申请结案按钮
  });
  return ret;
};

export default {
  authbtn,
  path,
  list,
  all,
  salerMemberList,
  diliverMember,
  item,
  deliverList,
  coverage,
  specific,
  drugsNumber,
  submit,
  deletes,
  enterprise,
  storage,
  transport,
  subAll,
};
