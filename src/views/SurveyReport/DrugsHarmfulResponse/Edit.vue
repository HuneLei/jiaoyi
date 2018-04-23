<template>
  <div v-loading="loading" class="drugsHarmfulResponse">
    <!-- <div :style="formStyle"> -->
    <div style="height: 7.5rem;overflow: auto;">
      <el-form :rules="editMessage.rules" label-width="120px" id="from-item" ref="form" :model="form">
        <TradeEditsForm :from-edit="form" :message="editMessage" :isGoBackShow="false" :isCreatShow="true" :isDeleteItem="true" :arrow-num=5 :arrow-down="true" :arrowDown="false" @data-creat="dataCreat" @delete-item="deleteItem">
          <el-form-item label="填报日期" prop="fillTime" slot='fillTime'>
            <el-date-picker v-model.trim="form.fillTime" format="yyyy-MM-dd" type="date" :picker-options="pickerOptions2" placeholder="选择填报日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="importantInformationType" slot='importantInformationType' class="importantInfo">
            <el-checkbox-group v-model="form.importantInformationType" @change="chooseChange">
              <el-checkbox name="importantInformationType" label="1">吸烟史</el-checkbox>
              <el-checkbox name="importantInformationType" label="2">饮酒史</el-checkbox>
              <el-checkbox name="importantInformationType" label="3">妊娠期</el-checkbox>
              <el-checkbox name="importantInformationType" label="4">肝病史</el-checkbox>
              <el-checkbox name="importantInformationType" label="5">肾病史</el-checkbox>
              <el-checkbox name="importantInformationType" label="6">过敏史</el-checkbox>
              <el-checkbox name="importantInformationType" label="0">其他
                <el-input type="textarea" :rows="1" v-model="importantInformationOther" placeholder="请输入内容" :disabled="importantInformationOtherDisabled" class="importantInformationOther"></el-input>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item prop="medicalTreatment" slot='medicalTreatment' class="patient">
            <el-radio-group v-model="form.medicalTreatment">
              <el-radio label="1">门诊病人</el-radio>
              <el-radio label="2">住院病人</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="drugs" slot='drugs' class="drugs">
          </el-form-item>
        </TradeEditsForm>
        <div>
          <el-table :data="tableData" @selection-change="dataSelect" stripe border fit :height="View_TableHeight" @sort-change="sortChange">
            <el-table-column type="selection" width="40">
            </el-table-column>
            <!--<el-table-column prop="num" label="#" width="40" show-overflow-tooltip></el-table-column>-->
            <el-table-column prop="drugsType" width="80" label="药品" sortable="custom" show-overflow-tooltip>
              <template scope="scope">
                <span v-if="scope.row.drugsType === 1">怀疑药品</span>
                <span v-if="scope.row.drugsType === 2">并用药品</span>
                <span v-else></span>
              </template>
            </el-table-column>
            <!--<el-table-column prop="drugsCode" width="80" label="药品编码" sortable="custom" show-overflow-tooltip>
            </el-table-column>-->
            <el-table-column prop="drugsName" width="120" label="通用名称" sortable="custom" show-overflow-tooltip>
            </el-table-column>
            <!-- <el-table-column prop="tradeName" min-width="90" label="商品名" sortable="custom" show-overflow-tooltip>
            </el-table-column> -->
            <el-table-column prop="specName" width="90" label="规格" sortable="custom" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="formName" min-width="80" label="剂型" sortable="custom" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="approvalNumber" width="130" label="批准文号" sortable="custom" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="productorBatch" width="130" label="生产批号" sortable="custom" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="usageDosage" min-width="50" label="用法用量" sortable="custom" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="usageTime" min-width="130" label="用药时间" sortable="custom" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="usageReason" min-width="100" label="用药原因" sortable="custom" class-name="table_right" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" min-width='160' fixed="right" label="操作">
              <template scope="scope">
                <el-button type="text" @click="dataUpdate(scope.row)">
                  <i class="fa fa-edit"></i> 编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <TradeEditsForm :from-edit="form" :message="editMessageOne" :isGoBackShow="false" :arrow-num=5 :arrow-down="true" :arrowDown="false">
          <el-form-item label="附件" slot="fileUrl">
            <y-upload-edit :image="true" :pdf="false" :fileList="uploadData" @upload-result="uploadResult"></y-upload-edit>
          </el-form-item>
          <el-form-item prop="stopDrugsType" slot='stopDrugsType' class="feedback">
            <el-radio-group v-model="form.stopDrugsType">
              <el-radio label="1">是</el-radio>
              <el-radio label="2">否</el-radio>
              <el-radio label="3">不明</el-radio>
              <el-radio label="4">未减量或停药</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="reportPersonEvaluateType" slot='reportPersonEvaluateType' class="reportPerson" label="报告人评价">
            <el-radio-group v-model="form.reportPersonEvaluateType">
              <el-radio label="1">肯定</el-radio>
              <el-radio label="2">很可能</el-radio>
              <el-radio label="3">可能</el-radio>
              <el-radio label="4">待评价</el-radio>
              <el-radio label="5">无法评价</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="reportCompanyEvaluateType" slot='reportCompanyEvaluateType' class="reportUnit" label="报告单位评价">
            <el-radio-group v-model="form.reportCompanyEvaluateType">
              <el-radio label="1">肯定</el-radio>
              <el-radio label="2">很可能</el-radio>
              <el-radio label="3">可能</el-radio>
              <el-radio label="4">待评价</el-radio>
              <el-radio label="5">无法评价</el-radio>
            </el-radio-group>
          </el-form-item>
        </TradeEditsForm>
      </el-form>
      <div>
      </div>
    </div>
    <TradeFooter class="trade" :authbtn="authbtn" :isSaveShow="isSaveShow" :isBackShow="true" :isDeleteShow="isDeleteShow" @order-save="orderSave('form')" @order-back="orderBack" @order-delete="orderDelete">
    </TradeFooter>
    <Detail @add-drugDetail="addDetail"></Detail>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import TradeEditsForm from '../../../components/TradeEditsForm';        //  引订单目录表单
import TradeFooter from '../../../components/TradeFooter';           // 引入底部组件
import DrugsHarmfulResponse from '../../../api/SurveyReport/DrugsHarmfulResponse';
import convert from '../../../utils/convert'; // 引入js公共方法
import Detail from './Detail';

export default {
  activated() {
    this.authbtn = DrugsHarmfulResponse.authbtn();
    this.TableHeightRun(['.fromtrades', '.tradeFooter', '.search-find', 120]);
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
        path: '/SurveyReport/DrugsHarmfulResponse',
        name: '药品不良反应报告表',
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
    Detail,
  },
  computed: {
    ...mapGetters([
      'View_TableHeight',
      'getGpoId',
      'projectOptions',
      'getProjectId',
      'View_UserInfo',
    ]),
    formStyle() {
      return `height: ${window.innerHeight - 200}px;width: auto;overflow: auto;`;
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
    uploadData() {
      this.TableHeightRun(['.el-form', '.TradeFooter', 250]);
      if (this.uploadData.length === 0) {
        this.TableHeightRun(['.el-form', '.TradeFooter', 160]);
      }
    },
    authList() {
      this.authbtn = DrugsHarmfulResponse.authbtn();
    },
  },
  mounted() {
    window.onresize = () => {
      if (this.$route.path === '/SurveyReport/DrugsHarmfulResponse/Edit') {
        this.TableHeightRun(['.fromtrades', '.tradeFooter', '.search-find', 120]);
      }
    };
  },
  data() {
    return {
      authbtn: {},
      uploadData: [], //  上传文件
      isSaveShow: true,
      isDeleteShow: true,
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
          { label: '填报单位', key: 'hospitalMemberId', type: 'el-select', placeholder: '请填写填报单位', span: 4, option: 'hospitalOption', filterable: true },
          { value: 'fillTime', type: 'custom', span: 4 },
          // { key: 'type', type: 'el-form-item', span: 14, md: 0, sm: 0, xs: 0 },
          { label: 'CPublic', key: 'patientInfo', span: 24, type: 'PageSubtitle', subTitle: { name: '患者信息', icon: 'fa fa-user-plus', rules: true } },
          { label: '姓名', key: 'name', type: 'el-input', placeholder: '请输入姓名', isReadonly: false, span: 4 },
          { label: '性别', key: 'sex', type: 'el-input', placeholder: '请输入性别', isReadonly: false, span: 4 },
          { label: '年龄', key: 'age', type: 'el-input', placeholder: '请输入年龄', isReadonly: false, span: 4 },
          { label: '体重', key: 'weight', type: 'el-input', placeholder: '请输入体重', isReadonly: false, span: 4 },
          { label: '联系方式', key: 'contactInformation', type: 'el-input', placeholder: '请输入联系方式', isReadonly: false, span: 4 },
          { label: '原患病史', key: 'oldDisease', span: 20, type: 'el-input', placeholder: '请输入原患病史', fromType: 'textarea', rows: 2 },
          { label: 'CPublic', key: 'importantInformationType', span: 24, type: 'PageSubtitle', subTitle: { name: '相关重要信息', icon: 'fa fa-id-card-o', rules: true } },
          { value: 'importantInformationType', type: 'custom', span: 24 },
          { label: 'CPublic', key: 'medicalTreatment', span: 24, type: 'PageSubtitle', subTitle: { name: '病人就诊情况', icon: 'fa fa-hospital-o', rules: true } },
          { value: 'medicalTreatment', type: 'custom', span: 24 },
          { label: 'CPublic', key: 'PageSubtitle2', span: 24, type: 'PageSubtitle', subTitle: { name: '用药情况', icon: 'fa fa-medkit', rules: true } },
          { value: 'drugs', type: 'custom', span: 24 },
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
          hospitalOption: [],
        },
        radios: {},
        parameters: {},
        rules: {
          hospitalMemberId: [
            { required: true, message: '请选择填报单位', validator: window.validator.dialogInputZero, trigger: 'blur, change' },
          ],
          fillTime: [
            { required: true, message: '请输入填报日期', validator: window.validator.dialogInput, trigger: 'blur' },
          ],
          name: [
            { required: true, message: '请输入姓名', validator: window.validator.dialogInput, trigger: 'blur' },
            { max: 256, message: '不得超过256位字符' },
          ],
          age: [
            { required: true, message: '请输入数字类型的年龄', validator: window.validator.verifyNumberOnly, trigger: 'blur' },
            { max: 256, message: '不得超过256位字符' },
          ],
          sex: [
            { required: true, message: '请输入性别', validator: window.validator.dialogInput, trigger: 'blur' },
            { max: 256, message: '不得超过256位字符' },
          ],
          weight: [
            { required: true, message: '请输入体重', validator: window.validator.dialogInput, trigger: 'blur' },
            { max: 256, message: '不得超过256位字符' },
          ],
          contactInformation: [
            { required: true, message: '请输入联系方式', validator: window.validator.dialogInput, trigger: 'blur' },
            { max: 256, message: '不得超过256位字符' },
          ],
          oldDisease: [
            { required: true, message: '请输入原患病史', validator: window.validator.dialogInput, trigger: 'blur' },
            { max: 256, message: '不得超过256位字符' },
          ],
          importantInformationType: [
            { type: 'array', required: true, message: '请选择相关重要信息', trigger: 'change' },
          ],
          medicalTreatment: [
            { required: true, message: '请选择病人就诊情况', trigger: 'change' },
          ],
          // drugs: [
          //   { type: 'array', required: true, message: '请填写用药情况', trigger: 'blur' },
          // ],
          stopDrugsType: [
            { required: true, message: '请选择停药或减药后、反应事件是否消失或减轻', trigger: 'change' },
          ],
          reportPersonEvaluateType: [
            { required: true, message: '请选择报告人评价', trigger: 'change' },
          ],
          reportCompanyEvaluateType: [
            { required: true, message: '请选择报告单位评价', trigger: 'change' },
          ],
          reportPerson: [
            { required: true, message: '请输入报告人姓名', validator: window.validator.dialogInput, trigger: 'blur' },
            { max: 256, message: '不得超过256位字符' },
          ],
          reportPhone: [
            { required: true, message: '请输入报告人电话', validator: window.validator.dialogInput, trigger: 'blur' },
            { max: 256, message: '不得超过256位字符' },
          ],
          reportMail: [
            { required: true, message: '请输入报告人邮箱', validator: window.validator.dialogInput, trigger: 'blur' },
            { max: 256, message: '不得超过256位字符' },
          ],
        },
      },
      editMessageOne: {
        selects: [
          { label: '不良反应事件描述', key: 'untowardEffectDescription', span: 24, type: 'el-input', placeholder: '不良反应事件描述(包括症状、生命体征、临床体检)', fromType: 'textarea', rows: 3 },
          { value: 'fileUrl', type: 'custom', span: 24, md: 20, sm: 24, isReadonly: true },
          { label: 'CPublic', key: 'PageSubtitle2', span: 24, type: 'PageSubtitle', subTitle: { name: '停药或减药后、反应事件是否消失或减轻', icon: 'fa fa-venus-double', rules: true } },
          { value: 'stopDrugsType', type: 'custom', span: 24 },
          { label: 'CPublic', key: 'PageSubtitle2', span: 24, type: 'PageSubtitle', subTitle: { name: '关联性评价', icon: 'fa fa-window-restore', rules: true } },
          { value: 'reportPersonEvaluateType', type: 'custom', span: 24 },
          { value: 'reportCompanyEvaluateType', type: 'custom', span: 24 },
          { label: '报告人', key: 'reportPerson', type: 'el-input', placeholder: '请输入报告人', isReadonly: false, span: 8 },
          { label: '电话', key: 'reportPhone', type: 'el-input', placeholder: '请输入报告人电话', isReadonly: false, span: 8 },
          { label: '邮箱', key: 'reportMail', type: 'el-input', placeholder: '请输入报告人邮箱', isReadonly: false, span: 8 },
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
        },
        radios: {},
        parameters: {},
        rules: {
        },
      },
      form: {
        gpoMemberId: '',
        hospitalMemberId: '',
        fillTime: '',
        name: '',
        age: '',
        sex: '',
        weight: '',
        contactInformation: '',
        importantInformationType: [],
        medicalTreatment: '',
        untowardEffectDescription: '',
        stopDrugsType: '',
        reportPersonEvaluateType: null,
        reportCompanyEvaluateType: null,
        reportPerson: '',
        reportPhone: '',
        reportMail: '',
        fileUrl: '',
      },
      loading: false,
      tableData: [],
      tableDataOne: [],
      importantInformationOther: '', // 相关重要信息其他
      importantInformationOtherDisabled: true,
      hospitalMemberIdOld: null,  // 医疗机构id
    };
  },
  methods: {
    chooseChange() {
      if (this.form.importantInformationType.indexOf('0') > -1) {
        this.importantInformationOtherDisabled = false;
      } else {
        this.importantInformationOtherDisabled = true;
      }
    },
    ...mapActions([
      'TableHeightRun',
      'GetDetailDate',
      'Initialize',
      'TradeSelect',
      'CountNum',
      'DeleteItem',
    ]),
    addDetail(data, editType) {
      if (editType) {
        for (let i = 0; i < this.tableData.length; i += 1) {
          if (this.tableData[i].mark === true) {
            this.tableData[i].drugsType = data.drugsType;
            this.tableData[i].drugsName = data.drugsName;
            this.tableData[i].formName = data.formName;
            this.tableData[i].specName = data.specName;
            this.tableData[i].approvalNumber = data.approvalNumber;
            this.tableData[i].productorBatch = data.productorBatch;
            this.tableData[i].usageDosage = data.usageDosage;
            this.tableData[i].usageTime = data.usageTime;
            this.tableData[i].usageReason = data.usageReason;
            this.tableData[i].mark = false;
            // const ret = {
            //   ...data,
            // };
            // this.tableData[i] = ret;
          }
        }
      } else {
        const ret1 = {
          ...data,
        };
        // 添加一个属性用于判断
        ret1.mark = false;
        this.tableData.unshift(ret1);
      }
    },
    dataUpdate(item) {
      for (let i = 0; i < this.tableData.length; i += 1) {
        if (item.productorBatch === this.tableData[i].productorBatch) {
          this.tableData[i].mark = true;
        }
      }
      this.$bus.$emit('data/getDrugsDetail', item);
    },
    // 添加明细
    dataCreat() {
      this.$bus.$emit('data/DrugsHarmfulResponse');
    },
    // 删除明细操作
    deleteItem(res) {
      this.$confirm('确定要删除该明细吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        for (let i = 0; i < res.length; i += 1) {
          for (let j = 0; j < this.tableData.length; j += 1) {
            if (res[i].productorBatch === this.tableData[j].productorBatch) {
              this.tableData.splice(j, 1);
            }
          }
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    //  选择触发事件，根据审核状态判断右下角btn是否禁用
    dataSelect(row) {
      let booldelete = false;
      let first = 0;
      for (let i = 0; i < row.length; i += 1) {
        first += 1;
      }
      if (first > 0) {
        booldelete = false;
      } else {
        booldelete = true;
      }
      const btn = {
        orderDelete: booldelete,
      };
      this.TradeSelect({ tradeRow: row, tradeBtn: btn });
    },
    dataInit() {
      this.loading = true;
      if (this.$route.query.id) {
        DrugsHarmfulResponse.item(this.$route.query.id).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.form = data;
            this.tableData = data.reportInfoItemOutputList;
            this.form.importantInformationType = data.importantInformationType.split(',');
            this.form.reportPersonEvaluateType = data.reportPersonEvaluateType.toString();
            this.form.reportCompanyEvaluateType = data.reportCompanyEvaluateType.toString();
            this.form.medicalTreatment = data.medicalTreatment.toString();
            this.form.stopDrugsType = data.stopDrugsType.toString();
            this.importantInformationOther = data.importantInformationOther;
            this.uploadData = [];
            if (this.form.importantInformationType.indexOf('0') > -1) {
              this.importantInformationOtherDisabled = false;
            } else {
              this.importantInformationOtherDisabled = true;
            }
            // 附件信息
            this.form.fileUrl = data.fileUrl;
            if (!this.form.fileUrl) {
              this.form.fileUrl = 0;
            }
            if (typeof (this.toJSON(data.fileUrl)) === 'object') {
              this.uploadData = this.toJSON(data.fileUrl);
            }
            DrugsHarmfulResponse.hospitallist().then((res1) => {
              if (res1.data.code === 0) {
                const data1 = res1.data.result;
                const projectOptions = [];
                if (this.getPrincipal.memberType === 3) {
                  this.form.hospitalMemberId = this.getPrincipal.memberName;
                  this.hospitalMemberIdOld = this.getPrincipal.memberId;
                  this.editMessage.selects[0].isReadonly = true;
                } else {
                  for (let i = 0; i < data1.length; i += 1) {
                    projectOptions.push({
                      label: data1[i].memberName,
                      value: data1[i].id,
                    });
                  }
                  this.editMessage.options.hospitalOption = projectOptions;
                  this.form.hospitalMemberId = data.hospitalMemberId;
                }
              }
            });
          }
          this.loading = false;
        });
      }
    },
    //  每次点击排序都会触发
    sortChange(rule) {
      if (rule.order) {
        const tableData = this.convert.tableSort(rule, this.tableData);
        this.tableData = [...tableData];
      } else {
        this.tableData = [...this.tableDataOld];
      }
    },
    // 上传
    uploadResult(res) {
      this.form.fileUrl = res;
      this.uploadData = this.convert.getJSON(this.form.fileUrl);
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
      if (this.tableData.length === 0) {
        this.$message({
          type: 'error',
          message: '用药情况不能为空',
        });
        return false;
      }
      this.loading = true;
      if (typeof this.form.hospitalMemberId !== 'number' && this.getPrincipal.memberType === 3) {
        this.form.hospitalMemberId = this.hospitalMemberIdOld;
      }
      const form = {
        gpoMemberId: this.getGpoId,
        hospitalMemberId: Number(this.form.hospitalMemberId),
        fillTime: `${this.convertDate(this.form.fillTime)}`,
        name: this.form.name,
        age: this.form.age,
        sex: this.form.sex,
        weight: this.form.weight,
        contactInformation: this.form.contactInformation,
        importantInformationType: this.form.importantInformationType.toString(),
        medicalTreatment: this.form.medicalTreatment,
        oldDisease: this.form.oldDisease,
        reportItemForm: this.tableData,
        id: this.$route.query.id,
        untowardEffectDescription: this.form.untowardEffectDescription,
        stopDrugsType: this.form.stopDrugsType,
        fileUrl: this.form.fileUrl,
        reportPersonEvaluateType: this.form.reportPersonEvaluateType,
        reportCompanyEvaluateType: this.form.reportCompanyEvaluateType,
        reportPerson: this.form.reportPerson,
        reportPhone: this.form.reportPhone,
        reportMail: this.form.reportMail,
        importantInformationOther: this.importantInformationOther,
      };
      if (this.getGpoId) {
        DrugsHarmfulResponse.saveTrade(form).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '保存成功',
            });
            this.$refs.form.resetFields();
            this.$bus.$emit('data/list');
            history.back();
          }
          this.loading = false;
        });
      }
      return true;
    },
    // 删除
    orderDelete() {
      if (this.$route.query.id) {
        DrugsHarmfulResponse.destoryTrade(this.$route.query.id).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功',
            });
            this.$refs.form.resetFields();
            this.$bus.$emit('data/list');
            history.back();
          }
        });
      }
    },
    orderBack() {
      this.$refs.form.resetFields();
      history.back();
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
    //  json字符串转json，否则还是返回字符串
    toJSON(str) {
      return convert.toJSON(str);
    },
  },
};
</script>
<style>
.drugsHarmfulResponse .fromtrades .fromtrade-div {
  border: none;
}

.drugsHarmfulResponse .is-required {
  margin-bottom: 20px !important;
}

.drugsHarmfulResponse .edit-form-title {
  margin-bottom: 0 !important;
}

.drugsHarmfulResponse .edit-form-item {
  margin-bottom: 10px !important;
}

.importantInfo .el-form-item__content {
  margin-left: 50px !important;
}

.importantInfo .el-input input {
  margin-left: 10px;
  height: 20px;
  width: 100px;
}

.importantInfo .el-checkbox__label {
  font-weight: 500;
  color: rgb(72, 84, 106);
}

.importantInfo .importantInformationOther {
  margin-left: 15px;
}

.patient .el-form-item__content {
  margin-left: 50px !important;
}

.feedback .el-form-item__content {
  margin-left: 50px !important;
}

.drugs .el-form-item__content {
  margin-left: 50px !important;
}

.reportPerson .el-form-item__content {
  margin-left: 50px !important;
}

.reportUnit .el-form-item__content {
  margin-left: 50px !important;
}

.patient .el-radio {
  font-weight: 500;
  color: rgb(72, 84, 106);
}
</style>
