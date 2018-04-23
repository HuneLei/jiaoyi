<template>
  <div>
    <div class="order_refer">
      <div class="el-alert el-alert--success">
        <div class="el-alert__content">
          <span class="el-alert__title">
            <i class="el-alert__icon el-icon-circle-check"></i>
            已成功发起三方合同申请！
          </span>
        </div>
      </div>
      <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
        <el-table-column prop="code" label="合同编号" align="left" width="120" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="deliveryMemberName" label="配送企业" align="left" width="200" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="amount" label="合同总金额" align="right" width="100" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="合同有效期" align="left" min-width="160" sortable show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.validBtime}} ~ {{scope.row.validEtime}}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="合同创建时间" align="left" width="130" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="hospitalMemberName" label="医疗机构" align="left" width="200" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" align="left" min-width="100" sortable show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <TradeFooter :authbtn="authbtn" :isBackShow="isBackShow" @order-back="orderBack">
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
import StepsFrom from '../../../components/StepsFrom';                    // 引入加载条组件

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
        path: '/Contract/TriContractList',
        name: '三方合同列表',
        noLink: true,
      },
    ]);
    const data = this.$route.query.data;
    this.tableData = data;
    for (let i = 0; i < this.tableData.length; i += 1) {
      this.tableData[i].validBtime = this.tableData[i].validBtime.substring(0, 10);
      this.tableData[i].validEtime = this.tableData[i].validEtime.substring(0, 10);
    }
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
    StepsFrom,
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
      active: 1,   // 订单状态
      steplist: [{
        title: '生成三方合同',
        description: '',
      }, {
        title: '签章(医疗机构)',
        description: '',
      }, {
        title: '签章(配送企业)',
        description: '',
      }, {
        title: '签章(GPO)',
        description: '',
      }, {
        title: '合同生效',
        description: '',
      }],
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
    // 返回
    orderBack() {
      this.$router.push({ path: '/Contract/TriContractList' });
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
