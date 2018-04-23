<template>
  <div class="w_DRdialog">
    <DialogForm :dialog-form-loading="DialogFormLoading" :dialog-form-visible="dialogFormShow" @close-dialog="CloseDialog" @dialog-confirm="dialogConfirm" @dialog-cancel="dialogCancel" :message="editMessage" :from-dialog="form" :isFormConfirm="true" :formConfirmLoading="formConfirmLoading">
      <el-form-item label="卖方会员" prop="salerMemberId" slot='salerMemberId' label-width="115px" v-if="getPrincipal.memberType === 4 || getPrincipal.memberType === 5">
        <el-select v-model="form.salerMemberId" placeholder="请选择卖方会员" filterable>
          <el-option v-for="item in SalerOptions" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卖方会员" slot='salerMemberId' label-width="115px" v-if="getPrincipal.memberType === 1 || getPrincipal.memberType === 2">
        <el-input v-model="form.salerMemberName"  :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="GPO" prop="gpoMemberId" slot='gpoMemberId' label-width="115px">
        <el-select v-model="form.gpoMemberId" placeholder="请选择GPO">
          <el-option v-for="item in gpoOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="药检报告" prop="drugsReportFile" slot='drugsReportFile' label-width="115px">
        <YUploadEdit
          :multi="true"
          :fileList="uploadData"
          :image="true"
          :pdf="false"
          :signature="true"
          :showBriefOther="true"
          :isDisabled="false"
          :isReadonly="false"
          @file-click="onPreview"
          @return-click="returnUploadResult">
        </YUploadEdit>
      </el-form-item>
    </DialogForm>
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
  import DialogForm from '../../../components/DialogForm'; // 表单弹出框
  import InDialog from './InDialog'; //  弹框
  import DrugsReportsList from '../../../api/Drugs/DrugsReportsList'; // APi
  import convert from '../../../utils/convert';                         //  自定义转换js
  import DialogSignatureDrugsPic from '../../../components/DialogSignature/DialogSignatureDrugsPic';
  import gpo from './../../../api/gpo';

  export default {
    activated() {
      this.$bus.$on('edit/dialog', this.dataUpdate);
    },
    deactivated() {
      this.$bus.$off('edit/dialog', this.dataUpdate);
    },
    components: {
      DialogForm,
      DialogSignatureDrugsPic,
    },
    computed: {
      getPrincipal() {
        return this.$store.state.view.principal;
      },
      ...mapGetters([
        'gpoOptions',
        'getGpoId',
        'View_UserInfo',
      ]),
    },
    data() {
      return {
        fileType: {
          image: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
          pdf: 'application/pdf',
          excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
          word: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword',
        },
        dialogFormShow: false, // 弹出框显示隐藏控制
        formConfirmLoading: false, // 确定按钮loding
        DialogFormLoading: false,
        isReadonly: false,
        editMessage: {
          dialogTitle: '编辑药检报告',
          selects: [
            { value: 'salerMemberId', type: 'custom' }, // 卖方会员
            { value: 'gpoMemberId', type: 'custom' },   // GPO
            { label: '药品', key: 'drugsName', type: 'el-input', isReadonly: true },
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
              { message: '不得超过256位字符', max: 256 },
            ],
            drugsReportFile: [
              { required: true, message: '请上传药检报告', validator: window.validator.enclosure, trigger: 'change' },
            ],
          },
          styleObject: {},
        },
        isDeliveryStamp: null,
        form: {
          id: null,
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
        signData: {
          isShowSign: true,
          signDisabled: false,
        },
        // 签章字段
        signOptions: {
          signTitle: '',                  //  弹出框标题
          url: null,
          oldUrl: null,
          index: null,
          urls: null,
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
      signDialogClose(result) {
        this.signVisibleOut = false;
      },
      callBackSign(result, index, x, y) {
        // 签章按钮不可操作
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
          let status3 = false;
          this.signVisibleOut = true;
          // 显示签证按钮
          this.btnIsDisabled.signature = false;
          this.signOptions.signTitle = '药检报告签章';
          this.signOptions.url = file.url;
          this.signOptions.oldUrl = file.oldUrl;
          this.signOptions.index = file.index;
          this.signOptions.x = file.x;
          this.signOptions.y = file.y;
          // 卖方会员
          if (this.View_UserInfo.memberType === 1 || this.View_UserInfo.memberType === 2 || this.View_UserInfo.memberType === 5) {
            this.signOptions.oldUrl = file.url;
            status1 = false;
          } else {
            this.signOptions.urls = res.data.result;
            status1 = true;
          }
          // 判断是否为GPO会员
          if (this.View_UserInfo.memberType === 4) {
            status2 = true;
          } else {
            status2 = false;
          }
          // 判断是否有签章存在
          if (res.data.code === 0) {
            status3 = true;
          } else {
            status3 = false;
          }
          // console.log();
          // console.log();
          // console.log();
          if (status1 && status2 && status3) {
            this.btnIsDisabled.signature = false;
          } else {
            this.btnIsDisabled.signature = true;
          }
        });
      },
      // 返回结果数组
      returnUploadResult(fileList, response, oldUrl) {
        let arr = fileList;
        let data = {};
        let url = null;
        if (response) url = response.data.result;
        for (let i = 0; i < fileList.length; i += 1) {
          // console.log();
          const item = fileList[i];
          let type = 'image';
          if (item.type === this.fileType.pdf || item.type === 'pdf') {
            type = 'pdf';
          }
          if (this.fileType.excel.indexOf(item.type) > -1 || item.type === 'excel') {
            type = 'excel';
          }
          if (this.fileType.word.indexOf(item.type) > -1 || item.type === 'word') {
            type = 'word';
          }
          if (url && oldUrl && oldUrl === item.url) {
            if (item.gStamp) {
              data = {
                type,
                url: item.url,
                oldUrl: item.oldUrl,
                name: item.name,
                uid: item.uid,
                status: 'success',
                percentage: 100,
                index: i + 1,
                gStamp: 1,
                x: fileList[i].x,
                y: fileList[i].y,
              };
            } else {
              data = {
                type,
                url: url,
                oldUrl: url,
                name: item.name,
                uid: item.uid,
                status: 'success',
                percentage: 100,
                index: i + 1,
                gStamp: 0,
              };
            }
            arr[i] = data;
            break;
          }
        }
        try {
          arr = JSON.stringify(arr);
        } catch (error) {
          this.$message({
            type: 'error',
            message: '上传失败',
          });
        }
        this.uploadResult(arr);
      },
      uploadResult(res) {
        this.form.drugsReportFile = res;
        this.uploadData = this.convert.getJSON(this.form.drugsReportFile);
        // console.log();
      },
      // 点击触发事件
      dataUpdate(row) {
        this.dialogFormShow = true; // 打开弹出框
        this.SalerAll();
        this.DialogFormLoading = true;
        this.formConfirmLoading = false;
        DrugsReportsList.item(row.id).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.form = {
              id: data.id,
              salerMemberId: data.salerMemberId,
              salerMemberName: data.salerMemberName,
              gpoMemberId: data.gpoMemberId,
              drugsCode: data.drugsCode,
              drugsName: data.drugsName,
              drugsId: data.drugsId,
              batchNo: data.batchNo,
              drugsReportFile: data.drugsReportFile,
            };
            this.isDeliveryStamp = data.isDeliveryStamp;
            this.uploadData = [];
            // 附件信息
            if (typeof (this.toJSON(data.drugsReportFile)) === 'object') {
              this.uploadData = this.toJSON(data.drugsReportFile);
            }
            this.DialogFormLoading = false;
          }
        });
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
        DrugsReportsList.update(this.form.id, this.form.batchNo, this.form.drugsCode, this.form.drugsId,
        this.form.drugsReportFile, this.form.gpoMemberId,
        this.form.salerMemberId).then((res) => {
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
      },
      // 点击取消后的触发事件
      dialogCancel(res) {
        this.formConfirmLoading = false;
        this.DialogFormLoading = false;
        this.dialogFormShow = false;
      },
      // 关闭窗口后的触发事件
      CloseDialog() {
        this.dialogFormShow = false;
      },
      //  json字符串转json，否则还是返回字符串
      toJSON(str) {
        return convert.toJSON(str);
      },
    },
  };
</script>
<style>
  .w_DRdialog .el-pload-edit .el-upload__tip{
    right: -10px;
  }
</style>
