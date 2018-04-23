<template>
  <div class="dialog-from">
    <div :style="formStyle">
      <el-col :span="message.selects[index].span?message.selects[index].span:24"
              v-for="(value, index) in message.selects" :key="index">
        <PageSubtitle v-if="message.selects[index].label=='CPublic'&&message.selects[index].type=='PageSubtitle'"
                      :subTitle="message.selects[index].subTitle"
                      v-show="typeof message.selects[index].fromShow=='undefined'?true:message.selects[index].fromShow?isThreeInOne:!isThreeInOne"></PageSubtitle>
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
          <component v-if="message.selects[index].genre=='number'&&message.selects[index].type=='el-input'"
                     :disabled='isReadonly?isReadonly:message.selects[index].isReadonly'
                     :is="message.selects[index].type" :placeholder="isReadonly?'':message.selects[index].placeholder"
                     v-model.number="fromEdit[message.selects[index].key]" :type="message.selects[index].fromType"
                     :class="message.selects[index].fromClass"
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
          <component v-else-if="message.selects[index].genre!='number'&&message.selects[index].type=='el-input'"
                     :is="message.selects[index].type"
                     :disabled='isReadonly?isReadonly:message.selects[index].isReadonly'
                     :placeholder="isReadonly?'':message.selects[index].placeholder"
                     v-model="fromEdit[message.selects[index].key]" :type="message.selects[index].fromType"
                     :class="message.selects[index].fromClass"
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
                     :class="message.selects[index].fromClass"
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
                     :class="message.selects[index].fromClass"
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
    </div>
    <div class="from-button dialog-footer" slot="footer">
      <el-col :span="24">
        <el-form-item>
          <el-button size="small" v-if="isFormConfirm" type="primary" :loading="formConfirmLoading" :disabled="isDisabled" @click="dialogFormConfirm('fromDialog')" class="page_btn"><i class="icon iconfont icon-right_circle"></i>确 定</el-button>
          <el-button size="small" v-if="isSaveShow" type="primary" :loading="saveLoading" :disabled="isDisabled" @click="dataSave('fromDialog')" class="page_btn"><i class="icon iconfont icon-baocun"></i>保存</el-button>
          <el-button size="small" v-if="isSubmitShow" type="success" :loading="submitLoading" :disabled="isDisabled" @click="dataSubmit('fromDialog')" class="page_btn"><i class="icon iconfont icon-tijiao"></i>提交</el-button>
          <el-button size="small" @click="dialogFormClose" class="page_btn"><i class="icon iconfont icon-jujue"></i>取 消</el-button>
        </el-form-item>
      </el-col>
    </div>
  </div>
</template>

<script>
  import PageSubtitle from './PageSubtitle';
  import District from './District';

  export default {
    components: {
      PageSubtitle,
      District,
    },
    computed: {
      formStyle() {
        let mHeight = 0;
        if (this.heightStyle) {
          mHeight = this.heightStyle;
        } else {
          mHeight = this.footerShow ? 200 : 320;
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
      isSaveShow: false,      // 保存按钮是否显示
      isFormConfirm: false,   // 确定按钮是否显示
      isSubmitShow: false,    // 提交按钮是否显示
      formConfirmLoading: false,  // 确定按钮加载
      saveLoading: false,     // 保存按钮加载
      submitLoading: false,   // 提交按钮加载
      isReadonly: false,      // 是否禁用输入框(全部禁用，这是灰色框)
      isThreeInOne: false,    // 控制表单框部分显示
      footerShow: false,   // 样式选择
      heightStyle: 0,     // 高度控制
      isDisabled: false,  // 按钮置灰控制
      oddFrom: {},  // 原值对比控制
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
      // 取消按钮
      dialogFormClose() {
        this.$emit('dialog-cancel', this.fromEdit);
      },
      // 确定按钮
      dialogFormConfirm(res) {
        this.tranDates();
        this.$emit('dialog-confirm', this.fromEdit);
        return true;
      },
      // 保存按钮
      dataSave(res) {
        this.tranDates();
        this.$emit('data-save', this.fromEdit);
        return true;
      },
      // 提交按钮
      dataSubmit(res) {
        this.tranDates();
        this.$emit('data-submit', this.fromEdit);
        return true;
      },
    },
  };
</script>

<style>
  .dialog-from .el-textarea.is-disabled .el-textarea__inner {
    background-color: rgb(238, 240, 246)!important;
    border-color: rgb(209, 217, 229)!important;
    color: rgb(0, 0, 0)!important;
    cursor: not-allowed;
  }
  .dialog-from .is-disabled .el-input__inner {
    background-color: rgb(238, 240, 246)!important;
    border-color: rgb(209, 217, 229)!important;
    color: rgb(0, 0, 0)!important;
    cursor: not-allowed;
  }
  .dialog-from .el-cascader.is-disabled .el-cascader__label {
    background-color: rgb(238, 240, 246)!important;
    border-color: rgb(209, 217, 229)!important;
    color: rgb(0, 0, 0)!important;
    cursor: not-allowed;
  }
  .fromtemp {
    overflow-y: auto;
  }

  .dialog-from .el-input,
  .dialog-from .el-cascader,
  .dialog-from .el-select {
    min-width: 120px;
    max-width: 180px;
    width: 100%;
  }

  .dialog-from .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    color: #000;
  }

  .dialog-from .el-textarea.is-disabled .el-textarea__inner {
    background-color: rgb(238, 240, 246) !important;
    border-color: rgb(209, 217, 229) !important;
    color: rgb(0, 0, 0) !important;
    cursor: not-allowed;
  }

  .dialog-from .el-select .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    color: #000;
  }

  .dialog-from .el-cascader .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    color: #000;
  }

  .dialog-from .el-cascader.is-disabled .el-cascader__label {
    color: #000;
    background-color: #fff;
  }

  .dialog-from .el-date-editor .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    color: #000;
  }

  .dialog-from .is-disabled .el-input__inner {
    background-color: rgb(238, 240, 246) !important;
    border-color: rgb(209, 217, 229) !important;
    color: rgb(0, 0, 0) !important;
    cursor: not-allowed;
  }

  .dialog-from .el-cascader.is-disabled .el-cascader__label {
    background-color: rgb(238, 240, 246) !important;
    border-color: rgb(209, 217, 229) !important;
    color: rgb(0, 0, 0) !important;
    cursor: not-allowed;
  }

  .dialog-from .el-icon-circle-close:before {
    color: #f1645b;
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
    float: right;
  }
  .page_btn {
    line-height: 16px;
  }
  .page_btn i {
    margin-right: 4px;
    vertical-align: middle;
    display: inline-block;
  }
  .dialog-from .el-dialog--small {
    min-width: 430px
  }
  .el-dialog--small {
    width: 412px;
    min-width: 412px;
    top: 10% !important;
  }
</style>
