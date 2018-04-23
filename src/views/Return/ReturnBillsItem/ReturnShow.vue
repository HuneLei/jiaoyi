<template>
  <div v-loading="loading">
    <el-table :data="tableData" stripe border fit :height="View_TableHeight" @selection-change="dataSelect" @sort-change="sortChange">
      <el-table-column prop="num" label="#" width="40" show-overflow-tooltip fixed="left">
      </el-table-column>
      <el-table-column prop="returnCode" min-width="120" height="20px" label="退货单编号" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="hospitalMemberName" min-width="180" label="医疗机构" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliveryMemberName" min-width="180" height="20px" label="配送企业" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="drugsCode" min-width="90" label="药品编码" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="drugsName" min-width="120" label="通用名" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="tradeName" min-width="80" label="商品名" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="formName" min-width="90" label="剂型" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="specName" min-width="90" label="规格" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="packSpecName" min-width="90" label="包装规格" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="unitName" min-width="60" label="单位" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="batchNo" min-width="80" label="批号" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="right" prop="hospitalUnitPrice" min-width="70" label="单价" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <p>{{scope.row.hospitalUnitPrice.toFixed(2)}}</p>
        </template>
      </el-table-column>
      <el-table-column align="right" prop="applyReturnNum" min-width="100" label="申请退货数量" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="right" prop="returnNum" min-width="100" label="同意退货数量" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="right" prop="returnAmount" min-width="100" label="同意退货金额" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span>{{scope.row.returnAmount.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" prop="invoicedNum" min-width="100" label="已开票数量" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="isDeletable" sortable="custom" label="退货单状态" width="120" show-overflow-tooltip>
        <template scope="scope">
          <span v-if="Number(scope.row.isDeletable) === 0" style="color: green">待提交</span>
          <span v-if="Number(scope.row.isDeletable) === 1" style="color: green">待审核(GPO)</span>
          <span v-if="Number(scope.row.isDeletable) === 2" style="color: green">待审核(配送企业)</span>
          <span v-if="Number(scope.row.isDeletable) === 3" style="color: blue">审核通过</span>
          <span v-if="Number(scope.row.isDeletable) === 4" style="color: red">GPO未通过</span>
          <span v-if="Number(scope.row.isDeletable) === 5" style="color: red">配送企业未通过</span>
        </template>
      </el-table-column>
      <el-table-column prop="returnReason" min-width="100" label="退货原因" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="gpoAuditRemark" min-width="100" label="审批意见" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="producerName" min-width="180" height="20px" label="生产企业" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="salerMemberName" min-width="180" height="20px" label="卖方会员" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="approvalNumber" min-width="130" label="批准文号" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="drugsReportFile" min-width="80" label="药检报告" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <YuploadFiles :data="convert.getJSON(scope.row.drugsReportFile)"></YuploadFiles>
        </template>
      </el-table-column>
      <el-table-column prop="makeDate" min-width="100" height="20px" label="生产日期" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <p>{{scope.row.makeDate?convertDate(scope.row.makeDate):''}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="validDate" min-width="100" height="20px" label="有效日期" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <p>{{scope.row.validDate?convertDate(scope.row.validDate):''}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="invoiceNumber" min-width="80" label="发票号" show-overflow-tooltip align="center">
        <template scope="scope">
          <el-button type="text" size="small" @click="dataCreat(scope.row.returnItemNo)">
            查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="stockinCode" min-width="120" label="入库单编号" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="stockinItemNo" min-width="135" label="入库单明细编号" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="noOut" min-width="120" label="外部退货单编号" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliverCode" min-width="120" label="配送单编号" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="ordersCode" min-width="120" label="订单编号" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="contractItemNo" min-width="160" height="20px" label="合同明细编号" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createBy" min-width="120" height="20px" label="申请人" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createTime" min-width="140" height="20px" label="申请时间" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="gpoAuditBy" min-width="120" height="20px" label="GPO审核人" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="gpoAuditTime" min-width="140" height="20px" label="GPO审核时间" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliverAuditBy" min-width="120" height="20px" label="配送企业审核人" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliverAuditTime" min-width="140" height="20px" label="配送企业审核时间" sortable="custom" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <div style="float: left;padding-right: 15px;padding-left: 63%">
        <span>总退货数量：</span>{{totalNumber ? totalNumber : 0}} </div>
      <div style="float: left">
        <span style="">总退货金额：</span>{{totalAmount ? totalAmount.toFixed(2) : 0}}
        <span> 元</span>
      </div>
    </div>
    <InvoiceNumberTable :options="dialogOptions" @dialog-hide="dialogHide"></InvoiceNumberTable>
  </div>
</template>

<script>
/**
 * Created by yaoling on 2017/9/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import convert from '../../../utils/convert';                             //  自定义转换js
import ReturnBillsItem from '../../../api/Return/ReturnBillsItem';        //  订单结案单申请api
import InvoiceNumberTable from './InvoiceNumberTable';       // 引入发票明细弹出框

export default {
  components: {
    InvoiceNumberTable,
  },
  computed: mapGetters([
    'View_TableHeight',
    'View_UserInfo',
    'getGpoId',
  ]),
  activated() {
    this.$bus.$on('components/Find', this.dataSearch);      //  查询
    this.$bus.$on('page/change', this.dataList);            //  页码切换
    this.$bus.$on('data/list', this.dataList);              //  初始化列表
    this.$bus.$on('data/export', this.exportData);          //  导出数据
    if (this.getGpoId) {                                    //  初始化列表查询
      this.dataList();
    }
  },
  deactivated() {
    this.$bus.$off('components/Find', this.dataSearch);     //  查询
    this.$bus.$off('page/change', this.dataList);           //  页码切换
    this.$bus.$off('data/list', this.dataList);             //  初始化列表
    this.$bus.$off('data/export', this.exportData);         //  导出数据
  },
  watch: {
    getGpoId() {
      if (this.$route.path === '/Return/ReturnBillsItem') {
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
      totalAmount: 0,
      totalNumber: 0,
      loading: false,
      formInline: {               // 查询条件的获取值
        returnCode: {},
        batchNo: {},
        invoiceNumber: {},
        deliveryMemberName: {},
        hospitalMemberName: {},
        stockinCode: {},
        deliverCode: {},
        ordersCode: {},
        drugsCode: {},
        drugsName: {},
        contractItemNo: {},
        producerName: {},
        salerMemberName: {},
        noOut: {},
        invoicedNum: {},
        deliverAuditTime: {},
        createTime: {
          value: [
            this.convertDate(new Date().setTime(new Date().getTime() - (3600 * 1000 * 24 * 30))),
            this.convertDate(new Date()),
          ],
        },
        confirmTime: {},
        isDeletable: {},
      },
      dialogOptions: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: [],                  //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
        ItemNo: '',
      },
      page: 0,
      size: 20,
      total: 0,
    };
  },
  methods: {
    // 导出数据
    exportData() {
      const url = ReturnBillsItem.output(this.formInline, this.getGpoId);
      window.open(url);
    },
    // 查看发票号
    dataCreat(ItemNo) {
      this.dialogOptions.isShowDialog = true;
      this.dialogOptions.ItemNo = ItemNo;
    },
    // 关闭弹出框
    dialogHide() {
      this.dialogOptions.isShowDialog = false;
    },
    //  每次点击排序都会触发
    sortChange(rule) {
      if (rule.order) {
        const tableData = this.convert.tableSort(rule, this.tableData);
        this.tableData = [...tableData];
      } else {
        this.tableData = [...this.tableDataOld];
      }
    },
    //  更新表格数据
    dataList(page, pageSizes, formInline) {
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      const form = formInline || this.formInline;
      let createTime = '';
      let deliverAuditTime = '';
      if (form.createTime.value && typeof form.createTime.value === 'object') {
        createTime = `${form.createTime.value[0].replace(/\//g, '-')} - ${form.createTime.value[1].replace(/\//g, '-')}`;
      } else {
        createTime = form.createTime.value;
      }
      if (createTime === '1970-01-01 - 1970-01-01') {
        form.createTime.value = null;
      } else {
        form.createTime.value = createTime;
      }
      if (form.deliverAuditTime.value && typeof form.deliverAuditTime.value === 'object') {
        deliverAuditTime = `${form.deliverAuditTime.value[0].replace(/\//g, '-')} - ${form.deliverAuditTime.value[1].replace(/\//g, '-')}`;
      } else {
        deliverAuditTime = form.deliverAuditTime.value;
      }
      if (deliverAuditTime === '1970-01-01 - 1970-01-01') {
        form.deliverAuditTime.value = null;
      } else {
        form.deliverAuditTime.value = deliverAuditTime;
      }
      form.gpoMemberId = this.getGpoId;
      ReturnBillsItem.list(cpage, cpageSizes, form).then((res) => {
        if (res.data.code === 0) {
          this.tableNum = [];
          this.tableCount = 0;
          const data = res.data.result[1];
          this.totalAmount = res.data.result[0][0].totalAmount || 0;
          this.totalNumber = res.data.result[0][0].totalNumber || 0;
          for (let i = 0; i < data.content.length; i += 1) {
            const numX = (i + 1) + (cpage * cpageSizes);
            data.content[i].num = numX;
            data.content[i].returnAmount = Number(data.content[i].returnNum) *
            Number(data.content[i].hospitalUnitPrice);
            data.content[i].hospitalUnitPrice = Number(data.content[i].hospitalUnitPrice);
          }
          this.tableData = data.content;
          this.tableDataOld = data.content;
          this.page = data.number;
          this.size = data.size;
          this.$emit('page', data.number + 1, data.size, data.totalElements);
        }
        this.loading = false;
      });
    },
    // 数据查询条件获取
    dataSearch(data) {
      this.formInline = data;
      this.dataList(0, this.size, this.formInline);
    },
    // 选择触发事件，根据审核状态判断右下角btn是否禁用
    dataSelect(row) {
      let submit = true;
      const ids = [];
      for (let i = 0; i < row.length; i += 1) {
        const status = Number(row[i].status);
        ids.push(row[i].id);
        if ((status !== 2 && status !== 3) || Number(row[i].closeStatus) !== 0) {
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
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
    ...mapActions([
      'GetItemDate',
      'TableHeightRun',
    ]),
  },
};
</script>
