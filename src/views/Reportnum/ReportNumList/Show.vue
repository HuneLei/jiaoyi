<template>
  <div>
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column prop="num" label="#" fixed="left" width="40" class-name="table_right_fixed">
      </el-table-column>
      <el-table-column prop="code" label="报量单号" align="left" min-width="120" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="hospitalMemberName" label="医疗机构" align="left" min-width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <!--<el-table-column prop="code" label="报量单号" align="left" min-width="90"  sortable="custom" show-overflow-tooltip>
            </el-table-column>-->
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
      <el-table-column prop="reportNum" label="数量" align="right" min-width="70" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="qualityLevel" label="质量层次" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="producerName" label="生产企业" align="left" min-width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="approvalNumber" label="批准文号" align="left" min-width="130" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="timeName" label="期间名称" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="报量有效期" align="left" width="160" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          {{scope.row.reportnumValidBtime}} ~ {{scope.row.reportnumValidEtime}}
        </template>
      </el-table-column>
      <el-table-column prop="projectName" label="集采项目" align="left" min-width="130" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="projectSubName" label="集采子项目" align="left" min-width="130" sortable="custom" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <div style="float: left;padding-right: 15px;padding-left: 63%">
        <span>总数量：</span>{{gatherNum}} </div>
    </div>
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
import convert from '../../../utils/convert';                         //  自定义转换js
import ReportNumList from '../../../api/Reportnum/ReportNumList';

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    this.$bus.$on('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$on('page/change', this.pageChange);
    this.$bus.$on('data/list', this.dataList);
    this.$bus.$on('components/Find', this.dataSearch);
    this.$bus.$on('export/data', this.dataExport); // 导出
    if (this.getGpoId) {
      this.filterForm.projectId = this.getProjectId;                  // 获取当前切换的集采项目号码
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
  watch: {
    getProjectId() {
      if (this.$route.path === '/Reportnum/ReportNumList') {
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
        gpoMemberId: null,
        timeId: null,
        projectId: null,
        projectSubId: null,
        hospitalMemberName: null,
        drugsCode: null,
        drugsName: null,
        code: null,
        producerName: null,
        createTime: `${this.convertDate(new Date().setTime(new Date().getTime() - (3600 * 1000 * 24 * 30)))} - ${this.convertDate(new Date())}`,
      },
      gatherNum: 0, // 总数量
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
      let createTime = '';
      if (data.createTime.value && typeof data.createTime.value === 'object') {
        createTime = `${data.createTime.value[0].replace(/\//g, '-')} - ${data.createTime.value[1].replace(/\//g, '-')}`;
      } else {
        createTime = data.createTime.value;
      }
      if (createTime === '1970-01-01 - 1970-01-01') {
        data.createTime.value = null;
      } else {
        data.createTime.value = createTime;
      }
      this.filterForm = {
        gpoMemberId: this.getGpoId,
        timeId: data.timeId.value,
        projectId: data.projectId.value,
        drugsCode: data.drugsCode.value,
        drugsName: data.drugsName.value,
        hospitalMemberName: data.hospitalMemberName.value,
        producerName: data.producerName.value,
        code: data.code.value,
        createTime: data.createTime.value,
        projectSubId: data.projectSubId.value,
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
      ReportNumList.list(page || this.page, size || this.size, this.filterForm)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.tableNum = [];
            this.tableCount = 0;
            for (let i = 0; i < data.content.length; i += 1) {
              const numX = (i + 1) + (data.number * data.size);
              data.content[i].num = numX;
            }
            ReportNumList.reportnumGather(this.filterForm).then((res1) => {
              if (res.data.code === 0) {
                const data1 = res1.data.result[0];
                if (data1.gatherNum === null) {
                  this.gatherNum = 0;
                } else {
                  this.gatherNum = data1.sumnum;
                }
              }
            });
            this.tableDataOld = data.content;
            this.tableData = data.content;
            this.$emit('page', data.number + 1, data.size, data.totalElements);
          }
          this.loading = false;
        });
      return true;
    },
    // 导出
    dataExport() {
      const form = {
        gpoMemberId: this.filterForm.gpoMemberId,
      };
      if (this.filterForm.projectId !== 'undefined' && this.filterForm.projectId) {
        form.projectId = this.filterForm.projectId;
      }
      if (this.filterForm.createTime !== 'undefined' && this.filterForm.createTime) {
        form.createTime = this.filterForm.createTime;
      }
      if (this.filterForm.timeId !== 'undefined' && this.filterForm.timeId) {
        form.timeId = this.filterForm.timeId;
      }
      if (this.filterForm.drugsCode !== 'undefined' && this.filterForm.drugsCode) {
        form.drugsCode = this.filterForm.drugsCode;
      }
      if (this.filterForm.drugsName !== 'undefined' && this.filterForm.drugsName) {
        form.drugsName = this.filterForm.drugsName;
      }
      if (this.filterForm.hospitalMemberName !== 'undefined' && this.filterForm.hospitalMemberName) {
        form.hospitalMemberName = this.filterForm.hospitalMemberName;
      }
      if (this.filterForm.code !== 'undefined' && this.filterForm.code) {
        form.code = this.filterForm.code;
      }
      if (this.filterForm.producerName !== 'undefined' && this.filterForm.producerName) {
        form.producerName = this.filterForm.producerName;
      }
      if (this.filterForm.projectSubId !== 'undefined' && this.filterForm.projectSubId) {
        form.projectSubId = this.filterForm.projectSubId;
      }
      const url = ReportNumList.output(form);
      window.open(url);
    },
    // 页码切换
    pageChange(page) {
      this.dataList(page, this.size);
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
    //  计算表格高度
    tableHeightRun() {
      const tableHeightFun = () => {
        this.tableHeight = window.tableCustom.tableHeight(['.find', '.paging', 145]);
      };
      setTimeout(tableHeightFun, 0);
    },
  },
};
</script>
