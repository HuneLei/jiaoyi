<template>
  <div v-loading="loading">
    <el-table :data="tableData" stripe border fit :height="View_TableHeight" @sort-change="sortChange">
      <el-table-column prop="num" label="#" width="40" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="hospitalMemberCode" min-width="160" height="20px" label="医疗机构编码" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="hospitalMemberName" min-width="180" height="20px" label="医疗机构" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="hospitalPerson" min-width="160" height="20px" label="联系人" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="hospitalPhone" min-width="160" height="20px" label="联系电话" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createBy" min-width="80" height="20px" label="创建人" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="modifyTime" min-width="140" height="20px" label="修改时间" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单购物车" min-width="100" max-width="200" align="center" v-if="authbtn.item">
        <template scope="scope">
          <router-link :to="{ path: '/Order/ShoppingCart/ShopItem', query: { id: scope.row.id } }">
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
import ShoppingCart from '../../../api/Order/ShoppingCart';           //  订单购物车api

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
    this.$bus.$on('components/Find', this.dataSearch);      //  查询
    this.$bus.$on('page/change', this.dataList);            //  页码切换
    this.$bus.$on('data/list', this.dataList);              //  初始化列表
    if (this.getGpoId) {                                    // 初始化列表查询
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
      if (this.$route.path === '/Order/ShoppingCart') {
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
        hospitalMemberName: {},
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
      form.getGpoId = this.getGpoId;
      ShoppingCart.list(cpage, cpageSizes, form).then((res) => {
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
