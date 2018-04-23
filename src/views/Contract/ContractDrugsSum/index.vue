<template>
  <div>
    <Find :showNum="8" :message="message" :defaultAjax="defaultAjax"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :showBtn="showBtn"></Paging>
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
import ContractDrugsSum from '../../../api/Contract/ContractDrugsSum';

export default {
  activated() {
    this.authbtn = ContractDrugsSum.authbtn();
    this.$bus.$on('project/getAll', this.getProjectAll);
    this.getProjectAll();
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Contract',
        name: '合同管理',
        noLink: true,
      },
      {
        path: '/Contract/ContractDrugsSum',
        name: '合同药品统计',
        noLink: true,
      },
    ]);
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
      this.authbtn = ContractDrugsSum.authbtn();
    },
  },
  components: {
    Show,
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
          type: 9,  // 类型
          key: 'createTime',
          label: '创建日期',
          shortcuts: true,  // 是否开启快捷选择
          defaultDate: true,  // 是否进来默认为一个月
        },
        // {
        //   key: 'createTime',
        //   label: '创建日期',
        //   convertdate: 2,
        //   type: 5,
        //   placeholder: '请选择日期',
        //   selects: [],
        //   defaultDate: true,
        //   pickerOptions: {
        //     shortcuts: [{
        //       text: '最近三个月',
        //       onClick(picker) {
        //         const end = new Date();
        //         const start = new Date();
        //         start.setTime(start.getTime() - (3600 * 1000 * 24 * 90));
        //         picker.$emit('pick', [start, end]);
        //       },
        //     }, {
        //       text: '最近半年',
        //       onClick(picker) {
        //         const end = new Date();
        //         const start = new Date();
        //         start.setTime(start.getTime() - (3600 * 1000 * 24 * 182));
        //         picker.$emit('pick', [start, end]);
        //       },
        //     }, {
        //       text: '最近一年',
        //       onClick(picker) {
        //         const end = new Date();
        //         const start = new Date();
        //         start.setTime(start.getTime() - (3600 * 1000 * 24 * 365));
        //         picker.$emit('pick', [start, end]);
        //       },
        //     }],
        //   },
        // },
        {
          key: 'projectId',
          label: '集采项目',
          type: 1,
          selects: [],
        },
        {
          key: 'contractStatus',
          label: '合同状态',
          placeholder: '请选择合同状态',
          type: 2,
          selects: [
            {
              label: '待签章(医疗机构)',
              value: '2',
            },
            {
              label: '待签章(配送企业)',
              value: '3',
            },
            {
              label: '待签章(GPO)',
              value: '4',
            },
            {
              label: '已生效',
              value: '7',
            },
            {
              label: '已作废',
              value: '5',
            },
            {
              label: '已过期',
              value: '6',
            },
            {
              label: '已结案',
              value: '8',
            },
          ],
        },
        {
          key: 'purchaseStatus',
          label: '采购状态',
          type: 2,
          placeholder: '请选择采购状态',
          selects: [
            {
              label: '从未下单',
              value: '1',
            },
            {
              label: '未超一半',
              value: '2',
            },
            {
              label: '超过一半',
              value: '3',
            },
            {
              label: '未完成采购',
              value: '4',
            },
            {
              label: '完成采购',
              value: '5',
            },
          ],
        },
        {
          key: 'executeStatus',
          label: '执行状态',
          type: 2,
          placeholder: '请选择执行状态',
          selects: [
            {
              label: '从未下单',
              value: '1',
            },
            {
              label: '未超一半',
              value: '2',
            },
            {
              label: '超过一半',
              value: '3',
            },
            {
              label: '超过70%',
              value: '4',
            },
            {
              label: '未完成采购',
              value: '5',
            },
            {
              label: '完成执行',
              value: '6',
            },
          ],
        },
        {
          key: 'specName',
          label: '规格',
          placeholder: '请输入规格',
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
      ],
    };
  },
  methods: {
    // 获取集采项目下拉
    getProjectAll() {
      this.message[3].selects = this.projectOptions; // 给项目集采名称options赋值
      this.message[3].defaults = this.getProjectId; // 给项目集采名称options赋值
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

