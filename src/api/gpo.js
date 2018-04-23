/**
 * Created by lqy on 2017/9/5.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import api from './index';

const path = {
  listAll: '/common/gpo/member/list/all',
  ProjectCommonAll: '/common/project/list/all', // 下拉-获取所有集采项目
  ProjectCommon: '/common/project/list/all/create', // 新增-下拉-过滤关闭的集采项目
  information: '/common/current/user/item',
  ProjectSubCommonAll: '/common/project/sub/list/all', // 集采子项目表-下拉
  SalerCommonAll: '/common/saler/list/all', // 卖方会员-下拉
  seal: '/common/seal', // 签章
  sealImage: '/common/seal/image', // 获取签章
  qualityCommonAll: '/common/quality/level/all', // 质量层次下拉
  memberCommonAll: '/common/member/list/all', // 会员接口下拉
};

const listAll = () => api.get(path.listAll);
const information = () => api.get(path.information);

const ProjectCommonAll = (gpoMemberId) =>
  api.get(path.ProjectCommonAll, {
    params: {
      gpoMemberId,
    },
  });

const ProjectCommon = (gpoMemberId) =>
  api.get(path.ProjectCommon, {
    params: {
      gpoMemberId,
    },
  });

const ProjectSubCommonAll = (gpoMemberId, projectId) =>
  api.get(path.ProjectSubCommonAll, {
    params: {
      gpoMemberId,
      projectId,
    },
  });

const SalerCommonAll = (projectId) =>
  api.get(path.SalerCommonAll, {
    params: {
      projectId,
    },
  });

const seal = (x, y, url, urls) =>
  api.get(path.seal, {
    params: {
      x,
      y,
      url,
      urls,
    },
  });

const sealImage = (code) =>
  api.get(path.sealImage, {
    params: {
      code,
    },
  });

const qualityCommonAll = (projectId) =>
  api.get(path.qualityCommonAll, {
    params: {
      projectId,
    },
  });

// 数据列表
const memberCommonAll = (page, size, filterForm) =>
  api.get(path.memberCommonAll, {
    params: {
      memberName: filterForm.memberName.value,
      memberNo: filterForm.memberNo.value,
      page,
      size,
    },
  });

export default {
  listAll,
  information,
  ProjectCommonAll,
  ProjectCommon,
  ProjectSubCommonAll,
  SalerCommonAll,
  seal,
  sealImage,
  qualityCommonAll,
  memberCommonAll,
};
