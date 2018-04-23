<template>
  <div>
    <Find :showNum="8" :moreShow="0" :message="message"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :showBtn="showBtn"></Paging>
    <EditDialog></EditDialog>
    <CreatDialog></CreatDialog>
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
  import EditDialog from './EditDialog';
  import CreatDialog from './CreatDialog';
  import DrugsReportsList from '../../../api/Drugs/DrugsReportsList'; // APi

  export default {
    activated() {
      this.authbtn = DrugsReportsList.authbtn();
      this.$store.commit('BreadCrumb_Update', [
        {
          path: '/index',
          name: this.$store.state.view.resourcesNow.name,
        },
        {
          path: '/Drugs',
          name: '药品管理',
          noLink: true,
        },
        {
          path: '/Drugs/DrugsReportsList',
          name: '药检报告列表',
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
        this.authbtn = DrugsReportsList.authbtn();
        // console.log();
      },
    },
    components: {
      Show,
      EditDialog,
      CreatDialog,
    },
    data() {
      return {
        authbtn: {},              //  识别用户拥有的权限
        page: 1,
        size: 20,
        total: 0,
        showBtn: {
          create: true,
          drugReportsPrint: true,
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
            key: 'salerMemberName',
            label: '卖方会员',
            placeholder: '请输入卖方会员',
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
            key: 'isGpoStamp',
            label: 'GPO是否盖章',
            type: 1,
            selects: [
              {
                value: 1,
                label: '是',
              },
              {
                value: 0,
                label: '否',
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

