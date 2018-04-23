<template>
  <div>
    <Find :showNum="8" :message="message"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :showBtn="showBtn"></Paging>
  </div>
</template>

<script>
  /**
   * Created by wuqian on 2017/6/2.
   * <p>
   * 江苏摇铃网络科技有限公司，版权所有。
   * Copyright (C) 2015-2017 All Rights Reserved.
   */
  import Show from './Show';
  import InvoiceGather from '../../../api/Invoice/InvoiceGather';
  
  export default {
    activated() {
      this.authbtn = InvoiceGather.authbtn();
      // console.log();
      this.$store.commit('BreadCrumb_Update', [
        {
          path: '/index',
          name: this.$store.state.view.resourcesNow.name,
        },
        {
          path: '/Invoice',
          name: '发票管理',
          noLink: true,
        },
        {
          path: '/Invoice/InvoiceGather',
          name: '发票汇总',
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
        this.authbtn = InvoiceGather.authbtn();
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
        showBtn: {
          exportData: true,
        },
        message: [
          {
            key: 'drugsCode',
            label: '药品编码',
            placeholder: '请输入药品编码',
            type: 0,
            selects: [],
          },
          {
            key: 'drugsName',
            label: '通用名',
            placeholder: '请输入通用名',
            type: 0,
            selects: [],
          },
          {
            key: 'batchNo',
            label: '批号',
            placeholder: '请输入批号',
            type: 0,
            selects: [],
          },
          {
            key: 'num',
            label: '异常数量 >',
            placeholder: '请输入不小于零的异常数量',
            type: 0,
            selects: [],
          },
          {
            key: 'producerName',
            label: '生产企业',
            placeholder: '请输入生产企业',
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
