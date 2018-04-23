/**
 * Created by wuqian on 2017/10/25.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import api from '../index';

const path = {
  list: '/announcement/list/list',
  item: '/announcement/list/item',
  update: '/announcement/list/update',
};

// list,列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      announcementTitle: filterForm.announcementTitle, // 公告标题
      announcementDate: filterForm.announcementDate, // 展示期间
      page,
      size,
      orderName: null,
      orderSort: 'desc',
    },
  });
// item,详情
const item = (id) =>
  api.get(path.item, {
    params: {
      id,
    },
  });


// 修改
const update = (form) =>
api.post(
  path.update,
  {
    announcementAbstract: form.announcementAbstract,
    announcementDate: form.announcementDate,
    announcementFile: form.announcementFile,
    announcementText: form.announcementText,
    announcementTitle: form.announcementTitle,
    id: form.id,
  },
);

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  return ret;
};

export default {
  list,
  authbtn,
  item,
  update,
};
