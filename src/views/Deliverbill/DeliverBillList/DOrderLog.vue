<template>
  <div v-loading="loading">
    <el-table :data="Order_GetOrderLog" stripe border fit>
      <el-table-column prop="num" label="#" width="40" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="operator" min-width="80" height="20px" label="修改人" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliveryMemberName" min-width="140" height="20px" label="修改时间" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createBy" min-width="80" height="20px" label="修改前状态" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createTime" min-width="80" height="20px" label="修改后状态" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="ip" min-width="80" height="20px" label="IP" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="status" min-width="80" height="20px" label="取消原因" sortable show-overflow-tooltip>
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
      'Order_GetOrderLog',
    ]),
    data() {
      return {
        tableData: [],
        loading: false,
      };
    },
    methods: {},
  };
</script>
