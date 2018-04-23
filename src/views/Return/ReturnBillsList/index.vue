<template>
  <div>
    <div v-show="showPlan" id="Order_Plan">
      <Find :showNum="8" :message="message" :defaultAjax="defaultAjax"></Find>
      <ReturnBillShow :authbtn="authbtn" @page="dataPage"></ReturnBillShow>
      <Paging :authbtn="authbtn" :show-btn="ShowBtn" :page="page" :size="size" :total="total"></Paging>
    </div>
    <div v-show="showCheck">
      <router-view v-loading="loading"></router-view>
      <TradeFooter :authbtn="authbtn" :isSaveShow="isSaveShow" :isDeleteShow="isDeleteShow" :isSubmitShow="isSubmitShow" :isBackShow="isBackShow" :isReturnShow="isReturnShow" :isNotReturnsShow="isNotReturnsShow" :isReAgreeShow="isReAgreeShow" :isNoReAgreeShow="isNoReAgreeShow" @order-save="orderSave" @data-submit="dataSubmit" @order-delete="orderDelete" @order-back="orderBack" @order-reagree="orderAgree" @order-noreturns="orderNoagree" @order-notreturns="orderNotreturns" @order-return="orderReturn"></TradeFooter>
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
import Find from '../../../components/Find';                                  // 引搜索头部
import Paging from '../../../components/Paging';                              // 引入底部
import DialogForm from '../../../components/DialogForm';                      // 表单弹出框
import TradeFooter from '../../../components/TradeFooter';                    // 引入订单底部
import convert from '../../../utils/convert';                                 // 引入js公共方法
import ReturnBillsList from '../../../api/Return/ReturnBillsList';            // 引入入库列表api
import ReturnBillShow from './ReturnBillShow';                                // 引用列表显示组件

export default {
  components: {
    Find,
    Paging,
    DialogForm,
    TradeFooter,
    ReturnBillShow,
  },
  computed: mapGetters([
    'Order_purchaseAmount',
    'Order_PlanfromEdit',
    'Order_PlanDateList',
    'Order_PlanItemList',
    'Order_ReturnHint',
    'View_UserInfo',
    'View_UserInfor',
    'getGpoId',
  ]),
  methods: {
    // 同意
    orderAgree(res, msg) {
      const from = {
        remark: msg,
        status: 2,
        id: this.$route.query.id,
        returnItemFormList: this.Order_PlanItemList,
      };
      this.orderStatus(from);
    },
    // 不同意
    orderNoagree() {
      this.status = 4;
      this.dialogFormShow = true;
    },
    // 审核方法
    orderStatus(from) {
      ReturnBillsList.audit(from).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '提交成功',
          });
          this.$bus.$emit('data/list');
          history.back();
        }
        this.loading = false;
      });
    },
    // 不同意退货
    orderNotreturns() {
      this.status = 5;
      this.dialogFormShow = true;
    },
    // 同意退货
    orderReturn() {
      const ret = '此操作将同意退货申请, 请填写备注';
      this.$prompt(ret, '同意退货申请', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        this.returnSubmit(value);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 确定按钮
    returnSubmit(msg) {
      let datelist = [];
      datelist = Object.assign(this.Order_PlanItemList);
      for (let i = 0; i < datelist.length; i += 1) {
        if (datelist[i].returnNum === '' || datelist[i].returnNum === 0) {
          this.$message({
            type: 'error',
            message: '同意退货数量不能空或为0',
          });
          return;
        }
      }
      const from = {
        remark: msg,
        status: 3,
        id: this.$route.query.id,
        returnItemFormList: datelist,
      };
      ReturnBillsList.audit(from).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '提交成功',
          });
          this.$bus.$emit('data/list');
          history.back();
        }
        this.loading = false;
      });
    },
    // 提交按钮触发事件
    dataSubmit() {
      this.$confirm('此操作将提交该数据，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.orderSubmit(1);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 保存按钮触发事件
    orderSave() {
      this.$confirm('此操作将保存该数据，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.orderSubmit(0);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 保存提交事件
    orderSubmit(data) {
      const datelist = [];
      if (!this.Order_PlanfromEdit.deliveryMemberName) {
        this.$message({
          type: 'error',
          message: '请选择配送企业！',
        });
        return;
      }
      if (typeof this.$route.query.id === 'undefined') {
        if (!this.Order_PlanDateList.length) {
          this.$message({
            type: 'error',
            message: '明细不能为空！',
          });
          return;
        }
        for (let y = 0; y < this.Order_PlanDateList.length; y += 1) {
          datelist[y] = Object.assign({}, this.Order_PlanDateList[y]);
        }
        for (let i = 0; i < datelist.length; i += 1) {
          if (datelist[i].returnType === '' || datelist[i].returnType === null) {
            this.$message({
              type: 'error',
              message: '请选择退货类型',
            });
            return;
          }
          if (datelist[i].purchaseNum === '' || datelist[i].purchaseNum === null || Number(datelist[i].purchaseNum) === 0) {
            this.$message({
              type: 'error',
              message: '数量不能为空或为0',
            });
            return;
          }
          if (datelist[i].purchaseNum > datelist[i].returnableNum) {
            this.$message({
              type: 'error',
              message: '可退货数量不足',
            });
            return;
          }
          // datelist[i].stockinNum = datelist[i].purchaseNum;
          datelist[i].returnAmount = datelist[i].purchaseAmount;
          datelist[i].applyReturnNum = datelist[i].purchaseNum;
          if (datelist[i].returnType) {
            const info = datelist[i].returnType.split('-');
            datelist[i].returnType = Number(info[0]);
          }
        }
        //            this.loading = true;
        const info = this.Order_PlanfromEdit.deliveryMemberName.split('-');
        const MemberId = this.Order_PlanfromEdit.deliveryMemberId;
        const remark = this.Order_PlanfromEdit.remarks;
        const MemberName = !info[1] || info[1] === 'null' ? '' : info[1];
        const from = {
          gpoMemberId: this.getGpoId,
          deliveryMemberId: MemberId,
          deliveryMemberName: MemberName,
          remarks: remark,
          amount: this.Order_purchaseAmount,
          status: data,
          id: 0,
          tmsReturnBillsItemFormList: datelist,
        };
        ReturnBillsList.create(from).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '保存成功',
            });
            this.$bus.$emit('data/list');
            history.back();
          }
          this.loading = false;
        });
      } else {
        if (!this.Order_PlanItemList.length) {
          this.$message({
            type: 'error',
            message: '明细不能为空！',
          });
          return;
        }
        for (let y = 0; y < this.Order_PlanItemList.length; y += 1) {
          datelist[y] = Object.assign({}, this.Order_PlanItemList[y]);
        }
        for (let i = 0; i < datelist.length; i += 1) {
          if (datelist[i].returnType === '' || datelist[i].returnType === null) {
            this.$message({
              type: 'error',
              message: '请选择退货类型',
            });
            return;
          }
          if (datelist[i].purchaseNum === '' || datelist[i].purchaseNum === null || Number(datelist[i].purchaseNum) === 0) {
            this.$message({
              type: 'error',
              message: '数量不能为空或为0',
            });
            return;
          }
          if (datelist[i].purchaseNum > datelist[i].returnableNum) {
            this.$message({
              type: 'error',
              message: '可退货数量不足',
            });
            return;
          }
          // datelist[i].stockinNum = datelist[i].purchaseNum;
          datelist[i].returnAmount = datelist[i].purchaseAmount;
          datelist[i].applyReturnNum = datelist[i].purchaseNum;
          if (datelist[i].returnType) {
            const info = datelist[i].returnType.split('-');
            datelist[i].returnType = Number(info[0]);
          }
        }
        this.loading = true;
        const info = this.Order_PlanfromEdit.deliveryMemberName.split('-');
        const MemberId = this.Order_PlanfromEdit.deliveryMemberId;
        const MemberName = !info[1] || info[1] === 'null' ? '' : info[1];
        const remark = this.Order_PlanfromEdit.remarks;
        const from = {
          gpoMemberId: this.getGpoId,
          deliveryMemberId: MemberId,
          deliveryMemberName: MemberName,
          remarks: remark,
          amount: this.Order_purchaseAmount,
          status: data,
          id: this.$route.query.id,
          tmsReturnBillsItemFormList: datelist,
        };
        ReturnBillsList.update(from).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '保存成功',
            });
            this.$bus.$emit('data/list');
            history.back();
          }
          this.loading = false;
        });
      }
    },
    orderDelete() {      // 删除按钮触发事件
      this.loading = true;
      ReturnBillsList.remove([this.$route.query.id]).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功',
          });
          this.$bus.$emit('data/list');
        }
        this.loading = false;
        history.back();
      });
    },
    // 订单结案
    orderApply(list, data) {
      this.dialogFormShow = true; // 打开弹出框
    },
    // 点击确定后的触发事件
    dialogConfirm(formName) {
      const from = {
        remark: formName.remarks,
        status: this.status,
        id: this.$route.query.id,
        returnItemFormList: this.Order_PlanItemList,
      };
      this.orderStatus(from);
    },
    // 关闭窗口后的触发事件
    CloseDialog() {
      this.dialogFormShow = false;
    },
    dataPageDo() {       // 新增点击时触发事件
      this.$router.push({ path: '/Return/ReturnBillsList/CreatPlan' });
    },
    orderBack() {        // 返回按钮触发事件
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
      'ItemList',
      'showCreat',
      'Initialize',
      'DeliveryShow',
      'TableHeightRun',
      'ControltradeBtn',
    ]),
  },
  watch: {
    authList() {
      this.authbtn = ReturnBillsList.authbtn();
    },
    $route(to, from) {
      if (to.path === '/Return/ReturnBillsList/CheckItem') {   // 如果去详情页面计算表格高度
        this.$store.commit('BreadCrumb_Update', [
          {
            path: '/index',
            name: this.$store.state.view.resourcesNow.name,
          },
          {
            path: '/Return',
            name: '退货单管理',
            noLink: true,
          },
          {
            path: '/Return/ReturnBillsList',
            name: '退货单列表',
          },
          {
            path: '/CheckItem',
            name: '退货单列表详情',
            noLink: true,
          },
        ]);
        this.showPlan = false;
        this.showCheck = true;
        this.Initialize(); // 初始化数据
        let tradeBtn = {
          orderCreat: false,
          orderDelete: false,
        };
        this.isSaveShow = false;
        this.isSubmitShow = false;
        this.isDeleteShow = false;
        this.isReturnShow = false;
        this.isReAgreeShow = false;
        this.isNoReAgreeShow = false;
        this.isNotReturnsShow = false;
        let height = 200;
        switch (this.$route.query.status) {
          case 0:
            height = 220;
            tradeBtn = {
              orderCreat: false,
              orderDelete: true,
            };
            if (this.View_UserInfo.memberType === 3) {
              this.isSaveShow = true;
              this.isSubmitShow = true;
              this.isDeleteShow = true;
              this.isReturnShow = false;
              this.isReAgreeShow = false;
              this.isNoReAgreeShow = false;
              this.isNotReturnsShow = false;
            }
            break;
          case 1:
            tradeBtn = {
              orderCreat: true,
              orderDelete: true,
            };
            if (this.View_UserInfo.memberType === 4) {
              this.isSaveShow = false;
              this.isSubmitShow = false;
              this.isDeleteShow = false;
              this.isReturnShow = false;
              this.isReAgreeShow = true;
              this.isNoReAgreeShow = true;
              this.isNotReturnsShow = false;
            }
            break;
          case 2:
            tradeBtn = {
              orderCreat: true,
              orderDelete: true,
            };
            if (this.View_UserInfo.memberType === 2) {
              this.isSaveShow = false;
              this.isSubmitShow = false;
              this.isDeleteShow = false;
              this.isReturnShow = true;
              this.isReAgreeShow = false;
              this.isNoReAgreeShow = false;
              this.isNotReturnsShow = true;
            }
            break;
          case 3:
            tradeBtn = {
              orderCreat: true,
              orderDelete: true,
            };
            this.isSaveShow = false;
            this.isSubmitShow = false;
            this.isDeleteShow = false;
            this.isReturnShow = false;
            this.isReAgreeShow = false;
            this.isNoReAgreeShow = false;
            this.isNotReturnsShow = false;
            break;
          case 4:
            tradeBtn = {
              orderCreat: true,
              orderDelete: true,
            };
            this.isSaveShow = false;
            this.isSubmitShow = false;
            this.isDeleteShow = false;
            this.isReturnShow = false;
            this.isReAgreeShow = false;
            this.isNoReAgreeShow = false;
            this.isNotReturnsShow = false;
            break;
          case 5:
            tradeBtn = {
              orderCreat: true,
              orderDelete: true,
            };
            this.isSaveShow = false;
            this.isSubmitShow = false;
            this.isDeleteShow = false;
            this.isReturnShow = false;
            this.isReAgreeShow = false;
            this.isNoReAgreeShow = false;
            this.isNotReturnsShow = false;
            break;
          default:
            break;
        }
        this.ControltradeBtn(tradeBtn);
        this.$nextTick(() => {
          this.TableHeightRun(['#from-item', '.TradeFooter', height]);
        });
      }
      if (to.path === '/Return/ReturnBillsList/CreatPlan') {    // 如果去新增页面计算表格高度
        this.$store.commit('BreadCrumb_Update', [
          {
            path: '/index',
            name: this.$store.state.view.resourcesNow.name,
          },
          {
            path: '/Return',
            name: '退货单管理',
            noLink: true,
          },
          {
            path: '/Return/ReturnBillsList',
            name: '退货单列表',
          },
          {
            path: '/CreatPlan',
            name: '退货单列表新增',
            noLink: true,
          },
        ]);
        this.showPlan = false;
        this.showCheck = true;
        this.isSaveShow = true;
        this.isSubmitShow = true;
        this.isDeleteShow = false;
        this.isReturnShow = false;
        this.isReAgreeShow = false;
        this.isNoReAgreeShow = false;
        this.isNotReturnsShow = false;
        this.Initialize(); // 初始化数据
        const tradeBtn = {
          orderCreat: true,
          orderDelete: true,
        };
        this.ControltradeBtn(tradeBtn);
        const itemList = {
          code: '',
          createBy: '',
          createTime: '',
          hospitalMemberName: this.View_UserInfor.name,
          hospitalPerson: `${this.View_UserInfor.contacter || ''} ${this.View_UserInfor.phone || ''}`,
          hospitalPhone: this.View_UserInfor.phone,
          id: '',
          name: '',
        };
        this.ItemList(itemList);
        this.$nextTick(() => {
          this.TableHeightRun(['.el-form', '.TradeFooter', 200]);
        });
      }
      if (to.path === '/Return/ReturnBillsList') {   // 如果去初始页面计算表格高度
        this.$store.commit('BreadCrumb_Update', [
          {
            path: '/index',
            name: this.$store.state.view.resourcesNow.name,
          },
          {
            path: '/Return',
            name: '退货单管理',
            noLink: true,
          },
          {
            path: '/ReturnBillsList',
            name: '退货单列表',
            noLink: true,
          },
        ]);
        this.showPlan = true;
        this.showCheck = false;
        this.$nextTick(() => {
          this.TableHeightRun();
        });
      }
    },
  },
  mounted() {
    if (this.View_UserInfo.memberType === 3) {
      this.ShowBtn.create = true;
    }
    if (this.View_UserInfo.memberType !== 2) {
      this.message[4].selects.unshift({
        value: 0,
        label: '待提交',
      });
    }
    if (this.$route.query.from !== 'index') {
      this.$router.push({ path: '/Return/ReturnBillsList' });
    }
    this.$nextTick(() => {
      this.TableHeightRun();
    });
    window.onresize = () => {
      if (this.$route.path === '/Return/ReturnBillsList') {
        this.TableHeightRun();
      } else if (this.$route.path === '/Return/ReturnBillsList/CreatPlan') {
        this.TableHeightRun(['.el-form', '.TradeFooter', 200]);
      } else if (this.$route.path === '/Return/ReturnBillsList/CheckItem') {
        this.TableHeightRun(['#from-item', '.TradeFooter', 200]);
      }
    };
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Return',
        name: '退货单管理',
        noLink: true,
      },
      {
        path: '/ReturnBillsList',
        name: '退货单列表',
        noLink: true,
      },
    ]);
  },
  activated() {
    this.defaultAjax = 0; // 控制defaultAjax变化监听
    if (this.$route.query.from === 'index' && this.View_UserInfo.memberType === 2) {
      this.$set(this.message[4], 'defaults', 2);
      this.defaultAjax += 1; // 控制defaultAjax变化监听
    } else if (this.$route.query.from === 'index' && this.View_UserInfo.memberType === 4) {
      this.$set(this.message[4], 'defaults', 1);
      this.defaultAjax += 1; // 控制defaultAjax变化监听
    }
    this.authbtn = ReturnBillsList.authbtn();
    this.$bus.$on('data/page/do', this.dataPageDo);      //  多按钮点击时候触发事件
    this.$bus.$on('table/height', this.tableHeightRun);  //  监听查询按钮的查看更多点击事件，重新计算表格高度
  },
  deactivated() {
    this.$bus.$off('data/page/do', this.dataPageDo);     //  多按钮点击时候触发事件
    this.$bus.$off('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
  },
  data() {
    return {
      defaultAjax: 0,
      status: 0,
      loading: false,
      showPlan: true,
      showCheck: false,
      page: 1,                   // 当前页数
      size: 20,                  // 一页显示多少列
      total: 0,                  // 一共多少页
      isSaveShow: false,         // 保存按钮
      isBackShow: true,          // 返回按钮
      isDeleteShow: false,       // 删除按钮
      isSubmitShow: false,       // 提交按钮
      isReturnShow: false,       // 同意退货按钮
      isReAgreeShow: false,      // 同意按钮
      isNoReAgreeShow: false,    // 不同意按钮
      dialogFormShow: false,     // 弹出框显示隐藏控制
      formConfirmLoading: false, // 确定按钮loding
      isNotReturnsShow: false,   // 拒绝退货按钮
      ShowBtn: {                 // 按钮显示控制
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
      editMessage: {
        dialogTitle: '拒绝退货',
        selects: [
          { label: '拒绝退货原因', key: 'remarks', type: 'el-input', placeholder: '请输入订单拒绝退货原因', fromType: 'textarea', rows: 4 },
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
            { type: 'number', required: true, message: '请选择拒绝退货原因', trigger: 'change' },
          ],
        },
        styleObject: {},
      },
      dialogform: {
        remarksId: '', // 拒绝退货原因
        remarks: '',   // 合同拒绝退货原因
      },
      message: [
        {
          key: 'code',
          label: '退货单编号',
          placeholder: '请输入编号',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'hospitalMemberName',
          label: '医疗机构',
          placeholder: '请输入名称',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'deliveryMemberName',
          label: '配送企业',
          placeholder: '请输入名称',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          type: 9,  // 类型
          key: 'createTime',
          label: '申请退货日期',
          shortcuts: true,  // 是否开启快捷选择
          defaultDate: true,  // 是否进来默认为一个月
        },
        //          {
        //            key: 'createTime',
        //            label: '申请退货日期',
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
          key: 'isDeletable',
          label: '退货单状态',
          placeholder: '请选择状态',
          hasOp: false,
          type: 1,
          selects: [
            {
              value: 1,
              label: '待审核(GPO)',
            },
            {
              value: 2,
              label: '待审核(配送企业)',
            },
            {
              value: 3,
              label: '审核通过',
            },
            {
              value: 4,
              label: 'GPO未通过',
            },
            {
              value: 5,
              label: '配送企业未通过',
            },
          ],
        },
        {
          key: 'noOut',
          label: '外部退货编号',
          placeholder: '请输入外部退货编号',
          hasOp: false,
          type: 0,
          selects: [],
        },
      ],
    };
  },
};
</script>
