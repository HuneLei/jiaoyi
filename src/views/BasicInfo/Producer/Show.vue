<template>
  <div>
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column prop="num" align="left" fixed="left" label="#" width="40">
      </el-table-column>
      <el-table-column prop="enterpriseCode" label="生产企业编码" align="left" sortable="custom" min-width="160" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="enterpriseName" label="生产企业名称" align="left" sortable="custom" min-width="280" show-overflow-tooltip v-if="authbtn.item">
        <template scope="scope">
          <a href="javascript:void(0)" @click="showItem(scope.row)">{{scope.row.enterpriseName}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="enterpriseUsedName" label="曾用名/别名" min-width="280" sortable="custom" align="left" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="enterpriseType" label="企业类型" align="left" sortable="custom" min-width="80" show-overflow-tooltip>
        <template scope="scope">
          <span v-if="scope.row.enterpriseType === 1">生产企业</span>
          <span v-if="scope.row.enterpriseType === 2">经营企业</span>
        </template>
      </el-table-column>
      <el-table-column prop="provinceName" label="所在地区" align="left" sortable="custom" min-width="160" show-overflow-tooltip>
        <template scope="scope">
          <span>{{scope.row.provinceName}}{{scope.row.cityName}}{{scope.row.countyName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="projectName" label="集采项目" align="left" sortable="custom" min-width="160" show-overflow-tooltip>
      </el-table-column>
      <!--<el-table-column-->
      <!--label="仓库地址"-->
      <!--min-width="80"-->
      <!--align="center">-->
      <!--<template scope="scope">-->
      <!--<el-button type="text" @click="showAddress(scope.row)">-->
      <!--查看-->
      <!--</el-button>-->
      <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
    <showWarehouseAddress :options="dialogOptions" :row="row" @dialog-hide="dialogHide"></showWarehouseAddress>
  </div>
</template>

<script>
/**
 * Created by lqy on 2017/9/4.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapState, mapGetters } from 'vuex';
import project from '../../../api/BasicInfo/Project';     // api -- project[集采项目]
import producer from '../../../api/BasicInfo/Producer';   // api -- 医疗机构
import showWarehouseAddress from './showWarehouseAddress';  // 引入查看配送地址弹出窗

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    this.$bus.$on('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    // 监听页码切换
    this.$bus.$on('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$on('data/list', this.dataList);
    this.$bus.$on('components/Find', this.dataSearch);
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
      if (this.$route.path === '/BasicInfo/Producer') {
        this.filterForm.projectId = this.getProjectId;                  // 获取当前切换的集采项目号码
        this.dataList();
      }
    },
  },
  computed: mapGetters([
    'getGpoId',
    'getProjectId',
  ]),
  components: {
    showWarehouseAddress,
  },
  data() {
    return {
      tableData: [],       // 表单的值
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      tableHeight: 650,
      row: '',                              // 需要传入组件的列表row,需要值为ID
      dialogOptions: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: null,                //  默认表格选中
        tableType: 0,                       //  0 单选，1 多选 默认单选
      },
      loading: false,      // 列表加载状态
      filterForm: {
        gpoMemberId: null,
        projectId: null,
        provinceId: null,
        cityId: null,
        countyId: null,
        enterpriseName: null,
        enterpriseCode: null,
        enterpriseType: null,
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
      this.filterForm = {
        gpoMemberId: this.getGpoId,
        projectId: data.projectId.value,
        provinceId: data.provinceId.value,
        cityId: data.cityId.value,
        countyId: null,
        enterpriseCode: data.enterpriseCode.value,
        enterpriseName: data.enterpriseName.value,
      };

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
      this.filterForm.gpoMemberId = this.getGpoId;         // 获取GPO会员Id
      producer.list(cpage, cpageSizes, this.filterForm)
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
              // data.content[i].id = i;
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
    // 查看仓库地址 -- 弹出窗
    showAddress(row) {
      this.row = row;
      this.dialogOptions.isShowDialog = true;  // 打开弹出框
    },
    // 查看生产企业 -- 跳页
    showItem(row) {
      this.$router.push({ path: '/BasicInfo/Producer/BusinessEnterInfo', query: { id: row.id } });
    },
    // 关闭弹出框
    dialogHide() {
      this.dialogOptions.isShowDialog = false;  // 关闭弹出框
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
