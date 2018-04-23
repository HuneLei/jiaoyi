<template>
  <div class="fromtrade">
    <div class="fromtrade-div" style="height: inherit; overflow-y: auto;">
      <el-col :span="message.selects[index].span?message.selects[index].span:5"
              :lg="message.selects[index].span?message.selects[index].span:5"
              :md="message.selects[index].span?message.selects[index].span:11"
              :sm="message.selects[index].span?message.selects[index].span:11"
              :xs="message.selects[index].span?message.selects[index].span:24"
              v-for="(value, index) in message.selects" :key="index" type="flex" class="row-bg"
              v-show="index + 1>arrowNum?ponentShow:true">
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
        <el-form-item v-else-if="message.selects[index].type=='el-form-item'">
          <el-input style="visibility: hidden;"></el-input>
        </el-form-item>
        <el-form-item v-else :label="message.selects[index].label" :prop="!isReadonly ? message.selects[index].key : ''"
                      v-show="typeof message.selects[index].fromShow=='undefined'?true:message.selects[index].fromShow?isThreeInOne:!isThreeInOne" :class="oddFromShow[message.selects[index].key] ? 'is-error' : ''">
          <slot :name="message.selects[index].value" v-if="message.selects[index].fromUp=='on'"></slot>
          <component v-if="(message.selects[index].genre=='number'&&message.selects[index].type=='el-input')||(isReadonly?isReadonly:message.selects[index].isReadonly)"
                     :disabled='isReadonly?isReadonly:message.selects[index].isReadonly'
                     is="el-input" :placeholder="isReadonly?'':message.selects[index].placeholder"
                     v-model.number="fromEdit[message.selects[index].key]" :type="message.selects[index].fromType"
                     :class="message.selects[index].noborder?'no-border':''"
                     :style="message.styleObject[message.selects[index].fromStyle]||editStyle" :rows="message.selects[index].rows"
                     @click="fromFocus(message.parameters[message.selects[index].fromFocus])"
                     @focus="fromFocus(message.parameters[message.selects[index].fromFocus])"
                     :icon="message.selects[index].icon"
                     size="small">
            <template v-if="message.selects[index].prepend" slot="prepend">{{message.selects[index].prepend}}</template>
            <el-button size="small" v-else-if="!isReadonly?isReadonly:(message.selects[index].isReadonly?false:message.selects[index].prependIcon)" slot="prepend" :icon="message.selects[index].prependIcon" @click="IconClick(message.parameters[message.selects[index].ClickIcon])"></el-button>
            <template v-if="message.selects[index].append" slot="append" :icon="message.selects[index].icon">{{message.selects[index].append}}</template>
            <el-button size="small" v-else-if="!isReadonly?isReadonly:(message.selects[index].isReadonly?false:message.selects[index].appendIcon)" slot="append" :icon="message.selects[index].appendIcon" @click="IconClick(message.parameters[message.selects[index].ClickIcon])"></el-button>
          </component>
          <component v-else-if="(message.selects[index].genre!='number'&&message.selects[index].type=='el-input')||(isReadonly?isReadonly:message.selects[index].isReadonly)"
                     is="el-input"
                     :disabled='isReadonly?isReadonly:message.selects[index].isReadonly'
                     :placeholder="isReadonly?'':message.selects[index].placeholder"
                     v-model="fromEdit[message.selects[index].key]" :type="message.selects[index].fromType"
                     :style="message.styleObject[message.selects[index].fromStyle]||editStyle" :rows="message.selects[index].rows"
                     @click="fromFocus(message.parameters[message.selects[index].fromFocus])"
                     @focus="fromFocus(message.parameters[message.selects[index].fromFocus])"
                     :icon="message.selects[index].icon"
                     size="small" :class="message.selects[index].noborder?'no-border':''">
            <template v-if="message.selects[index].prepend" slot="prepend">{{message.selects[index].prepend}}</template>
            <el-button size="small" v-else-if="!isReadonly?isReadonly:(message.selects[index].isReadonly?false:message.selects[index].prependIcon)" slot="prepend" :icon="message.selects[index].prependIcon" @click="IconClick(message.parameters[message.selects[index].ClickIcon])"></el-button>
            <template v-if="message.selects[index].append" slot="append" :icon="message.selects[index].icon">{{message.selects[index].append}}</template>
            <el-button size="small" v-else-if="!isReadonly?isReadonly:(message.selects[index].isReadonly?false:message.selects[index].appendIcon)" slot="append" :icon="message.selects[index].appendIcon" @click="IconClick(message.parameters[message.selects[index].ClickIcon])"></el-button>
          </component>
          <component v-else-if="message.selects[index].genre=='number'&&message.selects[index].type!='el-input'"
                     :is="message.selects[index].type"
                     :clearable="!message.selects[index].noClearable"
                     :disabled='isReadonly?isReadonly:message.selects[index].isReadonly'
                     :placeholder="isReadonly?'':message.selects[index].placeholder"
                     v-model.number="fromEdit[message.selects[index].key]" :type="message.selects[index].fromType"
                     :style="message.styleObject[message.selects[index].fromStyle]||editStyle" :rows="message.selects[index].rows"
                     @click="fromFocus(message.parameters[message.selects[index].fromFocus])"
                     @focus="fromFocus(message.parameters[message.selects[index].fromFocus])"
                     :icon="message.selects[index].icon"
                     size="small" :class="message.selects[index].noborder?'no-border':''">
            <el-option v-for="item in message.options[message.selects[index].option]" :label="item.label"
                       :value="item.value" :key="item.value"
                       v-if="message.selects[index].type=='el-select'"></el-option>
            <el-radio v-if="message.selects[index].type=='el-radio-group'" :label="item"
                      v-for="item in message.radios[message.selects[index].radios]" :key="item.value" ></el-radio>
          </component>
          <component v-else-if="message.selects[index].genre!='number'&&message.selects[index].type!='el-input'"
                     :is="message.selects[index].type"
                     :clearable="!message.selects[index].noClearable"
                     :disabled='isReadonly?isReadonly:message.selects[index].isReadonly'
                     :placeholder="isReadonly?'':message.selects[index].placeholder"
                     v-model="fromEdit[message.selects[index].key]" :type="message.selects[index].fromType"
                     :style="message.styleObject[message.selects[index].fromStyle]||editStyle" :rows="message.selects[index].rows"
                     @click="fromFocus(message.parameters[message.selects[index].fromFocus])"
                     @focus="fromFocus(message.parameters[message.selects[index].fromFocus])"
                     :icon="message.selects[index].icon"
                     size="small" :class="message.selects[index].noborder?'no-border':''">
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
    <div class="open_more" @click="onShowMore" v-show="arrowDown">
      <div class="open_more_cont">
        <i :class="moreIcon"></i>
      </div>
    </div>
    <div v-show="true" class="from-button">
      <el-col :span="24">
        <el-form-item>
          <el-button size="small" v-if="authbtn.drugsCreateList" v-show="isCreatShow"  type="primary" :loading="creatloading" @click="dataCreat('fromEdit')" :disabled="tradeEditBtn.createBtn" class="page_btn"><i class="icon iconfont icon-xinzeng"></i>新增明细
          </el-button>
          <el-button size="small" v-if="isDeleteItem" type="danger" :loading="ditemloading" @click="deleteItem('fromEdit')" :disabled="tradeEditBtn.deleteBtn" class="page_btn"><i class="icon iconfont icon-delete"></i>删除明细
          </el-button>
          <el-button name="pwnolock" v-if="isExportShow" v-show="authbtn.output" size="small" :loading="exportloading" type="warning" @click="dataExport" :disabled="tradeEditBtn.exportBtn" class="page_btn"><i class="icon iconfont icon-daochu"></i>导出模板
          </el-button>
          <span class="filesContent" v-if="isExportShow" v-show="authbtn.upload">
            <el-button name="import" class="filesBtn" v-if="isImportShow" size="small" type="warning" :disabled="tradeEditBtn.importBtn">
              <i class="icon iconfont icon-daoru" style="margin-right: 4px;" ></i>导入数据
            </el-button>
            <input type="file" class="filesInput" ref="filesInput" :disabled="tradeEditBtn.importBtn" @change="dataImport">
          </span>
          <el-button name="creatplan" v-if="isCplanShow" size="small" :loading="cplanloading" type="warning" @click="dataCplan" :disabled="tradeEditBtn.CplanBtn" class="page_btn"><i class="icon iconfont icon-daochu"></i>生成采购计划模板
          </el-button>
          <el-button name="leadplan" v-if="isLplanShow" size="small" :loading="lplanloading" type="warning" @click="dataLplan" :disabled="tradeEditBtn.LplanBtn"  class="page_btn" ><i class="icon iconfont icon-daoru"></i>导入采购计划
          </el-button>
          <el-button size="small" v-if="isGoBackShow" @click="editClose('fromEdit')" :disabled="isDisabled" class="page_btn"><i class="icon iconfont icon-fanhui"></i></el-button>
          <!--<el-button style="visibility: hidden;" size="small"></el-button>-->
        </el-form-item>
      </el-col>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import PageSubtitle from './PageSubtitle';
  import District from './District';

  export default {
    activated() {
      // 监听数据选中
      this.$bus.$on('data/select', this.dataSelect);
      this.$bus.$on('clear/file', this.clearFile);
    },
    deactivated() {
      // 移除监听数据选中
      this.$bus.$off('data/select', this.dataSelect);
      this.$bus.$off('clear/file', this.clearFile);
    },
    components: {
      PageSubtitle,
      District,
    },
    computed: {
      ...mapGetters([
        'Order_tradeRow',
      ]),
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
      return {     // 按钮置灰控制
        ponentShow: true,
        moreIcon: 'more_arrow_down up',
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
      authbtn: {
        type: Object,
        default() {
          return {
            drugsCreateList: true,
            output: true,
            upload: true,
          };
        },
      },
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
      editStyle: {
        type: Object,
        default: () => {
          const editStyle = { width: '100%', 'min-width': '120px' };
          return editStyle;
        },
      },         // 全局样式控制
      creatloading: false,   // 添加明细按钮的加载
      exportloading: false,  // 导入按钮加载
      importloading: false,  // 导出按钮加载
      cplanloading: false,   // 生成采购计划模板按钮加载
      lplanloading: false,   // 导入采购计划按钮加载
      isReadonly: false,     // 是否禁用输入框(全部禁用，这是灰色框)
      isThreeInOne: false,   // 控制表单框部分显示
      isCreatShow: false,    // 是否显示添加明细按钮
      isExportShow: false,   // 导出按钮
      isImportShow: false,   // 导入按钮
      isCplanShow: false,    // 生成采购计划模板按钮
      isLplanShow: false,    // 导入采购计划按钮
      isDeleteItem: false,   // 是否显示删除明细按钮
      ditemloading: false,   // 删除明细按钮加载
      heightStyle: 0,        // 高度控制
      oddFrom: {},           // 原值对比控制
      arrowDown: {           // 下拉是否显示
        default: false,
      },
      purchase: {
        default: 0.00,       // 金额数
      },
      purtitle: {
        default: '总金额',    // 金额前面标题
      },
      purshow: {
        default: false,      // 是否显示金额
      },
      arrowNum: {            // 第几个开始显示
        default: 0,
      },
      isGoBackShow: {
        default: true,
      },                   // 返回按钮显示控制
      fromEdit: {          // v-model绑定的值对象
        type: [String, Object],
        default: {},
      },
      // 默认的按钮样式  1、默认是可编辑的
      tradeEditBtn: {
        type: Object,
        default() {
          return {
            createBtn: false,        // 新增
            deleteBtn: false,        // 删除
            exportBtn: false,        // 导出
            importBtn: false,        // 导入
            CplanBtn: false,
            LplanBtn: false,
          };
        },
      },
    },
    methods: {
      // 显示隐藏按钮
      onShowMore() {
        this.ponentShow = !this.ponentShow;
        if (this.ponentShow) {
          this.moreIcon = 'more_arrow_down up';
        } else {
          this.moreIcon = 'more_arrow_down';
        }
        this.$emit('show-more');  // 隐藏按钮触发事件用于计算表格高度
      },
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
      deleteItem() {
        this.$emit('delete-item', this.Order_tradeRow);
      },
      // 返回按钮
      editClose(fromEdit) {
        this.$emit('edit-close');
      },
      // 添加明细
      dataCreat() {
        this.$emit('data-creat');
      },
      // 导出模板
      dataExport() {
        this.$emit('data-export');
      },
      // 导入明细
      dataImport(e) {
        this.$emit('data-import', e);
      },
      // 清楚file的值
      clearFile() {
        const file = this.$refs.filesInput;
        file.value = '';
      },
      // 生成采购计划模板
      dataCplan() {
        this.$emit('data-cplan');
      },
      // 导入采购计划
      dataLplan() {
        this.$emit('data-lplan');
      },
    },
  };
</script>

<style>
.from-red .el-input__inner {
  color: red !important;
}

.from-blue .el-input__inner {
  color: blue !important;
}

.from-green .el-input__inner {
  color: #13ce66 !important;
}

.fromtrade {
  overflow-y: auto;
}

.fromtrade .el-input,
.fromtrade .el-cascader {
  width: 100%;
  min-width: 120px;
  /*!*max-width: 180px;*!*/
}

.fromtrade .el-input.is-disabled .el-input__inner {
  background-color: #fff;
  color: #000;
}

.fromtrade .el-textarea.is-disabled .el-textarea__inner {
  background-color: rgb(238, 240, 246) !important;
  border-color: rgb(209, 217, 229) !important;
  color: rgb(0, 0, 0) !important;
  cursor: not-allowed;
}

.fromtrade .el-select .el-input.is-disabled .el-input__inner {
  background-color: #fff;
  color: #000;
}

.fromtrade .el-cascader .el-input.is-disabled .el-input__inner {
  background-color: #fff;
  color: #000;
}

.fromtrade .el-cascader.is-disabled .el-cascader__label {
  color: #000;
  background-color: #fff;
}

.fromtrade .el-date-editor .el-input.is-disabled .el-input__inner {
  background-color: #fff;
  color: #000;
}

.fromtrade .is-disabled .el-input__inner {
  background-color: rgb(238, 240, 246) !important;
  border-color: rgb(209, 217, 229) !important;
  color: rgb(0, 0, 0);
  cursor: not-allowed;
}

.fromtrade .el-cascader.is-disabled .el-cascader__label {
  background-color: rgb(238, 240, 246) !important;
  border-color: rgb(209, 217, 229) !important;
  color: rgb(0, 0, 0) !important;
  cursor: not-allowed;
}

.fromtrade .el-icon-circle-close:before {
  color: #f1645b;
}

.from-button {
  /*border-top: .01rem solid rgba(174, 194, 216, 0.96) !important;*/
  padding: .1rem;
  padding-left: .2rem;
  background-color: white !important;
  bottom: 20px;
  margin-top: 0px;
}

.fromtrade .from-button .el-form-item__content {
  margin-left: 0 !important;
}

.fromtrade .right .el-form-item__label {
  text-align: right;
}

.fromtrade .left .el-form-item__label {
  text-align: left;
}

.fromtrade .no-border .el-input__inner {
  border: none;
  font-size: 14px;
  background-color: #fff !important;
}

.fromtrade .not-border .el-input__inner {
  border: none;
  font-size: 12px;
  background-color: #fff !important;
}

.fromtrade .no-border .el-input__inner {
  border: none;
}

.fromtrade .no-border .el-textarea__inner {
  border: none;
}

.fromtrade .no-border .el-textarea__inner {
  border: none;
  font-size: 14px;
  background-color: #fff !important;
}

.fromtrade .el-form-item {
  margin-bottom: 5px;
}

.page_btn {
  line-height: 16px;
}

.page_btn i {
  margin-right: 4px;
  vertical-align: middle;
  display: inline-block;
}

.fromtrade .open_more {
  text-align: center;
  position: absolute;
  left: 0;
  width: 100%;
  height: 6px;
  cursor: pointer;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-top: none;
  box-sizing: border-box;
}

.fromtrade .open_more_cont {
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

.fromtrade .open_more_cont:hover {
  background-color: #333;
}

.fromtrade .open_more i {
  color: #234682;
  display: block;
  z-index: 2;
  margin: 0 auto;
  text-align: center;
  position: relative;
}

.fromtrade .purcha-style {
  position: absolute;
  margin-top: -34px;
  right: 25%;
  font-size: 16px;
}

.more_arrow_down {
  background-image: url('../assets/img/more_arrow_down.png');
  background-repeat: no-repeat;
  background-position: 0 0;
  display: block;
  width: 8px;
  height: 6px;
  margin: 0 auto;
  transition: all .4s;
  transform: rotate(360deg);
}

.more_arrow_down.up {
  transform: rotate(180deg);
}

.fromtrade-div {
  height: inherit;
  overflow-y: auto;
  padding: 10px 0 5px 0;
  border: 1px solid rgb(228, 232, 239);
}

.filesContent {
  position: relative;
  margin-left: 8px;
  top: 1px;
}

.filesBtn {
  position: relative;
  padding: 7px 9px 8px 9px;
}

.input-red .el-input__inner {
  color: red !important;
}

.filesInput {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  cursor: pointer;
  opacity: 0;
}
</style>

