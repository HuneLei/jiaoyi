<template>
  <div>
    <Find :showNum="5" :message="message"></Find>
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
import StockList from '../../../api/Deliverystock/StockList';   // 配送单列表接口

export default {
  activated() {
    this.authbtn = StockList.authbtn();
    this.$store.commit('status', 1); //  状态值 刷新后清空
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Deliverystock',
        name: '配送企业库存管理',
        noLink: true,
      },
      {
        path: '/Deliverystock/StockList',
        name: '库存列表',
        noLink: true,
      },
    ]);
    this.btnAuthority();
  },
  watch: {
    authList() {
      this.authbtn = StockList.authbtn();
    },
  },
  components: {
    Paging,
    Show,
  },
  computed: {
    ...mapGetters([
      'View_UserInfo',
    ]),
    authList() {
      return this.$store.state.view.authList;
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
          label: '库存单号',
          placeholder: '请输入库存单号',
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
          label: '库存单状态',
          placeholder: '请选择库存单状态',
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
          key: 'stockDate',
          label: '库存日期',
          shortcuts: true,  // 是否开启快捷选择
          // defaultDate: true,  // 是否进来默认为一个月
        },
        // {
        //   key: 'stockDate',
        //   label: '库存日期',
        //   placeholder: '请输入库存日期',
        //   hasOp: false,
        //   type: 5,
        //   selects: [],
        // },
        {
          type: 9,  // 类型
          key: 'reportTime',
          label: '上报日期',
          shortcuts: true,  // 是否开启快捷选择
          // defaultDate: true,  // 是否进来默认为一个月
        },
        // {
        //   key: 'reportTime',
        //   label: '上报日期',
        //   placeholder: '请输入上报日期',
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
       *  memberType === 4  GPO
       */
      if (this.View_UserInfo.memberType === 5 || this.View_UserInfo.memberType === 4) {
        this.showBtn.create = false;
      }
    },
  },
};
</script>
