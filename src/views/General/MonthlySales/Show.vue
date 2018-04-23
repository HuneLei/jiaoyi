<template>
  <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
    <el-table-column prop="num" align="left" fixed="left" label="#" width="40" class-name="table_right_fixed">
    </el-table-column>
    <el-table-column prop="hospitalMemberName" label="医疗机构" align="left" sortable="custom" min-width="170" show-overflow-tooltip v-if="filterForm.mechanismType === 1 || !filterForm.mechanismType">
    </el-table-column>
    <el-table-column prop="deliveryMemberName" label="配送企业" align="left" sortable="custom" min-width="170" show-overflow-tooltip v-if="filterForm.mechanismType === 2">
    </el-table-column>
    <el-table-column prop="producerName" label="生产企业" align="left" sortable="custom" min-width="170" show-overflow-tooltip v-if="filterForm.mechanismType === 3">
    </el-table-column>
    <el-table-column prop="january" label="1月" align="right" sortable="custom" min-width="100" show-overflow-tooltip>
      <template scope="scope">
        <span v-if="scope.row.january === 0"></span>
        <span v-else>{{scope.row.january.toFixed(2)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="february" label="2月" align="right" sortable="custom" min-width="100" show-overflow-tooltip>
      <template scope="scope">
        <span v-if="scope.row.february === 0"></span>
        <span v-else>{{scope.row.february.toFixed(2)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="march" label="3月" align="right" sortable="custom" min-width="100" show-overflow-tooltip>
      <template scope="scope">
        <span v-if="scope.row.march === 0"></span>
        <span v-else>{{scope.row.march.toFixed(2)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="april" label="4月" align="right" sortable="custom" min-width="100" show-overflow-tooltip>
      <template scope="scope">
        <span v-if="scope.row.april === 0"></span>
        <span v-else>{{scope.row.april.toFixed(2)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="may" label="5月" align="right" sortable="custom" min-width="100" show-overflow-tooltip>
      <template scope="scope">
        <span v-if="scope.row.may === 0"></span>
        <span v-else>{{scope.row.may.toFixed(2)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="june" label="6月" align="right" sortable="custom" min-width="100" show-overflow-tooltip>
      <template scope="scope">
        <span v-if="scope.row.june === 0"></span>
        <span v-else>{{scope.row.june.toFixed(2)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="july" label="7月" align="right" sortable="custom" min-width="100" show-overflow-tooltip>
      <template scope="scope">
        <span v-if="scope.row.july === 0"></span>
        <span v-else>{{scope.row.july.toFixed(2)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="august" label="8月" align="right" sortable="custom" min-width="100" show-overflow-tooltip>
      <template scope="scope">
        <span v-if="scope.row.august === 0"></span>
        <span v-else>{{scope.row.august.toFixed(2)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="september" label="9月" align="right" sortable="custom" min-width="100" show-overflow-tooltip>
      <template scope="scope">
        <span v-if="scope.row.september === 0"></span>
        <span v-else>{{scope.row.september.toFixed(2)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="october" label="10月" align="right" sortable="custom" min-width="100" show-overflow-tooltip>
      <template scope="scope">
        <span v-if="scope.row.october === 0"></span>
        <span v-else>{{scope.row.october.toFixed(2)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="november" label="11月" align="right" sortable="custom" min-width="100" show-overflow-tooltip>
      <template scope="scope">
        <span v-if="scope.row.november === 0"></span>
        <span v-else>{{scope.row.november.toFixed(2)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="december" label="12月" align="right" sortable="custom" class-name="table_right" min-width="100" show-overflow-tooltip>
      <template scope="scope">
        <span v-if="scope.row.december === 0"></span>
        <span v-else>{{scope.row.december.toFixed(2)}}</span>
      </template>
    </el-table-column>
    <el-table-column  prop="collect" label="年度汇总" align="right" fixed="right" sortable="custom" min-width="100" show-overflow-tooltip>
      <template scope="scope">
        <span v-if="scope.row.collect === 0"></span>
        <span v-else>{{scope.row.collect.toFixed(2)}}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
/**
 * Created by wuqian on 2017/11/11.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import MonthlySales from '../../../api/General/MonthlySales';

export default {
  activated() {
    this.$bus.$on('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$on('data/list', this.dataList);
    this.$bus.$on('components/Find', this.dataSearch);
    this.$bus.$on('export/data', this.dataExport); // 导出
    if (this.getGpoId) {
      this.dataList();
    }
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun);
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
      if (this.$route.path === '/General/MonthlySales') {
        this.dataList();
      }
    },
  },
  computed: mapGetters([
    'getGpoId',
  ]),
  data() {
    return {
      tableHeight: 650,
      tableData: [], // 表单的值
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false, // 列表加载状态
      filterForm: {
        gpoMemberId: this.getGpoId,
        mechanismType: 1,
        countType: 1,
        countYear: this.convert.convertDateOther(new Date(), 1),
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
      this.filterForm = {
        gpoMemberId: this.getGpoId,
        mechanismType: data.mechanismType.value,
        countType: data.countType.value,
        countYear: data.countYear.value,
      };
      // console.log();
      // 调用列表请求
      this.dataList(this.filterForm);
    },
    // 获取数据列表
    dataList(filterForm) {
      if (!this.getGpoId) {
        return;
      }
      this.loading = true;
      this.filterForm.gpoMemberId = this.getGpoId;          // 默认的GPOID
      MonthlySales.list(this.filterForm)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.tableData = [];
            this.tableNum = [];
            this.tableCount = 0;
            for (let i = 0; i < data.length; i += 1) {
              const numX = (i + 1);
              data[i].num = numX;
              data[i].id = numX;
              data[i].january = Number(data[i].january);
              data[i].april = Number(data[i].april);
              data[i].august = Number(data[i].august);
              data[i].december = Number(data[i].december);
              data[i].february = Number(data[i].february);
              data[i].july = Number(data[i].july);
              data[i].june = Number(data[i].june);
              data[i].march = Number(data[i].march);
              data[i].may = Number(data[i].may);
              data[i].november = Number(data[i].november);
              data[i].october = Number(data[i].october);
              data[i].september = Number(data[i].september);
              data[i].collect = Number(data[i].january + data[i].april + data[i].august +
              data[i].december + data[i].february + data[i].july + data[i].june +
              data[i].march + data[i].may + data[i].november + data[i].october + data[i].september);
            }
            this.tableDataOld = data;
            this.tableData = data;
          }
          this.loading = false;
        });
    },
    // 导出
    dataExport() {
      const form = {
        gpoMemberId: this.filterForm.gpoMemberId,
      };
      if (this.filterForm.countYear !== 'undefined' && this.filterForm.countYear) {
        form.countYear = this.filterForm.countYear;
      }
      if (this.filterForm.mechanismType !== 'undefined' && this.filterForm.mechanismType) {
        form.mechanismType = this.filterForm.mechanismType;
      }
      if (this.filterForm.countType !== 'undefined' && this.filterForm.countType) {
        form.countType = this.filterForm.countType;
      }
      const url = MonthlySales.output(form);
      window.open(url);
    },
    tableHeightRun() {
      const tableHeightFun = () => {
        this.tableHeight = window.tableCustom.tableHeight(['.find', '.paging', 135]);
      };
      setTimeout(tableHeightFun, 0);
    },
  },
  mounted() { },
};
</script>
