/**
 * 调查报告
 * 不良反应监测检查表
 */
import api from '../index';
import config from '../../config';

const path = {
  list: '/untoward/effect/report/list',
  saveTrade: '/untoward/effect/report/save',
  destoryTrade: '/untoward/effect/report/delete',
  item: '/untoward/effect/report/info',
  hospitallist: '/common/hospital/list/all/like',
};

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

// 数据列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空
      memberId: filterForm.memberId,
      hospitalMemberName: filterForm.hospitalMemberName,
      fillTime: filterForm.fillTime,
      drugsName: filterForm.drugsName,
      producerName: filterForm.producerName,
      page,
      size,
    },
  });

// 医疗
const hospitallist = (memberName) =>
  api.get(path.hospitallist, {
    params: {
      memberName,
    },
  });

// 详情
const item = (id) =>
  api.get(path.item, {
    params: {
      id,
    },
  });

const saveTrade = (obj) => api.post(path.saveTrade, obj);

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  Object.assign(ret, {
    create: ret.saveTrade,
  });
  return ret;
};

export default {
  path,
  list,
  destoryTrade,
  saveTrade,
  authbtn,
  item,
  hospitallist,
};
