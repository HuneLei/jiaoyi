/**
 * 医疗机构报量管理
 * 报量期间设置
 */
import api from '../index';

const path = {
  list: '/reportnum/time/list',
  item: '/reportnum/time/item',
  create: '/reportnum/time/create',
  update: '/reportnum/time/update',
  destory: '/reportnum/time/delete',
  all: '/common/project/sub/list/all',
  updateStatus: '/reportnum/batch/enable', // 报量期间启用禁用
};

// 数据列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      timeName: filterForm.timeName,
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空
      projectId: filterForm.projectId, // 集采项目id，可空，下拉
      projectSubId: filterForm.projectSubId, // 集采子项目id
      page,
      size,
      orderName: null,
      orderSort: 'asc',
    },
  });

// 数据详情
const item = (id) =>
  api.get(path.item, {
    params: {
      id,
    },
  });

// 新增
const create = (
  gpoMemberId,
  projectId,
  projectSubId,
  timeName,
  reportnumBtime,
  reportnumEtime,
  reportnumValidBtime,
  reportnumValidEtime,
) =>
  api.post(path.create, {
    gpoMemberId,
    projectId,
    projectSubId: projectSubId ? projectSubId.toString() : null,
    timeName,
    reportnumBtime,
    reportnumEtime,
    reportnumValidBtime,
    reportnumValidEtime,
  });

// 更新
const update = (
  id,
  gpoMemberId,
  projectId,
  projectSubId,
  timeName,
  reportnumBtime,
  reportnumEtime,
  reportnumValidBtime,
  reportnumValidEtime,
) =>
  api.post(
    path.update,
    {
      gpoMemberId,
      projectId,
      projectSubId: projectSubId ? projectSubId.toString() : null,
      timeName,
      reportnumBtime, // 报量开启时间段-开始，不可为空
      reportnumEtime, // 报量开启时间段-结束，不可为空
      reportnumValidBtime, // 报量有效期-开始，不可为空
      reportnumValidEtime, // 报量有效期-结束，不可为空
    },
    {
      params: {
        id,
      },
    },
  );

// 集采子项目表-下拉
const all = (gpoMemberId, projectId) =>
  api.get(path.all, {
    params: {
      gpoMemberId,
      projectId,
    },
  });

// 删除
const destory = (ids) =>
  api.post(path.destory, {
    ids,
  });

// 报量期间设置启用禁用
const updateStatus = (id, type) =>
  api.post(
    path.updateStatus,
    {},
    {
      params: {
        id,
        type,
      },
    },
  );

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  return ret;
};

export default {
  path,
  authbtn,
  list,
  item,
  create,
  update,
  all,
  destory,
  updateStatus,
};
