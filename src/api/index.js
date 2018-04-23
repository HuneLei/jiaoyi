/**
 * Created by dingyiming on 2017/6/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import axios from 'axios';
let CitySN;

try {
  CitySN = returnCitySN;
} catch (error) {
  CitySN = {
    cip: '116.24.66.211',
    cid: '440300',
    cname: '广东省深圳市',
  };
}

import { Message } from 'element-ui';
import config from '../config';
import auth from './auth';

const instance = axios.create({
  baseURL: config.apiHost,
  withCredentials: true,
  params: {
    access_token: config.getToken(),
    ip: CitySN ? CitySN.cip : undefined,
  },
});

instance.interceptors.request.use((request) => {
  const axiosRequest = {
    ...request,
    params: {
      ...request.params,
      access_token: config.getToken(),
      ip: CitySN ? CitySN.cip : undefined,
    },
  };
  return axiosRequest;
});

instance.interceptors.response.use(
  (response) => {
    const localHref = sessionStorage.getItem('localHref');
    const code = response.data.code;
    if (code !== 0 && code !== 20000 && code !== 401 && code !== 1001) {
      Message({
        showClose: true,
        type: 'error',
        message: response.data.message,
      });
    }
    if (response.data.code === 401) {
      Message({
        showClose: true,
        type: 'error',
        message: '登录信息已失效，请重新登录',
        onClose() {
          auth.logout().then((res) => {
            config.removeToken();
            location.href = localHref;
          });
        },
      });
    }
    if (response.data.code === 403) {
      sessionStorage.setItem('name403', '接口');
      window.location.hash = '#/403';
    }
    if (response.data.code === 20000) {
      Message({
        showClose: true,
        type: 'error',
        duration: 1000,
        message: response.data.message,
      });
    }
    return response;
  },
  (error) => {
    Message({
      showClose: true,
      type: 'error',
      message: error.message,
    });
    return Promise.reject(error);
  },
);
export default instance;
