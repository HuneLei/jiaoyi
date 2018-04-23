<template>
  <div>
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" @selection-change="dataSelect" stripe border fit @sort-change="sortChange">
      <el-table-column type="selection" width="40" align="left" v-if="this.View_UserInfo.memberType === 3">
      </el-table-column>
      <el-table-column prop="num" label="#" width="40" fixed="left">
      </el-table-column>
      <el-table-column key="code" align="left" prop="code" label="合同编号" width="120" sortable="custom" show-overflow-tooltip v-if="filter.code">
      </el-table-column>
      <el-table-column key="hospitalMemberName" align="left" prop="hospitalMemberName" label="医疗机构" width="180" sortable="custom" show-overflow-tooltip v-if="filter.hospitalMemberName">
      </el-table-column>
      <el-table-column key="drugsCode" prop="drugsCode" label="药品编码" align="left" width="90" sortable="custom" show-overflow-tooltip v-if="filter.drugsCode">
      </el-table-column>
      <el-table-column key="drugsName" prop="drugsName" width="120" label="通用名" sortable="custom" show-overflow-tooltip v-if="filter.drugsName">
        <template scope="scope">
          <p :class="scope.row.upStatus === 0 ? 'colorRed' : ''">{{scope.row.drugsName}}</p>
        </template>
      </el-table-column>
      <el-table-column key="tradeName" align="left" prop="tradeName" label="商品名" width="80" sortable="custom" show-overflow-tooltip v-if="filter.tradeName">
      </el-table-column>
      <el-table-column key="formName" prop="formName" label="剂型" align="left" width="90" sortable="custom" show-overflow-tooltip v-if="filter.formName">
      </el-table-column>
      <el-table-column key="specName" prop="specName" label="规格" align="left" width="90" sortable="custom" show-overflow-tooltip v-if="filter.specName">
      </el-table-column>
      <el-table-column key="packSpecName" prop="packSpecName" label="包装规格" align="left" width="90" sortable="custom" show-overflow-tooltip v-if="filter.packSpecName">
      </el-table-column>
      <el-table-column key="unitName" prop="unitName" label="单位" align="left" width="60" sortable="custom" show-overflow-tooltip v-if="filter.unitName">
      </el-table-column>
      <el-table-column key="hospitalUnitPrice" prop="hospitalUnitPrice" label="单价" align="right" min-width="70" sortable show-overflow-tooltip v-if="filter.hospitalUnitPrice">
        <template scope="scope">
          <span v-if="Number(scope.row.hospitalUnitPrice) > Number(scope.row.hospitalUnitOldPrice)">
            <p>{{scope.row.hospitalUnitPrice.toFixed(2)}}
              <i class="fa fa-arrow-down colorGreen" style="font-size: 14px"></i>
            </p>
          </span>
          <span v-else-if="Number(scope.row.hospitalUnitPrice) < Number(scope.row.hospitalUnitOldPrice)">
            <p>{{scope.row.hospitalUnitPrice.toFixed(2)}}
              <i class="fa fa-arrow-up colorRed" style="font-size: 14px"></i>
            </p>
          </span>
          <span v-else>
            <p>{{scope.row.hospitalUnitPrice.toFixed(2)}}</p>
          </span>
        </template>
      </el-table-column>
      <el-table-column key="purchaseNum" prop="purchaseNum" label="合同数量" align="right" width="80" sortable="custom" show-overflow-tooltip v-if="filter.purchaseNum">
      </el-table-column>
      <el-table-column key="purchaseAmount" align="right" prop="purchaseAmount" label="金额" width="90" sortable show-overflow-tooltip v-if="filter.purchaseAmount">
        <template scope="scope">
          <p>{{scope.row.purchaseAmount.toFixed(2)}}</p>
        </template>
      </el-table-column>
      <el-table-column key="purchasableNum" align="right" prop="purchasableNum" label="可采数量" width="80" sortable="custom" show-overflow-tooltip v-if="filter.purchasableNum">
      </el-table-column>
      <el-table-column key="purchasedNum" align="right" prop="purchasedNum" label="已采数量" width="80" sortable="custom" show-overflow-tooltip v-if="filter.purchasedNum">
      </el-table-column>
      <el-table-column key="sendNum" align="right" prop="sendNum" label="发货数量" width="80" sortable="custom" show-overflow-tooltip v-if="filter.sendNum">
      </el-table-column>
      <el-table-column key="prepareNum" align="right" prop="prepareNum" label="待发货数量" width="90" sortable="custom" show-overflow-tooltip v-if="filter.prepareNum">
      </el-table-column>
      <el-table-column key="stockinNum" align="right" prop="stockinNum" label="入库数量" width="80" sortable="custom" show-overflow-tooltip v-if="filter.stockinNum">
      </el-table-column>
      <el-table-column key="refusedNum" align="right" prop="refusedNum" label="拒收数量" width="80" sortable="custom" show-overflow-tooltip v-if="filter.refusedNum">
      </el-table-column>
      <el-table-column key="returnNum" align="right" prop="returnNum" label="退货数量" width="80" sortable="custom" show-overflow-tooltip v-if="filter.returnNum">
      </el-table-column>
      <el-table-column key="closeNum" align="right" prop="closeNum" label="结案数量" width="80" sortable="custom" show-overflow-tooltip v-if="filter.closeNum">
      </el-table-column>
      <el-table-column key="producerName" align="left" prop="producerName" label="生产企业" width="180" sortable="custom" show-overflow-tooltip v-if="filter.producerName">
      </el-table-column>
      <el-table-column key="deliveryMemberName" align="left" prop="deliveryMemberName" label="配送企业" width="180" sortable="custom" show-overflow-tooltip v-if="filter.deliveryMemberName">
      </el-table-column>
      <el-table-column key="salerMemberName" align="left" prop="salerMemberName" label="卖方会员" width="180" sortable="custom" show-overflow-tooltip v-if="filter.salerMemberName">
      </el-table-column>
      <el-table-column key="attributeName" prop="attributeName" label="规格属性" align="left" width="90" sortable="custom" show-overflow-tooltip v-if="filter.attributeName">
      </el-table-column>
      <el-table-column key="packagesName" prop="packagesName" label="包装材质" align="left" width="90" sortable="custom" show-overflow-tooltip v-if="filter.packagesName">
      </el-table-column>
      <el-table-column key="approvalNumber" align="left" prop="approvalNumber" label="批准文号" width="130" sortable="custom" show-overflow-tooltip v-if="filter.approvalNumber">
      </el-table-column>
      <el-table-column key="drugStandardCode" align="left" prop="drugStandardCode" label="本位码" width="120" sortable="custom" show-overflow-tooltip v-if="filter.drugStandardCode">
      </el-table-column>
      <el-table-column key="contractStatus" align="left" prop="contractStatus" label="合同状态" min-width="120" sortable="custom" show-overflow-tooltip v-if="filter.contractStatus">
        <template scope="scope">
          <span v-if="Number(scope.row.contractStatus) === 2" style="color: green">待签章(医疗机构)</span>
          <span v-if="Number(scope.row.contractStatus) === 3" style="color: green">待签章(配送企业)</span>
          <span v-if="Number(scope.row.contractStatus) === 4" style="color: green">待签章(GPO)</span>
          <span v-if="Number(scope.row.contractStatus) === 5" style="color: red">已作废</span>
          <span v-if="Number(scope.row.contractStatus) === 6" style="color: red">已过期</span>
          <span v-if="Number(scope.row.contractStatus) === 7" style="color: blue">已生效</span>
          <span v-if="Number(scope.row.contractStatus) === 8" style="color: blue">已结案</span>
        </template>
      </el-table-column>
      <el-table-column key="closeStatus" align="left" prop="closeStatus" label="明细结案状态" min-width="120" sortable="custom" show-overflow-tooltip v-if="filter.closeStatus">
        <template scope="scope">
          <span v-if="Number(scope.row.closeStatus) === 0">无</span>
          <span v-if="Number(scope.row.closeStatus) === 1" style="color: green">结案中</span>
          <span v-if="Number(scope.row.closeStatus) === 2" style="color: blue">已结案</span>
        </template>
      </el-table-column>
      <el-table-column key="itemNo" align="left" prop="itemNo" label="合同明细编号" width="135" sortable="custom" show-overflow-tooltip v-if="filter.itemNo">
      </el-table-column>
      <el-table-column key="createTime" align="left" prop="createTime" label="合同创建日期" width="140" sortable="custom" show-overflow-tooltip v-if="filter.createTime">
      </el-table-column>
      <el-table-column key="validBtime" align="left" prop="validBtime" label="合同有效期" min-width="160" sortable="custom" show-overflow-tooltip v-if="filter.validBtime">
        <template scope="scope">
          {{scope.row.validBtime}} ~ {{scope.row.validEtime}}
        </template>
      </el-table-column>
      <el-table-column key="outNo" prop="outNo" min-width="120" label="外部合同编号" sortable="custom" show-overflow-tooltip v-if="filter.outNo">
      </el-table-column>
      <el-table-column key="projectName" align="left" prop="projectName" label="集采项目" width="130" sortable="custom" show-overflow-tooltip v-if="filter.projectName">
      </el-table-column>
    </el-table>
    <!-- <div class="table-footer">
      <div style="float: left;padding-right: 15px;padding-left: 63%">
        <span>总合同金额：</span>
        {{gatherAmount}}
        <span>元</span>
      </div>
    </div> -->
  </div>
</template>

<script>
/**
 * Created by yaoling on 2017/9/11.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import convert from '../../../utils/convert'; // 引入js公共方法
import ContractItem from '../../../api/Contract/ContractItem';

export default {
  activated() {
    if (this.$route.query.from === 'index') {
      this.filterForm.contractStatus = [7];
      this.filterForm.closeStatus = '0';
      this.filterForm.executeStatus = [4];
    }
    this.$bus.$on('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    // 监听页码切换
    this.$bus.$on('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$on('data/list', this.dataList);
    // 监听删除
    this.$bus.$on('components/Find', this.dataSearch);
    this.$bus.$on('apply/closure', this.dataApplyClosure); // 申请结案
    this.$bus.$on('export/data', this.dataExport); // 导出
    if (this.getGpoId) {
      if (this.$route.query.from !== 'index') {
        this.filterForm.projectId = this.getProjectId; // 获取当前切换的集采项目号码
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
    this.$bus.$off('apply/closure', this.dataApplyClosure);
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
      if (this.$route.path === '/Contract/ContractItem') {
        if (this.$route.query.from !== 'index') {
          this.filterForm.projectId = this.getProjectId; // 获取当前切换的集采项目号码
        }
        this.dataList();
      }
    },
    getGpoId() {
      if (this.$route.path === '/Contract/ContractItem') {
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
      selectIds: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      page: 0,
      size: 20,
      // gatherAmount: '',    // 合同总金额
      gatherNum: '',    // 合同总数量
      // 筛选的字段
      filterForm: {
        gpoMemberId: null,
        projectId: null,
        contractCode: null,
        drugsCode: null,
        drugsName: null,
        hospitalMemberName: null,
        deliveryMemberName: null,
        producerName: null,
        contractStatus: null,
        closeStatus: null,
        purchaseStatus: null,
        executeStatus: null,
        validBtime: null,
        validEtime: null,
        createTime: `${this.convertDate(new Date().setTime(new Date().getTime() - (3600 * 1000 * 24 * 365)))} - ${this.convertDate(new Date())}`,
        specName: null,
        formName: null,
        tradeName: null,
        approvalNumber: null,
        salerMemberName: null,
        drugStandardCode: null,
        hospitalUnitOldPrice: null,
        outNo: null,
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
      let reportnumValidBtimeS;
      let reportnumValidEtimeS;
      if (data.validtime.value) {
        reportnumValidBtimeS = data.validtime.value[0];
        reportnumValidEtimeS = data.validtime.value[1];
      }
      if (reportnumValidBtimeS === '1970-01-01') {
        reportnumValidBtimeS = null;
      }
      if (reportnumValidEtimeS === '1970-01-01') {
        reportnumValidEtimeS = null;
      }
      this.filterForm = {
        contractCode: data.contractCode.value,
        drugsCode: data.drugsCode.value,
        drugsName: data.drugsName.value,
        hospitalMemberName: data.hospitalMemberName.value,
        deliveryMemberName: data.deliveryMemberName.value,
        producerName: data.producerName.value,
        contractStatus: data.contractStatus.value,
        closeStatus: data.closeStatus.value,
        purchaseStatus: data.purchaseStatus.value,
        executeStatus: data.executeStatus.value,
        validBtime: reportnumValidBtimeS,
        validEtime: reportnumValidEtimeS,
        createTime: data.createTime.value,
        specName: data.specName.value,
        formName: data.formName.value,
        tradeName: data.tradeName.value,
        approvalNumber: data.approvalNumber.value,
        salerMemberName: data.salerMemberName.value,
        drugStandardCode: data.drugStandardCode.value,
        hospitalUnitOldPrice: data.hospitalUnitOldPrice.value,
        gpoMemberId: this.getGpoId,
        projectId: data.projectId.value,
        outNo: data.outNo.value,
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
      ContractItem.list(cpage, cpageSizes, form).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result.resultList;
          // this.gatherAmount = res.data.result.resultSum[0].gatherAmount;
          // this.gatherNum = res.data.result.resultSum[0].gatherNum;
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
            data.content[i].prepareNum = data.content[i].purchasedNum - data.content[i].sendNum;
            data.content[i].prepareNum = data.content[i].prepareNum === 0 ? '' : data.content[i].prepareNum;
            data.content[i].validBtime = data.content[i].validBtime.substring(0, 10);
            data.content[i].validEtime = data.content[i].validEtime.substring(0, 10);
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
    // 申请结案
    dataApplyClosure(row) {
      // for (let i = 0; i < row.length; i += 1) {
      //   const item = row[i];
      //   this.selectIds.push(item.id);
      // }
      this.$bus.$emit('changeEdit/dialog', row);
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
      if (this.filterForm.drugStandardCode !== 'undefined' && this.filterForm.drugStandardCode) {
        form.drugStandardCode = this.filterForm.drugStandardCode;
      }
      if (this.filterForm.hospitalUnitOldPrice !== 'undefined' && this.filterForm.hospitalUnitOldPrice) {
        form.hospitalUnitOldPrice = this.filterForm.hospitalUnitOldPrice;
      }
      if (this.filterForm.outNo !== 'undefined' && this.filterForm.outNo) {
        form.outNo = this.filterForm.outNo;
      }
      if (this.filterForm.createTime !== 'undefined' && this.filterForm.createTime) {
        form.createTime = this.filterForm.createTime;
      }
      const url = ContractItem.output(form);
      window.open(url);
    },
    dataSelect(row) {
      let submit = true;
      const ids = [];
      for (let i = 0; i < row.length; i += 1) {
        const status = Number(row[i].contractStatus);
        ids.push(row[i].id);
        if ((status !== 7) || Number(row[i].closeStatus) !== 0 ||
          Number(row[i].purchasableNum === 0)) {
          submit = false;
          break;
        }
      }
      this.$emit('table-select', ids);
      const first = 0;
      if (first > 0) {
        submit = false;
      }
      const btn = { applys: submit };
      this.$bus.$emit('data/select', row, btn);
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
  props: {
    filter: Object,
  },
};
</script>
<style>
.trade {
  position: relative !important;
}

.colorRed {
  color: red;
}

.colorGreen {
  color: green;
}
</style>
