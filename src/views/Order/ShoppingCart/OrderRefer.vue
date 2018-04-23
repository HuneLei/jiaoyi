<template>
  <div>
    <div class="order_refer">
      <div class="el-alert el-alert--success">
        <div class="el-alert__content">
          <span class="el-alert__title">
            <i class="el-alert__icon el-icon-circle-check"></i>
            订单已成功提交，请耐心等待收货
          </span>
        </div>
      </div>
      <el-table :data="this.Order_OrderCreate" stripe border fit height="300">
        <el-table-column prop="num" label="#" width="40" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="code" min-width="135" align="left" label="订单编号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="hospitalMemberName" align="left" min-width="180" label="医疗机构" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="deliveryMemberName" align="left" min-width="180" label="配送企业" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="createTime" align="left" min-width="140" label="创建日期" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="amount" align="right" min-width="90" label="订单金额" show-overflow-tooltip>
          <template scope="scope">
            <p>{{Number(scope.row.amount).toFixed(2)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="hospitalPerson" align="left" min-width="80" label="收货人" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="hospitalPhone" align="left" min-width="120" label="联系方式" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="receiveAddress" align="left" min-width="160" label="收货地址" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-button type="primary" class="page_btn" @click="GoOrders">
        <i class="icon iconfont icon-chakan"></i>查看订单列表
      </el-button>
    </div>
  </div>
</template>

<script>
  /**
   * Created by yaoling on 2017/9/2.
   * <p>
   * 江苏摇铃网络科技有限公司，版权所有。
   * Copyright (C) 2015-2017 All Rights Reserved.
   */
  import { mapGetters } from 'vuex';

  export default {
    computed: mapGetters([
      'Order_OrderCreate',
    ]),
    data() {
      return {};
    },
    methods: {
      // 点击去到订单列表
      GoOrders() {
        this.$router.push({ path: '/Order/HospitalOrdersList' });
      },
    },
  };
</script>
<style>
  .order_refer .page_btn {
    font-size: 14px;
    line-height: 16px;
    margin-top: 30px;
  }
  .order_refer .el-table {
    margin: auto;
    width: 85%;
  }
  .order_refer .el-alert {
    width: 70%;
    margin: 15px auto;
  }
  .order_refer .el-alert__icon {
    font-size: 28px;
    width: 16px;
    line-height: inherit;
    color: #fff;
    margin-right: 14px;
    vertical-align: middle;
    display: inline-block;
  }
  .order_refer .el-alert__title {
    font-size: 20px;
    font-weight: bolder;
  }
  .order_refer .page_btn i {
    margin-right: 4px;
    margin-top: -3px !important;
    vertical-align: middle;
    display: inline-block;
    font-size: 20px;
  }
  .order_refer {
    text-align: center;
    margin-top: 10%;
  }
</style>
