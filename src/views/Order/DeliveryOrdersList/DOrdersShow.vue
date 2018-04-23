<template>
  <div v-loading="loading">
    <el-table :data="tableData" stripe border fit :height="View_TableHeight" @sort-change="sortChange" @selection-change="dataSelect">
      <el-table-column type="selection" width="40" align="left" show-overflow-tooltip fixed="left">
      </el-table-column>
      <el-table-column prop="num" label="#" width="40" fixed="left">
      </el-table-column>
      <el-table-column prop="code" width="130" height="20px" label="订单编号" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span>
            <span style="color: red;font-size: 10px" v-if="scope.row.type">(急)</span>
            {{scope.row.code}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="hospitalMemberName" min-width="180" height="20px" label="医疗机构" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliveryMemberName" min-width="180" height="20px" label="配送企业" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createBy" width="80" height="20px" label="创建人" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createTime" width="130" height="20px" label="创建时间" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" prop="amount" min-width="90" height="20px" label="订单金额" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span>{{scope.row.amount.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" width="80" height="20px" label="订单状态" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span class="order-green" v-if="scope.row.status === 0">待提交</span>
          <span class="order-green" v-if="scope.row.status === 1">待确认</span>
          <span class="order-green" v-if="scope.row.status === 2">待发货</span>
          <span class="order-green" v-if="scope.row.status === 3">部分发货</span>
          <span class="order-blue" v-if="scope.row.status === 4">已发货</span>
          <span class="order-blue" v-if="scope.row.status === 5">已完成</span>
          <span class="order-red" v-if="scope.row.status === 6">已取消</span>
        </template>
      </el-table-column>
      <el-table-column prop="closeStatus" width="80" height="20px" label="结案状态" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span v-if="scope.row.closeStatus === 0">无</span>
          <span class="order-green" v-if="scope.row.closeStatus === 1">结案中</span>
          <span class="order-green" v-if="scope.row.closeStatus === 2">部分结案</span>
          <span class="order-blue" v-if="scope.row.closeStatus === 3">已结案</span>
        </template>
      </el-table-column>
      <el-table-column prop="receiveAddress" min-width="300" height="20px" label="收货地址" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="noOut" width="110" height="20px" label="外部订单编号" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliveryRemarks" min-width="100" height="20px" label="配送商备注" sortable="custom" class-name="table_right" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" min-width="100" max-width="200" fixed="right" align="center" v-if="authbtn.item">
        <template scope="scope">
          <router-link :to="{ path: '/Order/DeliveryOrdersList/CheckDItem', query: { id: scope.row.id, status: scope.row.status, closeStatus: scope.row.closeStatus } }">
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
import convert from '../../../utils/convert';                             //  自定义转换js
import DeliveryOrdersList from '../../../api/Order/DeliveryOrdersList';   //  订单(配送企业api)

export default {
  props: {
    authbtn: Object,
  },
  computed: mapGetters([
    'View_TableHeight',
    'getGpoId',
  ]),
  activated() {
    if (this.$route.query.from === 'index' && this.$route.query.name === '待发货订单') {
      this.formInline.status.value = [2, 3];
    } else if (this.$route.query.from === 'index' && this.$route.query.name === '待确认订单') {
      this.formInline.status.value = 1;
    } else if (this.$route.query.add === 'indexs') {
      this.formInline.status.value = [2, 3];
    }
    this.$bus.$on('components/Find', this.dataSearch);    //  查询
    this.$bus.$on('page/change', this.dataList);          //  页码切换
    this.$bus.$on('data/list', this.dataList);            //  初始化列表
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
      if (this.$route.path === '/Order/DeliveryOrdersList') {
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
        type: {},
        noOut: {},
        status: {},
        createTime: {
          value: [
            this.convertDate(new Date().setTime(new Date().getTime() - (3600 * 1000 * 24 * 30))),
            this.convertDate(new Date()),
          ],
        },
        closeStatus: {},
        hospitalMemberName: {},
        deliveryMemberName: {},
        receiveAddress: {},
      },
      page: 0,
      size: 20,
    };
  },
  methods: {
    dataSelect(row) {
      // let submit = true;
      const ids = [];
      for (let i = 0; i < row.length; i += 1) {
        const status = Number(row[i].status);
        // ids.push(row[i].id);
        if (status === 1) {
          ids.push(row[i].id);
          // submit = false;
          // break;
        }
      }
      this.$emit('table-select', ids);
      // const first = 0;
      // if (first > 0) {
      //   submit = false;
      // }
      const btn = { batchConfirm: false };
      this.$bus.$emit('data/select', row, btn);
    },
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
      DeliveryOrdersList.list(cpage, cpageSizes, form).then((res) => {
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
