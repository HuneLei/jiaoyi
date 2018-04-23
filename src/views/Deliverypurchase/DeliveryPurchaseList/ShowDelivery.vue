<template>
  <div>
    <div v-loading="loading">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="采购单详情" name="first">
          <el-form :rules="editMessage.rules" label-width="120px" id="from-item">
            <TradeEditsFormI :from-edit="totalForm" ref="changeBtnStatus" :isCreatShow="middleBtnShow.isCreatShow" :isDeleteItem="middleBtnShow.isDeleteItem" :tradeEditBtn="tradeEditBtn" :message="editMessage" :isGoBackShow="false" :isExportShow="middleBtnShow.isExportShow" :isImportShow="middleBtnShow.isImportShow" :arrow-num=2 :arrow-down="true" @show-more="tableHeightRun">
              <el-form-item label="创建人" prop="createAll" slot='createAll'>
                <el-input v-model="totalForm.createAll" readonly disabled size="small" style="width: 100%; min-width: 120px;"></el-input>
              </el-form-item>
              <el-form-item label="联系人" prop="deliveryAll" slot='deliveryAll'>
                <el-input v-model="totalForm.deliveryAll" readonly disabled size="small" style="width: 100%; min-width: 120px;"></el-input>
              </el-form-item>
              <el-form-item label="联系人" prop="gpoAll" slot='gpoAll'>
                <el-input v-model="totalForm.gpoAll" readonly disabled size="small" style="width: 100%; min-width: 120px;"></el-input>
              </el-form-item>
              <el-form-item label="收货地址" prop="receiveAddress" slot='receiveAddress' style="width: 100%">
                <el-input v-model="totalForm.receiveAddress" readonly disabled size="small"></el-input>
              </el-form-item>
            </TradeEditsFormI>
          </el-form>
          <div>
            <el-table :data="totalForm.deliveryPurchaseDrugsItemFormList" stripe border fit :height="tableHeight">
              <el-table-column prop="num" align="left" fixed="left" label="#" width="40">
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
              <el-table-column prop="middlePack" min-width="70" label="中包装" sortable show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="bigPack" min-width="70" label="大包装" sortable show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="removeFactor" min-width="70" label="拆零系数" sortable show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="protocolPrice" min-width="70" label="单价" align="right" sortable show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="purchaseNum" min-width="70" label="数量" align="right" sortable show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="purchaseAmount" min-width="70" label="金额" align="right" sortable show-overflow-tooltip>
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
                <span>总数量：</span>{{totalForm.totalNum}}</div>
              <div style="float: left;">
                <span>总金额：</span>{{totalForm.amount}}
                <span>元</span>
              </div>
            </div>
            <TradeFooterI class="trade"  :authbtn="authbtn" :btnDisabled="btnDisabled" :isSaveShow="isSaveShow" :isDeleteShow="isDeleteShow" :isSubmitShow="isSubmitShow" :isBackShow="isBackShow" @order-back="orderBack"></TradeFooterI>
          </div>
        </el-tab-pane>
        <el-tab-pane label="发货信息" name="second">
          <div v-if="tableData && tableData.length > 0" v-loading="logloading">
            <div>
              <div class="delivery-log1">GPO名称：
                <span style="font-size: 13px;font-weight: 600">{{gpoName}}</span>
              </div>
              <div class="delivery-log1">出库单号：
                <span style="font-size: 13px;font-weight: 600">{{stockOutCode}}</span>
              </div>
            </div>
            <el-table :data="tableData"  :height="tableData.length*40+30" stripe border fit @sort-change="sortChange">
              <el-table-column prop="drugsCode" min-width="90" height="20px" label="药品编码" sortable show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="drugsName" min-width="120" height="20px" label="通用名" sortable show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="specName" min-width="90" height="20px" label="规格" sortable show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="packSpecName" min-width="90" height="20px" label="包装规格" sortable show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="formName" min-width="90" height="20px" label="剂型" sortable show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="unitName" min-width="60" height="20px" label="单位" sortable show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="batchNo" min-width="80" height="20px" label="批号" sortable show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="unitPrice" min-width="70" label="单价" align="right" sortable="custom" show-overflow-tooltip>
                <template scope="scope">
                  <p>{{scope.row.unitPrice.toFixed(2)}}</p>
                </template>
              </el-table-column>
              <el-table-column prop="stockoutNum" align="right" min-width="80" height="20px" label="发货数量" sortable show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="amount" min-width="80" label="金额" align="right" sortable="custom" show-overflow-tooltip>
                <template scope="scope">
                  <p>{{scope.row.amount.toFixed(2)}}</p>
                </template>
              </el-table-column>
              <el-table-column prop="approvalNumber" min-width="130" height="20px" label="批准文号" sortable show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="producerName" min-width="180" height="20px" label="生产企业" sortable show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="salerMemberName" min-width="180" height="20px" label="卖方会员" sortable show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="tradeName" min-width="80" height="20px" label="商品名" sortable show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
/**
 * Created by lqy on 2017/9/19.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import TradeEditsFormI from '../../../components/TradeEditsFormI'; //  引订单目录表单
import TradeFooterI from '../../../components/TradeFooterI'; // 引入订单底部
import common from '../../../api/common';   // api -- project[集采项目]
import DeliverypurchaseList from '../../../api/Deliverypurchase/DeliverypurchaseList';   // 配送单列表接口
import convert from '../../../utils/convert';

export default {
  activated() {
    if (!this.status) {
      this.$router.push({ path: '/Deliverypurchase/DeliveryPurchaseList' });
    }
    this.init();
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Deliverypurchase',
        name: '配送企业采购管理',
        noLink: true,
      },
      {
        path: '/Deliverypurchase/DeliveryPurchaseList',
        name: '采购单列表',
        noLink: true,
      },
      {
        path: '/Deliverypurchase/DeliveryPurchaseList/ShowDelivery',
        name: '配送企业采购单查看',
        noLink: true,
      },
    ]);
  },
  watch: {
    getGpoId() {
      // 当切换gpo时，重定向到列表页
      this.$router.push({ path: '/Deliverypurchase/DeliveryPurchaseList' });
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
    'status',
  ]),
  components: {
    TradeEditsFormI,
    TradeFooterI,
  },
  data() {
    return {
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
      isDeleteShow: false, // 删除按钮
      isSubmitShow: true,  // 提交按钮
      num: 4, // 总数量
      // 表头获取
      topbarForm: {
        id: null,
        projectId: null,
        gpoMemberId: null,
        memberId: null,
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
          { label: '集采项目名称', key: 'projectId', type: 'el-input', isReadonly: true, span: 5 },
          { label: '采购单编号', key: 'code', type: 'el-input', isReadonly: true, span: 5 },
          { label: '采购单金额', key: 'amount1', type: 'el-input', isReadonly: true, span: 5 },
          { value: 'createAll', type: 'custom', span: 5 },
          { label: '配送企业', key: 'deliveryMemberName', type: 'el-input', isReadonly: true, span: 5 },
          { value: 'deliveryAll', type: 'custom', span: 5 },
          { label: 'GPO名称', key: 'gpoMemberName', type: 'el-input', isReadonly: true, span: 5 },
          { value: 'gpoAll', type: 'custom', span: 5 },
          { value: 'receiveAddress', type: 'custom', span: 10 },
          { label: '备注', key: 'remarks', type: 'el-input', fromType: 'textarea', isReadonly: true, span: 10, rows: 1, placeholder: '' },
        ],
        styleObject: {
          style1: {
            width: '180px',
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
        amount1: 0,                                                             // 金额
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
        createAll: null,
        deliveryAll: null,
        gpoAll: null,
      },
      logloading: false,
      activeName: 'first',      // 页头的默认选项
      tableData: [],    // 发货信息日志
      tableDataOld: [],    // 发货信息日志
      gpoName: '',  // 日志GPO名称
      stockOutCode: '',  // 采购单号
    };
  },
  methods: {
    // 初始化
    init() {
      this.activeName = 'first';
      // 初始化清空数据
      this.emptyData();
      // 获取已选药品列表
      this.getSelectedDrugs();
      // 获取表头信息
      if (this.getGpoId) {
        this.getTopbarItem();
      }
      this.loading = true;
      this.middleBtnShow = {
        isCreatShow: false,
        isDeleteItem: false,
        isExportShow: false,
        isImportShow: false,
      };
      this.isSaveShow = false;   // 保存按钮
      this.isBackShow = true;   // 返回按钮
      this.isDeleteShow = false; // 删除按钮
      this.isSubmitShow = false;  // 提交按钮
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
    // 获取头部信息
    getTopbarItem() {
      this.topbarForm.id = this.$route.query.id;                // 采购单ID
      this.topbarForm.gpoMemberId = this.getGpoId;              // gpoID
      this.topbarForm.projectId = this.$route.query.pid;        // 集采项目ID
      this.topbarForm.memberId = this.View_UserInfo.memberId;   // 当前会员ID
      DeliverypurchaseList.listItem(this.topbarForm).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          let createBy = null;
          let createTime = null;
          let deliveryPerson = null;
          let deliveryPhone = null;
          let contacter = null;
          let contactPhone = null;
          if (data[0]) {
            if (data[0].createBy === null || data[0].createBy === 'null') {
              createBy = '';
            } else {
              createBy = data[0].createBy;
            }
            if (data[0].createTime === null || data[0].createTime === 'null') {
              createTime = '';
            } else {
              createTime = data[0].createTime;
            }
            if (data[0].deliveryPerson === null || data[0].deliveryPerson === 'null') {
              deliveryPerson = '';
            } else {
              deliveryPerson = data[0].deliveryPerson;
            }
            if (data[0].deliveryPhone === null || data[0].deliveryPhone === 'null') {
              deliveryPhone = '';
            } else {
              deliveryPhone = data[0].deliveryPhone;
            }
            if (data[0].contacter === null || data[0].contacter === 'null') {
              contacter = '';
            } else {
              contacter = data[0].contacter;
            }
            if (data[0].contactPhone === null || data[0].contactPhone === 'null') {
              contactPhone = '';
            } else {
              contactPhone = data[0].contactPhone;
            }
            this.totalForm.createAll = `${createBy} ${createTime}`;
            this.totalForm.deliveryAll = `${deliveryPerson} ${deliveryPhone}`;
            this.totalForm.gpoAll = `${contacter} ${contactPhone}`;
            this.totalForm.deliveryMemberCode = data[0].deliveryMemberCode;
            this.totalForm.deliveryMemberId = data[0].deliveryMemberId;
            this.totalForm.deliveryMemberName = data[0].deliveryMemberName;
            this.totalForm.id = data[0].deliveryMemberName;
            this.totalForm.projectId = data[0].projectName;
            this.totalForm.code = data[0].code;
            this.totalForm.createBy = data[0].createBy;
            this.totalForm.createTime = data[0].createTime;
            this.totalForm.deliveryPerson = data[0].deliveryPerson;
            this.totalForm.deliveryPhone = data[0].deliveryPhone;
            this.totalForm.gpoMemberName = data[0].gpoMemberName;
            this.totalForm.contacter = data[0].contacter;
            this.totalForm.contactPhone = data[0].contactPhone;
            this.totalForm.remarks = data[0].remarks;
            this.totalForm.receiveAddress = data[0].receiveAddress;
          }
        }
      });
    },
    // 标签页切换时触发事件
    handleClick() {
      if (this.activeName === 'second') {
        this.logloading = true;
        this.tableData = [];
        this.gpoName = '';
        this.stockOutCode = '';
        DeliverypurchaseList.deliveryLog(this.$route.query.id)
          .then((res) => {
            if (res.data.code === 0) {
              const data = res.data.result;
              this.gpoName = data.gpoName;
              this.stockOutCode = data.stockOutCode;
              this.tableData = data.sendItemOutputList;
              this.tableDataOld = data.sendItemOutputList;
              if (this.tableData && this.tableData.length > 0) {
                for (let i = 0; i < this.tableData.length; i += 1) {
                  this.tableData[i].amount = Number(this.tableData[i].amount);
                  this.tableData[i].unitPrice = Number(this.tableData[i].unitPrice);
                }
              }
            }
            this.logloading = false;
          });
      }
    },
    // 获取已选药品列表
    getSelectedDrugs() {
      const obj = {
        purchaseId: Number(this.$route.query.id),
        gpoMemberId: this.getGpoId,
      };
      DeliverypurchaseList.drugsList(obj).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          this.totalForm.deliveryPurchaseDrugsItemFormList = data;
          for (let i = 0; i < data.length; i += 1) {
            this.totalForm.amount +=
              Number(data[i].purchaseAmount);
            this.totalForm.totalNum += data[i].purchaseNum;
            this.totalForm.deliveryPurchaseDrugsItemFormList[i].num = i + 1;
          }
          this.totalForm.amount = this.totalForm.amount.toFixed(2);
          this.totalForm.amount1 = `${this.totalForm.amount}元`;
          this.loading = false;
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
        this.tableHeight = window.tableCustom.tableHeight(['#from-item', '.TradeFooter', 250]);
      };
      setTimeout(tableHeightFun, 0);
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
        createAll: null,
        deliveryAll: null,
        gpoAll: null,
      };
    },
  },
};
</script>
<style>
.trade {
  position: relative !important;
}

.address-style {
  margin-bottom: 22px !important;
}

.delivery-log1 {
  font-size: 14px;
  color: #232121;
  float: left;
  margin-right: 50px;
  margin-left: 10px;
  margin-bottom: 5px;
  font-weight: 500;
}

.delivery-log2 {
  font-size: 14px;
  color: #232121;
  float: left;
  font-weight: 500;
  margin-bottom: 5px;
  display: -webkit-box;
  display: -ms-flexbox;
}
</style>
