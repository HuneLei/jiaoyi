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
import HospitalRegulations from '../../../api/Deliverrelation/HospitalRegulations';    // api
import common from '../../../api/common';               // api -- 公用api

export default {
  activated() {
    this.authbtn = HospitalRegulations.authbtn();
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
        path: '/HospitalRegulations',
        name: '医院品规报表',
        noLink: true,
      },
    ]);
    // 获取集采项目下拉
    this.$bus.$on('project/getAll', this.getProjectAll);
    this.getProjectAll();
    this.getLevels();
    this.getHospitalCatalog();
  },
  eactivated() {
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
      this.authbtn = HospitalRegulations.authbtn();
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
          key: 'hospitalMemberName',
          label: '医疗机构',
          placeholder: '请输入医疗机构',
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
        },
        {
          key: 'levels',
          label: '机构级别',
          placeholder: '请选择机构级别',
          hasOp: false,
          type: 2,
          selects: [],
        },
        {
          key: 'hospitalCatalog',
          label: '机构类型',
          placeholder: '请选择机构类型',
          hasOp: false,
          type: 2,
          selects: [],
        },
        {
          type: 4,  // 类型
          key: 'createDate',
          label: '截止日期',
          placeholder: '请选择截止日期',
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
      this.message[1].selects = this.projectOptions; // 给项目集采名称options赋值
      this.message[1].defaults = this.getProjectId;
      this.defaultAjax += 1; // 控制defaultAjax变化监听
    },
    // 获取医疗机构级别
    getLevels() {
      const parentId = 23;          // 机构级别
      // 机构级别
      common.parameterListAll(parentId).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          const arr = [];
          for (let i = 0; i < data.length; i += 1) {
            arr.push({
              label: data[i].paramValue,   // 显示
              value: data[i].id,     // id值
            });
          }
          this.message[2].selects = arr;
        }
      });
    },
    // 获取机构类型
    getHospitalCatalog() {
      const parentId = 27;          // 机构类型
      // 请求机构级
      common.parameterListAll(parentId).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          const arr = [];
          for (let i = 0; i < data.length; i += 1) {
            arr.push({
              label: data[i].paramValue,   // 显示
              value: data[i].id,     // id值
            });
          }
          this.message[3].selects = arr;    // 给项目集采名称options赋值
        }
      });
    },
  },
};
</script>
