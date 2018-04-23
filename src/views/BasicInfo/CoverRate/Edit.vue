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
      <el-form-item label="关联机构"  prop="hospital" slot='hospital' label-width="115px">
        <el-input v-model="hospitalName" readonly placeholder="请选择关联机构">
          <el-button slot="append" icon="search" @click="showDialog()"></el-button>
        </el-input>
      </el-form-item>
      <!--<el-form-item label="关联机构" prop="mechanismName">-->
        <!--<el-input v-model="form.mechanismName" placeholder="请选择关联机构" :readonly="true">-->
          <!--<el-button v-if="form.memberType === 1" slot="append" icon="search" @click="showDialog('enterPrise')"></el-button>-->
          <!--<el-button v-if="form.memberType === 2" slot="append" icon="search" @click="showDialog('enterPrise2')"></el-button>-->
          <!--<el-button v-if="form.memberType === 3" slot="append" icon="search" @click="showDialog('hospital')"></el-button>-->
          <!--<el-button v-if="form.memberType === 4" slot="append" icon="search" @click="showDialog('gpo')"></el-button>-->
        <!--</el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="配送协议"  prop="deliverProtocol" slot='deliverProtocol' label-width="115px">
        <YUploadEdit :fileList="uploadData" :showBrief="false" :multi="false" @upload-result="uploadResult"></YUploadEdit>
      </el-form-item>
    </DialogForm>
    <el-dialog
      :title="enclosure.name"
      :visible.sync="dialogVisible"
      size="small">
      <img :src="enclosure.url" width="100%">
    </el-dialog>
    <ShowHospital :options="dialogOptions" :row="row" @dialog-hide="dialogHide" @dialogSelect="dialogSelect"></ShowHospital>
  </div>
</template>

<script>
  /**
   * Created by lqy on 2017/9/4.
   * <p>
   * 江苏摇铃网络科技有限公司，版权所有。
   * Copyright (C) 2015-2017 All Rights Reserved.
   */

  import CoverRate from '../../../api/BasicInfo/CoverRate';    // 接口API
  import DialogForm from '../../../components/DialogForm';    // 表单弹出框
  import YUploadEdit from '../../../components/YUploadEdit';  // 表单弹出框
  import ShowHospital from './ShowHospital';                  // 医疗机构弹窗

  export default {
    activated() {
      // 监听数据创建
      this.$bus.$on('data/page/do', this.dataCreate);
      // 查看协议
      this.$bus.$on('details/show', this.detailsShow);
    },
    deactivated() {
      // 移除监听数据创建
      this.$bus.$off('data/page/do', this.dataCreate);
      // 查看协议
      this.$bus.$off('details/show', this.detailsShow);
    },
    components: {
      DialogForm,
      YUploadEdit,
      ShowHospital,
    },
    data() {
      // 医疗机构名称
      const validateHospital = (rule, value, callback) => {
        let error = '';
        if (!this.$data.hospitalName) {
          this.$data.editMessage.rules.hospital[0].trigger = 'blur,change';
          error = callback(new Error('请选择医疗机构名称'));
        } else {
          error = callback();
        }
        return error;
      };
      return {
        enclosure: '',
        row: '',
        dialogOptions: {
          msgBase: '',                        //  没什么卵用，有需要可以看看
          isShowDialog: false,                //  显示弹框
          tableSelected: null,                //  默认表格选中
          tableType: 0,                       //  0 单选，1 多选 默认单选
        },
        isReadonly: false,
        dialogVisible: false,
        isFormConfirm: false,       // 确定按钮显示控制
        formConfirmLoading: false,  // 确定按钮loading显示控制
        isSaveShow: true,           // 保存按钮显示控制
        saveLoading: false,         // 保存按钮loading显示控制
        isSubmitShow: false,        // 提交按钮显示控制
        submitLoading: false,       // 提交按钮loading显示控制
        // 显示界面的字段
        hospitalName: null,
        // 需要提交的字段
        form: {
          deliverProtocol: '',   // 配送协议
          enterpriseId: '',      // 医疗机构ID
        },
        dialogFormShow: false,      // 弹出框显示隐藏控制
        editMessage: {
          // 写入表单组件的数据
          selects: [
            { value: 'hospital', type: 'custom' },
            { value: 'deliverProtocol', type: 'custom' },
          ],
          // 弹出框标题
          dialogTitle: '新增医疗机构',
          options: {},
          // checkbox选项值
          checkbox: {},
          // radios选项值
          radios: {},
          // 验证规则
          rules: {
            hospital: [
              { required: true, message: '请选择医疗机构名称', validator: validateHospital, trigger: 'change' },
            ],
            deliverProtocol: [
              { required: true, message: '请选择配送协议', trigger: 'blur' },
            ],
          },
          styleObject: {},
        },
        uploadData: [], //  上传文件
      };
    },
    methods: {
      // 上传
      uploadResult(res) {
        this.form.deliverProtocol = res;
        this.uploadData = this.convert.getJSON(this.form.deliverProtocol);
      },
      // 点击新增触发事件
      dataCreate() {
        this.isSaveShow = true; // 显示保存按钮
        // 表单清空
        this.form = {};
        this.uploadData = [];
        this.editType = 0;  // 新增
        this.editMessage.dialogTitle = '新增医疗机构';
        this.dialogFormShow = true;   // 打开弹出框
      },
      // 点击保存后的触发事件
      dataSave(formName) {
        this.saveLoading = true;      // 保存按钮loading开启
        this.dataSubmitCreate();
      },
      // 查看协议详情 预览附件
      detailsShow(row) {
        CoverRate.item(row.id).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            // 协议
            this.dialogVisible = true;
            this.enclosure = JSON.parse(data.deliverProtocol)[0];
          }
        });
      },
      // 提交创建  create
      dataSubmitCreate() {
        CoverRate.create(this.form).then((res) => {
          if (res.data.code === 0) {
            this.$bus.$emit('data/list');
            this.$message({
              type: 'success',
              message: '新增成功',
            });
            this.CloseDialog();  // 关闭窗口
          } else {
            this.saveLoading = false; // 关闭保存Loading
          }
        });
        this.emptyForm();
      },
      // 点击取消后的触发事件
      dialogCancel(res) {
        this.emptyForm();
      },
      // 关闭窗口后的触发事件
      CloseDialog() {
        // 关闭保存Loading
        this.saveLoading = false;
        // 关闭弹出表单
        this.dialogFormShow = false;
      },
      // 弹出医疗机构选择框
      showDialog() {
        this.dialogOptions.isShowDialog = true;  // 打开弹出框
      },
      // 关闭弹出框
      dialogHide() {
        this.dialogOptions.isShowDialog = false;  // 关闭弹出框
      },
      //  弹出框选择之后确定事件
      dialogSelect(rows, msgBase, msgCom) {
        if (rows[0]) {
          this.hospitalName = rows[0].hospitalName;      // 医疗机构名称
          this.form.hospitalId = rows[0].id;        // 医疗机构ID
        } else {
          this.hospitalName = null;      // 医疗机构名称
          this.form.hospitalId = null;   // 医疗机构ID
        }
      },
      // 清空表单数据
      emptyForm() {
        this.hospitalName = null;
        this.uploadData = [];
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
