/**
 * 入口文件
 */
import Vue from 'vue';
import VueBus from 'vue-bus';
import 'font-awesome/css/font-awesome.min.css';
import 'gpo-public/dist/css/iconfont.css'; //  图标字体
import 'gpo-public/dist/css/index.css'; //  公共组件公共样式

import './element';
import './../theme/index.css';
import './assets/css/reset.css';
import App from './App';
import router from './router';
import store from './vuex/store';
import auth from './api/auth';
import pathConfig from './api/config';
import config from './config';

Vue.use(VueBus);
Vue.config.productionTip = false;

//  进入Vue
const goVue = () => {
  try {
    var WshShell = new ActiveXObject('WScript.Shell');

    //添加可信站点或IP
    WshShell.RegWrite(
      'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Ranges\\Range100\\',
      '',
    );
    WshShell.RegWrite(
      'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Ranges\\Range100\\https',
      '2',
      'REG_DWORD',
    );
    WshShell.RegWrite(
      'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Ranges\\Range100\\:Range',
      '*.qywgpo.com',
    );

    //再添加一个
    // WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Ranges\\Range101\\", "");
    // WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Ranges\\Range101\\https", "2", "REG_DWORD");
    // WshShell.RegWrite("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\ZoneMap\\Ranges\\Range101\\:Range", "*.Mywuqian.com");

    //修改IE ActiveX安全设置: 1本地Intranet区域

    WshShell.RegWrite(
      'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\1\\1001',
      '0',
      'REG_DWORD',
    );

    WshShell.RegWrite(
      'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\1\\1004',
      '0',
      'REG_DWORD',
    );

    WshShell.RegWrite(
      'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\1\\1200',
      '0',
      'REG_DWORD',
    );

    WshShell.RegWrite(
      'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\1\\1201',
      '0',
      'REG_DWORD',
    );

    WshShell.RegWrite(
      'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\1\\1405',
      '0',
      'REG_DWORD',
    );

    WshShell.RegWrite(
      'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\1\\2201',
      '0',
      'REG_DWORD',
    );

    //修改IE ActiveX安全设置:2受信任的站点区域

    WshShell.RegWrite(
      'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\2\\1001',
      '0',
      'REG_DWORD',
    );

    WshShell.RegWrite(
      'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\2\\1004',
      '0',
      'REG_DWORD',
    );

    WshShell.RegWrite(
      'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\2\\1200',
      '0',
      'REG_DWORD',
    );

    WshShell.RegWrite(
      'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\2\\1201',
      '0',
      'REG_DWORD',
    );

    WshShell.RegWrite(
      'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\2\\1405',
      '0',
      'REG_DWORD',
    );

    WshShell.RegWrite(
      'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\2\\2201',
      '0',
      'REG_DWORD',
    );

    //修改IE ActiveX安全设置:3Internet区域

    WshShell.RegWrite(
      'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\1001',
      '0',
      'REG_DWORD',
    );

    WshShell.RegWrite(
      'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\1004',
      '0',
      'REG_DWORD',
    );

    WshShell.RegWrite(
      'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\1200',
      '0',
      'REG_DWORD',
    );

    WshShell.RegWrite(
      'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\1201',
      '0',
      'REG_DWORD',
    );

    WshShell.RegWrite(
      'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\1405',
      '0',
      'REG_DWORD',
    );

    WshShell.RegWrite(
      'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3\\2201',
      '0',
      'REG_DWORD',
    );

    //禁用Winxp弹出窗口阻止程序
    WshShell.RegWrite('HKCU\\Software\\Microsoft\\Internet Explorer\\New Windows\\PopupMgr', 'no');

    // alert("可信站点设置，ActiveX 控件安全设置，弹出窗口设置成功");
  } catch (error) {
    // console.log(error);
  }

  router.beforeEach((to, from, next) => {
    next();
  });

  router.afterEach((transition) => {});

  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
};

//  获取平台权限
const getResources = () => {
  auth.resources().then((res) => {
    if (res.data.code === 401) {
      config.removeToken();
      window.location.href = sessionStorage.getItem('localHref');
    } else if (res.data.code === 0) {
      let isAuth = false;
      const resourcesList = res.data.result;
      for (let j = 0; j < resourcesList.length; j += 1) {
        const item = resourcesList[j];
        if (item.id.toString() === config.resource_id) {
          isAuth = true;
          resourcesList[j].active = true;

          document.title = item.name;
          store.commit('setResourcesNow', resourcesList[j]);
          break;
        }
      }

      window.sessionStorage.setItem('resources', JSON.stringify(resourcesList));

      const token = config.getToken();
      if (isAuth) {
        goVue();
      } else {
        location.href = '/403/';
      }
    }
  });
};

//  登录
const goLogin = () => {
  // 授权服务器地址
  const base = JSON.parse(window.sessionStorage.getItem(config.baseConfig));

  Object.assign(config, {
    resource_id: base.resource_id,
    client_id: base.client_id,
    authorization: base.Authorization,
    authHost: base.SSO_SERVER,
    authServer: base.SSO_SERVER,
    uploadHost: config.uploadHost,
  });

  const authServer = config.getAuthServer();
  const token = config.getToken();
  const localHref = `${authServer}/oauth/authorize?client_id=${
    config.client_id
  }&response_type=code&redirect_uri=${location.protocol}//${location.host}`;
  window.sessionStorage.setItem('localHref', localHref);

  const hash = location.hash;

  const GetQueryString = (name) => {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
    const r = window.location.search.substr(1).match(reg);
    if (r !== null) return unescape(r[2]);
    return null;
  };
  const code = GetQueryString('code');
  const userId = GetQueryString('userId');

  if (!token) {
    if (!code) {
      window.location.href = localHref;
    } else {
      // 通过code 获取token
      auth
        .getToken(code)
        .then((res) => {
          if (res.data.code === 401) {
            window.location.href = localHref;
          } else if (res && res.data && res.data.access_token) {
            config.setToken(res.data.access_token);

            getResources();
          }
        })
        .catch((error) => {
          document.write(error);
        });
    }
  } else {
    getResources();
  }
};

//  先获取config配置
let base = window.sessionStorage.getItem(config.baseConfig);
if (!base || base === '{}') {
  pathConfig.config().then((res) => {
    const data = {};
    if (res.data.code === 0) {
      base = res.data.result;
      window.sessionStorage.setItem(config.baseConfig, JSON.stringify(base));
      goLogin();
    }
  });
} else {
  goLogin();
}
