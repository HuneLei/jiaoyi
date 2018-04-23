<template>
  <div>
    <Find :showNum="showNum" :message="message"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :totalPages="totalPages" :showBtn="showBtn"></Paging>
    <Edit></Edit>
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
  import Edit from './Edit';
  import Show from './Show';
  import { Paging } from '../../../components/index';
  import CoverRate from '../../../api/BasicInfo/CoverRate';

  export default {
    activated() {
      this.authbtn = CoverRate.authbtn();
      this.$bus.emit('gpo/disabled', 0);
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
          path: '/CoverRate',
          name: '覆盖率管理',
          noLink: true,
        },
      ]);
      this.btnAuthority();
    },
    watch: {
      authList() {
        this.authbtn = CoverRate.authbtn();
      },
    },
    components: {
      Edit,
      Paging,
      Show,
    },
    computed: mapGetters([
      'View_UserInfo',
    ]),
    data() {
      return {
        authbtn: {},              //  识别用户拥有的权限
        page: 0,
        total: 0,
        size: 15,
        totalPages: 0,
        showNum: 4,       // 搜索框显示表单的个数
        showBtn: {
          destory: false,
          create: true,
          pwnolock: false,
        },
        // 搜索字段
        message: [
          {
            key: 'enterpriseName',
            label: '配送企业名称',
            placeholder: '请输入配送企业名称',
            hasOp: false,
            type: 0,
            selects: [],
          },
          {
            key: 'audtiStatus',
            label: '审核状态',
            placeholder: '请选择审核状态',
            hasOp: false,
            type: 1,
            selects: [
              {
                label: '待审核',
                value: '0',
              },
              {
                label: '审核通过',
                value: '1',
              },
              {
                label: '审核不通过',
                value: '2',
              },
            ],
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
      btnAuthority() {
        if (this.View_UserInfo.memberType === 5) {
          this.showBtn.create = false;
        }
      },
    },
    beforeRouteLeave(to, from, next) {
      this.$bus.emit('gpo/disabled', 1);
      next();
    },
  };
</script>
