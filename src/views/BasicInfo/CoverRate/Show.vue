<template>
  <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
    <el-table-column prop="num" align="left" fixed="left" label="#" width="40">
    </el-table-column>
    <el-table-column align="left" prop="enterpriseName" label="配送企业" sortable="custom" width="160" show-overflow-tooltip>
    </el-table-column>
    <el-table-column align="left" prop="eLocation" label="配送企业所在地区" sortable="custom" width="160" show-overflow-tooltip>
      <template scope="scope">
        <span>{{scope.row.eProvinceName}}{{scope.row.eCityName}}{{scope.row.eCountyName}}</span>
      </template>
    </el-table-column>
    <el-table-column align="left" prop="hospitalCode" label="医疗机构编码" sortable="custom" width="160" show-overflow-tooltip>
    </el-table-column>
    <el-table-column align="left" prop="hospitalName" label="医疗机构名称" sortable="custom" width="160" show-overflow-tooltip>
    </el-table-column>
    <el-table-column align="left" prop="hLocation" label="医疗机构所在地区" sortable="custom" width="160" show-overflow-tooltip>
      <template scope="scope">
        <span>{{scope.row.hProvinceName}}{{scope.row.hCityName}}{{scope.row.hCountyName}}</span>
      </template>
    </el-table-column>
    <el-table-column align="left" prop="auditStatus" sortable="custom" label="状态" class-name="table_right" width="80" show-overflow-tooltip>
      <template scope="scope">
        <span v-if="scope.row.audtiStatus === 0" class="order-green">待审核</span>
        <span v-if="scope.row.audtiStatus === 1" class="order-blue">审核通过</span>
        <span v-if="scope.row.audtiStatus === 2" class="order-red">审核不通过</span>
      </template>
    </el-table-column>
    <el-table-column align="center" min-width='160' v-if="authbtn.item" fixed="right" label="操作">
      <template scope="scope">
        <el-button v-if="authbtn.all" type="text" @click="dataUpdate(scope.row)">查看协议</el-button>
        <el-button v-if="View_UserInfo.memberType !== 2 && authbtn.aduitStatusUpdate" v-show="scope.row.audtiStatus === 0" :disabled="scope.row.openStatus === 1" type="text" @click="changeAuditStatus(scope.row, 1)">通过</el-button>
        <el-button v-if="View_UserInfo.memberType !== 2 && authbtn.aduitStatusUpdate" v-show="scope.row.audtiStatus === 0" :disabled="scope.row.openStatus === 0" type="text" @click="changeAuditStatus(scope.row, 2)">不通过</el-button>
        <el-button v-if="View_UserInfo.memberType !== 2 && authbtn.enableUpdate" v-show="scope.row.audtiStatus === 1" :disabled="scope.row.enabled === 1" type="text" @click="changeEnabledStatus(scope.row, 1)">启用</el-button>
        <el-button v-if="View_UserInfo.memberType !== 2 && authbtn.enableUpdate" v-show="scope.row.audtiStatus === 1" :disabled="scope.row.enabled === 0" type="text" @click="changeEnabledStatus(scope.row, 0)">禁用</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
/**
 * Created by lqy on 2017/9/11.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import CoverRate from '../../../api/BasicInfo/CoverRate';

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    this.$bus.$on('table/height', this.tableHeightRun);     //  监听查询按钮的查看更多点击事件，重新计算表格高度
    // 监听页码切换
    this.$bus.$on('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$on('data/list', this.dataList);
    // 监听删除
    this.$bus.$on('components/Find', this.dataSearch);
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun);
    // 监听页码切换
    this.$bus.$off('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$off('data/list', this.dataList);
    // 监听删除
    this.$bus.$off('components/Find', this.dataSearch);
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
    this.dataList();
  },
  computed: mapGetters([
    'getGpoId',
    'View_UserInfo',
  ]),
  data() {
    return {
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
        enterpriseName: null,   // 企业名称
        audtiStatus: null,      // 审核状态
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
        enterpriseName: data.enterpriseName.value,
        audtiStatus: data.audtiStatus.value,
      };
      this.dataList(0, this.size, this.filterForm);
    },
    // 获取数据列表
    dataList(page, pageSizes) {
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      CoverRate.list(cpage, cpageSizes, this.filterForm).then((res) => {
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
    },
    // 数据更新
    dataUpdate(item) {
      this.$bus.$emit('details/show', item);
    },
    // 查看协议
    detailsShow() {

    },
    /**
     * 更换状态操作
     * @param row
     * @param i = 1， 启用  i = 0， 禁用。
     */
    changeEnabledStatus(row, i) {
      const id = Number(row.id);                  // Id
      const openStatus = row.openStatus;  // 项目开启状态 0:关闭 1:开启，不可为空
      let prompt;
      if (i === 1) {
        prompt = '启用成功';
      } else {
        prompt = '禁用成功';
      }
      // 更新请求
      CoverRate.enableUpdate(id, i).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: prompt,
          });
          this.dataList(this.page, this.size);
        } else {
          this.$message({
            type: 'error',
            message: '操作失败',
          });
        }
      });
    },
    /**
     * 更换状态操作
     * @param row
     * @param i = 1， 审核通过  i =2， 审核不通过。
     */
    changeAuditStatus(row, i) {
      const id = Number(row.id);  // Id
      const openStatus = row.openStatus;          // 项目开启状态 0:关闭 1:开启，不可为空
      this.$confirm('提交审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(({ value }) => {
        // 更新请求
        CoverRate.aduitStatusUpdate(id, i).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '审核成功',
            });
            this.dataList(this.page, this.size);
          } else {
            this.$message({
              type: 'error',
              message: '操作失败',
            });
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 页码切换
    pageChange(page) {
      this.dataList(page);
    },
    //  计算表格高度
    tableHeightRun() {
      const tableHeightFun = () => {
        this.tableHeight = window.tableCustom.tableHeight(['.find', '.paging', 135]);
      };
      setTimeout(tableHeightFun, 0);
    },
  },
  mounted() {
  },
};
</script>
