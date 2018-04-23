<template>
  <div>
    <DialogForm :dialog-form-loading="DialogFormLoading" :dialog-form-visible="dialogFormShow" @close-dialog="CloseDialog" @dialog-confirm="dialogConfirm" @dialog-cancel="dialogCancel" :message="editMessage" :from-dialog="form" :isFormConfirm="true" :formConfirmLoading="formConfirmLoading">
      <el-form-item label="回款日期" prop="datetime" slot='datetime' label-width="115px">
        <el-date-picker v-model.trim="form.datetime" format="yyyy-MM-dd" type="datetime" :picker-options="pickerOptions2" placeholder="请选择回款日期">
        </el-date-picker>
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
import convert from '../../../utils/convert';                         //  自定义转换js
import InvoiceList from '../../../api/Invoice/InvoiceList';

export default {
  activated() {
    this.form.datetime = null;
    this.$bus.$on('returnMoney/dialog', this.returnMoney);
  },
  deactivated() {
    this.$bus.$off('returnMoney/dialog', this.returnMoney);
  },
  components: {
    DialogForm,
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
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          },
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - (3600 * 1000 * 24 * 7));
            picker.$emit('pick', date);
          },
        }, {
          text: '一月前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - (3600 * 1000 * 24 * 30));
            picker.$emit('pick', date);
          },
        }, {
          text: '一年前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - (3600 * 1000 * 24 * 365));
            picker.$emit('pick', date);
          },
        }],
      },
      form: {
        datetime: null,
      },
      editMessage: {
        dialogTitle: '填写回款日期',
        selects: [
          { value: 'datetime', type: 'custom' },
        ],
        options: {
        },
        checkbox: {},
        radios: {},
        rules: {
          datetime: [
            { required: true, type: 'date', message: '请输入回款日期', trigger: 'blur' },
          ],
        },
        styleObject: {},
      },
      ids: [],
    };
  },
  methods: {
    // 点击触发事件
    returnMoney(row) {
      this.dialogFormShow = true; // 打开弹出框
      this.ids = row;
    },
    // 点击确定后的触发事件
    dialogConfirm(formName) {
      if (this.form.type && (this.form.datetime === '' || this.form.datetime === undefined || this.form.datetime === null)) {
        this.$message({
          type: 'error',
          message: '请选择回款日期',
        });
        return false;
      }
      this.form.datetime = this.convertDate(this.form.datetime);
      const form = {
        id: this.ids,
        datetime: this.form.datetime,
        type: 1,
      };
      InvoiceList.returnMoney(form).then((res) => {
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
      return true;
    },
    // 点击取消后的触发事件
    dialogCancel(res) {
      this.dialogFormShow = false;
    },
    // 关闭窗口后的触发事件
    CloseDialog() {
    },
    // 转换日期 YYYY-MM-DD hh:mm:ss
    convertDate(str) {
      return convert.convertDate(str);
    },
  },
};
</script>
