<template>
  <div v-loading="loading">
    <el-table :data="tableData" stripe border fit :height="View_TableHeight" @selection-change="dataSelect" @sort-change="sortChange">
      <el-table-column prop="num" label="#" width="40">
      </el-table-column>
      <el-table-column prop="code" min-width="120" height="20px" label="配送单编号" sortable="custom" show-overflow-tooltip v-if="filter.code" key="code">
      </el-table-column>
      <el-table-column prop="hospitalMemberName" min-width="160" height="20px" label="医疗机构" sortable="custom" show-overflow-tooltip v-if="filter.hospitalMemberName" key="hospitalMemberName">
      </el-table-column>
      <el-table-column prop="deliveryMemberName" min-width="180" height="20px" label="配送企业" sortable="custom" show-overflow-tooltip v-if="filter.deliveryMemberName" key="deliveryMemberName">
      </el-table-column>
      <el-table-column prop="drugsCode" min-width="90" label="药品编码" sortable="custom" show-overflow-tooltip v-if="filter.drugsCode" key="drugsCode">
      </el-table-column>
      <el-table-column prop="drugsName" min-width="120" label="通用名" sortable="custom" show-overflow-tooltip v-if="filter.drugsName" key="drugsName">
      </el-table-column>
      <el-table-column prop="tradeName" min-width="80" label="商品名" sortable="custom" show-overflow-tooltip v-if="filter.tradeName" key="tradeName">
      </el-table-column>
      <el-table-column prop="formName" min-width="90" label="剂型" sortable="custom" show-overflow-tooltip v-if="filter.formName" key="formName">
      </el-table-column>
      <el-table-column prop="specName" min-width="90" label="规格" sortable="custom" show-overflow-tooltip v-if="filter.specName" key="specName">
      </el-table-column>
      <el-table-column prop="packSpecName" min-width="90" label="包装规格" sortable="custom" show-overflow-tooltip v-if="filter.packSpecName" key="packSpecName">
      </el-table-column>
      <el-table-column prop="unitName" min-width="60" label="单位" sortable="custom" show-overflow-tooltip v-if="filter.unitName" key="unitName">
      </el-table-column>
      <el-table-column prop="batchNo" min-width="80" label="批号" sortable="custom" show-overflow-tooltip v-if="filter.batchNo" key="batchNo">
      </el-table-column>
      <el-table-column align="right" prop="hospitalUnitPrice" min-width="70" label="单价" sortable="custom" show-overflow-tooltip v-if="filter.hospitalUnitPrice" key="hospitalUnitPrice">
        <template scope="scope">
          <span>{{scope.row.hospitalUnitPrice.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" prop="amount" min-width="90" label="发货金额" sortable="custom" show-overflow-tooltip v-if="filter.amount" key="amount">
        <template scope="scope">
          <span>{{scope.row.amount.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" prop="drugsNum" min-width="80" label="发货数量" sortable="custom" show-overflow-tooltip v-if="filter.drugsNum" key="drugsNum">
      </el-table-column>
      <el-table-column align="right" prop="stockinNum" min-width="80" label="入库数量" sortable="custom" show-overflow-tooltip v-if="filter.stockinNum" key="stockinNum">
      </el-table-column>
      <el-table-column align="right" prop="refusedNum" min-width="80" label="拒收数量" sortable="custom" show-overflow-tooltip v-if="filter.refusedNum" key="refusedNum">
      </el-table-column>
      <el-table-column align="right" prop="invoicedNum" min-width="90" label="已开票数量" sortable="custom" show-overflow-tooltip v-if="filter.invoicedNum" key="invoicedNum">
      </el-table-column>
      <el-table-column align="right" prop="refusedInvoicedNum" min-width="100" label="已开红票数量" sortable="custom" show-overflow-tooltip v-if="filter.refusedInvoicedNum" key="refusedInvoicedNum">
      </el-table-column>
      <el-table-column prop="deliveryAddress" min-width="300" label="送货地址" sortable="custom" show-overflow-tooltip v-if="filter.deliveryAddress" key="deliveryAddress">
      </el-table-column>
      <el-table-column prop="producerName" min-width="180" label="生产企业" sortable="custom" show-overflow-tooltip v-if="filter.producerName" key="producerName">
      </el-table-column>
      <el-table-column prop="salerMemberName" min-width="180" height="20px" label="卖方会员" sortable="custom" show-overflow-tooltip v-if="filter.salerMemberName" key="salerMemberName">
      </el-table-column>
      <el-table-column prop="approvalNumber" min-width="130" label="批准文号" sortable="custom" show-overflow-tooltip v-if="filter.approvalNumber" key="approvalNumber">
      </el-table-column>
      <el-table-column prop="drugsReportFile" min-width="80" label="药检报告" sortable="custom" show-overflow-tooltip v-if="filter.drugsReportFile" key="drugsReportFile">
        <template scope="scope">
          <YuploadFiles :data="convert.getJSON(scope.row.drugsReportFile)"></YuploadFiles>
        </template>
      </el-table-column>
      <el-table-column prop="makeDate" min-width="100" height="20px" label="生产日期" sortable="custom" show-overflow-tooltip v-if="filter.makeDate" key="makeDate">
        <template scope="scope">
          <p>{{scope.row.makeDate?convertDate(scope.row.makeDate):''}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="validDate" min-width="100" height="20px" label="有效日期" sortable="custom" show-overflow-tooltip v-if="filter.validDate" key="validDate">
        <template scope="scope">
          <p>{{scope.row.validDate?convertDate(scope.row.validDate):''}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="barcode" min-width="120" label="条码号" sortable="custom" show-overflow-tooltip v-if="filter.barcode" key="barcode">
      </el-table-column>
      <el-table-column prop="invoiceNumber" min-width="80" label="发票号" show-overflow-tooltip align="center" v-if="filter.invoiceNumber" key="invoiceNumber">
        <template scope="scope">
          <el-button type="text" size="small" @click="dataCreat(scope.row.deliverItemNo)">
            <!--<i class="icon iconfont icon-chakan" style="font-size: 12px"></i>查看-->
            查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="ordersCode" min-width="135" label="订单编号" sortable="custom" show-overflow-tooltip v-if="filter.ordersCode" key="ordersCode">
      </el-table-column>
      <el-table-column prop="contractCode" min-width="120" height="20px" label="合同编号" sortable="custom" show-overflow-tooltip v-if="filter.contractCode" key="contractCode">
      </el-table-column>
      <el-table-column prop="contractItemNo" min-width="135" height="20px" label="合同明细编号" sortable="custom" show-overflow-tooltip v-if="filter.contractItemNo" key="contractItemNo">
      </el-table-column>
      <el-table-column prop="noOut" min-width="120" height="20px" label="外部配送单号" sortable="custom" show-overflow-tooltip v-if="filter.noOut" key="noOut">
      </el-table-column>
      <el-table-column prop="createBy" min-width="80" height="20px" label="创建人" sortable="custom" show-overflow-tooltip v-if="filter.createBy" key="createBy">
      </el-table-column>
      <el-table-column prop="sendTime" min-width="140" height="20px" label="发货日期" sortable="custom" show-overflow-tooltip v-if="filter.sendTime" key="sendTime">
      </el-table-column>
      <el-table-column prop="createTime" min-width="140" height="20px" label="订单创建日期" sortable="custom" show-overflow-tooltip v-if="filter.createTime" key="createTime">
      </el-table-column>
      <el-table-column prop="confirmTime" min-width="160" height="20px" label="订单确认日期" sortable="custom" show-overflow-tooltip v-if="filter.confirmTime" key="confirmTime">
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <div style="float: left;padding-right: 15px;padding-left: 63%">
        <span>总配送数量：</span>{{totalNumber ? totalNumber : 0}} </div>
      <div style="float: left">
        <span style="">总发货金额：</span>{{totalAmount ? totalAmount.toFixed(2) : 0}}
        <span>元</span>
      </div>
    </div>
    <InvoiceNumberTable :options="dialogOptions" @dialog-hide="dialogHide"></InvoiceNumberTable>
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
import DeliverBillItem from '../../../api/Deliverbill/DeliverBillItem';        //  订单结案单申请api
import InvoiceNumberTable from './InvoiceNumberTable';       // 引入发票明细弹出框

export default {
  components: {
    InvoiceNumberTable,
  },
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
      if (this.$route.path === '/Deliverbill/DeliverBillItem') {
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
        deliverCode: {},
        barcode: {},
        ordersCode: {},
        contractCode: {},
        drugsCode: {},
        drugsName: {},
        hospitalMemberName: {},
        producerName: {},
        salerMemberName: {},
        ifInvoice: {},
        deliveryMemberName: {},
        noOut: {},
        formName: {},
        specName: {},
        batchNo: {},
        number: {},
        sendTime: {
          value: [
            this.convertDate(new Date().setTime(new Date().getTime() - (3600 * 1000 * 24 * 30))),
            this.convertDate(new Date()),
          ],
        },
        confirmTime: {},
      },
      dialogOptions: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: [],                //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
        ItemNo: '',
      },
      page: 0,
      size: 20,
      total: 0,
    };
  },
  methods: {
    // 导出数据
    exportData() {
      const url = DeliverBillItem.output(this.formInline, this.getGpoId);
      window.open(url);
    },
    // 查看发票号
    dataCreat(ItemNo) {
      this.dialogOptions.isShowDialog = true;
      this.dialogOptions.ItemNo = ItemNo;
    },
    // 关闭弹出框
    dialogHide() {
      this.dialogOptions.isShowDialog = false;
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
      let sendTime = '';
      if (form.sendTime.value && typeof form.sendTime.value === 'object') {
        sendTime = `${form.sendTime.value[0].replace(/\//g, '-')} - ${form.sendTime.value[1].replace(/\//g, '-')}`;
      } else {
        sendTime = form.sendTime.value;
      }
      if (sendTime === '1970-01-01 - 1970-01-01') {
        form.sendTime.value = '';
      } else {
        form.sendTime.value = sendTime;
      }
      form.gpoMemberId = this.getGpoId;
      DeliverBillItem.list(cpage, cpageSizes, form).then((res) => {
        if (res.data.code === 0) {
          this.tableNum = [];
          this.tableCount = 0;
          const data = res.data.result[1];
          this.totalAmount = res.data.result[0][0].totalAmount;
          this.totalNumber = res.data.result[0][0].totalNumber;
          for (let i = 0; i < data.content.length; i += 1) {
            const numX = (i + 1) + (cpage * cpageSizes);
            data.content[i].num = numX;
            data.content[i].amount = Number(data.content[i].amount);
            data.content[i].hospitalUnitPrice = Number(data.content[i].hospitalUnitPrice);
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
