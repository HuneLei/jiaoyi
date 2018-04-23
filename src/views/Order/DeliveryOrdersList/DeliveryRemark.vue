<template>
  <div>
    <DialogForm :dialog-form-visible="dialogFormShow" @close-dialog="CloseDialog" @dialog-cancel="dialogCancel" :message="editMessage" :from-dialog="form" :isReadonly="false" :isSaveShow="isSaveShow" :saveLoading="saveLoading" @data-save="dataSave">

      <el-form-item label="配送商备注" prop="remark" slot='remark' label-width="115px">
        <el-input v-model="form.remark" type="textarea"></el-input>
      </el-form-item>
    </DialogForm>
  </div>
</template>
<script>
/**
 * Created by yaoling on 2017/9/11.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */

import DialogForm from '../../../components/DialogForm'; // 表单弹出框
import DeliveryOrdersList from '../../../api/Order/DeliveryOrdersList';

export default {
  activated() {
    this.$bus.$on('order/deliveryRemark', this.getRemark);
  },
  deactivated() {
    this.$bus.$off('corder/deliveryRemark', this.getRemark);
  },
  components: {
    DialogForm,
  },
  data() {
    return {
      dialogFormShow: false, // 弹出框显示隐藏控制
      isSaveShow: true,           // 保存按钮显示控制
      saveLoading: false,         // 保存按钮loading显示控制
      form: {
        remark: null,
      },
      editMessage: {
        //  弹框标题
        dialogTitle: '配送商备注',
        // 写入表单组建的数据
        selects: [
          { value: 'remark', type: 'custom' },
        ],
        options: {},
        checkbox: {},
        radios: {},
        rules: {
          remark: [
            { required: true, message: '请填写配送商备注', trigger: 'blur', validator: window.validator.dialogInput },
            { max: 256, message: '不得超过256位字符' },
          ],
        },
        styleObject: {},
      },
    };
  },
  methods: {
    // 点击保存后的触发事件
    dataSave(formName) {
      const form = {
        deliveryRemarks: this.form.remark,
        ordersId: this.$route.query.id,
      };
      DeliveryOrdersList.remarkTrade(form).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功',
          });
          this.$bus.$emit('data/list');
          history.back();
        }
      });
    },
    // 点击修改价格触发事件
    getRemark(row) {
      this.dialogFormShow = true;   // 打开弹出框
      if (this.$route.query.id) {
        DeliveryOrdersList.item(this.$route.query.id)
          .then((res) => {
            // console.log();
            if (res.data.code === 0) {
              const data = res.data.result;
              this.form = Object.assign({}, this.form, {
                remark: data.deliveryRemarks,
              });
            }
          });
      }
    },
    // 点击取消后的触发事件
    dialogCancel(res) {
      this.dialogFormShow = false;
      // console.log();
    },
    // 关闭窗口后的触发事件
    CloseDialog() {
      // console.log();
      this.dialogFormShow = false;
    },
  },
};
</script>
