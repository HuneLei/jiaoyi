<template>
  <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
    <el-table-column prop="num" align="left" fixed="left" label="#" width="40" class-name="table_right_fixed">
    </el-table-column>
    <el-table-column prop="projectName" label="集采项目" align="left" sortable="custom" width="160" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="pattern" label="合同有效期方式" align="left" sortable="custom" width="120" show-overflow-tooltip>
      <template scope="scope">
        <span v-if="scope.row.contractValid === 0">时间截止方式</span>
        <span v-if="scope.row.contractValid === 1">时长截止方式</span>
      </template>
    </el-table-column>
    <el-table-column prop="beginTime" label="截止时间 / 持续时长（月）" align="left" sortable="custom" min-width="160" show-overflow-tooltip>
      <template scope="scope">
        <span v-if="scope.row.contractValid === 0" v-text="scope.row.contractEtime"></span>
        <span v-if="scope.row.contractValid === 1" v-text="scope.row.validLength"></span>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" min-width="100" max-width="200" v-if="authbtn.item || authbtn.update">
      <template scope="scope">
        <el-button type="text" @click="dataUpdate(scope.row)">
          <i class="fa fa-edit"></i> 操作
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
/**
 * Created by lqy on 2017/9/4.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapState, mapGetters } from 'vuex';
import contractVaild from '../../../api/BasicInfo/ContractVaild';

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    // 监听页码切换
    this.$bus.$on('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$on('data/list', this.dataList);
    this.$bus.$on('components/Find', this.dataSearch);
    this.$bus.$on('table/height', this.tableHeightRun);     //  监听查询按钮的查看更多点击事件，重新计算表格高度
    if (this.getGpoId && this.getProjectId) {
      this.filterForm.id = this.getProjectId;                  // 获取当前切换的集采项目号码
      this.dataList();
    }
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun);
    // 监听页码切换
    this.$bus.$off('page/change', this.pageChange);
    // 监听数据更新
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
      if (this.$route.path === '/BasicInfo/ContractValid') {
        this.filterForm.id = this.getProjectId;                  // 获取当前切换的集采项目号码
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
        id: null,              // 集采项目名称ID，下拉，项目名称与项目id一一对应
        contractValid: null,         // 合同有效期方式
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
    // 数据查询条件获取
    dataSearch(data) {
      // 筛选的字段
      this.filterForm = {
        gpoMemberId: this.getGpoId,     // GPO会员ID
        id: data.id.value,                       // 集采项目名称ID，下拉，项目名称与项目id一一对应
        contractValid: data.contractValid.value,             // 采购模式
      };
      // 调用列表请求
      this.dataList(0, this.size, this.filterForm);
    },
    // 获取资源列表名称
    // 获取数据列表
    dataList(page, pageSizes) {
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      this.filterForm.gpoMemberId = this.getGpoId;          // 默认的GPOID
      contractVaild.list(cpage, cpageSizes, this.filterForm)
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
            this.page = data.number;
            this.size = data.size;
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
      this.$bus.$emit('data/update', item);
    },
  },
  mounted() {
  },
};
</script>
