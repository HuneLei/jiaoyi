<template>
  <div>
    <Find :showNum="showNum" :message="message" :defaultAjax="defaultAjax"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :totalPages="totalPages" :showBtn="showBtn"></Paging>
  </div>
</template>

<script>
/**
 * Created by lqy on 2017/9/14.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapState, mapGetters } from 'vuex';
import Show from './Show';
import { Paging } from '../../../components/index';
import GpoPurchaseList from '../../../api/Gpopurchase/GpoPurchaseList';

export default {
  activated() {
    if (this.View_UserInfo.memberType === 2) {
      // 当前登录用户是卖方类型,采购单状态都为已提交
      this.message.splice(2, 1);
    }
    this.authbtn = GpoPurchaseList.authbtn();
    // console.log();
    this.$store.commit('status', 1); //  状态值 刷新后清空
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Gpopurchase',
        name: 'GPO采购管理',
        noLink: true,
      },
      {
        path: '/Gpopurchase/GpoPurchaseList',
        name: 'GPO采购单列表',
        noLink: true,
      },
    ]);
    this.btnAuthority();
  },
  watch: {
    authList() {
      this.authbtn = GpoPurchaseList.authbtn();
    },
  },
  components: {
    Paging,
    Show,
  },
  computed: {
    authList() {
      return this.$store.state.view.authList;
    },
    ...mapGetters([
      'View_UserInfo',
    ]),
  },
  data() {
    return {
      authbtn: {},              //  识别用户拥有的权限
      page: 1,
      total: 0,
      size: 20,
      totalPages: 0,
      defaultAjax: 0,   // 控制下拉框默认
      showNum: 4,       // 搜索框显示表单的个数
      showBtn: {
        destory: false,
        create: true,
        pwnolock: false,
      },
      // 搜索字段
      message: [
        {
          key: 'code',
          label: 'GPO采购编号',
          placeholder: '请输入GPO采购单编号',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'salerMemberName',
          label: '卖方会员',
          placeholder: '请输入卖方会员',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'status',
          label: '采购单状态',
          placeholder: '请选择采购单状态',
          hasOp: false,
          type: 1,
          selects: [
            {
              label: '待提交',
              value: 0,
            },
            {
              label: '已提交',
              value: 1,
            },
          ],
        },
        {
          type: 9,  // 类型
          key: 'createTime',
          label: '创建日期',
          shortcuts: true,  // 是否开启快捷选择
          // defaultDate: true,  // 是否进来默认为一个月
        },
        // {
        //   key: 'createTime',
        //   label: '创建日期',
        //   placeholder: '请输入创建日期',
        //   hasOp: false,
        //   type: 5,
        //   selects: [],
        // },
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
      /**
       *  memberType === 5  平台
       *  memberType === 1  生产
       *  memberType === 2  经营
       */
      if (this.View_UserInfo.memberType === 5 ||
        this.View_UserInfo.memberType === 1 || this.View_UserInfo.memberType === 2) {
        this.showBtn.create = false;
      }
    },
  },
};
</script>
