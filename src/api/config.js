import api from 'axios';
import baseConfig from '../config';

const path = {
  config: `${baseConfig.apiHost}/config`,
};
// console.log('zzzzzzzzzzzzz', `${baseConfig.apiHost}/config`);
// console.log('zzzzzzzzzzzzz', baseConfig);
// 获取所有的接口地址
const config = () => api.get(path.config);

export default {
  config,
};
