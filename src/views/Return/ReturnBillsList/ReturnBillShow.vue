<template>
  <div v-loading="loading">
    <el-table :data="tableData" stripe border fit :height="View_TableHeight" @sort-change="sortChange">
      <el-table-column prop="num" label="#" width="40" show-overflow-tooltip fixed="left">
      </el-table-column>
      <el-table-column prop="code" min-width="120" height="20px" label="退货单编号" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliveryMemberName" min-width="180" height="20px" label="配送企业" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="hospitalMemberName" min-width="180" height="20px" label="医疗机构" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="right" prop="amount" min-width="90" height="20px" label="退货金额" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span>{{scope.row.amount.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isDeletable" min-width="160" height="20px" label="退货单状态" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span class="order-green" v-if="scope.row.isDeletable === 0">待提交</span>
          <span class="order-green" v-if="scope.row.isDeletable === 1">待审核(GPO)</span>
          <span class="order-green" v-if="scope.row.isDeletable === 2">待审核(配送企业)</span>
          <span class="order-blue" v-if="scope.row.isDeletable === 3">审核通过</span>
          <span class="order-red" v-if="scope.row.isDeletable === 4">GPO未通过</span>
          <span class="order-red" v-if="scope.row.isDeletable === 5">配送企业未通过</span>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" min-width="120" height="20px" label="申请人" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createTime" min-width="140" height="20px" label="申请退货日期" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="gpoAuditBy" min-width="120" height="20px" label="GPO审核人" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="gpoAuditTime" min-width="140" height="20px" label="GPO审核时间" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliverAuditBy" min-width="120" height="20px" label="配送企业审核人" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliverAuditTime" min-width="140" height="20px" label="配送企业审核时间" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="noOut" min-width="120" height="20px" label="外部退货编号" sortable="custom" show-overflow-tooltip class-name="table_right">
      </el-table-column>
      <el-table-column label="操作" min-width="100" max-width="200" fixed="right" align="center" v-if="authbtn.item">
        <template scope="scope">
          <router-link :to="{ path: '/Return/ReturnBillsList/CheckItem', query: { id: scope.row.id,  status: scope.row.isDeletable } }">
            <el-button type="text" size="small">
              <i class="icon iconfont icon-chakan" style="font-size: 12px"></i>详情
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
/**
 * Created by yaoling on 2017/9/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import convert from '../../../utils/convert';                         //  自定义转换js
import ReturnBillsList from '../../../api/Return/ReturnBillsList';           //  采购计划api

export default {
  props: {
    authbtn: Object,
  },
  computed: mapGetters([
    'View_TableHeight',
    'View_UserInfo',
    'getGpoId',
  ]),
  activated() {
    if (this.$route.query.from === 'index' && this.View_UserInfo.memberType === 2) {
      this.formInline.isDeletable.value = 2;
    } else if (this.$route.query.from === 'index' && this.View_UserInfo.memberType === 4) {
      this.formInline.isDeletable.value = 1;
    }
    this.$bus.$on('components/Find', this.dataSearch);      //  查询
    this.$bus.$on('page/change', this.dataList);            //  页码切换
    this.$bus.$on('data/list', this.dataList);              //  初始化列表
    if (this.getGpoId) {               // 初始化列表查询
      this.dataList();
    }
  },
  deactivated() {
    this.$bus.$off('components/Find', this.dataSearch);    //  查询
    this.$bus.$off('page/change', this.dataList);          //  页码切换
    this.$bus.$off('data/list', this.dataList);            //  初始化列表
  },
  watch: {
    getGpoId() {
      if (this.$route.path === '/Return/ReturnBillsList') {
        this.dataList();
      }
    },
  },
  data() {
    return {
      tableData: [],
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      formInline: {    // 查询条件的获取值
        code: {},
        hospitalMemberName: {},
        deliveryMemberName: {},
        isDeletable: {},
        noOut: {},
        createTime: {
          value: [
            this.convertDate(new Date().setTime(new Date().getTime() - (3600 * 1000 * 24 * 30))),
            this.convertDate(new Date()),
          ],
        },
      },
      page: 0,
      size: 20,
      total: 0,
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
    //  更新表格数据
    dataList(page, pageSizes, formInline) {
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      const form = formInline || this.formInline;
      let createTime = '';
      if (form.createTime.value && typeof form.createTime.value === 'object') {
        createTime = `${form.createTime.value[0].replace(/\//g, '-')} - ${form.createTime.value[1].replace(/\//g, '-')}`;
      } else {
        createTime = form.createTime.value;
      }
      if (createTime === '1970-01-01 - 1970-01-01') {
        form.createTime.value = null;
      } else {
        form.createTime.value = createTime;
      }
      form.gpoMemberId = this.getGpoId;
      ReturnBillsList.list(cpage, cpageSizes, form).then((res) => {
        if (res.data.code === 0) {
          this.tableNum = [];
          this.tableCount = 0;
          const data = res.data.result;
          for (let i = 0; i < data.content.length; i += 1) {
            const numX = (i + 1) + (cpage * cpageSizes);
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
    // 数据查询条件获取
    dataSearch(data) {
      this.formInline = data;
      this.dataList(0, this.size, this.formInline);
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
  },
};
</script>
