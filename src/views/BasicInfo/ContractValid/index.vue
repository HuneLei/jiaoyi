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
import ContractVaild from '../../../api/BasicInfo/ContractVaild';   // api

export default {
  activated() {
    this.authbtn = ContractVaild.authbtn();
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
        path: '/ContractValid',
        name: '合同有效期设置',
        noLink: true,
      },
    ]);
    //  获取集采项目下拉
    this.getProjectAll(this.getGpoId);
  },
  deactivated() {
    this.$bus.$off('project/getAll', this.getProjectAll);
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
      this.authbtn = ContractVaild.authbtn();
    },
  },
  components: {
    Paging,
    Show,
    Edit,
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
          key: 'id',
          label: '集采项目',
          placeholder: '请选择集采项目名称',
          hasOp: false,
          type: 1,
          defaults: '',
          selects: [],
          selected: null,
        },
        {
          key: 'contractValid',
          label: '有效期方式',
          placeholder: '请选择合同有效期方式',
          hasOp: false,
          type: 1,
          selects: [
            {
              value: 0,
              label: '时间截止方式',
            },
            {
              value: 1,
              label: '时长截止方式',
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
    // 获取集采项目下拉
    getProjectAll(gpoId) {
      this.message[0].selects = this.projectOptions; // 给项目集采名称options赋值
      this.message[0].defaults = this.getProjectId;  // 给项目集采名称options赋值
      this.defaultAjax += 1;
    },
  },
};
</script>

