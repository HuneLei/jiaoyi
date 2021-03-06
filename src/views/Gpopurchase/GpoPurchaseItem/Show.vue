<template>
  <div>
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column prop="num" align="left" fixed="left" label="#" width="40" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="gpoMemberName" label="GPO名称" sortable="custom" show-overflow-tooltip width="180">
      </el-table-column>
      <el-table-column align="left" prop="code" label="GPO采购单编号" sortable="custom" show-overflow-tooltip width="120">
      </el-table-column>
      <el-table-column align="left" prop="drugsCode" label="药品编码" sortable="custom" show-overflow-tooltip width="90">
      </el-table-column>
      <el-table-column align="left" prop="drugsName" label="通用名" sortable="custom" show-overflow-tooltip width="120">
      </el-table-column>
      <el-table-column align="left" prop="formName" label="剂型" sortable="custom" show-overflow-tooltip width="90">
      </el-table-column>
      <el-table-column align="left" prop="specificationName" label="规格" sortable="custom" show-overflow-tooltip width="90">
      </el-table-column>
      <el-table-column align="left" prop="packSpecName" label="包装规格" sortable="custom" show-overflow-tooltip width="90">
      </el-table-column>
      <el-table-column align="left" prop="unitName" sortable="custom" show-overflow-tooltip label="单位" width="60">
      </el-table-column>
      <el-table-column align="right" prop="purchaseNum" sortable="custom" show-overflow-tooltip label="数量" width="60">
      </el-table-column>
      <el-table-column align="right" prop="gpoPrice" sortable="custom" show-overflow-tooltip label="单价" min-width="70">
        <template scope="scope">
          <span>{{scope.row.gpoPrice.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" prop="purchaseAmount" sortable="custom" show-overflow-tooltip label="金额" width="90">
        <template scope="scope">
          <span>{{scope.row.purchaseAmount.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="producerName" label="生产企业" sortable="custom" show-overflow-tooltip width="180">
      </el-table-column>
      <el-table-column align="left" prop="salerMemberName" label="卖方会员" sortable="custom" show-overflow-tooltip width="180">
      </el-table-column>
      <el-table-column align="left" prop="tradeName" label="商品名" sortable="custom" show-overflow-tooltip width="80">
      </el-table-column>
      <el-table-column align="left" prop="approvalNumber" label="批准文号" sortable="custom" show-overflow-tooltip width="130">
      </el-table-column>
      <el-table-column align="left" prop="itemNo" label="采购单明细编号" sortable="custom" show-overflow-tooltip width="135">
      </el-table-column>
      <el-table-column align="left" prop="createBy" label="创建人" sortable="custom" show-overflow-tooltip width="80">
      </el-table-column>
      <el-table-column align="left" prop="createTime" label="创建日期" sortable="custom" show-overflow-tooltip width="140">
      </el-table-column>
      <el-table-column align="left" prop="noOut" label="外部采购单编号" sortable="custom" show-overflow-tooltip width="120">
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <div style="float: left;padding-right: 15px;padding-left: 63%">
        <span>总数量：</span>{{ totalNumber }}</div>
      <div style="float: left;">
        <span>总金额：</span>{{ totalAmount }}
        <span>元</span>
      </div>
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
import GpoPurchaseItem from '../../../api/Gpopurchase/GpoPurchaseItem';

export default {
  activated() {
    this.$bus.$on('table/height', this.tableHeightRun);               //  监听查询按钮的查看更多点击事件，重新计算表格高度
    // 监听页码切换
    this.$bus.$on('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$on('data/list', this.dataList);
    // 监听删除
    this.$bus.$on('components/Find', this.dataSearch);
    // 导出数据
    this.$bus.$on('export/data', this.dataExport);
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
    this.$bus.$off('export/data', this.dataExport);
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
    'View_UserInfor',
    'View_UserInfo',
  ]),
  data() {
    return {
      totalNumber: null,
      totalAmount: null,
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
        gpoMemberId: null,                        // gpo会员id
        code: null,                               // 采购单编码
        drugsCode: null,                          // 药品编码
        drugsName: null,                          // 通用名
        producerName: null,                       // 生产企业名称
        deliveryMemberName: null,                 // 配送企业会员名称
        salerMemberName: null,                    // 卖方会员名称
        createTime: null,                         // 创建时间
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
      let createTime;      // 时间范围
      // 将开始时间和结束时间拆分开
      if (data.createTime.value !== undefined) {
        beginTimeValue = data.createTime.value[0];
        endTimeValue = data.createTime.value[1];
        if (beginTimeValue === '1970-01-01' && endTimeValue === '1970-01-01') {
          createTime = null;
        } else {
          createTime = `${data.createTime.value[0]} - ${data.createTime.value[1]}`;
        }
      }
      this.filterForm = {
        gpoMemberId: this.getGpoId,                           // gpo会员id
        code: data.code.value,                                    // 采购单编码
        drugsCode: data.drugsCode.value,                          // 药品编码
        drugsName: data.drugsName.value,                          // 通用名
        producerName: data.producerName.value,                    // 生产企业名称
        salerMemberName: data.salerMemberName.value,              // 卖方会员名称
        createTime,                                               // 创建时间
      };
      this.dataList(0, this.size);
    },
    // 获取数据列表
    dataList(page, pageSizes) {
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      this.filterForm.gpoMemberId = this.getGpoId;                    // 获取默认GPO会员Id
      GpoPurchaseItem.list(cpage, cpageSizes, this.filterForm).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result[1];
          this.tableData = [];
          this.tableNum = [];
          this.tableCount = 0;
          for (let i = 0; i < data.content.length; i += 1) {
            const numX = (i + 1) + (data.number * data.size);
            data.content[i].num = numX;
            this.tableNum.push(numX);
            data.content[i].id = i;
            data.content[i].gpoPrice = Number(data.content[i].gpoPrice);
            data.content[i].purchaseAmount = Number(data.content[i].purchaseAmount);
          }
          // console.log();
          if (res.data.result[0][0].totalNumber && res.data.result[0][0].totalAmount) {
            this.totalNumber = res.data.result[0][0].totalNumber;
            this.totalAmount = res.data.result[0][0].totalAmount.toFixed(2);
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
    // 导出数据
    dataExport() {
      // console.log();
      // console.log();
      const form = {
        gpoMemberId: this.filterForm.gpoMemberId,
        // projectId: this.filterForm.projectId,
        // salerMemberId: this.View_UserInfor.id,
      };
      // console.log();
      const url = GpoPurchaseItem.output(form);
      window.open(url);
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
