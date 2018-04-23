<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    components: {},
    activated() {},
    mounted() {
      const $spinner = document.getElementById('app-gpo-index-hide');
      $spinner.style.display = 'none';
    },
  };
</script>
