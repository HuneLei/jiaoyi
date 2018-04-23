<template>
  <div>
    <Find :showNum="showNum" :message="message" :defaultAjax="defaultAjax"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :totalPages="totalPages" :showBtn="showBtn"></Paging>
  </div>
</template>

<script>
/**
 * Created by lqy on 2017/9/14.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapState, mapGetters } from 'vuex';
import Show from './Show';
import { Paging } from '../../../components/index';
import HarmfulResponseTest from '../../../api/SurveyReport/HarmfulResponseTest';

export default {
  activated() {
    this.authbtn = HarmfulResponseTest.authbtn();
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: '交易系统',
      },
      {
        path: '/SurveyReport',
        name: '调查报告',
        noLink: true,
      },
      {
        path: '/SurveyReport/HarmfulResponseTest',
        name: '不良反应监测检查表',
        noLink: true,
      },
    ]);
  },
  watch: {
    authList() {
      this.authbtn = HarmfulResponseTest.authbtn();
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
      'View_UserInfo',
    ]),
  },
  data() {
    return {
      authbtn: {},              //  识别用户拥有的权限
      page: 1,
      total: 0,
      size: 20,
      totalPages: 0,
      defaultAjax: 0,   // 控制下拉框默认
      showNum: 4,       // 搜索框显示表单的个数
      showBtn: {
        create: true,
      },
      // 搜索字段
      message: [
        {
          key: 'hospitalMemberName',
          label: '填报单位',
          placeholder: '请输入填报单位',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          type: 9,  // 类型
          key: 'fillTime',
          label: '填报日期',
          shortcuts: true,  // 是否开启快捷选择
          // defaultDate: true,  // 是否进来默认为一个月
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
