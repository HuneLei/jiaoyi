<template>
  <div class="fromtemp">
    <div :style="formStyle">
      <el-col :span="6"
              :lg="message.selects[index].span?message.selects[index].span:6"
              :md="message.selects[index].span?message.selects[index].span:12"
              :sm="message.selects[index].span?message.selects[index].span:12"
              :xs="message.selects[index].span?message.selects[index].span:24"
              v-for="(value, index) in message.selects" :key="index">
        <PageSubtitle v-if="message.selects[index].label=='CPublic'&&message.selects[index].type=='PageSubtitle'"
                      :subTitle="message.selects[index].subTitle"
                      v-show="typeof message.selects[index].fromShow=='undefined'?true:message.selects[index].fromShow?isThreeInOne:!isThreeInOne"></PageSubtitle>

        <PageThirdtitle v-else-if="message.selects[index].label=='CPublic'&&message.selects[index].type=='thirdTitle'"
                        :thirdTitle="message.selects[index].thirdTitle"
                        v-show="typeof message.selects[index].fromShow=='undefined'?true:message.selects[index].fromShow?isThreeInOne:!isThreeInOne"></PageThirdtitle>

        <District v-else-if="message.selects[index].label=='CPublic'&&message.selects[index].type=='District'"
                  :disabled="isReadonly"
                  v-show="typeof message.selects[index].fromShow=='undefined'?true:message.selects[index].fromShow?isThreeInOne:!isThreeInOne"></District>
        <DistrictMore v-else-if="message.selects[index].label=='CPublic'&&message.selects[index].type=='DistrictMore'"
                      :disabled="isReadonly"
                      v-show="typeof message.selects[index].fromShow=='undefined'?true:message.selects[index].fromShow?isThreeInOne:!isThreeInOne"></DistrictMore>
        <slot v-else-if="message.selects[index].type=='custom'" :name="message.selects[index].value"
              v-show="typeof message.selects[index].fromShow=='undefined'?true:message.selects[index].fromShow?isThreeInOne:!isThreeInOne"></slot>
        <el-form-item v-else :label="message.selects[index].label" :prop="!isReadonly ? message.selects[index].key : ''"
                      v-show="typeof message.selects[index].fromShow=='undefined'?true:message.selects[index].fromShow?isThreeInOne:!isThreeInOne" :class="oddFromShow[message.selects[index].key] ? 'is-error' : ''">
          <slot :name="message.selects[index].value" v-if="message.selects[index].fromUp=='on'"></slot>
          <component v-if="(message.selects[index].genre=='number'&&message.selects[index].type=='el-input')||(isReadonly?isReadonly:message.selects[index].isReadonly)"
                     :disabled='isReadonly?isReadonly:message.selects[index].isReadonly'
                     is="el-input" :placeholder="isReadonly?'':message.selects[index].placeholder"
                     v-model.number="fromEdit[message.selects[index].key]" :type="message.selects[index].fromType"
                     :class="message.selects[index].noborder?'no-border':''"
                     :style="message.styleObject[message.selects[index].fromStyle]" :rows="message.selects[index].rows"
                     @click="fromFocus(message.parameters[message.selects[index].fromFocus])"
                     @focus="fromFocus(message.parameters[message.selects[index].fromFocus])"
                     :icon="message.selects[index].icon"
                     size="small">
            <template v-if="message.selects[index].prepend" slot="prepend">{{message.selects[index].prepend}}</template>
            <el-button size="small" v-else-if="isReadonly?!isReadonly:(message.selects[index].isReadonly?false:message.selects[index].prependIcon)" slot="prepend" :icon="message.selects[index].prependIcon" @click="IconClick(message.parameters[message.selects[index].ClickIcon])"></el-button>
            <template v-if="message.selects[index].append" slot="append" :icon="message.selects[index].icon">{{message.selects[index].append}}</template>
            <el-button size="small" v-else-if="isReadonly?!isReadonly:(message.selects[index].isReadonly?false:message.selects[index].appendIcon)" slot="append" :icon="message.selects[index].appendIcon" @click="IconClick(message.parameters[message.selects[index].ClickIcon])"></el-button>
          </component>
          <component v-else-if="(message.selects[index].genre!='number'&&message.selects[index].type=='el-input')||(isReadonly?isReadonly:message.selects[index].isReadonly)"
                     is="el-input"
                     :disabled='isReadonly?isReadonly:message.selects[index].isReadonly'
                     :placeholder="isReadonly?'':message.selects[index].placeholder"
                     v-model="fromEdit[message.selects[index].key]" :type="message.selects[index].fromType"
                     :class="message.selects[index].noborder?'no-border':''"
                     :style="message.styleObject[message.selects[index].fromStyle]" :rows="message.selects[index].rows"
                     @click="fromFocus(message.parameters[message.selects[index].fromFocus])"
                     @focus="fromFocus(message.parameters[message.selects[index].fromFocus])"
                     :icon="message.selects[index].icon"
                     size="small">
            <template v-if="message.selects[index].prepend" slot="prepend">{{message.selects[index].prepend}}</template>
            <el-button size="small" v-else-if="isReadonly?!isReadonly:(message.selects[index].isReadonly?false:message.selects[index].prependIcon)" slot="prepend" :icon="message.selects[index].prependIcon" @click="IconClick(message.parameters[message.selects[index].ClickIcon])"></el-button>
            <template v-if="message.selects[index].append" slot="append" :icon="message.selects[index].icon">{{message.selects[index].append}}</template>
            <el-button size="small" v-else-if="isReadonly?!isReadonly:(message.selects[index].isReadonly?false:message.selects[index].appendIcon)" slot="append" :icon="message.selects[index].appendIcon" @click="IconClick(message.parameters[message.selects[index].ClickIcon])"></el-button>
          </component>
          <component v-else-if="message.selects[index].genre=='number'&&message.selects[index].type!='el-input'"
                     :is="message.selects[index].type"
                     :clearable="!message.selects[index].noClearable"
                     :disabled='isReadonly?isReadonly:message.selects[index].isReadonly'
                     :placeholder="isReadonly?'':message.selects[index].placeholder"
                     v-model.number="fromEdit[message.selects[index].key]" :type="message.selects[index].fromType"
                     :class="message.selects[index].noborder?'no-border':''"
                     :style="message.styleObject[message.selects[index].fromStyle]" :rows="message.selects[index].rows"
                     @click="fromFocus(message.parameters[message.selects[index].fromFocus])"
                     @focus="fromFocus(message.parameters[message.selects[index].fromFocus])"
                     :icon="message.selects[index].icon"
                     size="small">
            <el-option v-for="item in message.options[message.selects[index].option]" :label="item.label"
                       :value="item.value" :key="item.value"
                       v-if="message.selects[index].type=='el-select'"></el-option>
            <el-radio v-if="message.selects[index].type=='el-radio-group'" :label="item"
                      v-for="item in message.radios[message.selects[index].radios]" :key="item.value"></el-radio>
          </component>
          <component v-else-if="message.selects[index].genre!='number'&&message.selects[index].type!='el-input'"
                     :is="message.selects[index].type"
                     :clearable="!message.selects[index].noClearable"
                     :disabled='isReadonly?isReadonly:message.selects[index].isReadonly'
                     :placeholder="isReadonly?'':message.selects[index].placeholder"
                     v-model="fromEdit[message.selects[index].key]" :type="message.selects[index].fromType"
                     :class="message.selects[index].noborder?'no-border':''"
                     :style="message.styleObject[message.selects[index].fromStyle]" :rows="message.selects[index].rows"
                     @click="fromFocus(message.parameters[message.selects[index].fromFocus])"
                     @focus="fromFocus(message.parameters[message.selects[index].fromFocus])"
                     :icon="message.selects[index].icon"
                     size="small">
            <el-option v-for="item in message.options[message.selects[index].option]" :label="item.label"
                       :value="item.value" :key="item.value"
                       v-if="message.selects[index].type=='el-select'"></el-option>
            <el-radio v-if="message.selects[index].type=='el-radio-group'" :label="item"
                      v-for="item in message.radios[message.selects[index].radios]" :key="item.value"></el-radio>
          </component>
          <div v-show="oddFromShow[message.selects[index].key]" class="el-form-item__error" >原值: {{oddFromShow[message.selects[index].key]}}</div>
          <slot :name="message.selects[index].value" v-if="typeof(message.selects[index].fromUp)=='undefined'"></slot>
        </el-form-item>
      </el-col>
      <div v-show="footerShow">
        <el-col :span="24">
          <el-form-item>
            <el-button size="small" v-if="(authbtn.update || authbtn.create) && isSaveShow" type="primary" :loading="saveLoading"
                       @click="dataSave('fromEdit')" :disabled="isDisabled"
                       class="page_btn"><i class="icon iconfont icon-baocun"></i>保存
            </el-button>
            <el-button size="small" v-if="(authbtn.update || authbtn.create) && isSubmitShow" type="success" :loading="submitLoading"
                       @click="dataSubmit('fromEdit')" :disabled="isDisabled"
                       class="page_btn"><i class="icon iconfont icon-tijiao"></i>提交审核
            </el-button>
            <el-button size="small" v-if="(authbtn.audpass) && isAudPass" type="success" :loading="audpassing"
                       @click="dataCheck(3)"
                       class="page_btn"><i class="icon iconfont icon-shenhetongguo"></i>审核通过
            </el-button>
            <el-button size="small" v-if="(authbtn.audout) && isAudOut" type="success" :loading="audouting"
                       @click="dataCheck(4)" :disabled="isDisabled"
                       class="page_btn"><i class="icon iconfont icon-shenhebutongguo"></i>审核不通过
            </el-button>
            <el-button size="small" v-if="(authbtn.audpass) && isAudPass" type="success" :loading="audpassing"
                       @click="dataCheck(4)" :disabled="isDisabled"
                       class="page_btn"><i class="icon iconfont icon-shenhebutongguo"></i>审核不通过
            </el-button>
            <el-button size="small" v-if="authbtn.audit && isCheckShowFirst" type="success" :loading="checkokloading"
                       @click="dataCheck(3)" :disabled="isDisabled"
                       class="page_btn"><i class="icon iconfont icon-shenhetongguo1"></i>初审通过
            </el-button>
            <el-button size="small" v-if="authbtn.approve && isCheckShowSecond" type="success" :loading="checkokloading"
                       @click="dataCheck(4)" :disabled="isDisabled"
                       class="page_btn"><i class="icon iconfont icon-tongguoshenhe"></i>复审通过
            </el-button>
            <el-button size="small" v-if="authbtn.auditno && isCheckShowOther" type="danger" :loading="checknoloading"
                       @click="dataCheck(5)" :disabled="isDisabled"
                       class="page_btn"><i class="icon iconfont icon-shenhebutongguo"></i>审核不通过
            </el-button>
            <el-button size="small" v-if="authbtn.audit && isCheckShow" type="primary" :loading="backloading" @click="dataCheck(1)" :disabled="isDisabled"
                       class="page_btn">
              <i class="icon iconfont icon-icon-dahui"></i>打回修改
            </el-button>
            <el-button size="small" v-if="authbtn.audit && isCancelShow" type="warning" :loading="cancelLoading" @click="dataCheck(0)"
                       class="page_btn"><i class="icon iconfont icon-delete"></i>作废</el-button>
            <el-button size="small" v-if="isRevokeCheckShow" type="primary" :loading="revokeloading" @click="dataCheck(1)" :disabled="isDisabled" class="page_btn"><i class="icon iconfont icon-work-exam-back"></i>撤销审核
            </el-button>
            <el-button size="small" v-if="isConfirmShow" type="primary" :loading="Confirmloading" @click="dataConfirm('fromEdit')" :disabled="isDisabled"
                       class="page_btn"><i class="icon iconfont icon-right_circle"></i>确定
            </el-button>
            <el-button size="small" v-if="isDeleteShow" type="danger" :loading="deletloading" @click="dataDelete()" :disabled="isDisabled"
                       class="page_btn"><i class="icon iconfont icon-delete"></i>删除</el-button>
            <el-button size="small" v-if="isGoBackShow" @click="editClose('fromEdit')" :disabled="isDisabled"
                       class="page_btn"><i class="icon iconfont icon-fanhui"></i>返回</el-button>
          </el-form-item>
        </el-col>
      </div>
    </div>
    <div v-show="!footerShow" class="from-button">
      <el-col :span="24">
        <el-form-item>
          <el-button size="small" v-if="(authbtn.update || authbtn.create) && isSaveShow" type="primary" :loading="saveLoading"
                     @click="dataSave('fromEdit')" :disabled="isDisabled"
                     class="page_btn"><i class="icon iconfont icon-baocun"></i>保存
          </el-button>
          <el-button size="small" v-if="(authbtn.update || authbtn.create) && isSubmitShow" type="success" :loading="submitLoading"
                     @click="dataSubmit('fromEdit')" :disabled="isDisabled"
                     class="page_btn"><i class="icon iconfont icon-tijiao"></i>提交审核
          </el-button>
          <el-button size="small" v-if="(authbtn.audpass) && isAudPass" type="success" :loading="audpassing"
                     @click="dataCheck(3)"
                     class="page_btn"><i class="icon iconfont icon-shenhetongguo"></i>审核通过
          </el-button>
          <el-button size="small" v-if="(authbtn.audout) && isAudOut" type="success" :loading="audouting"
                     @click="dataCheck(4)" :disabled="isDisabled"
                     class="page_btn"><i class="icon iconfont icon-shenhebutongguo"></i>审核不通过
          </el-button>
          <el-button size="small" v-if="(authbtn.audpass) && isAudPass" type="success" :loading="audpassing"
                     @click="dataCheck(4)" :disabled="isDisabled"
                     class="page_btn"><i class="icon iconfont icon-shenhebutongguo"></i>审核不通过
          </el-button>
          <el-button size="small" v-if="authbtn.audit && isCheckShowFirst" type="success" :loading="checkokloading"
                     @click="dataCheck(3)" :disabled="isDisabled"
                     class="page_btn"><i class="icon iconfont icon-shenhetongguo1"></i>初审通过
          </el-button>
          <el-button size="small" v-if="authbtn.approve && isCheckShowSecond" type="success" :loading="checkokloading"
                     @click="dataCheck(4)" :disabled="isDisabled"
                     class="page_btn"><i class="icon iconfont icon-tongguoshenhe"></i>复审通过
          </el-button>
          <el-button size="small" v-if="authbtn.auditno && isCheckShowOther" type="danger" :loading="checknoloading"
                     @click="dataCheck(5)" :disabled="isDisabled"
                     class="page_btn"><i class="icon iconfont icon-shenhebutongguo"></i>审核不通过
          </el-button>
          <el-button size="small" v-if="authbtn.audit && isCheckShow" type="primary" :loading="backloading" @click="dataCheck(1)" :disabled="isDisabled"
                     class="page_btn">
            <i class="icon iconfont icon-icon-dahui"></i>打回修改
          </el-button>
          <el-button size="small" v-if="authbtn.audit && isCancelShow" type="warning" :loading="cancelLoading" @click="dataCheck(0)"
                     class="page_btn"><i class="icon iconfont icon-delete"></i>作废</el-button>
          <el-button size="small" v-if="isRevokeCheckShow" type="primary" :loading="revokeloading" @click="dataCheck(1)" :disabled="isDisabled" class="page_btn"><i class="icon iconfont icon-work-exam-back"></i>撤销审核
          </el-button>
          <el-button size="small" v-if="isConfirmShow" type="primary" :loading="Confirmloading" @click="dataConfirm('fromEdit')" :disabled="isDisabled"
                     class="page_btn"><i class="icon iconfont icon-right_circle"></i>确定
          </el-button>
          <el-button size="small" v-if="isDeleteShow" type="danger" :loading="deletloading" @click="dataDelete()" :disabled="isDisabled"
                     class="page_btn"><i class="icon iconfont icon-delete"></i>删除</el-button>
          <el-button size="small" v-if="isGoBackShow" @click="editClose('fromEdit')" :disabled="isDisabled"
                     class="page_btn"><i class="icon iconfont icon-fanhui"></i>返回</el-button>
        </el-form-item>
      </el-col>
    </div>
  </div>
</template>

<script>
  import PageSubtitle from './PageSubtitle';
  import PageThirdtitle from './PageThirdtitle';
  import District from './District';

  export default {
    components: {
      PageSubtitle,
      PageThirdtitle,
      District,
    },
    computed: {
      formStyle() {
        let mHeight = 0;
        if (this.heightStyle) {
          mHeight = this.heightStyle;
        } else {
          mHeight = this.footerShow ? 200 : 260;
        }
        return `height: ${window.innerHeight - mHeight}px; overflow-y: auto;`;
      },
      oddFroms() {
        if (typeof this.oddFrom === 'undefined') {
          return {};
        }
        return this.oddFrom;
      },
      oddFromShow() {
        const keys = Object.keys(this.fromEdit);
        const fromError = {};
        for (let i = 1; i < keys.length; i += 1) {
          const fromKey = this.fromEdit[keys[i]];
          if ((keys[i] in this.oddFroms) && ((fromKey) || (fromKey === 0))) {
            this.$set(fromError, keys[i], this.oddFroms[keys[i]]);
          } else {
            this.$set(fromError, keys[i], '');
          }
        }
        return fromError;
      },
    },
    data() {
      return {
        authbtn: {
          list: true,
          create: true,
          update: true,
          destory: true,
          recover: true,
          remove: true,
          submit: true,
          audit: true,
          approve: true,
          auditno: true,
          log: true,
          upload: true,
          uploadlog: true,
          output: true,
          audpass: true,
          audout: true,
        },        //  用户权限控制
        tranDates: () => {
          for (let keys = 0; keys < this.message.selects.length; keys += 1) {
            if (this.message.selects[keys].fromType === 'date') {
              const dForm = this.fromEdit[this.message.selects[keys].key];
              if (dForm) {
                this.fromEdit[this.message.selects[keys].key] = new Date(dForm);
              }
            }
          }
        },
      };
    },
    props: {
      message: {
        type: [Array, String, Object],
        default: {
          selects: [],  // 表单数组
          rules: {},    // 没有去掉rules你可以在外面绑定检验也可以在里面绑定
          styleObject: {},  // 设置样式
          options: {},  // 下拉数组
          radios: {}, // 单选
          parameters: {
            parameter: {
              state: 'off',
              mation: '',
            },
          },
        },
      },
      isSaveShow: false,   // 是否显示保存按钮
      saveLoading: false,  // 保存加载
      isSubmitShow: false, // 是否显示提交按钮
      submitLoading: false, // 提交加载
      isCheckShow: false,  // 是否显示打回修改按钮
      isCheckShowFirst: false,  // 是否显示初审通过按钮
      isCheckShowSecond: false,  // 是否显示复审通过按钮
      isCheckShowOther: false, // 是否显示审核不通过
      isConfirmShow: false,   // 是否显示确定按钮
      isDeleteShow: false,    // 是否显示删除
      deletloading: false,   // 删除按钮加载
      checkokloading: false,  // 审核按钮加载
      checknoloading: false,  // 审核不通过按钮加载
      backloading: false,     // 打回修改按钮加载
      isReadonly: false,      // 是否禁用输入框(全部禁用，这是灰色框)
      isThreeInOne: false,    // 控制表单框部分显示
      isRevokeCheckShow: false,  // 是否显示撤销审核按钮
      revokeloading: false,   // 撤销审核按钮加载
      Confirmloading: false,  // 确定按钮加载
      footerShow: false,   // 样式选择
      isAudPass: false, // 审核通过按钮是否显示
      isAudOut: false, // 审核不通过按钮是否显示
      audouting: false, // 审核不通过按钮加载
      audpassing: false, // 审核通过加载
      isCancelShow: {     //  作废按钮显示隐藏
        default: false,
      },
      cancelLoading: {      //  作废按钮的loading
        default: false,
      },
      heightStyle: 0,     // 高度控制
      isDisabled: false,  // 按钮置灰控制
      oddFrom: {},  // 原值对比控制
      isGoBackShow: {
        default: true,
      },                   // 返回按钮显示控制
      fromEdit: {          // v-model绑定的值对象
        type: [String, Object],
        default: {},
      },
    },
    methods: {
      // 焦点触发
      fromFocus(parameter) {
        const state = parameter ? 'on' : 'off';
        if (state === 'on') {
          this.$emit('edit-focus', parameter.mation);
        }
      },
      // 尾部图标触发事件
      IconClick(parameter) {
        const state = parameter ? 'on' : 'off';
        if (state === 'on') {
          this.$emit('icon-click', parameter.mation);
        }
      },
      // 删除按钮
      dataDelete() {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$emit('data-delete');
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
        return true;
      },
      // 返回按钮
      editClose(fromEdit) {
        this.$emit('edit-close');
      },
      // 保存按鈕
      dataSave(fromEdit) {
        this.tranDates();
        this.$emit('edit-save');
      },
      // 提交审核按鈕
      dataSubmit(fromEdit) {
        this.tranDates();
        this.$emit('data-submit');
      },
      // 初审、复审、审核不通过、打回修改
      dataCheck(i) {
        this.$emit('data-check', i);
      },
    },
  };
</script>

<style>
  .fromtemp {
    overflow-y: auto;
  }

  .fromtrade .el-input,
  .fromtrade .el-cascader,
  .fromtrade .el-select {
    min-width: 120px;
    max-width: 180px;
    width: 100%;
  }

  .fromtemp .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    color: #000;
  }

  .fromtemp .el-textarea.is-disabled .el-textarea__inner {
    background-color: rgb(238, 240, 246) !important;
    border-color: rgb(209, 217, 229) !important;
    color: rgb(0, 0, 0) !important;
    cursor: not-allowed;
  }

  .fromtemp .el-select .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    color: #000;
  }

  .fromtemp .el-cascader .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    color: #000;
  }

  .fromtemp .el-cascader.is-disabled .el-cascader__label {
    color: #000;
    background-color: #fff;
  }

  .fromtemp .el-date-editor .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    color: #000;
  }

  .fromtemp .is-disabled .el-input__inner {
    background-color: rgb(238, 240, 246) !important;
    border-color: rgb(209, 217, 229) !important;
    color: rgb(0, 0, 0) !important;
    cursor: not-allowed;
  }

  .fromtemp .el-cascader.is-disabled .el-cascader__label {
    background-color: rgb(238, 240, 246) !important;
    border-color: rgb(209, 217, 229) !important;
    color: rgb(0, 0, 0) !important;
    cursor: not-allowed;
  }

  .fromtemp .el-icon-circle-close:before {
    color: #f1645b;
  }

  .fromtemp .no-border .el-input__inner {
    border: none;
  }
  .fromtemp .no-border .el-textarea__inner {
    border: none;
  }

  .from-button {
    border-top: .01rem solid rgba(174, 194, 216, 0.96) !important;
    padding: .1rem;
    padding-left: .2rem;
    background-color: white !important;
    bottom: 20px;
    margin-top: 20px;
  }

  .from-button .el-form-item__content {
    margin-left: 0 !important;
  }
  .page_btn {
    line-height: 16px;
  }
  .page_btn i {
    margin-right: 4px;
    vertical-align: middle;
    display: inline-block;
  }

  .fromtemp .el-form-item {
    margin-bottom: 2px;
  }
</style>
