<template>
  <div>
    <DialogForm :dialog-form-visible="dialogFormShow" @close-dialog="CloseDialog" @dialog-cancel="dialogCancel" :message="editMessage" :from-dialog="form" :isReadonly="false" :isSaveShow="isSaveShow" :saveLoading="saveLoading" @data-save="dataSave">

      <el-form-item label="协议单价" prop="protocolPrice" slot='protocolPrice' label-width="115px">
        <el-input v-model="form.protocolPrice"></el-input>
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
import DrugsUsablePrice from '../../../api/Deliverrelation/DrugsUsablePrice';

export default {
  activated() {
    this.$bus.$on('changePrice/dialog', this.changeprice);
  },
  deactivated() {
    this.$bus.$off('changePrice/dialog', this.changeprice);
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
        drugsId: null,
        protocolPrice: null,
        gpoMemberId: null,
        projectId: null,
        deliveryMemberId: null,
      },
      editMessage: {
        //  弹框标题
        dialogTitle: '修改协议单价',
        // 写入表单组建的数据
        selects: [
          { value: 'protocolPrice', type: 'custom' },
        ],
        options: {},
        checkbox: {},
        radios: {},
        rules: {
          protocolPrice: [
            { required: true, message: '请输入类型为数字的协议单价', trigger: 'blur', validator: window.validator.verifyNumber },
          ],
        },
        styleObject: {},
      },
    };
  },
  methods: {
    // 点击保存后的触发事件
    dataSave(formName) {
      // this.saveLoading = true;      // 保存按钮loading开启
      // console.log();
      DrugsUsablePrice.update(this.form.gpoMemberId, this.form.projectId, this.form.drugsId,
        this.form.deliveryMemberId, this.form.protocolPrice).then((res) => {
          // console.log();
          // console.log();
          if (res.data.code === 0) {
            this.$bus.$emit('data/list');
            this.$message({
              type: 'success',
              message: '修改成功',
            });
            this.$emit('show-edit', false);
          }
        });
    },
    // 点击修改价格触发事件
    changeprice(row) {
      this.dialogFormShow = true;   // 打开弹出框
      // console.log();
      this.form = {
        drugsId: row.drugsId,
        protocolPrice: row.protocolPrice,
        deliveryMemberId: row.deliveryMemberId,
        projectId: row.projectId,
        gpoMemberId: row.gpoMemberId,
      };
      this.form.protocolPrice = this.form.protocolPrice.toFixed(4);
      // DrugsUsablePrice.item(row.id).then((res) => {
      //   // console.log();
      //   if (res.data.code === 0) {
      //     const data = res.data.result;
      //     this.form = Object.assign({}, this.form, {
      //       drugsId: data.result.drugsId,
      //       protocolPrice: data.result.protocolPrice,
      //       deliveryMemberId: data.result.deliveryMemberId,
      //       projectId: data.result.projectId,
      //       gpoMemberId: data.result.gpoMemberId,
      //     });
      //   }
      // });
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
