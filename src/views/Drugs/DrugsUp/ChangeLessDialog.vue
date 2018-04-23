<template>
  <div>
    <DialogForm :dialog-form-loading="DialogFormLoading" :dialog-form-visible="dialogFormShow" @close-dialog="CloseDialog" @dialog-confirm="dialogConfirm" @dialog-cancel="dialogCancel" :message="editMessage" :from-dialog="form" :isFormConfirm="true" :formConfirmLoading="formConfirmLoading">
    </DialogForm>
  </div>
</template>
<script>
/**
 * Created by wuqian on 2017/9/4.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */

import DialogForm from '../../../components/DialogForm'; // 表单弹出框
import DrugsUp from '../../../api/Drugs/DrugsUp'; // 药品上架管理APi

export default {
  activated() {
    this.SalerAll();
    this.$bus.$on('changeLess/dialog', this.dataCreate);
  },
  deactivated() {
    this.$bus.$off('changeLess/dialog', this.dataCreate);
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
        dialogTitle: '修改属性',
        selects: [
          { label: '基药属性', key: 'basicType', type: 'el-select', placeholder: '请选择是否基药', option: 'basicTypeOption' },
          { label: '单价', key: 'hospitalUnitPrice', type: 'el-input', placeholder: '请输入单价', fromStyle: 'style2', span: 10 },
          { label: 'GPO单价', key: 'gpoPrice', type: 'el-input', placeholder: '请输入GPO单价', fromStyle: 'style2', span: 10 },
          { label: '税率', key: 'taxesRate', type: 'el-input', placeholder: '请输入税率', fromStyle: 'style2', span: 10 },
          { label: '拆零系数', key: 'removeFactor', type: 'el-input', placeholder: '请输入拆零系数', fromStyle: 'style2', span: 10 },
          { label: '中包装', key: 'middlePack', type: 'el-input', placeholder: '请输入中包装', fromStyle: 'style2', span: 10 },
          { label: '大包装', key: 'bigPack', type: 'el-input', placeholder: '请输入大包装', fromStyle: 'style2', span: 10 },
          // { label: '单价', key: 'hospitalUnitPrice', type: 'el-input', placeholder: '请输入单价' },
          // { label: 'GPO单价', key: 'gpoPrice', type: 'el-input', placeholder: '请输入GPO单价' },
          // { label: '税率', key: 'taxesRate', type: 'el-input', placeholder: '请输入税率' },
          // { label: '中包装', key: 'middlePack', type: 'el-input', placeholder: '请输入中包装' },
          // { label: '大包装', key: 'bigPack', type: 'el-input', placeholder: '请输入大包装' },
          // { label: '拆零系数', key: 'removeFactor', type: 'el-input', placeholder: '请输入拆零系数' },
          { label: '批准文号', key: 'approvalNumber', type: 'el-input', placeholder: '请输入批准文号' },
          { label: '药品本位码', key: 'drugStandardCode', type: 'el-input', placeholder: '请输入药品本位码' },
          { label: '商品名', key: 'tradeName', type: 'el-input', placeholder: '请输入商品名' },
          { label: '医保目录', key: 'medicalInsuranceDirectory', type: 'el-input', placeholder: '请输入医保目录' },
          { label: '备注', key: 'remarks', type: 'el-input', placeholder: '请输入备注' },
        ],
        styleObject: {
          style1: {
            width: '90%',
          },
          style2: {
            width: '33%',
          },
        },
        options: {
          basicTypeOption: [
            {
              value: 1,
              label: '国基',
            },
            {
              value: 2,
              label: '省基',
            },
            {
              value: 0,
              label: '空',
            }],
        },
        checkbox: {},
        radios: {},
        rules: {
          hospitalUnitPrice: [
            { required: true, message: '请输入数字类型的单价', validator: window.validator.verifyNumber, trigger: 'blur' },
          ],
          taxesRate: [
            { required: true, message: '请输入数字类型的税率', validator: window.validator.verifyNumber, trigger: 'blur' },
          ],
          // gpoPrice: [
          //   { required: true, message: '请输入数字类型的GPO单价',
          // validator: window.validator.verifyNumber, trigger: 'blur' },
          // ],
          removeFactor: [
            { required: true, message: '请输入整数类型的拆零系数', validator: window.validator.verifyNumberOnly, trigger: 'blur' },
          ],
          middlePack: [
            { required: true, message: '请输入整数类型的中包装', validator: window.validator.verifyNumberOnlyz, trigger: 'blur' },
          ],
          bigPack: [
            { required: true, message: '请输入整数类型的大包装', validator: window.validator.verifyNumberOnlyz, trigger: 'blur' },
          ],
          approvalNumber: [
            { message: '不得超过256位字符', max: 256 },
          ],
          drugStandardCode: [
            { message: '不得超过256位字符', max: 256 },
          ],
          tradeName: [
            { message: '不得超过256位字符', max: 256 },
          ],
          medicalInsuranceDirectory: [
            { message: '不得超过256位字符', max: 256 },
          ],
          remarks: [
            { message: '不得超过256位字符', max: 256 },
          ],
        },
      },
      form: {
        id: '',
        projectId: null,
        projectSubId: null,
        enrollId: null,
        qualityLevel: null,
        basicType: null,
        hospitalUnitPrice: '',
        gpoPrice: null,
        taxesRate: '',
        bigPack: '',
        middlePack: '',
        removeFactor: '',
        approvalNumber: '',
        drugStandardCode: '',
        tradeName: '',
        medicalInsuranceDirectory: '',
        remarks: '',
      },
      OldValue: {
        enrollId: null,
      },
    };
  },
  methods: {
    // 卖方会员下拉
    SalerAll() {
      DrugsUp.SalerAll().then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          const SalerOptions = [];
          for (let i = 0; i < data.length; i += 1) {
            SalerOptions.push({
              value: data[i].id,
              label: data[i].name,
            });
          }
          this.editMessage.options.SalerOptions = SalerOptions;
        }
      });
    },
    // 点击新增触发事件
    dataCreate(row) {
      this.dialogFormShow = true; // 打开弹出框
      this.DialogFormLoading = true;
      this.formConfirmLoading = false;
      DrugsUp.item(row.id).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          this.form = {
            id: data.id,
            projectId: data.projectId,
            projectName: data.projectName,
            projectSubId: data.projectSubId,
            enrollId: data.enrollId,
            enrollName: data.enrollName,
            qualityLevel: data.qualityLevel,
            basicType: data.basicType,
            hospitalUnitPrice: data.hospitalUnitPrice,
            gpoPrice: data.gpoPrice,
            taxesRate: data.taxesRate,
            drugsCode: data.drugsCode,
            removeFactor: data.removeFactor,
            middlePack: data.middlePack,
            bigPack: data.bigPack,
            approvalNumber: data.approvalNumber,
            drugStandardCode: data.drugStandardCode,
            tradeName: data.tradeName,
            medicalInsuranceDirectory: data.medicalInsuranceDirectory,
            remarks: data.remarks,
          };
          this.DialogFormLoading = false;
        }
      });
    },
    // 点击确定后的触发事件
    dialogConfirm(formName) {
      this.form.hospitalUnitPrice = Number(this.form.hospitalUnitPrice);
      this.form.taxesRate = Number(this.form.taxesRate);
      this.formConfirmLoading = true;
      if (!this.form.gpoPrice) {
        this.form.gpoPrice = 0;
      }
      DrugsUp.update(this.form.id, this.form.drugsCode, this.form.enrollId, this.form.gpoPrice,
        this.form.hospitalUnitPrice, this.form.projectId,
        this.form.projectSubId, this.form.qualityLevel, this.form.basicType, this.form.taxesRate,
        this.form.removeFactor, this.form.middlePack, this.form.bigPack,
        this.form.tradeName, this.form.approvalNumber,
        this.form.drugStandardCode, this.form.medicalInsuranceDirectory, this.form.remarks)
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
