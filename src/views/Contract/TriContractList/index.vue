<template>
  <div>
    <Find :showNum="8" :moreShow="0" :message="message" :defaultAjax="defaultAjax"></Find>
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
import TriContractList from '../../../api/Contract/TriContractList';
import Show from './Show';

export default {
  activated() {
    if (this.View_UserInfo.memberType === 3) {
      this.showBtn.create = true;
    }
    if (this.View_UserInfo.memberType === 2 && this.message[7].key === 'kind') {
      this.message.splice(7, 1);
      this.message[4].selects.splice(0, 3);
    }
    this.defaultAjax = 0; // 控制defaultAjax变化监听
    if (this.$route.query.from === 'index' && this.View_UserInfo.memberType === 3) {
      this.$set(this.message[4], 'defaults', '2');
      this.defaultAjax += 1; // 控制defaultAjax变化监听
    } else if (this.$route.query.from === 'index' && this.View_UserInfo.memberType === 2) {
      this.$set(this.message[4], 'defaults', '3');
      this.defaultAjax += 1; // 控制defaultAjax变化监听
    } else if (this.$route.query.from === 'index' && this.View_UserInfo.memberType === 4) {
      this.$set(this.message[4], 'defaults', '4');
      this.defaultAjax += 1; // 控制defaultAjax变化监听
    }
    this.authbtn = TriContractList.authbtn();
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
        path: '/Contract/TriContractList',
        name: '三方合同列表',
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
      this.authbtn = TriContractList.authbtn();
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
        create: false,
      },
      // 搜索字段
      message: [
        {
          key: 'code',
          label: '合同编号',
          placeholder: '请输入合同编号',
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
          label: '创建日期',
          shortcuts: true,  // 是否开启快捷选择
          defaultDate: true,  // 是否进来默认为一个月
        },
        {
          key: 'contractStatus',
          label: '合同状态',
          type: 1,
          selects: [
            {
              label: '待提交',
              value: '0',
            },
            {
              label: '已提交',
              value: '1',
            },
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
          key: 'closeStatus',
          label: '结案状态',
          type: 1,
          selects: [
            {
              label: '无',
              value: '0',
            },
            {
              label: '部分结案',
              value: '1',
            },
            {
              label: '已结案',
              value: '2',
            },
          ],
        },
        {
          type: 9,  // 类型
          key: 'validtime',
          label: '合同有效期',
          shortcuts: true,  // 是否开启快捷选择
          // defaultDate: true,  // 是否进来默认为一个月
        },
        {
          key: 'kind',
          label: '显示草稿合同',
          type: 1,
          defaults: '1',
          selects: [
            {
              label: '是',
              value: '0',
            },
            {
              label: '否',
              value: '1',
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
          key: 'outNo',
          label: '外部合同编号',
          placeholder: '请输入外部合同编号',
          type: 0,
          selects: [],
        },
      ],
      contractOption: [
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
    };
  },
  methods: {
    // 获取集采项目下拉
    getProjectAll() {
      this.message[this.message.length - 2].selects = this.projectOptions; // 给项目集采名称options赋值
      if (this.$route.query.from === 'index') {
        this.$set(this.message[this.message.length - 2], 'defaults', '');
      } else {
        this.message[this.message.length - 2].defaults = this.getProjectId; // 给项目集采名称options赋值
      }
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
