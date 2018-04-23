<template>
  <div>
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange" @selection-change="dataSelect">
      <el-table-column type="selection" width="40" align="left" show-overflow-tooltip fixed="left">
      </el-table-column>
      <el-table-column prop="num" fixed="left" label="#" width="40">
      </el-table-column>
      <el-table-column prop="code" label="发票代码" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="number" label="发票号" align="left" min-width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="invoiceType" label="发票类型" align="left" min-width="95" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span v-if="scope.row.invoiceType === 1">普通发票</span>
          <span v-if="scope.row.invoiceType === 0">冲红发票</span>
          <span v-if="scope.row.invoiceType === 2">冲红发票(拒收)</span>
        </template>
      </el-table-column>
      <el-table-column prop="invoiceStatus" label="发票状态" align="left" min-width="105" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span class="order-green" v-if="scope.row.invoiceStatus === 0">待提交</span>
          <span class="order-blue" v-if="scope.row.invoiceStatus === 1">已确认</span>
          <span class="order-red" v-if="scope.row.invoiceStatus === 2">已作废(配送企业)</span>
          <span class="order-red" v-if="scope.row.invoiceStatus === 4">已作废(医疗机构)</span>
          <span class="order-green" v-if="scope.row.invoiceStatus === 3">待确认</span>
        </template>
      </el-table-column>
      <el-table-column prop="drugsCode" label="药品编码" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="drugsName" label="通用名" align="left" min-width="120" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="tradeName" label="商品名" align="left" min-width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="formName" label="剂型" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="specName" label="规格" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="packSpecName" label="包装规格" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="unitName" label="单位" align="left" min-width="60" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="batchNo" label="批号" align="left" min-width="120" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="drugsNum" label="数量" align="right" min-width="70" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="hospitalUnitPrice" label="含税单价" align="right" min-width="90" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <p>{{scope.row.hospitalUnitPrice.toFixed(2)}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="taxaMount" label="含税金额" align="right" min-width="90" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <p>{{scope.row.taxaMount.toFixed(2)}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="noUnitPrice" label="不含税单价" align="right" min-width="100" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <p>{{scope.row.noUnitPrice.toFixed(2)}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="noTaxAmount" label="不含税金额" align="right" min-width="100" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <p>{{scope.row.noTaxAmount.toFixed(2)}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="taxesRate" label="税率" align="right" min-width="60" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="orderFile" label="随货同行单" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <YuploadFiles :data="convert.getJSON(scope.row.orderFile)"></YuploadFiles>
        </template>
      </el-table-column>
      <el-table-column prop="hospitalMemberName" label="医疗机构" align="left" min-width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliveryMemberName" label="配送企业" align="left" min-width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="producerName" label="生产企业" align="left" min-width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="salerMemberName" label="卖方会员" align="left" min-width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="approvalNumber" label="批准文号" align="left" min-width="130" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="ordersCode" label="订单编号" align="left" min-width="120" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliverCode" label="配送单号" align="left" min-width="120" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <!--<el-table-column prop="stockinCode" label="入库单编号" align="left" min-width="120" sortable="custom" show-overflow-tooltip>
        </el-table-column>-->
      <el-table-column prop="returnCode" label="退货单编号" align="left" min-width="120" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="noOut" label="外部发票编号" align="left" min-width="135" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="invoiceBy" label="开票人" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="invoiceDate" label="开票日期" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="ifSubmit" label="确认勾稽" align="left" fixed="right" min-width="80" class-name="table_right">
        <template scope="scope">
          <span v-if="scope.row.ifSubmit===0" class="order-green">未确认</span>
          <span v-if="scope.row.ifSubmit===1" class="order-blue">已确认</span>
        </template>
      </el-table-column>
      <el-table-column prop="numType" label="上游发票" align="left" fixed="right" min-width="80" class-name="table_right">
        <template scope="scope">
          <span v-if="scope.row.numType===1" class="order-red">未勾稽</span>
          <span v-if="scope.row.numType===2" class="order-green">部分勾稽</span>
          <span v-if="scope.row.numType===3" class="order-blue">已勾稽</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100" fixed="right" v-if="authbtn.confirm">
        <template scope="scope">
          <el-button @click="dataInvoiceExamine(scope.row)" type="text" size="small" :disabled="Number(scope.row.ifSubmit) === 1">
            <i class="el-icon-check"></i> 勾稽
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <div style="float: left;padding-right: 15px;padding-left: 63%">
        <span>总数量：</span>{{drugsNum}}
      </div>
      <div style="float: left">
        <span style="">总含税金额：</span>{{taxaMount}}
        <span>元</span>
      </div>
      <div style="float: left">
        <span style="margin-left: 10px;">总不含税金额：</span>{{noTaxAmount}}
        <span>元</span>
      </div>
    </div>
    <upInvoice></upInvoice>
  </div>
</template>

<script>
/**
 * Created by wuqian on 2017/6/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import convert from '../../../utils/convert'; // 引入js公共方法
import upInvoice from './UpInvoice';  // 勾稽弹框
import InvoiceItem from '../../../api/Invoice/InvoiceItem';

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    this.$bus.$on('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$on('page/change', this.pageChange);
    this.$bus.$on('data/list', this.dataList);
    this.$bus.$on('components/Find', this.dataSearch);
    this.$bus.$on('export/data', this.dataExport); // 导出
    if (this.getGpoId) {
      this.dataList();
    }
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun);
    this.$bus.$off('page/change', this.pageChange);
    this.$bus.$off('data/list', this.dataList);
    this.$bus.$off('components/Find', this.dataSearch);
    this.$bus.$off('export/data', this.dataExport); // 导出
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  components: {
    upInvoice,
  },
  watch: {
    getGpoId() {
      if (this.$route.path === '/Invoice/InvoiceItem') {
        this.dataList();
      }
    },
  },
  computed: mapGetters([
    'getGpoId',
    'getProjectId',
  ]),
  data() {
    return {
      tableHeight: 650,
      tableData: [],
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      filterForm: {
        gpoMemberId: null,
        number: null,
        // stockinCode: null,
        producerName: null,
        invoiceType: null,
        invoiceStatus: null,
        ordersCode: null,
        returnCode: null,
        drugsCode: null,
        salerMemberName: null,
        batchNo: null,
        hospitalMemberName: null,
        drugsName: null,
        invoiceDate: `${this.convertDate(new Date().setTime(new Date().getTime() - (3600 * 1000 * 24 * 30)))} - ${this.convertDate(new Date())}`,
        deliverCode: null,
        deliveryMemberName: null,
        code: null,
      },
      page: 0,
      size: 20,
      drugsNum: 0,
      taxaMount: 0.00,
      noTaxAmount: 0.00,
    };
  },
  methods: {
    // 选择触发事件，根据状态判断右下角btn是否禁用
    dataSelect(row) {
      let submitOne = true;
      const ids = [];
      for (let i = 0; i < row.length; i += 1) {
        const status = Number(row[i].numType);
        const ifSubmit = Number(row[i].ifSubmit);
        if (status === 3 && ifSubmit === 0) {
          submitOne = false;
          break;
        }
      }
      for (let i = 0; i < row.length; i += 1) {
        ids.push(row[i].deliverinvoiceItemId);
      }
      this.$emit('table-select', ids);
      const first = 0;
      if (first > 0) {
        submitOne = false;
      }
      const btn = { planSubmit: submitOne };
      this.$bus.$emit('data/select', row, btn);
    },
    dataInvoiceExamine(row) {
      this.$bus.$emit('data/upInvoice', row);
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
    // 查询条件获取
    dataSearch(datas) {
      const data = datas;
      let invoiceDate = '';
      if (data.invoiceDate.value && typeof data.invoiceDate.value === 'object') {
        invoiceDate = `${data.invoiceDate.value[0].replace(/\//g, '-')} - ${data.invoiceDate.value[1].replace(/\//g, '-')}`;
      } else {
        invoiceDate = data.invoiceDate.value;
      }
      if (invoiceDate === '1970-01-01 - 1970-01-01') {
        data.invoiceDate.value = null;
      } else {
        data.invoiceDate.value = invoiceDate;
      }
      this.filterForm = {
        gpoMemberId: this.getGpoId,
        number: data.number.value,
        // stockinCode: data.stockinCode.value,
        producerName: data.producerName.value,
        invoiceType: data.invoiceType.value,
        invoiceStatus: data.invoiceStatus.value,
        ordersCode: data.ordersCode.value,
        returnCode: data.returnCode.value,
        drugsCode: data.drugsCode.value,
        salerMemberName: data.salerMemberName.value,
        batchNo: data.batchNo.value,
        hospitalMemberName: data.hospitalMemberName.value,
        drugsName: data.drugsName.value,
        invoiceDate: data.invoiceDate.value,
        deliverCode: data.deliverCode.value,
        deliveryMemberName: data.deliveryMemberName.value,
        code: data.code.value,
      };
      this.dataList(0, this.size, this.filterForm);
    },
    // 获取数据列表
    dataList(page, size, filterForm) {
      if (!this.getGpoId) {
        return false;
      }
      this.loading = true;
      this.filterForm.gpoMemberId = this.getGpoId;          // 默认的GPOID
      if (page !== undefined) this.page = page;
      if (size !== undefined) this.size = size;
      InvoiceItem.list(page || this.page, size || this.size, this.filterForm)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.tableNum = [];
            this.tableCount = 0;
            for (let i = 0; i < data.content.length; i += 1) {
              const numX = (i + 1) + (data.number * data.size);
              data.content[i].num = numX;
              this.tableNum.push(numX);
              data.content[i].hospitalUnitPrice = Number(data.content[i].hospitalUnitPrice);
              data.content[i].taxaMount = Number(data.content[i].taxaMount);
              data.content[i].noUnitPrice = Number(data.content[i].noUnitPrice);
              data.content[i].noTaxAmount = Number(data.content[i].noTaxAmount);
            }
            InvoiceItem.listNum(page || this.page, size || this.size, this.filterForm)
              .then((res1) => {
                if (res.data.code === 0) {
                  const data1 = res1.data.result.content[0];
                  if (data1.drugsNum === null) {
                    this.drugsNum = 0;
                  } else {
                    this.drugsNum = data1.drugsNum;
                  }
                  if (data1.taxaMount === null) {
                    this.taxaMount = 0.00;
                  } else {
                    this.taxaMount = data1.taxaMount;
                  }
                  if (data1.noTaxAmount === null) {
                    this.noTaxAmount = 0.00;
                  } else {
                    this.noTaxAmount = data1.noTaxAmount;
                  }
                }
              });
            this.tableData = data.content;
            this.tableDataOld = data.content;
            this.$emit('page', data.number + 1, data.size, data.totalElements);
          }
          this.loading = false;
        });
      return true;
    },
    // 导出
    dataExport() {
      const form = {
        gpoMemberId: this.filterForm.gpoMemberId,
      };
      if (this.filterForm.number !== 'undefined' && this.filterForm.number) {
        form.number = this.filterForm.number;
      }
      if (this.filterForm.stockinCode !== 'undefined' && this.filterForm.stockinCode) {
        form.stockinCode = this.filterForm.stockinCode;
      }
      if (this.filterForm.producerName !== 'undefined' && this.filterForm.producerName) {
        form.producerName = this.filterForm.producerName;
      }
      if (this.filterForm.invoiceType !== 'undefined' && this.filterForm.invoiceType) {
        form.invoiceType = this.filterForm.invoiceType;
      }
      if (this.filterForm.ordersCode !== 'undefined' && this.filterForm.ordersCode) {
        form.ordersCode = this.filterForm.ordersCode;
      }
      if (this.filterForm.returnCode !== 'undefined' && this.filterForm.returnCode) {
        form.returnCode = this.filterForm.returnCode;
      }
      if (this.filterForm.drugsCode !== 'undefined' && this.filterForm.drugsCode) {
        form.drugsCode = this.filterForm.drugsCode;
      }
      if (this.filterForm.salerMemberName !== 'undefined' && this.filterForm.salerMemberName) {
        form.salerMemberName = this.filterForm.salerMemberName;
      }
      if (this.filterForm.batchNo !== 'undefined' && this.filterForm.batchNo) {
        form.batchNo = this.filterForm.batchNo;
      }
      if (this.filterForm.hospitalMemberName !== 'undefined' && this.filterForm.hospitalMemberName) {
        form.hospitalMemberName = this.filterForm.hospitalMemberName;
      }
      if (this.filterForm.drugsName !== 'undefined' && this.filterForm.drugsName) {
        form.drugsName = this.filterForm.drugsName;
      }
      if (this.filterForm.invoiceDate !== 'undefined' && this.filterForm.invoiceDate) {
        form.invoiceDate = this.filterForm.invoiceDate;
      }
      if (this.filterForm.deliverCode !== 'undefined' && this.filterForm.deliverCode) {
        form.deliverCode = this.filterForm.deliverCode;
      }
      if (this.filterForm.deliveryMemberName !== 'undefined' && this.filterForm.deliveryMemberName) {
        form.deliveryMemberName = this.filterForm.deliveryMemberName;
      }
      if (this.filterForm.code !== 'undefined' && this.filterForm.code) {
        form.code = this.filterForm.code;
      }
      if (this.filterForm.invoiceStatus !== 'undefined' && this.filterForm.invoiceStatus) {
        form.invoiceStatus = this.filterForm.invoiceStatus;
      }
      if (this.filterForm.invoiceStatus === 0) {
        form.invoiceStatus = this.filterForm.invoiceStatus;
      }
      const url = InvoiceItem.output(form);
      window.open(url);
    },
    // 页码切换
    pageChange(page) {
      this.dataList(page, this.size);
    },
    //  计算表格高度
    tableHeightRun() {
      const tableHeightFun = () => {
        this.tableHeight = window.tableCustom.tableHeight(['.find', '.paging', 145]);
      };
      setTimeout(tableHeightFun, 0);
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
  },
};
</script>

