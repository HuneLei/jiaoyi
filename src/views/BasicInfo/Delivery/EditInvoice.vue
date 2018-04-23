<template>
  <div>
    <DialogForm :dialog-form-visible="dialogFormShow"
                @close-dialog="CloseDialog"
                @dialog-cancel="dialogCancel"
                :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false"
                :message="editMessage"
                :from-dialog="form"
                :isReadonly="false"
                :isSaveShow="isSaveShow"
                :saveLoading="saveLoading"
                @data-save="dataSave">
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

  import DialogForm from '../../../components/DialogForm'; // 表单弹出框
  import delivery from '../../../api/BasicInfo/Delivery';   // api -- 医疗机构

  export default {
    activated() {
      // 监听数据更新
      this.$bus.$on('data/updateInvoice', this.dataUpdate);
    },
    deactivated() {
      // 移除监听数据更新
      this.$bus.$off('data/updateInvoice', this.dataUpdate);
    },
    components: {
      DialogForm,
    },
    data() {
      // 不能为空的验证
      const verifyNull = (rule, value, callback) => {
        this.$data.editMessage.rules.provinceId[0].trigger = 'blur,change';
        this.$data.editMessage.rules.cityId[0].trigger = 'blur,change';
        this.$data.editMessage.rules.countyId[0].trigger = 'blur,change';
        let error = '';
        if (!value) {
          error = callback(new Error('不能为空'));
        } else {
          error = callback();
        }
        return error;
      };
      return {
        isSaveShow: true,           // 保存按钮显示控制
        saveLoading: false,         // 保存按钮loading显示控制
        // 需要提交的字段
        form: {
          id: null,
          outGpoNo: null,
        },
        dialogFormShow: false,      // 弹出框显示隐藏控制
        editMessage: {
          // 写入表单组件的数据
          selects: [
            { label: '联系人', key: 'outGpoNo', type: 'el-input', placeholder: '请输入发货联系人' },
            { label: '联系电话', key: 'outGpoNo', type: 'el-input', placeholder: '请输入联系电话' },
          ],
          // 弹出框标题
          dialogTitle: '编辑',
          options: {
            // 省下拉选项
            provinceOption: [],
            // 市下拉选项
            cityOption: [],
            // 区下拉选项
            areaOption: [],
          },
          // checkbox选项值
          checkbox: {},
          // radios选项值
          radios: {},
          // 验证规则
          rules: {
            outGpoNo: [
              { required: true, message: '请输入经营企业外部编码', trigger: 'blur' },
            ],
          },
          styleObject: {},
        },
      };
    },
    methods: {
      dataUpdate(row) {
        this.form = {
          id: Number(row.id),
          outGpoNo: row.outGpoNo,
        };
        this.dialogFormShow = true;             // 打开弹出框
      },
      dataSave() {
        delivery.update(this.form.id, this.form.outGpoNo)
          .then((res) => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '编辑成功',
              });
              this.$bus.$emit('data/list');
              this.empty();
            }
          });
      },
      // 点击取消后的触发事件
      dialogCancel(res) {
        this.empty();
        // this.dialogVisible = true;
      },
      // 关闭窗口后的触发事件
      CloseDialog() {
        // 关闭保存Loading
        this.saveLoading = false;
        // 关闭弹出表单
        this.dialogFormShow = false;
        this.empty();
      },
      empty() {
        this.form = {
          id: null,
          outGpoNo: null,
        };
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
