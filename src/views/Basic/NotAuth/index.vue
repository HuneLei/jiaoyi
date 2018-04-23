<template>
  <div class="notfound">
    <el-row type="flex" :gutter="20" justify="center" class="wscn-http404">
      <el-col :span="12" class="pic-404">
        <img class="pic-404__parent" src="../../../assets/img/404.png" alt="404">
        <img class="pic-404__child left" src="../../../assets/img/404_cloud.png" alt="404">
        <img class="pic-404__child mid" src="../../../assets/img/404_cloud.png" alt="404">
        <img class="pic-404__child right" src="../../../assets/img/404_cloud.png" alt="404">
      </el-col>
      <el-col :span="12" class="bullshit">
        <div class="bullshit__oops">403!</div>
        <div class="bullshit__headline">您没有该{{name403}}的访问权限</div>
        <div class="bullshit__info">联系管理人员</div>
        <el-button type="primary" @click="logout">重新登录</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
/**
 * 403
 */
import auth from '../../../api/auth';
import config from '../../../config';

export default {
  created() {
    const name = sessionStorage.getItem('name403');
    if (name) {
      this.name403 = name;
    } else {
      this.name403 = this.name;
    }
    sessionStorage.removeItem('name403');
  },
  data() {
    return {
      name: '平台',
      name403: '',
    };
  },
  methods: {
    //  退出登录
    logout() {
      this.$loading({ fullscreenLoading: true });
      const logout = () => {
        config.removeToken();
        const localHref = sessionStorage.getItem('localHref');
        window.localStorage.removeItem(config.refreshToken);
//        window.location.href = localHref;
        window.location.href = `${config.getAuthServer()}/oauth/home`;
        window.sessionStorage.removeItem(config.baseConfig);
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
    },
  },
};
</script>

<style scoped>
  .notfound {
    background: #f0f2f5;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
  }

  .wscn-http404 .pic-404 {
    position: relative;
    float: left;
    width: 600px;
    padding: 150px 0;
    overflow: hidden;
  }

  .wscn-http404 .pic-404__parent {
    width: 100%;
  }

  .wscn-http404 .pic-404__child {
    position: absolute;
  }

  .wscn-http404 .pic-404__child.left {
    width: 80px;
    top: 17px;
    left: 220px;
    opacity: 0;
    animation-name: cloudLeft;
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
    animation-delay: 1s;
  }

  .wscn-http404 .pic-404__child.mid {
    width: 46px;
    top: 10px;
    left: 420px;
    opacity: 0;
    animation-name: cloudMid;
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
    animation-delay: 1.2s;
  }

  .wscn-http404 .pic-404__child.right {
    width: 62px;
    top: 100px;
    left: 500px;
    opacity: 0;
    animation-name: cloudRight;
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
    animation-delay: 1s;
  }

  @keyframes cloudLeft {
    0% {
      top: 17px;
      left: 220px;
      opacity: 0;
    }
    20% {
      top: 33px;
      left: 188px;
      opacity: 1;
    }
    80% {
      top: 81px;
      left: 92px;
      opacity: 1;
    }
    100% {
      top: 97px;
      left: 60px;
      opacity: 0;
    }
  }

  @keyframes cloudMid {
    0% {
      top: 10px;
      left: 420px;
      opacity: 0;
    }
    20% {
      top: 40px;
      left: 360px;
      opacity: 1;
    }
    70% {
      top: 130px;
      left: 180px;
      opacity: 1;
    }
    100% {
      top: 160px;
      left: 120px;
      opacity: 0;
    }
  }

  @keyframes cloudRight {
    0% {
      top: 100px;
      left: 500px;
      opacity: 0;
    }
    20% {
      top: 120px;
      left: 460px;
      opacity: 1;
    }
    80% {
      top: 180px;
      left: 340px;
      opacity: 1;
    }
    100% {
      top: 200px;
      left: 300px;
      opacity: 0;
    }
  }

  .wscn-http404 .bullshit {
    position: relative;
    float: left;
    width: 300px;
    padding: 150px 0;
    overflow: hidden;
  }

  .wscn-http404 .bullshit__oops {
    font-size: 32px;
    font-weight: bold;
    line-height: 40px;
    color: #1482f0;
    opacity: 0;
    margin-bottom: 20px;
    animation-name: slideUp;
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
  }

  .wscn-http404 .bullshit__headline {
    font-size: 20px;
    line-height: 24px;
    color: #1482f0;
    opacity: 0;
    margin-bottom: 10px;
    animation-name: slideUp;
    animation-duration: 0.5s;
    animation-delay: 0.1s;
    animation-fill-mode: forwards;
  }

  .wscn-http404 .bullshit__info {
    font-size: 13px;
    line-height: 21px;
    color: grey;
    opacity: 0;
    margin-bottom: 30px;
    animation-name: slideUp;
    animation-duration: 0.5s;
    animation-delay: 0.2s;
    animation-fill-mode: forwards;
  }

  .wscn-http404 .bullshit__return-home {
    display: block;
    float: left;
    width: 110px;
    height: 36px;
    background: #1482f0;
    border-radius: 100px;
    text-align: center;
    color: #ffffff;
    opacity: 0;
    font-size: 14px;
    line-height: 36px;
    cursor: pointer;
    animation-name: slideUp;
    animation-duration: 0.5s;
    animation-delay: 0.3s;
    animation-fill-mode: forwards;
  }

  @keyframes slideUp {
    0% {
      transform: translateY(60px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

</style>
