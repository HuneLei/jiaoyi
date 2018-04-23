<template>
  <div>
    <div class="order_refer">
      <div class="el-alert el-alert--success">
        <div class="el-alert__content">
          <span class="el-alert__title">
            <i class="el-alert__icon el-icon-circle-check"></i>
            已成功发起结案申请！
          </span>
        </div>
      </div>
      <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
        <el-table-column prop="code" label="结案申请单编号" align="left" width="120" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="hospitalMemberName" label="医疗机构" align="left" width="200" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="deliveryMemberName" label="配送企业" align="left" min-width="200" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="createBy" label="申请人" align="left" width="120" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="createTime" label="申请时间" align="left" min-width="160" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="closeType" label="结案类型" align="left" width="120" sortable show-overflow-tooltip>
          <template scope="scope">
            <span v-if="scope.row.closeType == 0">合同结案</span>
            <span v-if="scope.row.closeType == 1">合同明细结案</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyReason" label="结案原因" align="left" width="200" sortable show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <TradeFooter :authbtn="authbtn" :isapplyList="isapplyList" :isBackShow="isBackShow"   @order-close="orderClose"  @order-back="orderBack" >
      </TradeFooter>
    </div>
  </div>
</template>

<script>
/**
 * Created by yaoling on 2017/9/11.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import TradeFooter from '../../../components/TradeFooter';           // 引入底部组件

export default {
  activated() {
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Contract',
        name: '合同管理',
        noLink: true,
      },
      {
        path: '/Contract/ContractItem',
        name: '合同明细结案申请单',
        noLink: true,
      },
    ]);
    const data = this.$route.query.data;
    this.tableData = data;
  },
  deactivated() {
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  components: {
    TradeFooter,
  },
  data() {
    return {
      tableHeight: 650,
      dialogOptions: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: null,                //  默认表格选中
        tableType: 0,                       //  0 单选，1 多选 默认单选
      },
      tableData: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      isBackShow: true,           // 返回按钮
      isapplyList: true,        // 查看
      authbtn: {
        create: true,
      },
      selectData: [],
      // 筛选字段
      filterForm: {
        projectId: null,
        gpoMemberId: null,
        drugsCode: null,
        drugsName: null,
        specName: null,
        tradeName: null,
        formName: null,
        approvalNumber: null,
        enrollName: null,
        producerName: null,
        // nametype: null,
        deliveryMemberName: null,
        // hospitalMemberName: null,
        // hospitalMemberId: null,
      },
      dialogFormVisible: false,
      page: 0,
      size: 15,
      nametype: '',
    };
  },
  methods: {
    //  每次点击排序都会触发
    sortChange() {
      this.tableCount = 0;
    },
    //  计算表格高度
    tableHeightRun() {
      const tableHeightFun = () => {
        this.tableHeight = window.tableCustom.tableHeight([420]);
      };
      setTimeout(tableHeightFun, 0);
    },
    // 查看结案申请列表
    orderClose() {
      this.$router.push({ path: '/Contract/ContractClose' });
    },
    // 返回
    orderBack() {
      this.$router.go(-1);
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
