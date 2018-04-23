<template>
  <div v-loading="loading">
    <el-table :data="Order_GetDelivery" stripe border fit>
      <el-table-column prop="num" label="#" width="40" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="drugsCode" min-width="90" height="20px" label="药品编码" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="drugsName" min-width="120" height="20px" label="通用名" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="specName" min-width="90" height="20px" label="规格" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="packSpecName" min-width="90" height="20px" label="包装规格" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="formName" min-width="90" height="20px" label="剂型" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="unitName" min-width="60" height="20px" label="单位" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="approvalNumber" min-width="130" height="20px" label="批准文号" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="producerName" min-width="180" height="20px" label="生产企业" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="salerMemberName" min-width="180" height="20px" label="卖方会员" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="tradeName" min-width="80" height="20px" label="商品名" sortable show-overflow-tooltip>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  /**
   * Created by yaoling on 2017/9/2.
   * <p>
   * 江苏摇铃网络科技有限公司，版权所有。
   * Copyright (C) 2015-2017 All Rights Reserved.
   */
  import { mapActions, mapGetters } from 'vuex';
  import PurchasePlan from '../../../api/Order/PurchasePlan';

  export default {
    computed: mapGetters([
      'View_TableHeight',
      'Order_GetDelivery',
    ]),
    mounted() {},
    data() {
      return {
        loading: false,
      };
    },
    methods: {},
  };
</script>
