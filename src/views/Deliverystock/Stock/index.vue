<template>
  <div>
    <Find :showNum="7" :message="message" :defaultAjax="defaultAjax"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :totalPages="totalPages" :showBtn="showBtn"></Paging>
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
  import convert from '../../../utils/convert';
  import { Paging } from '../../../components/index';
  import Stock from '../../../api/Deliverystock/Stock';

  export default {
    activated() {
      this.authbtn = Stock.authbtn();
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
          path: '/Deliverystock/Stock',
          name: '期间库存',
          noLink: true,
        },
      ]);
      const endTime = this.convertDate(new Date());
      const startTime = `${this.convertDate(new Date()).slice(0,
        this.convertDate(new Date()).length - 2)}01`;
      this.message[5].input = startTime;
      this.message[6].dateValue = [this.convertDate(new Date())];
      this.defaultAjax += 1;                         // 控制defaultAjax变化监听
    },
    watch: {
      authList() {
        this.authbtn = Stock.authbtn();
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
        'getGpoId',
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
          create: false,
          pwnolock: false,
          exportData: true,
        },
        // 搜索字段
        message: [
          {
            key: 'drugsCode',
            label: '药品编码',
            placeholder: '请输入采购单编号',
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
            key: 'producerName',
            label: '生产企业',
            placeholder: '请输入生产企业',
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
            key: 'salerMemberName',
            label: '卖方会员',
            placeholder: '请输入卖方会员',
            hasOp: false,
            type: 0,
            selects: [],
          },
          {
            key: 'startTime',
            label: '开始时间',
            placeholder: '请输入查询日期',
            hasOp: false,
            idDisabled: true,
            type: 0,
            selects: [],
          },
          {
            key: 'endTime',
            label: '结束时间',
            placeholder: '请输入结束时间',
            hasOp: false,
            type: 4,
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
      // 转换日期 YYYY-MM-DD
      convertDate(str) {
        return convert.convertDate(str);
      },
    },
  };
</script>
