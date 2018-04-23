/**
 * 药品管理
 * 药品卫监码对照
 */
import api from '../index';
import config from '../../config';

const path = {
  list: '/drugsSuperviseCode/list',
  item: '/drugsSuperviseCode/item',
  update: '/drugsSuperviseCode/superviseCode/update',
  upload: '/drugsSuperviseCode/import',
  output: '/drugsSuperviseCode/export',
};

// 数据列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空
      projectId: filterForm.projectId, // 集采项目id，可空，下拉
      drugsCode: filterForm.drugsCode,
      drugsName: filterForm.drugsName,
      formName: filterForm.formName,
      specificationName: filterForm.specificationName,
      producerName: filterForm.producerName,
      tradeName: filterForm.tradeName,
      approvalNumber: filterForm.approvalNumber,
      superviseCode: filterForm.superviseCode,
      enrollName: filterForm.enrollName,
      page,
      size,
      orderName: 'drugsCode',
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

// 更新

// 更新
const update = (id, superviseCode) =>
  api.post(
    path.update,
    {},
    {
      params: {
        id,
        superviseCode,
      },
    },
  );

//  文件导入
const upload = (formData, progress, projectId) =>
  api.post(path.upload, formData, {
    onUploadProgress(e) {
      progress(e);
    },
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
  item,
  update,
  upload,
  output,
};
