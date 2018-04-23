<template>
  <div>
    <Find :showNum="5" :message="message"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :page="page" :size="size" :total="total" :showBtn="showBtn"></Paging>
  </div>
</template>


<script>
/**
 * Created by wuqian on 2017/9/20.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import Show from './Show';
import GpoStockoutList from '../../../api/Gpostockout/GpoStockoutList';

export default {
  activated() {
    this.authbtn = GpoStockoutList.authbtn();
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Gpostockout',
        name: 'GPO出库管理',
        noLink: true,
      },
      {
        path: '/Gpostockout/GpoStockoutList',
        name: '出库单列表',
        noLink: true,
      },
    ]);
  },
  computed: {
    authList() {
      return this.$store.state.view.authList;
    },
  },
  watch: {
    authList() {
      this.authbtn = GpoStockoutList.authbtn();
      // console.log();
    },
  },
  components: {
    Show,
  },
  data() {
    return {
      authbtn: {},              //  识别用户拥有的权限
      page: 1,
      size: 20,
      total: 0,
      showBtn: {},
      message: [
        {
          key: 'purchaseCode',
          label: '采购单编号',
          placeholder: '请输入采购单编号',
          type: 0,
          selects: [],
        },
        {
          key: 'stockoutCode',
          label: '出库单号',
          placeholder: '请输入出库单号',
          type: 0,
          selects: [],
        },
        {
          key: 'deliveryMemberName',
          label: '配送企业',
          placeholder: '请输入配送企业',
          type: 0,
          selects: [],
        },
        {
          type: 9,  // 类型
          key: 'stockoutDate',
          label: '出库日期',
          shortcuts: true,  // 是否开启快捷选择
          defaultDate: true,  // 是否进来默认为一个月
        },
        // {
        //   key: 'stockoutDate',
        //   label: '出库日期',
        //   placeholder: '请选择出库日期',
        //   type: 5,
        //   selects: [],
        //   defaultDate: true,
        //   pickerOptions: {
        //     shortcuts: [{
        //       text: '最近三个月',
        //       onClick(picker) {
        //         const end = new Date();
        //         const start = new Date();
        //         start.setTime(start.getTime() - (3600 * 1000 * 24 * 90));
        //         picker.$emit('pick', [start, end]);
        //       },
        //     }, {
        //       text: '最近半年',
        //       onClick(picker) {
        //         const end = new Date();
        //         const start = new Date();
        //         start.setTime(start.getTime() - (3600 * 1000 * 24 * 182));
        //         picker.$emit('pick', [start, end]);
        //       },
        //     }, {
        //       text: '最近一年',
        //       onClick(picker) {
        //         const end = new Date();
        //         const start = new Date();
        //         start.setTime(start.getTime() - (3600 * 1000 * 24 * 365));
        //         picker.$emit('pick', [start, end]);
        //       },
        //     }],
        //   },
        // },
        {
          key: 'stockoutType',
          label: '出库类型',
          type: 1,
          selects: [
            {
              value: 0,
              label: '销售',
            },
            {
              value: 1,
              label: '销退',
            },
          ],
        },
      ],
    };
  },
  methods: {
    dataPage(page, size, total) {
      this.page = page;
      this.size = size;
      this.total = total;
    },
  },
};
</script>

