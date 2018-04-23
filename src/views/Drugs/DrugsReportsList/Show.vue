<template>
  <div>
    <el-table :data="tableData" v-loading="loading" @selection-change="dataSelect" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column type="selection" width="40" fixed="left" align="center" class-name="table_right_fixed">
      </el-table-column>
      <el-table-column prop="num" label="#" width="40">
      </el-table-column>
      <el-table-column prop="drugsCode" label="药品编码" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
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
      <el-table-column prop="batchNo" label="批号" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="producerName" label="生产企业" align="left" min-width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="salerMemberName" label="卖方会员" align="left" min-width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="tradeName" label="商品名" align="left" min-width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="approvalNumber" label="批准文号" align="left" min-width="130" class-name="table_right" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column min-width="120" align="center" label="药检报告附件" fixed="right" show-overflow-tooltip>
        <template scope="scope">
          <YuploadFiles :data="convert.getJSON(scope.row.drugsReportFile)"></YuploadFiles>
        </template>
      </el-table-column>
      <el-table-column prop="isGpoStamp" label="GPO已盖章" align="center" fixed="right" min-width="100" class-name="table_right">
        <template scope="scope">
          <span v-if="scope.row.isGpoStamp===1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="药检报告" align="center" min-width="100" max-width="200" fixed="right" v-if="authbtn.item">
        <template scope="scope">
          <el-button @click="dataUpdate(scope.row)" type="text" size="small">
            <i class="icon iconfont icon-chakan"></i> 详情 ({{scope.row.drugsReportFileNum}})
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <PrintPreview :show="showPrint" :imgArr="imgArr" @print-cancel="printCancel"></PrintPreview>
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
import convert from '../../../utils/convert'; //  自定义转换js
import PrintPreview from './PrintPreview';
import DrugsReportsList from '../../../api/Drugs/DrugsReportsList'; // APi

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    this.$bus.$on('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$on('page/change', this.pageChange);
    this.$bus.$on('data/list', this.dataList);
    this.$bus.$on('components/Find', this.dataSearch);
    this.$bus.$on('data/page/do', this.dataCreat); // 新增
    this.$bus.$on('drug/reports/print', this.PrintPreview); // 打印药检报告
    if (this.getGpoId) {
      this.dataList();
    }
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun);
    this.$bus.$off('page/change', this.pageChange);
    this.$bus.$off('data/list', this.dataList);
    this.$bus.$off('components/Find', this.dataSearch);
    this.$bus.$off('data/page/do', this.dataCreat);
    this.$bus.$off('drug/reports/print', this.PrintPreview);
  },
  components: {
    PrintPreview,
  },
  watch: {
    getProjectId() {
      if (this.$route.path === '/Drugs/DrugsReportsList') {
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
      showPrint: false,
      imgArr: [],
      tableHeight: 650,
      tableData: [],
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      filterForm: {
        gpoMemberId: null, // gpo会员id，全局，不可空
        drugsCode: null,
        drugsName: null,
        batchNo: null,
        salerMemberName: null,
        producerName: null,
        isGpoStamp: null, // 0： 否，   1： 是
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
    dataSearch(data) {
      this.filterForm = {
        gpoMemberId: this.getGpoId, // gpo会员id，全局，不可空
        drugsCode: data.drugsCode.value,
        drugsName: data.drugsName.value,
        batchNo: data.batchNo.value,
        salerMemberName: data.salerMemberName.value,
        producerName: data.producerName.value,
        isGpoStamp: data.isGpoStamp.value, // 0： 否，   1： 是
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
      DrugsReportsList.list(page || this.page, size || this.size, this.filterForm)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.tableNum = [];
            this.tableCount = 0;
            for (let i = 0; i < data.content.length; i += 1) {
              const numX = (i + 1) + (data.number * data.size);
              data.content[i].num = numX;
              if (typeof (this.toJSON(data.content[i].drugsReportFile)) === 'object') {
                for (let w = 0; w < this.toJSON(data.content[i].drugsReportFile).length; w += 1) {
                  data.content[i].drugsReportFileNum = w + 1;
                }
              } else {
                data.content[i].drugsReportFileNum = 0;
              }
            }
            this.tableDataOld = data.content;
            this.tableData = data.content;
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
    // 新增
    dataCreat() {
      this.$bus.$emit('creat/dialog'); // 将列表原价格传入弹框
    },
    // 编辑
    dataUpdate(row) {
      this.$bus.$emit('edit/dialog', row); // 将列表原价格传入弹框
    },
    // 打印预览
    PrintPreview(row) {
      this.imgArr = [];
      for (let i = 0; i < row.length; i += 1) {
        const item = row[i];
        if (typeof (this.toJSON(item.drugsReportFile)) === 'object') {
          for (let w = 0; w < this.toJSON(item.drugsReportFile).length; w += 1) {
            this.imgArr.push(this.toJSON(item.drugsReportFile)[w]);
          }
        }
      }
      this.showPrint = true;
    },
    //  打印关闭事件
    printCancel() {
      this.showPrint = false;
    },
    // 多选框选择
    dataSelect(row) {
      this.$bus.$emit('data/select', row);
    },
    //  计算表格高度
    tableHeightRun() {
      const tableHeightFun = () => {
        this.tableHeight = window.tableCustom.tableHeight(['.find', '.paging', 135]);
      };
      setTimeout(tableHeightFun, 0);
    },
    toJSON(str) {
      return convert.toJSON(str);
    },
  },
};
</script>
<style>
#IsPrint {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  background: pink;
  height: 100%;
  z-index: 9999;
  overflow: auto;
}

.ButtonHidden {
  display: none;
}

.Noprint {
  display: none;
}

.PageNext {
  page-break-after: always;
}
</style>
