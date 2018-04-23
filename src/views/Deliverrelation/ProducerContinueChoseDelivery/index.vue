<template>
  <div>
    <Find :showNum="5" :moreShow="0" :message="message" :defaultAjax="defaultAjax"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :showBtn="showBtn"></Paging>
  </div>
</template>

<script>
/**
 * Created by dingyiming on 2017/6/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import ProducerContinueChoseDelivery from '../../../api/Deliverrelation/ProducerContinueChoseDelivery';
import Show from './Show';

export default {
  activated() {
    this.authbtn = ProducerContinueChoseDelivery.authbtn();
    this.$bus.$on('table/height', this.tableHeightRun);  //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Deliverrelation',
        name: '配送关系管理',
        noLink: true,
      },
      {
        path: '/Deliverrelation/ProducerContinueChoseDelivery',
        name: '卖方补充配送',
        noLink: true,
      },
    ]);
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
  },
  components: {
    Show,
  },
  computed: {
    authList() {
      return this.$store.state.view.authList;
    },
    ...mapGetters([
      'getGpoId',
      'projectOptions',
      'getProjectId',
      'View_UserInfo',
    ]),
  },
  watch: {
    authList() {
      this.authbtn = ProducerContinueChoseDelivery.authbtn();
    },
  },
  mounted() {
    window.onresize = () => {
      if (this.$route.path === '/Deliverrelation/ProducerContinueChoseDelivery') {
        this.TableHeightRun();
      } else if (this.$route.path === '/Deliverrelation/ProducerContinueChoseDelivery/Create') {
        this.TableHeightRun(['#from-item', '.TradeFooter', 200]);
      } else if (this.$route.path === '/Deliverrelation/ProducerContinueChoseDelivery/Edit') {
        this.TableHeightRun(['#from-item', '.TradeFooter', 200]);
      }
    };
  },
  data() {
    return {
      authbtn: {},              //  识别用户拥有的权限
      page: 1,
      size: 20,
      total: 0,
      defaultAjax: 0,
      showBtn: {
        create: true,
      },
      // 搜索字段
      message: [
        {
          key: 'applicationNo',
          label: '申请单号',
          placeholder: '请输入申请单号',
          type: 0,
          selects: [],
        },
        {
          key: 'projectName',
          label: '集采项目',
          placeholder: '请输入集采项目',
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
          key: 'salerStatic',
          label: '状态',
          type: 1,
          selects: [
            {
              label: '待提交',
              value: '0',
            },
            {
              label: '待审核',
              value: '1',
            },
            {
              label: '审核通过',
              value: '2',
            },
            {
              label: '审核不通过',
              value: '3',
            },
          ],
        },
        {
          type: 9,  // 类型
          key: 'createTime',
          label: '创建日期',
          shortcuts: true,  // 是否开启快捷选择
          defaultDate: true,  // 是否进来默认为一个月
        },
        // {
        //   key: 'createTime',
        //   label: '提交日期',
        //   convertdate: 2,
        //   type: 5,
        //   placeholder: '请选择日期',
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
    //  计算表格高度
    tableHeightRun() {
      this.$nextTick(() => {
        this.TableHeightRun();
      });
    },
    ...mapActions([
      'TableHeightRun',
    ]),
  },
};
</script>
