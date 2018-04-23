<template>
  <div>
    <DialogForm :dialog-form-loading="DialogFormLoading" :dialog-form-visible="dialogFormShow" @close-dialog="CloseDialog" @dialog-confirm="dialogConfirm" @dialog-cancel="dialogCancel" :message="editMessage" :from-dialog="form" :isFormConfirm="true" :formConfirmLoading="formConfirmLoading">
    </DialogForm>
  </div>
</template>
<script>
  /**
   * Created by wuqian on 2017/9/20.
   * <p>
   * 江苏摇铃网络科技有限公司，版权所有。
   * Copyright (C) 2015-2017 All Rights Reserved.
   */

  import DialogForm from '../../../components/DialogForm'; // 表单弹出框
  import DrugsBatchNo from '../../../api/Drugs/DrugsBatchNo'; // 药品批号管理APi

  export default {
    activated() {
      this.$bus.$on('changeEdit/dialog', this.dataCreate);
    },
    deactivated() {
      this.$bus.$off('changeEdit/dialog', this.dataCreate);
    },
    components: {
      DialogForm,
    },
    data() {
      return {
        dialogFormShow: false, // 弹出框显示隐藏控制
        formConfirmLoading: false, // 确定按钮loding
        DialogFormLoading: false,
        editMessage: {
          dialogTitle: '修改批号',
          selects: [
            { label: '批号', key: 'batchNo', type: 'el-input', placeholder: '请输入批号' },
          ],
          options: {},
          checkbox: {},
          radios: {},
          rules: {
            batchNo: [
              { required: true, message: '请输入批号', trigger: 'blur' },
              { message: '不得超过256位字符', max: 256 },
            ],
          },
          styleObject: {},
        },
        form: {
          id: '', // 行ID
          batchNo: '',
        },
      };
    },
    methods: {
      // 点击新增触发事件
      dataCreate(row) {
        this.dialogFormShow = true; // 打开弹出框
        this.DialogFormLoading = true;
        this.formConfirmLoading = false;
        DrugsBatchNo.item(row.id).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result[0];
            this.form = {
              id: data.id,
              batchNo: data.batchNo,
            };
            this.DialogFormLoading = false;
          }
        });
      },
      // 点击确定后的触发事件
      dialogConfirm(formName) {
        // console.log();
        DrugsBatchNo.update(this.form.id, this.form.batchNo)
        .then((res) => {
          if (res.data.code === 0) {
            this.$bus.$emit('data/list');
            this.$message({
              type: 'success',
              message: '编辑成功',
            });
          }
          this.formConfirmLoading = false;
          this.dialogFormShow = false;
        });
      },
      // 点击取消后的触发事件
      dialogCancel(res) {
        this.formConfirmLoading = false;
        this.DialogFormLoading = false;
        this.dialogFormShow = false;
      },
      // 关闭窗口后的触发事件
      CloseDialog() {
        this.dialogFormShow = false;
      },
    },
  };
</script>
