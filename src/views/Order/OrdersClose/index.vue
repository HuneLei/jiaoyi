<template>
  <div>
    <div v-show="showPlan" id="Order_Plan">
      <Find :showNum="8" :message="message" :defaultAjax="defaultAjax"></Find>
      <PlanShow :authbtn="authbtn" @page="dataPage"></PlanShow>
      <Paging :authbtn="authbtn" :show-btn="ShowBtn" :page="page" :size="size" :total="total"></Paging>
    </div>
    <div v-show="showCheck">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="订单基础信息" name="first">
          <router-view v-loading="loading"></router-view>
        </el-tab-pane>
        <el-tab-pane label="结案单日志" name="second">
          <CloseOrderLog></CloseOrderLog>
        </el-tab-pane>
      </el-tabs>
      <TradeFooter :authbtn="authbtn"
                   :isRemoveShow="isRemoveShow"
                   :isAgreeShow="isAgreeShow"
                   :isNoAgreeShow="isNoAgreeShow"
                   :isBackShow = "true"
                   v-show="isFooterShow"
                   @order-back="orderBack"
                   @order-agree="orderAgree"
                   @order-noagree="orderNoAgree"
                   @order-remove="orderRemove"></TradeFooter>
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
  import TradeFooter from '../../../components/TradeFooter';        // 引入订单底部
  import Paging from '../../../components/Paging';                  // 引入底部
  import Find from '../../../components/Find';                      // 引搜索头部
  import OrdersClose from '../../../api/Order/OrdersClose';         // 引入订单结案申请api
  import convert from '../../../utils/convert';                     // 引入js公共方法
  import CloseOrderLog from './CloseOrderLog';                      // 引入结案单日志

  export default {
    components: {
      Find,
      Paging,
      PlanShow,
      TradeFooter,
      CloseOrderLog,
    },
    computed: mapGetters([
      'Order_PlanfromEdit',
      'View_UserInfo',
      'getGpoId',
    ]),
    methods: {
      // 删除结案单
      orderRemove() {
        OrdersClose.remove([this.$route.query.id]).then((res) => {
          this.loading = true;
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功',
            });
            this.$bus.$emit('data/list');
          }
          history.back();
        });
        this.loading = false;
      },
      // 同意结案单
      orderAgree(data, val) {
        const from = {
          id: this.$route.query.id,
          remark: val,
          status: 3,
        };
        OrdersClose.audit(from).then((res) => {
          this.loading = true;
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功',
            });
            this.$bus.$emit('data/list');
          }
          history.back();
        });
        this.loading = false;
      },
      // 不同意结案单
      orderNoAgree(data, val) {
        const from = {
          id: this.$route.query.id,
          remark: val,
          status: 4,
        };
        OrdersClose.audit(from).then((res) => {
          this.loading = true;
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功',
            });
            this.$bus.$emit('data/list');
          }
          history.back();
        });
        this.loading = false;
      },
      // 标签页切换时触发事件
      handleClick() {
        if (this.activeName === 'second') {
          OrdersClose.closelog(this.$route.query.id)
            .then((res) => {
              if (res.data.code === 0) {
                this.GetOrderLog(res.data.result);
              }
            });
          this.isFooterShow = false;
        } else {
          this.isFooterShow = true;
        }
      },
      // 返回按钮触发事件
      orderBack() {
        this.$bus.$emit('data/list');
        history.back();
      },
      //  计算表格高度
      tableHeightRun() {
        this.$nextTick(() => {
          this.TableHeightRun();
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
        'GetOrderLog',
        'TableHeightRun',
      ]),
    },
    watch: {
      authList() {
        this.authbtn = OrdersClose.authbtn();
      },
      $route(to, from) {
        if (to.path === '/Order/OrdersClose/ClosesItem') {   // 如果去查看页面计算表格高度
          this.activeName = 'first';
          const auditStatus = Number(this.$route.query.auditStatus);
          if (status === 1) {
            this.isCancelShow = true;
          }
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
              path: '/Order/OrdersClose',
              name: '订单结案申请单',
            },
            {
              path: '/ClosesItem',
              name: '订单结案申请单查看',
              noLink: true,
            },
          ]);
          const memberType = this.View_UserInfo.memberType;
          if (memberType === 3 && auditStatus === 1) {
            this.isRemoveShow = true;
            this.isAgreeShow = false;
            this.isNoAgreeShow = false;
          } else if (memberType === 2 && auditStatus === 1) {
            this.isRemoveShow = false;
            this.isAgreeShow = true;
            this.isNoAgreeShow = true;
          } else if (auditStatus !== 1) {
            this.isRemoveShow = false;
            this.isAgreeShow = false;
            this.isNoAgreeShow = false;
          } else {
            this.isRemoveShow = true;
            this.isAgreeShow = true;
            this.isNoAgreeShow = true;
          }
          this.showPlan = false;
          this.showCheck = true;
          this.Initialize(); // 初始化数据
          this.$nextTick(() => {
            this.TableHeightRun(['#from-item', '.TradeFooter', 250]);
          });
        }
        if (to.path === '/Order/OrdersClose') {   // 如果去初始页面计算表格高度
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
              path: '/OrdersClose',
              name: '订单结案申请单',
              noLink: true,
            },
          ]);
          this.showPlan = true;
          this.showCheck = false;
          this.isRemoveShow = false;
          this.isNoAgreeShow = false;
          this.isAgreeShow = false;
          this.$nextTick(() => {
            this.TableHeightRun();
          });
        }
      },
    },
    mounted() {
      if (this.View_UserInfo.memberType === 4 || this.View_UserInfo.memberType === 5) {
        this.isRemoveShow = false;
        this.isAgreeShow = false;
        this.isNoAgreeShow = false;
        this.ShowBtn.create = false;
      }
      if (this.$route.query.from !== 'index') {
        this.$router.push({ path: '/Order/OrdersClose' });
      }
      this.$nextTick(() => {
        this.TableHeightRun();
      });
      window.onresize = () => {
        if (this.$route.path === '/Order/OrdersClose') {
          this.TableHeightRun();
        } else if (this.$route.path === '/Order/OrdersClose/ClosesItem') {
          this.TableHeightRun(['#from-item', '.TradeFooter', 250]);
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
          path: '/OrdersClose',
          name: '订单结案申请单',
          noLink: true,
        },
      ]);
    },
    activated() {
      this.defaultAjax = 0; // 控制defaultAjax变化监听
      if (this.$route.query.from === 'index') {
        this.$set(this.message[2], 'defaults', 1);
        this.defaultAjax += 1; // 控制defaultAjax变化监听
      }
      this.authbtn = OrdersClose.authbtn();
      this.$bus.$on('table/height', this.tableHeightRun);  //  监听查询按钮的查看更多点击事件，重新计算表格高度
    },
    deactivated() {
      this.$bus.$off('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    },
    data() {
      return {
        defaultAjax: 0,
        loading: false,
        showPlan: true,
        showCheck: false,
        page: 1,              // 当前页数
        size: 20,             // 一页显示多少列
        total: 0,             // 一共多少页
        isRemoveShow: false,   // 删除按钮
        isBackShow: false,     // 返回按钮
        isAgreeShow: false,    // 同意按钮
        isNoAgreeShow: false, // 不同意按钮
        isFooterShow: true,   // 底部按钮
        activeName: 'first',  // 页头的默认选项
        ShowBtn: {            // 按钮显示控制
          destory: false,
          create: false,
          pwnolock: false,
          onDrugs: false,
          offDrugs: false,
          exportData: false,
          importData: false,
          saveChange: false,
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
            key: 'noOut',
            label: '外部结案编号',
            placeholder: '请输入编号',
            hasOp: false,
            type: 0,
            selects: [],
          },
        ],
      };
    },
  };
</script>

