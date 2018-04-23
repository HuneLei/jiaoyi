// 配置文件
//  (地址配置均以/结尾，后续无需再加)

// 开发环境 (dev)
let apiHost = `${location.protocol}//${location.host}/api/`;
let uploadHost = '/api/upload/';
let authServer = '';
let authHost = '' || `${location.protocol}//${location.host}/`;
let upAuthHost = '/api/authorization/'; // 合同时效验证

const setConfig = (base) => {
  apiHost = `${location.protocol}//${location.host}/api/`;
  uploadHost = `${location.protocol}//${location.host}/api/upload/`;
  authServer = base.SSO_SERVER;
  authHost = base.SSO_SERVER || `${location.protocol}//${location.host}/`;
  upAuthHost = `${location.protocol}//${location.host}/api/authorization/`;
  // upAuthHost = 'http://172.27.3.151:8080/aliyun/authorization/`';

  // 开发线上环境 (develop)
  if (process.env.NODE_ENV && process.env.NODE_ENV === 'develop') {
    apiHost = 'http://trade.develop.api.wei3dian.com/';
    uploadHost = base.UPLOAD_SERVER ? `${base.UPLOAD_SERVER}/aliyun/upload/` : '/aliyun/upload/';
    upAuthHost = base.UPLOAD_SERVER
      ? `${base.UPLOAD_SERVER}/aliyun/authorization`
      : 'aliyun/authorization';
  }

  // 测试环境 （test / preview）
  if (process.env.NODE_ENV && process.env.NODE_ENV === 'preview') {
    apiHost = 'http://trade.test.api_test.wei3dian.com/';
    uploadHost = base.UPLOAD_SERVER ? `${base.UPLOAD_SERVER}/aliyun/upload/` : '/aliyun/upload/';
    upAuthHost = base.UPLOAD_SERVER
      ? `${base.UPLOAD_SERVER}/aliyun/authorization`
      : 'aliyun/authorization';
  }

  // 生产环境 （master）
  if (process.env.NODE_ENV && process.env.NODE_ENV === 'master') {
    apiHost = 'https://trade_api.qywgpo.com/';
    uploadHost = base.UPLOAD_SERVER ? `${base.UPLOAD_SERVER}/aliyun/upload/` : '/aliyun/upload/';
    upAuthHost = base.UPLOAD_SERVER
      ? `${base.UPLOAD_SERVER}/aliyun/authorization`
      : 'aliyun/authorization';
  }
};

const baseConfig = 'baseConfig';

let config = window.sessionStorage.getItem(baseConfig);

if (config) {
  config = JSON.parse(config);
} else {
  config = {};
}

setConfig(config);

const getAuthServer = () => {
  const sessionConfig = window.sessionStorage.getItem(baseConfig);
  setConfig(JSON.parse(sessionConfig));
  return authServer;
};

const getUploadHost = () => {
  const sessionConfig = window.sessionStorage.getItem(baseConfig);
  setConfig(JSON.parse(sessionConfig));
  return uploadHost;
};

const tokenName = 'trade_token';

//  设置 当前用户的access_token
const setToken = (token) => {
  sessionStorage.setItem(tokenName, token);
};

//  获取 当前用户的access_token
const getToken = () => sessionStorage.getItem(tokenName);

//  删除 当前用户的access_token
const removeToken = () => {
  sessionStorage.removeItem(tokenName);
};

//  设置 当前用户的  准备跳转hash
const setHash = (hash) => {
  sessionStorage.setItem('hash', hash);
};

//  获取 当前用户的  准备跳转hash
const getHash = () => sessionStorage.getItem('hash');

//  删除 当前用户的  准备跳转hash
const removeHash = () => {
  sessionStorage.removeItem('hash');
};

// 验证服务器
const upAuthServer = () => {
  const sessionConfig = window.sessionStorage.getItem(baseConfig);
  setConfig(JSON.parse(sessionConfig));
  return upAuthHost;
};

// console.log(process.env.NODE_ENV);

export default {
  apiHost,
  tokenName,
  refreshToken: 'refresh_token',
  client_id: config.client_id || '',
  authorization: config.Authorization || '',
  uploadHost,
  resource_id: config.resource_id || null,
  baseConfig,
  getAuthServer, // 登录服务器
  getUploadHost, // 上传服务器
  setToken, //  设置 当前用户的access_token
  getToken, //  获取 当前用户的access_token
  removeToken, //  删除 当前用户的access_token
  setHash,
  getHash,
  removeHash,
  upAuthServer, // 验证服务器
  erpApi: 'http://192.168.5.34:8088/', //  erp相关报表接口
  erpIoCode: 'Drg!0jV#mHf+3!lXE-0*77$C_bQaUN',
};
