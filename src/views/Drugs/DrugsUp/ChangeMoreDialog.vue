<template>
  <div>
    <DialogForm :dialog-form-loading="DialogFormLoading" :dialog-form-visible="dialogFormShow" @close-dialog="CloseDialog" @dialog-confirm="dialogConfirm" @dialog-cancel="dialogCancel" :message="editMessage" :from-dialog="form" :isFormConfirm="true" :formConfirmLoading="formConfirmLoading">
      <el-form-item label="集采项目" prop="projectId" slot='projectId' label-width="115px">
        <el-select v-model="form.projectId" placeholder="请选择集采项目" @change="getSelectValue">
          <el-option v-for="item in projectOption" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
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
import { mapState, mapGetters } from 'vuex';
import DialogForm from '../../../components/DialogForm'; // 表单弹出框
import DrugsUp from '../../../api/Drugs/DrugsUp'; // 药品上架管理APi
import gpo from '../../../api/gpo'; // gpo 公共API

export default {
  activated() {
    this.$bus.$on('changeMore/dialog', this.dataCreate);
  },
  deactivated() {
    this.$bus.$off('changeMore/dialog', this.dataCreate);
  },
  components: {
    DialogForm,
  },
  computed: mapGetters([
    'getGpoId',
  ]),
  data() {
    return {
      dialogFormShow: false, // 弹出框显示隐藏控制
      formConfirmLoading: false, // 确定按钮loding
      DialogFormLoading: false,
      projectOption: [],
      editMessage: {
        dialogTitle: '修改属性',
        selects: [
          { label: '集采项目', value: 'projectId', type: 'custom' },
          { label: '集采子项目', key: 'projectSubId', type: 'el-select', placeholder: '请选择集采子项目', option: 'subProjectOption', noClearable: true },
          { label: '卖方会员', key: 'enrollId', type: 'el-select', placeholder: '请选择卖方会员', option: 'SalerOptions', noClearable: true, filterable: true },
          { label: '质量层次', key: 'qualityLevel', type: 'el-select', placeholder: '请选择质量层次', option: 'qualityLevelOption', noClearable: true, span: 10, fromStyle: 'style2' },
          { label: '基药属性', key: 'basicType', type: 'el-select', placeholder: '请选择是否基药', option: 'basicTypeOption', span: 10, fromStyle: 'style2' },
          { label: '单价', key: 'hospitalUnitPrice', type: 'el-input', placeholder: '请输入单价', fromStyle: 'style2', span: 10 },
          { label: 'GPO单价', key: 'gpoPrice', type: 'el-input', placeholder: '请输入GPO单价', fromStyle: 'style2', span: 10 },
          { label: '税率', key: 'taxesRate', type: 'el-input', placeholder: '请输入税率', fromStyle: 'style2', span: 10 },
          { label: '拆零系数', key: 'removeFactor', type: 'el-input', placeholder: '请输入拆零系数', fromStyle: 'style2', span: 10 },
          { label: '中包装', key: 'middlePack', type: 'el-input', placeholder: '请输入中包装', fromStyle: 'style2', span: 10 },
          { label: '大包装', key: 'bigPack', type: 'el-input', placeholder: '请输入大包装', fromStyle: 'style2', span: 10 },
          { label: '批准文号', key: 'approvalNumber', type: 'el-input', placeholder: '请输入批准文号' },
          { label: '药品本位码', key: 'drugStandardCode', type: 'el-input', placeholder: '请输入药品本位码' },
          { label: '商品名', key: 'tradeName', type: 'el-input', placeholder: '请输入商品名', fromStyle: 'style2', span: 10 },
          { label: '医保目录', key: 'medicalInsuranceDirectory', type: 'el-input', placeholder: '请输入医保目录', fromStyle: 'style2', span: 10 },
          { label: '备注', key: 'remarks', type: 'el-input', placeholder: '请输入备注' },
        ],
        options: {
          subProjectOption: [],
          SalerOptions: [],
          qualityLevelOption: [],
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
        styleObject: {
          style1: {
            width: '90%',
          },
          style2: {
            width: '33%',
          },
        },
        checkbox: {},
        radios: {},
        rules: {
          projectId: [
            { required: true, validator: window.validator.dialogInput, message: '请选择集采项目', trigger: 'change, blur' },
          ],
          projectSubId: [
            { required: true, validator: window.validator.dialogInput, message: '请选择集采子项目', trigger: 'change, blur' },
          ],
          enrollId: [
            { required: true, validator: window.validator.dialogInput, message: '请选择卖方会员', trigger: 'change, blur' },
          ],
          qualityLevel: [
            { required: true, message: '请选择质量层次', trigger: 'change, blur' },
          ],
          hospitalUnitPrice: [
            { required: true, message: '请输入数字类型的单价', validator: window.validator.verifyNumber, trigger: 'blur' },
          ],
          taxesRate: [
            { required: true, message: '请输入数字类型的税率', validator: window.validator.verifyNumber, trigger: 'blur' },
          ],
          // gpoPrice: [
          //   { required: false, message: '请输入数字类型的GPO单价',
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
      // 表单清空
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
        drugsCode: '',
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
        projectId: null,
        projectSubId: null,
        enrollId: null,
      },
      changeStatus: 1,
    };
  },
  methods: {
    getSelectValue(val) {
      // 根据changeStatus判断是否再执行将子项目等清空，否则第一次进入时会将子项目等清空
      if (typeof (val) === 'number') {
        this.subProjectAll(val);
        this.qualityAll(val);
        this.SalerAll(val);
        if (this.changeStatus > 1) {
          this.form.projectSubId = null;
          this.form.enrollId = null;
          this.form.qualityLevel = null;
          this.form.basicType = null;
        }
        this.changeStatus += 1;
      }
    },
    // 集采项目下拉
    projectAll() {
      gpo.ProjectCommon(this.getGpoId).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          this.projectOption = data;
        }
      });
    },
    // 集采子项目
    subProjectAll(val) {
      if (this.getGpoId) {
        DrugsUp.drugsProjectSubAll(val).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            const subProjectOption = [];
            for (let i = 0; i < data.length; i += 1) {
              subProjectOption.push({
                value: data[i].id,
                label: data[i].name,
              });
            }
            this.editMessage.options.subProjectOption = subProjectOption;
          }
        });
      }
    },
    // 卖方会员下拉
    SalerAll(val) {
      gpo.SalerCommonAll(val).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          const SalerOptions = [];
          for (let i = 0; i < data.length; i += 1) {
            SalerOptions.push({
              value: data[i].id,
              label: data[i].memberName,
            });
          }
          this.editMessage.options.SalerOptions = SalerOptions;
        }
      });
    },
    // 质量层次下拉
    qualityAll(val) {
      gpo.qualityCommonAll(val).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          const qualityLevelOption = [];
          for (let i = 0; i < data.length; i += 1) {
            qualityLevelOption.push({
              value: data[i].name,
              label: data[i].name,
            });
          }
          this.editMessage.options.qualityLevelOption = qualityLevelOption;
        }
      });
    },
    // 点击新增触发事件
    dataCreate(row) {
      this.dialogFormShow = true; // 打开弹出框
      this.DialogFormLoading = true;
      this.formConfirmLoading = false;
      this.changeStatus = 1;
      this.projectAll();
      this.subProjectAll(row.projectId);
      this.SalerAll(row.projectId);
      this.qualityAll(row.projectId);
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
          // 旧值
          this.OldValue = {
            projectId: data.projectId,
            projectSubId: data.projectSubId,
            enrollId: data.enrollId,
          };
          // 判断集采项目
          let a = 0;
          let b = 0;
          let c = 0;
          if (data.projectId) {
            for (let i = 0; i < this.projectOption.length; i += 1) {
              if (this.projectOption[i].id === data.projectId) {
                a = 1;
              }
            }
          }
          if (a === 0) {
            this.form.projectId = data.projectName;
          }
          // 判断集采子项目
          if (data.projectSubId) {
            for (let i = 0; i < this.editMessage.options.subProjectOption.length; i += 1) {
              if (this.editMessage.options.subProjectOption[i].value === data.projectSubId) {
                b = 1;
              }
            }
          }
          if (b === 0) {
            this.form.projectSubId = data.projectSubName;
          }
          // 判断卖方会员
          if (data.enrollId) {
            for (let i = 0; i < this.editMessage.options.SalerOptions.length; i += 1) {
              if (this.editMessage.options.SalerOptions[i].value === data.enrollId) {
                c = 1;
              }
            }
          }
          if (c === 0) {
            this.form.enrollId = data.enrollName;
          }
        }
        this.DialogFormLoading = false;
      });
    },
    // 点击确定后的触发事件
    dialogConfirm(formName) {
      this.formConfirmLoading = true;
      if (typeof (this.form.projectId) !== 'number') {
        this.form.projectId = this.OldValue.projectId;
      }
      if (typeof (this.form.projectSubId) !== 'number') {
        this.form.projectSubId = this.OldValue.projectSubId;
      }
      if (typeof (this.form.enrollId) !== 'number') {
        this.form.enrollId = this.OldValue.enrollId;
      }
      if (!this.form.gpoPrice) {
        this.form.gpoPrice = 0;
      }
      DrugsUp.update(this.form.id, this.form.drugsCode, this.form.enrollId, this.form.gpoPrice,
        this.form.hospitalUnitPrice, this.form.projectId, this.form.projectSubId,
        this.form.qualityLevel, this.form.basicType, this.form.taxesRate,
        this.form.removeFactor, this.form.middlePack, this.form.bigPack,
        this.form.tradeName, this.form.approvalNumber, this.form.drugStandardCode,
        this.form.medicalInsuranceDirectory, this.form.remarks)
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
