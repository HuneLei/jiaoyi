<template>
  <div v-loading="loading">
    <el-table :data="tableData" stripe border fit :height="View_TableHeight" @sort-change="sortChange">
      <el-table-column prop="num" label="#" width="40" fixed="left" class-name="table_right_fixed">
      </el-table-column>
      <el-table-column prop="projectSubName" label="集采子项目" align="left" min-width="130" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="code" label="报量编号" align="left" min-width="160" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="hospitalMemberName" label="医疗机构" align="left" min-width="180" sortable="custom" show-overflow-tooltip v-if="getPrincipal.memberType === 4 || getPrincipal.memberType === 5">
      </el-table-column>
      <el-table-column prop="timeName" label="期间名称" align="left" min-width="130" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="validDate" label="报量有效期" align="left" min-width="170" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createBy" label="创建人" align="left" min-width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="left" min-width="170" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="projectName" label="集采项目" align="left" min-width="130" sortable="custom" show-overflow-tooltip class-name="table_right">
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100" fixed="right" max-width="200" v-if="authbtn.item">
        <template scope="scope">
          <router-link :to="{ path: '/Reportnum/HospitalReportNum/Edit', query: { id: scope.row.id } }">
            <el-button type="text" size="small">
              <i class="icon iconfont icon-chakan"></i> 详情
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
/**
 * Created by wuqian on 2017/9/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import convert from '../../../utils/convert';                         //  自定义转换js
import HospitalReportNum from '../../../api/Reportnum/HospitalReportNum';

export default {
  props: {
    authbtn: Object,
  },
  computed: {
    getPrincipal() {
      return this.$store.state.view.principal;
    },
    ...mapGetters([
      'Order_PlanfromEdit',
      'View_TableHeight',
      'View_UserInfo',
      'getGpoId',
      'getProjectId',
    ]),
  },
  activated() {
    this.$bus.$on('components/Find', this.dataSearch);      //  查询
    this.$bus.$on('page/change', this.pageChange);            //  页码切换
    this.$bus.$on('data/list', this.dataList);              //  初始化列表
    if (this.getGpoId) {
      this.filterForm.projectId = this.getProjectId;                  // 获取当前切换的集采项目号码
      this.dataList();
    }
  },
  deactivated() {
    this.$bus.$off('components/Find', this.dataSearch);    //  查询
    this.$bus.$off('page/change', this.pageChange);          //  页码切换
    this.$bus.$off('data/list', this.dataList);            //  初始化列表
  },
  watch: {
    getProjectId() {
      if (this.$route.path === '/Reportnum/HospitalReportNum') {
        this.filterForm.projectId = this.getProjectId;                  // 获取当前切换的集采项目号码
        this.dataList();
      }
    },
  },
  data() {
    return {
      tableData: [],
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      filterForm: {
        timeName: null,
        gpoMemberId: null,
        projectId: null,
        projectSubId: null,
        hospitalMemberName: null,
        reportnumValidBtime: null,
        reportnumValidEtime: null,
        createTime: `${this.convertDate(new Date().setTime(new Date().getTime() - (3600 * 1000 * 24 * 30)))} - ${this.convertDate(new Date())}`,
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
    // 查询条件获取
    dataSearch(datas) {
      const data = datas;
      let createTime = '';
      if (data.createTime.value && typeof data.createTime.value === 'object') {
        createTime = `${data.createTime.value[0].replace(/\//g, '-')} - ${data.createTime.value[1].replace(/\//g, '-')}`;
      } else {
        createTime = data.createTime.value;
      }
      if (createTime === '1970-01-01 - 1970-01-01') {
        data.createTime.value = null;
      } else {
        data.createTime.value = createTime;
      }
      let reportnumValidBtimeS;
      let reportnumValidEtimeS;
      if (data.reportnumValidtime.value) {
        reportnumValidBtimeS = data.reportnumValidtime.value[0];
        reportnumValidEtimeS = data.reportnumValidtime.value[1];
      }
      if (reportnumValidBtimeS === '1970-01-01') {
        reportnumValidBtimeS = null;
      }
      if (reportnumValidEtimeS === '1970-01-01') {
        reportnumValidEtimeS = null;
      }
      this.filterForm = {
        timeName: data.timeName.value,
        gpoMemberId: this.getGpoId,
        projectId: data.projectId.value,
        projectSubId: data.projectSubId.value,
        reportnumValidBtime: reportnumValidBtimeS,
        reportnumValidEtime: reportnumValidEtimeS,
        createTime: data.createTime.value,
      };
      if (data.hospitalMemberName) {
        this.filterForm.hospitalMemberName = data.hospitalMemberName.value;
      }
      this.dataList(0, this.size, this.filterForm);
    },
    //  更新表格数据
    dataList(page, size, filterForm) {
      if (!this.getGpoId) {
        return false;
      }
      this.loading = true;
      this.filterForm.gpoMemberId = this.getGpoId;          // 默认的GPOID
      if (page !== undefined) this.page = page;
      if (size !== undefined) this.size = size;
      HospitalReportNum.list(page || this.page, size || this.size, this.filterForm).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          this.tableNum = [];
          this.tableCount = 0;
          for (let i = 0; i < data.content.length; i += 1) {
            const numX = (i + 1) + (data.number * data.size);
            data.content[i].num = numX;
          }
          this.tableDataOld = data.content;
          this.tableData = data.content;
          this.$emit('page', data.number + 1, data.size, data.totalElements);
        }
        this.loading = false;
      });
      return true;
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
    // 页码切换
    pageChange(page) {
      this.dataList(page, this.size);
    },
  },
};
</script>
