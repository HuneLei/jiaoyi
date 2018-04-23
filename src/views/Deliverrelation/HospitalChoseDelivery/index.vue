<template>
  <div>
    <Find :showNum="8" :moreShow="0" :message="message" :defaultAjax="defaultAjax" @selectValue="getSelectValue"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :totalPages="totalPages" :showBtn="showBtn"></Paging>
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
import Show from './Show';
import HospitalChoseDelivery from '../../../api/Deliverrelation/HospitalChoseDelivery';    // api

export default {
  activated() {
    this.message[4].input = this.getPrincipal.memberName;
    this.authbtn = HospitalChoseDelivery.authbtn();
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
        path: '/HospitalChoseDelivery',
        name: '买方选择配送企业',
        noLink: true,
      },
    ]);
    // 获取集采项目下拉
    this.$bus.$on('project/getAll', this.getProjectAll);
    this.getProjectAll();
  },
  eactivated() {
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
      'View_UserInfo',
    ]),
  },
  watch: {
    authList() {
      this.authbtn = HospitalChoseDelivery.authbtn();
      // console.log();
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
          key: 'drugsCode',
          label: '药品编码',
          placeholder: '请输入药品编码',
          hasOp: false,
          type: 0,
          selects: [],
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
          key: 'hospitalMemberName',
          label: '医疗机构',
          placeholder: '请输入医疗机构',
          hasOp: false,
          type: 0,
          selects: [],
          input: '',
        },
        {
          key: 'formName',
          label: '剂型',
          placeholder: '请输入剂型',
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
          key: 'nameType',
          label: '是否已选择',
          hasOp: false,
          index: 1,
          type: 1,
          selects: [
            {
              value: 1,
              label: '是',
            },
            {
              value: 2,
              label: '否',
            },
          ],
        },
        {
          key: 'enrollName',
          label: '卖方会员',
          placeholder: '请输入卖方会员',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'projectId',
          label: '集采项目',
          type: 8,
          selects: [],
        },
        {
          key: 'projectSubId',
          label: '集采子项目',
          type: 1,
          filterable: true,
          selects: [],
        },
      ],
    };
  },
  methods: {
    // 得到集采项目改变值
    getSelectValue(val) {
      // console.log();
      this.subProjectAll(val);
    },
    dataPage(page, size, total, totalPages) {
      this.page = page;
      this.size = size;
      this.total = total;
      this.totalPages = totalPages;
    },
    // 获取集采项目下拉
    getProjectAll() {
      // console.log();
      this.message[11].selects = this.projectOptions; // 给项目集采名称options赋值
      this.message[11].defaults = this.getProjectId;
      this.defaultAjax += 1; // 控制defaultAjax变化监听
    },
    subProjectAll(val) {
      //  集采子项目
      if (this.getGpoId) {
        HospitalChoseDelivery.subAll(this.getGpoId, val || null).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            const subProjectOption = [];
            for (let i = 0; i < data.length; i += 1) {
              subProjectOption.push({
                value: data[i].id,
                label: data[i].name,
              });
            }
            this.message[12].selects = subProjectOption;
          }
        });
      }
    },
  },
};
</script>
