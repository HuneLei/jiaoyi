<template>
  <div>
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column prop="num" fixed="left" label="#" width="40">
      </el-table-column>
      <el-table-column prop="gpoMemberName" label="GPO名称" align="left" min-width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="stockoutCode" label="出库单号" align="left" min-width="120" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="stockoutDate" label="出库日期" align="left" min-width="170" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliveryMemberName" label="配送企业" align="left" min-width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="stockoutType" label="出库类型" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span v-if="scope.row.stockoutType===0">销售</span>
          <span v-else>销退</span>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="外部GPO出库单号" align="left" min-width="150" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="orderFile" label="随货同行单附件" align="left" min-width="110" show-overflow-tooltip class-name="table_right">
        <template scope="scope">
          <YuploadFiles :data="convert.getJSON(scope.row.orderFile)"></YuploadFiles>
        </template>
      </el-table-column>
      <el-table-column label="出库单详情" fixed="right" align="center" min-width="200" max-width="250" v-if="authbtn.itemInfo || authbtn.fileUpdata">
        <template scope="scope">
          <router-link :to="{ path: '/Gpostockout/GpoStockoutList/Edit', query: { id: scope.row.id, stockoutCode: scope.row.stockoutCode } }" v-if="authbtn.itemInfo">
            <el-button type="text" size="small">
              <i class="icon iconfont icon-chakan"></i> 详情
            </el-button>
          </router-link>
          <el-button @click="dataUpdata(scope.row)" type="text" size="small" v-if="authbtn.fileUpdata">
            <i class="el-icon-upload2"></i> 上传随货同行单
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <GpoStockOutDialog></GpoStockOutDialog>
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
import convert from '../../../utils/convert'; // 引入js公共方法
import GpoStockoutList from '../../../api/Gpostockout/GpoStockoutList';
import GpoStockOutDialog from './GpoStockOutDialog';

export default {
  props: {
    authbtn: Object,
  },
  components: {
    GpoStockOutDialog,
  },
  activated() {
    this.$bus.$on('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$on('page/change', this.pageChange);
    this.$bus.$on('data/list', this.dataList);
    this.$bus.$on('components/Find', this.dataSearch);
    if (this.getGpoId) {
      this.dataList();
    }
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun);
    this.$bus.$off('page/change', this.pageChange);
    this.$bus.$off('data/list', this.dataList);
    this.$bus.$off('components/Find', this.dataSearch);
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  watch: {
    getGpoId() {
      if (this.$route.path === '/Gpostockout/GpoStockoutList') {
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
      tableData: [],
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      filterForm: {
        gpoMemberId: null,
        purchaseCode: null,
        stockoutCode: null,
        deliveryMemberName: null,
        stockoutType: null,
        stockoutDate: `${this.convertDate(new Date().setTime(new Date().getTime() - (3600 * 1000 * 24 * 30)))} - ${this.convertDate(new Date())}`,
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
    dataSearch(datas) {
      const data = datas;
      let stockoutDate = '';
      if (data.stockoutDate.value && typeof data.stockoutDate.value === 'object') {
        stockoutDate = `${data.stockoutDate.value[0].replace(/\//g, '-')} - ${data.stockoutDate.value[1].replace(/\//g, '-')}`;
      } else {
        stockoutDate = data.stockoutDate.value;
      }
      if (stockoutDate === '1970-01-01 - 1970-01-01') {
        data.stockoutDate.value = null;
      } else {
        data.stockoutDate.value = stockoutDate;
      }
      this.filterForm = {
        gpoMemberId: this.getGpoId,
        purchaseCode: data.purchaseCode.value,
        stockoutCode: data.stockoutCode.value,
        deliveryMemberName: data.deliveryMemberName.value,
        stockoutType: data.stockoutType.value,
        stockoutDate: data.stockoutDate.value,
      };
      this.dataList(0, this.size, this.filterForm);
    },
    // 获取数据列表
    dataList(page, size, filterForm) {
      if (!this.getGpoId) {
        return;
      }
      this.filterForm.gpoMemberId = this.getGpoId;          // 默认的GPOID
      this.loading = true;
      if (page !== undefined) this.page = page;
      if (size !== undefined) this.size = size;
      GpoStockoutList.list(page || this.page, size || this.size, this.filterForm)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.tableNum = [];
            this.tableCount = 0;
            for (let i = 0; i < data.content.length; i += 1) {
              const numX = (i + 1) + (data.number * data.size);
              data.content[i].num = numX;
            }
            this.tableData = data.content;
            this.tableDataOld = data.content;
            this.$emit('page', data.number + 1, data.size, data.totalElements);
          }
          this.loading = false;
        });
    },
    // 上传发票
    dataUpdata(row) {
      this.$bus.$emit('gpostock/out/dialog', row);
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
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
  },
};
</script>
