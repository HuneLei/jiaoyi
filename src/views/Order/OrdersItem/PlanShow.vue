<template>
  <div v-loading="loading">
    <el-table :data="tableData" stripe border fit :height="View_TableHeight" @selection-change="dataSelect" @sort-change="sortChange">
      <el-table-column type="selection" width="40" align="center">
      </el-table-column>
      <el-table-column fixed="left" prop="num" label="#" width="40" class-name="table_right_fixed">
      </el-table-column>
      <el-table-column key="code" prop="code" width="110" height="20px" label="订单编号" sortable="custom" show-overflow-tooltip v-if="filter.code">
      </el-table-column>
      <el-table-column key="hospitalMemberName" prop="hospitalMemberName" min-width="180" height="20px" label="医疗机构" sortable="custom" show-overflow-tooltip v-if="filter.hospitalMemberName">
      </el-table-column>
      <el-table-column key="deliveryMemberName" prop="deliveryMemberName" min-width="160" height="20px" label="配送企业" sortable="custom" show-overflow-tooltip v-if="filter.deliveryMemberName">
      </el-table-column>
      <el-table-column key="drugsCode" prop="drugsCode" min-width="90" label="药品编码" sortable="custom" show-overflow-tooltip v-if="filter.drugsCode">
      </el-table-column>
      <el-table-column key="drugsName" prop="drugsName" min-width="120" label="通用名" sortable="custom" show-overflow-tooltip v-if="filter.drugsName">
      </el-table-column>
      <el-table-column key="tradeName" prop="tradeName" min-width="80" label="商品名" sortable="custom" show-overflow-tooltip v-if="filter.tradeName">
      </el-table-column>
      <el-table-column key="formName" prop="formName" min-width="90" label="剂型" sortable="custom" show-overflow-tooltip v-if="filter.formName">
      </el-table-column>
      <el-table-column key="specName" prop="specName" min-width="90" label="规格" sortable="custom" show-overflow-tooltip v-if="filter.specName">
      </el-table-column>
      <el-table-column key="packSpecName" prop="packSpecName" min-width="90" label="包装规格" sortable="custom" show-overflow-tooltip v-if="filter.packSpecName">
      </el-table-column>
      <el-table-column key="unitName" prop="unitName" min-width="60" label="单位" sortable="custom" show-overflow-tooltip v-if="filter.unitName">
      </el-table-column>
      <el-table-column key="hospitalUnitPrice" align="right" prop="hospitalUnitPrice" min-width="70" label="单价" sortable="custom" show-overflow-tooltip v-if="filter.hospitalUnitPrice">
        <template scope="scope">
          <p>{{scope.row.hospitalUnitPrice.toFixed(2)}}</p>
        </template>
      </el-table-column>
      <el-table-column key="purchaseAmount" align="right" prop="purchaseAmount" min-width="90" label="金额" sortable="custom" show-overflow-tooltip v-if="filter.purchaseAmount">
        <template scope="scope">
          <p>{{scope.row.purchaseAmount.toFixed(2)}}</p>
        </template>
      </el-table-column>
      <el-table-column key="ordersNum" align="right" prop="ordersNum" min-width="80" label="订单数量" sortable="custom" show-overflow-tooltip v-if="filter.ordersNum">
      </el-table-column>
      <el-table-column key="sendNum" prop="sendNum" align="right" min-width="80" label="发货数量" sortable="custom" show-overflow-tooltip v-if="filter.sendNum">
        <template scope="scope">
          <span>{{scope.row.sendNum == 0 ? '' : scope.row.sendNum}}</span>
        </template>
      </el-table-column>
      <el-table-column key="waitNum" prop="waitNum" align="right" min-width="80" label="待发数量" sortable="custom" show-overflow-tooltip v-if="filter.waitNum">
      </el-table-column>
      <el-table-column key="stockinNum" prop="stockinNum" align="right" min-width="80" label="入库数量" sortable="custom" show-overflow-tooltip v-if="filter.stockinNum">
        <template scope="scope">
          <span>{{scope.row.stockinNum == 0 ? '' : scope.row.stockinNum}}</span>
        </template>
      </el-table-column>
      <el-table-column key="refusedNum" prop="refusedNum" align="right" min-width="80" label="拒收数量" sortable="custom" show-overflow-tooltip v-if="filter.refusedNum">
        <template scope="scope">
          <span>{{scope.row.refusedNum == 0 ? '' : scope.row.refusedNum}}</span>
        </template>
      </el-table-column>
      <el-table-column key="returnNum" prop="returnNum" align="right" min-width="80" label="退货数量" sortable="custom" show-overflow-tooltip v-if="filter.returnNum">
        <template scope="scope">
          <span>{{scope.row.returnNum == 0 ? '' : scope.row.returnNum}}</span>
        </template>
      </el-table-column>
      <el-table-column key="closeNum" prop="closeNum" align="right" min-width="80" label="结案数量" sortable="custom" show-overflow-tooltip v-if="filter.closeNum">
        <template scope="scope">
          <span>{{scope.row.closeNum == 0 ? '' : scope.row.closeNum}}</span>
        </template>
      </el-table-column>
      <el-table-column key="producerName" prop="producerName" min-width="180" label="生产企业" sortable="custom" show-overflow-tooltip v-if="filter.producerName">
      </el-table-column>
      <el-table-column key="salerMemberName" prop="salerMemberName" min-width="180" label="卖方会员" sortable="custom" show-overflow-tooltip v-if="filter.salerMemberName">
      </el-table-column>
      <el-table-column key="approvalNumber" prop="approvalNumber" min-width="130" label="批准文号" sortable="custom" show-overflow-tooltip v-if="filter.approvalNumber">
      </el-table-column>
      <el-table-column key="contractCode" prop="contractCode" min-width="120" label="合同编号" sortable="custom" show-overflow-tooltip v-if="filter.contractCode">
      </el-table-column>
      <el-table-column key="contractItemNo" prop="contractItemNo" min-width="135" label="合同明细编号" sortable="custom" show-overflow-tooltip v-if="filter.contractItemNo">
      </el-table-column>
      <el-table-column key="sendStatus" prop="sendStatus" min-width="80" height="20px" label="发货状态" sortable="custom" show-overflow-tooltip v-if="filter.sendStatus">
        <template scope="scope">
          <span class="order-blue" v-if="scope.row.sendStatus == 0">无</span>
          <span class="order-green" v-if="scope.row.sendStatus == 1">待发货</span>
          <span class="order-green" v-if="scope.row.sendStatus == 2">部分发货</span>
          <span class="order-blue" v-if="scope.row.sendStatus == 3">已发货</span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="status" min-width="80" height="20px" label="订单状态" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span class="order-green" v-if="scope.row.status == 0">待提交</span>
          <span class="order-green" v-if="scope.row.status == 1">待确认</span>
          <span class="order-green" v-if="scope.row.status == 2">待发货</span>
          <span class="order-green" v-if="scope.row.status == 3">部分发货</span>
          <span class="order-blue" v-if="scope.row.status == 4">已发货</span>
          <span class="order-blue" v-if="scope.row.status == 5">已完成</span>
          <span class="order-red" v-if="scope.row.status == 6">已取消</span>
        </template>
      </el-table-column>-->
      <el-table-column key="closeStatus" prop="closeStatus" min-width="80" height="20px" label="结案状态" sortable="custom" show-overflow-tooltip v-if="filter.closeStatus">
        <template scope="scope">
          <span v-if="scope.row.closeStatus == 0">无</span>
          <span class="order-green" v-if="scope.row.closeStatus == 1">结案中</span>
          <span class="order-blue" v-if="scope.row.closeStatus == 3">已结案</span>
        </template>
      </el-table-column>
      <el-table-column key="receiveAddress" prop="receiveAddress" min-width="300" height="20px" label="收货地址" sortable="custom" show-overflow-tooltip v-if="filter.receiveAddress">
      </el-table-column>
      <el-table-column key="createBy" prop="createBy" min-width="80" height="20px" label="创建人" sortable="custom" show-overflow-tooltip v-if="filter.createBy">
      </el-table-column>
      <el-table-column key="createTime" prop="createTime" min-width="140" height="20px" label="订单创建日期" sortable="custom" show-overflow-tooltip v-if="filter.createTime">
        <template scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column key="confirmTime" prop="confirmTime" min-width="140" height="20px" label="订单确认日期" sortable="custom" show-overflow-tooltip v-if="filter.confirmTime">
        <template scope="scope">
          <span>{{scope.row.confirmTime}}</span>
        </template>
      </el-table-column>
      <el-table-column key="noOut" prop="noOut" min-width="135" height="20px" label="外部订单编号" sortable="custom" show-overflow-tooltip v-if="filter.noOut">
      </el-table-column>
      <el-table-column key="drugStandardCode" prop="drugStandardCode" min-width="120" label="本位码" sortable="custom" show-overflow-tooltip v-if="filter.drugStandardCode">
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <div style="float: left;padding-right: 15px;padding-left: 63%">
        <span>总订单数量：</span>{{totalNumber ? totalNumber : 0}} </div>
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
import convert from '../../../utils/convert';                //  自定义转换js
import OrdesItem from '../../../api/Order/OrdesItem';        //  订单结案单申请api

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
    this.$bus.$off('data/export', this.exportData);        //  导出数据
  },
  watch: {
    getGpoId() {
      if (this.$route.path === '/Order/OrdersItem') {
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
      totalAmount: 0,
      totalNumber: 0,
      loading: false,
      formInline: {    // 查询条件的获取值
        code: {},
        contractCode: {},
        contractItemNo: {},
        deliveryMemberName: {},
        hospitalMemberName: {},
        drugStandardCode: {},
        producerName: {},
        drugsCode: {},
        drugsName: {},
        formName: {},
        specName: {},
        sendStatus: {},
        status: {},
        closeStatus: {},
        salerMemberName: {},
        noOut: {},
        receiveAddress: {},
        tradeName: {},
        createTime: {
          value: [
            this.convertDate(new Date().setTime(new Date().getTime() - (3600 * 1000 * 24 * 30))),
            this.convertDate(new Date()),
          ],
        },
        confirmTime: {},
      },
      page: 0,
      size: 20,
      total: 0,
    };
  },
  methods: {
    // 导出数据
    exportData() {
      const url = OrdesItem.output(this.formInline, this.getGpoId);
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
      let confirmTime = '';
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
      if (form.confirmTime.value && typeof form.confirmTime.value === 'object') {
        confirmTime = `${form.confirmTime.value[0].replace(/\//g, '-')} - ${form.confirmTime.value[1].replace(/\//g, '-')}`;
      } else {
        confirmTime = form.confirmTime.value;
      }
      if (confirmTime === '1970-01-01 - 1970-01-01') {
        form.confirmTime.value = '';
      } else {
        form.confirmTime.value = confirmTime;
      }
      form.gpoMemberId = this.getGpoId;
      OrdesItem.list(cpage, cpageSizes, form).then((res) => {
        if (res.data.code === 0) {
          this.tableNum = [];
          this.tableCount = 0;
          const data = res.data.result[1];
          this.totalAmount = res.data.result[0][0].totalAmount;
          this.totalNumber = res.data.result[0][0].totalNumber;
          for (let i = 0; i < data.content.length; i += 1) {
            const numX = (i + 1) + (cpage * cpageSizes);
            data.content[i].num = numX;
            const ordersNum = data.content[i].ordersNum;
            const sendNum = data.content[i].sendNum;
            data.content[i].waitNum = Number(ordersNum) - Number(sendNum);
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
    // 选择触发事件，根据审核状态判断右下角btn是否禁用
    dataSelect(row) {
      let submit = true;
      const ids = [];
      for (let i = 0; i < row.length; i += 1) {
        const status = Number(row[i].status);
        ids.push(row[i].id);
        if ((status !== 2 && status !== 3) || Number(row[i].closeStatus) !== 0) {
          submit = false;
          break;
        }
      }
      this.$emit('table-select', ids);
      const first = 0;
      if (first > 0) {
        submit = false;
      }
      const btn = { applys: submit };
      this.$bus.$emit('data/select', row, btn);
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
  props: {
    filter: Object,
  },
};
</script>
