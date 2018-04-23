<template>
  <div>
    <div v-show="showPlan" id="Order_Plan">
      <Find :showNum="8" :message="message" :defaultAjax="defaultAjax"></Find>
      <Show :authbtn="authbtn" @page="dataPage" @table-select="tableSelectOne"></Show>
      <Paging :authbtn="authbtn" :show-btn="ShowBtn" :page="page" :size="size" :total="total"></Paging>
    </div>
    <div v-show="showCheck">
      <router-view v-loading="loading"></router-view>
      <TradeFooter :authbtn="authbtn" :isSaveShow="isSaveShow" :isSubmitShow="isSubmitShow" :isBackShow="isBackShow" :isPrintShow="false" :isConfirmInvoiceShow="isConfirmInvoiceShow" :isObsoleteShow="isObsoleteShow" @order-obsolete="orderObsolete" @order-save="orderSave" @order-delete="orderDelete" @order-back="orderBack" @data-submit="dataSubmit" @invoice-confirm="invoiceConfirm"></TradeFooter>
    </div>
    <ReturnMoney></ReturnMoney>
  </div>
</template>

<script>
/**
 * Created by wuqian on 2017/9/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import Show from './Show'; // 引用列表显示组件
import TradeFooter from '../../../components/TradeFooter'; // 引入订单底部
import Paging from '../../../components/Paging'; // 引入底部
import Find from '../../../components/Find'; // 引搜索头部
import convert from '../../../utils/convert'; // 引入js公共方法
import InvoiceList from '../../../api/Invoice/InvoiceList';
import ReturnMoney from './ReturnMoney';

export default {
  components: {
    Find,
    Paging,
    Show,
    TradeFooter,
    ReturnMoney,
  },
  computed: {
    authList() {
      return this.$store.state.view.authList;
    },
    ...mapGetters([
      'Order_ReturnHint',
      'Order_PlanfromEdit',
      'Order_PlanDateList',
      'Order_PlanItemList',
      'View_UserInfo',
      'View_UserInfor',
      'getGpoId',
      'projectOptions',
      'getProjectId',
      'Order_purchaseAmount',
      'gpoOptions',
    ]),
  },
  methods: {
    tableSelectOne(ids, row) {
      this.ids = ids;
      this.returnedMoneyStatusArr = [];  // 确认状态
      this.returnedStatusArr = []; // 回款状态
      this.invoiceStatusArr = [];  // 发票状态
      this.returnedMoneyIds = [];
      this.justifyData = [];
      for (let i = 0; i < row.length; i += 1) {
        this.returnedMoneyIds.push(row[i].id);
        this.returnedMoneyStatusArr.push(row[i].affirmReturned);
        this.returnedStatusArr.push(row[i].returned);
        this.invoiceStatusArr.push(row[i].invoiceStatus);
      }
      this.justifyData = row;
    },
    // 批量回款
    returnedMoney() {
      if (this.returnedMoneyIds.length === 0) {
        this.$message({
          type: 'error',
          message: '当前未选择需操作的选项',
        });
        return false;
      }
      const returnedMoneyIds = [];
      for (let i = 0; i < this.justifyData.length; i += 1) {
        if (Number(this.justifyData[i].invoiceStatus) === 1) {
          returnedMoneyIds.push(this.justifyData[i].id);
        }
      }
      this.$bus.$emit('returnMoney/dialog', returnedMoneyIds);
      return true;
    },
    // 取消回款
    cancelReturnedMoney() {
      if (this.returnedMoneyIds.length === 0) {
        this.$message({
          type: 'error',
          message: '当前未选择需操作的选项',
        });
        return false;
      }
      this.$confirm('此操作将批量取消标记，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const returnedMoneyIds = [];
        for (let i = 0; i < this.justifyData.length; i += 1) {
          if (this.justifyData[i].returned === 1 && this.justifyData[i].affirmReturned === 0) {
            returnedMoneyIds.push(this.justifyData[i].id);
          }
        }
        const form = {
          id: returnedMoneyIds,
          type: 0,
        };
        InvoiceList.returnMoney(form).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功',
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
    // 确认回款
    affirmReturnedMoney() {
      if (this.returnedMoneyIds.length === 0) {
        this.$message({
          type: 'error',
          message: '当前未选择需操作的选项',
        });
        return false;
      }
      this.$confirm('此操作将批量确认回款，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const returnedMoneyIds = [];
        for (let i = 0; i < this.justifyData.length; i += 1) {
          if (this.justifyData[i].returned === 1 && this.justifyData[i].affirmReturned === 0) {
            returnedMoneyIds.push(this.justifyData[i].id);
          }
        }
        const form = {
          id: returnedMoneyIds,
          type: 1,
        };
        InvoiceList.affirmReturnMoney(form).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功',
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
    // 取消确认
    cancelAffirmReturnedMoney() {
      if (this.returnedMoneyIds.length === 0) {
        this.$message({
          type: 'error',
          message: '当前未选择需操作的选项',
        });
        return false;
      }
      this.$confirm('此操作将批量取消确认回款，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const form = {
          id: this.returnedMoneyIds,
          type: 0,
        };
        InvoiceList.affirmReturnMoney(form).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功',
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
    // 批量确认
    affirmChooseInvoice() {
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
        InvoiceList.determine(form).then((res) => {
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
    // 打印发票
    orderPrint(data) {
      window.open(`${window.location.origin}#/Print/InvoicePrint?id=${this.$route.query.id}`);
    },
    // 确认发票
    invoiceConfirm() {
      const form = {
        ids: [this.$route.query.id],
      };
      InvoiceList.determine(form).then((res) => {
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
    // 作废发票
    orderObsolete() {
      InvoiceList.obsolete(this.$route.query.id).then((res) => {
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
    // 提交按钮触发事件
    dataSubmit() {
      this.$confirm('此操作将提交该数据，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.toSubmit();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    toSubmit() {
      let datelist = [];
      if (!this.Order_PlanfromEdit.code) {
        this.$message({
          type: 'error',
          message: '请输入发票代码',
        });
        return;
      }
      // console.log();
      if (!this.Order_PlanfromEdit.number) {
        this.$message({
          type: 'error',
          message: '请输入发票号',
        });
        return;
      }
      if (this.Order_PlanfromEdit.invoiceType !== 0
        && this.Order_PlanfromEdit.invoiceType !== 1
        && this.Order_PlanfromEdit.invoiceType !== 2) {
        this.$message({
          type: 'error',
          message: '请选择发票类型',
        });
        return;
      }
      if (!this.Order_PlanfromEdit.hospitalMemberId) {
        this.$message({
          type: 'error',
          message: '请选择医疗机构',
        });
        return;
      }
      const regExp = /^\d{8}$/;
      if (regExp.test(this.Order_PlanfromEdit.number) === false ||
        isNaN(Number(this.Order_PlanfromEdit.number))) {
        this.$message({
          type: 'error',
          message: '发票号为8位有效数字',
        });
        return;
      }
      if (this.Order_PlanfromEdit.code) {
        const regExpt = /^([0-9]\d{9,11})$/;
        if (regExpt.test(this.Order_PlanfromEdit.code) === false ||
          isNaN(Number(this.Order_PlanfromEdit.code))) {
          this.$message({
            type: 'error',
            message: '发票代码为10~12位的有效数字',
          });
          return;
        }
      }
      if (this.Order_PlanfromEdit.discountAmount) {
        const regExpt = /^\d+$|^\d+\.\d+$/;
        if (regExpt.test(this.Order_PlanfromEdit.discountAmount) === false ||
          isNaN(Number(this.Order_PlanfromEdit.discountAmount))) {
          this.$message({
            type: 'error',
            message: '票折金额必须为正数',
          });
          return;
        }
      }
      if (this.Order_PlanfromEdit.discountAmount > this.Order_purchaseAmount) {
        this.$message({
          type: 'error',
          message: '票折金额不能大于总含税金额',
        });
        return;
      }
      if (this.Order_purchaseAmount < 0) {
        this.$message({
          type: 'error',
          message: '发票金额不可小于0！',
        });
        return;
      }
      if (typeof this.$route.query.id === 'undefined') {
        // console.log();
        datelist = Object.assign(this.Order_PlanDateList);
        for (let i = 0; i < datelist.length; i += 1) {
          datelist[i].invoicedNum = datelist[i].purchaseNum;
          datelist[i].drugsNum = datelist[i].invoicedNoNum;
          // datelist[i].drugsId = datelist[i].ids;
          datelist[i].drugsAmount = datelist[i].hospitalUnitPrice;
          if (datelist[i].purchaseNum === '' || datelist[i].purchaseNum === null || Number(datelist[i].purchaseNum) === 0) {
            this.$message({
              type: 'error',
              message: '数量不能为空或为0',
            });
            return;
          }
          if (datelist[i].purchaseNum > datelist[i].invoicedNoNum) {
            this.$message({
              type: 'error',
              message: '可开票数量不足',
            });
            return;
          }
        }
        this.loading = true;
        // console.log();
        const info = this.Order_PlanfromEdit.hospitalMemberName.split('&');
        const MemberName = !info[5] || info[5] === 'null' ? '' : info[5];
        const from = {
          gpoMemberId: this.getGpoId,
          code: this.Order_PlanfromEdit.code,
          discountAmount: this.Order_PlanfromEdit.discountAmount,
          deliveryMemberCode: this.Order_PlanfromEdit.deliveryMemberCode,
          deliveryMemberId: this.Order_PlanfromEdit.deliveryMemberId,
          deliveryMemberName: this.Order_PlanfromEdit.deliveryMemberName,
          deliveryPerson: this.Order_PlanfromEdit.deliveryPerson,
          deliveryPhone: this.Order_PlanfromEdit.deliveryPhone,
          gpoMemberName: this.Order_PlanfromEdit.gpoMemberName,
          hospitalMemberCode: this.Order_PlanfromEdit.hospitalMemberCode,
          hospitalMemberId: this.Order_PlanfromEdit.hospitalMemberId,
          hospitalMemberName: MemberName,
          ifCrossOrder: this.Order_PlanfromEdit.ifCrossOrder,
          id: 0,
          ifUpload: 0,
          invoiceStatus: 0,
          invoiceType: this.Order_PlanfromEdit.invoiceType,
          number: this.Order_PlanfromEdit.number,
          remarks: this.Order_PlanfromEdit.remarks,
          scanFile: this.Order_PlanfromEdit.scanFile,
          taxesAmount: this.Order_PlanfromEdit.AmountMoney,
          arr: datelist,
        };
        InvoiceList.submitCreate(from).then((res) => {
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
      } else {
        datelist = Object.assign(this.Order_PlanItemList);
        for (let i = 0; i < datelist.length; i += 1) {
          datelist[i].invoicedNum = datelist[i].purchaseNum;
          // datelist[i].drugsId = datelist[i].ids;
          datelist[i].drugsNum = datelist[i].invoicedNoNum;
          if (datelist[i].purchaseNum === '' || datelist[i].purchaseNum === null || Number(datelist[i].purchaseNum) === 0) {
            this.$message({
              type: 'error',
              message: '数量不能为空或为0',
            });
            return;
          }
          if (datelist[i].purchaseNum > datelist[i].invoicedNoNum) {
            this.$message({
              type: 'error',
              message: '可开票数量不足',
            });
            return;
          }
        }
        this.loading = true;
        const info = this.Order_PlanfromEdit.hospitalMemberName.split('&');
        const MemberName = !info[5] || info[5] === 'null' ? '' : info[5];
        const from = {
          gpoMemberId: this.getGpoId,
          code: this.Order_PlanfromEdit.code,
          discountAmount: this.Order_PlanfromEdit.discountAmount,
          deliveryMemberCode: this.Order_PlanfromEdit.deliveryMemberCode,
          deliveryMemberId: this.Order_PlanfromEdit.deliveryMemberId,
          deliveryMemberName: this.Order_PlanfromEdit.deliveryMemberName,
          deliveryPerson: this.Order_PlanfromEdit.deliveryPerson,
          deliveryPhone: this.Order_PlanfromEdit.deliveryPhone,
          gpoMemberName: this.Order_PlanfromEdit.gpoMemberName,
          hospitalMemberCode: this.Order_PlanfromEdit.hospitalMemberCode,
          hospitalMemberId: this.Order_PlanfromEdit.hospitalMemberId,
          hospitalMemberName: MemberName,
          ifCrossOrder: this.Order_PlanfromEdit.ifCrossOrder,
          id: this.$route.query.id,
          ifUpload: 0,
          invoiceStatus: 0,
          invoiceType: this.Order_PlanfromEdit.invoiceType,
          number: this.Order_PlanfromEdit.number,
          remarks: this.Order_PlanfromEdit.remarks,
          scanFile: this.Order_PlanfromEdit.scanFile,
          taxesAmount: this.Order_PlanfromEdit.AmountMoney,
          arr: datelist,
        };
        // console.log();
        InvoiceList.submitUpdate(from).then((res) => {
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
      }
    },
    orderSave() { // 保存按钮触发事件
      this.$confirm('此操作将保存该数据，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let datelist = [];
        if (!this.Order_PlanfromEdit.code) {
          this.$message({
            type: 'error',
            message: '请输入发票代码',
          });
          return;
        }
        // console.log();
        if (!this.Order_PlanfromEdit.number) {
          this.$message({
            type: 'error',
            message: '请输入发票号',
          });
          return;
        }
        // console.log();
        if (this.Order_PlanfromEdit.invoiceType !== 0
          && this.Order_PlanfromEdit.invoiceType !== 1
          && this.Order_PlanfromEdit.invoiceType !== 2) {
          this.$message({
            type: 'error',
            message: '请选择发票类型',
          });
          return;
        }
        if (!this.Order_PlanfromEdit.hospitalMemberId) {
          this.$message({
            type: 'error',
            message: '请选择医疗机构',
          });
          return;
        }
        const regExp = /^\d{8}$/;
        if (regExp.test(this.Order_PlanfromEdit.number) === false ||
          isNaN(Number(this.Order_PlanfromEdit.number))) {
          this.$message({
            type: 'error',
            message: '发票号为8位有效数字',
          });
          return;
        }
        if (this.Order_PlanfromEdit.code) {
          const regExpt = /^([0-9]\d{9,11})$/;
          if (regExpt.test(this.Order_PlanfromEdit.code) === false ||
            isNaN(Number(this.Order_PlanfromEdit.code))) {
            this.$message({
              type: 'error',
              message: '发票代码为10~12位的有效数字',
            });
            return;
          }
        }
        if (this.Order_PlanfromEdit.discountAmount) {
          const regExpt = /^\d+$|^\d+\.\d+$/;
          if (regExpt.test(this.Order_PlanfromEdit.discountAmount) === false ||
            isNaN(Number(this.Order_PlanfromEdit.discountAmount))) {
            this.$message({
              type: 'error',
              message: '票折金额必须为正数',
            });
            return;
          }
        }
        if (this.Order_PlanfromEdit.discountAmount > this.Order_purchaseAmount) {
          this.$message({
            type: 'error',
            message: '票折金额不能大于总含税金额',
          });
          return;
        }
        if (this.Order_purchaseAmount < 0) {
          this.$message({
            type: 'error',
            message: '发票金额不可小于0！',
          });
          return;
        }
        if (typeof this.$route.query.id === 'undefined') {
          // console.log();
          datelist = Object.assign(this.Order_PlanDateList);
          for (let i = 0; i < datelist.length; i += 1) {
            datelist[i].invoicedNum = datelist[i].purchaseNum;
            datelist[i].drugsNum = datelist[i].invoicedNoNum;
            // datelist[i].drugsId = datelist[i].ids;
            datelist[i].drugsAmount = datelist[i].hospitalUnitPrice;
            if (datelist[i].purchaseNum === '' || datelist[i].purchaseNum === null || Number(datelist[i].purchaseNum) === 0) {
              this.$message({
                type: 'error',
                message: '数量不能为空或为0',
              });
              return;
            }
            if (datelist[i].purchaseNum > datelist[i].invoicedNoNum) {
              this.$message({
                type: 'error',
                message: '可开票数量不足',
              });
              return;
            }
          }
          this.loading = true;
          // console.log();
          const info = this.Order_PlanfromEdit.hospitalMemberName.split('&');
          const MemberName = !info[5] || info[5] === 'null' ? '' : info[5];
          const from = {
            gpoMemberId: this.getGpoId,
            code: this.Order_PlanfromEdit.code,
            discountAmount: this.Order_PlanfromEdit.discountAmount,
            deliveryMemberCode: this.Order_PlanfromEdit.deliveryMemberCode,
            deliveryMemberId: this.Order_PlanfromEdit.deliveryMemberId,
            deliveryMemberName: this.Order_PlanfromEdit.deliveryMemberName,
            deliveryPerson: this.Order_PlanfromEdit.deliveryPerson,
            deliveryPhone: this.Order_PlanfromEdit.deliveryPhone,
            gpoMemberName: this.Order_PlanfromEdit.gpoMemberName,
            hospitalMemberCode: this.Order_PlanfromEdit.hospitalMemberCode,
            hospitalMemberId: this.Order_PlanfromEdit.hospitalMemberId,
            hospitalMemberName: MemberName,
            ifCrossOrder: this.Order_PlanfromEdit.ifCrossOrder,
            id: 0,
            ifUpload: 0,
            invoiceStatus: 0,
            invoiceType: this.Order_PlanfromEdit.invoiceType,
            number: this.Order_PlanfromEdit.number,
            remarks: this.Order_PlanfromEdit.remarks,
            scanFile: this.Order_PlanfromEdit.scanFile,
            taxesAmount: this.Order_PlanfromEdit.AmountMoney,
            arr: datelist,
          };
          InvoiceList.keepCreate(from).then((res) => {
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
          datelist = Object.assign(this.Order_PlanItemList);
          for (let i = 0; i < datelist.length; i += 1) {
            datelist[i].invoicedNum = datelist[i].purchaseNum;
            // datelist[i].drugsId = datelist[i].ids;
            datelist[i].drugsNum = datelist[i].invoicedNoNum;
            if (datelist[i].purchaseNum === '' || datelist[i].purchaseNum === null || Number(datelist[i].purchaseNum) === 0) {
              this.$message({
                type: 'error',
                message: '数量不能为空或为0',
              });
              return;
            }
            if (datelist[i].purchaseNum > datelist[i].invoicedNoNum) {
              this.$message({
                type: 'error',
                message: '可开票数量不足',
              });
              return;
            }
          }
          this.loading = true;
          const info = this.Order_PlanfromEdit.hospitalMemberName.split('&');
          const MemberName = !info[5] || info[5] === 'null' ? '' : info[5];
          const from = {
            gpoMemberId: this.getGpoId,
            code: this.Order_PlanfromEdit.code,
            discountAmount: this.Order_PlanfromEdit.discountAmount,
            deliveryMemberCode: this.Order_PlanfromEdit.deliveryMemberCode,
            deliveryMemberId: this.Order_PlanfromEdit.deliveryMemberId,
            deliveryMemberName: this.Order_PlanfromEdit.deliveryMemberName,
            deliveryPerson: this.Order_PlanfromEdit.deliveryPerson,
            deliveryPhone: this.Order_PlanfromEdit.deliveryPhone,
            gpoMemberName: this.Order_PlanfromEdit.gpoMemberName,
            hospitalMemberCode: this.Order_PlanfromEdit.hospitalMemberCode,
            hospitalMemberId: this.Order_PlanfromEdit.hospitalMemberId,
            hospitalMemberName: MemberName,
            ifCrossOrder: this.Order_PlanfromEdit.ifCrossOrder,
            id: this.$route.query.id,
            ifUpload: 0,
            invoiceStatus: 0,
            invoiceType: this.Order_PlanfromEdit.invoiceType,
            number: this.Order_PlanfromEdit.number,
            remarks: this.Order_PlanfromEdit.remarks,
            scanFile: this.Order_PlanfromEdit.scanFile,
            taxesAmount: this.Order_PlanfromEdit.AmountMoney,
            arr: datelist,
          };
          // console.log();
          InvoiceList.keepUpdate(from).then((res) => {
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    orderDelete() { // 删除按钮触发事件
      InvoiceList.destory(this.$route.query.id).then((res) => {
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
    dataPageDo() { // 新增点击时触发事件
      this.$router.push({ path: '/Invoice/InvoiceList/Creat' });
    },
    orderBack() { // 返回按钮触发事件
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
      'TableHeightRun',
    ]),
  },
  watch: {
    authList() {
      this.authbtn = InvoiceList.authbtn();
      // console.log();
    },
    $route(to, from) {
      if (to.path === '/Invoice/InvoiceList/Edit') { // 如果去详情页面计算表格高度
        // console.log();
        this.$store.commit('BreadCrumb_Update', [
          {
            path: '/index',
            name: this.$store.state.view.resourcesNow.name,
          },
          {
            path: '/Invoice',
            name: '发票管理',
            noLink: true,
          },
          {
            path: '/Invoice/InvoiceList',
            name: '发票列表',
            noLink: true,
          },
          {
            path: '/Invoice/InvoiceList/Edit',
            name: '发票列表编辑',
            noLink: true,
          },
        ]);
        //  初始化按钮
        this.isConfirmInvoiceShow = false;
        this.isObsoleteShow = false;
        this.isSaveShow = false;
        this.isSubmitShow = false;
        this.isPrintShow = false;
        // console.log();
        if (this.View_UserInfo.memberType === 2 && this.$route.query.invoiceStatus === 0) {
          this.isSaveShow = true;
          this.isSubmitShow = true;
        } else if (this.View_UserInfo.memberType === 3 && this.$route.query.invoiceStatus === 3) {
          this.isConfirmInvoiceShow = true;
        } else if (this.View_UserInfo.memberType === 3 && this.$route.query.invoiceStatus === 1) {
          this.isObsoleteShow = true;
        }
        if (this.$route.query.invoiceStatus === 1 || this.$route.query.invoiceStatus === 2) {
          this.isPrintShow = true;
        } else {
          this.isPrintShow = false;
        }
        this.showPlan = false;
        this.showCheck = true;
        this.Initialize(); // 初始化数据
        this.$nextTick(() => {
          this.TableHeightRun(['#from-item', '.TradeFooter', 260]);
        });
      }
      if (to.path === '/Invoice/InvoiceList/Creat') { // 如果去新增页面计算表格高度
        this.$store.commit('BreadCrumb_Update', [
          {
            path: '/index',
            name: this.$store.state.view.resourcesNow.name,
          },
          {
            path: '/Invoice',
            name: '发票管理',
            noLink: true,
          },
          {
            path: '/Invoice/InvoiceList',
            name: '发票列表',
            noLink: true,
          },
          {
            path: '/Invoice/InvoiceList/Creat',
            name: '发票列表新增',
            noLink: true,
          },
        ]);
        this.isSaveShow = true;
        this.isSubmitShow = true;
        this.isPrintShow = false;
        this.showPlan = false;
        this.showCheck = true;
        this.Initialize(); // 初始化数据
        const itemList = {
          createBy: '',
          createTime: '',
          deliveryMemberName: this.View_UserInfor.name,
          deliveryPerson: this.View_UserInfor.contacter,
          deliveryPhone: this.View_UserInfor.phone,
          deliveryAllPerson: `${this.View_UserInfor.contacter || ''} ${this.View_UserInfor.phone || ''}`,
          deliveryMemberId: this.View_UserInfor.id,
          deliveryMemberCode: this.View_UserInfor.code,
          code: this.View_UserInfor.invoiceCode,
          discountAmount: '',
        };
        for (let i = 0; i < this.gpoOptions.length; i += 1) {
          if (this.gpoOptions[i].id === this.getGpoId) {
            this.$set(itemList, 'gpoMemberName', this.gpoOptions[i].name);
          }
        }
        this.ItemList(itemList);
        this.$nextTick(() => {
          this.TableHeightRun(['.el-form', '.TradeFooter', 200]);
        });
      }
      if (to.path === '/Invoice/InvoiceList') { // 如果去初始页面计算表格高度
        this.$store.commit('BreadCrumb_Update', [
          {
            path: '/index',
            name: this.$store.state.view.resourcesNow.name,
          },
          {
            path: '/Invoice',
            name: '发票管理',
            noLink: true,
          },
          {
            path: '/Invoice/InvoiceList',
            name: '发票列表',
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
    // console.log();
    if (this.View_UserInfo.memberType === 2) {
      this.ShowBtn.create = true;
    }
    if (this.$route.query.from !== 'index') {
      this.$router.push({ path: '/Invoice/InvoiceList' });
    }
    this.$nextTick(() => {
      this.TableHeightRun();
    });
    window.onresize = () => {
      if (this.$route.path === '/Invoice/InvoiceList') {
        this.TableHeightRun();
      } else if (this.$route.path === '/Invoice/InvoiceList/Creat') {
        this.TableHeightRun(['.el-form', '.TradeFooter', 260]);
      } else if (this.$route.path === '/Invoice/InvoiceList/Edit') {
        this.TableHeightRun(['#from-item', '.TradeFooter', 260]);
      }
    };
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Invoice',
        name: '发票管理',
        noLink: true,
      },
      {
        path: '/Invoice/InvoiceList',
        name: '发票列表',
        noLink: true,
      },
    ]);
  },
  activated() {
    this.ids = [];
    this.returnedMoneyIds = [];
    if (this.View_UserInfo.memberType === 3) {
      const a = [
        {
          value: 3,
          label: '待确认',
        },
        {
          value: 1,
          label: '已确认',
        },
        {
          value: 4,
          label: '已作废(医疗机构)',
        },
      ];
      this.$set(this.message[3], 'selects', a);
    }
    this.defaultAjax = 0; // 控制defaultAjax变化监听
    if (this.$route.query.from === 'index') {
      this.$set(this.message[3], 'defaults', 3);
      this.defaultAjax += 1; // 控制defaultAjax变化监听
    }
    this.authbtn = InvoiceList.authbtn();
    this.$bus.$on('data/page/do', this.dataPageDo); //  多按钮点击时候触发事件
    this.$bus.$on('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$on('batch/confirm', this.affirmChooseInvoice);  // 批量确认发票
    this.$bus.$on('returned/money', this.returnedMoney);  // 批量回款
    this.$bus.$on('cancelReturned/money', this.cancelReturnedMoney);  // 批量取消回款
    this.$bus.$on('affirmReturned/money', this.affirmReturnedMoney);  // 批量确认回款
    this.$bus.$on('cancelAffirmReturned/money', this.cancelAffirmReturnedMoney);  // 批量取消确认回款
  },
  deactivated() {
    this.$bus.$off('data/page/do', this.dataPageDo); //  多按钮点击时候触发事件
    this.$bus.$off('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$off('batch/confirm', this.affirmChooseInvoice);
    this.$bus.$off('returned/money', this.returnedMoney);
    this.$bus.$off('cancelReturned/money', this.cancelReturnedMoney);
    this.$bus.$off('affirmReturned/money', this.affirmReturnedMoney);
    this.$bus.$off('cancelAffirmReturned/money', this.cancelAffirmReturnedMoney);
  },
  data() {
    return {
      ids: [],
      returnedMoneyIds: [],
      returnedMoneyStatusArr: [],
      returnedStatusArr: [],
      invoiceStatusArr: [],
      authbtn: {},              //  识别用户拥有的权限
      defaultAjax: 0,
      loading: false,
      showPlan: true,
      showCheck: false,
      page: 1, // 当前页数
      size: 20, // 一页显示多少列
      total: 0, // 一共多少页
      isSaveShow: false, // 保存按钮
      isBackShow: true, // 返回按钮
      isSubmitShow: false, // 提交按钮
      isPrintShow: false, // 打印按钮
      isConfirmInvoiceShow: false, // 确认发票
      isObsoleteShow: false, // 作废发票
      ShowBtn: { // 按钮显示控制
        create: false,
        batchConfirm: true,
        returnedMoney: true,
        cancelReturnedMoney: true,
        affirmReturnedMoney: true,
        cancelAffirmReturnedMoney: true,
      },
      message: [
        {
          key: 'number',
          label: '发票号',
          placeholder: '请输入发票号',
          type: 0,
          selects: [],
        },
        {
          key: 'deliveryMemberName',
          label: '配送企业',
          placeholder: '请输入配送企业',
          type: 0,
          selects: [],
        },
        {
          key: 'hospitalMemberName',
          label: '医疗机构',
          placeholder: '请输入医疗机构',
          type: 0,
          selects: [],
        },
        {
          key: 'invoiceStatus',
          label: '发票状态',
          type: 1,
          selects: [
            {
              value: 0,
              label: '待提交',
            },
            {
              value: 3,
              label: '待确认',
            },
            {
              value: 1,
              label: '已确认',
            },
            {
              value: 2,
              label: '已作废(配送企业)',
            },
            {
              value: 4,
              label: '已作废(医疗机构)',
            },
          ],
        },
        {
          key: 'invoiceType',
          label: '发票类型',
          type: 1,
          selects: [
            {
              value: 1,
              label: '普通发票',
            },
            {
              value: 0,
              label: '冲红发票',
            },
            {
              value: 2,
              label: '冲红发票(拒收)',
            },
          ],
        },
        {
          key: 'ifUpload',
          label: '是否已上传',
          type: 1,
          selects: [
            {
              value: 1,
              label: '是',
            },
            {
              value: 0,
              label: '否',
            },
          ],
        },
        {
          key: 'code',
          label: '发票代码',
          placeholder: '请输入发票代码',
          type: 0,
          selects: [],
        },
        {
          type: 9,  // 类型
          key: 'invoiceDate',
          label: '开票日期',
          shortcuts: true,  // 是否开启快捷选择
          defaultDate: true,  // 是否进来默认为一个月
        },
        {
          key: 'returned',
          label: '是否回款',
          type: 1,
          selects: [
            {
              value: 1,
              label: '是',
            },
            {
              value: 0,
              label: '否',
            },
          ],
        },
        {
          type: 9,  // 类型
          key: 'returnedTime',
          label: '回款日期',
          shortcuts: true,  // 是否开启快捷选择
          defaultDate: false,  // 是否进来默认为一个月
        },
        {
          key: 'affirmReturned',
          label: '配送企业确认',
          type: 1,
          selects: [
            {
              value: 1,
              label: '是',
            },
            {
              value: 0,
              label: '否',
            },
          ],
        },
        {
          key: 'noOut',
          label: '外部发票编号',
          placeholder: '请输入外部发票编号',
          type: 0,
          selects: [],
        },
      ],
    };
  },
};
</script>
