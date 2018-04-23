<template>
  <div>
    <Find :showNum="3" :message="message"></Find>
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
import GpoStockinList from '../../../api/Gpopurchase/GpoStockinList';

export default {
  activated() {
    this.authbtn = GpoStockinList.authbtn();
    // console.log();
    this.$store.commit('status', 1); //  状态值 刷新后清空
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
        path: '/Gpopurchase/GpoStockinList',
        name: 'GPO入库单列表',
        noLink: true,
      },
    ]);
  },
  watch: {
    authList() {
      this.authbtn = GpoStockinList.authbtn();
      // console.log();
      // console.log();
    },
  },
  components: {
    Paging,
    Show,
  },
  computed: {
    authList() {
      return this.$store.state.view.authList;
    },
    ...mapGetters([
      'getGpoId',
    ]),
  },
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
        exportData: false,
      },
      // 搜索字段
      message: [
        {
          key: 'stockinCode',
          label: '入库单编号',
          placeholder: '请输入入库单编号',
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
        //   label: '创建时间',
        //   placeholder: '请输入创建时间',
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
