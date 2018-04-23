/**
 * Created by dingyiming on 2017/6/20.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import api from 'axios';
import config from '../config';

const path = {
  getToken: '/oauth/token',
  revoke: '/revoke', //  肯定回200
  logout: '/oauth/logout', //  可能回403
  functions: '/privilege/functions', //  模块列表
  principal: '/privilege/principal', //  权限列表
  resources: '/privilege/resources', //  平台列表
  messageList: '/message/list', // auth 消息列表
  memberPassword: '/register/member/password', // 修改密码
};

// 获取token
const getToken = (code) =>
  api.post(
    `${config.getAuthServer()}${path.getToken}`,
    {},
    {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${location.protocol}//${location.host}`,
      },
      headers: {
        Authorization: config.authorization,
      },
    },
  );

// 获取  refresh_token
const getRefreshToken = () =>
  api.post(
    `${config.getAuthServer()}${path.getToken}`,
    {},
    {
      params: {
        grant_type: 'refresh_token',
        refresh_token: sessionStorage.getItem(config.refreshToken),
        client_id: config.client_id,
      },
      headers: {
        Authorization: config.authorization,
      },
    },
  );

//  退出当前系统用户
const revoke = () =>
  api.post(
    `${config.getAuthServer()}${path.revoke}`,
    {},
    {
      withCredentials: true,
      params: {
        access_token: config.getToken(),
      },
    },
  );

//  退出所有系统用户
const logout = () =>
  api.post(
    `${config.getAuthServer()}${path.logout}`,
    {},
    {
      withCredentials: true,
      params: {
        access_token: config.getToken(),
      },
    },
  );

//  获取用户左侧菜单模块
const functions = () =>
  api.post(
    `${config.getAuthServer()}${path.functions}`,
    {},
    {
      params: {
        access_token: config.getToken(),
      },
    },
  );

//  获取用户的所有权限
const principal = () =>
  api.get(`${config.getAuthServer()}${path.principal}`, {
    params: {
      access_token: config.getToken(),
    },
  });

//  获取用户能登录的平台
const resources = () =>
  api.post(
    `${config.getAuthServer()}${path.resources}`,
    {},
    {
      params: {
        access_token: config.getToken(),
      },
    },
  );

// 消息列表
const messageList = (page, size) =>
  api.get(`${config.getAuthServer()}${path.messageList}`, {
    params: {
      access_token: config.getToken(),
      page,
      size,
      status: 0,
    },
  });

// 修改密码
const memberPassword = (form) =>
  api.post(
    `${config.getAuthServer()}${path.memberPassword}`,
    {
      id: form.id,
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
    },
    {
      params: {
        access_token: config.getToken(),
      },
    },
  );

export default {
  path,
  getToken,
  getRefreshToken,
  revoke,
  logout,
  functions,
  principal,
  resources,
  messageList,
  memberPassword,
};
