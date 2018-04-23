<template>
  <el-row class="edit-form-title">
    <p>
      <i v-if="subTitle.rules" style="color: #ff4949;font-size: 12px;font-weight: 400;font-style: normal;" v-text="'*'"></i>
      <i :class="subTitle.icon"></i>{{subTitle.name}}</p>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  props: {
    subTitle: {},
  },
};
</script>
<style scoped>
i {
  font-size: 16px;
  margin-right: 10px;
}
.edit-form-title {
  font-size: 16px;
  padding: 0.1rem;
  margin-bottom: 0.2rem;
  border-bottom: 0.01rem solid #eee;
}
</style>

