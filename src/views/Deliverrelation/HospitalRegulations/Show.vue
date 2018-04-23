<template>
  <div>
    <el-table :data="tableData" ref="multipleTable" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column prop="num" label="#" width="40" fixed="left" class-name="table_right_fixed">
      </el-table-column>
      <el-table-column prop="hospitalMemberName" label="医疗机构" align="left" min-width="160" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="levelsName" label="机构级别" align="left" min-width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="hospitalCatalogName" label="机构类型" align="left" min-width="160" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="city" label="所在地区" align="left" min-width="160" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span>{{scope.row.provinceName}}{{scope.row.cityName}}{{scope.row.countyName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="theSelectedNum" label="已选品规" align="right" min-width="80" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <el-button @click="choose(scope.row, 1)" type="text" size="small" :disabled="!scope.row.theSelectedNum">{{scope.row.theSelectedNum || 0}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="notSelectedNum" label="未选品规" align="right" min-width="80" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <el-button @click="choose(scope.row, 2)" type="text" size="small" :disabled="!scope.row.notSelectedNum">{{scope.row.notSelectedNum || 0}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="countDeliveryNum" label="配送企业数量" align="right" min-width="105" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <el-button @click="choose(scope.row, 10)" type="text" size="small" :disabled="!scope.row.countDeliveryNum">{{scope.row.countDeliveryNum || 0}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="contractNum" label="已签订合同品规" align="right" min-width="120" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <el-button @click="choose(scope.row, 3)" type="text" size="small" :disabled="!scope.row.contractNum">{{scope.row.contractNum || 0}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="contractAmount" label="合同总金额" align="right" min-width="95" sortable show-overflow-tooltip>
        <template scope="scope">
          <el-button @click="choose(scope.row, 11)" type="text" size="small" :disabled="scope.row.contractAmount === null">{{(scope.row.contractAmount || 0).toFixed(2)}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="ordersNum" label="订单品规" align="right" min-width="80" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <el-button @click="choose(scope.row, 4)" type="text" size="small" :disabled="!scope.row.ordersNum">{{scope.row.ordersNum || 0}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="ordersAmount" label="已下订单金额" align="right" min-width="105" sortable show-overflow-tooltip>
        <template scope="scope">
          <el-button @click="choose(scope.row, 12)" type="text" size="small" :disabled="scope.row.ordersAmount === null">{{(scope.row.ordersAmount || 0).toFixed(2)}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="contractNum" label="已结算金额" align="right" min-width="95" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <!-- <el-button @click="choose(scope.row, 3)" type="text" size="small" :disabled="!scope.row.contractNum">{{scope.row.contractNum || 0}}</el-button> -->
        </template>
      </el-table-column>
      <el-table-column prop="contractNum" label="未结算金额" align="right" min-width="95" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <!-- <el-button @click="choose(scope.row, 3)" type="text" size="small" :disabled="!scope.row.contractNum">{{scope.row.contractNum || 0}}</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <DialogRegulations :options="dialogOptions" @dialog-hide="dialogHide" @data-loading="dataLoading"></DialogRegulations>
    <DialogContract :options="dialogOptionDialogContracts" @dialog-hide="dialogHide" @data-loading="dataLoading"></DialogContract>
    <DialogOrder :options="dialogOptionsDialogOrder" @dialog-hide="dialogHide" @data-loading="dataLoading"></DialogOrder>
    <DialogSend :options="dialogOptionsDialogSend" @dialog-hide="dialogHide" @data-loading="dataLoading"></DialogSend>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import HospitalRegulations from '../../../api/Deliverrelation/HospitalRegulations';
import DialogRegulations from './DialogRegulations';
import DialogContract from './DialogContract';
import DialogOrder from './DialogOrder';
import DialogSend from './DialogSend';
import convert from '../../../utils/convert'; // 引入js公共方法

export default {
  props: {
    authbtn: Object,
  },
  components: {
    DialogRegulations,
    DialogContract,
    DialogOrder,
    DialogSend,
  },
  activated() {
    this.$bus.$on('data/getprojectid', this.getprojectid);
    this.$bus.$on('table/height', this.tableHeightRun);     //  监听查询按钮的查看更多点击事件，重新计算表格高度
    // 监听页码切换
    this.$bus.$on('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$on('data/list', this.dataList);
    this.$bus.$on('export/data', this.dataExport); // 导出
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
    this.$bus.$off('export/data', this.dataExport); // 导出
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
      if (this.$route.path === '/General/HospitalRegulations') {
        this.filterForm.projectId = this.getProjectId ? this.getProjectId : null; // 获取当前切换的集采项目号码
        this.dataList();
      }
    },
    getGpoId() {
      if (this.$route.path === '/General/HospitalRegulations') {
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
      dialogOptionsDialogSend: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: null,                //  默认表格选中
        tableType: 0,                       //  0 单选，1 多选 默认单选
        createDate: null,
      },
      dialogOptionDialogContracts: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: null,                //  默认表格选中
        tableType: 0,                       //  0 单选，1 多选 默认单选
        createDate: null,
      },
      dialogOptionsDialogOrder: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: null,                //  默认表格选中
        tableType: 0,                       //  0 单选，1 多选 默认单选
        createDate: null,
      },
      tableData: [],
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      selectData: [],
      filterForm: {
        projectId: null,
        gpoMemberId: null,
        hospitalMemberName: null,
        hospitalCatalog: [],
        levels: [],
        createDate: null,
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
    a(rows) {
      this.$refs.multipleTable.toggleRowSelection(rows[0]);
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
        hospitalCatalog: data.hospitalCatalog.value,
        levels: data.levels.value,
        createDate: data.createDate.value,
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
      this.filterForm.gpoMemberId = this.getGpoId;          // 默认的GPOID
      const form = this.filterForm;
      let createDate = '';
      if (form.createDate && typeof form.createDate === 'object') {
        createDate = `${form.createDate.replace(/\//g, '-')}`;
      } else {
        createDate = form.createDate;
      }
      if (createDate === '1980-01-01') {
        form.createDate = null;
      } else {
        form.createDate = createDate;
      }
      HospitalRegulations.list(cpage, cpageSizes, form)
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
              data.content[i].contractAmount = Number(data.content[i].contractAmount);
              data.content[i].ordersAmount = Number(data.content[i].ordersAmount);
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
    // 查看选择的配送企业
    choose(row, type) {
      this.form = Object.assign({}, this.form, {
        projectId: row.projectId,
        gpoMemberId: this.getGpoId,
        hospitalMemberId: row.hospitalMemberId,
        type,
        createDate: this.filterForm.createDate,
      });
      console.log('type', type);
      switch (type) {
        case 10:  //  配送企业数量
          this.dialogOptionsDialogSend.isShowDialog = true;
          this.$bus.$emit('data/choose/DialogSend', this.form);
          break;
        case 11:  //  合同金额
          this.dialogOptionDialogContracts.isShowDialog = true;
          this.$bus.$emit('data/choose/DialogContract', this.form);
          break;
        case 12:  //  已下订单金额
          this.dialogOptionsDialogOrder.isShowDialog = true;
          this.$bus.$emit('data/choose/DialogOrder', this.form);
          break;
        default:
          this.dialogOptions.isShowDialog = true;
          this.$bus.$emit('data/choose', this.form);
          break;
      }
    },
    // 导出
    dataExport() {
      const form = {
        gpoMemberId: this.filterForm.gpoMemberId,
      };
      if (this.filterForm.hospitalMemberName !== 'undefined' && this.filterForm.hospitalMemberName) {
        form.hospitalMemberName = this.filterForm.hospitalMemberName;
      }
      if (this.filterForm.projectId !== 'undefined' && this.filterForm.projectId) {
        form.projectId = this.filterForm.projectId;
      }
      if (this.filterForm.hospitalCatalog !== 'undefined' && this.filterForm.hospitalCatalog) {
        form.hospitalCatalog = this.filterForm.hospitalCatalog;
      }
      if (this.filterForm.levels !== 'undefined' && this.filterForm.levels) {
        form.levels = this.filterForm.levels;
      }
      if (this.filterForm.createDate !== 'undefined' && this.filterForm.createDate) {
        form.createDate = this.filterForm.createDate;
      }
      const url = HospitalRegulations.output(form);
      window.open(url);
    },
    dataLoading() {
      this.loading = true;
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

