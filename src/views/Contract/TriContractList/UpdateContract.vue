<template>
  <div v-loading="loading">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="合同详情" name="first">
        <div>
          <el-form :rules="editMessage.rules" label-width="120px">
            <TradeEditsForm :from-edit="fromEdit" :isCreatShow="isCreatShow" :isDeleteItem="isDeleteItem" :isExportShow="isExportShow" :isImportShow="isImportShow" :isNumItem="isNumItem" :message="editMessage" :isGoBackShow="false" :arrow-num=5 :arrow-down="true" @delete-item="deleteItem" @data-creat="dataCreat" @data-numItem="dataNumItem" @data-import="dataImport" @data-export="dataExport" @show-more="showMore">
              <el-form-item label="" slot="StepsFrom" label-width="120px">
                <StepsFrom :steplist="steplist" :active='active'></StepsFrom>
              </el-form-item>
            </TradeEditsForm>
          </el-form>

          <div v-if="contractStatus === 0" class="search-find">
            <Find :message="searchMessage" :isEmit="true" @data-search="dataSearch"></Find>
          </div>

          <div>
            <el-table :data="retTable" @selection-change="dataSelect" stripe border fit :height="View_TableHeight" @sort-change="sortChange">
              <el-table-column type="selection" width="40" v-if="dataNum">
              </el-table-column>
              <el-table-column prop="num" label="#" width="40" show-overflow-tooltip></el-table-column>
              <el-table-column prop="drugsCode" width="80" label="药品编码" sortable="custom" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="itemNo" width="140" label="合同明细号" sortable="custom" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="drugsName" min-width="120" label="通用名称" sortable="custom" show-overflow-tooltip>
                <template scope="scope">
                  <p :class="scope.row.upStatus === 0 ? 'colorRed' : ''">{{scope.row.drugsName}}</p>
                </template>
              </el-table-column>
              <el-table-column prop="tradeName" min-width="60" label="商品名" sortable="custom" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="specName" width="90" label="规格" sortable="custom" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="packSpecName" width="80" label="包装规格" sortable="custom" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="formName" min-width="80" label="剂型" sortable="custom" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="unitName" width="50" label="单位" sortable="custom" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="hospitalUnitPrice" min-width="70" label="单价" align="right" sortable="custom" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="purchasableNum" min-width="80" label="可采数量" align="right" sortable="custom" show-overflow-tooltip v-if="dataPurchaseNum">
              </el-table-column>
              <el-table-column prop="purchaseNum" min-width="80" label="合同数量" align="right" sortable="custom" show-overflow-tooltip>
                <template scope="scope">
                  <span v-if="dataPurchaseNum1">
                    <el-input class="input-right close-clear" style="width: 98%" slot="reference" size="small" placeholder="请输入数量" @focus="creatFocus(scope.row.purchaseNum)" @keyup.native="keydown(scope.row.purchaseNum, scope.row.hospitalUnitPrice, scope.$index )" @blur="keydown(scope.row.purchaseNum, scope.row.hospitalUnitPrice, scope.$index)" v-model="scope.row.purchaseNum">
                    </el-input>
                  </span>
                  <span v-else>{{scope.row.purchaseNum}}</span>
                </template>
              </el-table-column>
              <!--<el-table-column min-width="70" label="合同数量" align="right"  sortable="custom" show-overflow-tooltip v-else>
                            <template scope="scope">
                              <span>{{scope.row.purchaseNum}}</span>
                            </template>
                          </el-table-column>-->
              <el-table-column prop="purchaseAmount" min-width="80" label="金额" align="right" sortable="custom" show-overflow-tooltip>
                <template scope="scope">
                  <p>{{scope.row.purchaseAmount}}</p>
                </template>
              </el-table-column>
              <el-table-column prop="producerName" min-width="100" label="生产企业" sortable="custom" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="deliveryMemberName" min-width="100" label="配送企业" sortable="custom" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="attributeName" label="规格属性" align="left" min-width="80" sortable="custom" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="packagesName" label="包装材质" align="left" min-width="80" sortable="custom" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="approvalNumber" width="130" label="批准文号" sortable="custom" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="drugStandardCode" min-width="120" label="本位码" sortable="custom" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="closeStatus" min-width="120" label="明细结案状态" sortable="custom" show-overflow-tooltip>
                <template scope="scope">
                  <span v-if="Number(scope.row.closeStatus) === 0">无</span>
                  <span v-if="Number(scope.row.closeStatus) === 1" style="color: green">结案中</span>
                  <span v-if="Number(scope.row.closeStatus) === 2" style="color: blue">已结案</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="table-footer">
            <div style="float: left;padding-right: 15px;padding-left: 63%">
              <span>总数量：</span>{{purchaseNums || 0}}
            </div>
            <div style="float: left">
              <span>总金额：</span>{{purchaseAmounts.toFixed(2)}}
              <span>元</span>
            </div>
          </div>
          <TradeFooter :authbtn="authbtn" class="trade" :isSaveShow="isSaveShow" :isBackShow="true" :isSubmitShow="isSubmitShow" :isDeleteShow="isDeleteShow" :isLookShow="isLookShow" :isCopyShow="isCopyShow" :isCancelShows="isCancelShows" :isApplyShow="isApplyShow" :isRefuseShow="isRefuseShow" @order-save="orderSave" @data-submit="orderSubmit" @order-look="orderLook" @order-copy="orderCopy" @order-back="orderBack" @order-apply="orderApply" @contract-cancel="contractCancel" @order-refuse="orderRefuse" @order-delete="orderDelete">
          </TradeFooter>
          <AddDetail :options="dialogOptions" @dialog-hide="dialogHide"></AddDetail>
          <ImportNumDetail :options="dialogOptions1" @dialog-hide="dialogHide"></ImportNumDetail>
          <ChangeEditDialog :options="dialogOptions3" @dialog-hide="dialogHide"></ChangeEditDialog>
          <RefuseContractDialog :options="dialogOptions4" @dialog-hide="dialogHide"></RefuseContractDialog>
          <Percent v-show="isupload" :percentage="percentage"></Percent>
        </div>
      </el-tab-pane>
      <el-tab-pane label="合同日志" name="second" v-if="closable">
        <div v-loading="logloading">
          <el-table :data="tableDataLog" stripe border fit>
            <el-table-column prop="num" label="#" width="100">
            </el-table-column>
            <el-table-column prop="operator" height="20px" label="修改人" sortable="custom" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="operateTime" height="20px" label="修改时间" sortable="custom" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="statusBefore" height="20px" label="修改前状态" sortable="custom" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="statusAfter" height="20px" label="修改后状态" sortable="custom" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="ip" height="20px" label="IP" sortable="custom" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="remarks" height="20px" label="取消原因" sortable="custom" show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
    <ThreeListDialog></ThreeListDialog>
  </div>
</template>

<script>
/**
 * Created by yaoling on 2017/9/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import TradeEditsForm from '../../../components/TradeEditsForm';        //  引入订单目录表单
import AddDetail from './AddDetail';                    //  引入弹出框
import ImportNumDetail from './ImportNumDetail';                    //  引入报量明细弹出框
import StepsFrom from '../../../components/StepsFrom';                    // 引入加载条组件
import TriContractList from '../../../api/Contract/TriContractList';             //  三方合同列表api
import TradeFooter from '../../../components/TradeFooter';           // 引入底部组件
import ThreeListDialog from './ThreeListDialog';                  // 查看三方合同列表弹框
import ChangeEditDialog from './ChangeEditDialog';                  // 合同结案申请弹出框
import RefuseContractDialog from './RefuseContractDialog';                  // 拒绝合同弹出框
import Percent from '../../../components/Percent';

export default {
  activated() {
    this.contractStatus = parseInt(this.$route.query.contractStatus, 0);
    // 获取添加的明细
    if (this.$route.query.contractStatus === 0 && this.View_UserInfo.memberType === 3) {
      this.dataNum = true;
    }
    if (this.$route.query.contractStatus !== 0 && this.$route.query.contractStatus !== 1) {
      this.dataPurchaseNum = true;
    }
    if (this.$route.query.contractStatus === 0 && this.View_UserInfo.memberType === 3) {
      this.dataPurchaseNum1 = true;
    }
    // console.log();
    this.TableHeightRun(['.fromtrades', '.tradeFooter', '.search-find', 200]);
    this.$bus.$on('data/rows', this.getRows);
    this.$bus.$on('data/Itemrows', this.getItemrows);
    this.$bus.$on('project/getAll', this.getProjectAll);
    this.authbtn = TriContractList.authbtn();
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
    this.activeName = 'first';
    this.getProjectAll();
    this.dataInit();
    if (this.getGpoId && this.getProjectId) {
      this.fromEdit.projectId = this.getProjectId;                  // 获取当前切换的集采项目号码
    }
  },
  deactivated() {
    this.searchValue = {};
    this.dataNum = false;
    this.dataPurchaseNum = false;
    this.dataPurchaseNum1 = false;
    this.$bus.$off('data/rows', this.getRows);
    this.$bus.$off('data/Itemrows', this.getItemrows);
    this.$bus.$off('project/getAll', this.getProjectAll);
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
      'View_UserInfo',
      'getProjectId',
    ]),
  },
  watch: {
    authList() {
      this.authbtn = TriContractList.authbtn();
    },
    getGpoId() {
      // 当切换gpo时，重定向到列表页
      this.$router.push({ path: '/Contract/TriContractList' });
    },
    getProjectId() {
      if (this.$route.path === '/Contract/TriContractList/UpdateContract') {
        this.fromEdit.projectId = this.getProjectId; // 获取当前切换的集采项目号码
      }
    },
    projectId(newinfo, oldinfo) {
      // console.log();
      this.purchaseAmounts = 0;
      this.purchaseNums = 0;
      if (newinfo === this.projectId2 && this.$route.query.contractStatus === 0) {
        this.dataList();
      }
      if (this.$route.path === '/Contract/TriContractList/UpdateContract') {
        if (this.$route.query.contractStatus !== 0) {
          return;
        }
        if (this.tableData.length) {
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
            this.deleteItemList = [];
            this.tableData = [];
            this.changInfo = 1;
            this.fromEdit.projectId = newinfo;
          }).catch(() => {
            this.changInfo = 0;
            this.$message({
              type: 'info',
              message: '已取消操作',
            });
          });
        } else {
          this.changInfo = 0;
        }
      }
    },
    $route() {
      this.contractStatus = parseInt(this.$route.query.contractStatus, 0);
    },
    deep: true,
  },
  components: {
    AddDetail,
    TradeEditsForm,
    TradeFooter,
    StepsFrom,
    ImportNumDetail,
    ThreeListDialog,
    ChangeEditDialog,
    RefuseContractDialog,
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
        // input: '',
      }, {
        key: 'drugsName',
        label: '通用名',
        placeholder: '请输入通用名',
        type: 0,
        selects: [],
        // input: '',
      }],
      contractStatus: null,
      dataNum: false,
      dataPurchaseNum: false,
      dataPurchaseNum1: false,
      tableTitle: '添加明细',
      editMessage: {
        tabTitle: '',
        selects: [
          { value: 'StepsFrom', type: 'custom', span: 24, md: 20, sm: 24, isReadonly: true },
          { label: '合同编号', key: 'code', type: 'el-input', placeholder: '', span: 5, isReadonly: true },
          { label: '合同有效期至', key: 'validEtime', type: 'el-input', placeholder: '', isReadonly: true, span: 5 },
          { label: '创建时间', key: 'createTime', type: 'el-input', placeholder: '', isReadonly: true, span: 5 },
          { label: '', key: 'contractStatus', type: 'el-input', fromStyle: 'style2', noborder: 'true', span: 9, belWidth: '55px', isReadonly: true, fromclass: '' },
          { label: '医疗机构', key: 'hospitalMemberName', type: 'el-input', placeholder: '', isReadonly: true, span: 5 },
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
        parameters: {},
        radios: {},
        rules: {
          projectName: [
            { required: true, message: '请输入集采项目', trigger: 'blur' },
          ],
        },
      },
      nowNum: 0, // 当前数量
      loading: false,
      logloading: false,
      tableDataLog: [],
      tableData: [],
      tableCount: 0,
      tableNum: [],
      oldTableData: [],          // 本来的合同明细
      updateTableData: [],       // 新增的合同明细
      closable: true,   // 日志是否显示，待提交时不显示日志
      isCreatShow: false,
      isDeleteItem: false,
      isExportShow: false,
      isImportShow: false,
      isNumItem: false,
      isSaveShow: false,            // 保存按钮
      isSubmitShow: false,        // 提交按钮
      isDeleteShow: false,         // 删除按钮
      isCopyShow: false,
      isLookShow: false,
      isCancelShows: false,
      isApplyShow: false,
      isRefuseShow: false,
      purchaseAmount: '',         // 单个采购总价
      purchaseAmounts: 0,         // 采购总价
      purchaseNum: '',           // 单个采购数量
      purchaseNums: 0,           // 采购数量
      createObj: {},
      createObj1: {},
      createArr: [],
      createArr1: [],
      updateObj: {},
      authbtn: {},
      // 新增明细弹出框
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
      // 三方合同列表弹出框
      dialogOptions2: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: null,                //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
      },
      // 申请结案弹出框
      dialogOptions3: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: null,                //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
      },
      // 拒绝合同弹出框
      dialogOptions4: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: null,                //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
      },
      fromEdit: {
        contractStatus: '',
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
      activeName: 'first',
      active: 1,   // 订单状态
      steplist: [],
      steplist1: [{
        title: '创建合同',
        description: '',
      }, {
        title: '生成合同',
        description: '',
      }],
      steplist2: [{
        title: '生成三方合同',
        description: '',
      }, {
        title: '签章(医疗机构)',
        description: '',
      }, {
        title: '签章(配送企业)',
        description: '',
      }, {
        title: '签章(GPO)',
        description: '',
      }, {
        title: '合同生效',
        description: '',
      }],
      deleteids: [],
      deleteidsObj: {},
      dataChoolse: [],
      deleteItemList: [],
      percentage: 0,
      isupload: false,
      changInfo: 0,
      contractStatus1: 0,  // 判断合同状态
      itemstatus: 0,   // 判断是否修改了数量
      projectId2: null,  // 获取集采项目ID
    };
  },
  methods: {
    ...mapActions([
      'TableHeightRun',
      'CountNum',
      'TradeSelect',
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
    // 标签页切换时触发事件
    handleClick() {
      if (this.activeName === 'second') {
        this.logloading = true;
        this.tableDataLog = [];
        TriContractList.log(this.$route.query.id).then((res) => {
          if (res.data.code === 0) {
            this.tableDataLog = res.data.result;
            const data = res.data.result;
            this.tableCount = 0;
            for (let i = 0; i < data.length; i += 1) {
              data[i].num = i + 1;
            }
            this.tableDataLog = data;
          }
          this.logloading = false;
        });
      }
    },
    // 数据初始化
    dataInit() {
      this.loading = true;
      this.setBtnFalse();   // 将所有按钮初始化
      this.itemstatus = 0;
      this.oldTableData = this.tableData;   // 将已经存在的列表明细存放到oldTable中
      this.tableData = [];
      this.deleteItemList = [];
      if (!this.$route.query.id) {
        this.loading = false;
        return false;
      }
      // 将进度条的时间初始化
      for (let i = 0; i < this.steplist2.length; i += 1) {
        this.steplist2[i].description = '';
      }
      TriContractList.item(this.$route.query.id).then((res) => {
        if (res.data.code === 0) {
          // console.log();
          if (res.data.code === 0) {
            const data = res.data.result;
            const UserInfo = this.View_UserInfo;
            data.contractStatusIndex = data.contractStatus;
            this.contractStatus1 = data.contractStatus;
            this.projectId2 = data.projectId;
            this.editMessage.selects[9].isReadonly = true;
            this.editMessage.selects[10].isReadonly = true;
            switch (data.contractStatus) {
              case 0:
                this.editMessage.selects[9].isReadonly = false;
                this.editMessage.selects[10].isReadonly = false;
                this.editMessage.selects[4].fromclass = 'from-green no-border';
                if (this.View_UserInfo.memberType === 3) {
                  this.isCreatShow = true;
                  this.isDeleteItem = true;
                  this.isExportShow = true;
                  this.isImportShow = true;
                  this.isNumItem = true;
                }
                this.closable = false;
                this.steplist = this.steplist1;
                this.active = 1;
                this.steplist[0].description = data.createTime;
                break;
              case 1:
                this.editMessage.selects[4].fromclass = 'from-blue no-border';
                this.steplist = this.steplist1;
                this.active = 2;
                this.steplist[0].description = data.createTime;
                this.steplist[1].description = data.submitTime;
                break;
              case 2:
                this.editMessage.selects[4].fromclass = 'from-green no-border';
                this.steplist = this.steplist2;
                this.active = 1;
                this.steplist[0].description = data.createTime;
                break;
              case 3:
                this.editMessage.selects[4].fromclass = 'from-green no-border';
                this.steplist = this.steplist2;
                this.active = 2;
                this.steplist[0].description = data.createTime;
                this.steplist[1].description = data.hospitalSignTime;
                break;
              case 4:
                this.editMessage.selects[4].fromclass = 'from-green no-border';
                this.steplist = this.steplist2;
                this.active = 3;
                this.steplist[0].description = data.createTime;
                this.steplist[1].description = data.hospitalSignTime;
                this.steplist[2].description = data.deliveryAuditTime;
                break;
              case 5:
                this.editMessage.selects[4].fromclass = 'from-red no-border';
                data.contractStatus = '已作废';
                break;
              case 6:
                this.editMessage.selects[4].fromclass = 'from-red no-border';
                data.contractStatus = '已过期';
                break;
              case 7:
                this.editMessage.selects[4].fromclass = 'from-blue no-border';
                this.steplist = this.steplist2;
                this.active = 5;
                this.steplist[0].description = data.createTime;
                this.steplist[1].description = data.hospitalSignTime;
                this.steplist[2].description = data.deliveryAuditTime;
                this.steplist[3].description = data.gpoAuditTime;
                this.steplist[4].description = data.gpoAuditTime;
                break;
              case 8:
                data.contractStatus = '已结案';
                this.editMessage.selects[4].fromclass = 'from-blue no-border';
                break;
              default:
                data.contractStatus = '';
                break;
            }
            if (UserInfo.memberType === 3) {
              // console.log();
              switch (data.contractStatus) {
                case 0:
                  data.contractStatus = '待提交';
                  this.isSaveShow = true;            // 保存按钮
                  this.isSubmitShow = true;            // 提交按钮
                  this.isDeleteShow = true;            // 删除按钮
                  break;
                case 1:
                  data.contractStatus = '已提交';
                  this.isLookShow = true;
                  this.isCopyShow = true;
                  break;
                case 2:
                  data.contractStatus = '待签章（医疗机构）';
                  this.isCancelShows = true;
                  this.isCopyShow = true;
                  break;
                case 3:
                  data.contractStatus = '待签章（配送企业）';
                  break;
                case 4:
                  data.contractStatus = '待签章（GPO）';
                  break;
                case 5:
                  data.contractStatus = '已作废';
                  break;
                case 6:
                  data.contractStatus = '已过期';
                  break;
                case 7:
                  data.contractStatus = '已生效';
                  this.isCopyShow = true;
                  break;
                case 8:
                  data.contractStatus = '已结案';
                  break;
                default:
                  data.contractStatus = '';
                  break;
              }
            } else if (UserInfo.memberType === 2 && UserInfo.memberId === data.deliveryMemberId) {
              switch (data.contractStatus) {
                case 3:
                  data.contractStatus = '待签章（配送企业）';
                  this.isRefuseShow = true;
                  break;
                case 4:
                  if (data.projectPattern === 0) {
                    data.contractStatus = '待签章（GPO）';
                  } else {
                    data.contractStatus = '待签章（卖方会员）';
                  }
                  break;
                case 5:
                  data.contractStatus = '已作废';
                  break;
                case 6:
                  data.contractStatus = '已过期';
                  break;
                case 7:
                  data.contractStatus = '已生效';
                  break;
                case 8:
                  data.contractStatus = '已结案';
                  break;
                default:
                  data.contractStatus = '';
                  break;
              }
            } else if (UserInfo.memberType === 2 && UserInfo.memberId === data.salerMemberId) {
              switch (data.contractStatus) {
                case 3:
                  data.contractStatus = '待签章（配送企业）';
                  break;
                case 4:
                  if (data.projectPattern === 0) {
                    data.contractStatus = '待签章（GPO）';
                  } else {
                    data.contractStatus = '待签章（卖方会员）';
                    this.isRefuseShow = true;
                  }
                  break;
                case 5:
                  data.contractStatus = '已作废';
                  break;
                case 6:
                  data.contractStatus = '已过期';
                  break;
                case 7:
                  data.contractStatus = '已生效';
                  break;
                case 8:
                  data.contractStatus = '已结案';
                  break;
                default:
                  data.contractStatus = '';
                  break;
              }
            } else if (UserInfo.memberType === 4) {
              switch (data.contractStatus) {
                case 0:
                  data.contractStatus = '待提交';
                  break;
                case 1:
                  data.contractStatus = '已提交';
                  break;
                case 2:
                  data.contractStatus = '待签章（医疗机构）';
                  break;
                case 3:
                  data.contractStatus = '待签章（配送企业）';
                  break;
                case 4:
                  if (data.projectPattern === 0) {
                    data.contractStatus = '待签章（GPO）';
                    this.isRefuseShow = true;
                  } else {
                    data.contractStatus = '待签章（卖方会员）';
                  }
                  break;
                case 5:
                  data.contractStatus = '已作废';
                  break;
                case 6:
                  data.contractStatus = '已过期';
                  break;
                case 7:
                  data.contractStatus = '已生效';
                  break;
                case 8:
                  data.contractStatus = '已结案';
                  break;
                default:
                  data.contractStatus = '';
                  break;
              }
            } else if (UserInfo.memberType === 5) {
              switch (data.contractStatus) {
                case 0:
                  data.contractStatus = '待提交';
                  break;
                case 1:
                  data.contractStatus = '已提交';
                  break;
                case 2:
                  data.contractStatus = '待签章（医疗机构）';
                  break;
                case 3:
                  data.contractStatus = '待签章（配送企业）';
                  break;
                case 4:
                  if (data.projectPattern === 0) {
                    data.contractStatus = '待签章（GPO）';
                  } else {
                    data.contractStatus = '待签章（卖方会员）';
                  }
                  break;
                case 5:
                  data.contractStatus = '已作废';
                  break;
                case 6:
                  data.contractStatus = '已过期';
                  break;
                case 7:
                  data.contractStatus = '已生效';
                  break;
                case 8:
                  data.contractStatus = '已结案';
                  break;
                default:
                  data.contractStatus = '';
                  break;
              }
            }
            this.fromEdit = Object.assign({}, data);
            this.fromEdit = Object.assign({}, this.fromEdit, {
              hospitalPerson: `${data.hospitalPerson || ''} ${data.hospitalPhone || ''}`,
              deliveryPerson: `${data.deliveryPerson || ''} ${data.deliveryPhone || ''}`,
              projectId: data.contractStatusIndex === 0 ? data.projectId : data.projectName,
            });
          }
        }
        this.loading = false;
        this.dataList();
        setTimeout(() => {
          this.TableHeightRun(['.fromtrades', '.tradeFooter', '.search-find', 200]);
        }, 0);
      });
      return true;
    },
    // 获取当前的数值
    creatFocus(data) {
      this.nowNum = data;
      // console.log();
    },
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

      this.itemstatus = 1;
      // console.log();
      if ((data.toString().search(/\D/) !== -1 || Number(data) === 0) && data !== '') {
        this.tableData[itemIndex].purchaseNum = this.nowNum;
      } else {
        const ItemListNum = this.tableData[itemIndex].purchaseNum;
        const ItemListPrice = this.tableData[itemIndex].hospitalUnitPrice;
        this.$set(this.tableData[itemIndex], 'purchaseAmount', parseFloat(ItemListNum * ItemListPrice).toFixed(2));
        this.CountNum({ Num: this.nowNum, Count: data, Price: res });
        this.nowNum = data;
        this.purchaseAmounts = 0;
        this.purchaseNums = 0;
        for (let i = 0; i < this.tableData.length; i += 1) {
          if (this.tableData[i].purchaseNum) {
            this.purchaseNums += parseInt(this.tableData[i].purchaseNum, 0);
            this.purchaseAmounts += Number(this.tableData[i].purchaseAmount);
          }
        }
      }
      return false;
    },
    // 重新计算表格高度
    showMore() {
      this.$nextTick(() => {
        this.TableHeightRun(['.fromtrades', '.tradeFooter', '.search-find', 200]);
      });
    },
    // 获取集采项目下拉
    getProjectAll() {
      this.editMessage.options.projectOption = this.projectOptions; // 给项目集采名称options赋值
      this.fromEdit = Object.assign({}, this.fromEdit, {
        projectId: this.getProjectId,
      });
    },
    // 获取添加的明细
    getRows(rows) {
      this.tableData = this.tableData.concat(rows);
      this.tableNum = [];
      this.tableCount = 0;
      for (let i = 0; i < this.tableData.length; i += 1) {
        const numX = i + 1;
        this.tableData[i].num = numX;
        this.tableNum.push(numX);
      }
    },
    // 获取导入报量的明细
    getItemrows(rows) {
      this.itemstatus = 1;
      TriContractList.importItem(rows[0].id)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
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
            this.tableNum = [];
            this.tableCount = 0;
            for (let i = 0; i < this.tableData.length; i += 1) {
              this.$set(this.tableData[i], 'purchaseAmount', parseFloat(this.tableData[i].purchaseNum * this.tableData[i].hospitalUnitPrice).toFixed(2));
              this.purchaseAmounts += Number(this.tableData[i].purchaseAmount);
              this.purchaseNums += parseInt(this.tableData[i].purchaseNum, 0);
              const numX = i + 1;
              this.tableData[i].num = numX;
              this.tableNum.push(numX);
            }
          }
        });
    },
    // 列表删除添加重新计算数量和金额
    count() {
      this.purchaseAmounts = 0;
      this.purchaseNums = 0;
      this.tableNum = [];
      this.tableCount = 0;
      for (let i = 0; i < this.tableData.length; i += 1) {
        this.purchaseAmounts += Number(this.tableData[i].purchaseAmount);
        this.purchaseNums += parseInt(this.tableData[i].purchaseNum, 0);
        const numX = i + 1;
        this.tableData[i].num = numX;
        this.tableNum.push(numX);
      }
    },
    // 添加明细
    dataCreat() {
      this.itemstatus = 1;
      this.drugsIds = [];
      this.dialogOptions.isShowDialog = true;
      for (let i = 0; i < this.tableData.length; i += 1) {
        this.drugsIds.push(this.tableData[i].drugsId);
      }
      this.drugsIds = this.drugsIds.toString();
      this.$bus.$emit('my/getProjectId', this.fromEdit.projectId, this.drugsIds);
    },
    // 导入报量明细
    dataNumItem() {
      this.itemstatus = 1;
      this.dialogOptions1.isShowDialog = true;
      this.$bus.$emit('export/getProjectId', this.fromEdit.projectId);
    },
    // 删除明细操作
    deleteItem() {
      this.itemstatus = 1;
      // console.log();
      this.$confirm('确定要删除该明细吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.deleteItemList = [];
        for (let k = 0; k < this.dataChoolse.length; k += 1) {
          const keys = Object.keys(this.dataChoolse[k]);
          const item = this.dataChoolse[k];
          // console.log();
          // console.log();

          for (let i = 0; i < this.tableData.length; i += 1) {
            const tableD = this.tableData[i];
            if (tableD.id === item.id) {
              this.tableData.splice(i, 1);
              if (keys.indexOf('itemNo') > -1) {
                this.deleteItemList.push(item.id);
              }
            }
          }

          const index = this.deleteids.indexOf(item.id);
          this.deleteids.splice(index, 1);
        }
        this.count();
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
      this.contractId = null;
    },
    // 获取数据列表
    dataList() {
      this.loading = true;
      TriContractList.itemInfo(this.$route.query.id)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.oldTableData = data;
            this.tableData = [];
            this.tableNum = [];
            this.tableCount = 0;
            for (let i = 0; i < data.length; i += 1) {
              const numX = i + 1;
              data[i].num = numX;
              this.tableNum.push(numX);
              data[i].minUnitPrice = data[i].hospitalUnitPrice;
              data[i].contractStatus = this.fromEdit.contractStatusIndex;
              data[i].purchaseNum = data[i].itemNum;
              if (this.$route.query.contractStatus === 7 && this.View_UserInfo.memberType === 3) {
                if (data[i].closeStatus === 0) {
                  this.isApplyShow = true;
                }
              }
            }
            this.tableData = data;
            this.tableDataOld = data;
            this.purchaseAmounts = 0;
            this.purchaseNums = 0;
            for (let i = 0; i < this.tableData.length; i += 1) {
              this.purchaseAmounts += Number(this.tableData[i].purchaseAmount);
              this.purchaseNums += parseInt(this.tableData[i].purchaseNum, 0);
            }
            this.page = data.number;
            this.size = data.size;
            this.$emit('page', data.number + 1, data.size, data.totalElements);
          }
          this.loading = false;
        });
    },
    //  选择触发事件，根据所选数据判断btn是否禁用
    dataSelect(row) {
      this.dataChoolse = row;
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
        this.deleteids.push(row[i].id);
      }
      // console.log();
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
      // console.log();
      for (let i = 0; i < this.tableData.length; i += 1) {
        if (this.tableData[i].purchaseNum === '' || this.tableData[i].purchaseNum === undefined || Number(this.tableData[i].purchaseNum) === 0) {
          this.$message({
            type: 'error',
            message: '数量不能为空或为0',
          });
          return false;
        }
        if (this.tableData[i].enable === 0 || this.tableData[i].upStatus === 0 ||
          this.tableData[i].openStatus === 0) {
          this.$message({
            type: 'error',
            message: '当前存在已失效药品, 无法保存',
          });
          return false;
        }
      }
      this.loading = true;
      // // console.log();
      if (this.$route.path === '/Contract/TriContractList/UpdateContract') {
        this.createArr1 = []; //  已经存在的，更新数量与金额
        this.createArr = [];  //  新增的
        for (let i = 0; i < this.tableData.length; i += 1) {
          const item = this.tableData[i];
          const keys = Object.keys(item);
          if (keys.indexOf('itemNo') > -1) {
            // console.log();
            for (let j = 0; j < this.oldTableData.length; j += 1) {
              const data = {
                id: item.id,
                purchaseAmount: item.purchaseAmount,
                purchaseNum: item.purchaseNum,
              };
              if (data.id === this.oldTableData[j].id &&
                parseFloat(data.purchaseNum) !== this.oldTableData[j].itemNum) {
                this.createArr1.push(data);
                // console.log();
              }
            }
          } else {
            // console.log();
            const data = {
              id: item.drugsId,
              purchaseAmount: item.purchaseAmount,
              purchaseNum: item.purchaseNum,
            };
            // console.log();
            this.createArr.push(data);
          }
        }
        // console.log();
        this.updateObj = Object.assign({}, this.updataObj, {
          addItemEntityList: this.createArr,
          id: this.$route.query.id,
          projectId: this.fromEdit.projectId,
          gpoMemberId: this.getGpoId,
          remarks: this.fromEdit.remarks,
          updateItemEntityList: this.createArr1,
          deleteItemList: this.deleteItemList,
        });
        // console.log();
        TriContractList.itemSave(this.updateObj).then((res) => {
          // console.log();
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '保存成功',
            });
            this.$bus.$emit('data/list');
            this.$router.go(-1);
          }
          this.loading = false;
        });
      }
      // this.btnDisabled.planSubmit = false;
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
        if (this.tableData[i].enable === 0 || this.tableData[i].upStatus === 0 ||
          this.tableData[i].openStatus === 0) {
          this.$message({
            type: 'error',
            message: '当前存在已失效药品, 无法保提交',
          });
          return false;
        }
      }
      this.loading = true;
      this.createArr1 = []; //  已经存在的，更新数量与金额
      this.createArr = [];  //  新增的
      for (let i = 0; i < this.tableData.length; i += 1) {
        const item = this.tableData[i];
        const keys = Object.keys(item);
        if (keys.indexOf('itemNo') > -1) {
          // console.log();
          for (let j = 0; j < this.oldTableData.length; j += 1) {
            const data = {
              id: item.id,
              purchaseAmount: item.purchaseAmount,
              purchaseNum: item.purchaseNum,
            };
            if (data.id === this.oldTableData[j].id &&
              parseFloat(data.purchaseNum) !== this.oldTableData[j].itemNum) {
              this.createArr1.push(data);
              // console.log();
            }
          }
        } else {
          const data = {
            id: item.drugsId,
            purchaseAmount: item.purchaseAmount,
            purchaseNum: item.purchaseNum,
          };
          this.createArr.push(data);
        }
      }
      this.updateObj = Object.assign({}, this.updataObj, {
        addItemEntityList: this.createArr,
        id: this.$route.query.id,
        projectId: this.fromEdit.projectId,
        remarks: this.fromEdit.remarks,
        gpoMemberId: this.getGpoId,
        updateItemEntityList: this.createArr1,
        deleteItemList: this.deleteItemList,
      });
      // console.log();
      TriContractList.submit(this.updateObj).then((res) => {
        // console.log();
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '保存成功',
          });
          this.$router.push({ path: '/Contract/TriContractList/ApplyThreeContract', query: { data: res.data.result } });
        }
        this.loading = false;
      });
      return true;
    },
    // 复制合同
    orderCopy() {
      // console.log();
      this.$confirm('确定要复制合同?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$router.push({ path: '/Contract/TriContractList/CopyContract', query: { data: this.tableData, projectId: this.projectId2 } });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 查看已生成合同
    orderLook() {
      // this.dialogOptions2.isShowDialog = true;
      const contractId = this.$route.query.id;
      this.$bus.$emit('data/lookThreeContract', contractId);
    },
    // 申请结案
    orderApply() {
      this.$bus.$emit('changeEdit/dialog');
    },
    // 取消合同
    contractCancel(list, data) {
      const remark = data;
      const id = this.$route.query.id;
      const status = this.$route.query.contractStatus;
      // console.log();
      TriContractList.cancel(id, remark, status).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '取消成功',
          });
          this.$bus.$emit('data/list');
          this.$router.go(-1);
        }
        // this.loading = false;
      });
    },
    // 拒绝合同
    orderRefuse() {
      this.$bus.$emit('reufseContract/dialog');
    },
    // 删除合同
    orderDelete() {
      if (this.$route.query.id) {
        TriContractList.deleteContract(this.$route.query.id).then((res) => {
          // console.log();
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功',
            });
            this.$bus.$emit('data/list');
            this.$router.go(-1);
          }
        });
      }
    },
    // 返回按钮触发事件
    orderBack() {
      if (this.contractStatus1 === 0 && this.itemstatus) {
        this.$confirm('存在未保存的明细数据，确定返回吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$bus.$emit('data/list');
          history.back();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          });
        });
      } else {
        this.$bus.$emit('data/list');
        history.back();
      }
    },
    //  文件导入
    dataImport(e) {
      this.itemstatus = 1;
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
              // console.log();
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
              // console.log();
            }
            this.purchaseAmounts = 0;
            this.purchaseNums = 0;
            this.tableNum = [];
            this.tableCount = 0;
            for (let i = 0; i < this.tableData.length; i += 1) {
              // data.content[i].num = (i + 1) + (cpage * cpageSizes);
              this.$set(this.tableData[i], 'purchaseAmount', parseFloat(this.tableData[i].purchaseNum * this.tableData[i].hospitalUnitPrice).toFixed(2));
              this.purchaseAmounts += Number(this.tableData[i].purchaseAmount);
              this.purchaseNums += parseInt(this.tableData[i].purchaseNum, 0);
              const numX = i + 1;
              this.tableData[i].num = numX;
              this.tableNum.push(numX);
            }
            // this.purchaseAmounts = this.purchaseAmounts.toFixed(2);
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
      // console.log();
      const url = TriContractList.output(form);
      window.open(url);
    },
    //  初始化按钮
    setBtnFalse() {
      // console.log();
      this.isSaveShow = false;
      this.isSubmitShow = false;
      this.isDeleteShow = false;
      this.isCopyShow = false;
      this.isLookShow = false;
      this.isCancelShows = false;
      this.isApplyShow = false;
      this.isRefuseShow = false;
      this.isCreatShow = false;
      this.isDeleteItem = false;
      this.isExportShow = false;
      this.isImportShow = false;
      this.isNumItem = false;
      this.closable = true;
    },
    //  查询条件，用前端做筛选
    dataSearch(data) {
      this.searchValue = {
        drugsCode: data.drugsCode ? data.drugsCode.value : null,
        drugsName: data.drugsName ? data.drugsName.value : null,
      };
    },
  },
};
</script>
<style>
.trade {
  position: relative !important;
}

.colorRed {
  color: red;
}
</style>

<style scoped>
.search-find {
  padding-bottom: 15px;
}

.search-find .find {
  margin-bottom: 0 !important;
}
</style>
