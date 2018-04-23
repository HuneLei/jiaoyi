<template>
  <div>
    <DialogForm :dialog-form-visible="dialogFormShow" @close-dialog="CloseDialog" @dialog-confirm="dialogConfirm" @dialog-cancel="dialogCancel" :message="editMessage" :from-dialog="form" :isFormConfirm="true" :formConfirmLoading="formConfirmLoading" >
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
import ContractItem from '../../../api/Contract/ContractItem'; // 接口API
import TriContractList from '../../../api/Contract/TriContractList'; // 接口API
import DialogForm from '../../../components/DialogForm'; // 表单弹出框

export default {
  activated() {
    this.$bus.$on('changeEdit/dialog', this.dataCreate);
    this.$bus.$on('data/select', this.dataSelect);
  },
  deactivated() {
    this.$bus.$off('changeEdit/dialog', this.dataCreate);
    this.$bus.$off('data/select', this.dataSelect);
  },
  components: {
    DialogForm,
  },
  computed: {
    ...mapGetters([
      'getGpoId',
      'getProjectId',
    ]),
    remarksId() {
      return this.form.reason;
    },
  },
  watch: {
    'form.reason': 'watchForm',
    'form.remark': 'watchForm',
    remarksId(data) {
      if (data === '0') {
        this.form.remark = '';
      } else {
        const info = data.split('-');
        const remarks = !info[1] || info[1] === 'null' ? '' : info[1];
        this.form.remark = remarks;
      }
    },
  },
  data() {
    return {
      dialogFormShow: false, // 弹出框显示隐藏控制
      formConfirmLoading: false, // 确定按钮loding
      form: {
        reason: '',
        remark: null,
      },
      closeObj: {},
      closeObj1: {},
      closeArr: [],
      editMessage: {
        dialogTitle: '申请结案',
        selects: [
          { label: '结案原因', key: 'reason', type: 'el-select', placeholder: '请选择结案原因', option: 'reasonOption', noClearable: true },
          { label: '', key: 'remark', type: 'el-input', placeholder: '请输入合同结案原因', fromType: 'textarea', rows: 4 },
        ],
        options: {
          reasonOption: [],
        },
        checkbox: {},
        radios: {},
        rules: {
          reason: [
            { required: true, message: '请填写结案备注', trigger: 'change', validator: window.validator.select },
          ],
        },
        styleObject: {},
      },
    };
  },
  methods: {
    watchForm() {
      if (this.form.reason || this.form.remark) {
        this.closeObj = Object.assign({}, this.closeObj, this.form);
      }
    },
    // 得到选择合同时的值
    dataSelect(rows) {
      this.closeArr = [];
      for (let i = 0; i < rows.length; i += 1) {
        this.closeObj1 = Object.assign({}, this.closeObj1, {
          id: rows[i].id,
          deliveryMemberId: rows[i].deliveryMemberId,
          salerMemberId: rows[i].salerMemberId,
          projectId: rows[i].projectId,
        });
        this.closeArr.push(this.closeObj1);
      }
      this.closeObj = Object.assign({}, this.closeObj, {
        contractItemList: this.closeArr,
        // projectId: this.getProjectId,
      });
    },
    // 点击新增触发事件
    dataCreate(row) {
      this.dialogFormShow = true; // 打开弹出框
      const paramKey = 'HTJA';
      TriContractList.dropReason(paramKey)
        .then((res) => {
          const refuseOptions = [];
          if (res.data.code === 0) {
            const reasonlist = res.data.result;
            for (let i = 0; i < reasonlist.length; i += 1) {
              this.$set(refuseOptions, i, {
                label: reasonlist[i].paramValue,
                value: `${reasonlist[i].id}-${reasonlist[i].paramValue}`,
              });
            }
            refuseOptions.push({
              label: '其他',
              value: '0',
            });
            this.editMessage.options.reasonOption = Object.assign([], refuseOptions);
            this.dialogFormShow = true; // 打开弹出框
          }
        });
    },
    // 点击确定后的触发事件
    dialogConfirm() {
      this.$confirm('确定要发起合同明细结案?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        ContractItem.close(this.closeObj).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '成功发起合同明细结案申请',
            });
            this.$router.push({ path: '/Contract/ContractItem/applyCloseList', query: { data: res.data.result } });
          }
        });
        this.dialogFormShow = false;
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 点击取消后的触发事件
    dialogCancel(res) {
      this.dialogFormShow = false;
    },
    // 关闭窗口后的触发事件
    CloseDialog() {
      this.dialogFormShow = false;
    },
  },
};
</script>
