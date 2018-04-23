<template>
  <div>
    <Find :showNum="showNum" :message="message"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :totalPages="totalPages" :showBtn="showBtn"></Paging>
    <Edit></Edit>
  </div>
</template>

<script>
/**
 * Created by dingyiming on 2017/6/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import Edit from './Edit';
import Show from './Show';
import { Paging } from '../../../components/index';
import address from '../../../api/BasicInfo/Address';

export default {
  activated() {
    this.authbtn = address.authbtn();
    this.$bus.emit('gpo/disabled', 0);
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
        path: '/Address',
        name: '地址管理',
        noLink: true,
      },
    ]);
    this.btnAuthority();
  },
  watch: {
    authList() {
      this.authbtn = address.authbtn();
    },
  },
  components: {
    Edit,
    Paging,
    Show,
  },
  computed: mapGetters([
    'View_UserInfo',
  ]),
  data() {
    return {
      authbtn: {},              //  识别用户拥有的权限
      page: 0,
      total: 0,
      size: 15,
      totalPages: 0,
      showNum: 4,       // 搜索框显示表单的个数
      showBtn: {
        create: true,
      },
      // 搜索字段
      message: [
        {
          key: 'memberName',
          label: '会员名称',
          placeholder: '请输入会员名称',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'region',
          label: '所在地区',
          placeholder: '请选择所在地区',
          hasOp: false,
          type: 7,
          selects: [],
        },
        {
          key: 'addressType',
          label: '地址类型',
          placeholder: '请选择地址类型',
          hasOp: false,
          type: 1,
          selects: [
            {
              label: '医疗机构（配送点）',
              value: 1,
            },
            {
              label: '配送企业（仓库）',
              value: 2,
            },
            {
              label: 'GPO仓库',
              value: 3,
            },
          ],
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
    btnAuthority() {
      if (this.View_UserInfo.memberType === 5) {
        this.showBtn.create = false;
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$bus.emit('gpo/disabled', 1);
    next();
  },
};
</script>
