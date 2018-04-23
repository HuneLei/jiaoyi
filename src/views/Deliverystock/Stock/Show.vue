<template>
  <div>
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column prop="num" align="left" fixed="left" label="#" width="40" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="drugsCode" label="药品编码" sortable="custom" show-overflow-tooltip width="90">
      </el-table-column>
      <el-table-column align="left" prop="drugsName" label="通用名" sortable="custom" show-overflow-tooltip width="120">
      </el-table-column>
      <el-table-column align="left" prop="formName" label="剂型" sortable="custom" show-overflow-tooltip width="90">
      </el-table-column>
      <el-table-column align="left" prop="specName" label="规格" sortable="custom" show-overflow-tooltip min-width="90">
      </el-table-column>
      <el-table-column align="left" prop="packSpecName" label="包装规格" sortable="custom" show-overflow-tooltip min-width="90">
      </el-table-column>
      <el-table-column align="left" prop="unitName" sortable="custom" show-overflow-tooltip label="单位" min-width="60">
      </el-table-column>
      <el-table-column align="right" prop="startNum" sortable="custom" show-overflow-tooltip label="期初数量" min-width="80">
      </el-table-column>
      <el-table-column align="left" prop="purchasedNum" sortable="custom" show-overflow-tooltip label="采入数量" min-width="80">
      </el-table-column>
      <el-table-column align="right" prop="purchaseOutNum" sortable="custom" show-overflow-tooltip label="采退数量" min-width="80">
      </el-table-column>
      <el-table-column align="left" prop="calculateNum" sortable="custom" show-overflow-tooltip label="计算库存数量" min-width="80">
      </el-table-column>
      <el-table-column align="right" prop="reportNum" sortable="custom" show-overflow-tooltip label="上报数量" min-width="80">
      </el-table-column>
      <el-table-column align="left" prop="differentNum" sortable="custom" show-overflow-tooltip label="差异数量" min-width="80">
      </el-table-column>
      <el-table-column align="right" prop="saledNum" sortable="custom" show-overflow-tooltip label="销售数量" min-width="80">
      </el-table-column>
      <el-table-column align="right" prop="saleBackNum" sortable="custom" show-overflow-tooltip label="销退数量" min-width="80">
      </el-table-column>
      <el-table-column align="left" prop="batchNo" sortable="custom" show-overflow-tooltip label="批号" min-width="130">
      </el-table-column>
      <el-table-column align="left" prop="producerName" label="生产企业" sortable="custom" show-overflow-tooltip min-width="180">
      </el-table-column>
      <el-table-column align="left" prop="deliveryMemberName" label="配送企业" sortable="custom" show-overflow-tooltip min-width="180">
      </el-table-column>
      <el-table-column align="left" prop="tradeName" label="商品名" sortable="custom" show-overflow-tooltip min-width="80">
      </el-table-column>
      <el-table-column align="left" prop="approvalNumber" label="批准文号" sortable="custom" show-overflow-tooltip min-width="120">
      </el-table-column>
      <el-table-column align="left" prop="salerMemberName" label="卖方会员" sortable="custom" show-overflow-tooltip min-width="180">
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <div style="float: left;padding-right: 15px;padding-left: 63%">
        <span>总期初数：</span>{{ totostartNum }}</div>
      <div style="float: left;padding-right: 15px;">
        <span>总计算库存数：</span>{{ totocalculateNum }}</div>
      <div style="float: left;padding-right: 15px;">
        <span>总上报数：</span>{{ totoreportNum }}</div>
      <div style="float: left;">
        <span>总差异数：</span>{{ totodifferentNum }}</div>
    </div>
  </div>
</template>

<script>
/**
 * Created by lqy on 2017/9/21.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import convert from '../../../utils/convert';
import Stock from '../../../api/Deliverystock/Stock';

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    this.$bus.$on('table/height', this.tableHeightRun);               //  监听查询按钮的查看更多点击事件，重新计算表格高度
    // 监听页码切换
    this.$bus.$on('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$on('data/list', this.dataList);
    // 监听删除
    this.$bus.$on('components/Find', this.dataSearch);
    // 导出数据
    this.$bus.$on('export/data', this.exportData);
    const endTime = this.convertDate(new Date());
    const startTime = `${this.convertDate(new Date()).slice(0,
      this.convertDate(new Date()).length - 2)}01`;
    this.filterForm.dateRangeStr = `${startTime} - ${endTime}`;
    if (this.getGpoId) {
      this.dataList();
    }
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun);
    // 监听页码切换
    this.$bus.$off('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$off('data/list', this.dataList);
    // 监听删除
    this.$bus.$off('components/Find', this.dataSearch);
    // 导出数据
    this.$bus.$off('export/data', this.exportData);
  },
  watch: {
    getGpoId() {
      this.dataList();
    },
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  computed: mapGetters([
    'getGpoId',
  ]),
  data() {
    return {
      totocalculateNum: null,
      totodifferentNum: null,
      totoreportNum: null,
      totostartNum: null,
      tableHeight: 650,
      tableData: [],       // 表单的值
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      page: 0,
      size: 20,
      // 筛选的字段
      filterForm: {
        gpoMemberId: null,                     // gpo会员id
        drugsCode: null,                       // 药品编码
        drugsName: null,                       // 通用名
        producerName: null,                    // 生产企业名称
        deliveryMemberName: null,              // 配送企业会员名称
        dateRangeStr: null,                    // 查询日期
      },
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
    // 数据查询条件获取
    dataSearch(data) {
      let beginTimeValue;  // 开始时间
      let endTimeValue;    // 结束时间
      let dateRangeStr;      // 时间范围
      // 将开始时间和结束时间拆分开
      if (data.startTime.value !== undefined && data.endTime.value !== undefined) {
        beginTimeValue = data.startTime.value;
        endTimeValue = data.endTime.value;
        if (beginTimeValue === '1970-01-01' && endTimeValue === '1970-01-01') {
          dateRangeStr = null;
        } else {
          dateRangeStr = `${beginTimeValue} - ${endTimeValue}`;
        }
      }
      this.filterForm = {
        gpoMemberId: this.getGpoId,                               // gpo会员id
        drugsCode: data.drugsCode.value,                          // 药品编码
        drugsName: data.drugsName.value,                          // 通用名
        producerName: data.producerName.value,                    // 生产企业名称
        deliveryMemberName: data.deliveryMemberName.value,        // 配送企业会员名称
        dateRangeStr,                                             // 查询日期
      };
      this.dataList(this.page, this.size);
    },
    // 获取数据列表
    dataList(page, pageSizes) {
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      this.filterForm.gpoMemberId = this.getGpoId;                    // 获取默认GPO会员Id
      Stock.itemList(cpage, cpageSizes, this.filterForm).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result[1];
          this.tableData = [];
          this.tableNum = [];
          this.tableCount = 0;
          for (let i = 0; i < data.content.length; i += 1) {
            const numX = (i + 1) + (data.number * data.size);
            data.content[i].num = numX;
            data.content[i].id = i;
          }
          this.totocalculateNum = res.data.result[0].totocalculateNum;
          this.totodifferentNum = res.data.result[0].totodifferentNum;
          this.totoreportNum = res.data.result[0].totoreportNum;
          this.totostartNum = res.data.result[0].totostartNum;
          this.tableData = data.content;
          this.tableDataOld = data.content;
          this.page = data.number;
          this.size = data.size;
          this.$emit('page', data.number + 1, data.size, data.totalElements);
        }
        this.loading = false;
      });
    },
    // 导出数据
    exportData() {
      // // console.log();
    },
    // 页码切换
    pageChange(page) {
      this.dataList(page);
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
