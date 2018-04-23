<template>
  <div class="find">
    <div class="content">
      <div class="btnS">
        <el-tooltip content="搜索" placement="top">
          <el-button name="dialogBtn" class="searchBtn" @click="onSearch" type="primary">
            <i class="fa fa-search"></i>
          </el-button>
        </el-tooltip>
      </div>

      <div class="searchContentBox">
        <el-row>
          <div v-for="(item, index) in message" :key="item.key" :data-name="item.key" v-if="index < showNumber">
            <el-col :span="12" :lg="dialogSize === 'large' ? 6 : 12">
              <div class="searchct">
                <div class="searchLabel">{{item.label}}</div>
                <div class="searchInput">

                  <el-select class="searchOp" v-if="item.hasOp === true" v-model="value[index]" slot="prepend" size="small">
                    <el-option v-for="i in item.option" :key="i.value" :label="i.label" :value="i.value">
                      <span v-if="i.value === 'equal'">
                        <i class="fa fa-exchange"></i>
                      </span>
                      <span v-if="i.value === 'like'">
                        <i class="fa fa-life-ring"></i>
                      </span>
                      <span v-if="i.value === 'notlike'">
                        <i class="fa fa-times"></i>
                      </span>
                      <span v-text="i.label"></span>
                    </el-option>
                  </el-select>

                  <!-- 0 默认 文本输入框 -->
                  <span v-if="item.type === 0" :class="item.hasOp === true?'hasOp':''">
                    <el-input :placeholder="item.placeholder" v-model.trim="input[index]" size="small" @keyup.enter.native="onSearch">
                    </el-input>
                  </span>

                  <!-- 下拉选择，1 单选，2 多选 -->
                  <span v-if="item.type === 1 || item.type === 2" :class="item.hasOp === true?'hasOp':''">
                    <el-select class="searchSelect" :multiple="item.type === 2" v-model="selectList[index]" clearable size="small" @keyup.enter.native="onSearch">
                      <el-option v-for="i in item.selects" :key="i.value" :label="i.label" :value="i.value">
                      </el-option>
                    </el-select>
                  </span>

                  <!-- 3 省市级联选择 -->
                  <span v-if="item.type === 3" :class="item.hasOp === true?'hasOp':''">
                    <el-cascader placeholder="请选择省市" clearable class="citySelect" :options="city.cityOptions" v-model="city.selectedOptions" @active-item-change="getCity" size="small" @keyup.enter.native="onSearch">
                    </el-cascader>
                  </span>

                  <!-- 4 所有的日期时间格式 datatype 默认为 date, 可选 datetime/year/month/week -->
                  <span v-if="item.type === 4" :class="item.hasOp === true?'hasOp':''" class="dateSelect">
                    <el-date-picker v-model.trim="dateValue[index]" :type="item.datetype ? item.datetype : 'date'" :placeholder="item.placeholder" :picker-options="item.pickerOptions" editable size="small" @keyup.enter.native="onSearch">
                    </el-date-picker>
                  </span>

                  <!-- 5 所有的日期段、时间格式 datetype 默认为 daterange，可选 daterange/datetimerange -->
                  <span v-if="item.type === 5" :class="item.hasOp === true?'hasOp':''" class="dateSelect">
                    <el-date-picker v-model.trim="daterangeValue[index]" :type="item.datetype ? item.datetype : 'daterange'" :placeholder="item.placeholder" :picker-options="item.pickerOptions" editable size="small" @keyup.enter.native="onSearch">
                    </el-date-picker>
                  </span>

                  <!-- 6 时间段 -->
                  <span v-if="item.type === 6" class="dateDuan">
                    <el-date-picker v-model.trim="dataDate[index][0]" :type="item.datetype ? item.datetype : 'date'" :placeholder="item.dateplaceholder && item.dateplaceholder.length > 0 ? item.dateplaceholder[0] : '请选择开始日期'" class="datestart" size="small" @keyup.enter.native="onSearch">
                    </el-date-picker>
                    <span class="datemiddle">-</span>
                    <el-date-picker v-model.trim="dataDate[index][1]" :type="item.datetype ? item.datetype : 'date'" :placeholder="item.dateplaceholder && item.dateplaceholder.length > 0 ? item.dateplaceholder[1] : '请选择结束日期'" class="dateend" size="small" @keyup.enter.native="onSearch">
                    </el-date-picker>
                  </span>

                  <!-- 9 新的日期选择组件  -->
                  <span v-if="item.type === 9">
                    <div data-v-24b9b528="" class="el-input el-input--small">
                      <yl-datepicker v-model="emptyRange[index]" clearable :shortcuts="item.shortcuts" :placeholder="item.placeholder" inputClass="el-input__inner" :picker="item.picker" :class="(index+1) % 4?'':'picker-left'" @keyup.enter.native="onSearch"></yl-datepicker>
                    </div>
                  </span>

                  <!-- 10 原生文本输入框(IE11在扫码枪扫码时只能扫一部分出来所以加一个原生的) -->
                  <span v-if="item.type === 10">
                    <input type="text" ref="searchInput" class="specialInput" :placeholder="item.placeholder" v-model.trim="input[index]" size="small" @keydown="SearchChoose()"/>
                  </span>
                </div>
              </div>
            </el-col>
          </div>
        </el-row>
      </div>

    </div>
    <div class="open_more" v-show="message.length >showNum" @click="onShowMore">
      <div class="open_more_cont">
        <i :class="moreIcon"></i>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Created by dingyiming on 2017/6/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import district from '../api/district'; // 省市
import convert from '../utils/convert';                         //  自定义转换js
import YlDatepicker from './DatePicker/YlDatepicker';

export default {
  data() {
    return {
      moreIcon: 'more_arrow_down',
      input: [],
      value: [],
      selectValue: {},
      textMore: 0,
      showNumber: 0,
      selectList: [],
      select: '',
      city: {
        selectedOptions: [],  //  省市选择值
        cityOptions: [],      //  省市列表
        isloading: false,     //  是否初始化省份列表
      },
      dateValue: [], // 单个日期
      daterangeValue: [], // 日期段
      daterangeValue2: [], // 单个日期的日期段
      dataDate: [],     //  时间段合并
      emptyRange: [], // 时间段的选择
    };
  },
  components: {
    YlDatepicker,
  },
  props: {
    message: {
      default() {
        return [];
      },
    },
    showNum: {
      type: Number,
      default: 4,
    },
    dialogSize: {
      default: 'large',
    },
    inputNum: {
      default: 0,
    },
  },
  watch: {
    inputNum() {
      this.checkIn();
    },
  },
  methods: {
    SearchChoose() {
      document.onkeydown = (e) => {
        if (e.keyCode === 13) {
          this.onSearch();
        }
      };
    },
    // 清空搜索条件
    checkIn() {
      // this.onSearch();
      for (let i = 0; i < this.input.length; i += 1) {
        this.$set(this.input, i, '');
        this.$set(this.selectList, i, '');
      }
    },
    // 下拉选项\文本框默认值
    defaultValue() {
      for (let i = 0; i < this.message.length; i += 1) {
        this.dataDate.push([]);   //  给日期区间带默认

        if (this.message[i].type === 9) {
          this.$set(this.emptyRange, i, []);
          if (this.message[i].defaultDate) {
            const emptyend = new Date();
            const emptystart = new Date();
            emptystart.setTime(emptystart.getTime() - (3600 * 1000 * 24 * 30));
            this.$set(this.emptyRange[i], 0, emptystart);
            this.$set(this.emptyRange[i], 1, emptyend);
          }
        }

        if (this.message[i].type === 3 && this.city.isloading === false) {
          this.getProvince();
        }
        if (this.message[i].option !== [] && this.message[i].option) {
          this.value[i] = 'like';
          if (this.message[i].type === 1) {
            this.value[i] = 'equal';
          }
          if (this.message[i].option[1].value === 'great') { // 默认选择大于
            this.value[i] = 'great';
          }
        }
        this.input[i] = '';
        this.selectList[i] = '';
        if (this.message[i].type === 1 && this.message[i].defaults) {
          this.selectList[i] = this.message[i].defaults;
        }
      }
    },
    // 搜索-更多搜索条件
    onShowMore() {
      if (this.textMore === 0) {
        this.textMore = 1;
        this.showNumber = this.message.length;
        this.moreIcon = 'more_arrow_down up';
      } else {
        this.textMore = 0;
        this.showNumber = this.showNum;
        this.moreIcon = 'more_arrow_down';
      }
      this.$emit('dialogFindheight');
    },
    // 搜索
    onSearch() {
      this.selectValue = {};
      for (let i = 0; i < this.message.length; i += 1) {
        const a = {};
        if (this.input[i] !== '' || (this.selectList[i] !== '' && this.selectList[i].length !== 0
        )) {
          a.op = this.value[i];
          // 文本框0
          if (this.message[i].type === 0) {
            a.value = this.input[i];
          }
          if (this.message[i].type === 10) {
            a.value = this.input[i];
          }
          // 单选1
          if (this.message[i].type === 1 || this.message[i].type === 2) {
            a.value = this.selectList[i];
          }
        }
        // 日期 - 单个日期
        if (this.message[i].type === 4) {
          if (this.dateValue[i]) {
            // 转换格式
            switch (this.message[i].convertdate) {
              case 1: // 组件自带格式 Fri Sep 01 2017 00:00:00 GMT+0800 (中国标准时间)
                a.value = this.dateValue[i];
                break;
              case 2: // YYYY/MM/DD
                a.value = this.toDateOther(this.dateValue[i]);
                break;
              default: // YYYY-MM-DD
                a.value = this.convertDate(this.dateValue[i]);
                break;
            }
          }
        }
        // 日期 - 日期段
        if (this.message[i].type === 5) {
          if (this.daterangeValue[i]) {
            // 转换格式
            switch (this.message[i].convertdate) {
              case 1: // 组件自带格式 Fri Sep 01 2017 00:00:00 GMT+0800 (中国标准时间)
                a.value = [this.daterangeValue[i][0], this.daterangeValue[i][1]];
                break;
              case 2: // YYYY/MM/DD
                a.value = [
                  this.toDateOther(this.daterangeValue[i][0]),
                  this.toDateOther(this.daterangeValue[i][1]),
                ];
                break;
              default: // YYYY-MM-DD
                a.value = [
                  this.convertDate(this.daterangeValue[i][0]),
                  this.convertDate(this.daterangeValue[i][1]),
                ];
                break;
            }
          }
        }
        // 日期 - 日期段
        if (this.message[i].type === 6) {
          if (this.dataDate[i]) {
            // 转换格式
            switch (this.message[i].convertdate) {
              case 1: // 组件自带格式 Fri Sep 01 2017 00:00:00 GMT+0800 (中国标准时间)
                a.value = [
                  this.dataDate[i][0],
                  this.dataDate[i][1],
                ];
                break;
              case 2: // YYYY/MM/DD
                a.value = [
                  this.toDateOther(this.dataDate[i][0]),
                  this.toDateOther(this.dataDate[i][1]),
                ];
                break;
              default: // YYYY-MM-DD
                a.value = [
                  this.convertDate(this.dataDate[i][0]),
                  this.convertDate(this.dataDate[i][1]),
                ];
                break;
            }
          }
        }
        // 日期 - 日期段
        if (this.message[i].type === 9) {
          if (this.emptyRange[i][0] || this.emptyRange[i][1]) {
            // 转换格式
            switch (this.message[i].convertdate) {
              case 1: // 组件自带格式 Fri Sep 01 2017 00:00:00 GMT+0800 (中国标准时间)
                a.value = [
                  this.emptyRange[i][0],
                  this.emptyRange[i][1],
                ];
                break;
              case 2: // YYYY/MM/DD
                a.value = [
                  !this.emptyRange[i][0] ? '1980-01-01' : this.toDateOther(this.emptyRange[i][0]),
                  !this.emptyRange[i][1] ? '9999-01-01' : this.toDateOther(this.emptyRange[i][1]),
                ];
                break;
              default: // YYYY-MM-DD
                a.value = [
                  !this.emptyRange[i][0] ? '1980-01-01' : this.convertDate(this.emptyRange[i][0]),
                  !this.emptyRange[i][1] ? '9999-01-01' : this.convertDate(this.emptyRange[i][1]),
                ];
                break;
            }
          }
        }
        this.selectValue[this.message[i].key] = a;
        // 省市
        if (this.message[i].type === 3) {
          this.selectValue.provinceId = {
            value: this.city.selectedOptions[0],
          };
          this.selectValue.cityId = {
            value: this.city.selectedOptions[1],
          };
        }
      }
      this.selectValue.removed = this.isRecycle ? 1 : 0;
      this.$emit('dialogFind', this.selectValue);
    },
    // 改变省市值
    changeProvince(value) {
      this.city.selectedOptions = value;
    },
    // 获取省值
    getProvince() {
      district.cityList(88888).then((res) => {
        if (res.data.code === 0) {
          this.city.isloading = true;
          const data = res.data.result;
          for (let j = 0; j < data.length; j += 1) {
            let d = {};
            if (j === 0) {
              d = {
                value: data[j].id,
                label: data[j].name,
              };
            } else {
              d = {
                value: data[j].id,
                label: data[j].name,
                children: [],
              };
            }
            this.city.cityOptions.push(d);
          }
        }
      });
    },
    // 点击获取市值
    getCity(value) {
      this.city.selectedOptions = [];
      this.city.selectedOptions.push(value[0], null);
      district.cityList(value[0]).then((res) => {
        if (res.data.code === 0) {
          const cityChildren = [];
          const data = res.data.result;
          for (let i = 0; i < data.length; i += 1) {
            const a = {
              value: data[i].id,
              label: data[i].name,
            };
            cityChildren.push(a);
          }
          for (let q = 0; q < this.city.cityOptions.length; q += 1) {
            if (this.city.cityOptions[q].value === value[0]) {
              this.city.cityOptions[q].children = cityChildren;
              break;
            }
          }
        }
      });
    },
    // 转换日期 YYYY/MM/DD
    toDateOther(str) {
      return convert.convertDateOther(str);
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
  },
  mounted() {
    this.defaultValue();
    this.showNumber = this.showNum;
  },
};
</script>

<style scoped>
.find {
  position: relative;
  z-index: 10;
}

.find:after {
  content: '.';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.btnS {
  margin-top: 7px;
  position: absolute;
  right: 15px;
  overflow: hidden;
}

.searchBtn {
  padding: 8px 10px;
  font-size: 16px;
}

.searchContentBox {
  padding-right: 1rem;
}

.el-row {
  padding-bottom: 0.1rem;
}

.el-col {
  margin-top: 0.1rem;
}

.searchct {
  width: 100%;
  position: relative;
}

.specialInput {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 3px;
  border: 1px solid rgb(191, 200, 217);
  box-sizing: border-box;
  color: rgb(31, 42, 61);
  display: inline-block;
  font-size: 12px;
  height: 30px;
  line-height: 1;
  outline: none;
  padding: 3px 10px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
}

input::-ms-input-placeholder {
  font-size: 12px;
  color: rgb(131, 142, 165);
}

input::-webkit-input-placeholder {
  font-size: 12px;
  color: rgb(131, 142, 165);
}

input::-moz-input-placeholder {
  font-size: 12px;
  color: rgb(131, 142, 165);
}

input::placeholder {
  font-size: 12px;
  color: rgb(131, 142, 165);
}

.searchLabel {
  position: absolute;
  text-align: right;
  width: 60px;
  line-height: 30px;
  box-sizing: border-box;
}

.searchInput {
  position: relative;
  width: 100%;
  padding-left: 70px;
  box-sizing: border-box;
}

.citySelect {
  width: 100%;
}

.open_more {
  text-align: center;
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  height: 6px;
  cursor: pointer;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-top: none;
  box-sizing: border-box;
}

.open_more_cont {
  width: 60px;
  height: 6px;
  line-height: 6px;
  background-color: #bbb;
  position: absolute;
  left: 50%;
  top: 0;
  margin-left: -30px;
  text-align: center;
}

.open_more_cont:hover {
  background-color: #333;
}

.open_more i {
  color: #fff;
  display: block;
  font-size: 8px;
}

.left .el-tooltip__popper,
.right .el-tooltip__popper {
  padding: 8px 10px;
}

.el-select {
  width: 20px;
}

.el-select-dropdown__item {
  padding: 8px 15px;
}

.more_arrow_down {
  background-image: url('../assets/img/more_arrow_down.png');
  background-repeat: no-repeat;
  background-position: 0 0;
  display: block;
  width: 8px;
  height: 6px;
  margin: 0 auto;
  transition: all 0.4s;
  transform: rotate(360deg);
}

.more_arrow_down.up {
  transform: rotate(180deg);
}

.groupstyle {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}

.dateDuan {
  position: relative;
  overflow: hidden;
  display: block;
  text-align: center;
  line-height: 30px;
}

.datestart {
  position: absolute;
  top: 0;
  left: 0;
  width: 48%;
}

.dateend {
  position: absolute;
  top: 0;
  right: 0;
  width: 48%;
}

.datemiddle {
  display: inline-block;
}
</style>

<style>
.dateSelect .el-date-editor.el-input {
  width: 100%;
}

.find .el-select.searchOp {
  position: absolute;
  z-index: 10;
  background-color: #f0f5f8;
  border: 1px solid rgb(191, 200, 217);
  box-sizing: border-box;
  height: 36px;
  border-radius: 2px 0 0 2px;
}

.find .el-select.searchSelect {
  width: 100%;
}

.find .el-select.searchSelect .el-input {
  width: 100%;
}

.find .el-select.searchSelect .el-input .el-input__inner {
  width: 100%;
  opacity: 1;
}

.find .el-select .el-input .el-input__inner {
  /* padding: 5px;
  width: 20px; */
  opacity: 0;
}

.find .el-select .el-input .el-input__icon {
  /* width: 20px !important; */
}

.find .searchInput .hasOp .el-input .el-input__inner {
  /* padding-left: 25px; */
}

.find .searchInput .hasOp .el-select__tags {
  /* padding-left: 20px; */
}

.find .hasOp .citySelect .el-input .el-input__inner {
  /* padding-left: 25px; */
}

.find .hasOp .citySelect .el-cascader__label {
  /* padding-left: 25px; */
}
</style>
