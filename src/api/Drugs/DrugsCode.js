/**
 * 药品管理
 * 药品编码对照
 */
import api from '../index';
import config from '../../config';

const path = {
  list: '/drugsCode/list',
  item: '/drugsCode/item',
  update: '/drugsCode/hospitalInnerCode/update',
  upload: '/drugsCode/import',
  output: '/drugsCode/export',
};

// 数据列表
const list = (page, size, filterForm) =>
  api.get(path.list, {
    params: {
      gpoMemberId: filterForm.gpoMemberId, // gpo会员id，全局，不可空
      projectId: filterForm.projectId, // 集采项目id，可空，下拉
      drugsCode: filterForm.drugsCode,
      drugsName: filterForm.drugsName,
      tradeName: filterForm.tradeName,
      formName: filterForm.formName,
      specificationName: filterForm.specificationName,
      producerName: filterForm.producerName,
      approvalNumber: filterForm.approvalNumber,
      hospitalInnerCode: filterForm.hospitalInnerCode,
      hospitalName: filterForm.hospitalName,
      enrollName: filterForm.enrollName,
      superviseCode: filterForm.superviseCode,
      page,
      size,
      orderName: 'hospitalCode,drugsCode',
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
const update = (id, hospitalInnerCode) =>
  api.post(
    path.update,
    {},
    {
      params: {
        id,
        hospitalInnerCode,
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
