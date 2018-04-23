<template>
  <div>
    <Find :showNum="7" :message="message" :defaultAjax="defaultAjax"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <div>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :totalPages="totalPages"></Paging>
    <Edit></Edit>
    <EditInvoice></EditInvoice>
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
import Delivery from '../../../api/BasicInfo/Delivery';   // api -- 医疗机构
import project from '../../../api/BasicInfo/Project';   // api -- project[集采项目]
import Edit from './Edit';
import EditInvoice from './EditInvoice';

export default {
  activated() {
    this.authbtn = Delivery.authbtn();
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
        path: '/Delivery',
        name: '经营企业',
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
    Edit,
    EditInvoice,
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
      this.authbtn = Delivery.authbtn();
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
          label: '经营企业编码',
          placeholder: '请输入经营企业编码',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'enterpriseName',
          label: '经营企业名称',
          placeholder: '请输入经营企业名称',
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
          key: 'roleType',
          label: '角色类型',
          placeholder: '请选择角色类型',
          hasOp: false,
          type: 1,
          selects: [
            {
              label: '卖方',
              value: 1,
            },
            {
              label: '配送方',
              value: 3,
            },
          ],
        },
        {
          key: 'enable',
          label: '启用状态',
          hasOp: false,
          index: 1,
          type: 1,
          selects: [
            {
              value: 0,
              label: '禁用',
            },
            {
              value: 1,
              label: '启用',
            },
          ],
        },
        {
          key: 'projectId',
          label: '集采项目',
          placeholder: '请选择集采项目名称',
          hasOp: false,
          type: 1,
          selects: [],
        },
        {
          key: 'outGpoNo',
          label: '外部编码',
          placeholder: '请输入经营企业外部编码',
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
    // 获取集采项目下拉
    getProjectAll() {
      this.message[5].selects = this.projectOptions; // 给项目集采名称options赋值
      this.message[5].defaults = this.getProjectId;  // 给项目集采名称options赋值
      this.defaultAjax += 1;
    },
  },
};
</script>
