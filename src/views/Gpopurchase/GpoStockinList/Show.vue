<template>
  <div>
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column prop="num" align="left" fixed="left" label="#" width="40" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="stockinCode" label="入库单编号" sortable="custom" show-overflow-tooltip width="180">
      </el-table-column>
      <el-table-column align="left" prop="salerMemberName" label="卖方会员" sortable="custom" show-overflow-tooltip width="180">
      </el-table-column>
      <el-table-column align="left" prop="createBy" label="创建人" sortable="custom" show-overflow-tooltip width="80">
      </el-table-column>
      <el-table-column align="left" prop="createTime" label="创建时间" sortable="custom" show-overflow-tooltip width="140">
      </el-table-column>
      <el-table-column align="right" prop="amount" label="总金额" sortable="custom" show-overflow-tooltip width="140">
        <template scope="scope">
          <span>{{scope.row.amount.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="remarks" label="备注" sortable="custom" show-overflow-tooltip width="140">
      </el-table-column>
      <el-table-column align="left" prop="noOut" label="外部GPO入库单号" class-name="table_right" sortable="custom" show-overflow-tooltip min-width="130">
      </el-table-column>
      <el-table-column v-if="authbtn.list" min-width="80" align="center" fixed="right" label="附件"  show-overflow-tooltip>
        <template scope="scope">
          <YuploadFiles :data="convert.getJSON(scope.row.orderFile)"></YuploadFiles>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width='180' fixed="right" label="入库单详情">
        <template scope="scope">
          <el-button type="text" :disabled="!authbtn.drugsList || !authbtn.listItem" @click="showStockin(scope.row)">
            <i class="icon iconfont icon-chakan"></i> 查看</el-button>
          <el-button type="text" :disabled="!authbtn.update || !authbtn.listItem" @click="dataUpdata(scope.row)">
            <i class="el-icon-upload2"></i> 上传随货同行单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <GpoStockOutDialog></GpoStockOutDialog>
  </div>
</template>

<script>
/**
 * Created by lqy on 2017/9/21.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import convert from '../../../utils/convert';
import GpoStockinList from '../../../api/Gpopurchase/GpoStockinList';
import GpoStockOutDialog from './GpoStockOutDialog';

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    this.$bus.$on('table/height', this.tableHeightRun);               //  监听查询按钮的查看更多点击事件，重新计算表格高度
    // 监听页码切换
    this.$bus.$on('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$on('data/list', this.dataList);
    // 监听删除
    this.$bus.$on('components/Find', this.dataSearch);
    if (this.getGpoId) {
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
  },
  components: {
    GpoStockOutDialog,
  },
  watch: {
    getGpoId() {
      this.dataList();
    },
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  computed: {
    ...mapGetters([
      'getGpoId',
      'View_UserInfor',
      'View_UserInfo',
    ]),
  },
  data() {
    return {
      orderSort: 'asc',
      orderName: null,
      totalNumber: null,
      totalAmount: null,
      tableHeight: 650,
      tableData: [],       // 表单的值
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      page: 0,
      size: 20,
      // 筛选的字段
      filterForm: {
        gpoMemberId: null,                        // gpo会员id
        stockinCode: null,                               // 入库单编码
        salerMemberName: null,                    // 卖方会员名称
        createTime: null,                         // 入库时间
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
    // 数据查询条件获取
    dataSearch(data) {
      // console.log();
      let beginTimeValue;  // 开始时间
      let endTimeValue;    // 结束时间
      let createTime;      // 时间范围
      // 将开始时间和结束时间拆分开
      if (data.createTime.value !== undefined) {
        beginTimeValue = data.createTime.value[0];
        endTimeValue = data.createTime.value[1];
        if (beginTimeValue === '1970-01-01' && endTimeValue === '1970-01-01') {
          createTime = null;
        } else {
          createTime = `${data.createTime.value[0]} - ${data.createTime.value[1]}`;
        }
      }
      this.filterForm = {
        gpoMemberId: this.getGpoId,                           // gpo会员id
        stockinCode: data.stockinCode.value,                                    // 采购单编码
        salerMemberName: data.salerMemberName.value,              // 卖方会员名称
        createTime,                                               // 创建时间
      };
      // console.log();
      this.dataList(0, this.size);
    },
    // 获取数据列表
    dataList(page, pageSizes) {
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      this.filterForm.gpoMemberId = this.getGpoId;                    // 获取默认GPO会员Id
      GpoStockinList.list(cpage, cpageSizes,
        this.filterForm, this.orderSort, this.orderName).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.tableData = [];
            this.tableNum = [];
            this.tableCount = 0;
            for (let i = 0; i < data.content.length; i += 1) {
              const numX = (i + 1) + (data.number * data.size);
              data.content[i].num = numX;
              data.content[i].amount = Number(data.content[i].amount);
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
    // 页码切换
    pageChange(page) {
      this.dataList(page);
    },
    //  计算表格高度
    tableHeightRun() {
      const tableHeightFun = () => {
        this.tableHeight = window.tableCustom.tableHeight(['.find', '.paging', 145]);
      };
      setTimeout(tableHeightFun, 0);
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
    showStockin(item) {
      // console.log();
      this.$router.push({ path: '/Gpopurchase/GpoStockinList/ShowStockin', query: { id: item.id, code: item.stockinCode } });
    },
    // 上传发票
    dataUpdata(row) {
      this.$bus.$emit('gpostock/out/dialog', row);
    },
  },
};
</script>
