<template>
  <div>
    <div v-show="showPlan" id="Order_Plan">
      <Find :showNum="8" :message="message"></Find>
      <HOrdersShow :authbtn="authbtn" @page="dataPage"></HOrdersShow>
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
      <TradeFooter :authbtn="authbtn" :isApplyShow="isApplyShow" :isBackShow="true" :isCancelShow="isCancelShow" @order-back="orderBack" @order-cancel="orderCancel" @order-apply="orderApply" v-show="tradeShow"></TradeFooter>
    </div>
    <DialogForm :dialog-form-visible="dialogFormShow" @close-dialog="CloseDialog" @dialog-confirm="dialogConfirm" :message="editMessage" :from-dialog="dialogform" :isFormConfirm="true" :formConfirmLoading="formConfirmLoading">
    </DialogForm>
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
import HOrderLog from './HOrderLog';                                     // 引用订单日志
import DeliveryLog from './DeliveryLog';                                 // 引用订单日志
import HOrdersShow from './HOrdersShow';                                 // 引用列表显示组件
import Find from '../../../components/Find';                             // 引搜索头部
import convert from '../../../utils/convert';                            // 引入js公共方法
import Paging from '../../../components/Paging';                         // 引入底部
import DialogForm from '../../../components/DialogForm';                 // 表单弹出框
import TradeFooter from '../../../components/TradeFooter';               // 引入订单底部
import HospitalOrdersList from '../../../api/Order/HospitalOrdersList';  // 订单(医疗机构api)

export default {
  components: {
    Find,
    Paging,
    HOrdersShow,
    HOrderLog,
    DialogForm,
    TradeFooter,
    DeliveryLog,
  },
  computed: {
    ...mapGetters([
      'Order_ShowBtn',
      'getGpoId',
    ]),
    remarksId() {
      return this.dialogform.remarksId;
    },
  },
  methods: {
    // 结案状态没有为无的时候不要申请结案按钮
    changeStatus(status) {
      const appStatus = Number(this.$route.query.status);
      const closeStatus = Number(this.$route.query.closeStatus);
      if (closeStatus === 0 && (appStatus === 2 || appStatus === 3)) {
        this.isApplyShow = status;
      } else {
        this.isApplyShow = false;
      }
    },
    // 取消订单
    orderCancel(list, data) {
      const id = this.$route.query.id;
      const remark = data;
      const status = 6;
      this.loading = true;
      HospitalOrdersList.audit(id, remark, status).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '取消订单成功',
          });
          this.$bus.$emit('data/list');
          history.back();
        }
        this.loading = false;
      });
    },
    // 订单结案
    orderApply(list, data) {
      const paramKey = 'DDJA';
      HospitalOrdersList.reasonlist(paramKey)
        .then((res) => {
          const refuseOptions = [];
          if (res.data.code === 0) {
            const reasonlist = res.data.result;
            for (let i = 0; i < reasonlist.length; i += 1) {
              this.$set(refuseOptions, i, {
                label: reasonlist[i].paramValue,
                value: `${reasonlist[i].id}-${reasonlist[i].paramValue}`,
              });
            }
            refuseOptions.push({
              label: '其他',
              value: '0',
            });
            this.editMessage.options.reasonOption = Object.assign([], refuseOptions);
            this.dialogFormShow = true; // 打开弹出框
          }
        });
    },
    // 点击确定后的触发事件
    dialogConfirm(formName) {
      const from = {
        gpoid: this.getGpoId,
        id: this.$route.query.id,
        reason: formName.remarks,
      };
      this.loading = true;
      HospitalOrdersList.cancel(from).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '申请成功',
          });
          this.$bus.$emit('data/list');
          history.back();
        }
        this.loading = false;
      });
    },
    // 关闭窗口后的触发事件
    CloseDialog() {
      this.dialogFormShow = false;
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
    ]),
  },
  watch: {
    authList() {
      this.authbtn = HospitalOrdersList.authbtn();
    },
    remarksId(data) {
      if (data === '0') {
        this.dialogform.remarks = '其他';
      } else {
        const info = data.split('-');
        const remarks = !info[1] || info[1] === 'null' ? '' : info[1];
        this.dialogform.remarks = remarks;
      }
    },
    $route(to, from) {
      if (to.path === '/Order/HospitalOrdersList/CheckHItem') {   // 如果去详情页面计算表格高度
        this.tradeShow = true;
        const status = Number(this.$route.query.status);
        if (status === 1) {
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
            path: '/Order/HospitalOrdersList',
            name: '订单列表(医疗机构)',
          },
          {
            path: '/CheckHItem',
            name: '订单列表详情(医疗机构)',
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
      if (to.path === '/Order/HospitalOrdersList') {   // 如果去初始页面计算表格高度
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
            path: '/HospitalOrdersList',
            name: '订单列表（医疗机构）',
            noLink: true,
          },
        ]);
        this.showPlan = true;
        this.showCheck = false;
        this.isApplyShow = false;
        this.isCancelShow = false;
        this.Initialize(); // 初始化数据
        this.$nextTick(() => {
          this.TableHeightRun();
        });
      }
    },
  },
  mounted() {
    this.$router.push({ path: '/Order/HospitalOrdersList' });
    this.$nextTick(() => {
      this.TableHeightRun();
    });
    window.onresize = () => {
      if (this.$route.path === '/Order/HospitalOrdersList') {
        this.TableHeightRun();
      } else if (this.$route.path === '/Order/HospitalOrdersList/CheckHItem') {
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
      },
      {
        path: '/HospitalOrdersList',
        name: '订单列表（医疗机构）',
        noLink: true,
      },
    ]);
  },
  activated() {
    this.authbtn = HospitalOrdersList.authbtn();
    this.$bus.$on('table/height', this.tableHeightRun);  //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$on('change/status', this.changeStatus);
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun);   //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$off('change/status', this.changeStatus);
  },
  data() {
    return {
      tradeShow: true,
      activeName: 'first',  // 页头的默认选项
      showPlan: true,
      showCheck: false,
      loading: false,
      page: 1,              // 当前页数
      size: 20,             // 一页显示多少列
      total: 0,             // 一共多少页
      isApplyShow: false,   // 结案按钮
      isCancelShow: false,  // 取消按钮
      isBackShow: true,     // 返回按钮
      dialogFormShow: false, // 弹出框显示隐藏控制
      formConfirmLoading: false, // 确定按钮loding
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
      dialogform: {
        remarksId: '', // 结案原因
        remarks: '',   // 合同结案原因
      },
      editMessage: {
        dialogTitle: '申请结案',
        selects: [
          { label: '结案原因', key: 'remarksId', type: 'el-select', placeholder: '请选择结案原因', option: 'reasonOption', noClearable: true },
          { label: '', key: 'remarks', type: 'el-input', placeholder: '请输入订单结案原因', fromType: 'textarea', rows: 4 },
        ],
        options: {
          reasonOption: [],
        },
        checkbox: {},
        radios: {},
        rules: {
          remarksId: [
            { required: true, message: '请选择结案原因', trigger: 'change' },
          ],
        },
        styleObject: {},
      },
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
          key: 'status',
          label: '订单状态',
          placeholder: '请选择订单状态',
          hasOp: false,
          type: 2,
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
        //          {
        //            key: 'createTime',
        //            label: '创建日期',
        //            convertdate: 2,
        //            type: 5,
        //            placeholder: '请选择日期',
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
        },
      ],
    };
  },
};
</script>

