<template>
  <div>
    <el-table :data="tableData" ref="multipleTable" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column prop="num" label="#" width="40" fixed="left">
      </el-table-column>
      <el-table-column prop="drugsCode" label="药品编码" align="left" width="90"  sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="drugsName" label="通用名" align="left" width="120"  sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="tradeName" label="商品名" align="left" width="80"  sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="formName" label="剂型" align="left" width="90"  sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="specName" label="规格" align="left" width="90"  sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="packSpecName" label="包装规格" align="left" width="90"  sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="unitName" label="单位" align="left" width="60"  sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="hospitalUnitPrice" label="单价" align="right" width="70"  sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <p>{{scope.row.hospitalUnitPrice.toFixed(2)}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="producerName" label="生产企业" align="left" width="180"  sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="salerMemberName" label="卖方会员" align="left" width="180"  sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="approvalNumber" label="批准文号" align="left" width="130"  sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="projectName" label="集采项目" align="left" min-width="130"  sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliveryMemberName" label="配送企业" align="center" fixed="right" width="180" class-name="table_right"  sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="120" max-width="200" fixed="right" v-if="authbtn.update || authbtn.empty">
        <template scope="scope">
          <el-button @click="choose(scope.row)" type="text" size="small" :disabled="Number(scope.row.datetype) === 0" v-if="authbtn.update">选择 </el-button>
          <el-button @click="empty(scope.row)" type="text" size="small" v-if="authbtn.empty"> 清空</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="hospitalMemberName" label="医疗机构" align="left" width="160" class-name="table_right"  sortable="custom" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <ChooseDialog :options="dialogOptions" @dialog-hide="dialogHide" @a="a" @data-loading="dataLoading"></ChooseDialog>
    <Enterprise></Enterprise>
  </div>
</template>

<script>
/**
 * Created by yaoling on 2017/6/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import HospitalChoseDelivery from '../../../api/Deliverrelation/HospitalChoseDelivery';
import ChooseDialog from './ChooseDialog';
import Enterprise from './Enterprise';

export default {
  props: {
    authbtn: Object,
  },
  components: {
    ChooseDialog,
    Enterprise,
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
      this.filterForm.hospitalMemberName = this.getPrincipal.memberName;
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
    this.$bus.$off('export/data', this.dataExport); // 导出
    // 监听删除
    this.$bus.$off('components/Find', this.dataSearch);
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
    // this.dataList();
  },
  computed: {
    getPrincipal() {
      return this.$store.state.view.principal;
    },
    ...mapGetters([
      'projectOptions',
      'View_UserInfo',
      'getGpoId',
      'getProjectId',
    ]),
  },
  watch: {
    getProjectId() {
      if (this.$route.path === '/Deliverrelation/HospitalChoseDelivery') {
        this.filterForm.projectId = this.getProjectId ? this.getProjectId : null; // 获取当前切换的集采项目号码
        this.filterForm.hospitalMemberName = this.getPrincipal.memberName;
        this.dataList();
      }
    },
    getGpoId() {
      if (this.$route.path === '/Deliverrelation/HospitalChoseDelivery') {
        this.filterForm.hospitalMemberName = this.getPrincipal.memberName;
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
        gpoMemberId: null,
        drugsCode: null,
        drugsName: null,
        specName: null,
        tradeName: null,
        formName: null,
        approvalNumber: null,
        enrollName: null,
        nameType: null,
        producerName: null,
        deliveryMemberName: null,
        hospitalMemberName: null,
        projectSubId: null,
      },
      page: 0,
      size: 20,
      dialogFormVisible: false,
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
    empty(row) {
      console.log('row', row);
      if (!row.deliveryMemberId) {
        this.$message({
          type: 'error',
          message: '当前没有可供清空的配送企业',
        });
        return false;
      }
      HospitalChoseDelivery.empty(row.eid, row.projectId, row.gpoMemberId,
        row.hospitalMemberId, row.deliveryMemberId, row.drugsId).then((res) => {
          // console.log();
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '清空成功',
            });
          }
          this.$bus.$emit('data/list');
        });
      return true;
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
        hospitalMemberName: data.hospitalMemberName.value,
        formName: data.formName.value,
        specName: data.specName.value,
        tradeName: data.tradeName.value,
        approvalNumber: data.approvalNumber.value,
        enrollName: data.enrollName.value,
        nameType: data.nameType.value,
        deliveryMemberName: data.deliveryMemberName.value,
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
      // console.log();
      HospitalChoseDelivery.list(cpage, cpageSizes, this.filterForm)
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
    // 页码切换
    pageChange(page) {
      this.dataList(page, this.size);
    },
    // 查看选择的配送企业
    choose(row) {
      console.log('row', row);
      this.dialogFormVisible = true;
      this.dialogOptions.isShowDialog = true;
      this.form = Object.assign({}, this.form, {
        drugsId: row.drugsId,
        projectId: row.projectId,
        gpoMemberId: this.getGpoId,
        salerMemberId: row.salerMemberId,
        hospitalMemberId: row.hospitalMemberId,
        deliveryMemberId: row.deliveryMemberId,
        hospitalMemberCode: row.hospitalMemberCode,
        hospitalMemberName: row.hospitalMemberName,
        nametype: row.nametype,
        salerMemberCode: row.salerMemberCode,
        salerMemberName: row.salerMemberName,
        updateid: row.updateid,
        hospitalUnitPrice: row.hospitalUnitPrice,
      });
      // console.log();
      this.$bus.$emit('data/choose', this.form);
    },
    dataLoading() {
      this.loading = true;
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
      if (this.filterForm.hospitalMemberName !== 'undefined' && this.filterForm.hospitalMemberName) {
        form.hospitalMemberName = this.filterForm.hospitalMemberName;
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
      if (this.filterForm.enrollName !== 'undefined' && this.filterForm.enrollName) {
        form.enrollName = this.filterForm.enrollName;
      }
      if (this.filterForm.nameType !== 'undefined' && this.filterForm.nameType) {
        form.nameType = this.filterForm.nameType;
      }
      if (this.filterForm.deliveryMemberName !== 'undefined' && this.filterForm.deliveryMemberName) {
        form.deliveryMemberName = this.filterForm.deliveryMemberName;
      }
      if (this.filterForm.projectSubId !== 'undefined' && this.filterForm.projectSubId) {
        form.projectSubId = this.filterForm.projectSubId;
      }
      // console.log();
      const url = HospitalChoseDelivery.output(form);
      window.open(url);
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
