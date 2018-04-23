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
      <el-table-column v-if="this.View_UserInfo.memberType !== 3" prop="protocolPrice" label="协议单价" align="right" width="80" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <p>{{scope.row.protocolPrice.toFixed(4)}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="hospitalUnitPrice" label="医疗机构单价" align="right" width="90" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <p>{{scope.row.hospitalUnitPrice.toFixed(2)}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="approvalNumber" label="批准文号" align="left" width="130" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="tradeName" label="商品名" align="left" width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliveryMemberName" label="配送企业" align="left" width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="producerName" label="生产企业" align="left" width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="salerMemberName" label="卖方会员" align="left" width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="projectName" label="集采项目" align="left" min-width="130" class-name="table_right" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100" max-width="200" fixed="right" v-if="authbtn.update && authbtn.item">
        <template scope="scope">
          <el-button @click="changeprice(scope.row)" type="text" size="small">修改价格</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Percent v-show="isupload" :percentage="percentage"></Percent>
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
import DrugsUsablePrice from '../../../api/Deliverrelation/DrugsUsablePrice';
import Percent from '../../../components/Percent';

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    this.$bus.$on('table/height', this.tableHeightRun);     //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$on('page/change', this.pageChange);
    this.$bus.$on('data/list', this.dataList);
    this.$bus.$on('import/data', this.dataImport); // 导入
    this.$bus.$on('export/data', this.dataExport); // 导出
    this.$bus.$on('components/Find', this.dataSearch);
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
    this.$bus.$off('import/data', this.dataImport); // 导入
    this.$bus.$off('export/data', this.dataExport); // 导出
    this.$bus.$off('components/Find', this.dataSearch);
  },
  computed: mapGetters([
    'getGpoId',
    'projectOptions',
    'getProjectId',
    'View_UserInfo',
  ]),
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
    // this.dataList();
  },
  watch: {
    getProjectId() {
      if (this.$route.path === '/Deliverrelation/DrugsUsablePrice') {
        this.filterForm.projectId = this.getProjectId; // 获取当前切换的集采项目号码
        this.dataList();
      }
    },
    getGpoId() {
      if (this.$route.path === '/Deliverrelation/DrugsUsablePrice') {
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
        salerMemberName: null,
        producerName: null,
        deliveryMemberName: null,
      },
      page: 0,
      size: 20,
      dialogFormVisible: false,
      percentage: 0,
      isupload: false,
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
        salerMemberName: data.salerMemberName.value,
        deliveryMemberName: data.deliveryMemberName.value,
        projectId: data.projectId.value,
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
      this.filterForm.gpoMemberId = this.getGpoId;          // 默认的GPOID
      DrugsUsablePrice.list(cpage, cpageSizes, this.filterForm)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.tableData = [];
            this.tableNum = [];
            this.tableCount = 0;
            for (let i = 0; i < data.content.length; i += 1) {
              const numX = (i + 1) + (data.number * data.size);
              data.content[i].num = numX;
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
    //  文件导入
    dataImport(e) {
      const file = e.target.files[0];
      console.log('file.type', file);
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel' || file.name.indexOf('.xls') > -1) {
        this.isupload = true;
        const formData = new FormData();
        formData.append('file', file);
        DrugsUsablePrice.upload(formData, this.progress).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.percentage = 100;
            setTimeout(() => {
              this.isupload = false;
              this.percentage = 0;
            }, 500);
            this.$message({
              type: 'success',
              message: res.data.message,
            });
            this.$bus.$emit('data/list');
            // 导入数据
          } else {
            setTimeout(() => {
              this.isupload = false;
              this.percentage = 0;
            }, 500);
            this.$message({
              type: 'error',
              message: res.data.message,
            });
          }
          this.$bus.$emit('clear/file');
        });
      } else {
        this.$message({
          type: 'error',
          message: '文件格式出错，请导入excel',
        });
      }
    },
    //  进度条
    progress(e) {
      const d = parseInt((100 * e.loaded) / e.total, 0);
      if (d >= 90) {
        this.percentage = 90;
      } else {
        this.percentage = d;
      }
    },
    // 导出
    dataExport() {
      const form = {
        gpoMemberId: this.filterForm.gpoMemberId,
        // projectId: this.filterForm.projectId,
        classType: 1,
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
      if (this.filterForm.deliveryMemberName !== 'undefined' && this.filterForm.deliveryMemberName) {
        form.deliveryMemberName = this.filterForm.deliveryMemberName;
      }
      // console.log();
      const url = DrugsUsablePrice.output(form);
      window.open(url);
    },
    // 页码切换
    pageChange(page) {
      this.dataList(page, this.size);
    },
    // 仅修改价格
    changeprice(item) {
      // console.log();
      this.$bus.$emit('changePrice/dialog', item); // 将列表原价格传入弹框
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
