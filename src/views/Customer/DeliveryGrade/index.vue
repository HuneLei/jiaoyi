<template>
  <div>
    <Find :showNum="4" :message="message"></Find>
    <Show @page="dataPage"></Show>
    <Paging :page="page" :size="size" :total="total" :showBtn="showBtn"></Paging>
  </div>
</template>

<script>
/**
 * Created by wuqian on 2017/9/5.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapState, mapGetters } from 'vuex';
import Show from './Show';
import gpo from '../../../api/gpo'; // gpo 公共API

export default {
  activated() {
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Customer',
        name: '客服中心',
      },
      {
        path: '/Customer/DeliveryGrade',
        name: '配送企业评分详情',
        noLink: true,
      },
    ]);
  },
  computed: mapGetters([
    'getGpoId',
    'projectOptions',
    'getProjectId',
  ]),
  components: {
    Show,
  },
  data() {
    return {
      page: 1,
      size: 20,
      total: 0,
      showBtn: {
        scoringRulesLook: true,
      },
      message: [
        { key: 'producerName', label: '配送企业', placeholder: '请输入配送企业', type: 0, selects: [] },
        {
          type: 9,  // 类型
          key: 'invoiceDate',
          label: '日期',
          shortcuts: true,  // 是否开启快捷选择
          // defaultDate: true,  // 是否进来默认为一个月
        },
        // {
        //   key: 'invoiceDate',
        //   label: '日期',
        //   placeholder: '请选择日期',
        //   type: 5,
        //   selects: [],
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
