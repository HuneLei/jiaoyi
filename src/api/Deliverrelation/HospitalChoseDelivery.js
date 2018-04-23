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
import config from '../../config';

const path = {
  list: '/buyerchosedelivery/confirm/drugs/list', // 配送企业已确定列表
  all: '/common/project/list/all', // 获取集采项目下拉
  update: '/buyerchosedelivery/hospital/list', //  医疗机构选配送商-药品列表
  add: '/buyerchosedelivery/member/add', // 新增-可采药品目录（医院选配送）
  output: '/buyerchosedelivery/export', //  导出
  enterprise: '/buyerchosedelivery/enterprise/list', // 详情-企业配送区域省市县信息
  storage: '/buyerchosedelivery/storage/list', // 详情-企业配送仓储表
  transport: '/buyerchosedelivery/transport/list', // 详情-企业配送运输车辆表
  empty: '/buyerchosedelivery/deliveryaffirm/empty', // 清空
  subAll: '/common/project/sub/list/all',
};

const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      page,
      size,
      projectId: filterForm.projectId,
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空 ,暂时写死
      drugsCode: filterForm.drugsCode,
      drugsName: filterForm.drugsName,
      specName: filterForm.specName,
      tradeName: filterForm.tradeName,
      formName: filterForm.formName,
      approvalNumber: filterForm.approvalNumber,
      enrollName: filterForm.enrollName,
      producerName: filterForm.producerName,
      nameType: filterForm.nameType,
      deliveryMemberName: filterForm.deliveryMemberName,
      hospitalMemberName: filterForm.hospitalMemberName,
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

//  医疗机构确定配送商-药品列表
const update = (page, size, filterForm) =>
  api.get(path.update, {
    params: {
      page,
      size,
      projectId: filterForm.projectId,
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空
      drugsId: filterForm.drugsId,
      salerMemberId: filterForm.salerMemberId,
      hospitalMemberId: filterForm.hospitalMemberId,
      deliveryMemberName: filterForm.deliveryMemberName,
      deliveryMemberCode: filterForm.deliveryMemberCode,
      orderName: 'id',
      orderSort: 'asc',
    },
  });

// 新增-可采药品目录（医院选配送）
const add = (obj) =>
  api.post(path.add, {
    deliveryMemberCode: obj.deliveryMemberCode,
    deliveryMemberId: obj.deliveryMemberId,
    deliveryMemberName: obj.deliveryMemberName,
    drugsId: obj.drugsId,
    gpoMemberId: obj.gpoMemberId,
    hospitalMemberCode: obj.hospitalMemberCode,
    hospitalMemberId: obj.hospitalMemberId,
    hospitalMemberName: obj.hospitalMemberName,
    nametype: obj.nametype,
    projectId: obj.projectId,
    salerMemberCode: obj.salerMemberCode,
    salerMemberId: obj.salerMemberId,
    salerMemberName: obj.salerMemberName,
    hospitalMemberPrice: obj.hospitalUnitPrice,
  });

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

// 清空
const empty = (id, projectId, gpoMemberId, hospitalMemberId, deliveryMemberId, drugsId) =>
  api.post(
    path.empty,
    {},
    {
      params: {
        id, // 合同ID
        projectId,
        gpoMemberId,
        hospitalMemberId,
        deliveryMemberId,
        drugsId,
      },
    },
  );

// 文件导出
const output = (form) => {
  const token = config.getToken();
  let url = `${config.apiHost}${path.output}?`;
  url += `access_token=${token}`;
  const keys = Object.keys(form);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    url += `&${key}=${form[key]}`;
  }
  return encodeURI(url);
};

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  return ret;
};

export default {
  authbtn,
  path,
  list,
  all,
  update,
  add,
  output,
  enterprise,
  storage,
  transport,
  empty,
  subAll,
};
