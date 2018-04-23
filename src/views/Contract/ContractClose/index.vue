<template>
  <div>
    <Find :showNum="7" :message="message" :defaultAjax="defaultAjax"></Find>
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
import ContractClose from '../../../api/Contract/ContractClose';

export default {
  activated() {
    this.authbtn = ContractClose.authbtn();
    this.defaultAjax = 0; // 控制defaultAjax变化监听
    if (this.$route.query.from === 'index' && this.View_UserInfo.memberType === 2) {
      this.$set(this.message[4], 'defaults', '1');
      this.defaultAjax += 1; // 控制defaultAjax变化监听
    } else if (this.$route.query.from === 'index' && this.View_UserInfo.memberType === 4) {
      this.$set(this.message[4], 'defaults', '2');
      this.defaultAjax += 1; // 控制defaultAjax变化监听
    }
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
        path: '/Contract/ContractClose',
        name: '合同结案申请单',
        noLink: true,
      },
    ]);
  },
  deactivated() {
    this.$bus.$off('project/getAll', this.getProjectAll);
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
      this.authbtn = ContractClose.authbtn();
    },
  },
  data() {
    return {
      authbtn: {},              //  识别用户拥有的权限
      page: 1,
      size: 20,
      total: 0,
      defaultAjax: 0,
      showBtn: {},
      // 搜索字段
      message: [
        {
          key: 'code',
          label: '结案申请单号',
          placeholder: '请输入结案申请单编号',
          type: 0,
          selects: [],
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
          type: 9,  // 类型
          key: 'createTime',
          label: '申请日期',
          shortcuts: true,  // 是否开启快捷选择
          defaultDate: true,  // 是否进来默认为一个月
        },
        {
          key: 'auditStatus',
          label: '审核状态',
          placeholder: '请输入审核状态',
          type: 1,
          selects: [
            {
              label: '待审核(配送企业)',
              value: '1',
            },
            {
              label: '待审核(GPO)',
              value: '2',
            },
            {
              label: '已结案',
              value: '3',
            },
            {
              label: '已拒绝(配送企业)',
              value: '4',
            },
            {
              label: '已拒绝(GPO)',
              value: '5',
            },
          ],
        },
        {
          key: 'projectId',
          label: '集采项目',
          type: 1,
          selects: [],
        },
        {
          key: 'closeType',
          label: '结案类型',
          placeholder: '请输入结案类型',
          type: 1,
          selects: [
            {
              label: '合同结案',
              value: 0,
            },
            {
              label: '合同明细结案',
              value: 1,
            },
          ],
        },
      ],
    };
  },
  methods: {
    // 获取集采项目下拉
    getProjectAll() {
      this.message[5].selects = this.projectOptions; // 给项目集采名称options赋值
      this.message[5].defaults = this.getProjectId; // 给项目集采名称options赋值
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
