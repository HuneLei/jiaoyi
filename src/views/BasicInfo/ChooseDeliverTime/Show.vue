<template>
  <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
    <el-table-column prop="num" align="left" fixed="left" label="#" width="40" class-name="table_right_fixed">
    </el-table-column>
    <el-table-column prop="projectName" label="集采项目" align="left" sortable="custom" width="160" show-overflow-tooltip>
    </el-table-column>
    <el-table-column label="卖方选配送时间" align="left" sortable="custom" min-width="300" show-overflow-tooltip>
      <template scope="scope">
        {{scope.row.salerBtime}} ~ {{scope.row.salerEtime}}
      </template>
    </el-table-column>
    <el-table-column label="配送确认时间" align="left" sortable="custom" min-width="300" show-overflow-tooltip>
      <template scope="scope">
        {{scope.row.deliveryBtime}} ~ {{scope.row.deliveryEtime}}
      </template>
    </el-table-column>
    <el-table-column prop="remarks" label="备注" align="left" sortable="custom" width="160"  class-name="table_right" show-overflow-tooltip>
    </el-table-column>
    <el-table-column label="操作" align="center" min-width="100" max-width="200" fixed="right" v-if="authbtn.header">
      <template scope="scope">
        <el-button type="text" @click="dataUpdate(scope.row)">
          <i class="fa fa-edit"></i> 编辑
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
/**
 * Created by lqy on 2017/9/9.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapState, mapGetters } from 'vuex';
import ChooseDeliverTime from '../../../api/BasicInfo/ChooseDeliverTime';
import convert from '../../../utils/convert';

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    // 监听页码切换
    this.$bus.$on('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$on('data/list', this.dataList);
    this.$bus.$on('data/page/do', this.dataCreate);
    this.$bus.$on('components/Find', this.dataSearch);
    this.$bus.$on('table/height', this.tableHeightRun);     //  监听查询按钮的查看更多点击事件，重新计算表格高度
    if (this.getGpoId && this.getProjectId) {
      this.filterForm.projectId = this.getProjectId;                  // 获取当前切换的集采项目号码
      this.dataList();
    }
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun);
    // 监听页码切换
    this.$bus.$off('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$off('data/list', this.dataList);
    this.$bus.$off('data/page/do', this.dataCreate);
    this.$bus.$off('components/Find', this.dataSearch);
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  watch: {
    getGpoId() {
      if (this.$route.path === '/BasicInfo/ChooseDeliverTime') {
        this.filterForm.projectId = this.getProjectId;                  // 获取当前切换的集采项目号码
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
      tableData: [],       // 表单的值
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,      // 列表加载状态
      filterForm: {
        gpoMemberId: null,        // GPO会员ID
        projectId: null,              // 集采项目名称ID，下拉，项目名称与项目id一一对应
      },
      page: 0,
      size: 20,
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
    dataCreate() {
      this.$router.push({ path: '/BasicInfo/ChooseDeliverTime/Edit' });
    },
    // 数据查询条件获取
    dataSearch(data) {
      // 筛选的字段
      this.filterForm = {
        gpoMemberId: this.getGpoId,     // GPO会员ID
        projectId: data.projectId.value,                       // 集采项目名称ID，下拉，项目名称与项目id一一对应
      };
      // 调用列表请求
      this.dataList(0, this.size, this.filterForm);
    },
    // 获取数据列表
    dataList(page, pageSizes) {
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      this.filterForm.gpoMemberId = this.getGpoId;          // 默认的GPOID
      ChooseDeliverTime.list(cpage, cpageSizes, this.filterForm)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.tableData = [];
            this.tableNum = [];
            this.tableCount = 0;
            for (let i = 0; i < data.content.length; i += 1) {
              // data.content[i].num = (i + 1) + (cpage * cpageSizes);
              const numX = (i + 1) + (data.number * data.size);
              data.content[i].num = numX;
            }
            this.tableDataOld = data.content;
            this.tableData = data.content;
            this.$emit('page', data.number + 1, data.size, data.totalElements, data.totalPages);
          }
          this.loading = false;
        });
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
    // 编辑
    dataUpdate(item) {
      this.$router.push({ path: '/BasicInfo/ChooseDeliverTime/Edit', query: { id: item.id } });
    },
  },
};
</script>
