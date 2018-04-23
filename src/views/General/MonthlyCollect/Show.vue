<template>
  <el-table :data="tableData" v-loading="loading" :height="tableHeight" show-summary stripe border fit @sort-change="sortChange" :summary-method="getSummaries">
    <!--<el-table-column prop="num" align="left" fixed="left" label="#" width="40" :formatter="sortTable" class-name="table_right_fixed">
                  </el-table-column>-->
    <el-table-column prop="monthGroup" label="月份" align="right" height="150px" sortable="custom" width="80" show-overflow-tooltip>
      <template scope="scope">
        <span>{{scope.row.monthGroup}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="orderNum" label="订单数" align="right" sortable="custom" min-width="100" show-overflow-tooltip>
      <template scope="scope">
        <span>{{scope.row.orderNum}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="orderProduceNum" label="订单品规数" align="right" sortable="custom" min-width="100" show-overflow-tooltip>
      <template scope="scope">
        <span>{{scope.row.orderProduceNum}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="purchaseAmount" label="订单金额" align="right" sortable="custom" min-width="100" class-name="table_right" show-overflow-tooltip>
      <template scope="scope">
        <span v-if="scope.row.purchaseAmount === 0"></span>
        <span v-else>{{scope.row.purchaseAmount}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="drugsAmount" label="配送单金额" align="right" fixed="right" sortable="custom" min-width="100" show-overflow-tooltip>
      <template scope="scope">
        <span v-if="scope.row.drugsAmount === 0"></span>
        <span v-else>{{scope.row.drugsAmount}}</span>
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
import MonthlyCollect from '../../../api/General/MonthlyCollect';

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
      if (this.$route.path === '/General/MonthlyCollect') {
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
        gpoMemberId: null,
        countYear: this.convert.convertDateOther(new Date(), 1),
        hospitalMemberName: null,
        deliveryMemberName: null,
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
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            }
            return true;
          }, 0);
          sums[index] += '';
          sums[3] = Number(sums[3]).toFixed(2);
          sums[4] = Number(sums[4]).toFixed(2);
          sums[2] = '';
        } else {
          sums[index] = '';
        }
      });
      return sums;
    },
    // 数据查询条件获取
    dataSearch(data) {
      this.filterForm = {
        gpoMemberId: this.getGpoId,
        countYear: data.countYear.value,
        hospitalMemberName: data.hospitalMemberName.value,
        deliveryMemberName: data.deliveryMemberName.value,
      };
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
      MonthlyCollect.list(this.filterForm)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.tableData = [];
            this.tableNum = [];
            this.tableCount = 0;
            const b = [];
            for (let j = 0; j < 12; j += 1) {
              const a = {
                monthGroup: j + 1,
                orderNum: null,
                orderProduceNum: null,
                purchaseAmount: null,
                drugsAmount: null,
              };
              b.push(a);
              for (let i = 0; i < data.length; i += 1) {
                if (Number(data[i].monthGroup) === j + 1) {
                  data[i].monthGroup = Number(data[i].monthGroup);
                  b[j] = data[i];
                }
                data[i].orderNum = Number(data[i].orderNum);
                data[i].orderProduceNum = Number(data[i].orderProduceNum);
                data[i].purchaseAmount = Number(data[i].purchaseAmount).toFixed(2);
                data[i].drugsAmount = Number(data[i].drugsAmount).toFixed(2);
              }
            }
            this.tableDataOld = b;
            this.tableData = b;
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
      if (this.filterForm.hospitalMemberName !== 'undefined' && this.filterForm.hospitalMemberName) {
        form.hospitalMemberName = this.filterForm.hospitalMemberName;
      }
      if (this.filterForm.deliveryMemberName !== 'undefined' && this.filterForm.deliveryMemberName) {
        form.deliveryMemberName = this.filterForm.deliveryMemberName;
      }
      const url = MonthlyCollect.output(form);
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


<style>
.el-table__body tr {
  height: 30px;
}
</style>
