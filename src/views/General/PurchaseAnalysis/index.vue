<template>
  <div>
    <Find :showNum="8" :moreShow="0" :message="message" :defaultAjax="defaultAjax"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :totalPages="totalPages" :showBtn="showBtn"></Paging>
  </div>
</template>


<script>
import { mapState, mapGetters } from 'vuex';
import Show from './Show';
import PurchaseAnalysis from '../../../api/General/PurchaseAnalysis';
import common from '../../../api/common';               // api -- 公用api

export default {
  activated() {
    this.authbtn = PurchaseAnalysis.authbtn();
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
        path: '/PurchaseAnalysis',
        name: '采购分析',
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
      this.authbtn = PurchaseAnalysis.authbtn();
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
        exportData: false,
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
          key: 'objectType',
          label: '对象',
          type: 1,
          defaults: 1,
          noClearable: true,
          selects: [
            {
              value: 1,
              label: '医疗机构',
            },
            {
              value: 2,
              label: '配送企业',
            },
          ],
        },
        {
          type: 9,  // 类型
          key: 'dataTime',
          label: '统计期间',
          shortcuts: true,  // 是否开启快捷选择
          // defaultDate: true,  // 是否进来默认为一个月
        },
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
          key: 'producerName',
          label: '生产企业',
          placeholder: '请输入生产企业',
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
      this.message[7].selects = this.projectOptions; // 给项目集采名称options赋值
      this.message[7].defaults = this.getProjectId;
      this.defaultAjax += 1; // 控制defaultAjax变化监听
    },
  },
};
</script>
