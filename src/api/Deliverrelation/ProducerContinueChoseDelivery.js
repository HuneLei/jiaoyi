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
  list: '/changesallerchosedelivery/list', // 详情-补充选配送列表
  all: '/changesallerchosedelivery/project/list', // 获取集采项目下拉
  item: '/changesallerchosedelivery/item', // 详情-补充选配送明细
  header: '/changesallerchosedelivery/header/list', // 详情-补充选配送表头
  upperDrugs: '/changesallerchosedelivery/upper/drugs/list', //  详情-补充已上架药品列表
  distribu: '/changesallerchosedelivery/distribu/list', // 详情-补充卖方会员选配送企业列表
  deliveList: '/changesallerchosedelivery/delive/item/list', //  详情-补充已选配送商列表
  create: '/changesallerchosedelivery/preservation', //  新增保存
  submit: '/changesallerchosedelivery/submit', //  新增提交
  audit: '/changesallerchosedelivery/audit', //  审核
  destoryTrade: '/changesallerchosedelivery/delete', //  删除
};

const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      page,
      size,
      projectName: filterForm.projectName,
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空 ,暂时写死
      salerMemberName: filterForm.salerMemberName,
      salerMemberId: filterForm.salerMemberId,
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
      deliveryMemberName: filterForm.deliveryMemberName,
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
      memberNo: filterForm.memberNo,
      memberName: filterForm.memberName,
      provinceId: filterForm.provinceId,
      cityId: filterForm.cityId,
      countyId: filterForm.countyId,
      memberarrs: filterForm.memberarrs,
      id: filterForm.id,
      orderName: 'id',
      orderSort: 'asc',
    },
  });

const deliveList = (page, size, filterForm) =>
  api.get(path.deliveList, {
    params: {
      page,
      size,
      projectId: filterForm.projectId,
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空 ,暂时写死
      drugsId: filterForm.drugsId,
      salerMemberId: filterForm.salerMemberId,
      delivearrid: filterForm.delivearrid,
      id: filterForm.id,
      itemId: filterForm.itemId,
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
  deliveList,
  create,
  submit,
  audit,
  destoryTrade,
};
