<template>
  <div>
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column prop="num" fixed="left" label="#" width="40">
      </el-table-column>
      <el-table-column key="stockoutCode" prop="stockoutCode" label="出库单号" align="left" min-width="120" sortable="custom" show-overflow-tooltip v-if="filter.stockoutCode">
      </el-table-column>
      <el-table-column key="purchaseCode" prop="purchaseCode" label="采购单编号" align="left" min-width="120" sortable="custom" show-overflow-tooltip v-if="filter.purchaseCode">
      </el-table-column>
      <el-table-column key="drugsCode" prop="drugsCode" label="药品编码" align="left" min-width="90" sortable="custom" show-overflow-tooltip v-if="filter.drugsCode">
      </el-table-column>
      <el-table-column key="drugsName" prop="drugsName" label="通用名" align="left" min-width="120" sortable="custom" show-overflow-tooltip v-if="filter.drugsName">
      </el-table-column>
      <el-table-column key="formName" prop="formName" label="剂型" align="left" min-width="90" sortable="custom" show-overflow-tooltip v-if="filter.formName">
      </el-table-column>
      <el-table-column key="specName" prop="specName" label="规格" align="left" min-width="90" sortable="custom" show-overflow-tooltip v-if="filter.specName">
      </el-table-column>
      <el-table-column key="packSpecName" prop="packSpecName" label="包装规格" align="left" min-width="90" sortable="custom" show-overflow-tooltip v-if="filter.packSpecName">
      </el-table-column>
      <el-table-column key="unitName" prop="unitName" label="单位" align="left" min-width="60" sortable="custom" show-overflow-tooltip v-if="filter.unitName">
      </el-table-column>
      <el-table-column key="batchNo" prop="batchNo" label="批号" align="left" min-width="120" sortable="custom" show-overflow-tooltip v-if="filter.batchNo">
      </el-table-column>
      <el-table-column key="minUnitPrice" prop="minUnitPrice" label="单价" align="right" min-width="70" sortable show-overflow-tooltip v-if="filter.minUnitPrice">
        <template scope="scope">
          <span>{{scope.row.minUnitPrice.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column key="stockoutNum" prop="stockoutNum" label="数量" align="right" min-width="70" sortable="custom" show-overflow-tooltip v-if="filter.stockoutNum">
      </el-table-column>
      <el-table-column key="amount" prop="amount" label="金额" align="right" min-width="90" sortable show-overflow-tooltip v-if="filter.amount">
        <template scope="scope">
          <span>{{scope.row.amount.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="count" label="件数" align="right" min-width="70" sortable="custom">
            </el-table-column>-->
      <el-table-column key="producerName" prop="producerName" label="生产企业" align="left" min-width="180" sortable="custom" show-overflow-tooltip v-if="filter.producerName">
      </el-table-column>
      <el-table-column key="enrollName" prop="enrollName" label="卖方会员" align="left" min-width="180" sortable="custom" show-overflow-tooltip v-if="filter.enrollName">
      </el-table-column>
      <el-table-column key="deliveryMemberName" prop="deliveryMemberName" label="配送企业" align="left" min-width="180" sortable="custom" show-overflow-tooltip v-if="filter.deliveryMemberName">
      </el-table-column>
      <el-table-column key="approvalNumber" prop="approvalNumber" label="批准文号" align="left" min-width="130" sortable="custom" show-overflow-tooltip v-if="filter.approvalNumber">
      </el-table-column>
      <el-table-column key="tradeName" prop="tradeName" label="商品名" align="left" min-width="80" sortable="custom" show-overflow-tooltip v-if="filter.tradeName">
      </el-table-column>
      <el-table-column key="stockoutItemNo" prop="stockoutItemNo" label="出库单明细号" align="left" min-width="135" sortable="custom" show-overflow-tooltip v-if="filter.stockoutItemNo">
      </el-table-column>
      <el-table-column key="purchaseItemNo" prop="purchaseItemNo" label="采购单明细编号" align="left" min-width="135" sortable="custom" show-overflow-tooltip v-if="filter.purchaseItemNo">
      </el-table-column>
      <el-table-column key="maker" prop="maker" label="制单人" align="left" min-width="100" sortable="custom" show-overflow-tooltip v-if="filter.maker">
      </el-table-column>
      <el-table-column key="addressFull" prop="addressFull" label="配送地址" align="left" min-width="280" sortable="custom" show-overflow-tooltip v-if="filter.addressFull">
      </el-table-column>
      <el-table-column key="stockoutType" prop="stockoutType" label="出库类型" align="left" min-width="80" sortable="custom" show-overflow-tooltip v-if="filter.stockoutType">
        <template scope="scope">
          <span v-if="scope.row.stockoutType==='0'">销售</span>
          <span v-else>销退</span>
        </template>
      </el-table-column>
      <el-table-column key="stockoutDate" prop="stockoutDate" label="出库时间" align="left" min-width="160" sortable="custom" show-overflow-tooltip v-if="filter.stockoutDate">
      </el-table-column>
      <el-table-column key="code" prop="code" label="外部GPO出库单号" align="left" min-width="140" sortable="custom" show-overflow-tooltip v-if="filter.code">
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <div style="float: left;padding-right: 15px;padding-left: 63%">
        <span>总数量：</span>{{gatherNum}}
      </div>
      <div style="float: left">
        <span style="">总金额：</span>{{gatherAmount}}
        <span>元</span>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Created by wuqian on 2017/9/20.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import convert from '../../../utils/convert'; // 引入js公共方法
import GpoStockoutItem from '../../../api/Gpostockout/GpoStockoutItem';

export default {
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
  watch: {
    getGpoId() {
      if (this.$route.path === '/Gpostockout/GpoStockoutItem') {
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
      tableCount: 0,
      tableNum: [],
      loading: false,
      filterForm: {
        gpoMemberId: null,
        purchaseCode: null,
        stockoutCode: null,
        drugsCode: null,
        drugsName: null,
        tradeName: null,
        formName: null,
        specName: null,
        approvalNumber: null,
        deliveryMemberName: null,
        producerName: null,
        enrollName: null,
        stockoutType: null,
        stockoutDate: `${this.convertDate(new Date().setTime(new Date().getTime() - (3600 * 1000 * 24 * 30)))} - ${this.convertDate(new Date())}`,
      },
      page: 0,
      size: 20,
      gatherNum: 0,
      gatherAmount: 0,
    };
  },
  methods: {
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
      let stockoutDate = '';
      if (data.stockoutDate.value && typeof data.stockoutDate.value === 'object') {
        stockoutDate = `${data.stockoutDate.value[0].replace(/\//g, '-')} - ${data.stockoutDate.value[1].replace(/\//g, '-')}`;
      } else {
        stockoutDate = data.stockoutDate.value;
      }
      if (stockoutDate === '1970-01-01 - 1970-01-01') {
        data.stockoutDate.value = null;
      } else {
        data.stockoutDate.value = stockoutDate;
      }
      this.filterForm = {
        gpoMemberId: this.getGpoId,
        purchaseCode: data.purchaseCode.value,
        stockoutCode: data.stockoutCode.value,
        drugsCode: data.drugsCode.value,
        drugsName: data.drugsName.value,
        tradeName: data.tradeName.value,
        formName: data.formName.value,
        specName: data.specName.value,
        approvalNumber: data.approvalNumber.value,
        deliveryMemberName: data.deliveryMemberName.value,
        producerName: data.producerName.value,
        enrollName: data.enrollName.value,
        stockoutType: data.stockoutType.value,
        stockoutDate: data.stockoutDate.value,
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
      GpoStockoutItem.list(page || this.page, size || this.size, this.filterForm)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result.resultList;
            this.tableNum = [];
            this.tableCount = 0;
            for (let i = 0; i < data.content.length; i += 1) {
              const numX = (i + 1) + (data.number * data.size);
              data.content[i].num = numX;
              data.content[i].amount = Number(data.content[i].amount);
              data.content[i].minUnitPrice = Number(data.content[i].minUnitPrice);
              if (!data.content[i].addressName) {
                data.content[i].addressFull = `${data.content[i].addressName || ''}${data.content[i].provinceName || ''}${data.content[i].cityName || ''}${data.content[i].countyName || ''} ${data.content[i].addressFull || ''}`;
              } else {
                data.content[i].addressFull = `[${data.content[i].addressName || ''}]${data.content[i].provinceName || ''}${data.content[i].cityName || ''}${data.content[i].countyName || ''} ${data.content[i].addressFull || ''}`;
              }
            }
            this.tableData = data.content;
            this.tableDataOld = data.content;
            const dataSum = res.data.result.resultSum;
            if (dataSum[0].gatherNum === null) {
              this.gatherNum = 0;
            } else {
              this.gatherNum = dataSum[0].gatherNum;
            }
            if (dataSum[0].gatherAmount === null) {
              this.gatherAmount = 0;
            } else {
              this.gatherAmount = dataSum[0].gatherAmount;
            }
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
      if (this.filterForm.purchaseCode !== 'undefined' && this.filterForm.purchaseCode) {
        form.purchaseCode = this.filterForm.purchaseCode;
      }
      if (this.filterForm.stockoutCode !== 'undefined' && this.filterForm.stockoutCode) {
        form.stockoutCode = this.filterForm.stockoutCode;
      }
      if (this.filterForm.drugsCode !== 'undefined' && this.filterForm.drugsCode) {
        form.drugsCode = this.filterForm.drugsCode;
      }
      if (this.filterForm.drugsName !== 'undefined' && this.filterForm.drugsName) {
        form.drugsName = this.filterForm.drugsName;
      }
      if (this.filterForm.tradeName !== 'undefined' && this.filterForm.tradeName) {
        form.tradeName = this.filterForm.tradeName;
      }
      if (this.filterForm.formName !== 'undefined' && this.filterForm.formName) {
        form.formName = this.filterForm.formName;
      }
      if (this.filterForm.specName !== 'undefined' && this.filterForm.specName) {
        form.specName = this.filterForm.specName;
      }
      if (this.filterForm.deliveryMemberName !== 'undefined' && this.filterForm.deliveryMemberName) {
        form.deliveryMemberName = this.filterForm.deliveryMemberName;
      }
      if (this.filterForm.approvalNumber !== 'undefined' && this.filterForm.approvalNumber) {
        form.approvalNumber = this.filterForm.approvalNumber;
      }
      if (this.filterForm.producerName !== 'undefined' && this.filterForm.producerName) {
        form.producerName = this.filterForm.producerName;
      }
      if (this.filterForm.enrollName !== 'undefined' && this.filterForm.enrollName) {
        form.enrollName = this.filterForm.enrollName;
      }
      if (this.filterForm.stockoutType !== 'undefined' && this.filterForm.stockoutType) {
        form.stockoutType = this.filterForm.stockoutType;
      }
      if (this.filterForm.stockoutType === 0) {
        form.stockoutType = this.filterForm.stockoutType;
      }
      if (this.filterForm.stockoutDate !== 'undefined' && this.filterForm.stockoutDate) {
        form.stockoutDate = this.filterForm.stockoutDate;
      }
      const url = GpoStockoutItem.output(form);
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
  props: {
    filter: Object,
  },
};
</script>
