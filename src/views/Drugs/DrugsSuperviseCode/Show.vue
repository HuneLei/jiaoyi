<template>
  <div v-loading="loading">
    <Percent v-show="isupload" :percentage="percentage"></Percent>
    <el-table :data="tableData" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column prop="num" label="#" fixed="left" width="40">
      </el-table-column>
      <el-table-column prop="drugsCode" label="药品编码" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="superviseCode" label="卫监码" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="drugsName" label="通用名" align="left" min-width="120" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="formName" label="剂型" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="specName" label="规格" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="packSpecName" label="包装规格" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="unitName" label="单位" align="left" min-width="60" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="producerName" label="生产企业" align="left" min-width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="enrollName" label="卖方会员" align="left" min-width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="tradeName" label="商品名" align="left" min-width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="approvalNumber" label="批准文号" align="left" min-width="130" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="projectName" label="集采项目" align="left" width="130" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="insuranceNo" label="医保编号" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="insuranceType" label="医保分类" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="reimburseScale" label="报销比例" align="left" min-width="100" sortable="custom" show-overflow-tooltip class-name="table_right">
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100" max-width="200" fixed="right" v-if="authbtn.item">
        <template scope="scope">
          <el-button @click="dataUpdata(scope.row)" type="text" size="small">
            <i class="icon iconfont icon-bianji"></i> 修改卫监码
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
/**
 * Created by wuqian on 2017/9/20.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import DrugsSuperviseCode from '../../../api/Drugs/DrugsSuperviseCode'; // 药品卫监码对照APi

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    this.$bus.$on('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$on('page/change', this.pageChange);
    this.$bus.$on('data/list', this.dataList);
    this.$bus.$on('components/Find', this.dataSearch);
    this.$bus.$on('import/data', this.dataImport); // 导入
    this.$bus.$on('export/data', this.dataExport); // 导出
    if (this.getGpoId) {
      this.filterForm.projectId = this.getProjectId;                  // 获取当前切换的集采项目号码
      this.dataList();
    }
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun);
    this.$bus.$off('page/change', this.pageChange);
    this.$bus.$off('data/list', this.dataList);
    this.$bus.$off('components/Find', this.dataSearch);
    this.$bus.$off('import/data', this.dataImport); // 导入
    this.$bus.$off('export/data', this.dataExport); // 导出
  },
  watch: {
    getProjectId() {
      if (this.$route.path === '/Drugs/DrugsSuperviseCode') {
        this.filterForm.projectId = this.getProjectId;                  // 获取当前切换的集采项目号码
        this.dataList();
      }
    },
  },
  computed: mapGetters([
    'getGpoId',
    'getProjectId',
  ]),
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  data() {
    return {
      tableHeight: 650,
      tableData: [],
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      filterForm: {
        gpoMemberId: null, // gpo会员id，全局，不可空
        projectId: null, // 集采项目id，可空，下拉
        drugsCode: null,
        drugsName: null,
        formName: null,
        specificationName: null,
        producerName: null,
        tradeName: null,
        approvalNumber: null,
        superviseCode: null,
        enrollName: null,
      },
      page: 0,
      size: 20,
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
    // 查询条件获取
    dataSearch(data) {
      this.filterForm = {
        gpoMemberId: this.getGpoId,
        projectId: data.projectId.value,
        drugsCode: data.drugsCode.value,
        drugsName: data.drugsName.value,
        formName: data.formName.value,
        specificationName: data.specificationName.value,
        producerName: data.producerName.value,
        tradeName: data.tradeName.value,
        approvalNumber: data.approvalNumber.value,
        superviseCode: data.superviseCode.value,
        enrollName: data.enrollName.value,
      };
      this.dataList(0, this.size, this.filterForm);
    },
    dataList(page, size, filterForm) {
      if (!this.getGpoId) {
        return false;
      }
      this.loading = true;
      this.filterForm.gpoMemberId = this.getGpoId; // 默认的GPOID
      if (page !== undefined) this.page = page;
      if (size !== undefined) this.size = size;
      DrugsSuperviseCode.list(page || this.page, size || this.size, this.filterForm)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.tableNum = [];
            this.tableCount = 0;
            for (let i = 0; i < data.content.length; i += 1) {
              const numX = (i + 1) + (data.number * data.size);
              data.content[i].num = numX;
            }
            this.tableDataOld = data.content;
            this.tableData = data.content;
            this.$emit('page', data.number + 1, data.size, data.totalElements);
          }
          this.loading = false;
        });
      return true;
    },
    dataUpdata(row) {
      this.$bus.$emit('changeEdit/dialog', row); // 将列表原价格传入弹框
    },
    // 页码切换
    pageChange(page) {
      this.dataList(page, this.size);
    },
    //  文件导入
    dataImport(e) {
      const file = e.target.files[0];
      console.log('file.type', file);
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel' || file.name.indexOf('.xls') > -1) {
        this.isupload = true;
        const formData = new FormData();
        formData.append('file', file);
        DrugsSuperviseCode.upload(formData, this.progress, this.filterForm.projectId)
          .then((res) => {
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
              this.dataList();
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
        projectId: this.filterForm.projectId,
      };
      const url = DrugsSuperviseCode.output(form);
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
