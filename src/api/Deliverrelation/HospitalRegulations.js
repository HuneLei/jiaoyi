/**
 * 药品配送关系管理
 * 医院品规报表
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
  list: '/hospitalqualityreport/list', // 医院品规报表
  numList: '/hospitalqualityreport/num/list', //  品规报表
  orderList: '/hospitalqualityreport/orders/amount', //  订单金额弹框
  contractList: '/hospitalqualityreport/contract/amount', //  合同金额弹框
  sendList: '/hospitalqualityreport/count/delivery/num', //  配送数量企业弹框
  output: '/hospitalqualityreport/export', //  导出
};

const list = (page, size, form) =>
  api.get(path.list, {
    params: {
      page,
      size,
      projectId: form.projectId,
      gpoMemberId: form.gpoMemberId, // gpo会员id，全局，不可空 ,暂时写死
      hospitalMemberName: form.hospitalMemberName,
      createDate: form.createDate,
      hospitalCatalog:
        form.hospitalCatalog && form.hospitalCatalog.length > 0
          ? form.hospitalCatalog.toString()
          : undefined,
      levels: form.levels && form.levels.length > 0 ? form.levels.toString() : undefined,
      orderName: 'id',
      orderSort: 'asc',
    },
  });

const numList = (page, size, form) =>
  api.get(path.numList, {
    params: {
      page,
      size,
      projectId: form.projectId,
      gpoMemberId: form.gpoMemberId, // gpo会员id，全局，不可空 ,暂时写死
      hospitalMemberId: form.hospitalMemberId,
      type: form.type,
      drugsCode: form.drugsCode,
      drugsName: form.drugsName,
      producerName: form.producerName,
      enrollName: form.enrollName,
      createDate: form.createDate,
      orderName: 'id',
      orderSort: 'asc',
    },
  });

const orderList = (page, size, form) =>
  api.get(path.orderList, {
    params: {
      page,
      size,
      projectId: form.projectId,
      gpoMemberId: form.gpoMemberId, // gpo会员id，全局，不可空 ,暂时写死
      hospitalMemberId: form.hospitalMemberId,
      drugsCode: form.drugsCode, // 药品编码
      drugsName: form.drugsName,
      deliveryMemberName: form.deliveryMemberName,
      createDate: form.createDate,
      orderName: 'id',
      orderSort: 'asc',
    },
  });

const contractList = (page, size, form) =>
  api.get(path.contractList, {
    params: {
      page,
      size,
      projectId: form.projectId,
      gpoMemberId: form.gpoMemberId, // gpo会员id，全局，不可空 ,暂时写死
      hospitalMemberId: form.hospitalMemberId,
      drugsCode: form.drugsCode, // 药品编码
      drugsName: form.drugsName,
      deliveryMemberName: form.deliveryMemberName,
      createDate: form.createDate,
      orderName: 'id',
      orderSort: 'asc',
    },
  });

const sendList = (page, size, form) =>
  api.get(path.sendList, {
    params: {
      page,
      size,
      projectId: form.projectId,
      gpoMemberId: form.gpoMemberId, // gpo会员id，全局，不可空 ,暂时写死
      hospitalMemberId: form.hospitalMemberId,
      deliveryMemberName: form.deliveryMemberName,
      deliveryMemberCode: form.deliveryMemberCode,
      createDate: form.createDate,
      orderName: 'id',
      orderSort: 'asc',
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

export default {
  authbtn,
  path,
  list,
  numList,
  orderList,
  contractList,
  sendList,
  output,
};
