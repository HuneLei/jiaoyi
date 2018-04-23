<template>
  <div class="audit_status">
    <el-alert
      :closable="closable"
      :title="tip"
      :type="type"
      :style="{height: heightStyle + 'px'}"
      show-icon>
    </el-alert>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        heightStyle: 0,
      };
    },
    props: {
      tip: {},   // 头部的标题
      closable: {  // 是否可进行关闭
        default: false,
      },
      type: '',  // 类型的选择 有success，info，warning，error
      heightStyle: {
        default: 0, // 高度的控制
      },
    },
  };
</script>
<style scoped>
  .audit_status {
    color: #ff4949;
    font-size: 0.14rem;
  }

  .audit_status i {
    color: #13ce66;
  }
</style>
