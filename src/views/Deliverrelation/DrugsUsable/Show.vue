<template>
  <div>
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column prop="num" label="#" width="40" fixed="left">
      </el-table-column>
      <el-table-column prop="drugsCode" label="药品编码" align="left" width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="drugsName" label="通用名" align="left" width="120" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="tradeName" label="商品名" align="left" width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="formName" label="剂型" align="left" width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="specName" label="规格" align="left" width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="packSpecName" label="包装规格" align="left" width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="unitName" label="单位" align="left" width="60" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <!-- <el-table-column v-if="this.View_UserInfo.memberType === 2 || this.View_UserInfo.memberType === 4 || this.View_UserInfo.memberType === 5" prop="protocolPrice" label="协议单价" align="right" width="80" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <p>{{scope.row.protocolPrice.toFixed(4)}}</p>
        </template>
      </el-table-column> -->
      <el-table-column prop="hospitalUnitPrice" label="单价" align="right" width="80" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <p>{{scope.row.hospitalUnitPrice.toFixed(2)}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="approvalNumber" label="批准文号" align="left" width="130" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="hospitalMemberName" label="医疗机构名称" align="left" width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <!--<el-table-column prop="hospitalMemberCode" label="医疗机构编码" align="left" width="100"  sortable="custom" show-overflow-tooltip>
          </el-table-column>-->
      <el-table-column prop="producerName" label="生产企业" align="left" width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliveryMemberName" label="配送企业" align="left" width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <!--<el-table-column prop="salerMemberName" label="卖方会员" align="left" width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>-->
      <el-table-column prop="projectName" label="集采项目" align="left" min-width="130" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="projectSubName" label="集采子项目" align="left" min-width="130" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <!--<el-table-column prop="salerUserName" label="卖方操作人" align="left" width="100" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="salerDate" label="卖方操作时间" align="left" width="140" sortable="custom" show-overflow-tooltip>
      </el-table-column>-->
      <el-table-column prop="deliveryUserName" label="配送企业操作人" align="left" width="120" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliveryDate" label="配送企业操作时间" align="left" width="140" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="hospitalUserName" label="买方操作人" align="left" width="100" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="hospitalDate" label="买方操作时间" align="left" width="140" class-name="table_right" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="enable" label="启用状态" align="left" width="80" class-name="table_right" fixed="right" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span v-if="scope.row.enable === true" style="color: green">启用</span>
          <span v-if="scope.row.enable === false" style="color: red">禁用</span>
        </template>
      </el-table-column>
      <el-table-column v-if="authbtn.update" label="操作" align="center" min-width="100" max-width="200" fixed="right" prop="enable">
        <template scope="scope">
          <el-switch v-model="scope.row.enable" on-color="#13ce66" off-color="#ff4949" on-text="启用" off-text="禁用" @change="changeStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
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
import config from '../../../config';
import DrugsUsable from '../../../api/Deliverrelation/DrugsUsable';  // 可采药品api

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    this.$bus.$on('table/height', this.tableHeightRun);     //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$on('page/change', this.pageChange);
    this.$bus.$on('data/list', this.dataList);
    this.$bus.$on('export/data', this.dataExport); // 导出
    this.$bus.$on('addressOutput/data', this.addressExport); // 医院地址导出
    this.$bus.$on('components/Find', this.dataSearch);
    this.$bus.$on('synchronous/data', this.dataSynchronous); // 同步交易中心
    if (this.getGpoId) {
      if (this.getProjectId) {
        this.filterForm.projectId = this.getProjectId;
      }
      this.dataList();
    }
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun);
    this.$bus.$off('page/change', this.pageChange);
    this.$bus.$off('data/list', this.dataList);
    this.$bus.$off('export/data', this.dataExport); // 导出
    this.$bus.$off('addressOutput/data', this.addressExport); // 医院地址导出
    this.$bus.$off('components/Find', this.dataSearch);
    this.$bus.$off('synchronous/data', this.dataSynchronous);
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
      if (this.$route.path === '/Deliverrelation/DrugsUsable') {
        this.filterForm.projectId = this.getProjectId; // 获取当前切换的集采项目号码
        this.dataList();
      }
    },
    getGpoId() {
      if (this.$route.path === '/Deliverrelation/DrugsUsable') {
        this.dataList();
      }
    },
  },
  data() {
    return {
      tableHeight: 650,
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
        producerName: null,
        enable: null,
        deliveryMemberName: null,
        hospitalMemberName: null,
        hospitalMemberCode: null,
        salerMemberName: null,
        projectSubId: null,
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
    // 查询条件获取
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
        // salerMemberName: data.salerMemberName.value,
        enable: data.enable.value,
        hospitalMemberName: data.hospitalMemberName.value,
        deliveryMemberName: data.deliveryMemberName.value,
        projectId: data.projectId.value,
        projectSubId: data.projectSubId.value,
      };
      this.dataList(0, this.size, this.filterForm);
    },
    // // 开启关闭状态
    changeStatus(row) {
      /**
       *  集采项目开启关闭状态操作
       *  当项目默认是开启状态[需要关闭] ： 当前默认openStatus === true, 点击switch就会自动变为openStatus === false,
       *        我们手动转化openStatus === false避免未请求就变化按钮。传值：openStatus = 0
       *  当项目默认是关闭状态[需要开启] ： 当前默认openStatus === false, 点击switch就会自动变为openStatus === true,
       *        我们手动转化openStatus === true避免未请求就变化按钮。传值：openStatus = 1
       */
      // console.log();
      const index = this.tableData.indexOf(row);
      // console.log();
      let i = '';
      if (this.tableData[index].enable === true) {
        // 开启项目
        this.tableData[index].enable = false;
        i = 1;
      } else {
        // 关闭项目
        this.tableData[index].enable = true;
        i = 0;
      }
      const id = row.id;                  // 集采项目Id
      let prompt;
      if (i === 1) {
        prompt = '启用成功';
      } else {
        prompt = '禁用成功';
      }
      // 更新请求
      DrugsUsable.update(id, i).then((res) => {
        // console.log();
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: prompt,
          });
          this.dataList(this.page, this.size);
        } else {
          this.$message({
            type: 'error',
            message: '操作失败',
          });
        }
      });
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
      if (this.View_UserInfo.memberType !== 4 && this.View_UserInfo.memberType !== 5) {
        this.filterForm.enable = 1;
      }
      DrugsUsable.list(cpage, cpageSizes, this.filterForm)
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
              if (data.content[i].enable === 1) {
                data.content[i].enable = true;
              } else {
                data.content[i].enable = false;
              }
              // console.log();
              data.content[i].protocolPrice = data.content[i].protocolPrice === 'null' ? '' : data.content[i].protocolPrice;
              data.content[i].hospitalUnitPrice = Number(data.content[i].hospitalUnitPrice);
              data.content[i].protocolPrice = Number(data.content[i].protocolPrice);
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
    // 导出
    dataExport() {
      const form = {
        gpoMemberId: this.filterForm.gpoMemberId,
        // projectId: this.filterForm.projectId,
      };
      if (this.filterForm.projectId !== 'undefined' && this.filterForm.projectId) {
        form.projectId = this.filterForm.projectId;
      }
      if (this.filterForm.projectSubId !== 'undefined' && this.filterForm.projectSubId) {
        form.projectSubId = this.filterForm.projectSubId;
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
      // if (this.filterForm.salerMemberName !== 'undefined' && this.filterForm.salerMemberName) {
      //   form.salerMemberName = this.filterForm.salerMemberName;
      // }
      if (this.filterForm.hospitalMemberName !== 'undefined' && this.filterForm.hospitalMemberName) {
        form.hospitalMemberName = this.filterForm.hospitalMemberName;
      }
      if (this.filterForm.enable !== 'undefined' && this.filterForm.enable) {
        form.enable = this.filterForm.enable;
      }
      if (this.filterForm.deliveryMemberName !== 'undefined' && this.filterForm.deliveryMemberName) {
        form.deliveryMemberName = this.filterForm.deliveryMemberName;
      }
      if (this.filterForm.classType !== 'undefined' && this.filterForm.classType) {
        form.classType = 1;
      }
      const url = DrugsUsable.output(form);
      window.open(url);
    },
    addressExport() {
      const form = {
        gpoMemberId: this.filterForm.gpoMemberId,
        // projectId: this.filterForm.projectId,
      };
      if (this.filterForm.projectId !== 'undefined' && this.filterForm.projectId) {
        form.projectId = this.filterForm.projectId;
      }
      if (this.filterForm.projectSubId !== 'undefined' && this.filterForm.projectSubId) {
        form.projectSubId = this.filterForm.projectSubId;
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
      // if (this.filterForm.salerMemberName !== 'undefined' && this.filterForm.salerMemberName) {
      //   form.salerMemberName = this.filterForm.salerMemberName;
      // }
      if (this.filterForm.hospitalMemberName !== 'undefined' && this.filterForm.hospitalMemberName) {
        form.hospitalMemberName = this.filterForm.hospitalMemberName;
      }
      if (this.filterForm.enable !== 'undefined' && this.filterForm.enable) {
        form.enable = this.filterForm.enable;
      }
      if (this.filterForm.deliveryMemberName !== 'undefined' && this.filterForm.deliveryMemberName) {
        form.deliveryMemberName = this.filterForm.deliveryMemberName;
      }
      if (this.filterForm.classType !== 'undefined' && this.filterForm.classType) {
        form.classType = 1;
      }
      const url = DrugsUsable.addressOutput(form);
      window.open(url);
    },
    dataSynchronous() {
      DrugsUsable.synchronousData().then((res) => {
        if (res.data.code === 0) {
          this.dataList();
        }
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
