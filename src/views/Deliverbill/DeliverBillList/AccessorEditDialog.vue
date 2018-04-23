<template>
  <div>
    <DialogForm :dialog-form-loading="DialogFormLoading" :dialog-form-visible="dialogFormShow" @close-dialog="CloseDialog" @dialog-confirm="dialogConfirm" @dialog-cancel="dialogCancel" :message="editMessage" :from-dialog="form" :isFormConfirm="true" :formConfirmLoading="formConfirmLoading">
      <el-form-item label="随货同行单" prop="scanFile" slot='scanFile' label-width="115px">
        <YUploadEdit :fileList="uploadData" :showBriefOther="true" @upload-result="uploadResult" :isDisabled="false" :isReadonly="false"></YUploadEdit>
      </el-form-item>
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
  import { mapActions, mapGetters } from 'vuex';
  import DialogForm from '../../../components/DialogForm'; // 表单弹出框
  import YUploadEdit from '../../../components/YUploadEdit'; // 表单弹出框
  import convert from '../../../utils/convert';                         //  自定义转换js
  import DeliverBillList from '../../../api/Deliverbill/DeliverBillList';

  export default {
    activated() {
      this.$bus.$on('aiccessorEdit/dialog', this.dataUpdate);
    },
    deactivated() {
      this.$bus.$off('aiccessorEdit/dialog', this.dataUpdate);
    },
    components: {
      DialogForm,
      YUploadEdit,
    },
    computed: mapGetters([
      'gpoOptions',
      'getGpoId',
    ]),
    data() {
      return {
        dialogFormShow: false, // 弹出框显示隐藏控制
        formConfirmLoading: false, // 确定按钮loding
        DialogFormLoading: false,
        isReadonly: false,
        editMessage: {
          dialogTitle: '上传随货同行单',
          selects: [
            { value: 'scanFile', type: 'custom' }, // 附件
          ],
          options: {},
          checkbox: {},
          radios: {},
          rules: {},
          styleObject: {},
        },
        form: {
          id: null,
          scanFile: null,
        },
        uploadData: [], //  上传文件
        SalerOptions: [],
      };
    },
    methods: {
      // 上传
      uploadResult(res) {
        this.form.scanFile = res;
        this.uploadData = this.convert.getJSON(this.form.scanFile);
      },
      // 点击触发事件
      dataUpdate(row) {
        this.dialogFormShow = true; // 打开弹出框
        this.formConfirmLoading = false;
        this.form.id = row.id;
        this.uploadData = [];
        this.form.scanFile = row.billAccessories;
        if (typeof (this.toJSON(row.billAccessories)) === 'object') {
          this.uploadData = this.toJSON(row.billAccessories);
        }
      },
      // 点击确定后的触发事件
      dialogConfirm(formName) {
        DeliverBillList.billupdate(this.form.id, this.form.scanFile).then((res) => {
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
      //  json字符串转json，否则还是返回字符串
      toJSON(str) {
        return convert.toJSON(str);
      },
    },
  };
</script>
