/**
 * 公共附件上传地址
 */
import axios from 'axios';
import config from '../config';

const upload = (formData, progress, fileProgress, index, errorFun) =>
  axios
    .post(config.getUploadHost(), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params: {
        access_token: config.getToken(),
      },
      onUploadProgress(e) {
        if (progress) {
          progress(e, fileProgress, index);
        }
      },
      withCredentials: true,
    })
    .catch(() => {
      errorFun(index, '请上传2M以内的文件');
    });

//  图片地址的有效验证
const authorization = (url) =>
  axios.post(
    config.upAuthServer(),
    {},
    {
      params: {
        access_token: config.getToken(),
        url,
      },
      withCredentials: true,
    },
  );

export default {
  upload,
  authorization,
};
