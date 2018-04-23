<template>
  <div v-loading="loading">
    <el-form :rules="editMessage.rules" label-width="120px" id="from-item">
      <TradeEditsForm :from-edit="fromEdit" :isCreatShow="true" :isDeleteItem="true" :isExportShow="true" :isImportShow="true" :isNumItem="true" :message="editMessage" :isGoBackShow="false" :arrow-num=5 :arrow-down="true" @delete-item="deleteItem" @data-creat="dataCreat" @data-import="dataImport" @data-export="dataExport" @data-numItem="dataNumItem" @show-more="showMore">
        <el-form-item label="" slot="StepsFrom" label-width="120px">
          <StepsFrom :steplist="steplist" :active='active'></StepsFrom>
        </el-form-item>
      </TradeEditsForm>
    </el-form>

    <div class="search-find">
      <Find :message="searchMessage" :isEmit="true" @data-search="dataSearch"></Find>
    </div>

    <div>
      <el-table :data="retTable" @selection-change="dataSelect" stripe border fit :height="View_TableHeight" @sort-change="sortChange">
        <el-table-column type="selection" width="40">
        </el-table-column>
        <el-table-column prop="num" label="#" width="40" show-overflow-tooltip></el-table-column>
        <el-table-column prop="drugsCode" width="90" label="药品编码"  sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="drugsName" width="120" label="通用名称"  sortable="custom" show-overflow-tooltip>
          <template scope="scope">
            <p>{{scope.row.drugsName}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="specName" min-width="80" label="规格"  sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="packSpecName" min-width="80" label="包装规格"  sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="attributeName" label="规格属性" align="left" min-width="80"  sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="packagesName" label="包装材质" align="left" min-width="80"  sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="formName" min-width="80" label="剂型"  sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="unitName" min-width="80" label="单位"  sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="hospitalUnitPrice" min-width="80" label="单价" align="right" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column min-width="80" label="数量" align="right"  sortable="custom" show-overflow-tooltip>
          <template scope="scope">
            <el-input class="input-right" style="width: 98%" slot="reference" size="small" placeholder="请输入数量" @focus="creatFocus(scope.row.purchaseNum)" @keyup.native="keydown(scope.row.purchaseNum, scope.row.hospitalUnitPrice, scope.$index )" v-model="scope.row.purchaseNum">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column min-width="80" label="金额" align="right"  sortable="custom" show-overflow-tooltip>
          <template scope="scope">
            <p>{{scope.row.purchaseAmount}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryMemberName" min-width="90" label="配送企业"  sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="producerName" min-width="100" label="生产企业"  sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="tradeName" min-width="90" label="商品名"  sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="approvalNumber" min-width="80" label="批准文号"  sortable="custom" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-footer">
      <div style="float: left;padding-right: 15px;padding-left: 63%">
        <span>总数量：</span>{{purchaseNums}}
      </div>
      <div style="float: left">
        <span>总金额：</span>{{purchaseAmounts}}
        <span>元</span>
      </div>
    </div>
    <TradeFooter class="trade" :isSaveShow="true" :isBackShow="true" :isSubmitShow="true" @order-save="orderSave" @data-submit="orderSubmit" @order-back="orderBack">
    </TradeFooter>
    <AddDetail :options="dialogOptions" @dialog-hide="dialogHide"></AddDetail>
    <ImportNumDetail :options="dialogOptions1" @dialog-hide="dialogHide"></ImportNumDetail>
    <Percent v-show="isupload" :percentage="percentage"></Percent>
  </div>
</template>

<script>
/**
 * Created by dingyiming on 2017/6/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import TradeEditsForm from '../../../components/TradeEditsForm';        //  引订单目录表单
import AddDetail from './AddDetail';                    //  引订单目录表单
import StepsFrom from '../../../components/StepsFrom';                    // 引入加载条组件
import ImportNumDetail from './ImportNumDetail';                    //  引入报量明细弹出框
import Table from '../../../utils/tableHeight';                         //  重新计算高度
import TriContractList from '../../../api/Contract/TriContractList';             //  三方合同列表api
import TradeFooter from '../../../components/TradeFooter';           // 引入底部组件
import Percent from '../../../components/Percent';

export default {
  activated() {
    this.TableHeightRun(['.fromtrades', '.tradeFooter', '.search-find', 120]);
    // 获取添加的明细
    this.$bus.$on('data/rows', this.getRows);
    this.$bus.$on('data/Itemrows', this.getItemrows);
    this.$bus.$on('project/getAll', this.getProjectAll);
    this.purchaseAmounts = 0;
    this.purchaseNums = 0;
    this.getProjectAll();
    this.dataInit();
    // this.tableData = [];
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Contract',
        name: '合同管理',
        noLink: true,
      },
      {
        path: '/Contract/TriContractList',
        name: '三方合同列表',
        noLink: true,
      },
    ]);
  },
  deactivated() {
    this.$bus.$off('project/getAll', this.getProjectAll);
    this.$bus.$off('data/rows', this.getRows);
    this.$bus.$off('data/Itemrows', this.getItemrows);
  },
  computed: {
    retTable() {
      const data = this.tableData;
      const ret = [];
      const search = ['drugsCode', 'drugsName'];  //  进行筛选的字段
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
    projectId() {
      return this.fromEdit.projectId;
    },
    ...mapGetters([
      'View_TableHeight',
      'getGpoId',
      'projectOptions',
      'getProjectId',
      'View_UserInfo',
    ]),
  },
  watch: {
    getGpoId() {
      // 当切换gpo时，重定向到列表页
      this.$router.push({ path: '/Contract/TriContractList/CopyContract' });
    },
    getProjectId() {
      if (this.$route.path === '/Contract/TriContractList/CopyContract') {
        this.fromEdit.projectId = this.getProjectId; // 获取当前切换的集采项目号码
      }
    },
    projectId(newinfo, oldinfo) {
      if (this.$route.path === '/Contract/TriContractList/CopyContract') {
        if (this.tableData.length && oldinfo !== undefined) {
          if (this.changInfo) {
            this.changInfo = 0;
            return;
          }
          this.changInfo += 1;
          this.fromEdit.projectId = oldinfo;
          this.$confirm('此操作将清空明细，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.tableData = [];
            this.changInfo = 1;
            this.fromEdit.projectId = newinfo;
          }).catch(() => {
            this.changInfo = 0;
            this.$message({
              type: 'info',
              message: '已取消操作',
            });
            // this.fromEdit.projectId = this.getProjectId; // 获取当前切换的集采项目号码
          });
        } else {
          this.changInfo = 0;
        }
      }
    },
    tableData() {
      this.tableDataOld = [...this.tableData];
    },
    deep: true,
  },
  components: {
    AddDetail,
    TradeEditsForm,
    StepsFrom,
    TradeFooter,
    ImportNumDetail,
    Percent,
  },
  data() {
    return {
      searchValue: {
        drugsCode: null,
        drugsName: null,
      },
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
      }],
      tableTitle: '添加明细',
      editMessage: {
        selects: [
          { value: 'StepsFrom', type: 'custom', span: 24, md: 20, sm: 24, isReadonly: true },
          { label: '合同编号', key: 'code', type: 'el-input', placeholder: '', span: 5, isReadonly: true },
          { label: '合同有效期至', key: 'validBtime', type: 'el-input', placeholder: '', isReadonly: true, span: 5 },
          { label: '创建时间', key: 'createTime', type: 'el-input', placeholder: '', isReadonly: true, span: 5 },
          { label: '', key: 'contractStatus', type: 'el-input', fromStyle: 'style2', noborder: 'true', span: 9, belWidth: '55px', isReadonly: true },
          { label: '医疗机构', key: 'hospitalName', type: 'el-input', placeholder: '', isReadonly: true, span: 5 },
          { label: '联系人', key: 'hospitalPerson', type: 'el-input', placeholder: '', isReadonly: true, span: 5 },
          // { label: '联系电话', key: 'hospitalPhone',
          // type: 'el-input', placeholder: '请输入联系电话', isReadonly: true, span: 8 },
          { label: '配送企业', key: 'deliveryMemberName', type: 'el-input', placeholder: '', isReadonly: true, span: 5 },
          { label: '联系人', key: 'deliveryPerson', type: 'el-input', placeholder: '', isReadonly: true, span: 5 },
          // { label: '联系电话', key: 'deliveryPhone',
          // type: 'el-input', placeholder: '请输入联系电话', isReadonly: true, span: 8 },
          { label: '集采项目名称', key: 'projectId', type: 'el-select', option: 'projectOption', span: 5, noClearable: true },
          { label: '备注', key: 'remarks', span: 15, type: 'el-input', placeholder: '请输入备注', fromType: 'textarea', rows: 1 },
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
          projectOption: [],
        },
        radios: {},
        parameters: {},
        rules: {
          projectId: [
            { required: true, message: '请输入集采项目', trigger: 'blur' },
          ],
        },
      },
      authbtn: {
        create: false,
      },
      fromEdit: {
        contractStatus: '待提交',
        code: '',
        hospitalMemberName: '',
        hospitalPerson: '',
        hospitalPhone: '',
        deliveryMemberName: '',
        deliveryPerson: '',
        deliveryPhone: '',
        amount: '',
        validBtime: '',
        validEtime: '',
        createTime: '',
        remarks: '',
      },
      dialogOptions: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: null,                //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
      },
      // 导入报量明细弹出框
      dialogOptions1: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: null,                //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
      },
      loading: false,
      tableData: [],
      selectData: [],
      deleteids: [],
      purchaseAmount: null,         // 单个采购总价
      purchaseAmounts: 0,         // 采购总价
      purchaseNum: '',           // 单个采购数量
      purchaseNums: 0,           // 采购数量
      nowNum: 0,                            // 当前数量
      page: 0,
      size: 15,
      active: 1,   // 订单状态
      steplist: [{
        title: '创建合同',
        description: '',
      }, {
        title: '提交合同',
        description: '',
      }],
      createObj: {},
      createObj1: {},
      createArr: [],
      drugsIds: [],
      dataArray: [],
      percentage: 0,
      isupload: false,
      changInfo: 0,
    };
  },
  methods: {
    ...mapActions([
      'TableHeightRun',
      'GetDetailDate',
      'Initialize',
      'TradeSelect',
      'CountNum',
      'DeleteItem',
    ]),
    //  每次点击排序都会触发
    sortChange(rule) {
      if (rule.order) {
        const tableData = this.convert.tableSort(rule, this.tableData);
        this.tableData = [...tableData];
      } else {
        this.tableData = [...this.tableDataOld];
      }
    },
    dataInit() {
      this.fromEdit.projectId = '';
      this.fromEdit.projectId = this.$route.query.projectId;
      this.tableData = this.$route.query.data;
      for (let i = 0; i < this.tableData.length; i += 1) {
        this.tableData[i].num = i + 1;
        this.purchaseAmounts += Number(this.tableData[i].purchaseAmount);
        this.purchaseNums += parseInt(this.tableData[i].purchaseNum, 0);
      }
    },
    //  查询条件，用前端做筛选
    dataSearch(data) {
      this.searchValue = {
        drugsCode: data.drugsCode ? data.drugsCode.value : null,
        drugsName: data.drugsName ? data.drugsName.value : null,
      };
    },
    // 重新计算表格高度
    showMore() {
      this.$nextTick(() => {
        this.TableHeightRun(['.fromtrades', '.tradeFooter', '.search-find', 120]);
      });
    },
    // 导入报量明细
    dataNumItem() {
      this.$bus.$emit('export/getProjectId', this.fromEdit.projectId);
      this.dialogOptions1.isShowDialog = true;
    },
    // 获取添加的明细
    getRows(rows) {
      this.tableData = this.tableData.concat(rows);
      for (let i = 0; i < this.tableData.length; i += 1) {
        this.tableData[i].num = i + 1;
      }
      this.tableDataOld = this.tableData;
    },
    // 获取导入报量的明细
    getItemrows(rows) {
      TriContractList.importItem(rows[0].id)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            // for (let i = 0; i < data.length; i += 1) {
            //   data[i].num = (res.data.result.number * res.data.result.size) + i + 1;
            // }
            // this.optionsDialog.page = res.data.result.number + 1;
            // this.optionsDialog.pageTotal = res.data.result.totalElements;
            // this.optionsDialog.pageSize = res.data.result.size;
            // this.optionsDialog.tableData = data;
            if (this.tableData.length === 0) {
              this.tableData = data;
              for (let j = 0; j < this.tableData.length; j += 1) {
                this.tableData[j].purchaseNum = data[j].reportNum;
              }
            } else {
              const tableD = [];
              for (let i = 0; i < data.length; i += 1) {
                const item = data[i];
                let bool = false;
                for (let j = 0; j < this.tableData.length; j += 1) {
                  const tab = this.tableData[j];
                  if (item.drugsId === tab.drugsId) {
                    bool = true;
                    this.tableData[j].purchaseNum = item.reportNum;
                  }
                }
                if (!bool) {
                  tableD.push(item);
                  item.purchaseNum = item.reportNum;
                }
              }
              this.tableData = this.tableData.concat(tableD);
            }
            this.purchaseAmounts = 0;
            this.purchaseNums = 0;
            for (let i = 0; i < this.tableData.length; i += 1) {
              this.$set(this.tableData[i], 'purchaseAmount', parseFloat(this.tableData[i].purchaseNum * this.tableData[i].hospitalUnitPrice).toFixed(2));
              this.purchaseAmounts += Number(this.tableData[i].purchaseAmount);
              this.purchaseNums += parseInt(this.tableData[i].purchaseNum, 0);
              this.tableData[i].num = i + 1;
            }
            this.tableDataOld = this.tableData;
          }
        });
    },
    // 获取当前的数值
    creatFocus(data) {
      this.nowNum = data;
    },
    // 键盘按钮触发方法
    // keydown(data, res, index) {
    //   // console.log();
    //   if (data.toString().search(/\D/) !== -1 || Number(data) === 0 || !data) {
    //     this.tableData[index].purchaseNum = this.nowNum;
    //   }
    //   const ItemListNum = Number(this.tableData[index].purchaseNum);
    //   const ItemListPrice = this.tableData[index].hospitalUnitPrice;
    //   this.$set(this.tableData[index], 'purchaseAmount',
    // parseFloat(ItemListNum * ItemListPrice).toFixed(2));
    //   this.CountNum({ Num: this.nowNum, Count: data, Price: res });
    //   this.nowNum = data;
    //   // console.log();
    //   this.purchaseAmounts = 0;
    //   this.purchaseNums = 0;
    //   for (let i = 0; i < this.tableData.length; i += 1) {
    //     this.purchaseAmounts += Number(this.tableData[i].purchaseAmount);
    //     this.purchaseNums += parseInt(this.tableData[i].purchaseNum, 0);
    //   }
    //   this.purchaseAmounts = this.purchaseAmounts.toFixed(2);
    //   // console.log();
    //   return false;
    // },
    // 键盘按钮触发方法
    keydown(data, res, index) {
      const itemTable = this.retTable[index];

      let itemIndex = 0;
      for (let i = 0; i < this.tableData.length; i += 1) {
        const item = this.tableData[i];
        if (item.drugsId === itemTable.drugsId) {
          itemIndex = i;
          break;
        }
      }

      if ((data.toString().search(/\D/) !== -1 || Number(data) === 0) && data !== '') {
        this.tableData[index].purchaseNum = this.nowNum;
      } else {
        const ItemListNum = this.tableData[index].purchaseNum;
        const ItemListPrice = this.tableData[index].hospitalUnitPrice;
        // this.tableData[index].purchaseAmount = ItemListNum * ItemListPrice;
        this.$set(this.tableData[index], 'purchaseAmount', parseFloat(ItemListNum * ItemListPrice).toFixed(2));
        this.CountNum({ Num: this.nowNum, Count: data, Price: res });
        this.nowNum = data;
        this.purchaseAmounts = 0;
        this.purchaseNums = 0;
        for (let i = 0; i < this.tableData.length; i += 1) {
          this.purchaseAmounts += Number(this.tableData[i].purchaseAmount);
          this.purchaseNums += parseInt(this.tableData[i].purchaseNum, 0);
        }
        this.purchaseAmounts = this.purchaseAmounts.toFixed(2);
      }
      return false;
    },
    // 列表删除添加重新计算数量和金额
    count() {
      this.purchaseAmounts = 0;
      this.purchaseNums = 0;
      for (let i = 0; i < this.tableData.length; i += 1) {
        this.purchaseAmounts += Number(this.tableData[i].purchaseAmount);
        this.purchaseNums += parseInt(this.tableData[i].purchaseNum, 0);
        this.tableData[i].num = i + 1;
      }
    },
    // 删除明细操作
    deleteItem() {
      this.$confirm('确定要删除该明细吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        for (let i = 0; i < this.deleteids.length; i += 1) {
          for (let j = 0; j < this.tableData.length; j += 1) {
            if (this.deleteids[i] === this.tableData[j].drugsId) {
              this.tableData.splice(j, 1);
            }
          }
        }
        this.count();
        // this.purchaseAmounts = 0;
        // this.purchaseNums = 0;
        // for (let i = 0; i < this.tableData.length; i += 1) {
        //   this.purchaseAmounts += Number(this.tableData[i].purchaseAmount);
        //   this.purchaseNums += this.tableData[i].purchaseNum;
        //   this.tableData[i].num = i + 1;
        // }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 添加明细
    dataCreat() {
      this.drugsIds = [];
      this.dialogOptions.isShowDialog = true;
      for (let i = 0; i < this.tableData.length; i += 1) {
        this.drugsIds.push(this.tableData[i].drugsId);
      }
      this.drugsIds = this.drugsIds.toString();
      this.$bus.$emit('my/getProjectId', this.fromEdit.projectId, this.drugsIds);
    },
    // 关闭弹出框
    dialogHide() {
      this.dialogOptions.isShowDialog = false;
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
      this.deleteids = [];
      for (let i = 0; i < row.length; i += 1) {
        this.deleteids.push(row[i].drugsId);
      }
    },
    // 获取集采项目下拉
    getProjectAll() {
      this.editMessage.options.projectOption = this.projectOptions; // 给项目集采名称options赋值
      // this.editMessage.options.defaults = this.getProjectId;
      // this.defaultAjax += 1; // 控制defaultAjax变化监听
      this.fromEdit = Object.assign({}, this.fromEdit, {
        projectId: this.getProjectId,
      });
      // this.fromEdit.projectId = this.getProjectId;
    },
    //  保存
    orderSave() {
      if (this.fromEdit.remarks && this.fromEdit.remarks.length > 256) {
        this.$message({
          type: 'error',
          message: '备注不得超过256位字符',
        });
        return false;
      }
      if (this.fromEdit.projectId === '') {
        this.$message({
          type: 'error',
          message: '集采项目不能为空',
        });
        return false;
      }
      if (this.tableData.length === 0) {
        this.$message({
          type: 'error',
          message: '明细不能为空',
        });
        return false;
      }
      for (let i = 0; i < this.tableData.length; i += 1) {
        if (this.tableData[i].purchaseNum === '' || this.tableData[i].purchaseNum === undefined || Number(this.tableData[i].purchaseNum) === 0) {
          this.$message({
            type: 'error',
            message: '数量不能为空或为0',
          });
          return false;
        }
      }
      this.loading = true;
      this.createArr = [];
      if (this.$route.path === '/Contract/TriContractList/CopyContract') {
        for (let i = 0; i < this.tableData.length; i += 1) {
          this.createObj1 = Object.assign({}, this.createObj1, {
            id: this.tableData[i].drugsId,
            purchaseAmount: this.tableData[i].purchaseAmount,
            purchaseNum: this.tableData[i].purchaseNum,
          });
          this.createArr.push(this.createObj1);
        }
        this.createObj = Object.assign({}, this.createObj, {
          addItemEntityList: this.createArr,
          gpoMemberId: this.getGpoId,
          projectId: this.fromEdit.projectId,
          remarks: this.fromEdit.remarks,
          id: 0,
          updateItemEntityList: [],
        });
        TriContractList.create(this.createObj).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '新增成功',
            });
            // this.$bus.$emit('data/list');
            this.$router.go(-2);
          }
          this.loading = false;
        });
      }
      return true;
    },
    // 提交
    orderSubmit() {
      if (this.fromEdit.remarks && this.fromEdit.remarks.length > 256) {
        this.$message({
          type: 'error',
          message: '备注不得超过256位字符',
        });
        return false;
      }
      if (this.fromEdit.projectId === '') {
        this.$message({
          type: 'error',
          message: '集采项目不能为空',
        });
        return false;
      }
      if (this.tableData.length === 0) {
        this.$message({
          type: 'error',
          message: '明细不能为空',
        });
        return false;
      }
      for (let i = 0; i < this.tableData.length; i += 1) {
        if (this.tableData[i].purchaseNum === '' || this.tableData[i].purchaseNum === undefined || Number(this.tableData[i].purchaseNum) === 0) {
          this.$message({
            type: 'error',
            message: '数量不能为空或为0',
          });
          return false;
        }
      }
      this.loading = true;
      this.createArr = [];
      for (let i = 0; i < this.tableData.length; i += 1) {
        this.createObj1 = Object.assign({}, this.createObj1, {
          id: this.tableData[i].drugsId,
          purchaseAmount: this.tableData[i].purchaseAmount,
          purchaseNum: this.tableData[i].purchaseNum,
        });
        this.createArr.push(this.createObj1);
      }
      this.createObj = Object.assign({}, this.createObj, {
        addItemEntityList: this.createArr,
        gpoMemberId: this.getGpoId,
        projectId: this.fromEdit.projectId,
        id: 0,
        remarks: this.fromEdit.remarks,
        updateItemEntityList: [],
      });
      TriContractList.submit(this.createObj).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '提交成功',
          });
          this.$router.push({ path: '/Contract/TriContractList/ApplyThreeContract', query: { data: res.data.result } });
        }
        this.loading = false;
      });
      return true;
    },
    //  文件导入
    dataImport(e) {
      const file = e.target.files[0];
      console.log('file.type', file);
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel' || file.name.indexOf('.xls') > -1) {
        this.isupload = true;
        const formData = new FormData();
        formData.append('file', file);
        TriContractList.upload(formData, this.progress).then((res) => {
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
            if (this.tableData.length === 0) {
              this.tableData = data;
              for (let j = 0; j < this.tableData.length; j += 1) {
                this.tableData[j].purchaseNum = data[j].purchaseNum;
              }
            } else {
              const tableD = [];
              for (let i = 0; i < data.length; i += 1) {
                const item = data[i];
                let bool = false;
                for (let j = 0; j < this.tableData.length; j += 1) {
                  const tab = this.tableData[j];
                  if (item.drugsId === tab.drugsId) {
                    bool = true;
                    this.tableData[j].purchaseNum = item.purchaseNum;
                  }
                }
                if (!bool) {
                  tableD.push(item);
                }
              }
              this.tableData = this.tableData.concat(tableD);
            }
            this.purchaseAmounts = 0;
            this.purchaseNums = 0;
            for (let i = 0; i < this.tableData.length; i += 1) {
              this.$set(this.tableData[i], 'purchaseAmount', parseFloat(this.tableData[i].purchaseNum * this.tableData[i].hospitalUnitPrice).toFixed(2));
              this.purchaseAmounts += Number(this.tableData[i].purchaseAmount);
              this.purchaseNums += parseInt(this.tableData[i].purchaseNum, 0);
              this.tableData[i].num = i + 1;
            }
            this.purchaseAmounts = this.purchaseAmounts.toFixed(2);
            this.$bus.$emit('data/list');
            // 导入数据
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
    // 导出
    dataExport() {
      const form = {
        gpoMemberId: this.getGpoId,
        projectId: this.fromEdit.projectId,
        hospitalMemberId: this.View_UserInfo.memberId,
      };
      const url = TriContractList.output(form);
      window.open(url);
    },
    orderBack() { // 返回按钮触发事件
      if (this.tableData.length) {
        this.$confirm('存在未保存的明细数据，确定返回吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$router.go(-1);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          });
        });
      } else {
        this.$router.go(-1);
      }
    },
  },
};
</script>
<style>
.trade {
  position: relative !important;
}

.space-steps {
  margin-bottom: 10px;
}
</style>

<style scoped>
.search-find {
  padding-bottom: 15px;
}

.search-find .find {
  margin-bottom: 0!important;
}
</style>

