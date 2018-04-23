<template>
  <div class="tradeFooter">
    <div v-if="increased" class="tradeButton">
      <el-button name="saveTrade" v-if="authbtn.saveTrade" type="primary" size="small" v-show="isSaveShow" @click="orderSave" :disabled="!btnDisabled.planSave" class="page_btn">
        <i class="icon iconfont icon-baocun"></i>保存
      </el-button>
      <el-button name="submitTrade" v-if="authbtn.submitTrade" type="primary" size="small" v-show="isSubmitShow" @click="orderSubmit" :disabled="!btnDisabled.planSubmit" class="page_btn">
        <i class="icon iconfont icon-tijiao"></i>提交
      </el-button>
      <el-button name="cancelTrade" v-if="authbtn.cancelTrade" type="warning" size="small" v-show="isCancelShows" @click="contractCancel" :disabled="!btnDisabled.planCancel" class="page_btn">
        <i class="icon iconfont icon-jujue"></i>取消合同
      </el-button>
      <el-button name="refuseTrade" v-if="authbtn.refuseTrade" type="warning" size="small" v-show="isRefuseShow" @click="orderRefuse" :disabled="!btnDisabled.planRefuse" class="page_btn">
        <i class="icon iconfont icon-jujue"></i>拒绝合同
      </el-button>
      <el-button name="lookTrade" v-if="authbtn.lookTrade" type="primary" size="small" v-show="isLookShow" @click="orderLook" :disabled="!btnDisabled.planLook" class="page_btn">
        <i class="icon iconfont icon-chakan"></i>查看已生成合同
      </el-button>
      <el-button name="copyTrade" v-if="authbtn.copyTrade" type="primary" size="small" v-show="isCopyShow" @click="orderCopy" :disabled="!btnDisabled.planCopy" class="page_btn">
        <i class="icon iconfont icon-fuzhi"></i>复制
      </el-button>
      <el-button name="createTrade" v-if="authbtn.createTrade" type="primary" size="small" v-show="isCreateShow" @click="orderCreate" :disabled="!btnDisabled.planCreate" class="page_btn">
        <i class="icon iconfont icon-tijiao"></i>生成订单
      </el-button>
      <el-button name="applyTrade" v-if="authbtn.applyTrade" type="primary" size="small" v-show="isApplyShow" @click="orderApply" :disabled="!btnDisabled.planApply" class="page_btn">
        <i class="icon iconfont icon-baocun"></i>申请结案
      </el-button>
      <el-button name="remarkTrade" v-if="authbtn.remarkTrade" type="primary" size="small" v-show="isRemarkShow" @click="orderRemark" class="page_btn">
        <i class="icon iconfont icon-baocun"></i>备注
      </el-button>
      <el-button name="confirmTrade" v-if="authbtn.confirmTrade" type="primary" size="small" v-show="isConfirmShow" @click="orderConfirm" :disabled="!btnDisabled.planConfirm" class="page_btn">
        <i class="icon iconfont icon-right_circle"></i>确认订单
      </el-button>
      <el-button name="deliveryTrade" v-if="authbtn.deliveryTrade" type="primary" size="small" v-show="isDeliveryShow" @click="orderDelivery" :disabled="!btnDisabled.planDelivery" class="page_btn">
        <i class="icon iconfont icon-shenhetongguo"></i>发货-货票同行
      </el-button>
      <el-button name="returnsTrade" v-if="authbtn.returnsTrade" type="primary" size="small" v-show="isReturnShow" @click="orderReturn" :disabled="!btnDisabled.planReturn" class="page_btn">
        <i class="icon iconfont icon-shenhetongguo1"></i>同意退货
      </el-button>
      <el-button name="notreturnsTrade" v-if="authbtn.notreturnsTrade" type="warning" size="small" v-show="isNotReturnsShow" @click="orderNotReturns" :disabled="!btnDisabled.planNotReturns" class="page_btn">
        <i class="icon iconfont icon-shenhebutongguo"></i>拒绝退货
      </el-button>
      <el-button name="reagreeTrade" v-if="authbtn.reagreeTrade" type="primary" size="small" v-show="isReAgreeShow" @click="orderReAgree" :disabled="!btnDisabled.planReAgree" class="page_btn">
        <i class="icon iconfont icon-shenhetongguo1"></i>同意
      </el-button>
      <el-button name="noreagreeTrade" v-if="authbtn.noreagreeTrade" type="warning" size="small" v-show="isNoReAgreeShow" @click="orderNoReAgree" :disabled="!btnDisabled.planNoReAgree" class="page_btn">
        <i class="icon iconfont icon-shenhebutongguo"></i>不同意
      </el-button>
      <el-button name="confirmInvoiceTrade" v-if="authbtn.confirmInvoiceTrade" type="warning" size="small" v-show="isConfirmInvoiceShow" @click="invoiceConfirm" :disabled="!btnDisabled.confirmInvoice" class="page_btn">
        <i class="icon iconfont icon-shenhebutongguo"></i>确认发票
      </el-button>
      <el-button name="notdeliveryTrade" v-if="authbtn.notdeliveryTrade" type="warning" size="small" v-show="isNotDeliveryShow" @click="orderNotDelivery" :disabled="!btnDisabled.planNotDelivery" class="page_btn">
        <i class="icon iconfont icon-shenhetongguo"></i>发货-非货票同行
      </el-button>
      <el-button name="isPrintShow" type="warning" size="small" v-show="isPrintShow" @click="orderPrint" :disabled="!btnDisabled.planPrint" class="page_btn">
        <i class="fa  fa-file-image-o"></i>打印发票
      </el-button>
      <el-button name="deliverPrint" v-if="authbtn.deliverPrint" type="warning" size="small" v-show="isDeliverPrintShow" @click="orderDeliverPrint" :disabled="!btnDisabled.planDeliverPrint" class="page_btn">
        <i class="fa  fa-file-image-o"></i>打印配送单
      </el-button>
      <el-button name="orderConfirmPrint" v-if="authbtn.orderConfirmPrint" type="warning" size="small" v-show="isOrderConfirmPrintShow" @click="deliveryOrderConfirmPrint" :disabled="!btnDisabled.planOrderConfirmPrint" class="page_btn">
        <i class="fa  fa-file-image-o"></i>打印并确认
      </el-button>
      <el-button name="deliveryorderPrint" v-if="authbtn.deliveryorderPrint" type="warning" size="small" v-show="isOrderPrintShow" @click="deliveryOrderPrint" :disabled="!btnDisabled.planOrderPrint" class="page_btn">
        <i class="fa  fa-file-image-o"></i>打印
      </el-button>
      <el-button name="backout" v-if="authbtn.backout" type="danger" size="small" v-show="isBackoutShow" @click="orderBackout" :disabled="!btnDisabled.planBackout" class="page_btn">
        <i class="icon iconfont icon-work-exam-back"></i>撤销
      </el-button>
      <el-button name="obsolete" v-if="authbtn.obsolete" type="danger" size="small" v-show="isObsoleteShow" @click="orderObsolete" :disabled="!btnDisabled.planObsolete" class="page_btn">
        <i class="icon iconfont icon-delete"></i>作废
      </el-button>
      <el-button name="cancelTrade" v-if="authbtn.cancelTrade" type="warning" size="small" v-show="isCancelShow" @click="orderCancel" :disabled="!btnDisabled.planCancel" class="page_btn">
        <i class="icon iconfont icon-jujue"></i>取消订单
      </el-button>
      <el-button name="destoryTrade" v-if="authbtn.destoryTrade" type="danger" size="small" v-show="isDeleteShow" @click="orderDelete" :disabled="!btnDisabled.planDelete" class="page_btn">
        <i class="icon iconfont icon-delete"></i>删除
      </el-button>
      <el-button name="removeTrade" v-if="authbtn.removeTrade" type="danger" size="small" v-show="isRemoveShow" @click="orderRemove" :disabled="!btnDisabled.planRemove" class="page_btn">
        <i class="icon iconfont icon-delete"></i>删除结案
      </el-button>
      <el-button name="agreeTrade" v-if="authbtn.agreeTrade" type="primary" size="small" v-show="isAgreeShow" @click="orderAgree" :disabled="!btnDisabled.planAgree" class="page_btn">
        <i class="icon iconfont icon-shenhetongguo1"></i>同意
      </el-button>
      <el-button name="noagreeTrade" v-if="authbtn.noagreeTrade" type="warning" size="small" v-show="isNoAgreeShow" @click="orderNoAgree" :disabled="!btnDisabled.planNoAgree" class="page_btn">
        <i class="icon iconfont icon-shenhebutongguo"></i>不同意
      </el-button>
      <el-button name="fileSeal" v-if="authbtn.fileSeal" type="primary" v-show="isContractSignature" size="small" @click="contractSignature" :disabled="!btnDisabled.planContract" class="page_btn">
        <i class="icon iconfont icon-qianzhang"></i>合同签章
      </el-button>
      <el-button name="audit" v-if="authbtn.audit" type="primary" size="small" v-show="isDeliveryAgreeShow" @click="deliveryAgree" :disabled="!btnDisabled.deliveryAgree" class="page_btn">
        <i class="icon iconfont icon-shenhetongguo1"></i>同意
      </el-button>
      <el-button name="audit" v-if="authbtn.audit" type="warning" size="small" v-show="isNoDeliveryAgreeShow" @click="deliveryNoAgree" :disabled="!btnDisabled.noDeliveryAgree" class="page_btn">
        <i class="icon iconfont icon-shenhebutongguo"></i>不同意
      </el-button>
      <el-button name="isBackShow" v-show="isBackShow" size="small" @click="orderBack" :disabled="!btnDisabled.planBack" class="page_btn">
        <i class="icon iconfont icon-fanhui"></i>返回
      </el-button>
    </div>
    <div style="height: 0.25rem;"></div>
  </div>
</template>

<script>
/**
 * Created by yaoling on 2017/9/3.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
export default {
  activated() {
    this.$bus.$on('data/tradefoot', this.tradefoot);
  },
  deactivated() {
    this.$bus.$off('data/tradefoot', this.tradefoot);
  },
  data() {
    return {
      tradeWidth: 200,
      increased: true,
      dataSelected: [],
      btnDisabled: {
        planCreate: true,
        planSave: true,
        planCopy: true,
        planLook: true,
        planDelete: true,
        planSubmit: true,
        planBack: true,
        planApply: true,
        planPrint: true,
        planRemove: true,
        planCancel: true,
        planRefuse: true,
        planConfirm: true,
        planDelivery: true,
        planNoAgree: true,
        planAgree: true,
        planReturn: true,
        planReAgree: true,
        planNoReAgree: true,
        planNotReturns: true,
        planNotDelivery: true,
        confirmInvoice: true,
        planDeliverPrint: true,
        planOrderPrint: true,
        planOrderConfirmPrint: true,
        planBackout: true,
        planObsolete: true,
        isContractSignature: true,
        planContract: true,
        deliveryAgree: true,
        noDeliveryAgree: true,
      },
    };
  },
  props: {
    page: {
      type: Number,
      default: 0,
    },
    size: {
      type: Number,
      default: 15,
    },
    total: {
      type: Number,
      default: 0,
    },
    isCreateShow: false,  // 生成订单按钮控制
    isSaveShow: false,  // 保存按钮控制
    isCopyShow: false,  // 复制按钮控制
    isLookShow: false,  // 查看按钮控制
    isDeleteShow: false, // 删除按钮控制
    isRemoveShow: false, // 删除结案控制
    isRemarkShow: false,
    isApplyShow: false, // 申请结案控制
    isAgreeShow: false, // 同意按钮控制
    isNoAgreeShow: false, // 不同意按钮控制
    isNoDeliveryAgreeShow: false, // 同意按钮控制
    isDeliveryAgreeShow: false, // 不同意按钮控制
    isPrintShow: false, // 打印按钮控制
    isSubmitShow: false, // 提交按钮控制
    isCancelShow: false, // 取消订单按钮控制
    isCancelShows: false, // 取消合同按钮控制
    isRefuseShow: false, // 拒绝合同按钮控制
    isConfirmShow: false, // 确认订单按钮控制
    isDeliveryShow: false, // 货票同行按钮控制
    isNotDeliveryShow: false, // 非货票同行按钮控制
    isNotReturnsShow: false, // 拒绝退货按钮控制
    isReturnShow: false, // 同意退货按钮控制
    isReAgreeShow: false, // 同意退货按钮控制
    isNoReAgreeShow: false, // 不同意退货按钮控制
    isConfirmInvoiceShow: false, // 确认发票按钮
    isDeliverPrintShow: false, // 打印配送单按钮
    isOrderPrintShow: false, // 打印订单按钮
    isOrderConfirmPrintShow: false, // 打印并确认按钮
    isBackoutShow: false, // 撤销按钮
    isContractSignature: false, // 签章按钮
    isObsoleteShow: false, // 撤销按钮
    isBackShow: {    // 返回按钮控制
      default: true,
    },
    authbtn: {
      default() {
        return {
          agreeTrade: true, // 同意
          noagreeTrade: true, // 不同意
          createTrade: true, // 生成订单
          saveTrade: true, // 保存
          copyTrade: true, // 复制
          lookTrade: true, // 查看已生成合同
          destoryTrade: true, // 删除
          removeTrade: true, // 删除结案
          applyTrade: true, // 申请结案
          remarkTrade: true, // 备注按钮
          submitTrade: true, // 提交
          cancelsTrade: true, // 取消合同
          cancelTrade: true, // 取消订单
          refuseTrade: true, // 拒绝合同
          confirmTrade: true, // 确认订单
          deliveryTrade: true, // 发货-货票同行
          returnsTrade: true, // 同意退货
          reagreeTrade: true,  // 同意
          noreagreeTrade: true,  // 不同意
          notreturnsTrade: true, // 拒绝退货
          notdeliveryTrade: true, // 发货-非货票同行
          confirmInvoiceTrade: true, // 确认发票
          deliverPrint: true, // 打印配送单
          deliveryorderPrint: true, // 打印订单
          orderConfirmPrint: true, // 打印并确认
          backout: true, // 撤销
          obsolete: true, // 撤销
          fileSeal: true, // 撤销
          audit: true, // 审核
        };
      },
    },
  },
  methods: {
    //  返回操作
    orderBack() {
      this.$emit('order-back', this.dataSelected);
    },
    // 签章
    contractSignature() {
      this.$emit('contract-signture');
    },
    // 确认发票
    invoiceConfirm() {
      this.$confirm('确认发票吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$emit('invoice-confirm');
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 发货-货票同行
    orderDelivery() {
      this.$emit('order-delivery', this.dataSelected);
    },
    // 发货-非货票同行
    orderNotDelivery() {
      this.$emit('order-notdelivery', this.dataSelected);
    },
    // 同意退货
    orderReAgree() {
      const ret = '此操作将同意退货申请, 请填写备注';
      this.$prompt(ret, '同意退货申请', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        this.$emit('order-reagree', this.dataSelected, value);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 不同意退货
    orderNoReAgree() {
      this.$emit('order-noreturns', this.dataSelected);
    },
    // 不同意退货
    orderNotReturns() {
      this.$emit('order-notreturns', this.dataSelected);
    },
    // 同意退货
    orderReturn() {
      this.$emit('order-return', this.dataSelected);
    },
    //  申请结案
    orderApply() {
      this.$emit('order-apply', this.dataSelected);
    },
    //  填写备注
    orderRemark() {
      this.$emit('order-remark', this.dataSelected);
    },
    // 撤销
    orderBackout() {
      this.$confirm('确认撤销配送单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$emit('order-backout', this.dataSelected);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 作废
    orderObsolete() {
      this.$confirm('确认将此发票作废吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$emit('order-obsolete', this.dataSelected);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 确认订单
    orderConfirm() {
      this.$confirm('确认订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$emit('order-confirm', this.dataSelected);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 同意操作
    orderAgree() {
      const ret = '此操作将同意结案申请, 请填写备注';
      this.$prompt(ret, '同意结案申请', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        this.$emit('order-agree', this.dataSelected, value);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 不同意操作
    orderNoAgree() {
      const ret = '此操作将不同意结案申请, 请填写备注';
      this.$prompt(ret, '不同意结案申请', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        this.$emit('order-noagree', this.dataSelected, value);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 同意操作   补充配送
    deliveryAgree() {
      this.$confirm('确定同意吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$emit('delivery-agree', this.dataSelected);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 不同意操作
    deliveryNoAgree() {
      this.$confirm('确定拒绝吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$emit('delivery-noagree', this.dataSelected);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    //  打印
    orderPrint() {
      this.$confirm('确定要打印吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const oldhtml = window.document.body.innerHTML;
        this.$emit('order-print', oldhtml);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 打印配送单
    orderDeliverPrint() {
      const oldhtml = window.document.body.innerHTML;
      this.$emit('order-deliver-print', oldhtml);
    },
    // 打印订单
    deliveryOrderPrint() {
      const oldhtml = window.document.body.innerHTML;
      this.$emit('deliveryOrder-print', oldhtml);
    },
    // 打印并确认
    deliveryOrderConfirmPrint() {
      this.$confirm('确认打印并确认吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$emit('deliveryOrderConfirm-print', this.dataSelected);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
      // const oldhtml = window.document.body.innerHTML;
      // this.$emit('deliveryOrderConfirm-print', oldhtml);
    },
    //  生成订单
    orderCreate() {
      this.$confirm('确定要生成采购订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$emit('order-create', this.dataSelected);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    //  取消订单
    orderCancel() {
      const ret = '此操作将取消订单, 请填写取消原因';
      this.$prompt(ret, '取消订单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        this.$emit('order-cancel', this.dataSelected, value);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    //  取消合同
    contractCancel() {
      const ret = '此操作将取消合同, 请填写取消合同备注';
      this.$prompt(ret, '备注', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        this.$emit('contract-cancel', this.dataSelected, value);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    //  拒绝合同
    orderRefuse() {
      this.$emit('order-refuse', this.dataSelected);
      // const ret = '此操作将拒绝合同, 请填写拒绝原因';
      // this.$prompt(ret, '拒绝原因', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      // }).then(({ value }) => {
      //   this.$emit('order-refuse', this.dataSelected, value);
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消操作',
      //   });
      // });
    },
    // 批量删除
    orderDelete() {
      this.$confirm('此操作将删除该记录，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$emit('order-delete', this.dataSelected);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 删除结案
    orderRemove() {
      this.$confirm('此操作将删除该记录，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$emit('order-remove', this.dataSelected);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 提交
    orderSubmit() {
      this.$emit('data-submit', this.dataSelected);
    },
    // 批量保存
    orderSave() {
      this.$emit('order-save', this.dataSelected);
    },
    // 复制
    orderCopy() {
      this.$emit('order-copy', this.dataSelected);
    },
    // 查看
    orderLook() {
      this.$emit('order-look', this.dataSelected);
    },
    //  按钮控置灰
    tradefoot(btnDisabled) {
      Object.assign(this.btnDisabled, btnDisabled);
    },
    //  条目数切换
    handleSizeChange(size) {
      this.$bus.$emit('data/list', 0, size);
    },
    //  页码切换
    pageChange(val) {
      this.$bus.$emit('page/change', val - 1);
    },
  },
};
</script>

<style scoped>
.tradeFooter {
  text-align: center;
  margin-top: 0.2rem;
  /*position: absolute;*/
  bottom: 0;
  z-index: 10;
  width: 100%;
}

.tradeButton {
  margin: 0 auto;
}

.tradeFooter_left {
  margin-left: -10px;
}

.el-button {
  float: left;
  padding: 8px;
  margin-left: 10px;
}

.el-button i {
  margin-right: 2px;
}

.tradeFooter .el-button {
  float: none;
}
</style>
