<template>
  <div>
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column prop="num" label="#" width="40" fixed="left" class-name="table_right_fixed">
      </el-table-column>
      <div v-if="filterForm.objectType === 1">
        <el-table-column prop="hospitalMemberCode" label="医院编码" align="left" width="100" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="hospitalMemberName" label="医院名称" align="left" min-width="160" sortable="custom" show-overflow-tooltip>
        </el-table-column>
      </div>
      <div v-if="filterForm.objectType === 2">
        <el-table-column prop="deliveryMemberCode" label="配送企业编码" align="left" width="100" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="deliveryMemberName" label="配送企业名称" align="left" min-width="160" sortable="custom" show-overflow-tooltip>
        </el-table-column>
      </div>
      <el-table-column prop="drugsCode" label="药品编码" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="drugsName" label="通用名" align="left" min-width="120" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="tradeName" label="商品名" align="left" min-width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="formName" label="剂型" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="specName" label="规格" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="packSpecName" label="包装规格" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="unitName" label="单位" align="left" min-width="60" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="reportNum" label="报量数量" align="right" min-width="80" sortable="custom" show-overflow-tooltip v-if="filterForm.objectType === 1">
      </el-table-column>
      <el-table-column prop="contractNum" label="合同数量" align="right" min-width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="ordersNum" label="订单数量" align="right" min-width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliverNum" label="发货数量" align="right" min-width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="invoicedNum" label="开票数量" align="right" min-width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="storageNum" label="入库数量" align="right" min-width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import PurchaseAnalysis from '../../../api/General/PurchaseAnalysis';
import convert from '../../../utils/convert'; // 引入js公共方法

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    this.$bus.$on('data/getprojectid', this.getprojectid);
    this.$bus.$on('table/height', this.tableHeightRun);     //  监听查询按钮的查看更多点击事件，重新计算表格高度
    // 监听页码切换
    this.$bus.$on('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$on('data/list', this.dataList);
    // this.$bus.$on('export/data', this.dataExport); // 导出
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
    this.$bus.$off('data/getprojectid', this.getprojectid);
    this.$bus.$off('table/height', this.tableHeightRun);
    // 监听页码切换
    this.$bus.$off('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$off('data/list', this.dataList);
    // 监听删除
    this.$bus.$off('components/Find', this.dataSearch);
    // this.$bus.$off('export/data', this.dataExport); // 导出
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
    // this.dataList();
  },
  computed: mapGetters([
    'getGpoId',
    'projectOptions',
    'getProjectId',
    'View_UserInfo',
  ]),
  watch: {
    getProjectId() {
      if (this.$route.path === '/General/PurchaseAnalysis') {
        this.filterForm.projectId = this.getProjectId ? this.getProjectId : null; // 获取当前切换的集采项目号码
        this.dataList();
      }
    },
    getGpoId() {
      if (this.$route.path === '/General/PurchaseAnalysis') {
        this.dataList();
      }
    },
  },
  data() {
    return {
      tableHeight: 650,
      dialogOptions: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: null,                //  默认表格选中
        tableType: 0,                       //  0 单选，1 多选 默认单选
      },
      tableData: [],
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      selectData: [],
      filterForm: {
        projectId: null,
        drugsCode: null,
        drugsName: null,
        objectType: 1,
        hospitalMemberName: null,
        deliveryMemberName: null,
        producerName: null,
        dataTime: null,
      },
      page: 0,
      size: 20,
      projectId: this.getProjectId,
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
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
    // 关闭弹出框
    dialogHide() {
      this.dialogOptions.isShowDialog = false;
      this.dialogOptionsDialogSend.isShowDialog = false;
      this.dialogOptionDialogContracts.isShowDialog = false;
      this.dialogOptionsDialogOrder.isShowDialog = false;
    },
    //  接受查询条件
    dataSearch(data) {
      this.filterForm = {
        ...this.filterForm,
        hospitalMemberName: data.hospitalMemberName.value,
        projectId: data.projectId.value,
        drugsCode: data.drugsCode.value,
        drugsName: data.drugsName.value,
        objectType: data.objectType.value,
        deliveryMemberName: data.deliveryMemberName.value,
        producerName: data.producerName.value,
        dataTime: data.dataTime.value,
      };
      // console.log();
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
      const form = this.filterForm;
      let dataTime = '';
      if (form.dataTime && typeof form.dataTime === 'object') {
        dataTime = `${form.dataTime[0].replace(/\//g, '-')} - ${form.dataTime[1].replace(/\//g, '-')}`;
      } else {
        dataTime = form.dataTime;
      }
      if (dataTime === '1970-01-01 - 1970-01-01') {
        form.dataTime = null;
      } else {
        form.dataTime = dataTime;
      }
      // this.filterForm.gpoMemberId = this.getGpoId;          // 默认的GPOID
      PurchaseAnalysis.list(cpage, cpageSizes, form)
        .then((res) => {
          // console.log();
          if (res.data.code === 0) {
            const data = res.data.result;
            this.tableData = [];
            this.tableNum = [];
            this.tableCount = 0;
            for (let i = 0; i < data.content.length; i += 1) {
              const numX = (i + 1) + (data.number * data.size);
              data.content[i].num = numX;
              this.tableNum.push(numX);
            }
            this.tableDataOld = data.content;
            this.tableData = data.content;
            this.page = data.number;
            this.size = data.size;
            this.$emit('page', data.number + 1, data.size, data.totalElements, data.totalPages);
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
        this.tableHeight = window.tableCustom.tableHeight(['.find', '.paging', 135]);
      };
      setTimeout(tableHeightFun, 0);
    },
  },
};
</script>

<style scoped>
.text_right {
  text-align: right;
  width: 100%;
}
</style>

