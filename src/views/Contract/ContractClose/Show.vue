<template>
  <div>
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column prop="num" label="#" fixed="left" width="40">
      </el-table-column>
      <el-table-column align="left" prop="code" label="结案申请单编号" width="120" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="hospitalMemberName" label="医疗机构" width="160" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="deliveryMemberName" label="配送企业" min-width="160" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="createBy" label="申请人" width="100" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="createTime" label="申请时间" width="130" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="closeType" label="结案类型" width="100" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span v-if="scope.row.closeType === 0" style="color: green">合同结案</span>
          <span v-if="scope.row.closeType === 1" style="color: blue">合同明细结案</span>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="auditStatus" label="审核状态" width="180" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span v-if="scope.row.auditStatus === 1" style="color: green">待审核（配送企业）</span>
          <span v-if="scope.row.auditStatus === 2" style="color: green">待审核（GPO）</span>
          <span v-if="scope.row.auditStatus === 3" style="color: blue">已结案</span>
          <span v-if="scope.row.auditStatus === 4" style="color: red">已拒绝(配送企业)</span>
          <span v-if="scope.row.auditStatus === 5" style="color: red">已拒绝(GPO)</span>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="projectName" label="集采项目" min-width='130' class-name="table_right" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center" min-width='80' fixed="right" label="操作" v-if="authbtn.item">
        <template scope="scope">
          <el-button type="text" @click="dataUpdate(scope.row)">
            <i class="icon iconfont icon-chakan" style="font-size: 12px">详情</i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
/**
 * Created by lqy on 2017/9/11.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import convert from '../../../utils/convert'; // 引入js公共方法
import ContractClose from '../../../api/Contract/ContractClose';

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    if (this.$route.query.from === 'index' && this.View_UserInfo.memberType === 2) {
      this.filterForm.auditStatus = 1;
    } else if (this.$route.query.from === 'index' && this.View_UserInfo.memberType === 4) {
      this.filterForm.auditStatus = 2;
    }
    this.$bus.$on('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    // 监听页码切换
    this.$bus.$on('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$on('data/list', this.dataList);
    // 监听删除
    this.$bus.$on('components/Find', this.dataSearch);
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
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
    this.dataList();
  },
  watch: {
    getProjectId() {
      if (this.$route.path === '/Contract/ContractClose') {
        this.filterForm.projectId = this.getProjectId; // 获取当前切换的集采项目号码
        this.dataList();
      }
    },
    getGpoId() {
      if (this.$route.path === '/Contract/ContractClose') {
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
        code: null,      // 合同结案单编码
        hospitalMemberName: null,      // 医疗机构会员名称
        deliveryMemberName: null,      // 配送企业会员名称
        auditStatus: null,      // 合审核状态
        closeType: null,      // 结案类型
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
        code: data.code.value,      // 合同结案单编码
        hospitalMemberName: data.hospitalMemberName.value,      // 医疗机构会员名称
        deliveryMemberName: data.deliveryMemberName.value,      // 配送企业会员名称
        auditStatus: data.auditStatus.value,                  // 合审核状态
        createTime: data.createTime.value,
        closeType: data.closeType.value,
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
      // this.filterForm.projectId = this.getProjectId;
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
      ContractClose.list(cpage, cpageSizes, form).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          this.tableData = [];
          this.tableNum = [];
          this.tableCount = 0;
          for (let i = 0; i < data.content.length; i += 1) {
            data.content[i].num = (i + 1) + (cpage * cpageSizes);
            const numX = (i + 1) + (data.number * data.size);
            data.content[i].num = numX;
          }
          this.tableData = data.content;
          this.tableDataOld = data.content;
          this.page = data.number;
          this.size = data.size;
          this.$emit('page', data.number + 1, data.size, data.totalElements);
        }
        this.loading = false;
      });
      return true;
    },
    dataUpdate(row) {
      this.$router.push({ path: '/Contract/ContractClose/UpdateContract', query: { id: row.id, closeType: row.closeType } });
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
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
  },
};
</script>
