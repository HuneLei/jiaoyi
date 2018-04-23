<template>
  <div class="dialogs-from">
    <el-dialog :title="message.dialogTitle" :visible.sync="dialogFormShow" @close="closeDialog" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-form :model="fromDialog" :rules="message.rules" ref="fromDialog" v-loading="DialogFormLoading">
        <el-row>
          <el-col :span="message.selects[index].span?message.selects[index].span:24" v-for="(value, index) in message.selects" :key="index">
            <slot v-if="message.selects[index].type=='custom'" :name="message.selects[index].value"></slot>
            <el-form-item v-else :label="message.selects[index].label" :label-width="formLabelWidth" :prop="message.selects[index].key">
              <component :is="message.selects[index].type" :prop="!isReadonly ? message.selects[index].key : ''" :type="message.selects[index].fromType" :rows="message.selects[index].rows" :on-text="message.selects[index].ontext?message.selects[index].ontext:''" :off-text="message.selects[index].offtext||''" :icon="message.selects[index].icon" v-model="fromDialog[message.selects[index].key]" :placeholder="isReadonly?'':message.selects[index].placeholder" :filterable='message.selects[index].filterable' :disabled='isReadonly?isReadonly:message.selects[index].isReadonly' :clearable="!message.selects[index].noClearable" :style="message.styleObject[message.selects[index].fromStyle]" :class="message.selects[index].noborder?'no-border':''">
                <el-option v-for="item in message.options[message.selects[index].option]" :label="item.label" :value="item.value" v-if="message.selects[index].type=='el-select'" :key="item.value"></el-option>
                <el-checkbox v-for="item in message.checkbox[message.selects[index].checkbox]" :label="item.label" :name="'fromDialog[message.selects[index].key'" v-if="message.selects[index].type=='el-checkbox-group'" :key="item.value" :disabled='isReadonly?isReadonly:message.selects[index].isReadonly'></el-checkbox>
                <el-radio v-for="item in message.radios[message.selects[index].radios]" :label="item.label" name="type" v-if="message.selects[index].type=='el-radio-group'" :key="item.value"></el-radio>
              </component>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" name="confirm" v-if="isFormConfirm" type="primary" :loading="formConfirmLoading" :disabled="isDisabled" @click="dialogFormConfirm('fromDialog')">
          <i class="icon iconfont icon-right_circle"></i>确定
        </el-button>
        <el-button size="small" name="save" v-if="isSaveShow" type="primary" :loading="saveLoading" :disabled="isDisabled" @click="dataSave('fromDialog')">
          <i class="icon iconfont icon-baocun"></i>保存
        </el-button>
        <el-button size="small" name="submit" v-if="isSubmitShow" type="success" :loading="submitLoading" :disabled="isDisabled" @click="dataSubmit('fromDialog')">
          <i class="icon iconfont icon-tijiao"></i>提交</el-button>
        <el-button size="small" name="back" v-if="isBackShow" @click="dialogFormClose('fromDialog')">
          <i class="icon iconfont icon-jujue"></i>返回</el-button>
        <el-button size="small" name="cancel" v-if="isCloseShow" @click="dialogFormClose('fromDialog')">
          <i class="icon iconfont icon-jujue"></i>取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  watch: {
    dialogFormVisible(val) {     // 监听dialogFormVisible值变化组件显示隐藏
      this.dialogFormShow = val;
    },
  },
  created() {
    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
      }
    };
  },
  props: {
    dialogFormVisible: false,
    message: {
      type: [Array, String, Object],
      default: {
        IsTrue: false,    // 判断点击确定按鈕是否直接关闭弹框
        dialogTitle: '',
        selects: [],
        rules: {},
        radios: {},
        options: {},
        checkbox: {},
        styleObject: {},
      },
    },
    fromDialog: {
      type: [String, Object],
      default: {},
    },
    isReadonly: false,
    isSaveShow: false,
    isDisabled: false,
    isFormConfirm: false,
    isBackShow: {
      type: Boolean,
      default: false,
    },
    isCloseShow: {
      type: Boolean,
      default: true,
    },
    isSubmitShow: false,
    formConfirmLoading: false,
    saveLoading: false,
    submitLoading: false,
    DialogFormLoading: false,
  },
  methods: {
    // 关闭窗口
    closeDialog() {
      this.$refs.fromDialog.resetFields();
      this.$emit('close-dialog', this.fromDialog);
    },
    // 取消按钮
    dialogFormClose() {
      this.closeDialog();
      this.$emit('dialog-cancel', this.fromDialog);
    },
    // 确定按钮
    dialogFormConfirm(res) {
      this.tranDates();
      this.$refs[res].validate((valid) => {
        if (!valid) {
          return false;
        }
        this.$emit('dialog-confirm', this.fromDialog);
        if (this.message.IsTrue) {
          return false;
        }
        this.closeDialog();
        return true;
      });
    },
    // 保存按钮
    dataSave(res) {
      this.tranDates();
      this.$refs[res].validate((valid) => {
        if (!valid) {
          return false;
        }
        this.$emit('data-save', this.fromDialog);
        if (this.message.IsTrue) {
          return false;
        }
        this.closeDialog();
        return true;
      });
    },
    // 提交按钮
    dataSubmit(res) {
      this.tranDates();
      this.$refs[res].validate((valid) => {
        if (!valid) {
          return false;
        }
        this.closeDialog();
        this.$emit('data-submit', this.fromDialog);
        return true;
      });
    },
  },
  data() {
    return {
      tranDates: () => {
        for (let keys = 0; keys < this.message.selects.length; keys += 1) {
          if (this.message.selects[keys].fromType === 'date') {
            const dForm = this.fromDialog[this.message.selects[keys].key];
            if (dForm) {
              this.fromDialog[this.message.selects[keys].key] = new Date(dForm);
            }
          }
        }
      },
      formLabelWidth: '115px',
      dialogFormShow: false,
    };
  },
};
</script>
<style>
.dialogs-from .el-textarea.is-disabled .el-textarea__inner {
  background-color: rgb(238, 240, 246)!important;
  border-color: rgb(209, 217, 229)!important;
  color: rgb(0, 0, 0)!important;
  cursor: not-allowed;
}

.dialogs-from .is-disabled .el-input__inner {
  background-color: rgb(238, 240, 246)!important;
  border-color: rgb(209, 217, 229)!important;
  color: rgb(0, 0, 0)!important;
  cursor: not-allowed;
}

.dialogs-from .el-cascader.is-disabled .el-cascader__label {
  background-color: rgb(238, 240, 246)!important;
  border-color: rgb(209, 217, 229)!important;
  color: rgb(0, 0, 0)!important;
  cursor: not-allowed;
}

.dialogs-from .el-icon-circle-close:before {
  color: #f1645b;
}

.dialogs-from .el-date-editor.el-input {
  width: 299px;
}

.dialogs-from .el-checkbox+.el-checkbox {
  margin-left: 0;
  margin-right: 15px;
}

.dialogs-from .el-radio+.el-radio {
  margin-left: 0;
  margin-right: 15px;
}

.el-radio-group .el-radio {
  margin-right: 15px;
}

.dialogs-from .el-checkbox {
  margin-right: 15px;
}

.dialogs-from .el-select {
  width: 299px;
}

.dialogs-from .el-form-item__content {
  line-height: 36px;
  position: relative;
  font-size: 14px;
  width: 300px;
}

.dialogs-from .el-dialog--small {
  max-width: 520px;
  min-width: 520px;
}

.dialogs-from .no-border .el-input__inner {
  border: none;
}

.dialogs-from .iconfont {
  margin-right: 5px;
  display: inline-block;
  vertical-align: top;
}

.dialogs-from .file-list-preview .el-loading-spinner .el-loading-text {
  margin-top: -23px !important;
}
</style>
