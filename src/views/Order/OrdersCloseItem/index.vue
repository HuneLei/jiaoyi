<template>
  <div>
    <div v-show="showPlan" id="Order_Plan">
      <Find :showNum="8" :message="message"></Find>
      <PlanShow :authbtn="authbtn" @page="dataPage"></PlanShow>
      <Paging :authbtn="authbtn" :show-btn="ShowBtn" :page="page" :size="size" :total="total"></Paging>
    </div>
  </div>
</template>


<script>
  /**
   * Created by yaoling on 2017/9/2.
   * <p>
   * 江苏摇铃网络科技有限公司，版权所有。
   * Copyright (C) 2015-2017 All Rights Reserved.
   */
  import { mapActions, mapGetters } from 'vuex';
  import PlanShow from './PlanShow';                                // 引用列表显示组件
  import Paging from '../../../components/Paging';                  // 引入底部
  import Find from '../../../components/Find';                      // 引搜索头部
  import OrdersCloseItem from '../../../api/Order/OrdersCloseItem'; // 引入订单结案申请明细api
  import convert from '../../../utils/convert';                     // 引入js公共方法

  export default {
    components: {
      Find,
      Paging,
      PlanShow,
    },
    computed: mapGetters([
      'Order_isNoAgreeShow',
      'Order_isAgreeShow',
      'Order_isRemoveShow',
      'Order_PlanfromEdit',
      'View_UserInfo',
      'getGpoId',
    ]),
    methods: {
      // 导出数据
      exportData() {
        this.$bus.$emit('data/export');
      },
      //  计算表格高度
      tableHeightRun() {
        this.$nextTick(() => {
          this.TableHeightRun(['.find', '.paging', 140]);
        });
      },
      // 获取页码数据
      dataPage(page, size, total) {
        this.page = page;
        this.size = size;
        this.total = total;
      },
      // 转换日期 YYYY-MM-DD
      convertDate(str) {
        return convert.convertDate(str);
      },
      ...mapActions([
        'Initialize',
        'TableHeightRun',
      ]),
    },
    watch: {
      authList() {
        this.authbtn = OrdersCloseItem.authbtn();
      },
      $route(to, from) {
        if (to.path === '/Order/OrdersCloseItem') {   // 如果去初始页面计算表格高度
          this.$store.commit('BreadCrumb_Update', [
            {
              path: '/index',
              name: this.$store.state.view.resourcesNow.name,
            },
            {
              path: '/Order',
              name: '订单管理',
            },
            {
              path: '/OrdersCloseItem',
              name: '订单结案申请单',
              noLink: true,
            },
          ]);
          this.$nextTick(() => {
            this.TableHeightRun(['.find', '.paging', 140]);
          });
        }
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.TableHeightRun(['.find', '.paging', 140]);
      });
      window.onresize = () => {
        if (this.$route.path === '/Order/OrdersCloseItem') {
          this.TableHeightRun(['.find', '.paging', 140]);
        }
      };
      this.$store.commit('BreadCrumb_Update', [
        {
          path: '/index',
          name: this.$store.state.view.resourcesNow.name,
        },
        {
          path: '/Order',
          name: '订单管理',
          noLink: true,
        },
        {
          path: '/OrdersCloseItem',
          name: '订单结案申请明细',
          noLink: true,
        },
      ]);
    },
    activated() {
      this.authbtn = OrdersCloseItem.authbtn();
      this.$bus.$on('table/height', this.tableHeightRun);  //  监听查询按钮的查看更多点击事件，重新计算表格高度
      this.$bus.$on('export/data', this.exportData);       //  监听导出数据
    },
    deactivated() {
      this.$bus.$off('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
      this.$bus.$off('export/data', this.exportData);      //  监听导出数据
    },
    data() {
      return {
        loading: false,
        showPlan: true,
        showCheck: false,
        page: 1,              // 当前页数
        size: 20,             // 一页显示多少列
        total: 0,             // 一共多少页
        ShowBtn: {            // 按钮显示控制
          exportData: true,
        },
        authbtn: {},
        message: [
          {
            key: 'hospitalMemberName',
            label: '医疗机构',
            placeholder: '请输入医疗机构',
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
            type: 9,  // 类型
            key: 'createTime',
            label: '创建日期',
            placeholder: '请输入创建日期',
            shortcuts: true,  // 是否开启快捷选择
            defaultDate: true,  // 是否进来默认为一个月
          },
//          {
//            key: 'createTime',
//            label: '创建日期',
//            convertdate: 2,
//            placeholder: '请选择日期',
//            type: 5,
//            selects: [],
//            defaultDate: true,
//            pickerOptions: {
//              shortcuts: [{
//                text: '最近三个月',
//                onClick(picker) {
//                  const end = new Date();
//                  const start = new Date();
//                  start.setTime(start.getTime() - (3600 * 1000 * 24 * 90));
//                  picker.$emit('pick', [start, end]);
//                },
//              }, {
//                text: '最近半年',
//                onClick(picker) {
//                  const end = new Date();
//                  const start = new Date();
//                  start.setTime(start.getTime() - (3600 * 1000 * 24 * 182));
//                  picker.$emit('pick', [start, end]);
//                },
//              }, {
//                text: '最近一年',
//                onClick(picker) {
//                  const end = new Date();
//                  const start = new Date();
//                  start.setTime(start.getTime() - (3600 * 1000 * 24 * 365));
//                  picker.$emit('pick', [start, end]);
//                },
//              }],
//            },
//          },
          {
            key: 'code',
            label: '订单结案编号',
            placeholder: '请输入编号',
            hasOp: false,
            type: 0,
            selects: [],
          },
          {
            key: 'auditStatus',
            label: '审核状态',
            placeholder: '请选择审核状态',
            hasOp: false,
            type: 1,
            selects: [
              {
                value: 1,
                label: '待审核',
              },
              {
                value: 3,
                label: '审核通过',
              },
              {
                value: 4,
                label: '审核不通过',
              },
            ],
          },
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
            key: 'noOut',
            label: '外部结案编号',
            placeholder: '请输入外部结案编号',
            hasOp: false,
            type: 0,
            selects: [],
          },
          {
            key: 'ordersCode',
            label: '订单编号',
            placeholder: '请输入订单编号',
            hasOp: false,
            type: 0,
            selects: [],
          },
        ],
      };
    },
  };
</script>

