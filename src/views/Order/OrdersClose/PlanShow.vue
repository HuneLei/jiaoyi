<template>
  <div v-loading="loading">
    <el-table :data="tableData" stripe border fit :height="View_TableHeight" @sort-change="sortChange">
      <el-table-column prop="num" label="#" fixed="left" width="40" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="code" min-width="120" height="20px" label="订单结案单编号" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="auditStatus" min-width="80" height="20px" label="审核状态" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span class="order-green" v-if="scope.row.auditStatus === 1">待审核</span>
          <span class="order-blue" v-if="scope.row.auditStatus === 3">审核通过</span>
          <span class="order-red" v-if="scope.row.auditStatus === 4">审核不通过</span>
        </template>
      </el-table-column>
      <el-table-column prop="reason" min-width="160" height="20px" label="申请结案原因" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliveryReplyContent" min-width="180" height="20px" label="配送企业回复" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliveryMemberName" min-width="180" height="20px" label="配送企业" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="hospitalMemberName" min-width="180" height="20px" label="医疗机构" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createBy" min-width="160" height="20px" label="申请人" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createTime" min-width="140" height="20px" label="申请日期" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="noOut" min-width="160" height="20px" label="外部订单结案单编号" sortable="custom" show-overflow-tooltip class-name="table_right">
      </el-table-column>
      <el-table-column label="操作" min-width="100" max-width="200" fixed="right" align="center" v-if="authbtn.item">
        <template scope="scope">
          <router-link :to="{ path: '/Order/OrdersClose/ClosesItem', query: { id: scope.row.id,  auditStatus: scope.row.auditStatus} }">
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
import OrdersClose from '../../../api/Order/OrdersClose';            //  订单结案单申请api

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
    if (this.$route.query.from === 'index') {
      this.formInline.auditStatus.value = 1;
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
      if (this.$route.path === '/Order/OrdersClose') {
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
        noOut: {},
        deliveryMemberName: {},
        hospitalMemberName: {},
        auditStatus: {},
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
        form.createTime.value = '';
      } else {
        form.createTime.value = createTime;
      }
      form.gpoMemberId = this.getGpoId;
      OrdersClose.list(cpage, cpageSizes, form).then((res) => {
        if (res.data.code === 0) {
          this.tableNum = [];
          this.tableCount = 0;
          const data = res.data.result;
          for (let i = 0; i < data.content.length; i += 1) {
            const numX = (i + 1) + (cpage * cpageSizes);
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
