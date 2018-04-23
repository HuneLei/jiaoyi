<template>
  <div>
    <DialogForm :dialog-form-visible="dialogFormShow" @close-dialog="dialogCancel" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" :message="editMessage" :from-dialog="form" :isReadonly="false" :isSaveShow="isSaveShow" :isFormConfirm="isFormConfirm" @data-save="dataSave">
      <el-form-item label="用药时间" prop="usageTime" slot='usageTime' label-width="115px">
        <el-date-picker v-model="form.usageTime" format="yyyy-MM-dd" type="datetime" placeholder="选择日期时间" align="right" :picker-options="pickerOptionsTime">
        </el-date-picker>
      </el-form-item>
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
import { mapActions, mapGetters } from 'vuex';
import Address from '../../../api/BasicInfo/Address';    // 接口API
import DialogForm from '../../../components/DialogForm'; // 表单弹出框
import convert from '../../../utils/convert'; // 引入js公共方法

export default {
  activated() {
    // 监听数据更新
    this.$bus.$on('data/DrugsHarmfulResponse', this.dataCreate);
    this.$bus.$on('data/getDrugsDetail', this.dataUpdate);
  },
  deactivated() {
    // 移除监听数据更新
    this.$bus.$off('data/DrugsHarmfulResponse', this.dataCreate);
    this.$bus.$off('data/getDrugsDetail', this.dataUpdate);
  },
  components: {
    DialogForm,
  },
  computed: {
    ...mapGetters([
      'getGpoId',
      'View_UserInfo',
    ]),
  },
  data() {
    return {
      dialogVisible: false,
      editType: '',         // 弹出窗新增编辑判断 0:新增  1:编辑
      editLoading: false,   // 加载
      isFormConfirm: false,       // 确定按钮显示控制
      formConfirmLoading: false,  // 确定按钮loading显示控制
      isSaveShow: true,           // 保存按钮显示控制
      // 需要提交的字段
      form: {
        id: null,
        drugsType: null,
        // drugsCode: null,
        drugsName: null,
        formName: null,
        specName: null,
        approvalNumber: null,
        productorBatch: null,
        usageDosage: null,
        usageTime: null,
        usageReason: null,
      },
      dialogFormShow: false,      // 弹出框显示隐藏控制
      editMessage: {
        IsTrue: true,
        // 写入表单组件的数据
        selects: [
          { label: '药品', key: 'drugsType', type: 'el-select', placeholder: '请选择药品类型', option: 'drugsOptions' },
          // { label: '药品编码', key: 'drugsCode', type: 'el-input', placeholder: '请输入药品编码' },
          { label: '通用名称', key: 'drugsName', type: 'el-input', placeholder: '请输入通用名称' },
          { label: '剂型', key: 'formName', type: 'el-input', placeholder: '请输入剂型' },
          { label: '规格', key: 'specName', type: 'el-input', placeholder: '请输入规格' },
          { label: '批准文号', key: 'approvalNumber', type: 'el-input', placeholder: '请输入批准文号' },
          { label: '生产批号', key: 'productorBatch', type: 'el-input', placeholder: '请输入生产批号' },
          { label: '用法用量', key: 'usageDosage', type: 'el-input', placeholder: '请输入用法用量' },
          { label: '用药时间', value: 'usageTime', type: 'custom' },
          { label: '用药原因', key: 'usageReason', type: 'el-input', placeholder: '请输入用药原因' },
        ],
        // 弹出框标题
        dialogTitle: '用药情况',
        options: {
          // 药品
          drugsOptions: [
            {
              value: 1,
              label: '怀疑药品',
            },
            {
              value: 2,
              label: '并用药品',
            }],
        },
        // checkbox选项值
        checkbox: {},
        // radios选项值
        radios: {},
        // 验证规则
        rules: {
          drugsType: [
            { required: true, message: '请选择药品类型', validator: window.validator.dialogInputZero, trigger: 'change' },
          ],
          drugsName: [
            { required: true, message: '请输入通用名称', validator: window.validator.dialogInput, trigger: 'blur' },
            { max: 256, message: '不得超过256位字符' },
          ],
          formName: [
            { required: true, message: '请输入剂型', validator: window.validator.dialogInput, trigger: 'blur' },
            { max: 256, message: '不得超过256位字符' },
          ],
          specName: [
            { required: true, message: '请输入规格', validator: window.validator.dialogInput, trigger: 'blur' },
            { max: 256, message: '不得超过256位字符' },
          ],
          approvalNumber: [
            { required: true, message: '请输入批准文号', validator: window.validator.dialogInput, trigger: 'blur' },
            { max: 256, message: '不得超过256位字符' },
          ],
          productorBatch: [
            { required: true, message: '请输入生产批号', validator: window.validator.dialogInput, trigger: 'blur' },
            { max: 256, message: '不得超过256位字符' },
          ],
          usageDosage: [
            { required: true, message: '请输入用法用量', validator: window.validator.dialogInput, trigger: 'blur' },
            { max: 256, message: '不得超过256位字符' },
          ],
          usageTime: [
            { required: true, message: '请输入用药时间', validator: window.validator.dialogInput, trigger: 'blur' },
          ],
          usageReason: [
            { required: true, message: '请输入用药原因', validator: window.validator.dialogInput, trigger: 'blur' },
            { max: 256, message: '不得超过256位字符' },
          ],
        },
        styleObject: {},
      },
      pickerOptionsTime: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          },
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - (3600 * 1000 * 24));
            picker.$emit('pick', date);
          },
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - (3600 * 1000 * 24 * 7));
            picker.$emit('pick', date);
          },
        }],
      },
    };
  },
  methods: {
    // 点击新增触发事件
    dataCreate() {
      // 表单清空
      this.form = {
        id: 0,
        drugsType: null,
        // drugsCode: null,
        drugsName: null,
        formName: null,
        specName: null,
        approvalNumber: null,
        productorBatch: null,
        usageDosage: null,
        usageTime: null,
        usageReason: null,
      };
      this.editType = 0;  // 新增
      this.editMessage.dialogTitle = '用药情况';
      this.dialogFormShow = true;             // 打开弹出框
    },
    // 点击保存后的触发事件
    dataSave(formName) {
      if (this.form.usageTime) {
        this.form.usageTime = `${this.convertDate(this.form.usageTime)}`;
      }
      this.$emit('add-drugDetail', this.form, this.editType);
      this.CloseDialog();
    },
    // 点击编辑后的触发事件   item
    dataUpdate(row) {
      // this.form = row;
      // row.mark = true;
      const ret1 = {
        ...row,
      };
      ret1.mark = true;
      this.form = ret1;
      this.editType = 1;  // 编辑
      this.editMessage.dialogTitle = '用药情况';
      this.dialogFormShow = true;             // 打开弹出框
    },
    // 点击取消后的触发事件
    dialogCancel(res) {
      this.dialogFormShow = false;
    },
    // 关闭窗口后的触发事件
    CloseDialog() {
      // 关闭弹出表单
      this.dialogFormShow = false;
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
  },
};
</script>

<style>
.form-item-line {
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  margin-bottom: 22px;
}
</style>
