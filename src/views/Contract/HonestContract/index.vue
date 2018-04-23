<template>
  <div>
    <Find :showNum="6" :message="message" :defaultAjax="defaultAjax"></Find>
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
import HonestContact from '../../../api/Contract/HonestContact';

export default {
  activated() {
    this.authbtn = HonestContact.authbtn();
    // this.$bus.$on('project/getAll', this.getProjectAll);
    // this.getProjectAll();
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
        path: '/Contract/HonestContract',
        name: '廉洁合同',
        noLink: true,
      },
    ]);
    this.defaultAjax = 0; // 控制defaultAjax变化监听
    if (this.$route.query.from === 'index') {
      if (this.View_UserInfo.memberType === 3) {
        this.$set(this.message[3], 'defaults', [1, 3]);
        this.defaultAjax += 1; // 控制defaultAjax变化监听
      } else if (this.View_UserInfo.memberType === 4) {
        this.$set(this.message[3], 'defaults', [1, 2]);
        this.$set(this.message[2], 'defaults', [2]);
        this.defaultAjax += 1; // 控制defaultAjax变化监听
      } else if (this.View_UserInfo.memberType === 2) {
        this.$set(this.message[3], 'defaults', [1, 2]);
        this.$set(this.message[2], 'defaults', [3]);
        this.defaultAjax += 1; // 控制defaultAjax变化监听
      }
    }
    if (this.View_UserInfo.memberType === 2) {
      // this.message[2].selects.splice(1, 1);
      this.message[2].selects = [{ label: '配送企业', value: 3 }];
      this.$set(this.message[2], 'defaults', [3]);
    }
  },
  deactivated() {
    // this.$bus.$off('project/getAll', this.getProjectAll);
  },
  components: {
    Show,
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
      this.authbtn = HonestContact.authbtn();
    },
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
      // 搜索字段
      message: [
        {
          key: 'firstPartyName',
          label: '甲方',
          placeholder: '请输入甲方名称',
          type: 0,
          selects: [],
        },
        {
          key: 'secondPartyName',
          label: '乙方',
          placeholder: '请输入乙方名称',
          type: 0,
          selects: [],
        },
        {
          key: 'contractType',
          label: '合同类型',
          placeholder: '请输入合同类型',
          type: 2,
          selects: [
            {
              label: '生产企业',
              value: 1,
            },
            {
              label: 'GPO',
              value: 2,
            },
            {
              label: '配送企业',
              value: 3,
            },
          ],
        },
        {
          key: 'contractStatus',
          label: '合同状态',
          placeholder: '请输入合同状态',
          type: 2,
          selects: [
            {
              label: '待签章',
              value: 1,
            },
            {
              label: '甲方已签章',
              value: 2,
            },
            {
              label: '乙方已签章',
              value: 3,
            },
            {
              label: '已生效',
              value: 4,
            },
          ],
        },
        {
          type: 9,  // 类型
          key: 'createTime',
          label: '申请日期',
          shortcuts: true,  // 是否开启快捷选择
          defaultDate: true,  // 是否进来默认为一个月
        },
        // {
        //   key: 'createTime',
        //   label: '申请日期',
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
      ],
    };
  },
  methods: {
    dataPage(page, size, total) {
      this.page = page;
      this.size = size;
      this.total = total;
    },
  },
};
</script>
