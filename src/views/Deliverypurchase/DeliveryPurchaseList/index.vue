<template>
  <div>
    <Find :showNum="6" :message="message" :defaultAjax="defaultAjax"></Find>
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
import DeliverypurchaseList from '../../../api/Deliverypurchase/DeliverypurchaseList';   // 配送单列表接口

export default {
  activated() {
    this.authbtn = DeliverypurchaseList.authbtn();
    // console.log();
    this.$store.commit('status', 1); //  状态值 刷新后清空
    this.$bus.$on('project/getAll', this.getProjectAll);
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Deliverypurchase',
        name: '配送企业采购管理',
        noLink: true,
      },
      {
        path: '/GpoPurchaseList',
        name: '采购单列表',
        noLink: true,
      },
    ]);
    this.btnAuthority();
    //  获取集采项目下拉
    this.getProjectAll(this.getGpoId);
  },
  deactivated() {
    this.$bus.$off('project/getAll', this.getProjectAll);
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
      'getGpoId',
      'projectOptions',
      'View_UserInfo',
      'getProjectId',
    ]),
  },
  watch: {
    authList() {
      this.authbtn = DeliverypurchaseList.authbtn();
      // console.log();
    },
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
          label: '采购单编号',
          placeholder: '请输入采购单编号',
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
        //   label: '创建时间',
        //   placeholder: '请输入创建时间',
        //   hasOp: false,
        //   type: 5,
        //   selects: [],
        // },
        {
          key: 'noOut',
          label: '外部采购编号',
          placeholder: '请输入外部采购单编号',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'projectId',
          label: '集采项目',
          placeholder: '请选择集采项目',
          hasOp: false,
          type: 1,
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
    btnAuthority() {
      /**
       *  memberType === 5  平台
       *  memberType === 4  GPO
       */
      if (this.View_UserInfo.memberType === 5 || this.View_UserInfo.memberType === 4) {
        this.showBtn.create = false;
      } else {
        this.showBtn.create = true;
      }
    },
    // 获取集采项目下拉
    getProjectAll() {
      this.message[5].selects = this.projectOptions; // 给项目集采名称options赋值
      this.message[5].defaults = this.getProjectId;  // 给项目集采名称options赋值
      this.defaultAjax += 1;                         // 控制defaultAjax变化监听
    },
  },
};
</script>
