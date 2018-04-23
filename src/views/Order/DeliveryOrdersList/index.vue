<template>
  <div>
    <div v-show="showPlan" id="Order_Plan">
      <Find :showNum="8" :message="message" :defaultAjax="defaultAjax"></Find>
      <HOrdersShow :authbtn="authbtn" @page="dataPage" @table-select="tableSelectOne"></HOrdersShow>
      <Paging :authbtn="authbtn" :show-btn="ShowBtn" :page="page" :size="size" :total="total"></Paging>
    </div>
    <div v-show="showCheck">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="订单基础信息" name="first">
          <router-view v-loading="loading"></router-view>
        </el-tab-pane>
        <el-tab-pane label="配送信息" name="second">
          <DeliveryLog></DeliveryLog>
        </el-tab-pane>
        <el-tab-pane label="订单日志" name="third">
          <HOrderLog></HOrderLog>
        </el-tab-pane>
      </el-tabs>
      <TradeFooter :authbtn="authbtn" :isBackShow="true" :isDeliveryShow="isDeliveryShow" :isCancelShow="isCancelShow" :isNotDeliveryShow="isNotDeliveryShow" :isConfirmShow="isConfirmShow" :isOrderPrintShow="isOrderPrintShow" :isOrderConfirmPrintShow="isOrderConfirmPrintShow" :isRemarkShow="true" @order-confirm="orderConfirm" @order-back="orderBack" @order-delivery="orderDelivery" @order-notdelivery="orderNotDelivery" @deliveryOrder-print="deliveryOrderPrint" @deliveryOrderConfirm-print="deliveryOrderConfirmPrint" @order-remark="orderRemark" v-show="tradeShow"></TradeFooter>
      <DeliveryRemark></DeliveryRemark>
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
import HOrderLog from './DOrderLog';                                     // 引用订单日志
import DeliveryLog from './DeliveryLog';                                 // 引用订单日志
import HOrdersShow from './DOrdersShow';                                 // 引用列表显示组件
import DeliveryRemark from './DeliveryRemark';                                 // 备注弹框
import Find from '../../../components/Find';                             // 引搜索头部
import convert from '../../../utils/convert';                            // 引入js公共方法
import Paging from '../../../components/Paging';                         // 引入底部
import TradeFooter from '../../../components/TradeFooter';               // 引入订单底部
import HospitalOrdersList from '../../../api/Order/HospitalOrdersList';  // 订单(医疗机构api)
import DeliveryOrdersList from '../../../api/Order/DeliveryOrdersList';  // 订单(配送企业api)

export default {
  components: {
    Find,
    Paging,
    HOrdersShow,
    HOrderLog,
    TradeFooter,
    DeliveryLog,
    DeliveryRemark,
  },
  computed: {
    message() {
      return [
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
          key: 'status',
          label: '订单状态',
          placeholder: '请选择订单状态',
          hasOp: false,
          type: 2,
          defaults: this.statusDefaults,
          selects: [
            {
              value: 1,
              label: '待确认',
            },
            {
              value: 2,
              label: '待发货',
            },
            {
              value: 3,
              label: '部分发货',
            },
            {
              value: 4,
              label: '已发货',
            },
            {
              value: 5,
              label: '已完成',
            },
            {
              value: 6,
              label: '已取消',
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
        //        {
        //          key: 'createTime',
        //          label: '创建日期',
        //          convertdate: 2,
        //          type: 5,
        //          placeholder: '请选择日期',
        //          selects: [],
        //          defaultDate: true,
        //          pickerOptions: {
        //            shortcuts: [{
        //              text: '最近三个月',
        //              onClick(picker) {
        //                const end = new Date();
        //                const start = new Date();
        //                start.setTime(start.getTime() - (3600 * 1000 * 24 * 90));
        //                picker.$emit('pick', [start, end]);
        //              },
        //            }, {
        //              text: '最近半年',
        //              onClick(picker) {
        //                const end = new Date();
        //                const start = new Date();
        //                start.setTime(start.getTime() - (3600 * 1000 * 24 * 182));
        //                picker.$emit('pick', [start, end]);
        //              },
        //            }, {
        //              text: '最近一年',
        //              onClick(picker) {
        //                const end = new Date();
        //                const start = new Date();
        //                start.setTime(start.getTime() - (3600 * 1000 * 24 * 365));
        //                picker.$emit('pick', [start, end]);
        //              },
        //            }],
        //          },
        //        },
        {
          key: 'code',
          label: '订单编号',
          placeholder: '请输入编号',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'closeStatus',
          label: '结案状态',
          placeholder: '请选择结案状态',
          hasOp: false,
          type: 1,
          selects: [
            {
              value: 0,
              label: '无',
            },
            {
              value: 2,
              label: '部分结案',
            },
            {
              value: 3,
              label: '已结案',
            },
          ],
        },
        {
          key: 'receiveAddress',
          label: '收货地址',
          placeholder: '请输入收货地址',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'noOut',
          label: '外部订单编号',
          placeholder: '请输入编号',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'type',
          label: '订单类型',
          placeholder: '请选择订单类型',
          hasOp: false,
          type: 1,
          selects: [
            {
              value: 0,
              label: '普通订单',
            },
            {
              value: 1,
              label: '加急订单',
            },
          ],
        }];
    },
    ...mapGetters([
      'getGpoId',
    ]),
  },
  methods: {
    tableSelectOne(ids) {
      this.ids = ids;
    },
    // 打印
    deliveryOrderPrint(data) {
      if (typeof window.location.origin === 'undefined') {
        // IE浏览器不兼容window.location.origin
        window.open(`${window.location.protocol}${'//'}${window.location.host}/#/Print/OrderDelivePrint?id=${this.$route.query.id}`);
      } else {
        window.open(`${window.location.origin}/#/Print/OrderDelivePrint?id=${this.$route.query.id}`);
      }
    },
    // 备注
    orderRemark() {
      const id = this.$route.query.id;
      this.$bus.$emit('order/deliveryRemark', id);
    },
    // 打印并确认
    deliveryOrderConfirmPrint(list, data) {
      const id = this.$route.query.id;
      const remark = data;
      const status = 2;
      DeliveryOrdersList.audit(id, remark, status).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '确认订单成功',
          });
          this.$bus.$emit('data/list');
          history.back();
        }
        this.loading = false;
      });
      setTimeout(() => {
        if (typeof window.location.origin === 'undefined') {
          // IE浏览器不兼容window.location.origin
          window.open(`${window.location.protocol}${'//'}${window.location.host}/#/Print/OrderDelivePrint?id=${this.$route.query.id}`);
        } else {
          window.open(`${window.location.origin}/#/Print/OrderDelivePrint?id=${this.$route.query.id}`);
        }
      }, 0);
    },
    affirmChoose() {
      if (this.ids.length === 0) {
        this.$message({
          type: 'error',
          message: '当前未选择需确认的选项',
        });
        return false;
      }
      this.$confirm('此操作将批量确认已选，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const form = {
          ids: this.ids,
        };
        DeliveryOrdersList.batchConfirm(form).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '批量确认成功',
            });
            this.$bus.$emit('data/list');
          }
          this.loading = false;
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
      return true;
    },
    // 确认订单
    orderConfirm(list, data) {
      const id = this.$route.query.id;
      const remark = data;
      const status = 2;
      DeliveryOrdersList.audit(id, remark, status).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '确认订单成功',
          });
          this.$bus.$emit('data/list');
          history.back();
        }
        this.loading = false;
      });
    },
    // 货票同行
    orderDelivery(list, data) {
      this.DeliveryShow([true, 'DeliveryShow']);
    },
    // 非货票同行
    orderNotDelivery(list, data) {
      this.DeliveryShow([true, 'NotDeliveryShow']);
    },
    // 标签页切换时触发事件
    handleClick() {
      if (this.activeName === 'first') {
        this.tradeShow = true;
      }
      if (this.activeName === 'second') {
        this.tradeShow = false;
        HospitalOrdersList.delivery(this.$route.query.id)
          .then((res) => {
            if (res.data.code === 0) {
              this.GetDelivery(res.data.result);
            }
          });
      }
      if (this.activeName === 'third') {
        this.tradeShow = false;
        HospitalOrdersList.orderslog(this.$route.query.id)
          .then((res) => {
            if (res.data.code === 0) {
              this.GetOrderLog(res.data.result);
            }
          });
      }
    },
    // 获取页码数据
    dataPage(page, size, total) {
      this.page = page;
      this.size = size;
      this.total = total;
    },
    // 返回按钮触发事件
    orderBack() {
      history.back();
    },
    // 计算表格高度
    tableHeightRun() {
      this.$nextTick(() => {
        this.TableHeightRun();
      });
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
    ...mapActions([
      'Initialize',
      'TableHeightRun',
      'GetDelivery',
      'GetOrderLog',
      'DeliveryShow',
    ]),
  },
  watch: {
    authList() {
      this.authbtn = DeliveryOrdersList.authbtn();
    },
    // 如果去详情页面计算表格高度
    $route(to, from) {
      if (to.path === '/Order/DeliveryOrdersList/CheckDItem') {
        this.tradeShow = true;
        const status = Number(this.$route.query.status);
        const closeStatus = Number(this.$route.query.closeStatus);
        if ((closeStatus === 0 || closeStatus === 2) && (status === 2 || status === 3)) {
          this.isDeliveryShow = true;
          this.isNotDeliveryShow = true;
        }
        this.isConfirmShow = false;
        this.isOrderConfirmPrintShow = false;
        this.isOrderPrintShow = true;
        this.isCancelShow = false;
        if (status === 1) {
          this.isConfirmShow = true;
          this.isOrderConfirmPrintShow = true;
          this.isCancelShow = true;
        }
        this.activeName = 'first';
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
            path: '/Order/DeliveryOrdersList',
            name: '订单列表(配送企业)',
          },
          {
            path: '/CheckDItem',
            name: '订单列表详情(配送企业)',
            noLink: true,
          },
        ]);
        this.showPlan = false;
        this.showCheck = true;
        this.Initialize(); // 初始化数据
        this.$nextTick(() => {
          this.TableHeightRun(['#from-item', '.TradeFooter', 260]);
        });
      }
      if (to.path === '/Order/DeliveryOrdersList') {   // 如果去初始页面计算表格高度
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
            path: '/DeliveryOrdersList',
            name: '订单列表（配送企业）',
            noLink: true,
          },
        ]);
        this.showPlan = true;
        this.showCheck = false;
        this.isConfirmShow = false;
        this.isOrderConfirmPrintShow = false;
        this.isDeliveryShow = false;
        this.isNotDeliveryShow = false;
        this.Initialize(); // 初始化数据
        this.$nextTick(() => {
          this.TableHeightRun();
        });
      }
    },
  },
  mounted() {
    if (this.$route.query.from !== 'index' && this.$route.query.add !== 'indexs') {
      this.$router.push({ path: '/Order/DeliveryOrdersList' });
    }
    this.$nextTick(() => {
      this.TableHeightRun();
    });
    window.onresize = () => {
      if (this.$route.path === '/Order/DeliveryOrdersList') {
        this.TableHeightRun();
      } else if (this.$route.path === '/Order/DeliveryOrdersList/CheckDItem') {
        this.TableHeightRun(['#from-item', '.TradeFooter', 260]);
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
        path: '/DeliveryOrdersList',
        name: '配送企业',
        noLink: true,
      },
    ]);
  },
  activated() {
    this.ids = [];
    if (this.$route.query.from === 'index' && this.$route.query.name === '待发货订单') {
      this.statusDefaults = [2, 3];
    } else if (this.$route.query.from === 'index' && this.$route.query.name === '待确认订单') {
      this.statusDefaults = [1];
    } else if (this.$route.query.add === 'indexs') {
      this.statusDefaults = [2, 3];
    }
    this.defaultAjax += 1; // 控制defaultAjax变化监听
    this.authbtn = DeliveryOrdersList.authbtn();
    this.$bus.$on('table/height', this.tableHeightRun);  //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$on('batch/confirm', this.affirmChoose);
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun);   //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$off('batch/confirm', this.affirmChoose);
  },
  data() {
    return {
      defaultAjax: 0,
      tradeShow: true,
      activeName: 'first',      // 页头的默认选项
      showPlan: true,
      showCheck: false,
      loading: false,
      page: 1,                  // 当前页数
      size: 20,                 // 一页显示多少列
      total: 0,                 // 一共多少页
      isBackShow: true,         // 返回按钮
      isConfirmShow: false,     // 确认按钮
      isOrderConfirmPrintShow: false,     // 打印并确认按钮
      isOrderPrintShow: false,     // 打印按钮
      isCancelShow: false,      // 取消按钮
      isDeliveryShow: false,    // 货票同行按钮按钮
      isNotDeliveryShow: false, // 非货票同行按钮按钮
      ShowBtn: {                // 按钮显示控制
        destory: false,
        create: false,
        pwnolock: false,
        onDrugs: false,
        offDrugs: false,
        exportData: false,
        importData: false,
        saveChange: false,
        batchConfirm: true,  // 确认已选
      },
      authbtn: {},
      // message: [],
      statusDefaults: [],
      ids: [],
    };
  },
};
</script>

