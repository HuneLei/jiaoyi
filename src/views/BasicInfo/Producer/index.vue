<template>
  <div>
    <Find :showNum="4" :message="message" :defaultAjax="defaultAjax"></Find>
    <Show :authbtn="authbtn"  @page="dataPage"></Show>
    <Paging :authbtn="authbtn"  :page="page" :size="size" :total="total" :totalPages="totalPages"></Paging>
  </div>
</template>

<script>
/**
 * Created by lqy on 2017/9/4.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapState, mapGetters } from 'vuex';
import Show from './Show';
import { Paging } from '../../../components/index';
import common from '../../../api/common';               // api -- 公用api
import Producer from '../../../api/BasicInfo/Producer';   // api -- 医疗机构
import project from '../../../api/BasicInfo/Project';   // api -- project[集采项目]

export default {
  activated() {
    this.authbtn = Producer.authbtn();
    this.$bus.$on('project/getAll', this.getProjectAll);
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
        path: '/Producer',
        name: '生产企业',
        noLink: true,
      },
    ]);
    //  获取集采项目下拉
    this.getProjectAll(this.getGpoId);
  },
  deactivated() {
    this.$bus.$off('project/getAll', this.getProjectAll);
  },
  components: {
    Show,
    Paging,
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
      this.authbtn = Producer.authbtn();
    },
  },
  data() {
    return {
      authbtn: {},              //  识别用户拥有的权限
      page: 1,
      size: 50,
      total: 0,
      totalPages: 0,
      defaultAjax: 0,   // 控制下拉框默认
      showNum: 4,       // 搜索框显示表单的个数
      // 搜索字段
      message: [
        {
          key: 'enterpriseCode',
          label: '生产企业编码',
          placeholder: '请输入生产企业编码',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'enterpriseName',
          label: '生产企业',
          placeholder: '请输入生产企业名称',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'region',
          label: '所在地区',
          placeholder: '请选择所在地区',
          hasOp: false,
          type: 3,
          selects: [],
        },
        {
          key: 'projectId',
          label: '集采项目',
          placeholder: '请选择集采项目名称',
          hasOp: false,
          type: 1,
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
    // 获取集采项目下拉
    getProjectAll() {
      this.message[3].selects = this.projectOptions; // 给项目集采名称options赋值
      this.message[3].defaults = this.getProjectId;  // 给项目集采名称options赋值
      this.defaultAjax += 1;
    },
  },
};
</script>
