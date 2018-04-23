/**
 * Created by lqy on 2017/9/4.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import api from '../index';
import config from '../../config';

const path = {
  list: '/address/list', // 地址列表
  memberList: '/address/member/list', // 生产与经营
  item: '/address/item', // 地址详情
  create: '/address/create', // 新增地址
  update: '/address/update', // 修改地址
  destory: '/address/delete', // 删除地址
  member: '/address/members', // 会员
  memberid: '/address/memberid', // 省市县信息
};

// 列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      page,
      size,
      memberName: filterForm.memberName, // 会员名称
      memberId: filterForm.memberId, // 会员id  int
      provinceId: filterForm.provinceId, // 省  s
      cityId: filterForm.cityId, // 市  s
      countyId: filterForm.countyId, // 市  s
      addressType: filterForm.addressType, // 地址类型
      orderName: null,
      orderSort: 'desc',
    },
  });

// 列表   // 生产与经营
const memberList = (page, size, filterForm) =>
  api.get(path.memberList, {
    params: {
      page,
      size,
      memberId: filterForm.memberId, // 会员id  int
      orderName: null,
      orderSort: 'desc',
    },
  });

// 详情
const item = (id) =>
  api.get(path.item, {
    params: {
      id,
    },
  });

// 创建
const create = (obj) =>
  api.post(path.create, {
    memberId: obj.memberId,
    addressName: obj.addressName,
    provinceId: obj.provinceId,
    cityId: obj.cityId,
    countyId: obj.countyId,
    zipCode: obj.zipCode,
    addressFull: obj.addressFull,
    contacter: obj.contacter,
    contacterPhone: obj.contacterPhone,
    outAddressCode: obj.outAddressCode,
  });

// 编辑更新
const update = (obj) =>
  api.post(
    path.update,
    {
      addressName: obj.addressName,
      memberId: obj.memberId,
      provinceId: obj.provinceId,
      provinceName: obj.provinceName,
      cityId: obj.cityId,
      cityName: obj.cityName,
      countyId: obj.countyId,
      countyName: obj.countyName,
      addressFull: obj.addressFull,
      contacter: obj.contacter,
      contacterPhone: obj.contacterPhone,
      zipCode: obj.zipCode,
      outAddressCode: obj.outAddressCode,
    },
    {
      params: {
        id: obj.id,
      },
    },
  );

// 删除
const destory = (ids) =>
  api.post(path.destory, {
    ids,
  });

// 详情
const member = () => api.get(path.member, {});

// 省市县信息
const memberid = (id) =>
  api.get(path.memberid, {
    params: {
      id,
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
  memberList,
  item,
  create,
  update,
  destory,
  member,
  memberid,
};
