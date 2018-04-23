<template>
  <div>

    <div v-if="isShowType === 2" :class="gpoId">

      <layout-nav :systemInfo="systemInfo" :menuList="menuList" :menuPath="menuPath" :topList="topList" :memberInfo="memberInfo" :messageAll="messageAll" :message="message" :dropdownList="dropdownList" :shopcartShow="shopcartShow" @auth-message-item="authMessageItem" @auth-message-link="authMessageLink" @go-system="goSystem" @dropdown-click="dropdownClick" @go-shopcart="goShopcart">

        <div slot="bread-crumb">
          <el-breadcrumb separator=">" class="layout-content-body-breadcrumb">
            <el-breadcrumb-item v-for="item in $store.state.view.breadCrumb" :key="item.index">
              <el-button type="text" v-text="item.name" :disabled="item.noLink" @click="goLink(item.path)"></el-button>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <keep-alive>
          <router-view></router-view>
        </keep-alive>

        <div slot="content-right">
          <div class="content-right-main">
            <el-select v-model="deGpoId" @change="GpoChange" placeholder="请选择GPO" :disabled="isDisabled" size="small" class="global-select">
              <el-option v-for="item in gpoOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>

      </layout-nav>

    </div>

    <div v-else-if="isShowType === 1">
      <NotAuth></NotAuth>
    </div>
    <div v-else></div>

    <public-edit-password :editLoading="editLoading" :editPasswordShow="editPasswordShow" @edit-password-sure="editPasswordSure" @edit-password-close="editpasswordClose"></public-edit-password>

  </div>
</template>

<script>
/**
 * 左侧菜单
 */

import NotAuth from '../NotAuth';     //  403没有权限

import baseList from '../baseList';     //  左侧菜单栏

import config from '../../../config';       //  api基础配置
import auth from '../../../api/auth';       //  用户权限接口，拿来头部退出登录

import project from '../../../api/BasicInfo/Project';   //  获取集采项目下拉接口

export default {
  activated() {
    this.$bus.$on('defaultProject/change', this.getProjectAll);
  },
  deactivated() {
    this.$bus.$off('defaultProject/change', this.getProjectAll);
  },
  components: {
    NotAuth,
  },
  watch: {
    deGpoId() {
      this.getProjectAll(this.deGpoId);
    },
    menuJson() {
      this.checkLinkOauth();
    },
    $route() {
      this.checkLinkOauth();
    },
  },
  computed: {
    isShowType() {
      const resourceId = parseInt(config.resource_id, 0);
      const resources = this.$store.state.view.resourcesList;
      if (!resources) {
        return 0;
      }
      if (resources && resources.length === 0) {
        return 1;
      }
      let isGo = false;
      for (let i = 0; i < resources.length; i += 1) {
        const item = resources[i];
        if (resourceId === item.id || location.host.indexOf('localhost') > -1) {
          isGo = true;
        }
      }
      if (!isGo) {
        return 1;
      }
      return 2;
    },
    //  根据权限接口获得的左菜单权限
    menuJson() {
      return this.$store.state.view.menuList;
    },
    //  根据权限给人看的左侧菜单
    menuList() {
      const menuList = [];

      const menuJson = this.menuJson;
      const memberType = this.memberInfo.memberType;
      const menuKeys = Object.keys(menuJson);

      for (let i = 0; i < this.allList.length; i += 1) {
        const menuItem = this.allList[i];
        const itemChildren = [];

        if (menuItem.path === '/index') {
          menuList.push(menuItem);
        } else if (menuKeys.indexOf(menuItem.name) > -1) {
          for (let j = 0; j < menuItem.children.length; j += 1) {
            const item = menuItem.children[j];
            if (
              item.type.indexOf(memberType) > -1 &&
              menuJson[menuItem.name].indexOf(item.name) > -1
            ) {
              itemChildren.push({
                path: item.path,
                name: item.name,
              });
            }
          }
        }
        if (itemChildren.length > 0) {
          menuList.push({
            path: menuItem.path,
            name: menuItem.name,
            icon: menuItem.icon,
            children: itemChildren,
          });
        }
      }

      return menuList;
    },
    //  当前激活菜单
    menuPath() {
      const reg = new RegExp(/\/([^/]*)\/([^/]*)/);
      const routePath = this.$route.path;
      const ret = routePath.match(reg);
      if (ret && ret.length > 0) {
        return routePath.match(reg)[0];
      }
      return ret;
    },
    //  头部系统菜单
    topList() {
      return this.$store.state.view.resourcesList;
    },
    //  会员信息
    memberInfo() {
      return this.$store.state.view.principal;
    },
    //  是否显示购物车
    shopcartShow() {
      if (this.memberInfo && this.memberInfo.memberType === 3) {
        return true;
      }
      return false;
    },
    //  gpo下拉选项
    gpoOptions() {
      return this.$store.state.view.gpoOptions;
    },
    //  全局gpoId
    gpoId() {
      this.deGpoId = this.$store.state.view.gpoId;
      return this.$store.state.view.gpoId;
    },
  },
  data() {
    return {
      systemInfo: {     //  左上角系统信息
        name: '交易平台',
        logo: 'https://gpo.oss-cn-shenzhen.aliyuncs.com/gpo/sys/qywlogo.png',
      },
      allList: baseList.menuList, //  左侧菜单全部的
      Interval: null,
      messageAll: [], //  所有消息
      message: [],  //  最新的三条消息
      dropdownList: [{      //  右边下拉的菜单
        name: '修改密码',
        key: 'editPassword',
      }, {
        name: '退出登录',
        key: 'logout',
      }],
      deGpoId: null,  //  当前被选中gpo
      isDisabled: false,  //  是否可以选择GPO
      editLoading: false, //  修改密码弹框的loading
      editPasswordShow: false, //  是否显示修改密码弹框
    };
  },
  methods: {
    //  右侧下拉菜单的点击事件
    dropdownClick(item) {
      switch (item.key) {
        //  退出登录
        case 'logout':
          {
            this.$loading({ fullscreenLoading: true });
            const logout = () => {
              config.removeToken();
              const localHref = sessionStorage.getItem('localHref');
              window.localStorage.removeItem(config.refreshToken);
              window.sessionStorage.removeItem(config.baseConfig);
              window.location.href = localHref;
            };
            auth.revoke().then((res) => {
              auth.logout().then((ret) => {
                logout();
              }).catch((ret) => {
                logout();
              });
            }).catch((res) => {
              auth.logout().then((ret) => {
                logout();
              }).catch((ret) => {
                logout();
              });
            });
          }
          break;
        //  修改密码
        case 'editPassword':
          this.editPasswordShow = true;
          break;
        default:
          break;
      }
    },
    //  导航栏跳转
    goLink(path) {
      this.$router.push(path);
    },
    goSystem(url) {
      // config.removeToken();
      location.href = url;
    },
    //  获取消息列表
    authMessageInit() {
      auth.messageList(0, 100).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          this.messageAll = data.content;
        }
      });
    },
    //  查看消息详情  只显示前3条
    authMessageItem() {
      auth.messageList(0, 3).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          this.message = data.content;
          for (let i = 0; i < this.message.length; i += 1) {
            this.message[i] = {
              ...this.message[i],
              sendTime: this.convert.convertDate(this.message[i].sendTime, 1),
              readTime: this.convert.convertDate(this.message[i].readTime, 1),
            };
          }
        }
      });
    },
    //  往系统管理跳转，查看更多消息
    authMessageLink(value, item) {
      let localHref = '';
      let str = '';
      let golink = '';
      for (let i = 0; i < this.topList.length; i += 1) {
        if (this.topList[i].id === 1) {
          localHref = this.topList[i].url;
        }
      }
      if (localHref) {
        str = localHref.split('/?');
        // 单条跳转
        if (value === 1) {
          golink = `${str[0]}/#/message/list/Edit?id=${item.id}`;
        } else {
          golink = `${str[0]}/#/message/list`;
        }
        location.href = golink;
      }
    },
    //  点击购物车的时候
    goShopcart() {
      this.$router.push({ path: '/Order/ShoppingCart' });
    },
    //  右上角切换gpo
    GpoChange() {
      this.$store.commit('gpoId', this.deGpoId);
      this.getProjectAll(this.deGpoId);
    },
    // 获取集采项目下拉
    getProjectAll(getGpoId) {
      project.all(getGpoId).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          let defaultValue = '';
          const arr = [];
          for (let i = 0; i < data.length; i += 1) {
            arr.push({
              label: data[i].name,   // 显示
              value: data[i].id,     // id值
            });
            if (data[i].ifDefault === 1) {
              defaultValue = data[i].id;
            }
          }
          this.$store.commit('projectOptions', arr);
          this.$store.commit('projectId', defaultValue);
        }
        this.$bus.$emit('project/getAll', this.deGpoId);
      });
    },
    // 使gpo无法选择
    gpoDisabled(i) {
      // 当 i = 1时，gpo会员下拉框可选
      // 当 i = 0时，gpo会员下拉框不可选
      if (i === 1) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
    },
    //  链接地址的权限判断
    checkLinkOauth() {
      const menuJson = this.menuJson;
      if (menuJson.length !== 0 && this.$route.path !== '/index') {
        if (this.$route.meta && this.$route.meta.functionName) {
          const menuPath = this.$route.meta.functionName.split('#');
          if (!menuJson[menuPath[0]] || menuJson[menuPath[0]].indexOf(menuPath[1]) === -1) {
            this.$router.push({ path: '/403' });
          }
        } else {
          console.error(`请配置路由的meta，用于配置权限，${this.$route.path}`);
        }
      }
    },
    //  确定修改密码
    editPasswordSure(data) {
      this.editLoading = true;
      const form = {
        ...data,
        id: this.memberInfo.userId,
      };
      auth.memberPassword(form).then((res) => {
        this.editLoading = false;
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '修改成功',
          });
          this.editPasswordShow = false;
        } else {
          this.$message({
            type: 'error',
            message: res.data.message,
          });
        }
      });
    },
    //  关闭修改密码弹框
    editpasswordClose() {
      this.editPasswordShow = false;
    },
  },
  mounted() {
    this.checkLinkOauth();

    setTimeout(() => {
      const $spinner = document.getElementById('app-gpo-index-hide');
      $spinner.style.display = 'none';
    }, 200);

    this.authMessageInit();
    this.Interval = setInterval(this.authMessageInit, 30000); // 定时调用
  },
  beforeDestroy() {
    clearInterval(this.Interval);

    // 事件解绑 -- 控制gpo选择
    this.$bus.off('gpo/disabled', this.gpoDisabled);
  },
  created() {
    // 事件绑定 -- 控制gpo选择
    this.$bus.on('gpo/disabled', this.gpoDisabled);
  },
};
</script>

<style scoped>
.content-right-main {
  float: right;
  margin-right: 20px;
  margin-top: -40px;
  font-size: 12px;
}

.global-select {
  width: 200px;
}
</style>

