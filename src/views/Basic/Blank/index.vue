<template>
  <div>
    <!-- 空白页入口 -->
    <!-- 这里应该要加多一个loading动画 -->
  </div>
</template>
<script>

import config from '../../../config';

export default {
  data() {
    return {};
  },
  methods: {
    goWhere() {
      if (/\?[^]*/.test(location.href)) {
        window.history.pushState({}, 0, '/#/');
      }
      if (config.getHash() && config.getHash() !== '#/') {
        const path = config.getHash().replace('#/', '/');
        config.removeHash();
        this.$router.replace({ path });
      } else {
        this.$router.replace({ path: '/index' });
      }
    },
  },
  mounted() {
    this.goWhere();
  },
};
</script>
