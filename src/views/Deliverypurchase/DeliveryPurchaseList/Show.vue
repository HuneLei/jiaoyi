<template>
  <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
    <el-table-column prop="num" align="left" fixed="left" label="#" width="40">
    </el-table-column>
    <el-table-column align="left" prop="code" label="采购单编号" sortable="custom" width="120" show-overflow-tooltip>
    </el-table-column>
    <el-table-column align="left" prop="createBy" label="创建人" sortable="custom" width="80" show-overflow-tooltip>
    </el-table-column>
    <el-table-column align="left" prop="createTime" label="创建日期" sortable="custom" width="140" show-overflow-tooltip>
    </el-table-column>
    <el-table-column align="left" prop="deliveryMemberName" label="配送企业" sortable="custom" width="180" show-overflow-tooltip>
    </el-table-column>
    <el-table-column align="left" prop="amount" label="金额" sortable width="90" show-overflow-tooltip>
      <template scope="scope">
        <span>{{scope.row.amount.toFixed(2)}}</span>
      </template>
    </el-table-column>
    <el-table-column align="left" prop="remarks" label="备注" sortable="custom" min-width="160" show-overflow-tooltip>
    </el-table-column>
    <el-table-column align="left" prop="cityName" label="采购单状态" sortable="custom" min-width="90" show-overflow-tooltip>
      <template scope="scope">
        <span v-show="scope.row.status === 0" class="order-green">待提交</span>
        <span v-show="scope.row.status === 1" class="order-blue">已提交</span>
      </template>
    </el-table-column>
    <el-table-column align="left" prop="noOut" label="外部采购单编号" sortable="custom" width="120" show-overflow-tooltip>
    </el-table-column>
    <el-table-column align="left" prop="projectName" label="集采项目" sortable="custom" class-name="table_right" width="130" show-overflow-tooltip>
    </el-table-column>
    <el-table-column align="center" min-width='160' fixed="right" label="采购单详情">
      <template scope="scope">
        <el-button type="text" v-if="scope.row.status === 0" :disabled="!authbtn.update || !authbtn.listItem" @click="dataUpdate(scope.row, 0)">
          <i class="fa fa-edit"></i>编辑</el-button>
        <el-button type="text" v-if="scope.row.status === 1" :disabled="!authbtn.listItem" @click="dataUpdate(scope.row, 1)">
          <i class="icon iconfont icon-chakan"></i>查看</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
/**
 * Created by lqy on 2017/9/14.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import convert from '../../../utils/convert';
import DeliverypurchaseList from '../../../api/Deliverypurchase/DeliverypurchaseList';

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
    // 新增采购单
    this.$bus.$on('data/page/do', this.dataCreate);
    if (this.getGpoId && this.getProjectId) {
      this.filterForm.projectId = this.getProjectId;                  // 获取当前切换的集采项目号码
      this.dataList();
    } else if (this.getGpoId && !this.getProjectId) {
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
    // 新增采购单
    this.$bus.$off('data/page/do', this.dataCreate);
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  computed: mapGetters([
    'getGpoId',
    'getProjectId',
  ]),
  watch: {
    getProjectId() {
      if (this.$route.path === '/Deliverypurchase/DeliveryPurchaseList') {
        this.filterForm.projectId = this.getProjectId;                  // 获取当前切换的集采项目号码
        this.dataList();
      }
    },
  },
  data() {
    return {
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
        projectId: null,
        gpoMemberId: null,
        code: null,
        noOut: null,
        deliveryMemberName: null,
        status: null,
        createTime: null,
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
        projectId: data.projectId.value,
        gpoMemberId: this.getGpoId,
        code: data.code.value,
        noOut: data.noOut.value,
        deliveryMemberName: data.deliveryMemberName.value,
        status: data.status.value,
        createTime,
      };
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
      DeliverypurchaseList.list(cpage, cpageSizes, this.filterForm).then((res) => {
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
        this.tableHeight = window.tableCustom.tableHeight(['.find', '.paging', 135]);
      };
      setTimeout(tableHeightFun, 0);
    },
    dataCreate() {
      this.$router.push({ path: '/Deliverypurchase/DeliveryPurchaseList/CreateDelivery' });
    },
    /**
     *  编辑 / 查看
     * @param item
     */
    dataUpdate(item, type) {
      // console.log();
      /**
       *  type === 0   待提交  可编辑状态
       *  type === 1   已提交  只读
       */
      if (type === 1) {
        this.$router.push({ path: '/Deliverypurchase/DeliveryPurchaseList/ShowDelivery', query: { id: item.id, pid: item.projectId } });
      } else {
        this.$router.push({ path: '/Deliverypurchase/DeliveryPurchaseList/EditDelivery', query: { id: item.id, pid: item.projectId } });
      }
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
  },
};
</script>
