<template>
  <div>
    <DialogForm :dialog-form-loading="DialogFormLoading" :dialog-form-visible="dialogFormShow" @close-dialog="CloseDialog" @dialog-confirm="dialogConfirm" @dialog-cancel="dialogCancel" :message="editMessage" :from-dialog="form" :isReadonly="false" :isFormConfirm="true" :formConfirmLoading="formConfirmLoading">
      <el-form-item label="集采项目" prop="projectId" slot='projectId' label-width="115px">
        <el-select v-model="form.projectId" placeholder="请选择集采项目" filterable>
          <el-option v-for="item in projectOption" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="集采子项目" prop="projectSubId" slot='projectSubId' label-width="115px">
        <el-select v-model="form.projectSubId" multiple placeholder="请选择集采子项目" filterable>
          <el-option v-for="item in subProjectOption" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="医疗机构报量期间" prop="reportnumTime" label-width="119px" slot="reportnumTime">
        <!--<el-date-picker :clearable="false" v-model="reportnumTime" type="datetimerange" placeholder="请选择医疗机构报量期间">
                </el-date-picker>-->
        <el-date-picker v-model="reportnumTime" :clearable="false" type="datetimerange" :picker-options="pickerOptions2" placeholder="请选择医疗机构报量期间"></el-date-picker>
      </el-form-item>
      <el-form-item label="报量有效期" prop="reportnumValid" label-width="119px" slot="reportnumValid">
        <!--<el-date-picker :clearable="false" v-model="reportnumValid" type="daterange" placeholder="请选择报量有效期">
                </el-date-picker>-->
        <el-date-picker v-model="reportnumValid" :clearable="false" format="yyyy-MM-dd" type="datetimerange" :picker-options="pickerOptions2" placeholder="请选择报量有效期"></el-date-picker>
      </el-form-item>
    </DialogForm>
  </div>
</template>
<script>
/**
 * Created by wuqian on 2017/9/20.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import ReportNumSets from '../../../api/Reportnum/ReportNumSets';
import DialogForm from '../../../components/DialogForm'; // 表单弹出框
import convert from '../../../utils/convert'; //  自定义转换js
import gpo from '../../../api/gpo'; // gpo 公共API


export default {
  activated() {
    this.$bus.$on('change/edit/dialog', this.dataUpdata);
  },
  deactivated() {
    this.$bus.$off('change/edit/dialog', this.dataUpdata);
  },
  components: {
    DialogForm,
  },
  watch: {
    reportnumTime() {
      this.form.reportnumTime = this.reportnumTime;
    },
    reportnumValid() {
      this.form.reportnumValid = this.reportnumValid;
    },
    projectId(newinfo, oldinfo) {
      this.subProjectAll(newinfo);
      if (oldinfo) {
        this.form.projectSubId = [];
      }
    },
  },
  computed: {
    projectId() {
      return this.form.projectId;
    },
    ...mapGetters([
      'getGpoId',
    ]),
  },
  data() {
    return {
      dialogFormShow: false, // 弹出框显示隐藏控制
      formConfirmLoading: false, // 确定按钮loding
      DialogFormLoading: false,
      projectOption: [],
      subProjectOption: [],
      editMessage: {
        dialogTitle: '编辑期间',
        selects: [
          { label: '集采项目', value: 'projectId', type: 'custom' },
          { label: '集采子项目', value: 'projectSubId', type: 'custom' },
          { label: '期间名称', key: 'timeName', type: 'el-input', placeholder: '请输入报量名称' },
          { value: 'reportnumTime', type: 'custom' },
          { value: 'reportnumValid', type: 'custom' },
        ],
        options: {},
        checkbox: {},
        radios: {},
        rules: {
          projectId: [
            { required: true, type: 'number', message: '请选择集采项目', trigger: 'change' },
          ],
          projectSubId: [
            { required: false, type: 'array', message: '请选择集采子项目', trigger: 'blur' },
          ],
          timeName: [
            { required: true, message: '请输入期间名称', trigger: ' blur' },
            { message: '不得超过256位字符', max: 256 },
          ],
          reportnumTime: [
            { required: true, message: '请选择医疗机构报量期间', validator: window.validator.verifyReportnumTime, trigger: 'change' },
          ],
          reportnumValid: [
            { required: true, message: '请选择报量有效期', validator: window.validator.verifyReportnumTime, trigger: 'change' },
          ],
        },
        styleObject: {},
      },
      pickerOptions2: {
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
      form: {
        projectId: null,
        projectSubId: [],
      },
      reportnumTime: [], // 医疗机构报量期间绑定值
      reportnumValid: [], // 报量有效期绑定值
    };
  },
  methods: {
    // 点击修改触发事件
    dataUpdata(row) {
      this.dialogFormShow = true; // 打开弹出框
      this.DialogFormLoading = true;
      this.formConfirmLoading = false;
      this.projectAll();
      ReportNumSets.item(row.id).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          this.form = {
            id: data.id,
            projectId: data.projectId,
            projectName: data.projectName,
            timeName: data.timeName,
            projectSubId: [],
            reportnumBtime: data.reportnumBtime,
            reportnumEtime: data.reportnumEtime,
            reportnumValidBtime: data.reportnumValidBtime,
            reportnumValidEtime: data.reportnumValidEtime,
          };
          this.subProjectAll(data.projectId);
          if (data.projectSubId !== null) {
            const a = [];
            const b = data.projectSubId.split(',');
            for (let i = 0; i < b.length; i += 1) {
              a.push(Number(b[i]));
            }
            this.form.projectSubId = a;
          }
          this.reportnumTime = [];
          this.reportnumValid = [];
          if (row.reportnumBtime) {
            this.reportnumTime[0] = new Date(this.toDateTime(data.reportnumBtime));
          }
          if (row.reportnumEtime) {
            this.reportnumTime[1] = new Date(this.toDateTime(data.reportnumEtime));
          }
          if (row.reportnumValidBtime) {
            this.reportnumValid[0] = new Date(data.reportnumValidBtime);
          }
          if (row.reportnumValidEtime) {
            this.reportnumValid[1] = new Date(data.reportnumValidEtime);
          }
          this.DialogFormLoading = false;
        }
      });
    },
    // 集采项目下拉
    projectAll() {
      gpo.ProjectCommon(this.getGpoId).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          this.projectOption = data;
        }
      });
    },
    // 集采子项目
    subProjectAll(val) {
      if (this.getGpoId) {
        ReportNumSets.all(this.getGpoId, val || null).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.subProjectOption = data;
          }
        });
      }
    },
    // 点击确定后的触发事件
    dialogConfirm(formName) {
      this.formConfirmLoading = true;
      this.form.reportnumBtime = this.convertDate(this.reportnumTime[0], 1);
      this.form.reportnumEtime = this.convertDate(this.reportnumTime[1], 1);
      this.form.reportnumValidBtime = this.convertDate(this.reportnumValid[0]);
      this.form.reportnumValidEtime = this.convertDate(this.reportnumValid[1]);
      const forms = {
        id: this.form.id,
        projectId: this.form.projectId,
        projectSubId: this.form.projectSubId,
        reportnumBtime: this.form.reportnumBtime,
        reportnumEtime: this.form.reportnumEtime,
        reportnumValidEtime: this.form.reportnumValidEtime,
        reportnumValidBtime: this.form.reportnumValidBtime,
      };
      if (this.form.projectSubId.length === 0) {
        if (this.subProjectOption.length) {
          for (let i = 0; i < this.subProjectOption.length; i += 1) {
            this.form.projectSubId.push(this.subProjectOption[i].id);
          }
        } else {
          this.$message({
            type: 'error',
            message: '当前集采项目没有集采子项目',
          });
          this.form = {
            id: forms.id,
            projectId: forms.projectId,
            projectSubId: forms.projectSubId,
            reportnumTime: `${forms.reportnumBtime} - ${forms.reportnumEtime}`,
            reportnumValid: `${forms.reportnumValidBtime} - ${forms.reportnumValidEtime}`,
          };
          this.formConfirmLoading = false;
          return false;
        }
      }
      if (this.form.id) {
        ReportNumSets.update(this.form.id, this.getGpoId, this.form.projectId,
        this.form.projectSubId, this.form.timeName, this.form.reportnumBtime,
        this.form.reportnumEtime, this.form.reportnumValidBtime, this.form.reportnumValidEtime)
        .then((res) => {
          if (res.data.code === 0) {
            this.$bus.$emit('data/list');
            this.$message({
              type: 'success',
              message: '编辑成功',
            });
            this.formConfirmLoading = false;
            this.dialogFormShow = false;
          } else {
            this.$message({
              type: 'error',
              message: res.data.message,
            });
            this.form = {
              id: forms.id,
              projectId: forms.projectId,
              projectSubId: forms.projectSubId,
              reportnumTime: `${forms.reportnumBtime} - ${forms.reportnumEtime}`,
              reportnumValid: `${forms.reportnumValidBtime} - ${forms.reportnumValidEtime}`,
            };
            this.formConfirmLoading = false;
          }
          // this.form = {};
        });
      }
      return true;
    },
    // 点击取消后的触发事件
    dialogCancel(res) {
      this.dialogFormShow = false;
    },
    // 关闭窗口后的触发事件
    CloseDialog() {
    },
    // 转换日期 YYYY-MM-DD
    convertDate(date, type) {
      return convert.convertDate(date, type);
    },
    //  取时间戳
    toDateTime(str) {
      return convert.dateTime(str);
    },
  },
};
</script>
