/**
 * Created by wuqian on 2017/10/25.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import api from '../index';

const path = {
  list: '/announcemet/list',
  item: '/announcemet/item',
  update: '/announcemet/update',
  create: '/announcemet/create',
  destory: '/announcemet/delete',
  audit: '/announcemet/audit',
  homeList: '/announcemet/home/list',
};

// list,列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      announcementTitle: filterForm.announcementTitle, // 公告标题
      enabled: filterForm.enabled, // 启用状态，默认0禁用(0禁用，1启用)
      announcementDate: filterForm.announcementDate, // 展示期间
      page,
      size,
      orderName: null,
      orderSort: 'desc',
    },
  });

// 首页展示公告
const homeList = () => api.get(path.homeList);

// item,详情
const item = (id) =>
  api.get(path.item, {
    params: {
      id,
    },
  });

// 新增
const create = (announcementDate, announcementText, announcementTitle) =>
  api.post(path.create, {
    announcementDate,
    announcementText,
    announcementTitle, // 排序码
    id: 0,
  });

// 更新
const update = (id, announcementDate, announcementText, announcementTitle) =>
  api.post(path.update, {
    id,
    announcementDate,
    announcementText,
    announcementTitle, // 排序码
  });

// 删除
const destory = (ids) =>
  api.post(path.destory, {
    ids,
  });

const audit = (id, status) =>
  api.post(path.audit, {
    id,
    status,
  });

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  return ret;
};

export default {
  list,
  homeList,
  authbtn,
  item,
  create,
  update,
  destory,
  audit,
};
