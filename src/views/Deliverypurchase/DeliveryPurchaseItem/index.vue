<template>
  <div>
    <Find :showNum="8" :message="message" :defaultAjax="defaultAjax"></Find>
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
import project from '../../../api/BasicInfo/Project';   // api -- project[集采项目]
import DeliverypurchaseItem from '../../../api/Deliverypurchase/DeliverypurchaseItem';

export default {
  activated() {
    this.authbtn = DeliverypurchaseItem.authbtn();
    this.$bus.$on('project/getAll', this.getProjectAll);
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Deliverypurchase',
        name: '配送企业采购管理',
        noLink: true,
      },
      {
        path: '/GpoPurchaseItem',
        name: '采购单明细',
        noLink: true,
      },
    ]);
    //  获取集采项目下拉
    this.getProjectAll(this.getGpoId);
  },
  deactivated() {
    this.$bus.$off('project/getAll', this.getProjectAll);
  },
  watch: {
    authList() {
      this.authbtn = DeliverypurchaseItem.authbtn();
      // console.log();
    },
  },
  components: {
    Paging,
    Show,
  },
  computed: mapGetters([
    'getGpoId',
    'projectOptions',
    'getProjectId',
  ]),
  data() {
    return {
      authbtn: {},              //  识别用户拥有的权限
      page: 1,
      total: 0,
      size: 20,
      totalPages: 0,
      showNum: 4,       // 搜索框显示表单的个数
      defaultAjax: 0,   // 控制下拉框默认
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
          key: 'deliveryMemberName',
          label: '配送企业',
          placeholder: '请输入配送企业',
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
          key: 'noOut',
          label: '外部采购编号',
          placeholder: '请输入外部采购单编号',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'projectId',
          label: '集采项目',
          placeholder: '请选择集采项目',
          hasOp: false,
          type: 1,
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
    // 获取集采项目下拉
    getProjectAll() {
      this.message[7].selects = this.projectOptions; // 给项目集采名称options赋值
      this.message[7].defaults = this.getProjectId;  // 给项目集采名称options赋值
      this.defaultAjax += 1;                         // 控制defaultAjax变化监听
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$bus.emit('gpo/disabled', 1);
    next();
  },
};
</script>
