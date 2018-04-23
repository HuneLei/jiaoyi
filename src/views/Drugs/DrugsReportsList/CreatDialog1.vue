<template>
  <div class="w_DRdialog">
    <DialogForm :dialog-form-visible="dialogFormShow" @close-dialog="CloseDialog" @dialog-confirm="dialogConfirm" @dialog-cancel="dialogCancel" :message="editMessage" :from-dialog="form" :isFormConfirm="true" :formConfirmLoading="formConfirmLoading">
      <el-form-item label="卖方会员" prop="salerMemberId" slot='salerMemberId' label-width="115px" v-if="getPrincipal.memberType === 4 || getPrincipal.memberType === 5">
        <el-select v-model="form.salerMemberId" placeholder="请选择卖方会员" filterable>
          <el-option v-for="item in SalerOptions" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卖方会员" prop="memberName" slot='salerMemberId' label-width="115px" v-if="getPrincipal.memberType === 1 || getPrincipal.memberType === 2">
        <el-input v-model="getPrincipal.memberName"  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="GPO" prop="gpoMemberId" slot='gpoMemberId' label-width="115px">
        <el-select v-model="form.gpoMemberId" placeholder="请选择GPO">
          <el-option v-for="item in gpoOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="药检报告" prop="drugsReportFile" slot='drugsReportFile' label-width="115px">
        <!--<YUploadEdit :fileList="uploadData" :showBriefOther="true" :signData="signData" @upload-result="uploadResult" :isDisabled="false" :isReadonly="false"></YUploadEdit>-->
        <!--<el-upload
          ref="upload"
          class="upload-demo"
          :multiple="true"
          :with-credentials="true"
          :auto-upload="true"
          :accept="fileType"
          :action="uploadHost"
          :on-preview="onPreview"
          :on-remove="onRemove"
          :on-success="onSuccess"
          :on-error="onError"
          :file-list="uploadData">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传图片</div>
        </el-upload>-->
          <YUploadEdit
            :fileList="uploadData"
            :image="true"
            :pdf="false"
            :signature="true"
            :showBriefOther="true"
            @upload-result="uploadResult"
            :isDisabled="false"
            :isReadonly="false"
            @file-click="onPreview"
            @return-click="returnUploadResult">
          </YUploadEdit>
      </el-form-item>
      <el-form-item label="药品" :prop="drugsRead ? 'drugsIds' : 'drugsId'" slot='drugsId' label-width="115px" v-if="getPrincipal.memberType === 4 || getPrincipal.memberType === 5">
        <el-input v-model="form.drugsName" :placeholder="drugsRead ? '' : '请选择药品'" readonly  :disabled="drugsRead">
          <el-button slot="append" icon="search" @click="showDialog('memberId')" v-if="!drugsRead"></el-button>
        </el-input>

      </el-form-item>
      <el-form-item label="药品" prop="drugsId" slot='drugsId' label-width="115px" v-else>
        <el-input v-model="form.drugsName" readonly icon="search" placeholder="请选择药品">
          <el-button slot="append" icon="search" @click="showDialog('memberId')"></el-button>
        </el-input>
      </el-form-item>
    </DialogForm>
    <InDialog :options="dialogOptions" @dialogSelect="dialogSelect"></InDialog>
    <DialogSignatureDrugsPic :signVisibleOut="signVisibleOut"
                     :signOptions="signOptions"
                     :btnIsDisabled="btnIsDisabled"
                     :btnIsLoading="btnIsLoading"
                     @to-upload="callBackSign"
                     @dialog-close="signDialogClose"></DialogSignatureDrugsPic>
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
  import config from '../../../config';
  import DialogForm from '../../../components/DialogForm'; // 表单弹出框
  import YUploadEdit from '../../../components/YUploadEdit'; // 表单弹出框
  import InDialog from './InDialog'; //  弹框
  import DrugsReportsList from '../../../api/Drugs/DrugsReportsList'; // APi
  import DialogSignatureDrugsPic from '../../../components/DialogSignature/DialogSignatureDrugsPic';
  import gpo from './../../../api/gpo';

  export default {
    activated() {
      this.$bus.$on('creat/dialog', this.dataCreate);
    },
    deactivated() {
      this.$bus.$off('creat/dialog', this.dataCreate);
    },
    components: {
      DialogForm,
      DialogSignatureDrugsPic,
      InDialog,
    },
    computed: {
      salerMemberId() {
        return this.form.salerMemberId;
      },
      memberName() {
        return this.$store.state.view.principal.memberName;
      },
      uploadHost() {
        return `${config.uploadHost}?access_token=${config.getToken()}`;
      },
      getPrincipal() {
        return this.$store.state.view.principal;
      },
      ...mapGetters([
        'gpoOptions',
        'getGpoId',
        'View_UserInfo',
      ]),
    },
    watch: {
      salerMemberId() {
        this.drugsRead = false;
        this.form.drugsName = '';
        this.form.drugsId = null;
      },
      memberName() {
        this.drugsRead = false;
      }
    },
    data() {
      return {
        fileType: 'image/*',
        drugsRead: true, // 药品禁用
        dialogFormShow: false, // 弹出框显示隐藏控制
        formConfirmLoading: false, // 确定按钮loding
        dialogOptions: {
          msgBase: '', //  没什么卵用，有需要可以看看
          isShowDialog: false, //  显示弹框
          tableSelected: [], //  默认表格选中
          tableType: 0, //  0 单选，1 多选 默认单选
        },
        isReadonly: false,
        editMessage: {
          dialogTitle: '新增药检报告',
          selects: [
            { value: 'salerMemberId', type: 'custom' }, // 卖方会员
            { value: 'gpoMemberId', type: 'custom' }, // GPO
            { value: 'drugsId', type: 'custom' }, // 药品
            { label: '批号', key: 'batchNo', type: 'el-input', placeholder: '请输入批号' },
            { value: 'drugsReportFile', type: 'custom' }, // 附件
          ],
          options: {},
          checkbox: {},
          radios: {},
          rules: {
            salerMemberId: [
              { required: true, type: 'number', message: '请选择卖方会员', trigger: 'change' },
            ],
            gpoMemberId: [
              { required: true, type: 'number', message: '请选择GPO', trigger: 'change' },
            ],
            batchNo: [
              { required: true, message: '请输入批号', trigger: 'blur' },
            ],
            drugsId: [
              { required: true, type: 'number', message: '请选择药品', trigger: 'change' },
            ],
            drugsReportFile: [
              { required: true, message: '请上传药检报告', validator: window.validator.enclosure, trigger: 'change' },
            ],
            drugsIds: [
              { required: true, validator: window.validator.returnTrue, trigger: 'blur' },
            ],
          },
          styleObject: {},
        },
        form: {
          salerMemberId: null,
          gpoMemberId: null,
          drugsName: null,
          drugsCode: null,
          drugsId: null,
          batchNo: null,
          drugsReportFile: null,
        },
        uploadData: [], //  上传文件
        SalerOptions: [],
        // 签章字段
        signOptions: {
          signTitle: '',                  //  弹出框标题
          url: null,
          oldUrl: null,
          index: null,
          urls: null,
          x: null,
          y: null,
        },
        btnIsDisabled: {
          signature: false,
        },
        btnIsLoading: {
          signature: false,
        },
        signVisibleOut: false,
      };
    },
    methods: {
      signDialogClose() {
        this.signVisibleOut = false;
      },
      callBackSign(result, index, x , y) {
        // console.log();
        // console.log();
        // console.log();
        // 签章按钮不可操作
        // this.btnIsDisabled.signature = true;
        // 签章后回调
        for (let i = 0; i < this.uploadData.length; i += 1) {
          if (this.uploadData[i].index === index) {
            this.uploadData[i].url = result;
            this.uploadData[i].gStamp = 1;
            this.uploadData[i].y = y;
            this.uploadData[i].x = x;
          }
        }
        this.form.drugsReportFile = JSON.stringify(this.uploadData);
        // console.log();
      },
      // 弹出签章
      onPreview(file, item) {
        // console.log();
        gpo.sealImage('seal01').then((res) => {
          let status1 = false;
          let status2 = false;
          this.signVisibleOut = true;
          // 显示签证按钮
          this.btnIsDisabled.signature = false;
          this.signOptions.signTitle = '药检报告签章';
          this.signOptions.url = file.url;
          this.signOptions.oldUrl = file.oldUrl;
          this.signOptions.index = file.index;
          if (file.x) {
            this.signOptions.x = file.x;
          } else {
            this.signOptions.x = 0;
          }
          if (file.y) {
            this.signOptions.y = file.y;
          } else {
            this.signOptions.y = 0;
          }
          if (res.data.code === 0) {
            this.signOptions.urls = res.data.result;
            status1 = true;
          } else {
            status1 = false;
          }
          if (this.View_UserInfo.memberType === 4) {
            status2 = true;
          } else {
            status2 = false;
          }
          // console.log();
          // console.log();
          if (status1 && status2) {
            this.btnIsDisabled.signature = false;
          } else {
            this.btnIsDisabled.signature = true;
          }
        });
      },
      // 返回结果数组
      returnUploadResult(fileList, response, oldUrl) {
        let arr = [];
        let fileRaw = '';
        let previewImg = '';
        let fileName = '';
        let url = null;
        if (response) url = response.data.result;
        for (let i = 0; i < fileList.length; i += 1) {
          try {
            fileRaw = fileList[i].raw.type;
            fileName = fileList[i].name;
            previewImg = fileList[i].url;
          } catch (error) {
            fileRaw = fileList[i].type;
            fileName = fileList[i].name;
            previewImg = fileList[i].url;
          }
          let type = 'image';
          if (fileRaw === 'application/pdf' || fileRaw === 'pdf') {
            type = 'pdf';
          }
          if (fileList[i].gStamp) {
            arr.push({
              name: fileName,
              index: i + 1,
              type,
              url: fileList[i].url,
              oldUrl: fileList[i].oldUrl,
              gStamp: 1,
              x: fileList[i].x,
              y: fileList[i].y,
              status: fileList[i].percentage < 100 ? 'uploading' : 'success',
              percentage: fileList[i].percentage,
            });
          } else {
            arr.push({
              name: fileName,
              index: i + 1,
              type,
              url,
              oldUrl: url,
              gStamp: 0,
              status: fileList[i].percentage < 100 ? 'uploading' : 'success',
              percentage: fileList[i].percentage,
            });
          }
        }
        // console.log();
        try {
          arr = JSON.stringify(arr);
        } catch (error) {
          this.$message({
            type: 'error',
            message: '上传失败',
          });
        }
        this.uploadData = JSON.parse(arr);
        // console.log();
        this.form.drugsReportFile = arr;
      },
      // 上传
      uploadResult(res) {
        this.form.drugsReportFile = res;
        this.uploadData = this.convert.getJSON(this.form.drugsReportFile);
      },
      // 点击新增触发事件
      dataCreate(row) {
        this.drugsRead = true;
        this.SalerAll();
        this.form = {
          salerMemberId: null,
          gpoMemberId: null,
          drugsCode: null,
          drugsName: null,
          drugsId: null,
          batchNo: null,
          drugsReportFile: null,
        };
        this.uploadData = [];
        this.form.gpoMemberId = this.getGpoId;
        this.dialogFormShow = true; // 打开弹出框
      },
      // 卖方会员下拉
      SalerAll() {
        DrugsReportsList.SalerAll().then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.SalerOptions = data;
          }
        });
      },
      // 点击确定后的触发事件
      dialogConfirm(formName) {
        // console.log();
        DrugsReportsList.create(this.form.batchNo, this.form.drugsCode, this.form.drugsId, this.form.drugsReportFile,
        this.form.gpoMemberId, this.form.salerMemberId || this.getPrincipal.memberId).then((res) => {
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
        this.dialogFormShow = false;
      },
      // 关闭窗口后的触发事件
      CloseDialog() {
        this.dialogFormShow = false;
      },
      // 弹出医疗机构选择框
      showDialog() {
        this.dialogOptions.gpoMemberId = this.getGpoId;
        this.dialogOptions.enrollId = this.form.salerMemberId || this.getPrincipal.memberId;
        this.dialogOptions.isShowDialog = true; // 打开弹出框
      },
      //  弹出框选择之后确定事件
      dialogSelect(rows, msgBase, msgCom) {
        // console.log();
        this.form.drugsId = rows[0].id;
        this.form.drugsCode = rows[0].drugsCode;
        this.form.drugsName = rows[0].drugsName;
      },
    },
  };
</script>
<style>
  .w_DRdialog .el-pload-edit .el-upload__tip{
    right: -10px;
  }
</style>
