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
  list: '/drugsusable/list', // 可采药品列表目录
  all: '/common/project/list/all', // 获取集采项目下拉
  item: '/drugsusableprice/price/item', // 可采药品列表详情
  update: '/drugsusableprice/update/price', // 修改协议单价接口
  output: '/drugsusableprice/exports', //  导出
  upload: '/drugsusableprice/Input/export', // 导入
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
      salerMemberName: filterForm.salerMemberName,
      producerName: filterForm.producerName,
      enable: filterForm.enable,
      deliveryMemberName: filterForm.deliveryMemberName,
      hospitalMemberName: filterForm.hospitalMemberName,
      hospitalMemberCode: filterForm.hospitalMemberCode,
      classType: 1,
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

// 可采药品列表详情
const item = (id) =>
  api.get(path.item, {
    params: {
      id,
    },
  });

// 修改协议单价
const update = (gpoMemberId, projectId, drugsId, deliveryMemberId, protocolPrice) =>
  api.post(
    path.update,
    {},
    {
      params: {
        gpoMemberId,
        projectId,
        drugsId,
        deliveryMemberId,
        protocolPrice, // 协议单价
      },
    },
  );

//  文件导入
const upload = (formData, progress) =>
  api.post(path.upload, formData, {
    onUploadProgress(e) {
      progress(e);
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
  item,
  update,
  upload,
  output,
};
