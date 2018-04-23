<template>
  <div>
    <DialogForm  :dialog-form-visible="dialogFormShow" @close-dialog="CloseDialog" @dialog-confirm="dialogConfirm" @dialog-cancel="dialogCancel" :message="editMessage" :from-dialog="form" :isFormConfirm="true" :formConfirmLoading="formConfirmLoading">
      <el-form-item label="展示期间" prop="announcementDate" label-width="115px" slot="announcementDate">
          <el-date-picker :clearable="false" v-model="announcementDate" :picker-options="pickerOptions2" type="daterange" placeholder="请选择展示期间">
          </el-date-picker>
       </el-form-item>
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
  import convert from '../../../utils/convert'; //  自定义转换js
  import Notice from '../../../api/BasicInfo/Notice'; // 公告管理APi
  
  export default {
    activated() {
      this.$bus.$on('createNotice/dialog', this.dataCreate);
    },
    deactivated() {
      this.$bus.$off('createNotice/dialog', this.dataCreate);
    },
    components: {
      DialogForm,
    },
    watch: {
      announcementDate() {
        this.form.announcementDate = this.announcementDate;
      },
    },
    data() {
      return {
        dialogFormShow: false, // 弹出框显示隐藏控制
        formConfirmLoading: false, // 确定按钮loding
        editMessage: {
          dialogTitle: '新增公告',
          selects: [
            { value: 'announcementDate', type: 'custom' },
            { label: '公告标题', key: 'announcementTitle', type: 'el-input', placeholder: '请输入公告标题' },
            { label: '公告内容', key: 'announcementText', type: 'el-input', placeholder: '请输入公告内容', fromType: 'textarea', rows: 4 },
          ],
          options: {},
          checkbox: {},
          radios: {},
          rules: {
            announcementDate: [
              { required: true, message: '请选择展示期间', validator: window.validator.verifyReportnumTime, trigger: 'change' },
            ],
            announcementTitle: [
              { required: true, message: '请输入公告标题', trigger: ' blur' },
              { message: '不得超过256位字符', max: 256 },
            ],
            announcementText: [
              { required: true, message: '请输入公告内容', trigger: ' blur' },
              { message: '不得超过256位字符', max: 256 },
            ],
          },
          styleObject: {},
        },
        form: {
          announcementDate: null,
          announcementTitle: null,
          announcementText: null,
        },
        announcementDate: [], // 报量有效期绑定值
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
      };
    },
    methods: {
      // 点击新增触发事件
      dataCreate(row) {
        this.announcementDate = [];
        this.dialogFormShow = true; // 打开弹出框
        this.formConfirmLoading = false;
      },
      // 点击确定后的触发事件
      dialogConfirm(formName) {
        this.formConfirmLoading = true;
        this.form.announcementDate = `${this.convertDate(this.announcementDate[0])} - ${this.convertDate(this.announcementDate[1])}`;
        Notice.create(this.form.announcementDate, this.form.announcementText,
        this.form.announcementTitle).then((res) => {
          if (res.data.code === 0) {
            this.$bus.$emit('data/list');
            this.$message({
              type: 'success',
              message: '新增成功',
            });
          }
          this.formConfirmLoading = false;
          this.dialogFormShow = false;
        });
      },
      // 点击取消后的触发事件
      dialogCancel(res) {
        this.form = {};
        this.formConfirmLoading = false;
        this.dialogFormShow = false;
      },
      // 关闭窗口后的触发事件
      CloseDialog() {
        this.dialogFormShow = false;
      },
      // 转换日期 YYYY-MM-DD
      convertDate(date, type) {
        return convert.convertDate(date, type);
      },
    },
  };
</script>
