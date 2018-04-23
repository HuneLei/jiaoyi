<template>
  <div>
    <div v-show="showPlan" id="Order_Plan">
      <Find :showNum="8" :message="message" :defaultAjax="defaultAjax"></Find>
      <HOrdersShow :authbtn="authbtn" @page="dataPage" id="HOrdersShow" @table-select="tableSelect"></HOrdersShow>
      <Paging :authbtn="authbtn" :show-btn="ShowBtn" :page="page" :size="size" :total="total"></Paging>
    </div>
    <div v-show="showCheck">
      <router-view></router-view>
      <TradeFooter :authbtn="authbtn" :isBackShow="true" :isDeliverPrintShow="isDeliverPrintShow" :isDeliveryShow="isDeliveryShow" :isNotDeliveryShow="isNotDeliveryShow" :isConfirmShow="isConfirmShow" :isBackoutShow="isBackoutShow" @order-confirm="orderConfirm" @order-back="orderBack" @order-delivery="orderDelivery" @order-notdelivery="orderNotDelivery" @order-deliver-print="orderDeliverPrint" @order-backout="orderBackout"></TradeFooter>
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
import HOrdersShow from './DOrdersShow';                                 // 引用列表显示组件
import Find from '../../../components/Find';                             // 引搜索头部
import convert from '../../../utils/convert';                            // 引入js公共方法
import Paging from '../../../components/Paging';                         // 引入底部
import TradeFooter from '../../../components/TradeFooter';               // 引入订单底部
import DeliveryOrdersList from '../../../api/Order/DeliveryOrdersList';  // 订单(配送企业api)
import DeliverBillList from '../../../api/Deliverbill/DeliverBillList';  // 订单(配送企业api)

export default {
  components: {
    Find,
    Paging,
    HOrdersShow,
    TradeFooter,
  },
  computed: {
    ...mapGetters([
      'Order_PlanItemList',
      'Order_ReturnHint',
      'View_UserInfor',
      'View_UserInfo',
      'Order_ShowBtn',
      'getGpoId',
      'authList',
    ]),
    authList() {
      return this.$store.state.view.authList;
    },
  },
  methods: {
    // 确定打印条码
    printSub() {
      if (typeof window.location.origin === 'undefined') {
        // IE浏览器不兼容window.location.origin
        window.open(`${window.location.protocol}${'//'}${window.location.host}/#/Print/BarcodePrint?type=${this.printType}&id=${this.ids}`);
      } else {
        window.open(`${window.location.origin}/#/Print/BarcodePrint?type=${this.printType}&id=${this.ids}`);
      }
    },
    // 打印配送单
    orderDeliverPrint(data) {
      if (typeof window.location.origin === 'undefined') {
        // IE浏览器不兼容window.location.origin
        window.open(`${window.location.protocol}${'//'}${window.location.host}/#/Print/DelivePrint?id=${this.$route.query.id}`);
      } else {
        window.open(`${window.location.origin}/#/Print/DelivePrint?id=${this.$route.query.id}`);
      }
    },
    // 得到所选择的id和hospitalId
    tableSelect(ids, hospitalIds, deliverIds) {
      this.hospitalbur = true;
      this.deliverbur = true;
      const hospitallist = hospitalIds.sort();
      const deliverlist = deliverIds.sort();
      for (let i = 0; i < hospitallist.length; i += 1) {
        if (i + 1 !== hospitallist.length) {
          if (hospitallist[i] !== hospitallist[i + 1]) {
            this.hospitalbur = false;
          }
        }
      }
      for (let i = 0; i < deliverlist.length; i += 1) {
        if (i + 1 !== deliverlist.length) {
          if (deliverlist[i] !== deliverlist[i + 1]) {
            this.deliverbur = false;
          }
        }
      }
      this.ids = ids.join(',');
    },
    // 撤销配送单
    orderBackout() {
      const id = this.$route.query.id;
      if (id) {
        DeliverBillList.backout([id]).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '撤销配送单成功',
            });
            this.$bus.$emit('data/list');
            history.back();
          }
        });
      }
    },
    // 取消订单
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
      const num = this.Order_PlanItemList.length;
      for (let i = 0; i < num; i += 1) {
        const drugsCode = this.Order_PlanItemList[i].drugsCode;
        for (let n = 0; n < num; n += 1) {
          if (i !== n && drugsCode === this.Order_PlanItemList[n].drugsCode) {
            this.$message({
              type: 'error',
              message: '不能选择相同的药品发货',
            });
            return;
          }
        }
      }
      this.DeliveryShow([true, 'DeliveryShow']);
    },
    // 非货票同行
    orderNotDelivery(list, data) {
      const num = this.Order_PlanItemList.length;
      for (let i = 0; i < num; i += 1) {
        const drugsCode = this.Order_PlanItemList[i].drugsCode;
        for (let n = 0; n < num; n += 1) {
          if (i !== n && drugsCode === this.Order_PlanItemList[n].drugsCode) {
            this.$message({
              type: 'error',
              message: '不能选择相同的药品发货',
            });
            return;
          }
        }
      }
      this.DeliveryShow([true, 'NotDeliveryShow']);
    },
    // 获取页码数据
    dataPage(page, size, total) {
      this.page = page;
      this.size = size;
      this.total = total;
    },
    // 返回按钮触发事件
    orderBack() {
      if (this.Order_ReturnHint) {
        this.$confirm('存在未保存的明细数据，确定返回吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$bus.$emit('data/list');
          history.back();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          });
        });
      } else {
        history.back();
      }
    },
    // 新增点击时触发事件
    dataPageDo() {
      this.$router.push({ path: '/Deliverbill/DeliverBillList/CreatDeliver' });
    },
    printCheck() {
      let checkout = true;
      if (!this.hospitalbur) {
        this.$message({
          type: 'error',
          message: '您所选择的配送单必须来自同一医院！',
        });
        checkout = false;
      }
      if (!this.deliverbur) {
        this.$message({
          type: 'error',
          message: '您所选择的配送单必须来自同一配送企业！',
        });
        checkout = false;
      }
      return checkout;
    },
    // 二维码（单据维度）
    qrCodePrintOneClick() {
      if (!this.printCheck()) return;
      this.printType = 1;
      this.printSub();
    },
    // 二维码（药品维度）
    qrCodePrintTwoClick() {
      if (!this.printCheck()) return;
      this.printType = 2;
      this.printSub();
    },
    // 批量条码打印
    deliverPrintClick() {
      if (!this.printCheck()) return;
      this.printType = 0;
      this.printSub();
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
      'ControltradeBtn',
      'GetDelivery',
      'GetOrderLog',
      'DeliveryShow',
      'ItemList',
      'PrintShow',
    ]),
  },
  watch: {
    authList() {
      this.authbtn = DeliverBillList.authbtn();
    },
    $route(to, from) {
      if (to.path === '/Deliverbill/DeliverBillList/CheckDItem') {   // 如果去详情页面计算表格高度
        this.$store.commit('BreadCrumb_Update', [
          {
            path: '/index',
            name: this.$store.state.view.resourcesNow.name,
          },
          {
            path: '/Deliverbill',
            name: '配送单管理',
            noLink: true,
          },
          {
            path: '/Deliverbill/DeliverBillList',
            name: '配送单列表',
          },
          {
            path: '/CheckDItem',
            name: '配送单列表详情',
            noLink: true,
          },
        ]);
        this.showPlan = false;
        this.showCheck = true;
        this.isDeliverPrintShow = true;
        this.Initialize(); // 初始化数据
        this.$nextTick(() => {
          this.TableHeightRun(['#from-item', '.TradeFooter', 200]);
        });
      }
      if (to.path === '/Deliverbill/DeliverBillList/CreatDeliver') {  // 如果去新增页面计算表格高度
        this.$store.commit('BreadCrumb_Update', [
          {
            path: '/index',
            name: this.$store.state.view.resourcesNow.name,
          },
          {
            path: '/Deliverbill',
            name: '订单管理',
            noLink: true,
          },
          {
            path: '/Deliverbill/DeliverBillList',
            name: '配送单列表',
          },
          {
            path: '/CreatDeliver',
            name: '配送单列表新增',
            noLink: true,
          },
        ]);
        this.showPlan = false;
        this.showCheck = true;
        this.isDeliveryShow = true;
        this.isNotDeliveryShow = true;
        this.isDeliverPrintShow = false;
        const tradeBtn = {
          orderCreat: true,
          orderDelete: true,
        };
        this.ControltradeBtn(tradeBtn);
        const btnDisabled = {
          planNotDelivery: false,
          planDelivery: false,
        };
        this.$bus.$emit('data/tradefoot', btnDisabled);
        this.Initialize(); // 初始化数据
        const itemList = {
          code: '',
          createBy: '',
          createTime: '',
          deliveryMemberName: this.View_UserInfor.name,
          deliveryPerson: this.View_UserInfor.contacter,
          deliveryPhone: this.View_UserInfor.phone,
          sendPerson: this.View_UserInfor.deliverPerson,
          sendPhone: this.View_UserInfor.deliverPhone,
          id: '',
          amount: 0,
        };
        this.ItemList(itemList);
        this.$nextTick(() => {
          this.TableHeightRun(['#from-item', '.TradeFooter', 200]);
        });
      }
      if (to.path === '/Deliverbill/DeliverBillList') {   // 如果去初始页面计算表格高度
        this.$store.commit('BreadCrumb_Update', [
          {
            path: '/index',
            name: this.$store.state.view.resourcesNow.name,
          },
          {
            path: '/Deliverbill',
            name: '配送单管理',
            noLink: true,
          },
          {
            path: '/DeliverBillList',
            name: '配送单列表',
            noLink: true,
          },
        ]);
        this.showPlan = true;
        this.showCheck = false;
        this.isConfirmShow = false;
        this.isDeliveryShow = false;
        this.isNotDeliveryShow = false;
        this.isDeliverPrintShow = false;
        this.Initialize(); // 初始化数据
        this.$nextTick(() => {
          this.TableHeightRun();
        });
      }
    },
  },
  mounted() {
    if (this.View_UserInfo.memberType === 2) {
      this.message.splice(5, 1);
    }
    if (this.View_UserInfo.memberType === 2) {
      this.ShowBtn.create = true;
    }
    if (this.$route.query.from !== 'index') {
      this.$router.push({ path: '/Deliverbill/DeliverBillList' });
    }
    this.$nextTick(() => {
      this.TableHeightRun();
    });
    window.onresize = () => {
      if (this.$route.path === '/Deliverbill/DeliverBillList') {
        this.TableHeightRun();
      } else {
        this.TableHeightRun(['#from-item', '.TradeFooter', 200]);
      }
    };
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Deliverbill',
        name: '配送单管理',
        noLink: true,
      },
      {
        path: '/DeliverBillList',
        name: '配送单列表',
        noLink: true,
      },
    ]);
  },
  activated() {
    this.defaultAjax = 0; // 控制defaultAjax变化监听
    if (this.$route.query.from === 'index') {
      this.$set(this.message[5], 'defaults', [0, 1]);
      this.defaultAjax += 1; // 控制defaultAjax变化监听
    }
    this.authbtn = DeliverBillList.authbtn();
    this.$bus.$on('data/page/do', this.dataPageDo);      //  多按钮点击时候触发事件
    this.$bus.$on('deliver/print/click', this.deliverPrintClick);      //  批量条码打印
    this.$bus.$on('qrcode/printone/click', this.qrCodePrintOneClick);    //  二维码（单据维度）
    this.$bus.$on('qrcode/printtwo/click', this.qrCodePrintTwoClick);    //  二维码（药品维度）
    this.$bus.$on('table/height', this.tableHeightRun);  //  监听查询按钮的查看更多点击事件，重新计算表格高度
  },
  deactivated() {
    this.$bus.$off('data/page/do', this.dataPageDo);      //  多按钮点击时候触发事件
    this.$bus.$off('deliver/print/click', this.deliverPrintClick);     //  批量条码打印
    this.$bus.$off('qrcode/printone/click', this.qrCodePrintOneClick);   //  二维码（单据维度）
    this.$bus.$off('qrcode/printtwo/click', this.qrCodePrintTwoClick);   //  二维码（药品维度）
    this.$bus.$off('table/height', this.tableHeightRun);   //  监听查询按钮的查看更多点击事件，重新计算表格高度
  },
  data() {
    return {
      defaultAjax: 0,
      ids: '',
      printType: 0,
      printVisible: false,
      hospitalbur: true,
      deliverbur: true,
      showPlan: true,
      showCheck: false,
      loading: false,
      page: 1,              // 当前页数
      size: 20,             // 一页显示多少列
      total: 0,             // 一共多少页
      isBackShow: true,     // 返回按钮
      isConfirmShow: false,  // 确认按钮
      isBackoutShow: true,  // 撤销按钮
      isDeliveryShow: false,    // 货票同行按钮按钮
      isNotDeliveryShow: false, // 非货票同行按钮按钮
      isDeliverPrintShow: false, // 非货票同行按钮按钮
      ShowBtn: {            // 按钮显示控制
        destory: false,
        create: false,
        pwnolock: false,
        onDrugs: false,
        offDrugs: false,
        exportData: false,
        importData: false,
        saveChange: false,
        deliverPrint: true,
        qrcodePrintOne: true,
        qrcodePrintTwo: true,
      },
      authbtn: {},
      message: [
        {
          key: 'barcode',
          label: '条码号',
          placeholder: '请输入条码号',
          hasOp: false,
          type: 10,
          selects: [],
        },
        {
          key: 'code',
          label: '配送单编号',
          placeholder: '请输入编号',
          hasOp: false,
          type: 0,
          selects: [],
        },
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
          type: 9,  // 类型
          key: 'createTime',
          label: '创建日期',
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
          key: 'stockinStatus',
          label: '入库状态',
          placeholder: '请选择入库状态',
          hasOp: false,
          type: 2,
          selects: [
            {
              value: 0,
              label: '未入库',
            },
            {
              value: 1,
              label: '部分入库',
            },
            {
              value: 2,
              label: '已入库',
            },
          ],
        },
        {
          type: 9,  // 类型
          key: 'sendTime',
          label: '发货日期',
          shortcuts: true,  // 是否开启快捷选择
          defaultDate: false,  // 是否进来默认为一个月
        },
        //          {
        //            key: 'sendTime',
        //            label: '发货日期',
        //            convertdate: 2,
        //            type: 5,
        //            placeholder: '请选择日期',
        //            selects: [],
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
          key: 'noOut',
          label: '外部配送单号',
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
<style>
.print-type .el-radio-group {
  margin: 0 0 10px 35px;
}
</style>

