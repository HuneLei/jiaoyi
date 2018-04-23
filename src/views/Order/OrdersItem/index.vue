<template>
  <div>
    <div v-show="showPlan" id="Order_Plan" v-loading="loading">
      <Find :showNum="8" :message="message" :isShowFilter="true" :filterField="filterField" @filter-field="emitFilterField"></Find>
      <PlanShow :authbtn="authbtn" @page="dataPage" @table-select="tableSelect" :filter="filterFieldResult"></PlanShow>
      <Paging :authbtn="authbtn" :show-btn="ShowBtn" :page="page" :size="size" :total="total"></Paging>
      <DialogForm :dialog-form-visible="dialogFormShow" @close-dialog="CloseDialog" @dialog-confirm="dialogConfirm" :message="editMessage" :from-dialog="dialogform" :isFormConfirm="true" :formConfirmLoading="formConfirmLoading">
      </DialogForm>
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
import PlanShow from './PlanShow';                        // 引用列表显示组件
import Paging from '../../../components/Paging';          // 引入底部
import Find from '../../../components/Find';              // 引搜索头部
import OrdesItem from '../../../api/Order/OrdesItem';     // 引入订单结案申请明细api
import convert from '../../../utils/convert';             // 引入js公共方法
import DialogForm from '../../../components/DialogForm';  // 表单弹出框
import ReturnBillsList from '../../../api/Return/ReturnBillsList';       //  退货单列表api

export default {
  components: {
    Find,
    Paging,
    PlanShow,
    DialogForm,
  },
  computed: {
    ...mapGetters([
      'Order_isNoAgreeShow',
      'Order_isAgreeShow',
      'Order_isRemoveShow',
      'Order_PlanfromEdit',
      'View_UserInfo',
      'getGpoId',
    ]),
    remarksId() {
      return this.dialogform.remarksId;
    },
  },
  methods: {
    tableSelect(ids) {   // 报错所选择的ids
      this.ids = ids;
    },
    // 申请结案
    applyClosure(row) {
      const paramKey = 'DDJA';
      ReturnBillsList.reasonlist(paramKey)
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
        ids: this.ids,
        reason: formName.remarks,
      };
      this.loading = true;
      OrdesItem.cancel(from).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '申请成功',
          });
          this.$bus.$emit('data/list');
        }
        this.loading = false;
      });
    },
    // 关闭窗口后的触发事件
    CloseDialog() {
      this.dialogFormShow = false;
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
      window.localStorage.setItem('fields_OrdersItem', JSON.stringify(map));
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
      this.authbtn = OrdesItem.authbtn();
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
      if (to.path === '/Order/OrdersItem') {   // 如果去初始页面计算表格高度
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
            name: '订单明细',
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
      if (this.$route.path === '/Order/OrdersItem') {
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
        path: '/OrdersItem',
        name: '订单明细',
        noLink: true,
      },
    ]);
  },
  activated() {
    this.authbtn = OrdesItem.authbtn();
    this.$bus.$on('table/height', this.tableHeightRun);  //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$on('apply/closure', this.applyClosure);   //  监听申请结案
    this.$bus.$on('export/data', this.exportData);       //  监听导出数据

    const fields = window.localStorage.getItem('fields_OrdersItem');
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
    this.$bus.$off('apply/closure', this.applyClosure);   //  监听申请结案
    this.$bus.$off('export/data', this.exportData);      //  监听导出数据
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
        applyClosure: true,
      },
      dialogform: {
        remarksId: '', // 结案原因
        remarks: '',   // 合同结案原因
      },
      authbtn: {},
      editMessage: {
        dialogTitle: '申请结案',
        selects: [
          { label: '结案原因', key: 'remarksId', type: 'el-select', placeholder: '请选择结案原因', option: 'reasonOption', noClearable: true },
          { label: '', key: 'remarks', type: 'el-input', placeholder: '请输入订单结案原因', fromType: 'textarea', rows: 4 },
        ],
        options: {
          reasonOption: [{
            label: '原因1',
            value: 0,
          }, {
            label: '原因2',
            value: 1,
          }],
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
          key: 'code',
          label: '订单编号',
          placeholder: '请输入编号',
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
        {
          key: 'sendStatus',
          label: '发货状态',
          placeholder: '请选择发货状态',
          hasOp: false,
          type: 2,
          selects: [
            {
              value: 0,
              label: '无',
            },
            {
              value: 1,
              label: '待发货',
            },
            {
              value: 2,
              label: '部分发货',
            },
            {
              value: 3,
              label: '已发货',
            },
          ],
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
          key: 'salerMemberName',
          label: '卖方会员',
          placeholder: '请输入卖方会员',
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
              value: 1,
              label: '结案中',
            },
            {
              value: 3,
              label: '已结案',
            },
          ],
        },
        {
          type: 9,  // 类型
          key: 'confirmTime',
          label: '确认日期',
          placeholder: '请输入创建日期',
          shortcuts: true,  // 是否开启快捷选择
          defaultDate: false,  // 是否进来默认为一个月
        },
        //          {
        //            key: 'confirmTime',
        //            label: '确认日期',
        //            convertdate: 2,
        //            placeholder: '请选择日期',
        //            type: 5,
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
          key: 'tradeName',
          label: '商品名',
          placeholder: '请输入商品名',
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
          key: 'drugStandardCode',
          label: '本位码',
          placeholder: '请输入本位码',
          hasOp: false,
          type: 0,
          selects: [],
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
          key: 'contractItemNo',
          label: '合同明细编号',
          placeholder: '请输入明细编号',
          hasOp: false,
          type: 0,
          selects: [],
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
        hospitalUnitPrice: true,
        purchaseAmount: true,
        ordersNum: true,
        sendNum: true,
        waitNum: true,
        stockinNum: true,
        refusedNum: true,
        returnNum: true,
        closeNum: true,
        producerName: true,
        salerMemberName: true,
        approvalNumber: true,
        contractCode: true,
        contractItemNo: true,
        sendStatus: true,
        closeStatus: true,
        receiveAddress: true,
        createBy: true,
        createTime: true,
        confirmTime: true,
        noOut: true,
        drugStandardCode: true,
      },
      filterField: [
        {
          key: 'code',
          label: '订单编号',
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
          key: 'hospitalUnitPrice',
          label: '单价',
          show: true,
        },
        {
          key: 'purchaseAmount',
          label: '金额',
          show: true,
        },
        {
          key: 'ordersNum',
          label: '订单数量',
          show: true,
        },
        {
          key: 'sendNum',
          label: '发货数量',
          show: true,
        },
        {
          key: 'waitNum',
          label: '待发数量',
          show: true,
        },
        {
          key: 'stockinNum',
          label: '入库数量',
          show: true,
        },
        {
          key: 'refusedNum',
          label: '拒收数量',
          show: true,
        },
        {
          key: 'returnNum',
          label: '退货数量',
          show: true,
        },
        {
          key: 'closeNum',
          label: '结案数量',
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
          key: 'sendStatus',
          label: '发货状态',
          show: true,
        },
        {
          key: 'closeStatus',
          label: '结案状态',
          show: true,
        },
        {
          key: 'receiveAddress',
          label: '收货地址',
          show: true,
        },
        {
          key: 'createBy',
          label: '创建人',
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
        {
          key: 'noOut',
          label: '外部订单编号',
          show: true,
        },
        {
          key: 'drugStandardCode',
          label: '本位码',
          show: true,
        },
      ],
    };
  },
};
</script>

