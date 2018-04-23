<template>
  <div v-loading="loading">
    <el-table :data="tableData" stripe border fit :height="View_TableHeight" @sort-change="sortChange">
      <el-table-column prop="num" fixed="left" label="#" width="40" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="code" min-width="120" height="20px" label="订单结案单编号" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="hospitalMemberName" min-width="180" height="20px" label="医疗机构" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliveryMemberName" min-width="180" height="20px" label="配送企业" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="auditStatus" min-width="80" height="20px" label="审核状态" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span class="order-green" v-if="scope.row.auditStatus == 1">待审核</span>
          <span class="order-blue" v-if="scope.row.auditStatus == 3">审核通过</span>
          <span class="order-red" v-if="scope.row.auditStatus == 4">审核不通过</span>
        </template>
      </el-table-column>
      <el-table-column prop="drugsCode" min-width="90" label="药品编码" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="drugsName" min-width="120" label="通用名" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="tradeName" min-width="80" label="商品名" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="formName" min-width="90" label="剂型" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="specName" min-width="90" label="规格" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="packSpecName" min-width="90" label="包装规格" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="unitName" min-width="60" label="单位" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="right" prop="hospitalUnitPrice" min-width="70" label="单价" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <p>{{scope.row.hospitalUnitPrice.toFixed(2)}}</p>
        </template>
      </el-table-column>
      <el-table-column align="right" prop="ordersNum" min-width="80" label="订单数量" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="right" prop="sendNum" min-width="80" label="发货数量" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="right" prop="closeNum" min-width="80" label="结案数量" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="right" prop="purchaseAmount" min-width="90" label="结案金额" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <p>{{scope.row.purchaseAmount.toFixed(2)}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="producerName" min-width="180" label="生产企业" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="salerMemberName" min-width="180" label="卖方会员" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="approvalNumber" min-width="130" label="批准文号" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="ordersCode" min-width="135" label="订单编号" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="contractItemNo" min-width="135" label="合同明细编号" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="noOut" min-width="160" height="20px" label="外部订单结案单编号" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createBy" min-width="80" height="20px" label="创建人" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createTime" min-width="140" height="20px" label="创建日期" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deliveryReplyContent" min-width="180" height="20px" label="配送企业回复" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliveryReplyTime" min-width="140" height="20px" label="答复时间" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span>{{scope.row.deliveryReplyTime}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <div style="float: left;padding-right: 15px;padding-left: 63%">
        <span>总数量：</span>{{totalNumber ? totalNumber : 0}} </div>
      <div style="float: left">
        <span style="">总金额：</span>{{totalAmount ? totalAmount.toFixed(2) : 0}}
        <span>元</span>
      </div>
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
import { mapActions, mapGetters } from 'vuex';
import convert from '../../../utils/convert';                         //  自定义转换js
import OrdersCloseItem from '../../../api/Order/OrdersCloseItem';             //  订单结案单申请api

export default {
  computed: mapGetters([
    'View_TableHeight',
    'View_UserInfo',
    'getGpoId',
  ]),
  activated() {
    this.$bus.$on('components/Find', this.dataSearch);      //  查询
    this.$bus.$on('page/change', this.dataList);            //  页码切换
    this.$bus.$on('data/list', this.dataList);              //  初始化列表
    this.$bus.$on('data/export', this.exportData);          //  导出数据
    if (this.getGpoId) {                                    // 初始化列表查询
      this.dataList();
    }
  },
  deactivated() {
    this.$bus.$off('components/Find', this.dataSearch);    //  查询
    this.$bus.$off('page/change', this.dataList);          //  页码切换
    this.$bus.$off('data/list', this.dataList);            //  初始化列表
    this.$bus.$off('data/export', this.exportData);          //  导出数据
  },
  watch: {
    getGpoId() {
      if (this.$route.path === '/Order/ordersCloseItem') {
        this.dataList();
      }
    },
  },
  data() {
    return {
      tableData: [],
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      totalAmount: 0,
      totalNumber: 0,
      formInline: {    // 查询条件的获取值
        deliveryMemberName: {},
        hospitalMemberName: {},
        producerName: {},
        auditStatus: {},
        createTime: {
          value: [
            this.convertDate(new Date().setTime(new Date().getTime() - (3600 * 1000 * 24 * 30))),
            this.convertDate(new Date()),
          ],
        },
        drugsCode: {},
        drugsName: {},
        formName: {},
        specName: {},
        noOut: {},
        code: {},
        ordersCode: {},
      },
      page: 0,
      size: 20,
      total: 0,
    };
  },
  methods: {
    // 导出数据
    exportData() {
      const url = OrdersCloseItem.output(this.formInline, this.getGpoId);
      window.open(url);
    },
    //  每次点击排序都会触发
    sortChange(rule) {
      if (rule.order) {
        const tableData = this.convert.tableSort(rule, this.tableData);
        this.tableData = [...tableData];
      } else {
        this.tableData = [...this.tableDataOld];
      }
    },
    //  更新表格数据
    dataList(page, pageSizes, formInline) {
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      const form = formInline || this.formInline;
      let createTime = '';
      if (form.createTime.value && typeof form.createTime.value === 'object') {
        createTime = `${form.createTime.value[0].replace(/\//g, '-')} - ${form.createTime.value[1].replace(/\//g, '-')}`;
      } else {
        createTime = form.createTime.value;
      }
      if (createTime === '1970-01-01 - 1970-01-01') {
        form.createTime.value = '';
      } else {
        form.createTime.value = createTime;
      }
      form.gpoMemberId = this.getGpoId;
      OrdersCloseItem.list(cpage, cpageSizes, form).then((res) => {
        if (res.data.code === 0) {
          this.tableNum = [];
          this.tableCount = 0;
          const data = res.data.result[1];
          this.totalAmount = res.data.result[0][0].totalAmount;
          this.totalNumber = res.data.result[0][0].totalNumber;
          for (let i = 0; i < data.content.length; i += 1) {
            const numX = (i + 1) + (cpage * cpageSizes);
            data.content[i].num = numX;
            data.content[i].id = numX;
            data.content[i].hospitalUnitPrice = Number(data.content[i].hospitalUnitPrice);
            data.content[i].purchaseAmount = Number(data.content[i].purchaseAmount);
          }
          this.tableData = data.content;
          this.tableDataOld = data.content;
          this.page = data.number;
          this.size = data.size;
          this.$emit('page', data.number + 1, data.size, data.totalElements);
        }
        this.loading = false;
      });
    },
    // 数据查询条件获取
    dataSearch(data) {
      this.formInline = data;
      this.dataList(0, this.size, this.formInline);
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
    ...mapActions([
      'GetItemDate',
      'TableHeightRun',
    ]),
  },
};
</script>
