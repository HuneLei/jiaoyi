<template>
  <div>
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
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
      <el-table-column prop="unitName" label="单位" align="left" width="60" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="hospitalUnitPrice" label="医院价" align="right" width="70" sortable show-overflow-tooltip>
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
      <el-table-column prop="enrollName" label="卖方会员" align="left" width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="projectName" label="集采项目" align="left" min-width="130" class-name="table_right" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="sl" label="已选配送企业数量" align="center" fixed="right" class-name="table_right" width="135" sortable="custom">
        <template scope="scope">
          <p>{{scope.row.sl}}</p>
        </template>
      </el-table-column>
      <el-table-column label="查看已选配送企业" align="center" fixed="right" width="135">
        <template scope="scope">
          <el-button @click="Deliver(scope.row, scope.$index)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="authbtn.salerMemberList" label="操作" align="center" width="100" max-width="100" fixed="right" sortable="custom">
        <template scope="scope">
          <el-button @click="ChooseDeliver(scope.row)" type="text" size="small" :disabled="scope.row.datetype === '0'">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    <DeliverDialog :options="dialogOptions" @dialog-hide="dialogHide"></DeliverDialog>
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
import ProducerChoseDelivery from '../../../api/Deliverrelation/ProducerChoseDelivery';
import DeliverDialog from './DeliverDialog';

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    // console.log();
    this.$bus.$on('table/height', this.tableHeightRun);     //  监听查询按钮的查看更多点击事件，重新计算表格高度
    // 监听页码切换
    this.$bus.$on('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$on('data/list', this.dataList);
    // 监听删除
    this.$bus.$on('components/Find', this.dataSearch);
    this.$bus.$on('data/getRes', this.getRes);    // 监听获取已选择配送商的列表结果
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
    this.$bus.$on('data/getRes', this.getRes);
  },
  components: {
    DeliverDialog,
  },
  computed: mapGetters([
    'getGpoId',
    'projectOptions',
    'getProjectId',
  ]),
  watch: {
    getProjectId() {
      // console.log();
      this.projectName = this.getProjectId;
      if (this.$route.path === '/Deliverrelation/ProducerChoseDelivery') {
        this.filterForm.projectId = this.getProjectId ? this.getProjectId : null; // 获取当前切换的集采项目号码
        this.dataList();
      }
    },
    getGpoId() {
      // console.log();
      if (this.$route.path === '/Deliverrelation/ProducerChoseDelivery') {
        this.dataList();
      }
    },
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
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
      // 筛选字段
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
        producerName: null,
        nametype: null,
        deliveryMemberName: null,
        projectSubId: null,
        // hospitalMemberName: null,
        // hospitalMemberId: null,
      },
      dialogFormVisible: false,
      page: 0,
      size: 20,
      nametype: '',
      projectName: this.getProjectId,
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
        enrollName: data.enrollName.value,
        nametype: data.nametype.value,
        projectId: data.projectId.value,
        projectSubId: data.projectSubId.value,
        // nametype: data.nametype.value,
      };
      // console.log();
      this.projectName = this.filterForm.projectId;
      this.dataList(0, this.size, this.filterForm);
    },
    // 数据更新
    dataUpdate(item) {
      this.$bus.$emit('data/update', item);
    },
    // 获取数据列表
    dataList(page, pageSizes, filterForm) {
      if (!this.getGpoId) {
        return false;
      }
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      this.filterForm.gpoMemberId = this.getGpoId;          // 默认的GPOID
      // this.filterForm.projectId = this.getProjectId;                  // 获取当前切换的集采项目号码
      // console.log();
      ProducerChoseDelivery.list(cpage, cpageSizes, this.filterForm)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.tableData = [];
            for (let i = 0; i < data.content.length; i += 1) {
              // data.content[i].num = (i + 1) + (cpage * cpageSizes);
              const numX = (i + 1) + (data.number * data.size);
              data.content[i].num = numX;
              // data.content[i].totalElements = 0;
              this.nametype = data.content[i].nametype;
              data.content[i].sl = Number(data.content[i].sl);
              data.content[i].hospitalUnitPrice = Number(data.content[i].hospitalUnitPrice);
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
    // 获取已选择配送商列表中的totalElements即已选择数量
    getRes(res) {
      this.totalElements = res.data.result.totalElements;
    },
    // 查看选择的配送企业
    Deliver(row, num) {
      // this.tableData[num].totalElements = this.totalElements;
      // this.dialogFormVisible = true;
      // this.dialogOptions.isShowDialog = true;
      // this.form = Object.assign({}, this.form, {
      //   drugsId: row.id,
      //   projectId: row.projectId,
      //   gpoMemberId: row.gpoMemberId,
      // });
      const form = {
        drugsId: row.id,
        projectId: row.projectId,
        gpoMemberId: row.gpoMemberId,
      };
      this.$bus.$emit('data/deliver', form);
    },
    // 关闭弹出框
    closeDialog() {
      this.dialogFormVisible = false;
    },
    //  操作里的选择跳转
    ChooseDeliver(row) {
      // console.log();
      this.$router.push({
        path: '/Deliverrelation/ProducerChoseDelivery/ChooseDeliver',
        query: { id: row.id, pid: row.projectId },
        // query: { id: row.id, pid: this.projectName || row.projectId },
      });
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

