<template>
  <div>
    <Find :showNum="8" :moreShow="0" :message="message" :defaultAjax="defaultAjax"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :showBtn="showBtn"></Paging>
    <ChangeEditDialog></ChangeEditDialog>
  </div>
</template>


<script>
/**
 * Created by wuqian on 2017/9/20.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapState, mapGetters } from 'vuex';
import Show from './Show';
import ChangeEditDialog from './ChangeEditDialog';
import DrugsCode from '../../../api/Drugs/DrugsCode'; // 药品编码对照APi

export default {
  activated() {
    if (this.getPrincipal.memberType === 4) {
      this.showBtn.importData = false;
    }
    if (this.getPrincipal.memberType === 3) {
      if (this.message[9].key === 'hospitalName') {
        this.message.splice(9, 1);
      }
    }
    this.authbtn = DrugsCode.authbtn();
    this.$bus.$on('project/getAll', this.getProjectAll);
    this.getProjectAll();
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Drugs',
        name: '药品管理',
        noLink: true,
      },
      {
        path: '/Drugs/DrugsCode',
        name: '药品编码对照',
        noLink: true,
      },
    ]);
  },
  deactivated() {
    this.$bus.$off('project/getAll', this.getProjectAll);
  },
  computed: {
    getPrincipal() {
      return this.$store.state.view.principal;
    },
    authList() {
      return this.$store.state.view.authList;
    },
    ...mapGetters([
      'getGpoId',
      'projectOptions',
      'getProjectId',
    ]),
  },
  watch: {
    authList() {
      this.authbtn = DrugsCode.authbtn();
    },
  },
  components: {
    Show,
    ChangeEditDialog,
  },
  data() {
    return {
      authbtn: {},              //  识别用户拥有的权限
      page: 1,
      size: 20,
      total: 0,
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
          type: 0,
          selects: [],
        },
        {
          key: 'drugsName',
          label: '通用名',
          placeholder: '请输入通用名',
          type: 0,
          selects: [],
        },
        {
          key: 'formName',
          label: '剂型',
          placeholder: '请输入剂型',
          type: 0,
          selects: [],
        },
        {
          key: 'specificationName',
          label: '规格',
          placeholder: '请输入规格',
          type: 0,
          selects: [],
        },
        {
          key: 'producerName',
          label: '生产企业',
          placeholder: '请输入生产企业',
          type: 0,
          selects: [],
        },
        {
          key: 'tradeName',
          label: '商品名',
          placeholder: '请输入商品名',
          type: 0,
          selects: [],
        },
        {
          key: 'approvalNumber',
          label: '批准文号',
          placeholder: '请输入批准文号',
          type: 0,
          selects: [],
        },
        {
          key: 'hospitalInnerCode',
          label: '医院内部编码',
          placeholder: '请输入医院内部编码',
          type: 0,
          selects: [],
        },
        {
          key: 'projectId',
          label: '集采项目',
          type: 1,
          selects: [],
        },
        {
          key: 'hospitalName',
          label: '医疗机构',
          placeholder: '请输入医疗机构',
          type: 0,
          selects: [],
        },
        {
          key: 'enrollName',
          label: '卖方会员',
          placeholder: '请输入卖方会员',
          type: 0,
          selects: [],
        },
        {
          key: 'superviseCode',
          label: '卫监码',
          placeholder: '请输入卫监码',
          type: 0,
          selects: [],
        },
      ],
    };
  },
  methods: {
    // 获取集采项目下拉
    getProjectAll() {
      this.message[8].selects = this.projectOptions; // 给项目集采名称options赋值
      this.message[8].defaults = this.getProjectId; // 给项目集采名称options赋值
      this.defaultAjax += 1; // 控制defaultAjax变化监听
    },
    dataPage(page, size, total) {
      this.page = page;
      this.size = size;
      this.total = total;
    },
  },
};
</script>

