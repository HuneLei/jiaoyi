<template>
  <div>
    <Percent v-show="isupload" :percentage="percentage"></Percent>
    <el-form :rules="editMessage.rules" label-width="100px">
      <TradeEditsForm :from-edit="Order_PlanfromEdit" :isCreatShow="true" :projectSubShow="true" :projectSubOptions="projectSubOption" :isDeleteItem="true" :isExportShow="true" :isImportShow="true" :message="editMessage" :isGoBackShow="false" :arrow-num=4 :arrow-down="true" @delete-item="deleteItem" @data-creat="dataCreat" @data-export="dataExport" @data-import="dataImport" @show-more="showMore">
      </TradeEditsForm>
    </el-form>

    <div class="search-find">
      <Find :message="searchMessage" :isEmit="true" @data-search="dataSearch"></Find>
    </div>

    <div>
      <el-table :data="tableData" @selection-change="dataSelect" stripe border fit :height="View_TableHeight" @sort-change="sortChange">
        <el-table-column type="selection" width="40">
        </el-table-column>
        <el-table-column prop="num" label="#" width="40"></el-table-column>
        <el-table-column prop="drugsCode" min-width="90" label="药品编码" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="drugsName" min-width="120" label="通用名" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="tradeName" min-width="80" label="商品名" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="formName" min-width="90" label="剂型" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="specName" min-width="90" label="规格" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="packSpecName" min-width="90" label="包装规格" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="unitName" min-width="60" label="单位" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column min-width="80" label="数量" sortable="custom" show-overflow-tooltip>
          <template scope="scope">
            <el-input class="input-right close-clear" style="width: 98%" slot="reference" size="small" placeholder="请输入内容" @focus="creatFocus(scope.row.purchaseNum)" @keyup.native="keydown(scope.row.purchaseNum, scope.row.hospitalUnitPrice, scope.$index )" @blur="keydown(scope.row.purchaseNum, scope.row.hospitalUnitPrice, scope.$index )" v-model="scope.row.purchaseNum">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="qualityLevel" min-width="80" label="质量层次" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="producerName" min-width="180" label="生产企业" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="approvalNumber" min-width="130" label="批准文号" sortable="custom" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-footer">
      <div style="float: left;padding-right: 15px;padding-left: 63%">
        <span>总数量：</span>{{Order_purchaseNum}} </div>
    </div>
    <EditDialog :options="dialogOptions" @dialog-hide="dialogHide"></EditDialog>
  </div>
</template>

<script>
/**
 * Created by wuqian on 2017/6/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import TradeEditsForm from '../../../components/TradeEditsForm';        //  引订单目录表单
import EditDialog from './EditDialog';                    //  引订单目录表单
import Table from '../../../utils/tableHeight';                         //  重新计算高度
import HospitalReportNum from '../../../api/Reportnum/HospitalReportNum';
import gpo from '../../../api/gpo'; // gpo 公共API

export default {
  created() {
    const btn = {
      orderCreat: true,
      orderDelete: true,
      orderExport: true,
      orderImport: true,
      orderProjectSub: true,
    };
    this.ControltradeBtn(btn);
    this.projectAll();
  },
  computed: {
    projectId() {
      return this.Order_PlanfromEdit.projectId;
    },
    projectSubName() {
      return this.Order_PlanfromEdit.projectSubName;
    },
    timeName() {
      return this.Order_PlanfromEdit.timeName;
    },
    tableData() {
      const data = this.Order_PlanDateList || [];
      const ret = [];
      const search = ['drugsCode', 'drugsName', 'producerName'];  //  进行筛选的字段
      let isSearch = 0; //  是否进行筛选
      for (let i = 0; i < search.length; i += 1) {
        const key = search[i];
        if (this.searchValue[key] || this.searchValue[key] === 0) {
          isSearch += 1;
        }
      }

      let num = 0;
      for (let i = 0; i < data.length; i += 1) {
        const item = data[i];
        if (isSearch) {
          let isEnabled = 0;
          for (let j = 0; j < search.length; j += 1) {
            const key = search[j];
            const value = this.searchValue[key];  //  搜索条件
            //  有搜索条件的情况下
            if (value || value === 0) {
              if (item[key].indexOf(value) > -1) {
                isEnabled += 1;
              }
            }
          }
          if (isEnabled === isSearch) {
            num += 1;
            item.num = num;
            ret.push(item);
          }
        } else {
          item.num = i + 1;
          ret.push(item);
        }
      }
      return ret;
    },
    ...mapGetters([
      'getGpoId',
      'View_TableHeight',
      'Order_purchaseNum',
      'Order_PlanItemDate',
      'Order_PlanDateList',
      'Order_purchaseAmount',
      'Order_PlanfromEdit',
      'View_UserInfor',
    ]),
  },
  components: {
    EditDialog,
    TradeEditsForm,
  },
  watch: {
    getGpoId() {
      this.projectAll();
    },
    timeName(newinfo, oldinfo) {
      if (this.$route.path === '/Reportnum/HospitalReportNum/Creat') {
        if (this.Order_PlanDateList.length) {
          if (this.changInfo) {
            this.changInfo = 0;
            return;
          }
          this.changInfo += 1;
          this.Order_PlanfromEdit.timeName = oldinfo;
          this.$confirm('此操作将清空明细，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.PlanListClear(0);
            this.changInfo = 1;
            this.Order_PlanfromEdit.timeName = newinfo;
            this.Order_PlanfromEdit.reportnumValid = null;
            this.Order_PlanfromEdit.reportnumValidBtime = null;
            this.Order_PlanfromEdit.reportnumValidEtime = null;
            const info = newinfo.split('&');
            const timeId = !info[0] || info[0] === 'null' ? '' : info[0];
            const reportnumValidBtime = !info[1] || info[1] === 'null' ? '' : info[1];
            const reportnumValidEtime = !info[2] || info[2] === 'null' ? '' : info[2];
            const projectSubId = !info[3] || info[3] === 'null' ? '' : info[3];
            const projectSubName = !info[4] || info[4] === 'null' ? '' : info[4];
            this.Order_PlanfromEdit.timeId = timeId;
            this.Order_PlanfromEdit.reportnumValidBtime = reportnumValidBtime;
            this.Order_PlanfromEdit.reportnumValidEtime = reportnumValidEtime;
            this.Order_PlanfromEdit.projectSubId = projectSubId;
            this.Order_PlanfromEdit.projectSubName = projectSubName;
            this.getProjectSub(projectSubId);
            // console.log('nie', newinfo);
            // if (newinfo && this.Order_PlanfromEdit.projectId) {
            //   this.editMessage.selects[2].isReadonly = false;
            //   this.timeNameAll(this.Order_PlanfromEdit.projectId, projectSubId);
            // }
            if (this.Order_PlanfromEdit.reportnumValidBtime ||
              this.Order_PlanfromEdit.reportnumValidEtime) {
              this.Order_PlanfromEdit.reportnumValid = `${this.Order_PlanfromEdit.reportnumValidBtime} ~ ${this.Order_PlanfromEdit.reportnumValidEtime}`;
            }
            if (newinfo && this.Order_PlanfromEdit.projectSubName &&
              this.Order_PlanfromEdit.projectId) {
              const btn = {
                orderCreat: false,
                orderDelete: true,
                orderProjectSub: false,
              };
              this.ControltradeBtn(btn);
              const btnDisabled = {
                planSave: true,
              };
              this.$bus.$emit('data/tradefoot', btnDisabled);
            }
          }).catch(() => {
            this.changInfo = 0;
            this.$message({
              type: 'info',
              message: '已取消操作',
            });
          });
        } else {
          this.changInfo = 0;
          this.Order_PlanfromEdit.reportnumValid = null;
          this.Order_PlanfromEdit.reportnumValidBtime = null;
          this.Order_PlanfromEdit.reportnumValidEtime = null;
          const info = newinfo.split('&');
          const timeId = !info[0] || info[0] === 'null' ? '' : info[0];
          const reportnumValidBtime = !info[1] || info[1] === 'null' ? '' : info[1];
          const reportnumValidEtime = !info[2] || info[2] === 'null' ? '' : info[2];
          const projectSubId = !info[3] || info[3] === 'null' ? '' : info[3];
          const projectSubName = !info[4] || info[4] === 'null' ? '' : info[4];
          this.Order_PlanfromEdit.timeId = timeId;
          this.Order_PlanfromEdit.reportnumValidBtime = reportnumValidBtime;
          this.Order_PlanfromEdit.reportnumValidEtime = reportnumValidEtime;
          this.Order_PlanfromEdit.projectSubId = projectSubId;
          this.Order_PlanfromEdit.projectSubName = projectSubName;
          this.getProjectSub(projectSubId);
          if (this.Order_PlanfromEdit.reportnumValidBtime ||
            this.Order_PlanfromEdit.reportnumValidEtime) {
            this.Order_PlanfromEdit.reportnumValid = `${this.Order_PlanfromEdit.reportnumValidBtime} ~ ${this.Order_PlanfromEdit.reportnumValidEtime}`;
          }
          if (newinfo && this.Order_PlanfromEdit.projectSubName &&
            this.Order_PlanfromEdit.projectId) {
            const btn = {
              orderCreat: false,
              orderDelete: true,
              orderProjectSub: false,
            };
            this.ControltradeBtn(btn);
            const btnDisabled = {
              planSave: true,
            };
            this.$bus.$emit('data/tradefoot', btnDisabled);
          }
        }
      }
    },
    Order_PlanfromEdit() {
      if (this.Order_PlanfromEdit.projectId) {
        this.editMessage.selects[1].isReadonly = false;
      }
    },
    projectId(newinfo, oldinfo) {
      if (this.$route.path === '/Reportnum/HospitalReportNum/Creat') {
        if (this.Order_PlanDateList.length) {
          if (this.changInfo) {
            this.changInfo = 0;
            return;
          }
          this.changInfo += 1;
          this.Order_PlanfromEdit.projectId = oldinfo;
          this.$confirm('此操作将清空明细，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.timeNameAll(newinfo);
            this.changInfo = 1;
            this.PlanListClear(0);
            this.Order_PlanfromEdit.projectId = newinfo;
          }).catch(() => {
            this.changInfo = 0;
            this.$message({
              type: 'info',
              message: '已取消操作',
            });
          });
        } else {
          this.changInfo = 0;
          this.timeNameAll(newinfo);
        }
      }
    },
    Order_PlanDateList() {
      this.tableDataOld = this.Order_PlanDateList;
    },
  },
  data() {
    return {
      searchValue: {
        drugsCode: null,
        drugsName: null,
        producerName: null,
      },
      projectSubOption: [],   // 集采子项目选项
      tableDataOld: [],
      searchMessage: [{   //  查询条件
        key: 'drugsCode',
        label: '药品编码',
        placeholder: '请输入药品编码',
        type: 0,
        selects: [],
      }, {
        key: 'drugsName',
        label: '通用名',
        placeholder: '请输入通用名',
        type: 0,
        selects: [],
      }, {
        key: 'producerName',
        label: '生产企业',
        placeholder: '请输入生产企业',
        type: 0,
        selects: [],
      }],
      a: null,
      changInfo: 0,
      tableTitle: '添加明细',
      editMessage: {
        selects: [
          { label: '集采项目', key: 'projectId', type: 'el-select', placeholder: '请选择集采项目名称', option: 'projectOption', noClearable: true, span: 5 },
          { label: '期间名称', key: 'timeName', type: 'el-select', placeholder: '请选择期间名称', noClearable: true, option: 'timeNameOption', isReadonly: true, span: 5 },
          { label: '集采子项目', key: 'projectSubName', type: 'el-input', fromType: 'textarea', isReadonly: true, span: 5, rows: 1 },
          { label: '报量有效期', key: 'reportnumValid', type: 'el-input', isReadonly: true, span: 5 },
          { label: '报量编号', key: 'code', type: 'el-input', isReadonly: true, span: 5 },
          { label: '创建人', key: 'createBy', type: 'el-input', isReadonly: true, span: 5 },
          { label: 'GPO名称', key: 'gpoMemberName', type: 'el-input', isReadonly: true, span: 5 },
          { label: '医疗机构', key: 'hospitalMemberName', type: 'el-input', isReadonly: true, span: 5 },
          { label: '备注', key: 'remarks', span: 20, type: 'el-input', placeholder: '请输入备注', fromType: 'textarea', rows: 1 },
        ],
        styleObject: {},
        options: {
          projectOption: [],
          subProjectOption: [],
          timeNameOption: [],
        },
        radios: {},
        parameters: {},
        rules: {
          projectId: [
            { required: true, validator: window.validator.returnTrue, trigger: 'blur' },
          ],
          projectSubName: [
            { required: true, validator: window.validator.returnTrue, trigger: 'blur' },
          ],
          timeName: [
            { required: true, validator: window.validator.returnTrue, trigger: 'blur' },
          ],
        },
      },
      authbtn: {
        create: true,
      },
      dialogOptions: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: [],                //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
        gpoMemberId: '',
        projectId: '',
        hospitalMemberId: '',
        timeId: '',
        ids: '',
      },
      selectData: [],
      nowNum: 0,                            // 当前数量
      page: 0,
      size: 15,
      percentage: 0,
      isupload: false,
    };
  },
  methods: {
    ...mapActions([
      'setTablePlanDates',
      'GetPlanDates',
      'TableHeightRun',
      'GetDetailDate',
      'TradeSelect',
      'Initialize',
      'CountNum',
      'DeleteItem',
      'ControltradeBtn',
      'PlanListClear',
      'ReturnHint',
    ]),
    // 集采项目下拉
    projectAll() {
      if (this.getGpoId) {
        HospitalReportNum.reportnumProjectAll(this.getGpoId).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            const projectOptions = [];
            for (let i = 0; i < data.length; i += 1) {
              projectOptions.push({
                value: data[i].id,
                label: data[i].name,
              });
            }
            this.editMessage.options.projectOption = projectOptions;
          }
        });
      }
    },
    // 期间名称下拉
    timeNameAll(val) {
      HospitalReportNum.reportnumTimeNameAll(val).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          const timeNameOption = [];
          for (let i = 0; i < data.length; i += 1) {
            timeNameOption.push({
              label: data[i].name,
              value: `${data[i].id || ''}&${data[i].reportnumValidBtime || ''}&${data[i].reportnumValidEtime || ''}&${data[i].projectSubId || ''}&${data[i].projectSubName || ''}`,
            });
          }
          if (this.a) {
            this.$set(this.Order_PlanfromEdit, 'timeName', '');
          }
          this.editMessage.options.timeNameOption = timeNameOption;
        }
      });
    },
    // 集采子项目
    getProjectSub(val) {
      HospitalReportNum.projectSubList(val).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          const projectSubOption = [];
          for (let i = 0; i < data.length; i += 1) {
            projectSubOption.push({
              label: data[i].name,
              value: data[i].id,
            });
          }
          this.projectSubOption = projectSubOption;
        }
      });
    },
    // 重新计算表格高度
    showMore() {
      this.$nextTick(() => {
        this.TableHeightRun(['.el-form', '.TradeFooter', '.search-find', 200]);
      });
    },
    // 获取当前的数值
    creatFocus(data) {
      this.nowNum = data;
    },
    // 键盘按钮触发方法
    keydown(data, res, index) {
      const itemTable = this.tableData[index];

      let itemIndex = 0;
      for (let i = 0; i < this.Order_PlanDateList.length; i += 1) {
        const item = this.Order_PlanDateList[i];
        if (item.ids === itemTable.ids) {
          itemIndex = i;
          break;
        }
      }

      if ((data.toString().search(/\D/) !== -1 || Number(data) === 0) && data !== '') {
        this.Order_PlanDateList[index].purchaseNum = this.nowNum;
      } else {
        const ItemListNum = this.Order_PlanDateList[index].purchaseNum;
        this.CountNum({ Num: this.nowNum, Count: data, Price: res });
        this.nowNum = data;
      }
      return false;
    },
    // 删除明细操作
    deleteItem(res) {
      this.$confirm('确定要删除该明细吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.DeleteItem(res);
        if (this.Order_PlanDateList.length === 0) {
          this.ReturnHint(0);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 添加明细
    dataCreat(projectSubId) {
      if (!this.Order_PlanfromEdit.projectId) {
        this.$message({
          type: 'error',
          message: '请选择集采项目',
        });
        return;
      }
      if (!this.Order_PlanfromEdit.projectSubId) {
        this.$message({
          type: 'error',
          message: '请选择集采子项目',
        });
        return;
      }
      if (!this.Order_PlanfromEdit.timeId) {
        this.$message({
          type: 'error',
          message: '请选择期间名称',
        });
        return;
      }
      this.dialogOptions.gpoMemberId = this.getGpoId;
      this.dialogOptions.projectId = this.Order_PlanfromEdit.projectId;
      // this.dialogOptions.projectSubId = this.Order_PlanfromEdit.projectSubId;
      if (projectSubId.length === 0) {
        this.dialogOptions.projectSubId = this.Order_PlanfromEdit.projectSubId;
      } else {
        this.dialogOptions.projectSubId = projectSubId.toString();
      }
      this.dialogOptions.timeId = this.Order_PlanfromEdit.timeId;
      this.dialogOptions.hospitalMemberId = this.Order_PlanfromEdit.id;
      this.dialogOptions.isShowDialog = true;
    },
    // 关闭弹出框
    dialogHide() {
      this.dialogOptions.isShowDialog = false;
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
    dataExport(projectSubId) {
      if (!this.Order_PlanfromEdit.projectId) {
        this.$message({
          type: 'error',
          message: '请选择集采项目',
        });
        return;
      }
      if (!this.Order_PlanfromEdit.projectSubId) {
        this.$message({
          type: 'error',
          message: '请选择集采子项目',
        });
        return;
      }
      if (!this.Order_PlanfromEdit.timeId) {
        this.$message({
          type: 'error',
          message: '请选择期间名称',
        });
        return;
      }
      const form = {
        id: 0,
        gpoMemberId: this.getGpoId,
        projectId: this.Order_PlanfromEdit.projectId,
        projectIdIn: this.Order_PlanfromEdit.projectId,
        hospitalMemberIdIn: this.View_UserInfor.id,
        timeId: this.Order_PlanfromEdit.timeId,
        hospitalMemberId: this.View_UserInfor.id,
      };
      if (projectSubId.length === 0) {
        form.projectSubId = this.Order_PlanfromEdit.projectSubId;
      } else {
        form.projectSubId = projectSubId.toString();
      }
      if (this.Order_PlanDateList.length) {
        let noitemLists = [];
        for (let i = 0; i < this.Order_PlanDateList.length; i += 1) {
          const itemone = this.Order_PlanDateList[i];
          noitemLists[i] = `${itemone.ids}`;
        }
        noitemLists = noitemLists.join(',');
        form.ids = noitemLists;
      } else {
        form.ids = 0;
      }
      const url = HospitalReportNum.outputItem(form);
      window.open(url);
    },
    dataImport(e) {
      if (!this.Order_PlanfromEdit.projectId) {
        this.$message({
          type: 'error',
          message: '请选择集采项目',
        });
        return;
      }
      if (!this.Order_PlanfromEdit.projectSubId) {
        this.$message({
          type: 'error',
          message: '请选择集采子项目',
        });
        return;
      }
      const file = e.target.files[0];
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel' || file.name.indexOf('.xls') > -1) {
        this.isupload = true;
        const formData = new FormData();
        formData.append('file', file);
        HospitalReportNum.uploadItem(formData, this.progress, this.Order_PlanfromEdit.projectId,
          this.Order_PlanfromEdit.projectSubId)
          .then((res) => {
            if (res.data.code === 0) {
              const data = res.data.result;
              this.percentage = 100;
              setTimeout(() => {
                this.isupload = false;
                this.percentage = 0;
              }, 500);
              this.$message({
                type: 'success',
                message: res.data.message,
              });
              let datalists = [];
              let pushok = 0;
              for (let i = 0; i < data.length; i += 1) {
                this.ReturnHint();
                pushok = 0;
                data[i].purchaseNum = data[i].reportNum;
                data[i].ids = data[i].id;
                data[i].drugsId = data[i].id;
                //              data[i].id = 0;
                if (Number(data[i].reportNum) > 0) {
                  if (this.Order_PlanDateList.length) {
                    for (let j = 0; j < this.Order_PlanDateList.length; j += 1) {
                      if (this.Order_PlanDateList[j].ids === data[i].ids) {
                        this.Order_PlanDateList[j].purchaseNum = data[i].reportNum;
                        pushok = 1;
                      }
                    }
                    const dataOne = data[i];
                    if (!pushok) {
                      datalists.push(dataOne);
                    }
                  } else {
                    datalists = data;
                  }
                }
              }
              this.GetPlanDates(datalists);
            } else {
              setTimeout(() => {
                this.isupload = false;
                this.percentage = 0;
              }, 500);
              this.$message({
                type: 'error',
                message: res.data.message,
              });
            }
            this.$bus.$emit('clear/file');
          });
      } else {
        this.$message({
          type: 'error',
          message: '文件格式出错，请导入excel',
        });
      }
    },
    //  进度条
    progress(e) {
      const d = parseInt((100 * e.loaded) / e.total, 0);
      if (d >= 90) {
        this.percentage = 90;
      } else {
        this.percentage = d;
      }
    },
    //  每次点击排序都会触发
    sortChange(rule) {
      if (rule.order) {
        const tableData = this.convert.tableSort(rule, this.Order_PlanDateList);
        this.setTablePlanDates([...tableData]);
      } else {
        this.setTablePlanDates([...this.tableDataOld]);
      }
    },
    //  查询条件，用前端做筛选
    dataSearch(data) {
      this.searchValue = {
        drugsCode: data.drugsCode ? data.drugsCode.value : null,
        drugsName: data.drugsName ? data.drugsName.value : null,
        producerName: data.producerName ? data.producerName.value : null,
      };
    },
  },
};
</script>

<style scoped>
.search-find {
  padding-bottom: 15px;
}

.search-find .find {
  margin-bottom: 0!important;
}
</style>

