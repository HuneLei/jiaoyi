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
  list: '/drugsusable/list', // 可采药品列表
  all: '/common/project/list/all', // 获取集采项目下拉
  update: '/drugsusable/status', // 可采药品列表启用禁用
  output: '/drugsusable/export', //  导出
  synchronousData: '/drugsusableprice/copy/list', //  同步交易中心
  subAll: '/common/project/sub/list/all',
  addressOutput: '/drugsusable/hospital/export',
};

const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      page,
      size,
      projectId: filterForm.projectId,
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空 ,
      drugsCode: filterForm.drugsCode,
      drugsName: filterForm.drugsName,
      specName: filterForm.specName,
      tradeName: filterForm.tradeName,
      formName: filterForm.formName,
      approvalNumber: filterForm.approvalNumber,
      enrollName: filterForm.enrollName,
      producerName: filterForm.producerName,
      enable: filterForm.enable,
      deliveryMemberName: filterForm.deliveryMemberName,
      hospitalMemberName: filterForm.hospitalMemberName,
      hospitalMemberCode: filterForm.hospitalMemberCode,
      salerMemberName: filterForm.salerMemberName,
      projectSubId: filterForm.projectSubId,
      orderName: 'id',
      orderSort: 'DESC',
    },
  });
// 获取所有集采项目下拉
const all = (gpoMemberId) =>
  api.get(path.all, {
    params: {
      gpoMemberId,
    },
  });

// 可采药品列表状态
const update = (id, enable) =>
  api.post(
    path.update,
    {},
    {
      params: {
        id,
        enable,
      },
    },
  );

// 集采子项目表-下拉
const subAll = (gpoMemberId, projectId) =>
  api.get(path.subAll, {
    params: {
      gpoMemberId,
      projectId,
    },
  });

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

// 文件导出
const addressOutput = (form) => {
  const token = config.getToken();
  let url = `${config.apiHost}${path.addressOutput}?`;
  url += `access_token=${token}`;
  const keys = Object.keys(form);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    url += `&${key}=${form[key]}`;
  }
  return encodeURI(url);
};

// 同步交易中心
const synchronousData = (resourceId) =>
  api.get(path.synchronousData, {
    params: {
      resourceId: 8,
    },
  });

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  return ret;
};

// 已选配送商查看
export default {
  path,
  authbtn,
  list,
  all,
  update,
  output,
  addressOutput,
  synchronousData,
  subAll,
};
