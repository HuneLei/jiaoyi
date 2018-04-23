<template>
  <div v-loading="loading">
    <el-form :rules="editMessage.rules" label-width="120px" id="from-item">
      <TradeEditsFormI :from-edit="totalForm" ref="changeBtnStatus" :isCreatShow="middleBtnShow.isCreatShow" :isDeleteItem="middleBtnShow.isDeleteItem" :tradeEditBtn="tradeEditBtn" :message="editMessage" :isGoBackShow="false" :isExportShow="middleBtnShow.isExportShow" :isImportShow="middleBtnShow.isImportShow" :arrow-num=2 :arrow-down="true" @data-creat="dataCreat" @delete-item="deleteItem" @show-more="tableHeightRun">
        <el-form-item label="集采项目" prop="projectId" slot='projectId'>
          <el-select v-model="totalForm.projectId" placeholder="请选择" size="small" @change="changeProject" :disabled="showDisabled">
            <el-option v-for="item in editMessage.options.projectOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="showPage" label="收货地址" prop="receiveAddress" slot='receiveAddress'>
          <el-input v-if="!showDisabled" v-model="totalForm.receiveAddress" readonly placeholder="请选择医疗机构名称" @focus="showAddressDialog()" icon="search" size="small"></el-input>
          <el-input v-if="showDisabled" v-model="totalForm.receiveAddress" readonly placeholder="请选择医疗机构名称" size="small" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item v-if="!showPage" label="采购单金额" prop="total" slot='receiveAddress'>
          <el-input v-if="showDisabled" v-model="totalForm.receiveAddress" readonly size="small" :disabled="true"></el-input>
        </el-form-item>
      </TradeEditsFormI>
    </el-form>
    <div>
      <el-table :data="totalForm.deliveryPurchaseDrugsItemFormList" @selection-change="dataSelect" stripe border fit :height="tableHeight">
        <el-table-column type="selection" width="40" fixed="left" align="center" v-if="!showDisabled">
        </el-table-column>
        <el-table-column prop="drugsCode" min-width="80" label="药品编码" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="drugsName" min-width="80" label="通用名" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="formName" min-width="80" label="剂型" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="specificationName" min-width="80" label="规格" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="packSpecName" min-width="80" label="包装规格" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="unitName" min-width="80" label="单位" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="purchaseNum" min-width="80" label="数量" sortable show-overflow-tooltip>
          <template scope="scope">
            <el-input v-if="!showDisabled" type="number" style="width: 98%" slot="reference" size="small" placeholder="请输入内容" @change="numChange(scope.row)" v-model="scope.row.purchaseNum">
            </el-input>
            <span v-if="showDisabled">{{scope.row.purchaseNum}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="protocolPrice" min-width="100" label="单价" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="purchaseAmount" min-width="100" label="金额" sortable show-overflow-tooltip>
          <template scope="scope">
            <span>{{ scope.row.purchaseAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="producerName" min-width="90" label="生产企业" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="tradeName" min-width="80" label="商品名" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="approvalNumber" min-width="80" label="批准文号" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="itemNo" min-width="110" label="采购单明细编号" sortable show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div class="table-footer">
        <div style="float: left;padding-right: 15px;padding-left: 63%">
          <i>总数量：</i>
          <span>{{totalForm.totalNum}}</span>
        </div>
        <div style="float: left;">
          <i>总金额：</i>
          <span>{{totalForm.amount}}</span>
        </div>
      </div>
    </div>
    <TradeFooterI :authbtn="authbtn" :btnDisabled="btnDisabled" :isSaveShow="isSaveShow" :isDeleteShow="isDeleteShow" :isSubmitShow="isSubmitShow" :isBackShow="isBackShow" @data-submit="submit" @order-save="orderSave" @order-delete="orderDelete" @order-back="orderBack"></TradeFooterI>
    <EditDialog :options="dialogOptions" @dialog-hide="dialogHide" @dialogSelect="dialogSelectDrugs"></EditDialog>
    <AdressDialog :options="adressDialogOptions" @dialog-hide="adressDialogHide" @dialogSelect="dialogSelectAddress"></AdressDialog>
  </div>
</template>

<script>
/**
 * Created by lqy on 2017/9/16.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import TradeEditsFormI from '../../../components/TradeEditsFormI'; //  引订单目录表单
import TradeFooterI from '../../../components/TradeFooterI'; // 引入订单底部
import EditDialog from './EditDialog';                     // 引入明细弹出窗
import AdressDialog from './AdressDialog';                 // 引入收货地址弹出窗
import Project from '../../../api/BasicInfo/Project';   // api -- project[集采项目]
import DeliverypurchaseList from '../../../api/Deliverypurchase/DeliverypurchaseList';   // 配送单列表接口

export default {
  activated() {
    // this.loading = true;
    this.emptyData();                         // 初始化清空数据
    // console.log();
    this.getProjectAll();                      // 获取集采项目列表
    this.getGpoData();                         // 获取gpo数据
    // 编辑页的类型   1、已提交[只读]  0、待提交[可编辑]
    const type = this.$route.query.type;
    let editName = '';                // 详情页面包屑名字
    switch (type) {
      case 'create':
        this.tradeEditBtn = {
          createBtn: true,    // 新增
          deleteBtn: true,    // 删除
          exportBtn: true,    // 导出
          importBtn: true,    // 导入
        };
        // 底部按钮状态
        this.btnDisabled = {
          planSave: true,
          planSubmit: true,
          planDelete: true,
        };
        // 隐藏底部按钮
        this.isSaveShow = true;
        this.isDeleteShow = true;
        this.isSubmitShow = true;
        // 隐藏中间按钮
        this.middleBtnShow = {
          isCreatShow: true,
          isDeleteItem: true,
          isExportShow: true,
          isImportShow: true,
        };
        this.createFunc();
        editName = '采购单新增';
        break;
      case 'edit':
        this.tradeEditBtn = {
          createBtn: false,    // 新增
          deleteBtn: false,    // 删除
          exportBtn: false,    // 导出
          importBtn: false,    // 导入
        };
        // 底部按钮状态
        this.btnDisabled = {
          planSave: false,
          planSubmit: false,
          planDelete: false,
        };
        // 隐藏底部按钮
        this.isSaveShow = true;
        this.isDeleteShow = true;
        this.isSubmitShow = true;
        // 隐藏中间按钮
        this.middleBtnShow = {
          isCreatShow: true,
          isDeleteItem: true,
          isExportShow: true,
          isImportShow: true,
        };
        this.editFunc();
        editName = '采购单编辑';
        break;
      case 'show':
        // 隐藏底部按钮
        this.isSaveShow = false;
        this.isDeleteShow = false;
        this.isSubmitShow = false;
        // 隐藏中间按钮
        this.middleBtnShow = {
          isCreatShow: false,
          isDeleteItem: false,
          isExportShow: false,
          isImportShow: false,
        };
        this.showFunc();
        editName = '采购单详情';
        break;
      default:
        break;
    }
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Deliverypurchase',
        name: '配送企业采购管理',
      },
      {
        path: '/Deliverypurchase/DeliveryPurchaseList',
        name: '采购单列表',
        noLink: false,
      },
      {
        path: '/Deliverypurchase/DeliveryPurchaseList/Edit',
        name: editName,
        noLink: true,
      },
    ]);
  },
  watch: {
    $route(to, from) {
      // console.log();
      // console.log();
    },
    getGpoId(val, oldVal) {
      // console.log();
      // console.log();
      if (!oldVal) {
        this.$router.push({ path: '/Deliverypurchase/DeliveryPurchaseList' });
      } else {
        this.$router.push({ path: '/Deliverypurchase/DeliveryPurchaseList' });
      }
    },
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  computed: mapGetters([
    'getGpoId',
    'gpoOptions',
    'View_UserInfo',
    'projectOptions',
  ]),
  components: {
    EditDialog,
    TradeEditsFormI,
    TradeFooterI,
    AdressDialog,
  },
  data() {
    return {
      // 编辑页头部显示金额
      showPage: true,
      // 查看页面不可编辑
      showDisabled: false,
      // 中间的按钮显示隐藏
      middleBtnShow: {
        isCreatShow: true,
        isDeleteItem: true,
        isExportShow: true,
        isImportShow: true,
      },
      tableHeight: 280,
      // 底部按钮显示隐藏
      isSaveShow: true, // 保存按钮
      isBackShow: true, // 返回按钮
      isDeleteShow: true, // 删除按钮
      isSubmitShow: true,  // 提交按钮
      num: 4, // 总数量
      // 新增明细传值
      dialogOptions: {
        msgBase: '', //  没什么卵用，有需要可以看看
        isShowDialog: false, //  显示弹框
        tableSelected: null, //  默认表格选中
        tableType: 1, //  0 单选，1 多选 默认单选
        dialogForm: {
          drugsId: 0,
        },
      },
      // 表头获取
      topbarForm: {
        id: null,
        projectId: null,
        gpoMemberId: null,
        memberId: null,
      },
      // 地址传值
      adressDialogOptions: {
        msgBase: '', //  没什么卵用，有需要可以看看
        isShowDialog: false, //  显示弹框
        tableSelected: null, //  默认表格选中
        tableType: 1, //  0 单选，1 多选 默认单选
      },
      // 默认的按钮样式  --  中间的按钮
      tradeEditBtn: {
        createBtn: true,    // 新增
        deleteBtn: true,    // 删除
        exportBtn: true,    // 导出
        importBtn: true,    // 导入
      },
      // 底部按钮状态
      btnDisabled: {
        planSave: true,
        planSubmit: true,
        planDelete: true,
      },
      // 权限控制
      authbtn: {
        create: true,
      },
      // 上部分表单字段
      editMessage: {
        tabTitle: '',
        selects: [
          { value: 'projectId', type: 'custom', noClearable: true, span: 24 },
          { label: '采购单编号', key: 'code', type: 'el-input', isReadonly: true, span: 6 },
          { label: '创建人', key: 'createBy', type: 'el-input', isReadonly: true, span: 6 },
          { label: '创建时间', key: 'createTime', type: 'el-input', isReadonly: true, span: 12 },
          { label: '配送企业', key: 'deliveryMemberName', type: 'el-input', isReadonly: true, span: 6 },
          { label: '联系人', key: 'deliveryPerson', type: 'el-input', isReadonly: true, span: 6 },
          { label: '联系电话', key: 'deliveryPhone', type: 'el-input', isReadonly: true, span: 12 },
          { label: 'GPO名称', key: 'gpoMemberName', type: 'el-input', isReadonly: true, span: 6 },
          { label: '联系人', key: 'contacter', type: 'el-input', isReadonly: true, span: 6 },
          { label: '联系电话', key: 'contactPhone', type: 'el-input', isReadonly: true, span: 12 },
          { value: 'receiveAddress', type: 'custom' },
          { label: '备注', key: 'remarks', type: 'el-input', fromType: 'textarea', fromStyle: 'style1', span: 24, rows: 2, placeholder: '请输入备注' },
        ],
        styleObject: {
          style1: {
            width: '66%',
          },
        },
        parameters: {},
        options: {
          projectOptions: [],
        },
        radios: {},
        rules: {},
      },
      loading: false,
      // 需要提交的全部数据
      totalForm: {
        // top
        code: null,
        createBy: null,
        createTime: null,
        contacter: null,
        contactPhone: null,
        drugsArr: [],
        totalNum: 0,
        // .. 需要提交的数据
        amount: 0,                                                             // 金额
        deliveryMemberCode: null,                                                 // 配送企业会员编码
        deliveryMemberId: null,                                                   // 配送企业会员Id
        deliveryMemberName: null,                                                 // 配送企业会员名称
        deliveryPerson: null,                                                     // 配送联系人
        deliveryPhone: null,                                                      // 配送联系电话
        deliveryPurchaseDrugsItemFormList: [],                                    // 药品列表
        gpoMemberId: null,                                                        // GPOID
        gpoMemberName: null,                                                      // GPO名称
        id: null,                                                                 // Id
        projectId: null,                                                          // 集采项目ID
        receiveAddress: null,                                                     // 收货地址
        remarks: null,                                                            // 备注
        salerMemberCode: null,                                                    // 卖方会员编码
        salerMemberId: null,                                                      // 卖方会员ID
        salerMemberName: null,                                                    // 卖方会员名称
        status: null,                                                             // 状态
      },
    };
  },
  methods: {
    // 新增
    createFunc() {
      this.showPage = true;              // 显示医疗机构，隐藏金额
      this.showDisabled = false;         // 查看页面不可编辑
      this.editMessage.selects[11].isReadonly = false;  // 备注不可编辑
      this.isDeleteShow = false;       // 新增删除按钮隐藏
      this.topbarForm = {
        id: null,
        projectId: null,
        gpoMemberId: Number(this.getGpoId),
        memberId: Number(this.View_UserInfo.memberId),
      };
      // 获取表头
      const type = 0;    // 类型是新增
      this.getTopbarItem(type);
    },
    // 编辑修改
    editFunc() {
      this.showPage = true;              // 显示医疗机构，隐藏金额
      this.showDisabled = false;         // 查看页面不可编辑
      this.editMessage.selects[11].isReadonly = false;  // 备注不可编辑
      // console.log();
      // 获取表头
      this.isDeleteShow = true;
      this.topbarForm = {
        id: Number(this.$route.query.id),
        projectId: Number(this.$route.query.pid),
        gpoMemberId: Number(this.getGpoId),
        memberId: Number(this.View_UserInfo.memberId),
      };
      // 获取表头
      const type = 1;      // 类型是编辑
      this.getTopbarItem(type);
      // 获取已选药品列表
      this.getSelectedDrugs();
    },
    // 查看详情
    showFunc() {
      this.showPage = false;              // 显示医疗机构，隐藏金额
      this.showDisabled = true;         // 查看页面不可编辑
      this.editMessage.selects[11].isReadonly = true;  // 备注不可编辑
      // console.log();
      // 获取表头
      this.topbarForm = {
        id: this.$route.query.id,
        projectId: this.$route.query.pid,
        gpoMemberId: this.getGpoId,
        memberId: this.View_UserInfo.memberId,
      };
      // 获取表头
      const type = 2;      // 类型是编辑
      this.getTopbarItem(type);
      // 获取已选药品列表
      this.getSelectedDrugs();
    },
    // 获取头部信息
    getTopbarItem(type) {
      // console.log();
      // console.log();
      DeliverypurchaseList.listItem(this.topbarForm).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          // console.log();
          this.totalForm.deliveryMemberCode = data.content[0].deliveryMemberCode;
          this.totalForm.deliveryMemberId = data.content[0].deliveryMemberId;
          this.totalForm.deliveryMemberName = data.content[0].deliveryMemberName;
          /**
           * type = 0   新增
           * type = 1   编辑
           * type = 2   查看
           */
          switch (type) {
            case 0:
              // 创建 totalForm
              this.totalForm.id = null;
              this.totalForm.projectId = null;
              this.totalForm.code = null;
              this.totalForm.createBy = null;
              this.totalForm.createTime = null;
              this.totalForm.deliveryMemberName = data.content[0].deliveryMemberName;
              this.totalForm.deliveryPerson = data.content[0].deliveryPerson;
              this.totalForm.deliveryPhone = data.content[0].deliveryPhone;
              this.totalForm.gpoMemberName = data.content[0].gpoMemberName;
              this.totalForm.contacter = data.content[0].contacter;
              this.totalForm.contactPhone = data.content[0].contactPhone;
              this.totalForm.receiveAddress = null;
              this.totalForm.remarks = null;
              this.totalForm.drugsArr = [];
              this.totalForm.status = 0;                  // 状态值  0  -- 待提交   1 -- 已提交
              // console.log();
              break;
            case 1:
              // 编辑 totalForm
              this.totalForm.id = Number(this.$route.query.id);
              this.totalForm.projectId = Number(this.$route.query.pid);
              this.totalForm.code = data.content[0].code;
              this.totalForm.createBy = data.content[0].createBy;
              this.totalForm.createTime = data.content[0].createTime;
              this.totalForm.deliveryMemberName = data.content[0].deliveryMemberName;
              this.totalForm.deliveryPerson = data.content[0].deliveryPerson;
              this.totalForm.deliveryPhone = data.content[0].deliveryPhone;
              this.totalForm.gpoMemberName = data.content[0].gpoMemberName;
              this.totalForm.contacter = data.content[0].contacter;
              this.totalForm.contactPhone = data.content[0].contactPhone;
              this.totalForm.receiveAddress = data.content[0].receiveAddress;
              this.totalForm.remarks = data.content[0].remarks;
              this.totalForm.drugsArr = [];
              this.totalForm.status = 0;                  // 状态值  0  -- 待提交   1 -- 已提交
              // console.log();
              break;
            case 2:
              // 表单中的值
              // 编辑 totalForm
              this.totalForm.id = Number(this.$route.query.id);
              this.totalForm.projectId = Number(this.$route.query.pid);
              this.totalForm.code = data.content[0].code;
              this.totalForm.createBy = data.content[0].createBy;
              this.totalForm.createTime = data.content[0].createTime;
              this.totalForm.deliveryMemberName = data.content[0].deliveryMemberName;
              this.totalForm.deliveryPerson = data.content[0].deliveryPerson;
              this.totalForm.deliveryPhone = data.content[0].deliveryPhone;
              this.totalForm.gpoMemberName = data.content[0].gpoMemberName;
              this.totalForm.contacter = data.content[0].contacter;
              this.totalForm.contactPhone = data.content[0].contactPhone;
              this.totalForm.receiveAddress = data.content[0].receiveAddress;
              this.totalForm.remarks = data.content[0].remarks;
              break;
            default:
              break;
          }
          this.loading = false;
        }
      });
    },
    // 获取已选药品列表
    getSelectedDrugs() {
      const obj = {
        purchaseId: Number(this.$route.query.id),
        projectId: Number(this.$route.query.pid),
        gpoMemberId: this.getGpoId,
      };
      DeliverypurchaseList.drugsList(obj).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          // console.log();
          this.totalForm.deliveryPurchaseDrugsItemFormList = data.content;
          for (let i = 0; i < data.content.length; i += 1) {
            this.totalForm.amount += data.content[i].purchaseNum * data.content[i].protocolPrice;
            this.totalForm.totalNum += data.content[i].purchaseNum;
          }
          this.totalForm.salerMemberCode = data.content[0].salerMemberCode;        // 卖方会员编码
          this.totalForm.salerMemberId = data.content[0].salerMemberId;            // 卖方会员ID
          this.totalForm.salerMemberName = data.content[0].salerMemberName;        // 卖方会员名称
          this.loading = false;
        }
      });
    },
    // 获取集采项目下拉
    getProjectAll(gpoId) {
      this.editMessage.options.projectOptions = this.projectOptions;    // 给项目集采名称options赋值
    },
    // 获取gpo数据
    getGpoData() {
      // gpoID赋值
      this.totalForm.gpoMemberId = this.getGpoId;
      for (let i = 0; i < this.gpoOptions.length; i += 1) {
        if (this.gpoOptions[i].id === this.getGpoId) {
          this.gpoMemberName = this.gpoOptions[i].name;
        }
      }
    },
    // 改变集采项目名称
    changeProject() {
      if (this.totalForm.projectId !== null) {
        // 父组件触发子组件的改变按钮状态的事件
        this.tradeEditBtn = {
          createBtn: false,        // 新增
          deleteBtn: true,        // 删除
          exportBtn: false,        // 导出
          importBtn: false,        // 导入
        };
        this.btnDisabled.planDelete = false;
      }
    },
    // 添加明细
    dataCreat() {
      this.dialogOptions.isShowDialog = true;
    },
    // 弹出收货地址窗口
    showAddressDialog() {
      this.adressDialogOptions.isShowDialog = true;
    },
    numChange(data) {  // 数量发生变化的时候触发
      this.totalForm.deliveryPurchaseDrugsItemFormList[data.num - 1].purchaseAmount =
        Number(data.purchaseNum) * data.protocolPrice;
      let amount = 0;
      let totalNum = 0;
      for (let i = 0; i < this.totalForm.deliveryPurchaseDrugsItemFormList.length; i += 1) {
        // console.log();
        amount += this.totalForm.deliveryPurchaseDrugsItemFormList[i].purchaseAmount;
        totalNum += Number(this.totalForm.deliveryPurchaseDrugsItemFormList[i].purchaseNum);
      }
      // console.log();
      this.totalForm.amount = amount;
      this.totalForm.totalNum = totalNum;
    },
    // 删除明细操作
    deleteItem() {
    },
    // 关闭弹出框  -- 明细
    dialogHide() {
      this.dialogOptions.isShowDialog = false;
    },
    // 关闭弹出框  -- 地址ss
    adressDialogHide() {
      this.dialogOptions.isShowDialog = false;
    },
    // 获取数据列表
    dataList() {
      this.loading = false;
    },
    //  判断下部分表格是否有选项，删除明细按钮是否disabled。
    dataSelect(row) {
      // console.log();
      let first = 0;
      for (let i = 0; i < row.length; i += 1) {
        const item = row[i];
        first += 1;
      }
      if (first > 0) {
        this.tradeEditBtn.deleteBtn = false;
      } else {
        this.tradeEditBtn.deleteBtn = true;
      }
      this.selectedDrugs = row;
    },
    // 保存操作
    orderSave() { // 保存按钮触发事件
      this.totalForm.status = 0;            // 保存
      this.loading = true;
      let goCreate = false;
      for (let i = 0; i < this.totalForm.deliveryPurchaseDrugsItemFormList.length; i += 1) {
        if (Number(this.totalForm.deliveryPurchaseDrugsItemFormList[i].protocolPrice) === 0) {
          this.$message.error('所选药品单价不可为0');
          goCreate = false;
        }
      }
      if (this.totalForm.deliveryPurchaseDrugsItemFormList.length <= 0) {
        this.$message.error('请新增明细');
        goCreate = false;
      } else {
        goCreate = true;
      }
      if (this.$route.query.type === 'create') {
        this.toCreate();
      } else if (this.$route.query.type === 'edit') {
        this.toSubmit();
      }
    },
    // 新增请求 -- create  //  保存或者提交  --  保存 status === 0   提交 status === 1
    toCreate() {
      DeliverypurchaseList.create(this.totalForm).then((res) => {
        if (res.data.code === 0) {
          // console.log();
          this.$message({
            type: 'success',
            message: '保存成功',
          });
          this.loading = false;
          history.back();
        }
      });
    },
    // 提交
    submit() {
      // console.log();
      // console.log();
      this.totalForm.status = 1;    // 提交
      this.loading = true;
      let goCreate = false;
      for (let i = 0; i < this.totalForm.deliveryPurchaseDrugsItemFormList.length; i += 1) {
        if (Number(this.totalForm.deliveryPurchaseDrugsItemFormList[i].protocolPrice) === 0) {
          this.$message.error('所选药品单价不可为0');
          goCreate = false;
        }
      }
      if (this.totalForm.deliveryPurchaseDrugsItemFormList.length <= 0) {
        this.$message.error('请新增明细');
        goCreate = false;
      } else {
        goCreate = true;
      }
      if (this.$route.query.type === 'create') {
        this.toCreate();
      } else if (this.$route.query.type === 'edit') {
        this.toSubmit();
      }
    },
    // 编辑请求 -- update  //  保存或者提交  --  保存 status === 0   提交 status === 1
    toSubmit() {
      DeliverypurchaseList.update(this.totalForm).then((res) => {
        if (res.data.code === 0) {
          // console.log();
          this.$message({
            type: 'success',
            message: '保存成功',
          });
          this.loading = false;
          history.back();
        }
      });
    },
    // 删除单
    orderDelete() { // 删除按钮触发事件
      const arrId = [];
      arrId.push(this.$route.query.id);  // 将获取的id值转化为数组类型
      DeliverypurchaseList.deleteP(arrId).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          // console.log();
          // console.log();
          this.$message({
            type: 'success',
            message: '删除成功',
          });
          history.back();
        }
      });
    },
    // 返回上一页
    orderBack() { // 返回按钮触发事件
      history.back();
    },
    //  计算表格高度
    tableHeightRun() {
      const tableHeightFun = () => {
        this.tableHeight = window.tableCustom.tableHeight(['#from-item', '.TradeFooter', 200]);
      };
      setTimeout(tableHeightFun, 0);
    },
    //  弹出框选择之后确定事件  -- 地址
    dialogSelectAddress(rows, msgBase, msgCom) {
      // console.log();
      if (rows[0]) {
        this.btnDisabled.planSave = false;
        this.btnDisabled.planSubmit = false;
        this.totalForm.receiveAddress = rows[0].addressFull;      // 医疗机构名称
      } else {
        this.btnDisabled.planSave = true;
        this.btnDisabled.planSubmit = true;
        this.totalForm.receiveAddress = null;      // 医疗机构名称
      }
    },
    //  弹出框选择之后确定事件  -- 药品
    dialogSelectDrugs(rows, msgBase, msgCom) {
      // console.log();
      if (rows[0]) {
        this.totalForm.salerMemberCode = rows[0].salerMemberCode;                      // 卖方会员编码
        this.totalForm.salerMemberId = rows[0].salerMemberId;                          // 卖方会员ID
        this.totalForm.salerMemberName = rows[0].salerMemberName;                      // 卖方会员名称
        for (let i = 0; i < rows.length; i += 1) {
          if (this.$route.query.type === 'create') {
            this.totalForm.deliveryPurchaseDrugsItemFormList.push({
              approvalNumber: rows[i].approvalNumber,
              drugsCode: rows[i].drugsCode,
              drugsId: rows[i].id,
              drugsName: rows[i].drugsName,
              drugsNo: rows[i].drugsNo,
              formName: rows[i].formName,
              id: null,
              packSpecName: rows[i].packSpecName,
              producerCode: rows[i].producerCode,
              producerId: rows[i].producerId,
              producerName: rows[i].producerName,
              protocolPrice: rows[i].protocolPrice,
              purchaseAmount: 0,
              purchaseNum: null,
              specificationName: rows[i].specificationName,
              tradeName: rows[i].tradeName,
              unitName: rows[i].unitName,
            });
          } else {
            this.totalForm.deliveryPurchaseDrugsItemFormList.push({
              approvalNumber: rows[i].approvalNumber,
              drugsCode: rows[i].drugsCode,
              drugsId: rows[i].id,
              drugsName: rows[i].drugsName,
              drugsNo: rows[i].drugsNo,
              formName: rows[i].formName,
              id: rows[i].id,
              packSpecName: rows[i].packSpecName,
              producerCode: rows[i].producerCode,
              producerId: rows[i].producerId,
              producerName: rows[i].producerName,
              protocolPrice: rows[i].protocolPrice,
              purchaseAmount: 0,
              purchaseNum: null,
              specificationName: rows[i].specificationName,
              tradeName: rows[i].tradeName,
              unitName: rows[i].unitName,
              num: rows[i].num,           // 排序序号
            });
          }
        }
        // console.log();
      }
    },
    // 清空数据
    emptyData() {
      this.totalForm = {
        // top
        code: null,
        createBy: null,
        createTime: null,
        contacter: null,
        contactPhone: null,
        drugsArr: [],
        totalNum: 0,
        // .. 需要提交的数据
        amount: 0,                                                             // 金额
        deliveryMemberCode: null,                                                 // 配送企业会员编码
        deliveryMemberId: null,                                                   // 配送企业会员Id
        deliveryMemberName: null,                                                 // 配送企业会员名称
        deliveryPerson: null,                                                     // 配送联系人
        deliveryPhone: null,                                                      // 配送联系电话
        deliveryPurchaseDrugsItemFormList: [],                                    // 药品列表
        gpoMemberId: null,                                                        // GPOID
        gpoMemberName: null,                                                      // GPO名称
        id: null,                                                                 // Id
        projectId: null,                                                          // 集采项目ID
        receiveAddress: null,                                                     // 收货地址
        remarks: null,                                                            // 备注
        salerMemberCode: null,                                                    // 卖方会员编码
        salerMemberId: null,                                                      // 卖方会员ID
        salerMemberName: null,                                                    // 卖方会员名称
        status: null,                                                             // 状态
      };
    },
  },
  // 离开编辑页的提示
  //    beforeRouteLeave(to, from, next) {
  //      // 导航离开该组件的对应路由时调用
  //      // 可以访问组件实例 `this`
  //      this.$confirm('编辑页内容未保存，离开将消失, 是否继续?', '提示', {
  //        confirmButtonText: '确定',
  //        cancelButtonText: '取消',
  //        type: 'warning',
  //      }).then(() => {
  //        next();
  //      }).catch(() => {
  //      });
  //    },
};
</script>
