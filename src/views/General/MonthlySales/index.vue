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
  import MonthlySales from '../../../api/General/MonthlySales';   // api

  export default {
    activated() {
      if (this.getPrincipal.memberType === 4 || this.getPrincipal.memberType === 5) {
        this.showBtn.exportData = true;
      }
      // 面包屑
      this.authbtn = MonthlySales.authbtn();
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
          path: '/General/MonthlySales',
          name: '月度销售报表',
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
        this.authbtn = MonthlySales.authbtn();
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
        authbtn: {},
        defaultAjax: 0,
        showNum: 4,       // 搜索框显示表单的个数
        // 搜索字段
        message: [
          {
            key: 'mechanismType',
            label: '机构类型',
            placeholder: '请选择机构类型',
            type: 1,
            noClearable: true,
            defaults: 1,
            selects: [
              {
                value: 1,
                label: '医疗机构',
              },
              {
                value: 2,
                label: '配送企业',
              },
              {
                value: 3,
                label: '生产企业',
              },
            ],
          },
          {
            key: 'countType',
            label: '统计维度',
            placeholder: '请选择统计维度',
            type: 1,
            noClearable: true,
            defaults: 1,
            selects: [
              {
                value: 1,
                label: '金额',
              },
              {
                value: 2,
                label: '数量',
              },
            ],
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

