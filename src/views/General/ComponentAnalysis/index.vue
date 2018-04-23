<template>
  <div>
    <Find :showNum="4" :moreShow="0" :message="message" :defaultAjax="defaultAjax"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :totalPages="totalPages" :showBtn="showBtn"></Paging>
  </div>
</template>


<script>
import { mapState, mapGetters } from 'vuex';
import Show from './Show';
import ComponentAnalysis from '../../../api/General/ComponentAnalysis';
import common from '../../../api/common';               // api -- 公用api

export default {
  activated() {
    this.authbtn = ComponentAnalysis.authbtn();
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
        path: '/ComponentAnalysis',
        name: '构成分析',
        noLink: true,
      },
    ]);
    // 获取集采项目下拉
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
      this.authbtn = ComponentAnalysis.authbtn();
    },
  },
  components: {
    Show,
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
      },
      message: [
        {
          type: 9,  // 类型
          key: 'dataTime',
          label: '统计期间',
          shortcuts: true,  // 是否开启快捷选择
          // defaultDate: true,  // 是否进来默认为一个月
        },
        {
          key: 'objectType',
          label: '对象',
          placeholder: '请选择对象',
          defaults: 2,
          noClearable: true,
          type: 1,
          selects: [
            {
              value: 1,
              label: '医疗机构级别',
            },
            {
              value: 2,
              label: '医疗机构',
            },
            {
              value: 3,
              label: '配送企业',
            },
            {
              value: 4,
              label: '卖方',
            },
            {
              value: 5,
              label: '药品',
            },
            {
              value: 6,
              label: '剂型',
            },
            {
              value: 7,
              label: '质量层次',
            },
            {
              value: 8,
              label: '月份',
            },
          ],
        },
        {
          key: 'hospitalMemberName',
          label: '医疗机构',
          placeholder: '请输入医疗机构',
          type: 0,
          selects: [],
        },
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
          key: 'tradeName',
          label: '商品名',
          placeholder: '请输入商品名',
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
          key: 'producerName',
          label: '生产企业',
          placeholder: '请输入生产企业',
          type: 0,
          selects: [],
        },
        {
          key: 'salerMemberName',
          label: '卖方会员',
          placeholder: '请输入卖方会员',
          type: 0,
          selects: [],
        },
        {
          key: 'drugStandardCode',
          label: '本位码',
          placeholder: '请输入本位码',
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
      this.message[0].defaults = this.getProjectId;
      this.defaultAjax += 1; // 控制defaultAjax变化监听
    },
  },
};
</script>
