<template>
  <div>
    <DialogForm :dialog-form-loading="DialogFormLoading" :dialog-form-visible="dialogFormShow" @close-dialog="CloseDialog" @dialog-confirm="dialogConfirm" @dialog-cancel="dialogCancel" :message="editMessage" :from-dialog="form" :isFormConfirm="true" :formConfirmLoading="formConfirmLoading">
      <el-form-item label="会员编码" prop="memberNo" slot='memberNo' label-width="115px">
          <el-input v-model="form.memberNo" placeholder="会员编码" readonly>
            <el-button slot="append" icon="search" @click="showDialog('memberId')"></el-button>
          </el-input>
        </el-form-item>
      <el-form-item label="附件" prop="enclosure" slot='enclosure' label-width="115px">
          <YUploadEdit :fileList="uploadData" :image="true" :pdf="false" :multi="false" :showBriefOther="true" @upload-result="uploadResult" :isDisabled="false" :isReadonly="false"></YUploadEdit>
      </el-form-item>
    </DialogForm>
    <InDialog :options="dialogOptions" @dialogSelect="dialogSelect"></InDialog>
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
  import InDialog from './InDialog'; //  弹框
  import DialogForm from '../../../components/DialogForm'; // 表单弹出框
  import Signature from '../../../api/BasicInfo/Signature'; // 公告管理APi
  import convert from '../../../utils/convert'; //  自定义转换js
  
  export default {
    activated() {
      this.$bus.$on('updateNotice/dialog', this.dataCreate);
    },
    deactivated() {
      this.$bus.$off('updateNotice/dialog', this.dataCreate);
    },
    components: {
      DialogForm,
      InDialog,
    },
    computed: {
      ...mapGetters([
        'View_UserInfo',
      ]),
    },
    watch: {},
    data() {
      return {
        dialogOptions: {
          msgBase: '', //  没什么卵用，有需要可以看看
          isShowDialog: false, //  显示弹框
          tableSelected: [], //  默认表格选中
          tableType: 0, //  0 单选，1 多选 默认单选
        },
        dialogFormShow: false, // 弹出框显示隐藏控制
        formConfirmLoading: false, // 确定按钮loding
        DialogFormLoading: false,
        editMessage: {
          IsTrue: true,
          dialogTitle: '编辑印章',
          selects: [
            { value: 'memberNo', type: 'custom' }, // 卖方会员
            { label: '会员名称', key: 'memberName', type: 'el-input', isReadonly: true },
            { label: '印章类别', key: 'typeId', type: 'el-select', placeholder: '请选择印章类别', option: 'SignatureOption', noClearable: true },
            { label: '附件', value: 'enclosure', type: 'custom' },
            { label: '备注', key: 'remarks', type: 'el-input', placeholder: '请输入备注', fromType: 'textarea', rows: 4 },
          ],
          options: {
            SignatureOption: [],
          },
          checkbox: {},
          radios: {},
          rules: {
            memberNo: [
              { required: true, message: '请选择会员编码', trigger: 'change' },
            ],
            typeId: [
              { required: true, validator: window.validator.dialogInput, message: '请选择印章类别', trigger: 'change, blur' },
            ],
            enclosure: [
              { required: true, message: '请上传附件', validator: window.validator.enclosure, trigger: 'change' },
            ],
          },
          styleObject: {},
        },
        uploadData: [], //  上传文件
        form: {
          memberNo: null,
          memberName: null,
          memberId: null,
          typeId: null,
          enclosure: null,
          remarks: null,
        },
      };
    },
    methods: {
      // 点击确定后的触发事件
      getSignature() {
        Signature.commonReason('sealType').then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            const SignatureOption = [];
            for (let i = 0; i < data.length; i += 1) {
              SignatureOption.push({
                value: data[i].id,
                label: data[i].paramValue,
              });
            }
            this.editMessage.options.SignatureOption = SignatureOption;
          }
        });
      },
      // 上传
      uploadResult(res) {
        this.form.enclosure = res;
        this.uploadData = this.convert.getJSON(res);
      },
      // 点击编辑触发事件
      dataCreate(row) {
        this.getSignature();
        this.dialogFormShow = true; // 打开弹出框
        this.DialogFormLoading = true;
        this.formConfirmLoading = false;
        Signature.item(row.id).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.form = {
              id: data.id,
              memberNo: data.memberNo,
              memberName: data.memberName,
              memberId: data.memberId,
              typeId: data.typeId,
              typeName: data.typeName,
              enclosure: data.enclosure,
              remarks: data.remarks,
            };
            this.uploadData = [];
            // 附件信息
            if (typeof (this.convert.toJSON(data.enclosure)) === 'object') {
              this.uploadData = this.convert.toJSON(data.enclosure);
            }
            this.DialogFormLoading = false;
          }
        });
      },
      // 点击确定后的触发事件
      dialogConfirm(formName) {
        this.formConfirmLoading = true;
        Signature.update(this.form.id, this.form.enclosure, this.form.memberId,
        this.form.remarks, this.form.typeId).then((res) => {
          if (res.data.code === 0) {
            this.$bus.$emit('data/list');
            this.$message({
              type: 'success',
              message: '编辑成功',
            });
            this.formConfirmLoading = false;
            this.dialogFormShow = false;
            this.CloseDialog();
          } else {
            this.$message({
              type: 'error',
              message: res.data.message,
            });
            this.formConfirmLoading = false;
          }
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
      // 弹出医疗机构选择框
      showDialog() {
        this.dialogOptions.isShowDialog = true; // 打开弹出框
      },
      //  弹出框选择之后确定事件
      dialogSelect(rows, msgBase, msgCom) {
        this.form.memberNo = rows[0].memberNo;
        this.form.memberName = rows[0].memberName;
        this.form.memberId = rows[0].id;
      },
    },
  };
</script>
