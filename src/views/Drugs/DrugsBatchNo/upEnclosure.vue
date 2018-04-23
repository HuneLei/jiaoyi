<template>
  <div class="w_upEnclosure">
    <el-dialog :title="enclosure.name" :visible.sync="dialogVisible" size="small" :before-close="handleClose">
      <img :src="enclosure.url" width="100%">
      <div v-if="SealShow" style="position: fixed;right: 20px;bottom: 70px;">
        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1505385736118&di=67132a8ae447aa03269bd8d7135991a2&imgtype=0&src=http%3A%2F%2Fe.hiphotos.baidu.com%2Fzhidao%2Fwh%253D450%252C600%2Fsign%3Dfb80e2b3d100baa1ba794fbf72209524%2F00e93901213fb80e1f514e8836d12f2eb83894e8.jpg" />
      </div>
      <span slot="footer" class="dialog-footer">
             <el-button type="info" @click="SealShow = true" style="float: left;"><i class="icon iconfont icon-qianzhang" style="margin-right: 5px;"></i>盖 章</el-button>
            <el-button type="primary" @click="dialogVisible = false"><i class="icon iconfont icon-right_circle"></i>确定</el-button>
            <el-button @click="dialogVisible = false"><i class="icon iconfont icon-jujue"></i>取消</el-button>
          </span>
    </el-dialog>

    <DialogForm :dialog-form-loading="DialogFormLoading" :dialog-form-visible="dialogFormShow" :isBackShow="true" :isCloseShow="false" @close-dialog="CloseDialog" @dialog-confirm="dialogConfirm" @dialog-cancel="dialogCancel" :message="editMessage" :from-dialog="form" :isReadonly="false" :isFormConfirm="false" :formConfirmLoading="formConfirmLoading">

      <div slot="drugsReportFile">
        <el-form-item label="药检报告">
          <ul class="el-upload-list el-upload-list--text" style="float: left;">
            <li class="el-upload-list__item is-success" v-for="enclosure in MyEnclosure">
              <a class="el-upload-list__item-name" @click="previewFile(enclosure)">
                <i class="el-icon-document"></i> {{ enclosure.name }}
                <span style="margin-left: 5px; color: blue;" v-if="enclosure.dStamp===1" >- 已盖章</span>
                <span style="margin-left: 5px; color: red;" v-else>- 未盖章</span>
              </a>
            </li>
          </ul>
          <div v-if="MyEnclosure.length === 0" style="color: rgb(191, 200, 217);">
            <p>无数据</p>
          </div>
        </el-form-item>
      </div>
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
  import convert from '../../../utils/convert'; //  自定义转换js
  import DialogForm from '../../../components/DialogForm'; // 表单弹出框
  import YUploadEdit from '../../../components/YUploadEdit'; // 表单弹出框
  import DrugsBatchNo from '../../../api/Drugs/DrugsBatchNo'; // 药品批号管理APi
  import DialogSignatureDrugsPic from '../../../components/DialogSignature/DialogSignatureDrugsPic';
  import gpo from './../../../api/gpo';

  export default {
    props: {
      row: null,
    },
    activated() {
      this.$bus.$on('upEnclosure/dialog', this.dataCreate);
    },
    deactivated() {
      this.$bus.$off('upEnclosure/dialog', this.dataCreate);
    },
    computed: {
      getPrincipal() {
        return this.$store.state.view.principal;
      },
      ...mapGetters([
        'View_UserInfo',
      ]),
    },
    components: {
      DialogForm,
      DialogSignatureDrugsPic,
      YUploadEdit,
    },
    data() {
      return {
        SealShow: false,
        dialogVisible: false,
        dialogFormShow: false, // 弹出框显示隐藏控制
        formConfirmLoading: false, // 确定按钮loding
        DialogFormLoading: false,
        editMessage: {
          dialogTitle: '药检报告',
          selects: [
            { value: 'drugsReportFile', type: 'custom' },
          ],
          options: {},
          checkbox: {},
          radios: {},
          rules: {},
          styleObject: {},
        },
        form: {},
        enclosure: '',
        MyEnclosure: [],
        // 签章字段
        signOptions: {
          signTitle: '药检报告签章',                  //  弹出框标题
          url: null,
          oldUrl: null,
          index: null,
          urls: null,
          gOldUrl: null,
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
      callBackSign(result, index, x, y, showImg, gOldUrl) {
        // 签章后回调
        for (let i = 0; i < this.MyEnclosure.length; i += 1) {
          // console.log();
          if (this.MyEnclosure[i].index === index) {
            this.MyEnclosure[i].oldUrl = showImg;
            this.MyEnclosure[i].url = result;
            this.MyEnclosure[i].dStamp = 1;
            this.MyEnclosure[i].dy = y;
            this.MyEnclosure[i].dx = x;
            this.MyEnclosure[i].gOldUrl = gOldUrl;
          }
          if (!this.MyEnclosure[i].dStamp) {
            this.MyEnclosure[i].dStamp = 0;
          }
        }
        // console.log();
        DrugsBatchNo.stampUpdate(this.row.id, JSON.stringify(this.MyEnclosure)).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            // 签章按钮不可操作
            // this.btnIsDisabled.signature = true;
          }
        });
      },
      // 预览文件
      previewFile(enclosure) {
        gpo.sealImage('seal01').then((res) => {
          let status1 = false;
          let status2 = false;
          this.signVisibleOut = true;
          // 显示签证按钮
          if (this.View_UserInfo.memberType === 2) {
            if (!this.form.isGpoStamp) {
              status1 = false;
            } else {
              status1 = true;
            }
            if (res.data.code === 0) {
              status2 = true;
            } else {
              status2 = false;
            }
            if (status1 && status2) {
              this.btnIsDisabled.signature = false;
            } else {
              this.btnIsDisabled.signature = true;
            }
            // console.log();
            if (enclosure.dStamp) {
              // 已签章
              this.signOptions = {
                signTitle: '药检报告签章',                  //  弹出框标题
                url: enclosure.oldUrl,
                oldUrl: enclosure.oldUrl,
                index: enclosure.index,
                urls: res.data.result,
                x: enclosure.dx,
                y: enclosure.dy,
                gOldUrl: enclosure.gOldUrl,
              };
            } else {
              // 未签章
              this.signOptions = {
                signTitle: '药检报告签章',                  //  弹出框标题
                url: enclosure.url,
                oldUrl: enclosure.url,
                index: enclosure.index,
                urls: res.data.result,
                gOldUrl: enclosure.oldUrl,
              };
            }
          } else if (this.View_UserInfo.memberType === 4 || this.View_UserInfo.memberType === 5) {
            this.btnIsDisabled.signature = true;
            this.signOptions = {
              signTitle: '药检报告签章',                  //  弹出框标题
              url: enclosure.url,
              oldUrl: enclosure.url,
              index: enclosure.index,
              urls: null,
            };
          }
        });
      },
      handleClose() {
        this.dialogVisible = false;
      },
      // 点击新增触发事件
      dataCreate(row) {
        this.dialogFormShow = true; // 打开弹出框
        this.DialogFormLoading = true;
        this.formConfirmLoading = false;
        DrugsBatchNo.item(row.id).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result[0];
            this.form = {
              id: data.id,
              drugsReportFile: data.drugsReportFile,
              isGpoStamp: data.isGpoStamp,
            };
            this.MyEnclosure = [];
            if (typeof (this.toJSON(data.drugsReportFileNew)) === 'object') {
              const newUrlArr = [];
              const fileArr = [];
              for (let i = 0; i < this.toJSON(data.drugsReportFileNew).length; i += 1) {
                newUrlArr.push(this.toJSON(data.drugsReportFileNew)[i].oldUrl);
              }
              for (let i = 0; i < this.toJSON(data.drugsReportFile).length; i += 1) {
                if (newUrlArr.indexOf(this.toJSON(data.drugsReportFile)[i].url) < 0) {
                  fileArr.push(this.toJSON(data.drugsReportFile)[i]);
                }
              }
              this.MyEnclosure = fileArr.concat(this.toJSON(data.drugsReportFileNew));
            } else {
              console.log('未签章');
              if (typeof (this.toJSON(data.drugsReportFile)) === 'object') {
                this.MyEnclosure = this.toJSON(data.drugsReportFile);
              }
            }
            console.log('this.MyEnclosure', this.MyEnclosure);
            this.DialogFormLoading = false;
          }
        });
      },
      // 点击确定后的触发事件
      dialogConfirm(formName) {
        // console.log();
        for (let i = 0; i < JSON.parse(this.form.enclosure).length; i += 1) {
          // console.log();
        }
        this.dialogFormShow = false;
      },
      // 点击取消后的触发事件
      dialogCancel(res) {
        this.dialogFormShow = false;
        this.$bus.$emit('data/list');
      },
      // 关闭窗口后的触发事件
      CloseDialog() {
        // console.log();
        this.dialogFormShow = false;
      },
      toJSON(str) {
        return convert.toJSON(str);
      },
    },
  };
</script>

<style>
  .form-item-line {
    border-bottom: 1px solid rgba(0, 0, 0, .3);
    margin-bottom: 22px;
  }

  .w_upEnclosure .dialog-from .el-dialog--small {
    max-width: 420px;
    min-width: 320px;
  }

  .w_upEnclosure .upload-demo {
    margin-bottom: 15px;
  }

  .w_upEnclosure .dialog-from .el-form-item__content {
    float: left;
  }
  .w_upEnclosure .iconfont {
    margin-right: 5px;
    display: inline-block;
    vertical-align: top;
  }
</style>
