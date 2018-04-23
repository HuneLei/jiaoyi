<template>
  <div>
    <DialogForm :dialog-form-visible="dialogFormShow"
                @close-dialog="CloseDialog"
                @dialog-cancel="dialogCancel"
                :message="editMessage"
                :from-dialog="form"
                :isReadonly="false"
                :isSaveShow="isSaveShow"
                :saveLoading="saveLoading"
                :isFormConfirm="isFormConfirm"
                @data-save="dataSave">
      <el-form-item label="合同有效期方式"  prop="contractValid" slot='contractValid' label-width="115px">
        <el-select v-model.number="form.contractValid" placeholder="请选择合同有效期方式" @change="changeContractValid">
          <el-option
            v-for="item in contractValidOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="showContractEtime" label="截止时间"  prop="contractEtime" slot='contractEtime' label-width="115px">
        <el-date-picker
          v-model.trim="form.contractEtime"
          type="datetime"
          :picker-options="pickerOptions0"
          placeholder="选择截至日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item v-if="showValidLength" label="持续时长（月）"  prop="validLength" slot='validLength' label-width="115px">
        <el-input type="number" v-model.number="form.validLength" placeholder="请输入持续时长"></el-input>
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

  import ContractVaild from '../../../api/BasicInfo/ContractVaild';    // 接口API
  import DialogForm from '../../../components/DialogForm'; // 表单弹出框
  import district from '../../../api/district';            // 省市区接口
  import project from '../../../api/BasicInfo/Project';            // 省市区接口
  import convert from '../../../utils/convert';

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
      // 持续时长（月）  --  自定义验证
      const validateValidLength = (rule, value, callback) => {
        const res = /^[1-9]+[0-9]*]*$/;
        if (this.$data.form.validLength && res.test(this.$data.form.validLength)) {
          callback();
        } else {
          this.$data.editMessage.rules.validLength[0].trigger = 'blur,change';
          callback(new Error('请输入持续时长'));
        }
      };
      return {
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          },
        },
        contractValidOptions: [
          { label: '时间截止方式 ', value: 0 },
          { label: '时长截止方式', value: 1 },
        ],
        showContractEtime: false,       // 截至日期
        showValidLength: false,         // 持续时长
        editLoading: false,   // 加载
        isFormConfirm: false,       // 确定按钮显示控制
        formConfirmLoading: false,  // 确定按钮loading显示控制
        isSaveShow: true,           // 保存按钮显示控制
        saveLoading: false,         // 保存按钮loading显示控制
        isSubmitShow: false,        // 提交按钮显示控制
        submitLoading: false,       // 提交按钮loading显示控制
        // 需要提交的字段
        form: {
          id: null,                   // 集采项目ID
          contractEtime: null,        // 合同结束时间
          contractValid: null,        // 合同有效期方式
          validLength: null,          // 有效时长
        },
        dialogFormShow: false,      // 弹出框显示隐藏控制
        editMessage: {
          // 写入表单组件的数据
          selects: [
            { value: 'contractValid', type: 'custom' },
            { value: 'contractEtime', type: 'custom' },
            { value: 'validLength', type: 'custom' },
          ],
          // 弹出框标题
          dialogTitle: '编辑时间设置',
          options: {},
          // checkbox选项值
          checkbox: {},
          // radios选项值
          radios: {},
          // 验证规则
          rules: {
            contractValid: [
              { required: true, type: 'number', message: '请选择合同有效期方式', trigger: 'change' },
            ],
            contractEtime: [
              { required: true, type: 'date', message: '请输入截至日期', trigger: 'blur, change' },
            ],
            validLength: [
              { required: true, type: 'number', message: '请输入持续时长', validator: validateValidLength, trigger: 'blur' },
            ],
          },
          styleObject: {},
        },
      };
    },
    methods: {
      // 点击保存后的触发事件
      dataSave(formName) {
        this.saveLoading = true;      // 保存按钮loading开启
        this.dataSubmitUpdate();
      },
      // 点击编辑后的触发事件   item
      dataUpdate(row) {
        ContractVaild.item(row.id).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.editMessage.dialogTitle = '编辑时间设置';
            /**
             *  c === 1 : 时长
             *  c === o : 日期
             */
            if (data.contractValid === 1) {
              this.showContractEtime = false;      // 截至日期
              this.showValidLength = true;         // 持续时长
              this.form = {
                id: data.id,                              // 集采项目ID
                contractEtime: null,        // 合同结束时间
                contractValid: Number(data.contractValid),        // 合同有效期方式
                validLength: Number(data.validLength),            // 有效时长
              };
            } else {
              this.showContractEtime = true;      // 截至日期
              this.showValidLength = false;       // 持续时长
              const contractEtime = new Date(this.toDateTime(data.contractEtime));
              this.form = {
                id: data.id,                              // 集采项目ID
                // contractEtime: data.contractEtime,        // 合同结束时间
                contractEtime,        // 合同结束时间
                contractValid: Number(data.contractValid),        // 合同有效期方式
                validLength: null,            // 有效时长
              };
            }
            this.dialogFormShow = true;   // 打开弹出框
          }
        });
      },
      // 提交更新  update
      dataSubmitUpdate() {
        this.form.contractEtime = convert.convertDateNew(this.form.contractEtime, 1);
        ContractVaild.update(this.form).then((res) => {
          if (res.data.code === 0) {
            this.$bus.$emit('data/list');
            this.$message({
              type: 'success',
              message: '编辑成功',
            });
          }
        });
      },
      // 点击取消后的触发事件
      dialogCancel(res) {},
      // 关闭窗口后的触发事件
      CloseDialog() {
        // 关闭保存Loading
        this.saveLoading = false;
        // 关闭弹出表单
        this.dialogFormShow = false;
      },
      // 选择更换合同有效期方式
      changeContractValid(row) {
        if (this.form.contractValid === 1) {
          this.showContractEtime = false;       // 截至日期
          this.showValidLength = true;         // 持续时长
          this.form.contractEtime = null;
        } else {
          this.showContractEtime = true;       // 截至日期
          this.showValidLength = false;         // 持续时长
          this.form.validLength = null;
        }
      },
      //  取时间戳
      toDateTime(str) {
        return convert.dateTime(str);
      },
    },
  };
</script>

<style>
  .form-item-line {
    border-bottom: 1px solid rgba(0,0,0,.3);
    margin-bottom: 22px;
  }
</style>
