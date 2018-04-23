<template>
  <div class="table-footer">
    <div class="total-number">总订单数量：<span>111</span> 个</div>
    <div class="total-amount">总金额：<span>1111</span> 元</div>
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
    props: {},
  };
</script>
<style>
  .table-footer .total-number{
    float: left;
    padding-right: 16px;
    padding-left: 63%;
  }
  .table-footer .total-amount{
    float: left;
  }
  .table-footer span {
    font-weight: 500 !important;
  }
  .table-footer {
    font-weight: bold;
  }
</style>
