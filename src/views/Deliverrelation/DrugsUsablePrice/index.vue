<template>
  <div>
    <Find :showNum="8" :moreShow="0" :message="message" :defaultAjax="defaultAjax"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :totalPages="totalPages" :showBtn="showBtn"></Paging>
    <ChangePrice></ChangePrice>
  </div>
</template>


<script>
/**
 * Created by tuxiaoan on 2017/9/5.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapState, mapGetters } from 'vuex';
import DrugsUsablePrice from '../../../api/Deliverrelation/DrugsUsablePrice';  // 可采药品价格维护修改价格api
import Show from './Show';
import ChangePrice from './ChangePrice';    //  修改价格弹框

export default {
  activated() {
    this.authbtn = DrugsUsablePrice.authbtn();
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
        path: '/DrugsUsablePrice',
        name: '协议价维护',
        noLink: true,
      },
    ]);
    this.$bus.$on('project/getAll', this.getProjectAll);
    this.getProjectAll();
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
      this.authbtn = DrugsUsablePrice.authbtn();
      // console.log();
    },
  },
  components: {
    Show,
    ChangePrice,
  },
  data() {
    return {
      authbtn: {},              //  识别用户拥有的权限
      page: 0,
      size: 50,
      total: 0,
      totalPages: 0,
      defaultAjax: 0,
      showBtn: {
        exportData: true,
        importData: true,
      },
      message: [
        {
          key: 'drugsCode',
          label: '药品编码',
          placeholder: '请输入药品编码',
          hasOp: false,
          type: 0,
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
          key: 'deliveryMemberName',
          label: '配送企业',
          placeholder: '请输入配送企业',
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
        {
          key: 'formName',
          label: '剂型',
          placeholder: '请选择剂型',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'specName',
          label: '规格',
          placeholder: '请输入规格',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'tradeName',
          label: '商品名',
          placeholder: '请输入商品名',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'approvalNumber',
          label: '批准文号',
          placeholder: '请输入批准文号',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'salerMemberName',
          label: '卖方会员',
          placeholder: '请输入卖方会员',
          hasOp: false,
          type: 0,
          selects: [],
        },
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
      this.message[9].selects = this.projectOptions; // 给项目集采名称options赋值
      this.message[9].defaults = this.getProjectId;
      this.defaultAjax += 1; // 控制defaultAjax变化监听
    },
  },
};
</script>
