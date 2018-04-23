<template>
  <div>
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" @selection-change="dataSelect" stripe border fit @sort-change="sortChange">
      <el-table-column type="selection" width="40" align="left" show-overflow-tooltip v-if="this.View_UserInfo.memberType === 2">
      </el-table-column>
      <el-table-column prop="num" label="#" width="40" fixed="left">
      </el-table-column>
      <el-table-column prop="drugsCode" label="药品编码" align="left" width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="drugsName" label="通用名" align="left" width="120" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="formName" label="剂型" align="left" width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="specName" label="规格" align="left" width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="packSpecName" label="包装规格" align="left" width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="unitName" label="单位" align="left" width="60" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="hospitalUnitPrice" label="医院价" align="right" width="70" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <p>{{scope.row.hospitalUnitPrice.toFixed(2)}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="approvalNumber" label="批准文号" align="left" width="130" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="tradeName" label="商品名" align="left" width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="producerName" label="生产企业" align="left" width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <!--<el-table-column prop="salerMemberName" label="卖方会员" align="left" width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>-->
      <el-table-column prop="deliveryMemberName" label="配送企业" align="left" width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="idDeliveryAffirm" sortable="custom" label="配送企业确认状态" width="120" show-overflow-tooltip>
        <template scope="scope">
          <span v-if="scope.row.idDeliveryAffirm === 0" style="color: blue">未确认</span>
          <span v-if="scope.row.idDeliveryAffirm === 1" style="color: green">已确认</span>
          <span v-if="scope.row.idDeliveryAffirm === 2" style="color: blue">已拒绝</span>
        </template>
      </el-table-column>
      <el-table-column prop="projectName" label="集采项目" align="left" min-width="130" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="projectSubName" label="集采子项目" align="left" min-width="130" class-name="table_right" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="150" max-width="200" fixed="right" v-if="authbtn.confirm || authbtn.cancel ||authbtn.refuse">
        <template scope="scope">
          <el-button @click="affirm(scope.row, scope.$index)" type="text" size="small" :disabled="scope.row.idDeliveryAffirm === 2 || Number(scope.row.datetype) === 0">{{scope.row.idDeliveryAffirm === 1 ? '取消确认': '确认'}}</el-button>
          <el-button @click="refuse(scope.row, scope.$index)" type="text" size="small" :disabled="scope.row.idDeliveryAffirm === 1 || Number(scope.row.datetype) === 0">{{scope.row.idDeliveryAffirm === 2 ? '取消拒绝': '拒绝'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import DeliveryAffirm from '../../../api/Deliverrelation/DeliveryAffirm';  // 药品确认api

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
    this.$bus.$on('affirm/choose', this.affirmChoose);
    // 监听删除
    this.$bus.$on('components/Find', this.dataSearch);
    this.$bus.$on('export/data', this.dataExport); // 导出
    // console.log();
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
    this.$bus.$off('affirm/choose', this.affirmChoose);
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
  computed: mapGetters([
    'getGpoId',
    'projectOptions',
    'getProjectId',
    'View_UserInfo',
  ]),
  watch: {
    getProjectId() {
      if (this.$route.path === '/Deliverrelation/DeliveryAffirm') {
        this.filterForm.projectId = this.getProjectId; // 获取当前切换的集采项目号码
        this.dataList();
      }
    },
    getGpoId() {
      if (this.$route.path === '/Deliverrelation/DeliveryAffirm') {
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
      selectIds: [],
      selectData: [],
      // 筛选字段
      filterForm: {
        deliveryMemberId: null,
        projectId: null,
        gpoMemberId: null,
        drugsCode: null,
        drugsName: null,
        specName: null,
        tradeName: null,
        formName: null,
        approvalNumber: null,
        enrollName: null,
        producerName: null,
        idDeliveryAffirm: null,
        deliveryMemberName: null,
        hospitalMemberName: null,
        projectSubId: null,
      },
      tableshow: true,
      dialogFormVisible: false,
      page: 0,
      size: 20,
      ids: [],
      form: {},
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
    // 批量确认
    affirmChoose() {
      // console.log();
      if (this.ids.length === 0) {
        this.$message({
          type: 'error',
          message: '当前未选择需确认的选项',
        });
        return false;
      }
      // console.log();
      this.loading = true;
      this.form = Object.assign({}, this.form, {
        deleteid: this.ids,
      });
      DeliveryAffirm.confirm(this.form).then((res) => {
        // console.log();
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '确认成功',
          });
          this.$bus.$emit('data/list');
        }
        this.loading = false;
      });
      return true;
    },
    // 确认操作
    affirm(row, num) {
      this.loading = true;
      this.form = Object.assign({}, this.form, {
        deleteid: [row.id],
      });
      if (this.tableData[num].idDeliveryAffirm) {
        DeliveryAffirm.cancel(this.form).then((res) => {
          // console.log();
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '取消确认成功',
            });
            this.ids = [];
            this.$bus.$emit('data/list');
          }
          this.loading = false;
        });
      } else {
        DeliveryAffirm.confirm(this.form).then((res) => {
          // console.log();
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '确认成功',
            });
            this.ids = [];
            this.$bus.$emit('data/list');
          }
          this.loading = false;
        });
      }
    },
    // 拒绝操作
    refuse(row, num) {
      this.loading = true;
      this.form = Object.assign({}, this.form, {
        deleteid: [row.id],
      });
      if (this.tableData[num].idDeliveryAffirm) {
        DeliveryAffirm.cancel(this.form).then((res) => {
          // console.log();
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '取消拒绝成功',
            });
            this.ids = [];
            this.$bus.$emit('data/list');
          }
          this.loading = false;
        });
      } else {
        DeliveryAffirm.refuse(this.form).then((res) => {
          // console.log();
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '拒绝成功',
            });
            this.ids = [];
            this.$bus.$emit('data/list');
          }
          this.loading = false;
        });
      }
    },
    // 关闭弹出框
    dialogHide() {
      this.dialogOptions.isShowDialog = false;
    },
    //  接受查询条件
    dataSearch(data) {
      // console.log();
      this.filterForm = {
        drugsCode: data.drugsCode.value,
        drugsName: data.drugsName.value,
        producerName: data.producerName.value,
        formName: data.formName.value,
        specName: data.specName.value,
        tradeName: data.tradeName.value,
        approvalNumber: data.approvalNumber.value,
        // enrollName: data.enrollName.value,
        deliveryMemberName: data.deliveryMemberName.value,
        idDeliveryAffirm: data.idDeliveryAffirm.value,
        projectId: data.projectId.value,
        projectSubId: data.projectSubId.value,
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
      // console.log();
      DeliveryAffirm.list(cpage, cpageSizes, this.filterForm)
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
              data.content[i].hospitalUnitPrice = Number(data.content[i].hospitalUnitPrice);
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
    // 多选框选择
    dataSelect(row) {
      // console.log();
      this.ids = [];
      for (let i = 0; i < row.length; i += 1) {
        if (Number(row[i].idDeliveryAffirm) === 0 && Number(row[i].datetype) === 1) {
          this.ids.push(row[i].id);
        }
      }
      this.$bus.$emit('data/select', this.ids);
    },
    // 导出
    dataExport() {
      const form = {
        gpoMemberId: this.filterForm.gpoMemberId,
      };
      if (this.filterForm.projectId !== 'undefined' && this.filterForm.projectId) {
        form.projectId = this.filterForm.projectId;
      }
      if (this.filterForm.drugsCode !== 'undefined' && this.filterForm.drugsCode) {
        form.drugsCode = this.filterForm.drugsCode;
      }
      if (this.filterForm.drugsName !== 'undefined' && this.filterForm.drugsName) {
        form.drugsName = this.filterForm.drugsName;
      }
      if (this.filterForm.producerName !== 'undefined' && this.filterForm.producerName) {
        form.producerName = this.filterForm.producerName;
      }
      if (this.filterForm.enrollName !== 'undefined' && this.filterForm.enrollName) {
        form.enrollName = this.filterForm.enrollName;
      }
      if (this.filterForm.formName !== 'undefined' && this.filterForm.formName) {
        form.formName = this.filterForm.formName;
      }
      if (this.filterForm.specName !== 'undefined' && this.filterForm.specName) {
        form.specName = this.filterForm.specName;
      }
      if (this.filterForm.tradeName !== 'undefined' && this.filterForm.tradeName) {
        form.tradeName = this.filterForm.tradeName;
      }
      if (this.filterForm.approvalNumber !== 'undefined' && this.filterForm.approvalNumber) {
        form.approvalNumber = this.filterForm.approvalNumber;
      }
      // if (this.filterForm.enrollName !== 'undefined' && this.filterForm.enrollName) {
      //   form.enrollName = this.filterForm.enrollName;
      // }
      if (this.filterForm.idDeliveryAffirm !== 'undefined' && this.filterForm.idDeliveryAffirm) {
        form.idDeliveryAffirm = this.filterForm.idDeliveryAffirm;
      }
      if (this.filterForm.idDeliveryAffirm === 0) {
        form.idDeliveryAffirm = this.filterForm.idDeliveryAffirm;
      }
      if (this.filterForm.deliveryMemberName !== 'undefined' && this.filterForm.deliveryMemberName) {
        form.deliveryMemberName = this.filterForm.deliveryMemberName;
      }
      if (this.filterForm.projectSubId !== 'undefined' && this.filterForm.projectSubId) {
        form.projectSubId = this.filterForm.projectSubId;
      }
      const url = DeliveryAffirm.output(form);
      window.open(url);
    },
    // 关闭弹出框
    closeDialog() {
      this.dialogFormVisible = false;
      // console.log();
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
