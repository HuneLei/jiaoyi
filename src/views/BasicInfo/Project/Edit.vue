<template>
  <div>
    <DialogForm :dialog-form-visible="dialogFormShow" @close-dialog="CloseDialog" @dialog-confirm="dialogConfirm" @dialog-cancel="dialogCancel" :message="editMessage" :from-dialog="form" :isFormConfirm="true" :formConfirmLoading="formConfirmLoading">
    </DialogForm>
  </div>
</template>

<script>
/**
 * Created by lqy on 2017/9/4.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */

import DialogForm from '../../../components/DialogForm'; // 表单弹出框
import Project from '../../../api/BasicInfo/Project';   // api -- 医疗机构
import common from '../../../api/common';

export default {
  activated() {
    // 监听数据更新
    this.$bus.$on('data/update', this.dataUpdate);
  },
  deactivated() {
    // 移除监听数据更新
    this.$bus.$off('data/update', this.dataUpdate);
  },
  components: {
    DialogForm,
  },
  data() {
    return {
      formConfirmLoading: false,         // 保存按钮loading显示控制
      // 需要提交的字段
      form: {
        id: null,
        deliveryNum: null,
        contractMoudleType: null,
        paramValue: null,
      },
      dialogFormShow: false,      // 弹出框显示隐藏控制
      editMessage: {
        // 写入表单组件的数据
        selects: [
          { label: '合同模板类型', key: 'contractMoudleType', type: 'el-select', placeholder: '请选择合同模板类型', option: 'contractMoudleOption', noClearable: true },
          { label: '选配送数量上限', key: 'deliveryNum', type: 'el-input', placeholder: '请输入卖方选配送数量上限' },
        ],
        // 弹出框标题
        dialogTitle: '编辑',
        options: {
          contractMoudleOption: [],
        },
        // checkbox选项值
        checkbox: {},
        // radios选项值
        radios: {},
        // 验证规则
        rules: {
          contractMoudleType: [
            { required: true, validator: window.validator.dialogInput, message: '请选择合同模板类型', trigger: 'change, blur' },
          ],
          deliveryNum: [
            { required: false, message: '请输入整数类型的数字', validator: window.validator.verifyNumberOnlyz, trigger: 'blur' },
          ],
        },
        styleObject: {},
      },
    };
  },
  methods: {
    // 合同模板下拉
    getContractMoudle() {
      common.commonParameterKey('CONTRACTMODEL').then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          const contractMoudleOption = [];
          for (let i = 0; i < data.length; i += 1) {
            contractMoudleOption.push({
              value: data[i].id,
              label: data[i].paramValue,
            });
          }
          this.editMessage.options.contractMoudleOption = contractMoudleOption;
        }
      });
    },
    dataUpdate(row) {
      this.form = {};
      this.getContractMoudle();
      this.form = {
        id: Number(row.id),
        deliveryNum: row.deliveryLimitNum,
        contractMoudleType: row.contractMoudleType ? row.contractMoudleType : null,
        paramValue: row.paramValue,
      };
      this.dialogFormShow = true;             // 打开弹出框
    },
    dialogConfirm(formName) {
      this.formConfirmLoading = true;
      Project.numUpdate(this.form.id, this.form.deliveryNum, this.form.contractMoudleType)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '编辑成功',
            });
            this.$bus.$emit('data/list');
          }
          this.dialogFormShow = false;
        });
    },
    // 点击取消后的触发事件
    dialogCancel(res) {
      this.form = {};
      this.dialogFormShow = false;
      this.formConfirmLoading = false;
    },
    // 关闭窗口后的触发事件
    CloseDialog() {
      // 关闭保存Loading
      this.formConfirmLoading = false;
      // 关闭弹出表单
      this.dialogFormShow = false;
    },
  },
};
</script>

<style>
.form-item-line {
  border-bottom: 1px solid rgba(0, 0, 0, .3);
  margin-bottom: 22px;
}
</style>
