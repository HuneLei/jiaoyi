<template>
    <el-row class="third-title">
      <p>{{thirdTitle.name}}</p>
    </el-row>
</template>

<script>
  export default {
    data() {
      return {
      };
    },
    props: {
      thirdTitle: {},
    },
  };
</script>
<style scoped>
  .third-title {
    padding: 0.1rem 0 0.2rem 0.1rem;
    font-size: 14px;
    font-weight: bold;
  }
</style>

