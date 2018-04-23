<template>
  <div class="space-steps">
    <el-steps :space="space" :active="active" :finish-status="finish" :process-status="process">
      <el-step :title="steplist[index].title" :description="steplist[index].description" :icon="steplist[index].icon" v-for="(value, index) in steplist" :key="index"></el-step>
    </el-steps>
  </div>
</template>

<script>
  /**
   * Created by yaoling on 2017/9/2.
   * <p>
   * 江苏摇铃网络科技有限公司，版权所有。
   * Copyright (C) 2015-2017 All Rights Reserved.
   */

  export default {
    data() {
      return {
      };
    },
    props: {
      space: {      // 每个步骤的宽度
        default: 200,
      },
      active: 0,    // 在第几个步骤
      finish: {
        default: 'success',  // 步骤条的样式
      },
      process: {
        default: 'process',  // 当前步骤条的样式
      },
      steplist: null,  // 步骤条的内容有title和description属性
    },
  };
</script>
<style>
  .space-steps .el-step__description {
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
    margin-top: -16px;
  }
</style>
