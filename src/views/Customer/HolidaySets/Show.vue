<template>
  <div>
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column prop="num" fixed="left"  align="center" label="#" width="40" :formatter="sortTable">
      </el-table-column>
      <el-table-column prop="code" label="日期" align="left" min-width="120"  sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="number" label="星期" align="left" min-width="120" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="invoiceType" label="属性" align="left" min-width="120" sortable show-overflow-tooltip>
      <template scope="scope">
          <span v-if="scope.row.invoiceType === 0">节假日</span>
          <span v-if="scope.row.invoiceType === 1">工作日</span>
          <span v-if="scope.row.invoiceType === 1">公休日</span>
        </template>
      </el-table-column>
      <el-table-column prop="noOut" label="备注" align="left" min-width="120" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="salerMemberName" label="更新人" align="left" min-width="150" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="invoiceDate" label="更新时间" align="left" min-width="160" sortable show-overflow-tooltip class-name="table_right">
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100" max-width="200" fixed="right">
        <template scope="scope">
          <el-button @click="ChangeMore(scope.row)" type="text" size="small">
            <i class="icon iconfont icon-bianji"></i>切换
          </el-button>
          <el-button @click="ChangeLess(scope.row)" type="text" size="small">
            <i class="icon iconfont icon-bianji"></i>添加备注
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  /**
   * Created by dingyiming on 2017/6/2.
   * <p>
   * 江苏摇铃网络科技有限公司，版权所有。
   * Copyright (C) 2015-2017 All Rights Reserved.
   */
  import { mapActions, mapGetters } from 'vuex';
  import HolidaySets from '../../../api/Customer/HolidaySets'; // APi
  
  export default {
    activated() {
      this.$bus.$on('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
      this.$bus.$on('page/change', this.pageChange);
      this.$bus.$on('data/list', this.dataList);
      this.$bus.$on('components/Find', this.dataSearch);
      if (this.getGpoId && this.getProjectId) {
        this.dataList();
      }
    },
    deactivated() {
      this.$bus.$off('table/height', this.tableHeightRun);
      this.$bus.$off('page/change', this.pageChange);
      this.$bus.$off('data/list', this.dataList);
      this.$bus.$off('components/Find', this.dataSearch);
    },
    created() {
      this.tableHeightRun();
      window.onresize = () => {
        this.tableHeightRun();
      };
    },
    watch: {
      getProjectId() {
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
        tableData: [
          {
            id: 1,
          },
        ],
        tableCount: 0,
        tableNum: [],
        loading: false,
        filterForm: {
          gpoMemberId: null,
          number: null,
        },
        page: 0,
        size: 20,
      };
    },
    methods: {
      //  每次点击排序都会触发
      sortChange() {
        this.tableCount = 0;
      },
      //  进行排序时返回每一行
      sortTable(row, column) {
        if (this.tableCount < this.tableData.length) {
          const sortRow = window.tableCustom.tableSortNum(
            row,
            this.tableData,
            this.tableCount,
            this.tableNum,
          );
          this.tableData = sortRow.tableData;
          this.tableCount = sortRow.tableCount;
        }
        return row.num;
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
        };
        this.dataList(this.page, this.size, this.filterForm);
      },
      // 获取数据列表
      dataList(page, size, filterForm) {
//      this.loading = true;
        this.filterForm.gpoMemberId = this.getGpoId;          // 默认的GPOID
//      HolidaySets.list(page || this.page, size || this.size, this.filterForm)
//      .then((res) => {
//        if (res.data.code === 0) {
//          const data = res.data.result;
//          this.tableNum = [];
//          this.tableCount = 0;
//          for (let i = 0; i < data.content.length; i += 1) {
//            data.content[i].id = data.content[i].itemId;
//            const numX = (i + 1) + (data.number * data.size);
//            data.content[i].num = numX;
//            this.tableNum.push(numX);
//          }
//          this.tableData = data.content;
//          this.$emit('page', data.number + 1, data.size, data.totalElements);
//        }
//        this.loading = false;
//      });
      },
      // 页码切换
      pageChange(page) {
        this.dataList(page, this.size);
      },
      //  计算表格高度
      tableHeightRun() {
        const tableHeightFun = () => {
          this.tableHeight = window.tableCustom.tableHeight(['.find', '.paging', 135]);
        };
        setTimeout(tableHeightFun, 0);
      },
    },
  };
</script>

