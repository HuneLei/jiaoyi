<template>
  <div>
    <Find :showNum="8" :message="message" :defaultAjax="defaultAjax"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging  :authbtn="authbtn" :page="page" :size="size" :total="total" :showBtn="showBtn"></Paging>
    <Hospitals></Hospitals>
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
import Hospitals from './Hospital';
import { Paging } from '../../../components/index';
import common from '../../../api/common';               // api -- 公用api
import Hospital from '../../../api/BasicInfo/Hospital';   // api -- 医疗机构
import project from '../../../api/BasicInfo/Project';   // api -- project[集采项目]

export default {
  activated() {
    this.authbtn = Hospital.authbtn();
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
        path: '/MedicalInstitution',
        name: '医疗机构',
        noLink: true,
      },
    ]);
    //  获取集采项目下拉
    this.getProjectAll(this.getGpoId);
    // 获取医疗机构级别
    this.getLevels();
    // 获取机构类型
    this.getHospitalCatalog();
    this.$bus.$on('data/page/do', this.dataCreate);
    if (this.View_UserInfo.memberType === 4 || this.View_UserInfo.memberType === 5) {
      this.showBtn.create = true;
    }
  },
  deactivated() {
    this.$bus.$off('project/getAll', this.getProjectAll);
    this.$bus.$off('data/page/do', this.dataCreate);
  },
  components: {
    Show,
    Paging,
    Hospitals,
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
      this.authbtn = Hospital.authbtn();
    },
  },
  data() {
    return {
      authbtn: {},              //  识别用户拥有的权限
      page: 1,
      size: 50,
      total: 0,
      totalPages: 0,
      showBtn: {
        create: false,
      },
      showNum: 4,       // 搜索框显示表单的个数
      defaultAjax: 0,   // 控制下拉框默认
      // 搜索字段
      message: [
        {
          key: 'hospitalCode',
          label: '医疗机构编码',
          placeholder: '请输入医疗机构编码',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'hospitalName',
          label: '医疗机构',
          placeholder: '请输入医疗机构名称',
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
          key: 'levels',
          label: '医疗机构级别',
          placeholder: '请输入医疗机构级别',
          hasOp: false,
          type: 1,
          selects: [],
        },
        {
          key: 'outCode',
          label: '外部编码',
          placeholder: '请输入医疗机构外部编码',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'ifCrossOrder',
          label: '发票可跨订单',
          placeholder: '请选择发票可跨订单开票',
          hasOp: false,
          index: 1,
          type: 1,
          selects: [
            {
              value: '',
              label: '全部',
            },
            {
              value: 1,
              label: '是',
            },
            {
              value: 0,
              label: '否',
            },
          ],
        },
        {
          key: 'hospitalCatalog',
          label: '机构类型',
          placeholder: '请选择机构类型',
          hasOp: false,
          type: 1,
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
    dataCreate() {
      this.$bus.$emit('data/choosehospital');
    },
    dataPage(page, size, total, totalPages) {
      this.page = page;
      this.size = size;
      this.total = total;
      this.totalPages = totalPages;
    },
    // 获取集采项目下拉
    getProjectAll() {
      this.message[7].selects = this.projectOptions; // 给项目集采名称options赋值
      this.message[7].defaults = this.getProjectId;  // 给项目集采名称options赋值
      this.defaultAjax += 1;                         // 控制defaultAjax变化监听
    },
    // 获取医疗机构级别
    getLevels() {
      const parentId = 23;          // 机构级别
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
              value: data[i].paramValue,     // id值
            });
          }
          this.message[6].selects = arr;    // 给项目集采名称options赋值
        }
      });
    },
  },
};
</script>
