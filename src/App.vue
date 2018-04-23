<template>
  <div class="app app-print">
    <div v-if="isAuth">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
    <div v-else>
      <NotAuth></NotAuth>
    </div>
  </div>
</template>

<script>
import auth from './api/auth';
import config from './config';
import NotAuth from './views/Basic/NotAuth';
import information from './api/gpo';

export default {
  mounted() {
    this.getFunctions();
    this.getPrincipal();
  },
  computed: {
    localHref() {
      return sessionStorage.getItem('localHref');
    },
  },
  watch: {
  },
  data() {
    return {
      isAuth: true,
    };
  },
  components: {
    NotAuth,
  },
  methods: {
    //  获取用户模块
    getFunctions() {
      auth.functions().then((res) => {
        if (res.data.code === 401) {
          config.removeToken();
          window.location.href = this.localHref;
        } else if (res.data.code === 0) {
          const menuList = res.data.result;
          this.$store.commit('menuList', menuList); //  左侧菜单
        } else {
          this.isAuth = false;
        }
      });
    },
    //  获取用户模块
    getPrincipal() {
      auth.principal().then((res) => {
        if (res.data.code === 401) {
          config.removeToken();
          window.location.href = this.localHref;
        } else if (res.data.code === 0) {
          const principal = res.data.result;
          this.$store.commit('principal', principal);
          const authList = [];
          const userInfo = {
            userId: res.data.result.userId,
            userName: res.data.result.userName,
            memberId: res.data.result.memberId,
            memberNo: res.data.result.memberNo,
            memberType: res.data.result.memberType,
            memberName: res.data.result.memberName,
          };
          for (let i = 0; i < principal.authorities.length; i += 1) {
            const item = principal.authorities[i].authority;
            authList.push(item);
          }
          this.$store.commit('authList', authList); //  用户权限
          this.$store.commit('USERINFO', userInfo); //  用户信息
          this.getInformation();
          this.getInfoGpo();
          this.getResources();
        } else {
          this.isAuth = false;
        }
      });
    },
    //  获取用户平台
    getResources() {
      const resources = sessionStorage.getItem('resources');

      if (!resources || resources === '[]' || resources === '{}') {
        auth.resources().then((res) => {
          if (res.data.code === 401) {
            config.removeToken();
            window.location.href = this.localHref;
          } else if (res.data.code === 0) {
            const resourcesList = res.data.result;
            const baseConfig = JSON.parse(window.sessionStorage.getItem(config.baseConfig));
            for (let j = 0; j < resourcesList.length; j += 1) {
              const item = resourcesList[j];
              if (item.id.toString() === baseConfig.resource_id) {
                resourcesList[j].active = true;
                break;
              }
            }

            this.$store.commit('resourcesList', resourcesList); //  顶部平台导航条
          } else {
            this.$store.commit('resourcesList', []); //  顶部平台导航条
            this.isAuth = false;
          }
        });
      } else {
        const resourcesList = JSON.parse(resources);
        this.$store.commit('resourcesList', resourcesList); //  顶部平台导航条
      }
    },
    //  获取当前用户信息
    getInformation() {
      information.information().then((res) => {
        if (res.data.code === 0 && res.data.result) {
          const userInfor = {
            code: res.data.result.code || '',
            contacter: res.data.result.contacter || '',
            id: res.data.result.id || '',
            name: res.data.result.name || '',
            phone: res.data.result.phone || '',
            deliverPerson: res.data.result.deliverPerson || '',
            deliverPhone: res.data.result.deliverPhone || '',
            invoiceCode: res.data.result.invoiceCode || '',
          };
          this.$store.commit('USERINFOR', userInfor); //  用户信息
        }
      });
    },
    // 获取当前GPO列表信息
    getInfoGpo() {
      information.listAll().then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          const gpoOptions = data;
          //        gpoOptions.push({
          //          name: 44,
          //          id: 44,
          //        });
          const gpoId = data[0].id;
          this.$store.commit('gpoId', gpoId);
          this.$store.commit('gpoOptions', gpoOptions);
        }
      });
    },
  },
};
</script>

<style>
.app {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.disabled .el-input__inner {
  background: #f9fafc;
}

.disabled .el-textarea__inner {
  background: #f9fafc;
}

.disabled .el-textarea__inner {
  background: #f9fafc;
}
</style>
