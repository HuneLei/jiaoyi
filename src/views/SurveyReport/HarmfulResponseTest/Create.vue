<template>
  <div v-loading="loading" class="harmfulResponseTest">
    <!-- <div :style="formStyle"> -->
    <div style="height: 7.5rem;overflow: auto;">
      <el-form :rules="editMessage.rules" label-width="120px" id="from-item" ref="form" :model="form">
        <TradeEditsForm :from-edit="form" :message="editMessage" :isGoBackShow="false" :arrow-num=5 :arrow-down="true" :arrowDown="false">
          <el-form-item label="有效期" prop="validTime" slot='validTime' label-width="155px">
            <el-date-picker v-model.trim="form.validTime" format="yyyy-MM-dd" type="datetimerange" :picker-options="pickerOptions1" placeholder="选择有效期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="填报日期" prop="fillTime" slot='fillTime' label-width="155px">
            <el-date-picker v-model.trim="form.fillTime" format="yyyy-MM-dd" type="date" :picker-options="pickerOptions2" placeholder="选择填报日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="" prop="shuoming" slot='shuoming'>
            <p style="font-size: 14px;color: #ffa200;">
              <i class="icon iconfont icon-tongzhi"></i>&nbsp;&nbsp;温馨提示: 如发生说明书所载明的不良反应列为严重或发生说明书未载明的不良反应，请继续填写以下内容</p>
          </el-form-item>
        </TradeEditsForm>
      </el-form>
      <div>
      </div>
    </div>
    <TradeFooter class="trade" :authbtn="authbtn" :isSaveShow="true" :isBackShow="true" @order-save="orderSave('form')" @order-back="orderBack">
    </TradeFooter>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import TradeEditsForm from '../../../components/TradeEditsForm';        //  引订单目录表单
import TradeFooter from '../../../components/TradeFooter';           // 引入底部组件
import HarmfulResponseTest from '../../../api/SurveyReport/HarmfulResponseTest';
import convert from '../../../utils/convert'; // 引入js公共方法

export default {
  activated() {
    this.authbtn = HarmfulResponseTest.authbtn();
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: '交易系统',
      },
      {
        path: '/SurveyReport',
        name: '检查报告',
        noLink: true,
      },
      {
        path: '/SurveyReport/HarmfulResponseTest',
        name: '不良反应监测检查表',
        noLink: true,
      },
    ]);
    this.dataInit();
  },
  deactivated() {
  },
  components: {
    TradeEditsForm,
    TradeFooter,
  },
  computed: {
    formStyle() {
      return `height: ${window.innerHeight - 200}px;width: ${window.innerWidth - 300}px;overflow: auto;`;
    },
    ...mapGetters([
      'View_UserInfo',
      'getGpoId',
      'projectOptions',
      'getProjectId',
      'gpoOptions',
    ]),
    getPrincipal() {
      return this.$store.state.view.principal;
    },
  },
  watch: {
    authList() {
      this.authbtn = HarmfulResponseTest.authbtn();
    },
  },
  data() {
    return {
      authbtn: {},
      isSaveShow: true,     // 保存按钮
      pickerOptions1: {
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
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          },
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - (3600 * 1000 * 24 * 7));
            picker.$emit('pick', date);
          },
        }, {
          text: '一月前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - (3600 * 1000 * 24 * 30));
            picker.$emit('pick', date);
          },
        }, {
          text: '一年前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - (3600 * 1000 * 24 * 365));
            picker.$emit('pick', date);
          },
        }],
      },
      tableDataOld: [],
      editMessage: {
        selects: [
          { label: '填报单位', key: 'hospitalMemberId', type: 'el-select', placeholder: '请填写填报单位', span: 8, option: 'hospitalOption', belWidth: '155px', filterable: true },
          { key: 'type', type: 'el-form-item', span: 14, md: 0, sm: 0, xs: 0 },
          { label: '说明书所载明的不良反应', key: 'readyUntowardEffect', type: 'el-select', placeholder: '请选择', option: 'OptionOne', span: 8, belWidth: '155px' },
          { label: '说明书未载明的不良反应', key: 'notUntowardEffect', type: 'el-select', placeholder: '请选择', option: 'OptionOne', span: 8, belWidth: '155px' },
          { label: '发生该不良反应的状况', key: 'untowardEffectType', type: 'el-select', placeholder: '请选择', option: 'OptionTwo', span: 8, belWidth: '155px' },
          { value: 'shuoming', type: 'custom', span: 24, row: 1 },
          { label: 'CPublic', key: 'PageSubtitle2', span: 24, type: 'PageSubtitle', subTitle: { name: '药品情况', icon: 'fa fa-cube' } },
          { label: '通用名', key: 'drugsName', type: 'el-input', placeholder: '请填写通用名', isReadonly: false, span: 8, belWidth: '155px' },
          { label: '剂型', key: 'formName', type: 'el-input', placeholder: '请填写剂型', isReadonly: false, span: 8, belWidth: '155px' },
          { label: '规格', key: 'specName', type: 'el-input', placeholder: '请填写规格', isReadonly: false, span: 8, belWidth: '155px' },
          { label: '生产企业', key: 'producerName', type: 'el-input', placeholder: '请填写生产企业', isReadonly: false, span: 8, belWidth: '155px' },
          { label: '批号', key: 'batchNo', type: 'el-input', placeholder: '请填写批号', isReadonly: false, span: 8, belWidth: '155px' },
          { value: 'validTime', type: 'custom', span: 8 },
          { label: '患者不良反应的情况', key: 'untowardEffectInfo', span: 24, type: 'el-input', placeholder: '请输入患者不良反应的情况', fromType: 'textarea', rows: 3, belWidth: '155px' },
          { label: '处理情况', key: 'disposeInfo', span: 24, type: 'el-input', placeholder: '请输入处理情况', fromType: 'textarea', rows: 3, belWidth: '155px' },
          { label: '跟踪处理结果', key: 'trackDisposeInfo', span: 24, type: 'el-input', placeholder: '请输入跟踪处理结果', fromType: 'textarea', rows: 3, belWidth: '155px' },
          { label: '联系人', key: 'contacts', type: 'el-input', placeholder: '请输入联系人', isReadonly: false, span: 8, belWidth: '155px' },
          { label: '电话', key: 'phone', type: 'el-input', placeholder: '请输入联系电话', isReadonly: false, span: 8, belWidth: '155px' },
          { value: 'fillTime', type: 'custom', span: 8 },
        ],
        tabTitle: '',
        styleObject: {
          style1: {
            width: '90%',
          },
          style2: {
            width: '70%',
          },
        },
        options: {
          OptionOne: [
            {
              label: '未发生',
              value: 0,
            },
            {
              label: '一般',
              value: 1,
            },
            {
              label: '严重',
              value: 2,
            },
          ],
          OptionTwo: [
            {
              label: '个体',
              value: 0,
            },
            {
              label: '群体',
              value: 1,
            },
          ],
          hospitalOption: [],
        },
        radios: {},
        parameters: {},
        rules: {
          hospitalMemberId: [
            { required: true, message: '请选择填报单位', validator: window.validator.dialogInputZero, trigger: 'blur, change' },
          ],
          readyUntowardEffect: [
            { required: true, message: '请选择说明书所载明的不良反应', validator: window.validator.dialogInputZero, trigger: 'blur, change' },
          ],
          notUntowardEffect: [
            { required: true, message: '请选择说明书未载明的不良反应', validator: window.validator.dialogInputZero, trigger: 'blur, change' },
          ],
          untowardEffectType: [
            { required: true, message: '请选择发生该不良反应的状况', validator: window.validator.dialogInputZero, trigger: 'blur, change' },
          ],
          contacts: [
            { required: true, message: '请输入联系人', validator: window.validator.dialogInput, trigger: 'blur' },
          ],
          phone: [
            { required: true, message: '请输入联系电话', validator: window.validator.dialogInput, trigger: 'blur' },
          ],
          fillTime: [
            { required: true, message: '请选择填报日期', validator: window.validator.dialogInput, trigger: 'blur' },
          ],
        },
      },
      form: {
        hospitalMemberName: '',
        hospitalMemberId: '',
        readyUntowardEffect: '',
        notUntowardEffect: '',
        untowardEffectType: '',
        drugsName: '',
        formName: '',
        specName: '',
        producerName: '',
        batchNo: '',
        validTime: '',
        untowardEffectInfo: '',
        disposeInfo: '',
        trackDisposeInfo: '',
        contacts: '',
        phone: '',
        fillTime: '',
      },
      loading: false,
      tableData: [],
      hospitalMemberIdOld: null,  // 医疗机构id
    };
  },
  methods: {
    dataInit() {
      this.form = {
        hospitalMemberName: '',
        hospitalMemberId: '',
        readyUntowardEffect: '',
        notUntowardEffect: '',
        untowardEffectType: '',
        drugsName: '',
        formName: '',
        specName: '',
        producerName: '',
        batchNo: '',
        validTime: [],
        untowardEffectInfo: '',
        disposeInfo: '',
        trackDisposeInfo: '',
        contacts: '',
        phone: '',
        fillTime: '',
      };
      HarmfulResponseTest.hospitallist().then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          const projectOptions = [];
          if (this.getPrincipal.memberType === 3) {
            this.form.hospitalMemberId = this.getPrincipal.memberName;
            this.hospitalMemberIdOld = this.getPrincipal.memberId;
            this.editMessage.selects[0].isReadonly = true;
          } else {
            for (let i = 0; i < data.length; i += 1) {
              projectOptions.push({
                label: data[i].memberName,
                value: data[i].id,
              });
            }
            this.editMessage.options.hospitalOption = projectOptions;
          }
        }
      });
    },
    orderSave(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.dataSave();
        } else {
          return false;
        }
        return true;
      });
    },
    dataSave() {
      this.loading = true;
      if (typeof (this.form.hospitalMemberId) !== 'number' && this.getPrincipal.memberType === 3) {
        this.form.hospitalMemberId = this.hospitalMemberIdOld;
      }
      const form = {
        gpoMemberId: this.getGpoId,
        hospitalMemberId: Number(this.form.hospitalMemberId),
        readyUntowardEffect: this.form.readyUntowardEffect,
        notUntowardEffect: this.form.notUntowardEffect,
        untowardEffectType: this.form.untowardEffectType,
        drugsName: this.form.drugsName,
        formName: this.form.formName,
        specName: this.form.specName,
        producerName: this.form.producerName,
        batchNo: this.form.batchNo,
        id: 0,
        validTime: this.form.validTime,
        untowardEffectInfo: this.form.untowardEffectInfo,
        disposeInfo: this.form.disposeInfo,
        trackDisposeInfo: this.form.trackDisposeInfo,
        contacts: this.form.contacts,
        phone: this.form.phone,
        fillTime: `${this.convertDate(this.form.fillTime)}`,
      };
      if (this.form.validTime) {
        let validTime = '';
        form.validTime[0] = `${this.convertDate(form.validTime[0])}`;
        form.validTime[1] = `${this.convertDate(form.validTime[1])}`;
        if (form.validTime && typeof form.validTime === 'object') {
          validTime = `${form.validTime[0].replace(/\//g, '-')} - ${form.validTime[1].replace(/\//g, '-')}`;
        } else {
          validTime = form.validTime;
        }
        if (validTime === '1970-01-01 - 1970-01-01') {
          form.validTime = null;
        } else {
          form.validTime = validTime;
        }
      }
      if (this.getGpoId) {
        HarmfulResponseTest.saveTrade(form).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '保存成功',
            });
            this.$bus.$emit('data/list');
            history.back();
          }
          this.loading = false;
        });
      }
    },
    orderBack() {
      history.back();
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
  },
};
</script>
<style>
.harmfulResponseTest .fromtrades .fromtrade-div {
  padding-bottom: 20px !important;
  border: none;
}

.harmfulResponseTest .el-form-item {
  padding-bottom: 10px !important;
}
</style>
