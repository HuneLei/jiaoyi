<template>
  <div>
    <Find :showNum="8" :moreShow="0" :message="message"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :showBtn="showBtn"></Paging>
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
  import NoticeList from '../../../api/BasicInfo/NoticeList'; // 公告管理APi

  export default {
    activated() {
      this.authbtn = NoticeList.authbtn();
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
          path: '/BasicInfo/NoticeList',
          name: '公告列表',
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
        this.authbtn = NoticeList.authbtn();
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
          create: false,
          destory: false,
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
            type: 9,  // 类型
            key: 'announcementDate',
            label: '创建日期',
            shortcuts: true,  // 是否开启快捷选择
            defaultDate: true,  // 是否进来默认为一个月
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

