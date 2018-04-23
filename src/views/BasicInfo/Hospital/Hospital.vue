<template>
  <div>
    <DialogForm :dialog-form-visible="dialogFormShow" @close-dialog="CloseDialog" @dialog-confirm="dialogConfirm" @dialog-cancel="dialogCancel" :message="editMessage" :from-dialog="form" :isFormConfirm="true" :formConfirmLoading="formConfirmLoading">

      <el-form-item label="医疗机构" prop="hospitalName" slot="hospitalName" label-width="115px">
        <el-input v-model="form.hospitalName" placeholder="请选择医疗机构">
          <el-button slot="append" icon="search" @click="showDialog('hospitalMemberId')"></el-button>
        </el-input>
      </el-form-item>

    </DialogForm>
    <HospitalList :options="optionsMember" @dialogSelect="dialogSelect"></HospitalList>
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
import DialogForm from '../../../components/DialogForm'; // 表单弹出框
import hospital from '../../../api/BasicInfo/Hospital';   // api -- 医疗机构
import common from '../../../api/common';
import HospitalList from './HospitalList';   // 医疗机构列表

export default {
  activated() {
    // 监听数据更新
    this.$bus.$on('data/choosehospital', this.dataUpdate);
  },
  deactivated() {
    // 移除监听数据更新
    this.$bus.$off('data/choosehospital', this.dataUpdate);
  },
  components: {
    DialogForm,
    HospitalList,
  },
  computed: {
    ...mapGetters([
      'getGpoId',
    ]),
  },
  data() {
    return {
      formConfirmLoading: false,         // 保存按钮loading显示控制
      // 需要提交的字段
      form: {
        gpoMemberId: '',
        projectId: '',
        mechanismId: '',
        memberId: '',
        hospitalCode: null,
        hospitalName: null,
      },
      optionsMember: {},
      tagsId: {                           //  多选标签id
        hospitalMemberId: [],
      },
      changInfo: 0,
      dialogFormShow: false,      // 弹出框显示隐藏控制
      editMessage: {
        // 写入表单组件的数据
        selects: [
          { label: '集采项目', key: 'projectId', type: 'el-select', placeholder: '请选择集采项目', option: 'projectOption', noClearable: true },
          {
            value: 'hospitalName',
            type: 'custom',
          },
        ],
        // 弹出框标题
        dialogTitle: '编辑',
        options: {
          projectOption: [],
        },
        // checkbox选项值
        checkbox: {},
        // radios选项值
        radios: {},
        // 验证规则
        rules: {
          projectId: [
            { required: true, validator: window.validator.dialogInput, message: '请选择集采项目', trigger: 'change, blur' },
          ],
          hospitalName: [
            { required: true, message: '请选择医疗机构', validator: window.validator.returnTrue, trigger: 'blur' },
          ],
        },
        styleObject: {},
        arr: [],
      },
    };
  },
  methods: {
    dataUpdate(row) {
      this.dialogFormShow = true;             // 打开弹出框
      if (this.getGpoId) {
        hospital.all(this.getGpoId).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            const projectOptions = [];
            for (let i = 0; i < data.length; i += 1) {
              projectOptions.push({
                value: data[i].id,
                label: data[i].name,
              });
            }
            this.editMessage.options.projectOption = projectOptions;
          }
        });
      }
    },
    //  点击触发
    showDialog(msg) {
      switch (msg) {
        case 'hospitalMemberId':
          this.optionsMember = {
            msgBase: msg,                                 //  弹框返回数据属于那个区域，可为空
            isShowDialog: true,                           //  弹框是否显示
            tableSelected: this.tagsId[msg],            //  弹框表格默认选中项
            tableType: 0,                                 //  弹框表格选择类型  0 单选  1 多选
          };
          break;
        default:
          break;
      }
    },
    //  弹出框选择之后确定事件
    dialogSelect(rows, msgBase, msgCom) {
      this.arr = [];
      this.arr = rows;
      if (rows.length > 0) {
        this.tagsId[msgBase] = [rows[0].id];  // 单选
      } else {
        this.tagsId[msgBase] = [];
      }
      // 返回会员ID
      if (msgBase === 'hospitalMemberId' && rows.length > 0) {
        this.form.hospitalCode = rows[0].hospitalCode;
        this.form.hospitalName = rows[0].hospitalName;
      } else if (msgBase === 'hospitalMemberId' && rows.length === 0) {
        this.form.hospitalCode = '';
        this.form.hospitalName = '';
      }
    },
    dialogConfirm(formName) {
      if (!this.form.projectId) {
        this.$message({
          type: 'error',
          message: '请选择集采项目',
        });
      }
      if (!this.form.hospitalName) {
        this.$message({
          type: 'error',
          message: '请选择医疗机构',
        });
      }
      this.formConfirmLoading = true;
      const form = Object.assign({}, {
        gpoMemberId: this.getGpoId,
        mechanismId: this.arr[0].mechanismId,
        memberId: this.arr[0].memberId,
        projectId: this.form.projectId,
      });
      hospital.create(form)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '新增成功',
            });
            this.$bus.$emit('data/list');
          }
          this.dialogFormShow = false;
        });
    },
    // 点击取消后的触发事件
    dialogCancel(res) {
      this.form = {};
      this.dialogFormShow = false;
      this.formConfirmLoading = false;
    },
    // 关闭窗口后的触发事件
    CloseDialog() {
      // 关闭保存Loading
      this.formConfirmLoading = false;
      // 关闭弹出表单
      this.dialogFormShow = false;
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
