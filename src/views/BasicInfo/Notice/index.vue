<template>
  <div>
    <Find :showNum="8" :moreShow="0" :message="message"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :showBtn="showBtn"></Paging>
    <CreateDialog></CreateDialog>
    <UpdateDialog></UpdateDialog>
  </div>
</template>


<script>
  /**
   * Created by wuqian on 2017/9/20.
   * <p>
   * 江苏摇铃网络科技有限公司，版权所有。
   * Copyright (C) 2015-2017 All Rights Reserved.
   */
  import { mapState, mapGetters } from 'vuex';
  import Show from './Show';
  import CreateDialog from './CreateDialog';
  import UpdateDialog from './UpdateDialog';
  import Notice from '../../../api/BasicInfo/Notice'; // 公告管理APi
  
  export default {
    activated() {
      this.authbtn = Notice.authbtn();
      this.$store.commit('BreadCrumb_Update', [
        {
          path: '/index',
          name: this.$store.state.view.resourcesNow.name,
        },
        {
          path: '/BasicInfo',
          name: '基础信息',
          noLink: true,
        },
        {
          path: '/BasicInfo/Notice',
          name: '公告管理',
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
        this.authbtn = Notice.authbtn();
      },
    },
    components: {
      Show,
      CreateDialog,
      UpdateDialog,
    },
    data() {
      return {
        authbtn: {},              //  识别用户拥有的权限
        page: 1,
        size: 20,
        total: 0,
        showBtn: {
          create: true,
          destory: true,
        },
        message: [
          {
            key: 'announcementTitle',
            label: '公告标题',
            placeholder: '请输入公告标题',
            type: 0,
            selects: [],
          },
          {
            key: 'enabled',
            label: '发布状态',
            type: 1,
            selects: [
              {
                value: 0,
                label: '未发布',
              },
              {
                value: 1,
                label: '已发布',
              },
            ],
          },
          {
            type: 9,  // 类型
            key: 'announcementDate',
            label: '创建日期',
            shortcuts: true,  // 是否开启快捷选择
            defaultDate: true,  // 是否进来默认为一个月
          },
          // {
          //   key: 'announcementDate',
          //   label: '创建日期',
          //   placeholder: '请选择创建日期',
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

