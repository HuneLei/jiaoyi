<template>
  <div>
    <Find :showNum="showNum" :message="message" :defaultAjax="defaultAjax"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :totalPages="totalPages"></Paging>
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
import { mapState, mapGetters } from 'vuex';
import Show from './Show';
import Edit from './Edit';
import { Paging } from '../../../components/index';
import project from '../../../api/BasicInfo/Project';   // api
import DeliverTime from '../../../api/BasicInfo/DeliverTime';   // api -- 医疗机构

export default {
  activated() {
    this.authbtn = DeliverTime.authbtn();
    this.$bus.$on('project/getAll', this.getProjectAll);
    // 面包屑
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
        path: '/DeliverTime',
        name: '点配送时间设置',
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
    Paging,
    Show,
    Edit,
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
      this.authbtn = DeliverTime.authbtn();
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
          key: 'projectId',
          label: '集采项目',
          placeholder: '请选择集采项目名称',
          hasOp: false,
          type: 1,
          defaults: '',
          selects: [],
          selected: null,
        },
        {
          key: 'projectSubName',
          label: '集采子项目',
          placeholder: '请输入集采子项目',
          hasOp: false,
          type: 0,
          defaults: '',
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
      this.message[0].selects = this.projectOptions; // 给项目集采名称options赋值
      this.message[0].defaults = this.getProjectId;  // 给项目集采名称options赋值
      this.defaultAjax += 1;
    },
  },
};
</script>

