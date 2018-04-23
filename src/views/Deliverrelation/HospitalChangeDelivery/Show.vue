<template>
  <div v-loading="loading">
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column prop="num" label="#" fixed="left" width="40">
      </el-table-column>
      <el-table-column align="left" prop="applicationNo" label="申请单号" sortable="custom" min-width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="projectName" label="集采项目" sortable="custom" min-width="130" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="hospitalMemberName" label="医疗机构" sortable="custom" min-width="180" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="salerStatic" sortable="custom" label="状态" min-width="80" show-overflow-tooltip>
        <template scope="scope">
          <span v-if="scope.row.salerStatic === 0" style="color: blue">待提交</span>
          <span v-if="scope.row.salerStatic === 1" style="color: green">待审核</span>
          <span v-if="scope.row.salerStatic === 2" style="color: green">审核通过</span>
          <span v-if="scope.row.salerStatic === 3" style="color: red">审核不通过</span>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="createOne" label="创建人" sortable="custom" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="createTime" label="创建日期" sortable="custom" width="140" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="submitOne" label="提交人" sortable="custom" width="80" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="submitTime" label="提交时间" sortable="custom" width="140" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="auditOne" label="审核人" sortable="custom" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="auditTime" label="审核时间" sortable="custom" width="140" class-name="table_right" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center" width='160' fixed="right" label="操作" v-if="authbtn.item">
        <template scope="scope">
          <el-button type="text" @click="dataUpdate(scope.row)">
            <i class="icon iconfont icon-chakan" style="font-size: 12px"></i>详情 </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
/**
 * Created by yaolingon 2017/9/11.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import convert from '../../../utils/convert'; // 引入js公共方法
import HospitalChangeDelivery from '../../../api/Deliverrelation/HospitalChangeDelivery';
import upload from '../../../api/upload';

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
    // 监听删除
    this.$bus.$on('components/Find', this.dataSearch);
    this.$bus.$on('data/page/do', this.dataCreate); // 新增
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Deliverrelation',
        name: '配送关系管理',
        noLink: true,
      },
      {
        path: '/HospitalChangeDelivery',
        name: '买方更换配送',
        noLink: true,
      },
    ]);
    if (this.getGpoId) {
      if (this.getProjectId) {
        this.filterForm.projectId = this.getProjectId;
      }
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
    this.$bus.$off('data/page/do', this.dataCreate);
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  watch: {
    getGpoId() {
      if (this.$route.path === '/Deliverrelation/HospitalChangeDelivery') {
        if (this.getProjectId) {
          this.filterForm.projectId = this.getProjectId;
        }
        this.dataList();
      }
    },
  },
  computed: mapGetters([
    'getGpoId',
    'getProjectId',
    'View_UserInfo',
  ]),
  data() {
    return {
      tableHeight: 650,
      tableData: [], // 表单的值
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      page: 0,
      size: 20,
      // 筛选的字段
      filterForm: {
        projectId: null,
        gpoMemberId: null,
        hospitalMemberName: null,
        hospitalMemberId: null,
        applicationNo: null,
        salerStatic: null,
        createTime: `${this.convertDate(new Date().setTime(new Date().getTime() - (3600 * 1000 * 24 * 30)))} - ${this.convertDate(new Date())}`,
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
        projectId: data.projectId.value,
        hospitalMemberName: data.hospitalMemberName.value,
        applicationNo: data.applicationNo.value,
        salerStatic: data.salerStatic.value,
        createTime: data.createTime.value,
      };
      this.dataList(0, this.size, this.filterForm);
    },
    // 获取数据列表
    dataList(page, pageSizes) {
      if (!this.getGpoId) {
        return false;
      }
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      this.filterForm.gpoMemberId = this.getGpoId;
      const form = this.filterForm;
      let createTime = '';
      if (form.createTime && typeof form.createTime === 'object') {
        createTime = `${form.createTime[0].replace(/\//g, '-')} - ${form.createTime[1].replace(/\//g, '-')}`;
      } else {
        createTime = form.createTime;
      }
      if (createTime === '1970-01-01 - 1970-01-01') {
        form.createTime = null;
      } else {
        form.createTime = createTime;
      }
      HospitalChangeDelivery.list(cpage, cpageSizes, form).then((res) => {
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
          this.$emit('page', data.number + 1, data.size, data.totalElements);
        }
        this.loading = false;
      });
      return true;
    },
    // 关闭弹出框
    dialogHide() {
      this.dialogOptions.isShowDialog = false;
    },
    // 合同新增
    dataCreate() {
      this.$router.push({ path: '/Deliverrelation/HospitalChangeDelivery/Create' });
    },
    // 合同详情
    dataUpdate(row) {
      this.$router.push({ path: '/Deliverrelation/HospitalChangeDelivery/Edit', query: { id: row.id, salerStatic: row.salerStatic } });
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
    signDialogClose() {
      this.signVisibleOut = false;
      this.$bus.$emit('data/list');
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
  },
};
</script>
