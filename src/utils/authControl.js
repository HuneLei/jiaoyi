/**
 * 根据当前用户与模块，判断用户是否拥有权限按钮
 * <p>
 * list           列表
 * create         新增
 * update         编辑
 * destory        删除
 * recover        恢复
 * remove         清除
 * submit         提交
 * audit          初审/审核
 * approve        复审
 * auditno        审核不通过
 * log            日志
 * upload         导入
 * uploadlog      导入详情
 * output         导出
 */

import store from '../vuex/store';

let authsion = [];

const authapi = () => {
  const authList = store.state.view.authList;
  let authString = authList.toString();
  authString = authString.replace(/,\/?/g, ',/');
  const authArr = authString.split(',');
  if (authList.length === 0) {
    return [];
  }
  return authArr;
};

const userAuth = (addapi) => {
  if (authsion.length === 0) {
    authsion = authapi();
  }
  const keys = Object.keys(addapi);
  const data = {};
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (authsion.indexOf(addapi[key]) > -1) {
      data[key] = true;
    } else {
      data[key] = false;
    }
  }
  return data;
};

export default {
  userAuth,
};
