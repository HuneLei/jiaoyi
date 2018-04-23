<template>
  <div>
    <Find :showNum="showNum" :message="message" :defaultAjax="defaultAjax"></Find>
    <Show></Show>
    <Paging :authbtn="authbtn" :showBtn="showBtn" :pageShow="false"></Paging>
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
  import MonthlyCollect from '../../../api/General/MonthlyCollect';   // api

  export default {
    activated() {
      if (this.getPrincipal.memberType === 4 || this.getPrincipal.memberType === 5) {
        this.showBtn.exportData = true;
      }
      // 面包屑
      this.authbtn = MonthlyCollect.authbtn();
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
          path: '/General/MonthlyCollect',
          name: '月度汇总报表',
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
        this.authbtn = MonthlyCollect.authbtn();
      },
    },
    components: {
      Show,
    },
    data() {
      return {
        showBtn: {
          exportData: false,
        },
        authbtn: {},              //  识别用户拥有的权限
        defaultAjax: 0,
        showNum: 4,       // 搜索框显示表单的个数
        // 搜索字段
        message: [
          {
            key: 'hospitalMemberName',
            label: '医疗机构',
            placeholder: '请输入医疗机构',
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
          {
            key: 'countYear',
            label: '统计年份',
            placeholder: '请选择统计年份',
            type: 4,
            noClearable: true,
            datetype: 'year',
            dateValue: new Date(),
            convertdate: 3,
          },
        ],
      };
    },
  };
</script>

