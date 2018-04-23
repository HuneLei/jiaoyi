<template>
  <div>
    <DialogForm :dialog-form-visible="dialogFormShow" @close-dialog="CloseDialog" @dialog-cancel="dialogCancel" :message="editMessage" :from-dialog="form" :isReadonly="false" :isSaveShow="isSaveShow" :saveLoading="saveLoading" :isFormConfirm="isFormConfirm" @data-save="dataSave">
      <el-form-item label="卖方选配送时间" prop="producerTime" slot='producerTime' label-width="150px">
        <el-date-picker v-model="producerTime" format="yyyy-MM-dd HH:mm" type="datetimerange" :picker-options="pickerOptions2" placeholder="选择卖方选配送时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="配送确认时间" prop="deliveryTime" slot='deliveryTime' label-width="150px">
        <el-date-picker v-model="deliveryTime" format="yyyy-MM-dd HH:mm" type="datetimerange" :picker-options="pickerOptions2" placeholder="选择配送确认时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="买方选配送时间" prop="hospitalTime" slot='hospitalTime' label-width="150px">
        <el-date-picker v-model="hospitalTime" format="yyyy-MM-dd HH:mm" type="datetimerange" :picker-options="pickerOptions2" placeholder="选择买方选配送时间"></el-date-picker>
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

import DeliverTime from '../../../api/BasicInfo/DeliverTime';    // 接口API
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
    // 生产企业选配送时间
    const validateProducerTime = (rule, value, callback) => {
      if (this.$data.producerTime) {
        if (!this.$data.producerTime[0] || !this.$data.producerTime[1]) {
          this.$data.editMessage.rules.producerTime[0].trigger = 'blur,change';
          callback(new Error('请选择卖方选配送时间范围'));
        } else {
          callback();
        }
      } else {
        callback(new Error('请选择卖方选配送时间范围'));
      }
    };
    // 配送确认时间
    const validateDeliveryTime = (rule, value, callback) => {
      let error = '';
      if (this.$data.deliveryTime) {
        if (!this.$data.deliveryTime[0] || !this.$data.deliveryTime[1]) {
          this.$data.editMessage.rules.deliveryTime[0].trigger = 'blur,change';
          error = callback(new Error('请选择配送确认时间范围'));
        } else {
          error = callback();
        }
      } else {
        error = callback(new Error('请选择配送确认时间范围'));
      }
      return error;
    };
    // 医疗机构选配送时间
    const validateHospitalTime = (rule, value, callback) => {
      let error = '';
      if (this.$data.hospitalTime) {
        if (!this.$data.hospitalTime[0] || !this.$data.hospitalTime[1]) {
          this.$data.editMessage.rules.hospitalTime[0].trigger = 'blur,change';
          error = callback(new Error('请选择买方选配送时间范围'));
        } else {
          error = callback();
        }
      } else {
        error = callback(new Error('请选择买方选配送时间范围'));
      }
      return error;
    };
    return {
      editLoading: false,   // 加载
      isFormConfirm: false,       // 确定按钮显示控制
      formConfirmLoading: false,  // 确定按钮loading显示控制
      isSaveShow: true,           // 保存按钮显示控制
      saveLoading: false,         // 保存按钮loading显示控制
      isSubmitShow: false,        // 提交按钮显示控制
      submitLoading: false,       // 提交按钮loading显示控制
      // 需要提交的字段
      form: {
        // 需要传输的字段
        id: '',                   // 集采子项目ID
        producerBtime: '',
        producerEtime: '',
        deliveryBtime: '',
        deliveryEtime: '',
        hospitalBtime: '',
        hospitalEtime: '',
      },
      dialogFormShow: false,      // 弹出框显示隐藏控制
      editMessage: {
        // 写入表单组件的数据
        selects: [
          { value: 'producerTime', type: 'custom' },
          { value: 'deliveryTime', type: 'custom' },
          { value: 'hospitalTime', type: 'custom' },
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
          producerTime: [
            { required: true, message: '请选择卖方选配送时间', validator: validateProducerTime, trigger: 'blur' },
          ],
          deliveryTime: [
            { required: true, message: '请选择配送确认时间', validator: validateDeliveryTime, trigger: 'blur' },
          ],
          hospitalTime: [
            { required: true, message: '请选择买方选配送时间', validator: validateHospitalTime, trigger: 'blur' },
          ],
        },
        styleObject: {},
      },
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(start.getTime() + (3600 * 1000 * 24 * 7));
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(start.getTime() + (3600 * 1000 * 24 * 30));
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(start.getTime() + (3600 * 1000 * 24 * 90));
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '无穷大',
          onClick(picker) {
            const end = new Date((new Date('9999-12-31').getTime() - (3600 * 1000 * 8)));
            const start = picker.minVisibleDate ?
              new Date(new Date(picker.minVisibleDate).getTime() - (3600 * 1000 * 8)) : new Date();
            picker.$emit('pick', [start, end]);
          },
        }],
      },
      // 存储显示编辑的数据
      producerTime: [],        // 生产企业选配送时间
      deliveryTime: [],        // 配送确认时间
      hospitalTime: [],        // 医疗机构选配送时间
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
      DeliverTime.item(row.id).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          this.editMessage.dialogTitle = '编辑时间设置';
          // 卖方配送时间
          let producerBtime = null;
          let producerEtime = null;
          if (data.producerBtime) {
            producerBtime = new Date(this.toDateTime(data.producerBtime));
          }
          if (data.producerEtime) {
            producerEtime = new Date(this.toDateTime(data.producerEtime));
          }
          this.producerTime = [producerBtime, producerEtime];
          // 配送确认时间
          let deliveryBtime = null;
          let deliveryEtime = null;
          if (data.deliveryBtime) {
            deliveryBtime = new Date(this.toDateTime(data.deliveryBtime));
          }
          if (data.deliveryEtime) {
            deliveryEtime = new Date(this.toDateTime(data.deliveryEtime));
          }
          this.deliveryTime = [deliveryBtime, deliveryEtime];
          // 买方选配送时间
          let hospitalBtime = null;
          let hospitalEtime = null;
          if (data.deliveryBtime) {
            hospitalBtime = new Date(this.toDateTime(data.hospitalBtime));
          }
          if (data.deliveryBtime) {
            hospitalEtime = new Date(this.toDateTime(data.hospitalEtime));
          }
          this.hospitalTime = [hospitalBtime, hospitalEtime];
          this.form = {
            // 需要传输的字段
            id: data.id,                   // 集采子项目ID
            producerBtime: data.producerBtime,
            producerEtime: data.producerBtime,
            deliveryBtime: data.deliveryBtime,
            deliveryEtime: data.deliveryEtime,
            hospitalBtime: data.hospitalBtime,
            hospitalEtime: data.hospitalEtime,
          };
          this.dialogFormShow = true;   // 打开弹出框
        }
      });
    },
    // 提交更新  update
    dataSubmitUpdate() {
      this.form.producerBtime = convert.convertDateNew(this.producerTime[0], 1);
      this.form.producerEtime = convert.convertDateNew(this.producerTime[1], 1);
      this.form.deliveryBtime = convert.convertDateNew(this.deliveryTime[0], 1);
      this.form.deliveryEtime = convert.convertDateNew(this.deliveryTime[1], 1);
      this.form.hospitalBtime = convert.convertDateNew(this.hospitalTime[0], 1);
      this.form.hospitalEtime = convert.convertDateNew(this.hospitalTime[1], 1);
      DeliverTime.update(this.form).then((res) => {
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
    dialogCancel(res) {
    },
    // 关闭窗口后的触发事件
    CloseDialog() {
      // 关闭保存Loading
      this.saveLoading = false;
      // 关闭弹出表单
      this.dialogFormShow = false;
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
  border-bottom: 1px solid rgba(0, 0, 0, .3);
  margin-bottom: 22px;
}
</style>
