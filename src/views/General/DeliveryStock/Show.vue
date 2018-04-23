<template>
  <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
    <el-table-column prop="num" align="left" fixed="left" label="#" width="40" class-name="table_right_fixed">
    </el-table-column>
    <el-table-column prop="deliveryMemberCode" min-width="100" height="20px" label="配送商编码" sortable="custom" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="deliveryMemberName" min-width="160" height="20px" label="配送商名称" sortable="custom" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="drugsCode" min-width="90" label="药品编码" sortable="custom" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="drugsName" min-width="120" label="通用名" sortable="custom" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="tradeName" min-width="80" label="商品名" sortable="custom" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="formName" min-width="90" label="剂型" sortable="custom" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="specificationName" min-width="90" label="规格" sortable="custom" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="packSpecName" min-width="90" label="包装规格" sortable="custom" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="unitName" min-width="60" label="单位" sortable="custom" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="batchNo" min-width="120" label="批号" sortable="custom" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="cgsl" align="right" min-width="80" label="采购数量" sortable="custom" show-overflow-tooltip>
      <template scope="scope">
        <span>{{scope.row.cgsl == 0 ? '' : scope.row.cgsl}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="ctsl" align="right" min-width="80" label="采退数量" sortable="custom" show-overflow-tooltip>
      <template scope="scope">
        <span>{{scope.row.ctsl == 0 ? '' : scope.row.ctsl}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="fhsl" align="right" min-width="80" label="发货数量" sortable="custom" show-overflow-tooltip>
      <template scope="scope">
        <span>{{scope.row.fhsl == 0 ? '' : scope.row.fhsl}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="kpsl" align="right" min-width="80" label="开票数量" sortable="custom" show-overflow-tooltip>
      <template scope="scope">
        <span>{{scope.row.kpsl == 0 ? '' : scope.row.kpsl}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="rksl" align="right" min-width="100" label="医院入库数量" sortable="custom" show-overflow-tooltip>
      <template scope="scope">
        <span>{{scope.row.rksl == 0 ? '' : scope.row.rksl}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="thsl" align="right" min-width="100" label="医院退货数量" sortable="custom" show-overflow-tooltip>
      <template scope="scope">
        <span>{{scope.row.thsl == 0 ? '' : scope.row.thsl}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="kctj" align="right" min-width="80" label="计算库存" sortable="custom" show-overflow-tooltip>
      <template scope="scope">
        <span>{{scope.row.kctj == 0 ? '' : scope.row.kctj}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="producerName" min-width="160" label="生产企业" sortable="custom" show-overflow-tooltip>
    </el-table-column>
  </el-table>
</template>

<script>
/**
 * Created by wuqian on 2017/11/11.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import convert from '../../../utils/convert';
import DeliveryStock from '../../../api/General/DeliveryStock';

export default {
  activated() {
    this.$bus.$on('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$on('data/list', this.dataList);
    this.$bus.$on('page/change', this.pageChange);
    this.$bus.$on('components/Find', this.dataSearch);
    // this.$bus.$on('export/data', this.dataExport); // 导出
    if (this.getGpoId) {
      this.dataList();
    }
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun);
    this.$bus.$off('data/list', this.dataList);
    this.$bus.$off('page/change', this.pageChange);
    this.$bus.$off('components/Find', this.dataSearch);
    // this.$bus.$off('export/data', this.dataExport); // 导出
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  watch: {
    getGpoId() {
      if (this.$route.path === '/General/DeliveryStock') {
        this.dataList();
      }
    },
  },
  computed: mapGetters([
    'getGpoId',
  ]),
  data() {
    return {
      tableHeight: 650,
      tableData: [], // 表单的值
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false, // 列表加载状态
      page: 0,
      size: 20,
      filterForm: {
        gpoMemberId: null,
        deliveryMemberCode: null,
        deliveryMemberName: null,
        drugsCode: null,
        drugsName: null,
        batchNo: null,
        producerName: null,
        drugStandardCode: null,
        approvalNumber: null,
      },
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
    // 页码切换
    pageChange(page) {
      this.dataList(page);
    },
    // 数据查询条件获取
    dataSearch(data) {
      this.filterForm = {
        gpoMemberId: this.getGpoId,
        deliveryMemberCode: data.deliveryMemberCode.value,
        deliveryMemberName: data.deliveryMemberName.value,
        drugsCode: data.drugsCode.value,
        drugsName: data.drugsName.value,
        batchNo: data.batchNo.value,
        producerName: data.producerName.value,
        drugStandardCode: data.drugStandardCode.value,
        approvalNumber: data.approvalNumber.value,
      };
      // 调用列表请求
      this.dataList(0, this.size, this.filterForm);
    },
    // 获取数据列表
    dataList(page, pageSizes) {
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      this.filterForm.gpoMemberId = this.getGpoId;                    // 获取默认GPO会员Id
      DeliveryStock.list(cpage, cpageSizes, this.filterForm).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          this.tableData = [];
          this.tableNum = [];
          this.tableCount = 0;
          for (let i = 0; i < data.content.length; i += 1) {
            const numX = (i + 1) + (data.number * data.size);
            data.content[i].num = numX;
          }
          this.tableData = data.content;
          this.tableDataOld = data.content;
          this.page = data.number;
          this.size = data.size;
          this.$emit('page', data.number + 1, data.size, data.totalElements);
        }
        this.loading = false;
      });
    },
    tableHeightRun() {
      const tableHeightFun = () => {
        this.tableHeight = window.tableCustom.tableHeight(['.find', '.paging', 135]);
      };
      setTimeout(tableHeightFun, 0);
    },
  },
  mounted() { },
};
</script>
