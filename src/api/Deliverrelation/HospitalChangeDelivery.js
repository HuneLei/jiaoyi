/**
 * 药品配送关系管理
 * 卖方补充配送商
 */

/**
 * Created by tuxiaoan on 2017/12/21.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import api from '../index';
import config from '../../config';

const path = {
  list: '/changebuyerchosedelivery/list', // 详情-补充选配送列表
  all: '/changesallerchosedelivery/project/list', // 获取集采项目下拉
  item: '/changebuyerchosedelivery/item', // 详情-补充选配送明细
  header: '/changebuyerchosedelivery/header/list', // 详情-补充选配送表头
  upperDrugs: '/changebuyerchosedelivery/confirm/drugs/list', //  详情-补充已上架药品列表
  distribu: '/changebuyerchosedelivery/hospital/list', // 详情-补充卖方会员选配送企业列表
  create: '/changebuyerchosedelivery/preservation', //  新增保存、提交
  submit: '/changebuyerchosedelivery/submit', //  新增提交
  audit: '/changebuyerchosedelivery/audit', //  审核
  destoryTrade: '/changebuyerchosedelivery/delete', // 删除
};

const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      page,
      size,
      projectId: filterForm.projectId,
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空 ,暂时写死
      hospitalMemberName: filterForm.hospitalMemberName,
      hospitalMemberId: filterForm.hospitalMemberId,
      applicationNo: filterForm.applicationNo,
      createTime: filterForm.createTime,
      salerStatic: filterForm.salerStatic,
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

// 获取所有集采项目下拉
const item = (id) =>
  api.get(path.item, {
    params: {
      id,
    },
  });

const header = (ids) =>
  api.get(path.header, {
    params: {
      ids,
    },
  });

// 删除
const destoryTrade = (id) =>
  api.post(
    path.destoryTrade,
    {},
    {
      params: {
        id,
      },
    },
  );

const upperDrugs = (page, size, filterForm) =>
  api.get(path.upperDrugs, {
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
      nametype: filterForm.nametype,
      hospitalMemberName: filterForm.hospitalMemberName,
      hospitalMemberId: filterForm.hospitalMemberId,
      enrollId: filterForm.enrollId,
      drugsarrs: filterForm.drugsarrs,
      orderName: 'id',
      orderSort: 'asc',
    },
  });

const distribu = (page, size, filterForm) =>
  api.get(path.distribu, {
    params: {
      page,
      size,
      projectId: filterForm.projectId,
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空 ,暂时写死
      drugsId: filterForm.drugsId,
      salerMemberId: filterForm.salerMemberId,
      hospitalMemberId: filterForm.hospitalMemberId,
      deliveryMemberCode: filterForm.deliveryMemberCode,
      deliveryMemberName: filterForm.deliveryMemberName,
      provinceId: filterForm.provinceId,
      cityId: filterForm.cityId,
      countyId: filterForm.countyId,
      orderName: 'id',
      orderSort: 'asc',
    },
  });

// 保存
const create = (obj) => api.post(path.create, obj);

// 提交
const submit = (obj) => api.post(path.submit, obj);

// 审核
const audit = (obj) => api.post(path.audit, obj);

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  Object.assign(ret, {
    saveTrade: ret.create,
    submitTrade: ret.submit,
  });
  return ret;
};

export default {
  authbtn,
  path,
  list,
  all,
  item,
  header,
  upperDrugs,
  distribu,
  create,
  submit,
  audit,
  destoryTrade,
};
