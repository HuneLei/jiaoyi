<template>
  <!--<div class="datepicker" :class="{'datepicker-range':range,'datepicker__clearable':clearable&&text&&!disabled}">-->
  <div :class="{'datepicker-range':range,'datepicker__clearable':clearable&&text&&!disabled}" ref="pickerPopup">
    <!--<input :value="text" :class="[show ? 'focus' : '', inputClass]" :disabled="disabled" :placeholder="placeholder" :name="name" v-if="type!=='inline'">-->
    <!--<a class="datepicker-close" @click.stop="cls"></a>-->
    <div class="el-date-editor el-range-editor el-input__inner el-date-editor--daterange" @mouseover="Mouseover" @mouseout="Mouseout">
      <input placeholder="开始日期" name="" class="el-range-input" :class="inputClass" @change="dateChange(0)" @focus="dateFocus()" v-model="dateArry[0]">
      <span class="el-range-separator">至</span>
      <input placeholder="结束日期" name="" class="el-range-input" :class="inputClass" @change="dateChange(1)" @focus="dateFocus()" v-model="dateArry[1]">
      <i class="el-input__icon el-range__icon" :class="elicon" @click="eliconClick"></i>
      <!--<i class="el-input__icon el-range__icon el-icon-close"></i>-->
    </div>
    <transition name="datepicker-anim">
      <div class="datepicker-popup " :class="[popupClass,{'datepicker-inline':type==='inline'}, shortcuts||'datepicker-left']" tabindex="-1" v-show="(show||type==='inline')&&tabshow">
        <template v-if="range">
          <div class="datepicker-sidebar" v-show="shortcuts">
            <button v-show="picker.oneweek" type="button" class="datepicker-sidebar-shortcut" @click="DateClick(7)" :class="{ 'is_active': IsAcitve===7 }">最近一周</button>
            <button v-show="picker.onemonth" type="button" class="datepicker-sidebar-shortcut" @click="DateClick(30)" :class="{ 'is_active': IsAcitve===30 }">最近一个月</button>
            <button v-show="picker.threemonth" type="button" class="datepicker-sidebar-shortcut" @click="DateClick(90)" :class="{ 'is_active': IsAcitve===90 }">最近三个月</button>
            <button v-show="picker.sixmonth" type="button" class="datepicker-sidebar-shortcut" @click="DateClick(180)" :class="{ 'is_active': IsAcitve===180 }">最近半年</button>
            <button v-show="picker.oneyear" type="button" class="datepicker-sidebar-shortcut" @click="DateClick(365)" :class="{ 'is_active': IsAcitve===365 }">最近一年</button>
          </div>
          <div ref="pickerCalendar">
            <yl-datepicker-calendar v-model="dates[0]" :left="true" :class="shortcuts||'calendar-left'"></yl-datepicker-calendar>
            <yl-datepicker-calendar v-model="dates[1]" :right="true"></yl-datepicker-calendar>
          </div>
        </template>
        <template v-else>
          <yl-datepicker-calendar v-model="dates[0]"></yl-datepicker-calendar>
        </template>
      </div>
    </transition>
  </div>
</template>

<script>
  /* eslint-disable */
  import YlDatepickerCalendar from './YlDatepickerCalendar.vue'
  export default {
    name: 'YlDatepicker',
    components: { YlDatepickerCalendar },
    props: {
      name: [String],
      inputClass: [String],
      popupClass: [String],
      value: {
        type: Array,
        default: () => [],
      },
      disabled: [Boolean],
      type: {
        type: String,
        default: 'normal'
      },
      rangeSeparator: {
        type: String,
        default: '~'
      },
      clearable: {
        type: Boolean,
        default: false
      },
      shortcuts: {
        type: Boolean,
        default: true
      },
      placeholder: [String],
      disabledDate: {
        type: Function,
        default: () => {
          return false
        }
      },
      format: {
        type: String,
        default: 'YYYY-MM-DD'
      },
      picker: {
        type: Object,
        default () {
          return {
            oneweek: true,
            onemonth: true,
            threemonth: true,
            sixmonth: true,
            oneyear: true,
          }
        }
      },
      local: {
        type: Object,
        default () {
          return {
            dow: 1, // Monday is the first day of the week
            hourTip: '选择小时', // tip of select hour
            minuteTip: '选择分钟', // tip of select minute
            secondTip: '选择秒数', // tip of select second
            yearSuffix: '年', // format of head
            monthsHead: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'), // months of head
            months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'), // months of panel
            weeks: '一_二_三_四_五_六_日'.split('_') // weeks
          }
        }
      }
    },
    data () {
      return {
        show: false,
        tabshow: true,
        dateArry: [],
        elicon: 'el-icon-date',
        dates: this.vi(this.value),
        IsAcitve: null,
      }
    },
    computed: {
      range () {
        return this.dates.length === 2
      },
      text () {
        const val = this.value;
        const txt = this.dates.map(date => this.tf(date)).join(` ${this.rangeSeparator} `);
        if (this.value.length) {
          this.dateArry = this.value.map(date => date ? this.tf(date) : '');
        }
        if (Array.isArray(val)) {
          return val.length > 1 ? txt : ''
        } else {
          return val ? txt : ''
        }
      }
    },
    watch: {
      value (val) {
        if (`${this.convert.convertDate(val[1])}` === `${this.convert.convertDate(new Date())}`) {
          const a = Math.floor((new Date().getTime() - (new Date(val[0]).getTime()))/(24*3600*1000));
          this.IsAcitve = a;
        } else {
          this.IsAcitve = null;
        }
        this.dates = this.vi(this.value)
      }
    },
    methods: {
      Mouseover() {
        if (this.dateArry[0] || this.dateArry[1]) {
          this.elicon = 'el-icon-close';
        }
      },
      Mouseout() {
        this.elicon = 'el-icon-date';
      },
      eliconClick() {
        if (this.elicon === 'el-icon-close') {
          this.$set(this.value, 0, null);
          this.$set(this.value, 1, null);
//          this.$set(this.value, i, this.tf(new Date()));
        }
      },
      dateFocus() {
        this.show = true;
      },
      dateChange(i) {
        const datelist = this.dateArry[i].split('-');
        if (datelist[1] && datelist[2]) {
          if (datelist[1].length === 1) {
            datelist[1] = `0${datelist[1]}`
          }
          if (datelist[2].length === 1) {
            datelist[2] = `0${datelist[2]}`
          }
        }
        this.dateArry[i] = datelist.join('-');
        if (new Date(this.dateArry[i]) <= new Date() && i===0) {
          this.dateArry[i] = this.tf(new Date(this.dateArry[i]));
          this.$set(this.value, i, this.tf(new Date(this.dateArry[i])));
        } else if (new Date(this.dateArry[i]) > new Date() && i===0) {
          this.dateArry[i] = '';
          this.$set(this.value, i, '');
          this.$message({
            message: '开始日期不能大于今天',
            type: 'error'
          });
        } else if ((new Date(this.dateArry[0]).toString() === 'Invalid Date' || new Date(this.dateArry[0]) <= new Date(this.dateArry[i])) && new Date(this.dateArry[i]).toString() !== 'Invalid Date' && i===1) {
          this.dateArry[i] = this.tf(new Date(this.dateArry[i]));
          this.$set(this.value, i, this.tf(new Date(this.dateArry[i])));
        } else if (new Date(this.dateArry[0]) > new Date(this.dateArry[i]) && i===1) {
          this.dateArry[i] = '';
          this.$set(this.value, i, '');
          this.$message({
            message: '结束日期不能小于起始日期',
            type: 'error'
          });
        } else if (new Date(this.dateArry[i]).toString() === 'Invalid Date' && this.dateArry[i] !== '') {
          this.dateArry[i] = '';
          this.$set(this.value, i, '');
          this.$message({
            message: '请输入的格式为yyyy-mm-dd的有效日期',
            type: 'error'
          });
        } else {
          this.dateArry[i] = null;
          this.value[i] = null;
//          this.$emit('input', this.range ? [] : '')
        }
        this.elicon = 'el-icon-date';
      },
      DateClick(day) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - (3600 * 1000 * 24 * day));
        this.$set(this.value, 0, start);
        this.$set(this.value, 1, end);
      },
      cls () {
        this.$emit('input', this.range ? [] : '')
      },
      vi (val) {
        if (Array.isArray(val)) {
          return val.length > 1 ? val.map(item => item ? new Date(item) : new Date()) : [new Date(), new Date()]
        } else {
          return val ? new Array(new Date(val)) : [new Date()]
        }
      },
      ok () {
        const $this = this;
        $this.$emit('input', Array.isArray($this.value) ? $this.dates : $this.dates[0]);
        setTimeout(() => {
          $this.show = $this.range
        })
      },
      tf (time, format) {
        time = new Date(time);
        const year = time.getFullYear();
        const month = time.getMonth();
        const day = time.getDate();
        const hours24 = time.getHours();
        const hours = hours24 % 12 === 0 ? 12 : hours24 % 12;
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();
        const milliseconds = time.getMilliseconds();
        const dd = t => ('0' + t).slice(-2);
        const map = {
          YYYY: year,
          MM: dd(month + 1),
          MMM: this.local.months[month],
          MMMM: this.local.monthsHead[month],
          M: month + 1,
          DD: dd(day),
          D: day,
          HH: dd(hours24),
          H: hours24,
          hh: dd(hours),
          h: hours,
          mm: dd(minutes),
          m: minutes,
          ss: dd(seconds),
          s: seconds,
          S: milliseconds
        };
        return (format || this.format).replace(/Y+|M+|D+|H+|h+|m+|s+|S+/g, str => map[str])
      },
      dc (e) {
//      this.show = this.$refs.pickerCalendar.contains(e.target) && !this.disabled
        if (this.elicon !== 'el-icon-close') {
          this.show = this.$el.contains(e.target) && !this.disabled
        }
      },
      fo (e) {
//      this.show = this.$refs.pickerCalendar.contains(e.target) && !this.disabled
        this.show = this.$el.contains(e.target) && !this.disabled
      }
    },
    mounted () {
      document.addEventListener('click', this.dc);
    },
    beforeDestroy () {
      document.removeEventListener('click', this.dc)
    }
  }
</script>

<style>
  .datepicker {
    position: relative;
  }

  .datepicker:before {
    content: '';
    display: block;
    position: absolute;
    width: 34px;
    height: 100%;
    top: 0;
    right: 0;
    background: url('data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiPjxwYXRoIGQ9Ik01NjQgMTgwLjJINDQ4Yy04LjMgMC0xNS02LjctMTUtMTVzNi43LTE1IDE1LTE1aDExNmM4LjIgMCAxNSA2LjcgMTUgMTVzLTYuOCAxNS0xNSAxNXoiIGZpbGw9IiM5ODk4OTgiLz48cGF0aCBkPSJNOTQ1IDk1Mi4ySDgxLjJjLTguMiAwLTE1LTYuNy0xNS0xNVYxNjIuOGMwLTguMyA2LjgtMTUgMTUtMTVIMjk0YzguMiAwIDE1IDYuNyAxNSAxNXMtNi44IDE1LTE1IDE1SDk2LjJ2NzQ0LjRIOTMwVjE3Ny44SDcxMy42Yy04LjMgMC0xNS02LjctMTUtMTVzNi43LTE1IDE1LTE1SDk0NWM4LjIgMCAxNSA2LjcgMTUgMTV2Nzc0LjRjMCA4LjMtNi44IDE1LTE1IDE1eiIgZmlsbD0iIzk4OTg5OCIvPjxwYXRoIGQ9Ik0zMzMuMyA1NTFIMjE2Yy04LjIgMC0xNS02LjgtMTUtMTVzNi44LTE1IDE1LTE1aDExNy4zYzguMyAwIDE1IDYuNiAxNSAxNXMtNi43IDE1LTE1IDE1em0yMzAuMyAwSDQ0Ni4zYy04LjMgMC0xNS02LjgtMTUtMTVzNi43LTE1IDE1LTE1aDExNy4zYzguMiAwIDE1IDYuNiAxNSAxNXMtNi44IDE1LTE1IDE1em0yMzAuMiAwSDY3Ni42Yy04LjMgMC0xNS02LjgtMTUtMTVzNi43LTE1IDE1LTE1aDExNy4yYzguMyAwIDE1IDYuNiAxNSAxNXMtNi43IDE1LTE1IDE1ek0zMzMuMyA3NDBIMjE2Yy04LjIgMC0xNS02LjgtMTUtMTVzNi44LTE1IDE1LTE1aDExNy4zYzguMyAwIDE1IDYuNiAxNSAxNXMtNi43IDE1LTE1IDE1em0yMzAuMyAwSDQ0Ni4zYy04LjMgMC0xNS02LjgtMTUtMTVzNi43LTE1IDE1LTE1aDExNy4zYzguMiAwIDE1IDYuNiAxNSAxNXMtNi44IDE1LTE1IDE1em0yMzAuMiAwSDY3Ni42Yy04LjMgMC0xNS02LjgtMTUtMTVzNi43LTE1IDE1LTE1aDExNy4yYzguMyAwIDE1IDYuNiAxNSAxNXMtNi43IDE1LTE1IDE1ek0zNzAuOCAyNTguNmMtOC4zIDAtMTUtNi43LTE1LTE1Vjg2LjhjMC04LjIgNi43LTE1IDE1LTE1czE1IDYuOCAxNSAxNXYxNTYuOGMwIDguMy02LjcgMTUtMTUgMTV6bTI3MC4yIDBjLTguMyAwLTE1LTYuNy0xNS0xNVY4Ni44YzAtOC4yIDYuNy0xNSAxNS0xNXMxNSA2LjggMTUgMTV2MTU2LjhjMCA4LjMtNi43IDE1LTE1IDE1ek05NDUgMzcyLjJIODEuMmMtOC4yIDAtMTUtNi43LTE1LTE1czYuOC0xNSAxNS0xNUg5NDVjOC4yIDAgMTUgNi43IDE1IDE1cy02LjggMTUtMTUgMTV6IiBmaWxsPSIjOTg5ODk4Ii8+PC9zdmc+') no-repeat 50% 50%;
  }

  .datepicker-close {
    display: none;
    position: absolute;
    width: 34px;
    height: 100%;
    top: 0;
    right: 0;
    cursor: pointer;
  }

  .datepicker-close:before {
    display: block;
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    left: 50%;
    top: 50%;
    margin-left: -8px;
    margin-top: -8px;
    text-align: center;
    background: #ccc;
    color: #fff;
    border-radius: 50%;
    background:#ccc url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3IDciIHdpZHRoPSI3IiBoZWlnaHQ9IjciPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik01LjU4LDVsMi44LTIuODFBLjQxLjQxLDAsMSwwLDcuOCwxLjZMNSw0LjQxLDIuMiwxLjZhLjQxLjQxLDAsMCwwLS41OC41OGgwTDQuNDIsNSwxLjYyLDcuOGEuNDEuNDEsMCwwLDAsLjU4LjU4TDUsNS41OCw3LjgsOC4zOWEuNDEuNDEsMCwwLDAsLjU4LS41OGgwWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEuNSAtMS40OCkiIHN0eWxlPSJmaWxsOiNmZmYiLz48L3N2Zz4NCg==') no-repeat 50% 50%;
  }

  .datepicker__clearable:hover:before {
    display: none;
  }
  .datepicker__clearable:hover .datepicker-close{
    display: block;
  }

  .datepicker-close:hover:before{
    background-color: #afafaf;
  }

  .datepicker>input:hover {
    border: 1px solid rgb(93, 131, 202);
  }

  .datepicker>input {
    color: #666;
    transition: all 200ms ease;
    height: 34px;
    box-sizing: border-box;
    outline: none;
    padding: 0 34px 0 12px;
    font-size: 12px;
    width: 100%;
    user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    border-radius: 3px;
    border: 1px solid rgb(191, 200, 217);
  }

  .datepicker>input.focus {
    -webkit-box-shadow: 0 0 5px rgba(59, 180, 242, .3);
    box-shadow: 0 0 5px rgba(59, 180, 242, .3);
  }

  .datepicker>input:disabled {
    cursor: not-allowed;
    background-color: #ebebe4;
    border-color: #e5e5e5;
    -webkit-box-shadow: none;
    box-shadow: none;
  }

  .picker-left .datepicker-popup{
    right: -166px;
  }

  .datepicker-popup {
    position: absolute;
    transition: all 200ms ease;
    opacity: 1;
    transform: scaleY(1);
    transform-origin: center top;
    font-size: 12px;
    background: #fff;
    border: 1px solid #d9d9d9;
    box-shadow: 0 1px 6px rgba(99, 99, 99, 0.2);
    margin-top: 2px;
    outline: 0;
    padding: 5px;
    overflow: hidden;
    z-index: 999
  }

  .datepicker-inline{
    position: relative;
    margin-top: 0;
  }

  .datepicker-range {
    min-width: 100px;
    font-size: 10px;
  }

  .datepicker-range .datepicker-popup{
    width: 520px;
  }

  .datepicker-bottom {
    float: left;
    width: 100%;
    text-align: right;
  }

  .datepicker-btn {
    padding: 5px 10px;
    background: #1284e7;
    color: #fff;
    border-radius: 2px;
    display: inline-block;
    cursor: pointer;
  }
  .datepicker-sidebar {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 96px;
    border-right: 1px solid #e4e4e4;
    box-sizing: border-box;
    padding-top: 6px;
    background-color: rgb(250, 252, 254);
  }
  .datepicker-sidebar-shortcut {
    display: block;
    width: 100%;
    border: 0;
    background-color: transparent;
    line-height: 28px;
    font-size: 12px;
    color: rgb(72, 84, 106);
    padding-left: 12px;
    text-align: left;
    outline: none;
    cursor: pointer;
  }
  .datepicker-sidebar-shortcut:hover {
    background-color: rgb(228, 231, 241);
  }
  
  .datepicker-anim-enter-active {
    transform-origin: 0 0;
    animation: datepicker-anim-in .2s cubic-bezier(.23, 1, .32, 1)
  }

  .datepicker-anim-leave-active {
    transform-origin: 0 0;
    animation: datepicker-anim-out .2s cubic-bezier(.755, .05, .855, .06)
  }

  .calendar-left {
    margin-left: 0 !important;
  }
  .datepicker-left {
    width: 403px!important;
  }

  @keyframes datepicker-anim-in {
    0% {
      opacity: 0;
      transform: scaleY(.8)
    }
    to {
      opacity: 1;
      transform: scaleY(1)
    }
  }

  @keyframes datepicker-anim-out {
    0% {
      opacity: 1;
      transform: scaleY(1)
    }
    to {
      opacity: 0;
      transform: scaleY(.8)
    }
  }
  .el-date-editor .el-range-input {
    border: none;
    outline: none;
    display: inline-block;
    height: 100%;
    margin: 0;
    padding: 0;
    width: 40%;
    text-align: center;
  }
  .el-range-separator {
    color: #606266;
    font-size: 11px;
  }
  .datepicker-range .el-input__icon {
    width: 20px;
    text-align: left;
    background: white;
  }
  .el-date-editor input::-ms-clear {
    display:none !important;
  }
</style>

<style scoped>
  .el-date-editor--daterange {
    overflow: hidden;
  }
  .el-range-input {
    width: 45%;
    float: left;
  }
  .el-range-separator {
    width: 10%;
    float: left;
    text-align: center;
    line-height: 22px;
  }
  .is_active {
    background-color: #1284e7;
    color: #fff;
  }
  .is_active:hover {
    background: #1284e7!important;
    color: #fff;
  }

</style>
