<template>
  <div>
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column prop="num" label="#" width="40" fixed="left">
      </el-table-column>
      <el-table-column align="left" prop="drugsCode" label="药品编码" width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="drugsName" width="120" label="通用名" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <p :class="scope.row.upStatus === 0 ? 'colorRed' : ''">{{scope.row.drugsName}}</p>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="tradeName" label="商品名" width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="formName" label="剂型" width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="specName" label="规格" width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="packSpecName" label="包装规格" width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="unitName" label="单位" width="60" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <!--<el-table-column align="right" prop="hospitalUnitPrice" label="单价" min-width="70" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <p>{{scope.row.hospitalUnitPrice.toFixed(2)}}</p>
        </template>
      </el-table-column>-->
      <el-table-column align="right" prop="purchaseNum" label="合同数量" width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="right" prop="purchaseAmount" label="金额" width="80" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <p>{{scope.row.purchaseAmount.toFixed(2)}}</p>
        </template>
      </el-table-column>
      <el-table-column align="right" prop="purchasableNum" label="可采数量" width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="right" prop="purchasedNum" label="已采数量" width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="right" prop="sendNum" label="发货数量" width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="right" prop="stockinNum" label="入库数量" width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="right" prop="refusedNum" label="拒收数量" width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="right" prop="returnNum" label="退货数量" width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="right" prop="closeNum" label="结案数量" width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="producerName" label="生产企业" width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="attributeName" label="规格属性" align="left" width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="packagesName" label="包装材质" align="left" width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="approvalNumber" label="批准文号" width="130" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="projectName" label="集采项目" width="130" sortable="custom" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <div style="float: left;padding-right: 15px;padding-left: 63%">
        <span>总合同金额：</span>
        {{gatherAmount}}
        <span>元</span>
      </div>
    </div>
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
import ContractDrugsSum from '../../../api/Contract/ContractDrugsSum';

export default {
  activated() {
    this.$bus.$on('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    // 监听页码切换
    this.$bus.$on('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$on('data/list', this.dataList);
    // 监听删除
    this.$bus.$on('components/Find', this.dataSearch);
    this.$bus.$on('export/data', this.dataExport); // 导出
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
    this.$bus.$off('export/data', this.dataExport); // 导出
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  watch: {
    getProjectId() {
      if (this.$route.path === '/Contract/ContractDrugsSum') {
        this.filterForm.projectId = this.getProjectId; // 获取当前切换的集采项目号码
        this.dataList();
      }
    },
    getGpoId() {
      if (this.$route.path === '/Contract/ContractDrugsSum') {
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
      gatherAmount: '',    // 合同总金额
      gatherNum: '',    // 合同总数量
      // 筛选的字段
      filterForm: {
        contractCode: null,
        drugsCode: null,
        drugsName: null,
        producerName: null,
        contractStatus: null,
        purchaseStatus: null,
        executeStatus: null,
        createTime: `${this.convertDate(new Date().setTime(new Date().getTime() - (3600 * 1000 * 24 * 30)))} - ${this.convertDate(new Date())}`,
        specName: null,
        formName: null,
        tradeName: null,
        approvalNumber: null,
        salerMemberName: null,
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
        drugsCode: data.drugsCode.value,
        drugsName: data.drugsName.value,
        producerName: data.producerName.value,
        contractStatus: data.contractStatus.value,
        purchaseStatus: data.purchaseStatus.value ? data.purchaseStatus.value.toString() : null,
        executeStatus: data.executeStatus.value ? data.executeStatus.value.toString() : null,
        createTime: data.createTime.value,
        specName: data.specName.value,
        formName: data.formName.value,
        tradeName: data.tradeName.value,
        approvalNumber: data.approvalNumber.value,
        salerMemberName: data.salerMemberName.value,
        gpoMemberId: this.getGpoId,
        projectId: data.projectId.value,
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
      ContractDrugsSum.list(cpage, cpageSizes, form).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result.resultList;
          this.gatherAmount = res.data.result.resultSum[0].gatherAmount;
          this.gatherNum = res.data.result.resultSum[0].gatherNum;
          this.tableData = [];
          this.tableNum = [];
          this.tableCount = 0;
          for (let i = 0; i < data.content.length; i += 1) {
            // data.content[i].num = (i + 1) + (cpage * cpageSizes);
            const numX = (i + 1) + (data.number * data.size);
            data.content[i].num = numX;
            data.content[i].hospitalUnitPrice = Number(data.content[i].hospitalUnitPrice);
            data.content[i].purchaseAmount = Number(data.content[i].purchaseAmount);
            data.content[i].purchasedNum = data.content[i].purchasedNum === 0 ? '' : data.content[i].purchasedNum;
            data.content[i].sendNum = data.content[i].sendNum === 0 ? '' : data.content[i].sendNum;
            data.content[i].refusedNum = data.content[i].refusedNum === 0 ? '' : data.content[i].refusedNum;
            data.content[i].stockinNum = data.content[i].stockinNum === 0 ? '' : data.content[i].stockinNum;
            data.content[i].returnNum = data.content[i].returnNum === 0 ? '' : data.content[i].returnNum;
            data.content[i].closeNum = data.content[i].closeNum === 0 ? '' : data.content[i].closeNum;
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
    // 导出
    dataExport() {
      const form = {
        gpoMemberId: this.filterForm.gpoMemberId,
        // projectId: this.filterForm.projectId,
        memberId: this.View_UserInfo.memberId,
      };
      if (this.filterForm.projectId !== 'undefined' && this.filterForm.projectId) {
        form.projectId = this.filterForm.projectId;
      }
      if (this.filterForm.contractCode !== 'undefined' && this.filterForm.contractCode) {
        form.contractCode = this.filterForm.contractCode;
      }
      if (this.filterForm.drugsCode !== 'undefined' && this.filterForm.drugsCode) {
        form.drugsCode = this.filterForm.drugsCode;
      }
      if (this.filterForm.drugsName !== 'undefined' && this.filterForm.drugsName) {
        form.drugsName = this.filterForm.drugsName;
      }
      if (this.filterForm.hospitalMemberName !== 'undefined' && this.filterForm.hospitalMemberName) {
        form.hospitalMemberName = this.filterForm.hospitalMemberName;
      }
      if (this.filterForm.deliveryMemberName !== 'undefined' && this.filterForm.deliveryMemberName) {
        form.deliveryMemberName = this.filterForm.deliveryMemberName;
      }
      if (this.filterForm.producerName !== 'undefined' && this.filterForm.producerName) {
        form.producerName = this.filterForm.producerName;
      }
      if (this.filterForm.contractStatus !== 'undefined' && this.filterForm.contractStatus) {
        form.contractStatus = this.filterForm.contractStatus;
      }
      if (this.filterForm.closeStatus !== 'undefined' && this.filterForm.closeStatus) {
        form.closeStatus = this.filterForm.closeStatus;
      }
      if (this.filterForm.purchaseStatus !== 'undefined' && this.filterForm.purchaseStatus) {
        form.purchaseStatus = this.filterForm.purchaseStatus;
      }
      if (this.filterForm.executeStatus !== 'undefined' && this.filterForm.executeStatus) {
        form.executeStatus = this.filterForm.executeStatus;
      }
      if (this.filterForm.specName !== 'undefined' && this.filterForm.specName) {
        form.specName = this.filterForm.specName;
      }
      if (this.filterForm.formName !== 'undefined' && this.filterForm.formName) {
        form.formName = this.filterForm.formName;
      }
      if (this.filterForm.tradeName !== 'undefined' && this.filterForm.tradeName) {
        form.tradeName = this.filterForm.tradeName;
      }
      if (this.filterForm.approvalNumber !== 'undefined' && this.filterForm.approvalNumber) {
        form.approvalNumber = this.filterForm.approvalNumber;
      }
      if (this.filterForm.salerMemberName !== 'undefined' && this.filterForm.salerMemberName) {
        form.salerMemberName = this.filterForm.salerMemberName;
      }
      if (this.filterForm.salerMemberName !== 'undefined' && this.filterForm.salerMemberName) {
        form.salerMemberName = this.filterForm.salerMemberName;
      }
      const url = ContractDrugsSum.output(form);
      window.open(url);
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
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
  },
};
</script>
