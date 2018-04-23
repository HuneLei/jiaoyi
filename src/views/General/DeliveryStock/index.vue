<template>
  <div>
    <Find :showNum="8" :message="message" :defaultAjax="defaultAjax"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total"></Paging>
  </div>
</template>


<script>
/**
 * Created by wuqian on 2017/11/11.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import Show from './Show';
import DeliveryStock from '../../../api/General/DeliveryStock';   // api

export default {
  activated() {
    // 面包屑
    this.authbtn = DeliveryStock.authbtn();
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/General',
        name: '通用报表',
        noLink: true,
      },
      {
        path: '/General/DeliveryStock',
        name: '配送企业库存分析',
        noLink: true,
      },
    ]);
  },
  computed: {
    getPrincipal() {
      return this.$store.state.view.principal;
    },
    authList() {
      return this.$store.state.view.authList;
    },
  },
  watch: {
    authList() {
      this.authbtn = DeliveryStock.authbtn();
    },
  },
  components: {
    Show,
  },
  methods: {
    dataPage(page, size, total) {
      this.page = page;
      this.size = size;
      this.total = total;
    },
  },
  data() {
    return {
      authbtn: {},              //  识别用户拥有的权限
      page: 1,
      size: 20,
      total: 0,
      defaultAjax: 0,
      // 搜索字段
      message: [
        {
          key: 'deliveryMemberCode',
          label: '配送商编码',
          placeholder: '请输入配送商编码',
          type: 0,
          selects: [],
        },
        {
          key: 'deliveryMemberName',
          label: '配送商名称',
          placeholder: '请输入配送商名称',
          type: 0,
          selects: [],
        },
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
          key: 'producerName',
          label: '生产企业',
          placeholder: '请输入生产企业',
          type: 0,
          selects: [],
        },
        {
          key: 'drugStandardCode',
          label: '本位码',
          placeholder: '请输入本位码',
          type: 0,
          selects: [],
        },
        {
          key: 'approvalNumber',
          label: '批准文号',
          placeholder: '请输入批准文号',
          type: 0,
          selects: [],
        },
      ],
    };
  },
};
</script>

