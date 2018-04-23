<template>
  <div>
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column prop="num" label="#" fixed="left" width="40">
      </el-table-column>
      <el-table-column align="left" prop="code" label="合同编号" sortable="custom" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="firstPartyName" label="甲方" sortable="custom" width="160" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="secondPartyName" label="乙方" sortable="custom" min-width="160" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="contractType" label="合同类型" sortable="custom" width="100" show-overflow-tooltip>
        <template scope="scope">
          <span v-if="Number(scope.row.contractType) === 1">生产企业</span>
          <span v-if="Number(scope.row.contractType) === 2">GPO</span>
          <span v-if="Number(scope.row.contractType) === 3">配送企业</span>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="contractStatus" label="合同状态" sortable="custom" width="130" show-overflow-tooltip>
        <template scope="scope">
          <span v-if="Number(scope.row.contractStatus) === 1" style="color: green">待签章</span>
          <span v-if="Number(scope.row.contractStatus) === 2" style="color: green">甲方已签章</span>
          <span v-if="Number(scope.row.contractStatus) === 3" style="color: green">乙方已签章</span>
          <span v-if="Number(scope.row.contractStatus) === 4" style="color: blue">已生效</span>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="createTime" sortable="custom" label="合同日期" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="firstAgentPerson" sortable="custom" label="甲方经办人" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="firstSignTime" label="甲方签订日期" sortable="custom" min-width='130' show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="secondAgentPerson" sortable="custom" label="乙方经办人" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="secondSignTime" label="乙方签订日期" sortable="custom" min-width='130' class-name="table_right" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center" width='80' fixed="right" label="详情">
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
import HonestContact from '../../../api/Contract/HonestContact';
import upload from '../../../api/upload';

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    this.tableData = [];
    if (this.$route.query.from === 'index') {
      if (this.View_UserInfo.memberType === 3) {
        this.filterForm.contractStatus = [1, 3];
      } else if (this.View_UserInfo.memberType === 4) {
        this.filterForm.contractStatus = [1, 2];
        this.filterForm.contractType = [2];
      } else if (this.View_UserInfo.memberType === 2) {
        this.filterForm.contractStatus = [1, 2];
        this.filterForm.contractType = [3];
      }
    }
    this.$bus.$on('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    // 监听页码切换
    this.$bus.$on('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$on('data/list', this.dataList);
    // 监听删除
    this.$bus.$on('components/Find', this.dataSearch);
    this.$bus.$on('export/data', this.dataExport); // 导出
    if (this.getGpoId) {
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
    this.$bus.$off('export/data', this.dataExport); // 导出
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
    this.dataList();
  },
  watch: {
    getGpoId() {
      if (this.$route.path === '/Contract/HonestContract') {
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
        gpoMemberId: null,
        contractType: null,      // 合同结案单编码
        contractStatus: null,      // 医疗机构会员名称
        firstPartyName: null,      // 配送企业会员名称
        secondPartyName: null,      // 合审核状态
        createTime: `${this.convertDate(new Date().setTime(new Date().getTime() - (3600 * 1000 * 24 * 30)))} - ${this.convertDate(new Date())}`,
      },
      btnIsDisabled: {
        signature: true,
      },
      btnIsLoading: {
        signature: false,
      },
      signVisibleOut: false,
      contractUrl: '',
      contractId: '',
      cakey: '',
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
        contractType: data.contractType.value,      // 合同结案单编码
        contractStatus: data.contractStatus.value,      // 医疗机构会员名称
        firstPartyName: data.firstPartyName.value,      // 配送企业会员名称
        secondPartyName: data.secondPartyName.value,                  // 合审核状态
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
      if (this.View_UserInfo.memberType === 2) {
        form.contractType = 3;
      }
      HonestContact.list(cpage, cpageSizes, form).then((res) => {
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
    dataUpdate(item) {
      this.$router.push({ path: '/Contract/HonestContract/HonestContractDialog', query: { id: item.id, contractType: item.contractType } });
    },
    // 导出
    dataExport() {
      const form = {};
      if (this.filterForm.firstPartyName !== 'undefined' && this.filterForm.firstPartyName) {
        form.firstPartyName = this.filterForm.firstPartyName;
      }
      if (this.filterForm.secondPartyName !== 'undefined' && this.filterForm.secondPartyName) {
        form.secondPartyName = this.filterForm.secondPartyName;
      }
      if (this.filterForm.contractType !== 'undefined' && this.filterForm.contractType) {
        form.contractType = this.filterForm.contractType;
      }
      if (this.filterForm.contractStatus !== 'undefined' && this.filterForm.contractStatus) {
        form.contractStatus = this.filterForm.contractStatus;
      }
      const url = HonestContact.output(form);
      window.open(url);
    },
    signDialogClose() {
      this.signVisibleOut = false;
      this.$bus.$emit('data/list');
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
