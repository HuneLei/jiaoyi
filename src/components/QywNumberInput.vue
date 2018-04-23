<template>
  <div>

    <el-input v-model="numberValue" :size="size" :class="className" @focus="onFocus" @blur="onBlur"></el-input>

  </div>
</template>

<script>
/**
 * 数字输入框
 */
export default {
  mounted() {
  },
  watch: {
    value() {
      this.numberValue = this.value;
    },
    numberValue() {
      this.$emit('change', this.numberValue, this.index, this.data);
    },
  },
  computed: {
    reg() {
      const reg = `^${this.isSymbol ? '([+-])?' : ''}([1-9]\\d*|0{1})${this.decimal === 0 ? '' : `(\\.\\d{1,${this.decimal || ''}})?`}$`;
      return new RegExp(reg);
    },
    className() {
      if (!this.reg.test(String(this.numberValue))) {
        return 'qyw-number-input-error';
      }
      if (this.min || this.min === 0) {
        if (Number(this.numberValue) < Number(this.min)) {
          return 'qyw-number-input-error';
        }
      }
      if (this.max || this.max === 0) {
        if (Number(this.numberValue) > Number(this.max)) {
          return 'qyw-number-input-error';
        }
      }
      return '';
    },
  },
  data() {
    return {
      numberValue: this.value,
      oldValue: undefined,
    };
  },
  methods: {
    onFocus(e) {
      //  获得焦点时
      this.oldValue = e.target.value;
    },
    onBlur(e) {
      //  失去焦点时
      if (!this.reg.test(this.numberValue)) {
        this.numberValue = this.oldValue;
      }
    },
  },
  props: {
    value: {
      default: '',
    },
    //  输入框唯一标识
    index: {
      type: [Number, String],
      default: 0,
    },
    //  回调要一起跟出去的数据
    data: {
      default: () => { },
    },
    //  输入框大小类型
    size: {
      type: String,
      default: 'small',
    },
    //  最小值
    min: {
      default: undefined,
    },
    //  最大值
    max: {
      default: undefined,
    },
    //  小数点保留后几位
    decimal: {
      default: 2,
    },
    //  前面是否允许输入符号
    isSymbol: {
      default: false,
    },
  },
};
</script>

<style>
.qyw-number-input-error .el-input__inner {
  border: 1px solid #ff4949 !important;
}

/* 0
0000
1
11.
12
12.1
12.222
12.2222
12.00



^([1-9]\d*|0{1})(\.)?(\d{0,)?$ */
</style>
