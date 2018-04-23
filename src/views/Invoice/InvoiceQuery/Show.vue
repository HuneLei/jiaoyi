<template>
  <div>
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column prop="num" fixed="left" label="#" width="40">
      </el-table-column>
      <el-table-column prop="hospitalMemberName" label="医疗机构" align="left" min-width="180" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="药品信息" align="center" min-width="180" show-overflow-tooltip>
        <el-table-column prop="drugsCode" label="药品编码" align="left" min-width="90" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="drugsName" label="通用名" align="left" min-width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="tradeName" label="商品名" align="left" min-width="80" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="formName" label="剂型" align="left" min-width="90" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="specName" label="规格" align="left" min-width="90" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="packSpecName" label="包装规格" align="left" min-width="90" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="unitName" label="单位" align="left" min-width="60" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="batchNo" label="批号" align="left" min-width="120" show-overflow-tooltip>
        </el-table-column>
      </el-table-column>
      <el-table-column label="配送企业发票" align="center" min-width="180" show-overflow-tooltip>
        <el-table-column prop="deliveryMemberName" label="配送企业" align="left" min-width="180" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="code" label="发票代码" align="left" min-width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="number" label="发票号" align="left" min-width="80" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="drugsNum" label="开票数量" align="right" min-width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column min-width="120" align="center" label="附件" fixed="right" show-overflow-tooltip>
          <template scope="scope">
            <YuploadFiles :data="convert.getJSON(scope.row.orderFile)"></YuploadFiles>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="GPO发票" align="center" min-width="180" show-overflow-tooltip>
        <el-table-column prop="gpoMemberName" label="GPO名称" align="left" min-width="180" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="gpoCode" label="发票代码" align="left" min-width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="gpoNumber" label="发票号" align="left" min-width="80" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="gpoDrugsNum" label="开票数量" align="right" min-width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="gpoNum" label="勾稽数量" align="right" min-width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column min-width="120" align="center" label="附件" fixed="right" show-overflow-tooltip>
          <template scope="scope">
            <YuploadFiles :data="convert.getJSON(scope.row.gpoScanFile)"></YuploadFiles>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="生产企业发票" align="center" min-width="180" show-overflow-tooltip>
        <el-table-column prop="salerMemberName" label="卖方会员" align="left" min-width="180" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="salerCode" label="发票代码" align="left" min-width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="salerNumber" label="发票号" align="left" min-width="80" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="salerDrugsNum" label="开票数量" align="right" min-width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="salerNum" label="勾稽数量" align="right" min-width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column min-width="120" align="center" label="附件" fixed="right" show-overflow-tooltip>
          <template scope="scope">
            <YuploadFiles :data="convert.getJSON(scope.row.salerScanFile)"></YuploadFiles>
          </template>
        </el-table-column>
      </el-table-column>
        <el-table-column prop="producerName" label="生产企业" align="left" min-width="180" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="approvalNumber" label="批准文号" align="left" min-width="130" show-overflow-tooltip>
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import convert from '../../../utils/convert'; // 引入js公共方法
import InvoiceQuery from '../../../api/Invoice/InvoiceQuery';

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
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  watch: {
    getProjectId() {
      if (this.$route.path === '/Invoice/InvoiceQuery') {
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
        gpoMemberId: null,
        hospitalMemberName: null,
        deliveryMemberName: null,
        number: null,
        invoiceDate: `${this.convertDate(new Date().setTime(new Date().getTime() - (3600 * 1000 * 24 * 30)))} - ${this.convertDate(new Date())}`,
        drugsCode: null,
        drugsName: null,
        producerName: null,
        salerMemberName: null,
        batchNo: null,
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
      let invoiceDate = '';
      if (data.invoiceDate.value && typeof data.invoiceDate.value === 'object') {
        invoiceDate = `${data.invoiceDate.value[0].replace(/\//g, '-')} - ${data.invoiceDate.value[1].replace(/\//g, '-')}`;
      } else {
        invoiceDate = data.invoiceDate.value;
      }
      if (invoiceDate === '1970-01-01 - 1970-01-01') {
        data.invoiceDate.value = null;
      } else {
        data.invoiceDate.value = invoiceDate;
      }
      this.filterForm = {
        hospitalMemberName: data.hospitalMemberName.value,
        deliveryMemberName: data.deliveryMemberName.value,
        number: data.number.value,
        invoiceDate: data.invoiceDate.value,
        drugsCode: data.drugsCode.value,
        drugsName: data.drugsName.value,
        producerName: data.producerName.value,
        salerMemberName: data.salerMemberName.value,
        batchNo: data.batchNo.value,
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
      InvoiceQuery.list(page || this.page, size || this.size, this.filterForm)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.tableNum = [];
            this.tableCount = 0;
            for (let i = 0; i < data.content.length; i += 1) {
              const numX = (i + 1) + (data.number * data.size);
              data.content[i].num = numX;
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
