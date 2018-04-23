<template>
  <div class="find">
    <div class="content">
      <div class="btnS">
        <el-tooltip content="个性化" placement="top" style="float: right;" v-if="isShowFilter">
          <el-dropdown trigger="click" :hide-on-click="false" @visible-change="filterHandler">
            <el-button class="searchBtn" size="small">
              <i class="fa fa-filter"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-checkbox-group v-model="personalField" class="groupstyle">
                <el-dropdown-item v-for="(item, index) in filterField" :key="index">
                  <el-checkbox :label="item.key" @change="filterFieldCheckBox">{{item.label}}</el-checkbox>
                </el-dropdown-item>
              </el-checkbox-group>
            </el-dropdown-menu>
          </el-dropdown>
        </el-tooltip>
        <el-tooltip content="回收站" placement="top" v-show="isShowRec">
          <el-button class="searchBtn" @click="onRecycle" :type="isRecycle?'danger':''" size="small">
            <i class="fa fa-trash-o"></i>
          </el-button>
        </el-tooltip>
        <el-tooltip content="搜索" placement="top">
          <el-button class="searchBtn" @click="onSearch" type="primary" size="small">
            <i class="fa fa-search"></i>
          </el-button>
        </el-tooltip>
      </div>

      <div class="searchContentBox">
        <el-row>
          <div v-for="(item, index) in message" :key="item.key" :data-name="item.key" v-show="index < showNumber">
            <el-col :span="12" :lg="6">
              <div class="searchct">
                <div class="searchLabel">{{item.label}}</div>
                <div class="searchInput">

                  <el-select class="searchOp" v-if="item.hasOp === true" v-model="value[index]" slot="prepend" size="small" @keyup.enter.native="onSearch">
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
                    <el-input :placeholder="item.placeholder" v-model.trim="input[index]" size="small" :disabled="item.idDisabled" @keyup.enter.native="onSearch" :icon="input[index]?(iconShow[index]?'':''):''" @click="handleIconClick(index)" @focus="handleIconFocus(index)" @blur="handleIconBlur(index)">
                    </el-input>
                  </span>

                  <!-- 下拉选择，1 单选 -->
                  <span v-if="item.type === 1" :class="item.hasOp === true?'hasOp':''">
                    <el-select :placeholder="item.placeholder" class="searchSelect" :filterable="item.filterable" v-model="selectList[index]" :clearable="!item.noClearable" size="small" @keyup.enter.native="onSearch">
                      <el-option v-for="i in item.selects" :key="i.value" :label="i.label" :value="i.value">
                      </el-option>
                    </el-select>
                  </span>

                  <!-- 下拉选择，2 多选 -->
                  <span v-if="item.type === 2 && selectListMore.length" :class="item.hasOp === true?'hasOp':''">
                    <span class="searchselect-more">
                      <el-input :placeholder="item.placeholder" v-model="input[index]" class="searchselect-more-input" size="small" icon="caret-bottom">
                      </el-input>
                      <el-select class="searchselect-more-select" multiple :filterable="item.filterable" v-model="selectListMore[index]" clearable size="small" @keyup.enter.native="onSearch" @change="getMore(selectListMore[index], item.selects, index)">
                        <el-option v-for="i in item.selects" :key="i.value" :label="i.label" :value="i.value">
                        </el-option>
                      </el-select>
                    </span>
                  </span>

                  <!-- 3 省市级联选择 -->
                  <span v-if="item.type === 3" :class="item.hasOp === true?'hasOp':''">
                    <el-cascader placeholder="请选择省市" clearable class="citySelect" :options="city.cityOptions" v-model="city.selectedOptions" @active-item-change="getCity" size="small" @keyup.enter.native="onSearch">
                    </el-cascader>
                  </span>

                  <!-- 4 所有的日期时间格式 datatype 默认为 date, 可选 datetime/year/month/week -->
                  <span v-if="item.type === 4" :class="item.hasOp === true?'hasOp':''" class="dateSelect">
                    <el-date-picker v-model.trim="dateValue[index]" :type="item.datetype ? item.datetype : 'date'" :placeholder="item.placeholder" :picker-options="item.pickerOptions" :clearable="!item.noClearable" editable size="small" @keyup.enter.native="onSearch">
                    </el-date-picker>
                  </span>
                  <!-- 5 所有的日期段、时间格式 datetype 默认为 daterange，可选 daterange/datetimerange -->
                  <span v-if="item.type === 5" :class="item.hasOp === true?'hasOp':''" class="dateSelect">
                    <el-date-picker v-model.trim="daterangeValue[index]" :type="item.datetype ? item.datetype : 'daterange'" :placeholder="item.placeholder" :picker-options="pickerOptionsRange" editable size="small" @keyup.enter.native="onSearch">
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

                  <!--7 省市区-->
                  <span v-if="item.type === 7" :class="item.hasOp === true?'hasOp':''">
                    <el-cascader class="citySelect" :options="city.cityOptions" v-model="city.selectedOptions" @change="handleChange" change-on-select clearable size="small" @keyup.enter.native="onSearch">
                    </el-cascader>
                  </span>

                  <!-- 8 集采项目表下拉关联集采子项目  by  WQ  -->
                  <span v-if="item.type === 8">
                    <el-select class="searchSelect" v-model="selectList[index]" clearable size="small" @change="getSelectValue" @keyup.enter.native="onSearch">
                      <el-option v-for="i in item.selects" :key="i.value" :label="i.label" :value="i.value">
                      </el-option>
                    </el-select>
                  </span>

                  <!-- 9 新的日期选择组件  -->
                  <span style="height: 30px; display: block;" v-if="item.type === 9">
                    <div data-v-24b9b528="" class="el-input el-input--small">
                      <yl-datepicker v-model="emptyRange[index]" clearable :shortcuts="item.shortcuts" :placeholder="item.placeholder" inputClass="el-input__inner" :picker="item.picker" :class="(index+1) % 4?'':'picker-left'"></yl-datepicker>
                    </div>
                  </span>

                  <!-- 10 原生文本输入框(IE11在扫码枪扫码时只能扫一部分出来所以加一个原生的) -->
                  <span v-if="item.type === 10">
                    <input type="text" ref="searchInput" class="specialInput" :placeholder="item.placeholder" v-model.trim="input[index]" size="small"   @keydown="SearchChoose()" />
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
import YlDatepicker from '../components/DatePicker/YlDatepicker';

export default {
  activated() {
    this.personalField = [];
    if (this.filterField) {
      for (let i = 0; i < this.filterField.length; i += 1) {
        if (this.filterField[i].show) {
          this.personalField.push(this.filterField[i].key);
        }
      }
    }
  },
  created() {
    for (let i = 0; i < this.message.length; i += 1) {
      this.selectListMore[i] = [];
    }
  },
  components: {
    YlDatepicker,
  },
  data() {
    return {
      moreIcon: 'more_arrow_down',
      input: [],
      value: [],
      iconShow: [],
      selectValue: {},
      textMore: 0,
      showNumber: 0,
      selectList: [],
      select: '',
      isRecycle: false,
      personalField: [],
      city: {
        selectedOptions: [],  //  省市选择值
        cityOptions: [],      //  省市列表
        isloading: false,     //  是否初始化省份列表
      },
      dateValue: [], // 单个日期
      daterangeValue: [], // 日期段
      daterangeValue2: [], // 单个日期的日期段
      dataDate: [],     //  时间段合并
      selectListMore: [], // 多选
      emptyRange: [], // 时间段的选择
      pickerOptionsRange: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(start.getTime() + (3600 * 1000 * 24 * 7));
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(start.getTime() + (3600 * 1000 * 24 * 30));
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(start.getTime() + (3600 * 1000 * 24 * 90));
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '无穷大',
          onClick(picker) {
            const end = new Date((new Date('9999-12-31').getTime() - (3600 * 1000 * 8)));
            const start = picker.minVisibleDate ?
              new Date(new Date(picker.minVisibleDate).getTime() - (3600 * 1000 * 8)) : new Date();
            picker.$emit('pick', [start, end]);
          },
        }],
      },
    };
  },
  props: {
    isShowRec: {
      default: false,
    },
    isShowFilter: {
      default: false,
    },
    message: {
      default() {
        return [];
      },
    },
    moreShow: {
      default: 1,
    },
    showNum: {
      type: Number,
      default: 4,
    },
    filterField: Array,
    defaultAjax: {
      default: 0,
    },
    isEmit: { //  是否使用父子组件传查询参数
      default: false,
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
    // 输入框焦点事件
    handleIconFocus(index) {
      this.iconShow = [];
      this.$set(this.iconShow, index, true);
    },
    // 输入框失去焦点事件
    handleIconBlur(index) {
      this.$set(this.iconShow, index, false);
    },
    // 输入框快速清空
    handleIconClick(index) {
      this.$set(this.input, index, '');
    },
    // 关联其他下拉选择框取值
    getSelectValue(val) {
      this.$emit('selectValue', val);
    },
    //  当前回收站是否启用，并执行搜索
    onRecycle() {
      this.isRecycle = !this.isRecycle;
      this.$emit('recycle', this.isRecycle);
      this.onSearch();
    },
    // 下拉选项\文本框默认值
    defaultValue() {
      for (let i = 0; i < this.message.length; i += 1) {
        if (this.message[i].type === 4 && this.message[i].dateValue) {
          this.$set(this.dateValue, i, []);
          this.dateValue[i] = [this.convertDate(this.message[i].dateValue)];
        }
        const end = new Date();
        const start = new Date();
        if (this.message[i].type === 5 && this.message[i].defaultDate) {
          this.$set(this.daterangeValue, i, []);
          start.setTime(start.getTime() - (3600 * 1000 * 24 * 30));
          this.daterangeValue[i] = [this.convertDate(start), this.convertDate(end)];
        }
        if (this.message[i].type === 9) {
          this.$set(this.emptyRange, i, []);
          if (this.message[i].defaultDate) {
            const emptyend = new Date();
            const emptystart = new Date();
            if (location.hash === '#/Contract/ContractItem') {
              emptystart.setTime(emptystart.getTime() - (3600 * 1000 * 24 * 365));
            } else {
              emptystart.setTime(emptystart.getTime() - (3600 * 1000 * 24 * 30));
            }
            this.$set(this.emptyRange[i], 0, emptystart);
            this.$set(this.emptyRange[i], 1, emptyend);
          }
        }
        if (this.message[i].type === 5 && this.message[i].defaultDateRange) {
          this.$set(this.daterangeValue, i, []);
          const startTime = this.message[i].defaultDateRange[0];
          this.daterangeValue[i] = [this.convertDate(startTime), this.convertDate(end)];
        }
        if (this.message[i].type === 3 && this.city.isloading === false) {
          this.getProvince();
        }
        if (this.message[i].type === 7 && this.city.isloading === false) {
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
        this.input[i] = this.input[i] || '';
        this.selectList[i] = this.selectList[i] || '';
        if (this.message[i].type === 0 && this.message[i].input) {
          this.$set(this.input, i, this.message[i].input);
        }
        if (this.message[i].type === 1 && this.message[i].defaults) {
          this.$set(this.selectList, i, this.message[i].defaults);
        }
        if (this.message[i].type === 2 && this.message[i].defaults) {
          this.$set(this.selectListMore, i, this.message[i].defaults);
          this.getMore(this.message[i].defaults, this.message[i].selects, i);
        }
        if (this.message[i].type === 8 && this.message[i].defaults) {
          this.$set(this.selectList, i, this.message[i].defaults);
        }
      }
    },
    filterHandler(val) {
      if (val) {
        this.personalField = [];
        for (let i = 0; i < this.filterField.length; i += 1) {
          if (this.filterField[i].show) {
            this.personalField.push(this.filterField[i].key);
          }
        }
      }
    },
    filterFieldCheckBox() {
      const map = {};
      const fileds = this.personalField;
      for (let i = 0; i < fileds.length; i += 1) {
        map[fileds[i]] = true;
      }
      this.$emit('filter-field', map);
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
      this.$bus.$emit('table/height');
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
          if (this.message[i].type === 1
            || this.message[i].type === 8) {
            a.value = this.selectList[i];
          }
        }
        // 多选2
        if (this.message[i].type === 2) {
          a.value = this.selectListMore[i];
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
              case 3: // YYYY年份
                a.value = this.convert.convertDateOther(this.dateValue[i], 1);
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
                a.value = [
                  this.daterangeValue[i][0],
                  this.daterangeValue[i][1],
                ];
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
        if (this.message[i].type === 7) {
          this.selectValue.provinceId = {
            value: this.city.selectedOptions[0],
          };
          this.selectValue.cityId = {
            value: this.city.selectedOptions[1],
          };
          this.selectValue.countyId = {
            value: this.city.selectedOptions[2],
          };
        }
      }
      this.selectValue.removed = this.isRecycle ? 1 : 0;
      if (this.isEmit) {
        this.$emit('data-search', this.selectValue);
      } else {
        this.$bus.$emit('components/Find', this.selectValue);
      }
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
          // j = 1,丢弃国家选项
          for (let j = 1; j < data.length; j += 1) {
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
    // value鼠标移入后获取省市区 key默认选中打开
    handleChange(value, key) {
      if (key) {
        if (value[1]) {
          this.getCityId(value, value[2]);
        }
      } else {
        if ((value.length === 1 && value[0]) || (value.length === 3 && !value[2])) {
          this.getCityId(value);
        }
        if (value.length === 2 && value[1]) {
          this.getCountys(value);
        }
        this.$emit('selected-province', this.city.selectedOption);  // 返回选中省市区
      }
      return true;
    },
    // 进来加载省
    getProvinceId() {
      district.cityList(88888).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          for (let j = 0; j < data.length; j += 1) {
            let d = {};
            if (j === 0) {
              d = {
                value: data[j].id,
                label: data[j].name,
                disabled: true,
              };
            } else {
              d = {
                value: data[j].id,
                label: data[j].name,
                children: [],
              };
            }
            this.$set(this.city.cityOptions, j, d);
          }
          try {
            this.handleChange(this.city.selectedOption, true);
          } catch (error) {
            this.city.selectedOption = [];
            this.handleChange(this.city.selectedOption, true);
          }
        }
      });
    },
    // 选中后获取市
    getCityId(value, cityValue) {
      district.cityList(value[0]).then((res) => {
        if (res.data.code === 0) {
          const cityChildren = [];
          const data = res.data.result;
          if (data) {
            for (let i = 0; i < data.length; i += 1) {
              const a = {
                value: data[i].id,
                label: data[i].name,
                children: [],
              };
              cityChildren.push(a);
            }
          }
          for (let q = 0; q < this.city.cityOptions.length; q += 1) {
            if (this.city.cityOptions[q].value === value[0]) {
              if (this.city.cityOptions[q].value < 32) {
                this.$set(this.city.cityOptions[q], 'children', cityChildren);
              } else {
                this.$set(this.city.cityOptions[q], 'children', cityChildren);
                for (let i = 0; i < cityChildren.length; i += 1) {
                  delete this.city.cityOptions[q].children[i].children;
                }
              }
              break;
            }
          }
        }
        if (cityValue) {
          this.getCountys(value);
        }
      });
    },
    // 选中后获取区域
    getCountys(value) {
      district.cityList(value[1]).then((res) => {
        if (res.data.code === 0) {
          const cityChildren = [];
          const data = res.data.result;
          if (data) {
            for (let i = 0; i < data.length; i += 1) {
              const a = {
                value: data[i].id,
                label: data[i].name,
              };
              cityChildren.push(a);
            }
          }
          for (let q = 0; q < this.city.cityOptions.length; q += 1) {
            if (this.city.cityOptions[q].value === value[0]) {
              for (let i = 0; i < this.city.cityOptions[q].children.length; i += 1) {
                if (this.city.cityOptions[q].children[i].value === value[1]) {
                  if (cityChildren.length) {
                    this.$set(this.city.cityOptions[q].children[i], 'children', cityChildren);
                  }
                  break;
                }
              }
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
    //  多选触发事件
    getMore(value, list, index) {
      const arr = {};
      for (let i = 0; i < list.length; i += 1) {
        const item = list[i];
        arr[item.value] = item.label;
      }
      if (!value || value.length === 0) {
        this.$set(this.input, index, '');
      } else if (value.length === 1) {
        this.$set(this.input, index, arr[value[0]]);
      } else {
        for (let i = 0; i < value.length; i += 1) {
          const key = value[i];
          if (i === 0) {
            this.$set(this.input, index, arr[value[i]]);
          } else {
            this.$set(this.input, index, `${this.input[index]}、${arr[value[i]]}`);
          }
        }
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.defaultValue();
    });
    //      this.defaultValue();
    if (this.moreShow === 0) {
      this.textMore = 1;
      this.showNumber = this.message.length;
      this.moreIcon = 'more_arrow_down up';
    } else {
      this.textMore = 0;
      this.showNumber = this.showNum;
      this.moreIcon = 'more_arrow_down';
    }
  },
  watch: {
    defaultAjax() {
      this.defaultValue();
    },
  },
};
</script>

<style scoped>
.content {
  border: 1px solid rgb(223, 228, 236);
  padding: 0 0.2rem 0 0.2rem;
}

.find {
  position: relative;
  z-index: 10;
  margin-bottom: 0.2rem;
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
  float: right;
  margin-left: 0.08rem;
  padding: 7px 9px;
  font-size: 19px;
}

.searchContentBox {
  padding-right: 1.5rem;
}

.el-row {
  padding-bottom: 0.1rem;
}

.el-col {
  margin-top: 0.1rem;
}

.searchct {
  position: relative;
}

.searchLabel {
  position: absolute;
  text-align: right;
  width: 80px;
  line-height: 30px;
  top: 0;
  left: 0;
  box-sizing: border-box;
  font-size: 12px;
}

.searchInput {
  position: relative;
  width: 100%;
  padding-left: 90px;
  box-sizing: border-box;
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

.dateDuan .el-date-editor.el-input {
  /* width: 40%; */
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
    width: 20px;
    opacity: 0; */
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

.find .el-icon-white:before {
  content: '';
}

.find .el-icon-close:hover {
  cursor: pointer;
  color: #8391a5;
}

.find .searchselect-more {
  width: 100%;
  overflow: hidden;
  position: relative;
  display: block;
}

.find .searchselect-more .el-select__tags {
  max-width: 10000px !important;
  width: 10000px;
}

.find .searchselect-more .el-select__tags .el-tag {
  display: none;
}

.find .searchselect-more .searchselect-more-input {
  position: absolute;
  top: 0;
  left: 0;
}

.find .searchselect-more .searchselect-more-select {
  display: block;
  width: 100%;
  height: 30px;
  opacity: 0;
  overflow: hidden;
}
</style>
