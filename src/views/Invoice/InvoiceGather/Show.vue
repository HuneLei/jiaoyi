<template>
  <div>
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column prop="num" fixed="left" label="#" width="40">
      </el-table-column>
      <el-table-column prop="drugsCode" label="药品编码" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="drugsName" label="通用名" align="left" min-width="120" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="specName" label="规格" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="packSpecName" label="包装规格" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="unitName" label="单位" align="left" min-width="60" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="batchNo" label="批号" align="left" min-width="120" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="gpoMemberName" label="GPO名称" align="left" min-width="120" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliveryMemberName" label="配送企业" align="left" min-width="120" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="gpoNum" label="GPO开票数量" align="right" min-width="100" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliveryNum" label="配送企业开票数量" align="right" min-width="120" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <P :class="scope.row.deliveryNum > scope.row.gpoNum ? 'colorRed' : ''">{{scope.row.deliveryNum}}</P>
        </template>
      </el-table-column>
      <el-table-column prop="producerName" label="生产企业" align="left" min-width="180" class-name="table_right" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="发票查看" align="center" fixed="right" width="280">
        <template scope="scope">
          <el-button @click="dataLook3(scope.row)" type="text" size="small">
            <i class="icon iconfont icon-chakan"></i> 生产企业
          </el-button>
          <el-button @click="dataLook2(scope.row)" type="text" size="small">
            <i class="icon iconfont icon-chakan"></i> GPO
          </el-button>
          <el-button @click="dataLook1(scope.row)" type="text" size="small">
            <i class="icon iconfont icon-chakan"></i> 配送企业
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <DeliveryInvoiceDialog :options="dialogOptionsOne" @dialog-hide="dialogHide"></DeliveryInvoiceDialog>
    <GPOInvoiceDialog :options="dialogOptionsTwo" @dialog-hide="dialogHide"></GPOInvoiceDialog>
    <ProduceInvoiceDialog :options="dialogOptionsThree" @dialog-hide="dialogHide"></ProduceInvoiceDialog>
  </div>
</template>

<script>
/**
 * Created by wuqian on 2017/6/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import convert from '../../../utils/convert'; // 引入js公共方法
import InvoiceGather from '../../../api/Invoice/InvoiceGather';
import DeliveryInvoiceDialog from './DeliveryInvoiceDialog';
import GPOInvoiceDialog from './GPOInvoiceDialog';
import ProduceInvoiceDialog from './ProduceInvoiceDialog';

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    // console.log();
    this.$bus.$on('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$on('page/change', this.pageChange);
    this.$bus.$on('data/list', this.dataList);
    this.$bus.$on('components/Find', this.dataSearch);
    this.$bus.$on('export/data', this.dataExport); // 导出
    if (this.getGpoId) {
      this.dataList();
    }
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun);
    this.$bus.$off('page/change', this.pageChange);
    this.$bus.$off('data/list', this.dataList);
    this.$bus.$off('components/Find', this.dataSearch);
    this.$bus.$off('export/data', this.dataExport); // 导出
  },
  components: {
    DeliveryInvoiceDialog,
    GPOInvoiceDialog,
    ProduceInvoiceDialog,
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  watch: {
    getProjectId() {
      if (this.$route.path === '/Invoice/InvoiceGather') {
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
      tableData: [],
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      filterForm: {
        producerName: null,
        deliveryMemberName: null,
        drugsCode: null,
        batchNo: null,
        drugsName: null,
        num: null,
      },
      dialogOptionsOne: {
        msgBase: '', //  没什么卵用，有需要可以看看
        isShowDialog: false, //  显示弹框
        tableSelected: [], //  默认表格选中
        tableType: 1, //  0 单选，1 多选 默认单选
        gpoMemberId: null,
        deliveryMemberId: null,
        batchNo: null,
        drugsCode: null,
      },
      dialogOptionsTwo: {
        msgBase: '', //  没什么卵用，有需要可以看看
        isShowDialog: false, //  显示弹框
        tableSelected: [], //  默认表格选中
        tableType: 1, //  0 单选，1 多选 默认单选
        gpoMemberId: null,
        deliveryMemberId: null,
        batchNo: null,
        drugsCode: null,
      },
      dialogOptionsThree: {
        msgBase: '', //  没什么卵用，有需要可以看看
        isShowDialog: false, //  显示弹框
        tableSelected: [], //  默认表格选中
        tableType: 1, //  0 单选，1 多选 默认单选
        gpoMemberId: null,
        deliveryMemberId: null,
        batchNo: null,
        drugsCode: null,
      },
      page: 0,
      size: 20,
      drugsNum: 0,
      taxaMount: 0.00,
      noTaxAmount: 0.00,
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
    // 点击弹出弹框
    dataLook1(data) {
      this.dialogOptionsOne.batchNo = data.batchNo;
      this.dialogOptionsOne.deliveryMemberId = data.deliveryMemberId;
      this.dialogOptionsOne.gpoMemberId = data.gpoMemberId;
      this.dialogOptionsOne.drugsCode = data.drugsCode;
      this.dialogOptionsOne.isShowDialog = true;
    },
    dataLook2(data) {
      // console.log();
      this.dialogOptionsTwo.batchNo = data.batchNo;
      this.dialogOptionsTwo.deliveryMemberId = data.deliveryMemberId;
      this.dialogOptionsTwo.gpoMemberId = data.gpoMemberId;
      this.dialogOptionsTwo.drugsCode = data.drugsCode;
      this.dialogOptionsTwo.isShowDialog = true;
    },
    dataLook3(data) {
      this.dialogOptionsThree.batchNo = data.batchNo;
      this.dialogOptionsThree.gpoMemberId = data.gpoMemberId;
      this.dialogOptionsThree.drugsCode = data.drugsCode;
      this.dialogOptionsThree.isShowDialog = true;
    },
    // 关闭弹出框
    dialogHide() {
      this.dialogOptionsOne.isShowDialog = false;
    },
    // 查询条件获取
    dataSearch(datas) {
      const data = datas;
      this.filterForm = {
        producerName: data.producerName.value,
        drugsCode: data.drugsCode.value,
        batchNo: data.batchNo.value,
        drugsName: data.drugsName.value,
        deliveryMemberName: data.deliveryMemberName.value,
        num: data.num.value,
      };
      this.dataList(0, this.size, this.filterForm);
    },
    // 获取数据列表
    dataList(page, size, filterForm) {
      if (!this.getGpoId) {
        return false;
      }
      this.loading = true;
      this.filterForm.gpoMemberId = this.getGpoId;          // 默认的GPOID
      if (page !== undefined) this.page = page;
      if (size !== undefined) this.size = size;
      InvoiceGather.list(page || this.page, size || this.size, this.filterForm)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.tableNum = [];
            this.tableCount = 0;
            for (let i = 0; i < data.content.length; i += 1) {
              const numX = (i + 1) + (data.number * data.size);
              data.content[i].num = numX;
              data.content[i].deliveryNum = Number(data.content[i].deliveryNum);
              data.content[i].gpoNum = Number(data.content[i].gpoNum);
              data.content[i].gpoNum = data.content[i].gpoNum === 0 ? '' : data.content[i].gpoNum;
            }
            this.tableData = data.content;
            this.tableDataOld = data.content;
            this.$emit('page', data.number + 1, data.size, data.totalElements);
          }
          this.loading = false;
        });
      return true;
    },
    // 页码切换
    pageChange(page) {
      this.dataList(page, this.size);
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
<style>
.colorRed {
  color: red;
}
</style>
