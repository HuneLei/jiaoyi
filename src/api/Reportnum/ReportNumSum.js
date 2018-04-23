/**
 * 医疗机构报量管理
 * 报量汇总
 */
import api from '../index';
import config from '../../config';

const path = {
  list: '/reportnum/sum/list',
  reportnumGather: '/reportnum/sum/gather', // 报量汇总数量
  output: '/reportnum/sum/export',
  timeNameAll: '/reportnum/sum/list/all',
};

// 数据列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空
      timeId: filterForm.timeId,
      projectId: filterForm.projectId, // 集采项目id，可空，下拉
      projectSubId: filterForm.projectSubId, // 集采子项目id
      drugsCode: filterForm.drugsCode,
      drugsName: filterForm.drugsName,
      qualityLevel: filterForm.qualityLevel,
      producerName: filterForm.producerName,
      page,
      size,
      orderName: null,
      orderSort: 'asc',
    },
  });

const reportnumGather = (filterForm) =>
  api.get(path.reportnumGather, {
    params: {
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空
      projectId: filterForm.projectId, // 集采项目id，可空，下拉
      projectSubId: filterForm.projectSubId, // 集采子项目id
      drugsCode: filterForm.drugsCode,
      drugsName: filterForm.drugsName,
      qualityLevel: filterForm.qualityLevel,
      producerName: filterForm.producerName,
    },
  });

// 期间名称-下拉
const timeNameAll = (projectId) =>
  api.get(path.timeNameAll, {
    params: {
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

//  用户权限验证
const authbtn = () => {
  const ret = window.authControl.userAuth(path);
  return ret;
};

export default {
  path,
  authbtn,
  list,
  reportnumGather,
  timeNameAll,
  output,
};
