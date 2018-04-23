<template>
  <div>
    <div v-show="showPlan" id="Order_Plan" v-loading="loading">
      <Find :showNum="8" :message="message" :isShowFilter="true" :filterField="filterField" @filter-field="emitFilterField"></Find>
      <Show :authbtn="authbtn" @page="dataPage" @table-select="tableSelect" :filter="filterFieldResult"></Show>
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
import Show from './DeliverShow';                        // 引用列表显示组件
import Paging from '../../../components/Paging';          // 引入底部
import Find from '../../../components/Find';              // 引搜索头部
import DeliverBillItem from '../../../api/Deliverbill/DeliverBillItem';     // 引入配送管理api
import convert from '../../../utils/convert';             // 引入js公共方法

export default {
  components: {
    Find,
    Paging,
    Show,
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
    // 撤销操作
    revocation() {
      // console.log();
    },
    tableSelect(ids) {   // 报错所选择的ids
      this.ids = ids;
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
    // 导出数据
    exportData() {
      this.$bus.$emit('data/export');
    },
    // 筛选表格显示列
    emitFilterField(map) {
      // 存入 localStorage
      window.localStorage.setItem('fields_DeliverBillItem', JSON.stringify(map));
      this.filterFieldResult = map;
      // 利用子组件传过来的选中的值与之前[filterField][渲染子组件选中]的值对比，判断子组件的选中状态
      for (let i = 0; i < this.filterField.length; i += 1) {
        if (!map[this.filterField[i].key]) {
          this.filterField[i].show = false;
        } else {
          this.filterField[i].show = true;
        }
      }
    },
    ...mapActions([
      'Initialize',
      'TableHeightRun',
    ]),
  },
  watch: {
    authList() {
      this.authbtn = DeliverBillItem.authbtn();
    },
    $route(to, from) {
      if (to.path === '/Deliverbill/DeliverBillItem') {   // 如果去初始页面计算表格高度
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
            path: '/DeliverBillItem',
            name: '配送单明细',
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
      if (this.$route.path === '/Deliverbill/DeliverBillItem') {
        this.TableHeightRun(['.find', '.paging', 140]);
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
        path: '/DeliverBillItem',
        name: '配送单明细',
        noLink: true,
      },
    ]);
  },
  activated() {
    this.authbtn = DeliverBillItem.authbtn();
    this.$bus.$on('table/height', this.tableHeightRun);  //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$on('export/data', this.exportData);       //  监听导出数据
    this.$bus.$on('revoca/tion', this.revocation);       //  撤销操作

    const fields = window.localStorage.getItem('fields_DeliverBillItem');
    if (fields) {
      const fieldsJson = JSON.parse(fields);
      this.filterFieldResult = fieldsJson;
      for (let i = 0; i < this.filterField.length; i += 1) {
        if (!fieldsJson[this.filterField[i].key]) {
          this.filterField[i].show = false;
        }
      }
    }
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$off('export/data', this.exportData);      //  监听导出数据
    this.$bus.$off('revoca/tion', this.revocation);      //  撤销操作
  },
  data() {
    return {
      ids: [],
      loading: false,
      showPlan: true,
      showCheck: false,
      dialogFormShow: false, // 弹出框显示隐藏控制
      formConfirmLoading: false, // 确定按钮loding
      page: 1,              // 当前页数
      size: 20,             // 一页显示多少列
      total: 0,             // 一共多少页
      ShowBtn: {            // 按钮显示控制
        exportData: true,
        revocation: false,
      },
      dialogform: {
        remarksId: '', // 结案原因
        remarks: '',   // 合同结案原因
      },
      authbtn: {},
      message: [
        {
          key: 'deliverCode',
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
          key: 'sendTime',
          label: '发货日期',
          shortcuts: true,  // 是否开启快捷选择
          defaultDate: true,  // 是否进来默认为一个月
        },
        //          {
        //            key: 'sendTime',
        //            label: '发货日期',
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
          key: 'ordersCode',
          label: '订单编号',
          placeholder: '请输入订单编号',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'barcode',
          label: '条码号',
          placeholder: '请输入条码号',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'batchNo',
          label: '批号',
          placeholder: '请输入批号',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'contractCode',
          label: '合同编号',
          placeholder: '请输入合同编号',
          hasOp: false,
          type: 0,
          selects: [],
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
          key: 'producerName',
          label: '生产企业',
          placeholder: '请输入生产企业',
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
          label: '外部配送单号',
          placeholder: '请输入外部配送单号',
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
          key: 'ifInvoice',
          label: '是否开票',
          hasOp: false,
          index: 1,
          type: 1,
          selects: [
            {
              value: 0,
              label: '否',
            },
            {
              value: 1,
              label: '是',
            },
          ],
        },
      ],
      filterFieldResult: {
        code: true,
        hospitalMemberName: true,
        deliveryMemberName: true,
        drugsCode: true,
        drugsName: true,
        tradeName: true,
        formName: true,
        specName: true,
        packSpecName: true,
        unitName: true,
        batchNo: true,
        hospitalUnitPrice: true,
        drugsNum: true,
        stockinNum: true,
        amount: true,
        refusedNum: true,
        invoicedNum: true,
        refusedInvoicedNum: true,
        deliveryAddress: true,
        producerName: true,
        salerMemberName: true,
        approvalNumber: true,
        drugsReportFile: true,
        makeDate: true,
        validDate: true,
        barcode: true,
        invoiceNumber: true,
        ordersCode: true,
        contractCode: true,
        contractItemNo: true,
        noOut: true,
        createBy: true,
        sendTime: true,
        createTime: true,
        confirmTime: true,
      },
      filterField: [
        {
          key: 'code',
          label: '配送单编号',
          show: true,
        },
        {
          key: 'hospitalMemberName',
          label: '医疗机构',
          show: true,
        },
        {
          key: 'deliveryMemberName',
          label: '配送企业',
          show: true,
        },
        {
          key: 'drugsCode',
          label: '药品编码',
          show: true,
        },
        {
          key: 'drugsName',
          label: '通用名',
          show: true,
        },
        {
          key: 'tradeName',
          label: '商品名',
          show: true,
        },
        {
          key: 'formName',
          label: '剂型',
          show: true,
        },
        {
          key: 'specName',
          label: '规格',
          show: true,
        },
        {
          key: 'packSpecName',
          label: '包装规格',
          show: true,
        },
        {
          key: 'unitName',
          label: '单位',
          show: true,
        },
        {
          key: 'batchNo',
          label: '批号',
          show: true,
        },
        {
          key: 'hospitalUnitPrice',
          label: '单价',
          show: true,
        },
        {
          key: 'drugsNum',
          label: '发货数量',
          show: true,
        },
        {
          key: 'stockinNum',
          label: '入库数量',
          show: true,
        },
        {
          key: 'amount',
          label: '发货金额',
          show: true,
        },
        {
          key: 'refusedNum',
          label: '拒收数量',
          show: true,
        },
        {
          key: 'invoicedNum',
          label: '已开票数量',
          show: true,
        },
        {
          key: 'refusedInvoicedNum',
          label: '已开红票数量',
          show: true,
        },
        {
          key: 'deliveryAddress',
          label: '送货地址',
          show: true,
        },
        {
          key: 'producerName',
          label: '生产企业',
          show: true,
        },
        {
          key: 'salerMemberName',
          label: '卖方会员',
          show: true,
        },
        {
          key: 'approvalNumber',
          label: '批准文号',
          show: true,
        },
        {
          key: 'drugsReportFile',
          label: '药检报告',
          show: true,
        },
        {
          key: 'makeDate',
          label: '生产日期',
          show: true,
        },
        {
          key: 'validDate',
          label: '有效日期',
          show: true,
        },
        {
          key: 'barcode',
          label: '条码号',
          show: true,
        },
        {
          key: 'invoiceNumber',
          label: '发票号',
          show: true,
        },
        {
          key: 'ordersCode',
          label: '订单编号',
          show: true,
        },
        {
          key: 'contractCode',
          label: '合同编号',
          show: true,
        },
        {
          key: 'contractItemNo',
          label: '合同明细编号',
          show: true,
        },
        {
          key: 'noOut',
          label: '外部配送单号',
          show: true,
        },
        {
          key: 'createBy',
          label: '创建人',
          show: true,
        },
        {
          key: 'sendTime',
          label: '发货日期',
          show: true,
        },
        {
          key: 'createTime',
          label: '订单创建日期',
          show: true,
        },
        {
          key: 'confirmTime',
          label: '订单确认日期',
          show: true,
        },
      ],
    };
  },
};
</script>

