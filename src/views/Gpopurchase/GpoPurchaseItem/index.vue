index.vue
Show.vue<template>
  <div>
    <Find :showNum="6" :message="message"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :totalPages="totalPages" :showBtn="showBtn"></Paging>
  </div>
</template>

<script>
/**
 * Created by dingyiming on 2017/6/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapState, mapGetters } from 'vuex';
import Show from './Show';
import { Paging } from '../../../components/index';
import GpoPurchaseItem from '../../../api/Gpopurchase/GpoPurchaseItem';

export default {
  activated() {
    this.authbtn = GpoPurchaseItem.authbtn();
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Gpopurchase',
        name: 'GPO采购管理',
        noLink: true,
      },
      {
        path: '/Gpopurchase/GpoPurchaseItem',
        name: 'GPO采购单明细',
        noLink: true,
      },
    ]);
  },
  watch: {
    authList() {
      this.authbtn = GpoPurchaseItem.authbtn();
      // console.log();
      // console.log();
    },
  },
  components: {
    Paging,
    Show,
  },
  computed: mapGetters([
    'getGpoId',
  ]),
  data() {
    return {
      authbtn: {},              //  识别用户拥有的权限
      page: 1,
      total: 0,
      size: 20,
      totalPages: 0,
      showNum: 4,       // 搜索框显示表单的个数
      showBtn: {
        destory: false,
        create: false,
        pwnolock: false,
        exportData: true,
      },
      // 搜索字段
      message: [
        {
          key: 'code',
          label: '采购单编号',
          placeholder: '请输入采购单编号',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'drugsCode',
          label: '药品编码',
          placeholder: '请输入药品编码',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'drugsName',
          label: '通用名',
          placeholder: '请输入通用名',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'producerName',
          label: '生产企业',
          placeholder: '请输入生产企业',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'salerMemberName',
          label: '卖方会员',
          placeholder: '请输入卖方会员',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          type: 9,  // 类型
          key: 'createTime',
          label: '创建日期',
          shortcuts: true,  // 是否开启快捷选择
          // defaultDate: true,  // 是否进来默认为一个月
        },
        // {
        //   key: 'createTime',
        //   label: '创建日期',
        //   placeholder: '请输入创建日期',
        //   hasOp: false,
        //   type: 5,
        //   selects: [],
        // },
      ],
    };
  },
  methods: {
    dataPage(page, size, total, totalPages) {
      this.page = page;
      this.size = size;
      this.total = total;
      this.totalPages = totalPages;
    },
  },
};
</script>
