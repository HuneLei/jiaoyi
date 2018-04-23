<template>
  <div v-loading="loading">
    <Percent v-show="isupload" :percentage="percentage"></Percent>
    <el-form :rules="editMessage.rules" label-width="100px" id="from-item">
      <TradeEditsForm :from-edit="Order_PlanfromEdit" :isCreatShow="true" :projectSubShow="true" :projectSubOptions="projectSubOption" :isDeleteItem="true" :isExportShow="true" :isImportShow="true" :message="editMessage" :isGoBackShow="false" :arrow-num=4 :arrow-down="true" @data-creat="dataCreat" @delete-item="deleteItem" @data-export="dataExport" @data-import="dataImport" @show-more="showMore">
      </TradeEditsForm>
    </el-form>

    <div class="search-find">
      <Find :message="searchMessage" :isEmit="true" @data-search="dataSearch"></Find>
    </div>

    <div>
      <el-table :data="tableData" @selection-change="dataSelect" stripe border fit :height="View_TableHeight" @sort-change="sortChange">
        <el-table-column type="selection" width="40" fixed="left" align="center">
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
        <el-table-column min-width="70" label="数量" sortable="custom" show-overflow-tooltip>
          <template scope="scope">
            <el-input class="input-right close-clear" style="width: 98%" slot="reference" size="small" placeholder="请输入数量" @focus="creatFocus(scope.row.purchaseNum)" @keyup.native="keydown(scope.row.purchaseNum, scope.row.hospitalUnitPrice, scope.$index )" @blur="keydown(scope.row.purchaseNum, scope.row.hospitalUnitPrice, scope.$index )" v-model="scope.row.purchaseNum">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="qualityLevel" min-width="80" label="质量层次" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="producerName" min-width="180" label="生产企业" sortable="custom" show-overflow-tooltip>
          <template scope="scope">
            <router-link :to="{ path: '/BasicInfo/Producer/BusinessEnterInfo', query: { id: scope.row.producerId, form: 'hos' } }">
              <el-button type="text">{{scope.row.producerName}}</el-button>
            </router-link>
          </template>
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
 * Created by wuqian on 2017/9/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import TradeEditsForm from '../../../components/TradeEditsForm';        //  引入订单目录表单
import EditDialog from './EditDialog';                    //  引入弹出框
import HospitalReportNum from '../../../api/Reportnum/HospitalReportNum';
import gpo from '../../../api/gpo'; // gpo 公共API

export default {
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.dataList();
      vm.projectAll();
    });
  },
  created() {
    this.authbtn = HospitalReportNum.authbtn();
    const btn = {
      orderCreat: false,
      orderDelete: true,
      orderExport: false,
      orderImport: false,
      orderProjectSub: false,
    };
    this.ControltradeBtn(btn);
    this.projectAll();
  },
  computed: {
    authList() {
      return this.$store.state.view.authList;
    },
    projectId() {
      return this.Order_PlanfromEdit.projectId;
    },
    projectSubId() {
      return this.Order_PlanfromEdit.projectSubId;
    },
    projectSubName() {
      return this.Order_PlanfromEdit.projectSubName;
    },
    timeName() {
      return this.Order_PlanfromEdit.timeName;
    },
    tableData() {
      const data = this.Order_PlanItemList;
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
      'Order_purchaseAmount',
      'Order_PlanItemList',
      'Order_purchaseNum',
      'View_TableHeight',
      'Order_ItemID',
      'Order_PlanfromEdit',
    ]),
  },
  components: {
    EditDialog,
    TradeEditsForm,
  },
  watch: {
    getGpoId() {
      if (this.$route.path === '/Reportnum/HospitalReportNum/Edit') {
        history.back();
      }
    },
    // projectSubId(newinfo, oldinfo) {
    //   if (oldinfo) {
    //     // console.log();
    //   }
    // },
    timeName(newinfo, oldinfo) {
      if (this.$route.path === '/Reportnum/HospitalReportNum/Edit') {
        // console.log();
        if (this.er) {
          this.er = 0;
          this.changInfo = 0;
          return;
        }
        if (this.Order_PlanItemList.length) {
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
            const projectSubId = !info[4] || info[4] === 'null' ? '' : info[4];
            const projectSubName = !info[5] || info[5] === 'null' ? '' : info[5];
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
            this.editMessage.selects[1].isReadonly = false;
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
          const projectSubId = !info[4] || info[4] === 'null' ? '' : info[4];
          const projectSubName = !info[5] || info[5] === 'null' ? '' : info[5];
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
          this.editMessage.selects[1].isReadonly = false;
        }
      }
    },
    authList() {
      this.authbtn = HospitalReportNum.authbtn();
      // console.log();
    },
    projectId(newinfo, oldinfo) {
      this.b = oldinfo;
      if (this.$route.path === '/Reportnum/HospitalReportNum/Edit') {
        if (this.Order_PlanItemList.length) {
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
    // projectSubName(newinfo, oldinfo) {
    //   this.a = oldinfo;
    //   if (this.$route.path === '/Reportnum/HospitalReportNum/Edit') {
    //     // console.log();
    //     // console.log();
    //     if (this.zi) {
    //       this.zi = 0;
    //       this.changInfo = 0;
    //       return;
    //     }
    //     if (this.Order_PlanItemList.length) {
    //       if (this.changInfo) {
    //         this.changInfo = 0;
    //         return;
    //       }
    //       this.changInfo += 1;
    //       this.Order_PlanfromEdit.projectSubName = oldinfo;
    //       this.$confirm('此操作将清空明细，是否继续?', '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         type: 'warning',
    //       }).then(() => {
    //         this.PlanListClear(0);
    //         this.changInfo = 1;
    //         this.Order_PlanfromEdit.projectSubName = newinfo;
    //         const info = newinfo.split('&');
    //         const projectSubId = !info[0] || info[0] === 'null' ? '' : info[0];
    //         this.Order_PlanfromEdit.projectSubId = projectSubId;
    //         this.timeNameAll(this.Order_PlanfromEdit.projectId, projectSubId);
    //         this.editMessage.selects[2].isReadonly = false;
    //       }).catch(() => {
    //         this.changInfo = 0;
    //         this.$message({
    //           type: 'info',
    //           message: '已取消操作',
    //         });
    //       });
    //     } else {
    //       this.changInfo = 0;
    //       const info = newinfo.split('&');
    //       const projectSubId = !info[0] || info[0] === 'null' ? '' : info[0];
    //       // console.log();
    //       this.Order_PlanfromEdit.projectSubId = projectSubId;
    //       this.editMessage.selects[2].isReadonly = false;
    //       this.timeNameAll(this.Order_PlanfromEdit.projectId, projectSubId);
    //     }
    //   }
    // },
    // feng(newinfo, oldinfo) {
    //   // console.log();
    //   if (oldinfo) {
    //     // console.log();
    //     return;
    //   }
    //   if (!this.editMessage.options.subProjectOption.length) {
    //     // console.log();
    //     const info = this.Order_PlanfromEdit.projectSubName.split('&');
    //     this.Order_PlanfromEdit.projectSubName = info[1];
    //     this.zi = 1;
    //     return;
    //   }
    //   this.zi = 1;
    //   let index = null;
    //   for (let i = 0; i < this.editMessage.options.subProjectOption.length; i += 1) {
    //     if (this.Order_PlanfromEdit.projectSubName ===
    //       this.editMessage.options.subProjectOption[i].value) {
    //       index = i;
    //     }
    //   }
    //   if (index || index === 0) {
    //     this.zi = 0;
    //     // console.log();
    //   } else {
    //     const info = this.Order_PlanfromEdit.projectSubName.split('&');
    //     this.Order_PlanfromEdit.projectSubName = info[1];
    //     // console.log();
    //   }
    //   // console.log();
    //   // console.log();
    // },
    deng(newinfo, oldinfo) {
      // console.log();
      if (oldinfo) {
        // console.log();
        return;
      }
      if (!this.editMessage.options.timeNameOption.length) {
        // console.log();
        const info = this.Order_PlanfromEdit.timeName.split('&');
        this.Order_PlanfromEdit.timeName = info[3];
        this.er = 1;
        return;
      }
      let iName = null;
      for (let i = 0; i < this.editMessage.options.timeNameOption.length; i += 1) {
        if (this.Order_PlanfromEdit.timeName ===
          this.editMessage.options.timeNameOption[i].value) {
          iName = i;
        }
      }
      if (iName || iName === 0) {
        this.er = 0;
      } else {
        this.er = 1;
        const info = this.Order_PlanfromEdit.timeName.split('&');
        this.Order_PlanfromEdit.timeName = info[3];
      }
    },
    Order_PlanItemList() {
      this.tableDataOld = this.Order_PlanItemList;
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
      feng: 0, // 乱命名的  用来判断医疗机构下拉不匹配显示的情况
      zi: 0, // 乱命名的  用来判断医疗机构下拉不匹配显示的情况
      deng: 0,
      er: 0, // 乱命名的  用来判断期间名称下拉不匹配显示的情况
      b: null,
      a: null,
      tableTitle: '添加明细',
      editMessage: {
        tabTitle: '',
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
        parameters: {},
        options: {
          subProjectOption: [],
          projectOption: [],
          timeNameOption: [],
        },
        radios: {},
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
      nowNum: 0, // 当前数量
      loading: false,
      dialogOptions: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: [],                  //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
        gpoMemberId: '',
        projectId: '',
        hospitalMemberId: '',
        ids: '',
        timeId: '',
      },
      percentage: 0,
      isupload: false,
    };
  },
  methods: {
    ...mapActions([
      'setTableItemList',
      'Getitemdates',
      'TableHeightRun',
      'GetItemDate',
      'TradeSelect',
      'Initialize',
      'CountNum',
      'DeleteItem',
      'ItemList',
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
    // 期间名称下拉
    timeNameAll(Val) {
      HospitalReportNum.reportnumTimeNameAll(Val).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          const timeNameOption = [];
          for (let i = 0; i < data.length; i += 1) {
            timeNameOption.push({
              label: data[i].name,
              value: `${data[i].id || ''}&${data[i].reportnumValidBtime || ''}&${data[i].reportnumValidEtime || ''}&${data[i].name || ''}&${data[i].projectSubId || ''}&${data[i].projectSubName || ''}`,
            });
          }
          if (this.a) {
            // console.log();
            this.$set(this.Order_PlanfromEdit, 'timeName', '');
          }
          this.editMessage.options.timeNameOption = timeNameOption;
          this.deng = this.deng + 1;
        }
      });
    },
    // 键盘按钮触发方法
    keydown(data, res, index) {
      const itemTable = this.tableData[index];

      let itemIndex = 0;
      for (let i = 0; i < this.Order_PlanItemList.length; i += 1) {
        const item = this.Order_PlanItemList[i];
        if (item.ids === itemTable.ids) {
          itemIndex = i;
          break;
        }
      }

      if ((data.toString().search(/\D/) !== -1 || Number(data) === 0) && data !== '') {
        this.Order_PlanItemList[itemIndex].purchaseNum = this.nowNum;
      } else {
        const ItemListNum = this.Order_PlanItemList[itemIndex].purchaseNum;
        this.CountNum({ Num: this.nowNum, Count: data, Price: res });
        this.nowNum = data;
        this.ReturnHint();
      }
      return false;
    },
    // 重新计算表格高度
    showMore() {
      this.$nextTick(() => {
        this.TableHeightRun(['#from-item', '.TradeFooter', '.search-find', 200]);
      });
    },
    // 获取当前的数值
    creatFocus(data) {
      this.nowNum = data;
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
      this.dialogOptions.id = this.$route.query.id;
      // this.dialogOptions.projectSubId = this.Order_PlanfromEdit.projectSubId;
      if (projectSubId.length === 0) {
        this.dialogOptions.projectSubId = this.Order_PlanfromEdit.projectSubId;
      } else {
        this.dialogOptions.projectSubId = projectSubId.toString();
      }
      this.dialogOptions.hospitalMemberId = this.Order_PlanfromEdit.hospitalMemberId;
      this.dialogOptions.timeId = this.Order_PlanfromEdit.timeId;
      this.dialogOptions.isShowDialog = true;
    },
    // 删除明细操作
    deleteItem(res) {
      this.$confirm('确定要删除该明细吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.DeleteItem(res);
        this.ReturnHint();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 关闭弹出框
    dialogHide() {
      this.dialogOptions.isShowDialog = false;
    },
    //  每次点击排序都会触发
    sortChange(rule) {
      if (rule.order) {
        const tableData = this.convert.tableSort(rule, this.Order_PlanItemList);
        this.setTableItemList([...tableData]);
      } else {
        this.setTableItemList([...this.tableDataOld]);
      }
    },
    // 获取数据列表
    dataList() {
      this.loading = true;
      if (this.$route.query.id) {
        HospitalReportNum.item(this.$route.query.id).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            const MemberName = `${data.projectSubId}&${data.projectSubName}`;
            const TimeName = `${data.timeId}&${data.reportnumValidBtime}&${data.reportnumValidEtime}&${data.timeName}&${data.projectSubId}&${data.projectSubName}`;
            const itemList = {
              code: data.code,
              timeId: data.timeId,
              timeName: TimeName,
              createBy: `${data.createBy || ''} ${data.createTime || ''}`,
              hospitalMemberId: data.hospitalMemberId,
              hospitalMemberName: data.hospitalMemberName,
              hospitalPerson: `${data.hospitalPerson || ''} ${data.hospitalPhone || ''}`,
              gpoMemberName: data.gpoMemberName,
              gpoPerson: `${data.gpoPerson || ''} ${data.gpoPhone || ''}`,
              projectName: data.projectName,
              projectSubName: MemberName,
              projectId: data.projectId,
              projectSubId: data.projectSubId,
              remarks: data.remarks,
              id: data.id,
            };
            // console.log();
            itemList.reportnumValid = `${data.reportnumValidBtime} ~ ${data.reportnumValidEtime}`;
            this.ItemList(itemList);
            HospitalReportNum.reportnumItem(this.$route.query.id).then((res1) => {
              if (res.data.code === 0) {
                const data1 = res1.data.result;
                for (let i = 0; i < data1.length; i += 1) {
                  data1[i].purchaseNum = data1[i].reportNum;
                  data1[i].ids = data1[i].drugsId;
                }
                this.tableDataOld = data1;
                this.GetItemDate(data1);
              }
              this.loading = false;
            });
          }
        });
      }
    },
    //  选择触发事件，根据所选数据判断btn是否禁用
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
    dataExport() {
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
        id: this.$route.query.id,
        gpoMemberId: this.getGpoId,
        projectId: this.Order_PlanfromEdit.projectId,
        projectIdIn: this.Order_PlanfromEdit.projectId,
        hospitalMemberId: this.Order_PlanfromEdit.hospitalMemberId,
        hospitalMemberIdIn: this.Order_PlanfromEdit.hospitalMemberId,
        projectSubId: this.Order_PlanfromEdit.projectSubId,
        timeId: this.Order_PlanfromEdit.timeId,
      };
      if (this.Order_PlanItemList.length) {
        let noitemLists = [];
        for (let i = 0; i < this.Order_PlanItemList.length; i += 1) {
          const itemone = this.Order_PlanItemList[i];
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
      console.log('file.type', file);
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
                // console.log();
                pushok = 0;
                data[i].purchaseNum = data[i].reportNum;
                data[i].ids = data[i].id;
                data[i].drugsId = data[i].id;
                //              data[i].id = 0;
                if (Number(data[i].reportNum) > 0) {
                  if (this.Order_PlanItemList.length) {
                    // console.log();
                    for (let j = 0; j < this.Order_PlanItemList.length; j += 1) {
                      if (this.Order_PlanItemList[j].drugsId === data[i].ids) {
                        this.Order_PlanItemList[j].purchaseNum = data[i].reportNum;
                        pushok = 1;
                      }
                    }
                    // console.log();
                    // console.log();
                    const dataOne = data[i];
                    if (!pushok) {
                      datalists.push(dataOne);
                    }
                  } else {
                    datalists = data;
                  }
                }
              }
              // console.log();
              this.Getitemdates(datalists);
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
  margin-bottom: 0 !important;
}
</style>

