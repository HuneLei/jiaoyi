<template>
  <div>
    <Percent v-show="isupload" :percentage="percentage"></Percent>
    <div v-loading="loading">
      <el-form :rules="editMessage.rules" label-width="120px" id="from-item">
        <TradeEditsFormI :authbtn="authbtn" :from-edit="totalForm" ref="changeBtnStatus" :isCreatShow="middleBtnShow.isCreatShow" :isDeleteItem="middleBtnShow.isDeleteItem" :tradeEditBtn="tradeEditBtn" :message="editMessage" :isGoBackShow="false" :isExportShow="middleBtnShow.isExportShow" :isImportShow="middleBtnShow.isImportShow" :arrow-num=4 :arrow-down="true" @data-creat="dataCreat" @data-export="dataExport" @data-import="dataImport" @delete-item="deleteItem" @show-more="tableHeightRun">
          <el-form-item label="联系人" prop="gpoContacter" slot='gpoContacter'>
            <el-input v-model="totalForm.gpoContacter" readonly disabled size="small" style="width: 100%; min-width: 120px;"></el-input>
          </el-form-item>
          <el-form-item label="集采项目" prop="projectId" slot='projectId'>
            <el-select v-model="totalForm.projectId" placeholder="请选择" size="small" style="width: 100%; min-width: 120px;">
              <el-option v-for="item in editMessage.options.projectOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择卖方会员" prop="salerMemberId" slot='salerMemberId'>
            <el-select v-model="totalForm.salerMemberId" filterable placeholder="" size="small" :disabled="salerMemberShow" style="width: 100%; min-width: 120px;">
              <el-option v-for="item in editMessage.options.salerOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收货地址" prop="receiveAddressId" slot='receiveAddressId'>
            <el-select v-model="totalForm.receiveAddressId" placeholder="请选择" size="small" @change="changeAddress" style="width: 100%">
              <el-option v-for="item in editMessage.options.addressOption" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!--<div slot="address" style="line-height: 31px; margin-left: 10px;">-->
          <!--<el-button size="mini" type="primary" style="line-height: 20px;" @click="addAdress" v-if="View_UserInfo.memberType !== 3 && View_UserInfo.memberType !== 5"-->
          <!--v-show="authbtn1.create">-->
          <!--<i style="font-size: 13px" class="icon iconfont icon-xinzeng"></i>-->
          <!--新增地址-->
          <!--</el-button>-->
          <!--</div>-->
        </TradeEditsFormI>
      </el-form>
      <div>
        <el-table :data="totalForm.gpoPurchaseDrugsItemFormList" @selection-change="dataSelect" stripe border fit :height="tableHeight">
          <el-table-column type="selection" width="40" fixed="left" align="center">
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
          <el-table-column prop="gpoPrice" min-width="100" label="单价" sortable show-overflow-tooltip>
            <template scope="scope">
              <el-input class="input-right close-clear" style="width: 98%" slot="reference" size="small" placeholder="请输入单价" @blur="blurPrice(scope)" @change="priceChange(scope)" v-model="scope.row.gpoPrice">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="purchaseNum" min-width="80" label="数量" sortable show-overflow-tooltip>
            <template scope="scope">
              <el-input class="input-right close-clear" style="width: 98%" slot="reference" size="small" placeholder="请输入内容" @focus="creatFocus(scope.row.purchaseNum)" @keyup.native="keydown(scope)" @blur="keydown(scope)" v-model="scope.row.purchaseNum">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="purchaseAmount" min-width="100" align="right" label="金额" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="producerName" min-width="90" label="生产企业" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="salerMemberName" min-width="90" label="卖方会员" sortable show-overflow-tooltip>
            <template>
              {{totalForm.salerMemberName}}
            </template>
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
      </div>
    </div>
    <TradeFooterI :authbtn="authbtn" :btnDisabled="btnDisabled" :isSaveShow="isSaveShow" :isDeleteShow="isDeleteShow" :isSubmitShow="isSubmitShow" :isBackShow="isBackShow" @data-submit="submit" @order-save="orderSave" @order-back="orderBack"></TradeFooterI>
    <EditDialog :options="dialogOptions" @dialog-hide="dialogHide" @dialogSelect="dialogSelectDrugs"></EditDialog>
    <DialogForm :dialog-form-visible="dialogFormShow" @close-dialog="CloseDialog" @dialog-cancel="dialogCancel" :message="AddressMessage" :from-dialog="form" :isReadonly="false" :isSaveShow="true" :saveLoading="false" :isFormConfirm="isFormConfirm" @data-save="dataSave">
      <el-form-item label="省" prop="provinceId" slot='provinceId' label-width="115px">
        <el-select v-model="form.provinceId" placeholder="请选择省" @change="changeProvince">
          <el-option v-for="item in provinceOptions" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="市" prop="cityId" slot='cityId' label-width="115px">
        <el-select v-model="form.cityId" placeholder="请选择市" @change="changeCity">
          <el-option v-for="item in cityOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="区" prop="countyId" slot='countyId' label-width="115px">
        <el-select v-model="form.countyId" placeholder="请选择区" @change="changecounty">
          <el-option v-for="item in countyOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </DialogForm>
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
import GpoPurchaseList from '../../../api/Gpopurchase/GpoPurchaseList';   // 配送单列表接口
import DialogForm from '../../../components/DialogForm';                //  地址
import common from '../../../api/common';                   //  引入公用API
import Address from '../../../api/BasicInfo/Address';                   //  引入地址管理api
import district from '../../../api/district';                           //  省市区接口

export default {
  activated() {
    this.authbtn = GpoPurchaseList.authbtn();
    this.authbtn1 = Address.authbtn();
    this.editStatus = 0;
    if (!this.status) {
      this.$router.push({ path: '/Gpopurchase/GpoPurchaseList' });
    }
    this.init();
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Gpopurchase',
        name: 'GPO采购管理',
        noLink: true,
      },
      {
        path: '/Gpopurchase/GpoPurchaseList',
        name: 'GPO采购单列表',
        noLink: true,
      },
      {
        path: '/Gpopurchase/GpoPurchaseList/CreateGPO',
        name: 'GPO采购单创建',
        noLink: true,
      },
    ]);
  },
  watch: {
    authList() {
      this.authbtn = GpoPurchaseList.authbtn();
      this.authbtn1 = Address.authbtn();
    },
    getGpoId() {
      // 当切换gpo时，重定向到列表页
      this.$router.push({ path: '/Gpopurchase/GpoPurchaseList' });
    },
    projectIdSub(val, oldVal) {
      this.changeProject(val, oldVal);
    },
    salerMemberIdSub(val, oldVal) {
      this.changeSalerMemberId(val, oldVal);
    },
    deep: true,
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  computed: {
    ...mapGetters([
      'getGpoId',
      'gpoOptions',
      'View_UserInfo',
      'projectOptions',
      'status',
    ]),
    projectIdSub() {
      return this.totalForm.projectId;
    },
    salerMemberIdSub() {
      return this.totalForm.salerMemberId;
    },
    authList() {
      return this.$store.state.view.authList;
    },
  },
  components: {
    EditDialog,
    TradeEditsFormI,
    TradeFooterI,
    DialogForm,
  },
  data() {
    // 不能为空的验证
    const verifyNull = (rule, value, callback) => {
      this.$data.AddressMessage.rules.provinceId[0].trigger = 'blur,change';
      this.$data.AddressMessage.rules.cityId[0].trigger = 'blur,change';
      this.$data.AddressMessage.rules.countyId[0].trigger = 'blur,change';
      let error = '';
      if (!value) {
        error = callback(new Error('不能为空'));
      } else {
        error = callback();
      }
      return error;
    };
    return {
      authbtn: {},              //  识别用户拥有的权限
      authbtn1: {},              //  识别用户拥有的权限
      changInfo: 0,
      changInfoSaler: 0,
      editStatus: 0,
      nowNum: null,
      // 地址弹窗
      editType: '',               // 弹出窗新增编辑判断 0:新增  1:编辑
      editLoading: false,         // 加载
      provinceOptions: [],        // 省
      cityOptions: [],            // 市
      countyOptions: [],          // 区
      isFormConfirm: false,       // 确定按钮显示控制
      formConfirmLoading: false,  // 确定按钮loading显示控制
      saveLoading: false,         // 保存按钮loading显示控制
      submitLoading: false,       // 提交按钮loading显示控制
      // 需要提交的字段
      form: {
        id: '',                         // 地址ID
        addressName: '',                // 地址名称，不为空
        provinceId: null,               // 省，不为空
        provinceName: null,             // 省名，不为空
        cityId: null,                   // 市，不为空
        cityName: null,                 // 市，不为空
        countyId: null,                 // 县，不为空
        countyName: null,               // 县，不为空
        zipCode: null,                  // 邮政编码
        addressFull: '',                // 详细地址，不为空
        contacter: '',                  // 联系人，不为空
        contacterPhone: '',       // 联系人电话，不为空
      },
      dialogFormShow: false,      // 弹出框显示隐藏控制
      AddressMessage: {
        // 写入表单组件的数据
        selects: [
          { label: '地址名称', key: 'addressName', type: 'el-input', placeholder: '请输入地址名称' },
          { value: 'provinceId', type: 'custom' },
          { value: 'cityId', type: 'custom' },
          { value: 'countyId', type: 'custom' },
          { label: '邮政编码', key: 'zipCode', type: 'el-input', placeholder: '请输入邮政编码' },
          { label: '详细地址', key: 'addressFull', type: 'el-input', placeholder: '请输入详细地址' },
          { label: '联系人', key: 'contacter', type: 'el-input', placeholder: '请输入联系人' },
          { label: '联系电话', key: 'contacterPhone', type: 'el-input', placeholder: '请输入联系电话' },
        ],
        // 弹出框标题
        dialogTitle: '地址新增',
        options: {
          // 省下拉选项
          provinceOption: [],
          // 市下拉选项
          cityOption: [],
          // 区下拉选项
          areaOption: [],
        },
        // checkbox选项值
        checkbox: {},
        // radios选项值
        radios: {},
        // 验证规则
        rules: {
          addressName: [
            { required: true, message: '请输入地址名称', trigger: 'blur' },
          ],
          provinceId: [
            { required: true, type: 'number', message: '请选择省', trigger: 'blur', validator: verifyNull },
          ],
          cityId: [
            { required: true, type: 'number', message: '请选择市', trigger: 'blur' },
          ],
          countyId: [
            { required: true, type: 'number', message: '请选择区', trigger: 'blur' },
          ],
          zipCode: [
            { required: true, message: '请输入邮政编码', trigger: 'blur' },
          ],
          addressFull: [
            { required: true, message: '请输入详细地址', trigger: 'blur' },
          ],
          contacter: [
            { required: true, message: '请输入联系人', trigger: 'blur' },
          ],
          contacterPhone: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
          ],
        },
        styleObject: {},
      },
      // 中间的按钮显示隐藏
      middleBtnShow: {
        isCreatShow: true,
        isDeleteItem: true,
        isExportShow: true,
        isImportShow: true,
      },
      // 会员disabled
      salerMemberShow: true,
      // 所有会员下拉
      allSalerMemberList: [],
      tableHeight: 280,
      // 底部按钮显示隐藏
      isSaveShow: true, // 保存按钮
      isBackShow: true, // 返回按钮
      isDeleteShow: false, // 删除按钮
      isSubmitShow: true,  // 提交按钮
      num: 4, // 总数量
      // 新增明细传值 [药品]
      dialogOptions: {
        msgBase: '', //  没什么卵用，有需要可以看看
        isShowDialog: false, //  显示弹框
        tableSelected: null, //  默认表格选中
        tableType: 1, //  0 单选，1 多选 默认单选
        dialogForm: {
          drugsId: 0,
          projectId: null,
          gpoMemberId: null,
          salerMemberId: null,
        },
      },
      // 表头获取
      topbarForm: {
        id: null,
        gpoMemberId: null,
        salerMemberId: null,
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
      // 上部分表单字段
      editMessage: {
        tabTitle: '',
        selects: [
          { label: 'GPO采购单编号', key: 'code', type: 'el-input', isReadonly: true, span: 5 },
          { label: '创建时间', key: 'createTime', type: 'el-input', isReadonly: true, span: 5 },
          { label: 'GPO名称', key: 'gpoMemberName', type: 'el-input', isReadonly: true, span: 5 },
          { value: 'gpoContacter', type: 'custom', span: 5 },
          { value: 'projectId', type: 'custom', option: 'projectOptions', span: 5 },
          { value: 'salerMemberId', type: 'custom', option: 'salerOptions', span: 5 },
          { label: '备注', key: 'remarks', type: 'el-input', fromType: 'textarea', span: 5, rows: 1, placeholder: '请输入备注' },
          { value: 'receiveAddressId', type: 'custom', span: 10 },
          { value: 'address', type: 'custom' },
        ],
        styleObject: {
          style1: {
            width: '79%',
          },
          style2: {
            width: '98%',
          },
        },
        parameters: {},
        options: {
          salerOptions: [],
          addressOption: [],
          projectOptions: [],
        },
        radios: {},
        rules: {
          projectId: [
            { required: true, message: '请选择集采项目', trigger: 'blur' },
          ],
          salerMemberId: [
            { required: true, message: '请选择卖方会员', trigger: 'blur' },
          ],
        },
      },
      loading: false,
      // 需要提交的全部数据
      totalForm: {
        // top
        code: null,
        createTime: null,
        totalNum: 0,
        // .. 需要提交的数据
        amount: 0,                                                                // 金额
        gpoMemberId: null,                                                        // GPOID
        gpoMemberName: null,                                                      // GPO名称
        gpoPerson: null,                                                          // GPO名称
        gpoPhone: null,                                                           // GPO名称
        gpoPurchaseDrugsItemFormList: [],                                         // 药品列表
        id: null,                                                                 // Id
        projectId: null,                                                          // 集采项目ID
        receiveAddress: null,                                                     // 收货地址
        receiveAddressId: null,                                                     // 收货地址
        remarks: null,                                                            // 备注
        salerMemberCode: null,                                                    // 卖方会员编码
        salerMemberId: null,                                                      // 卖方会员ID
        salerMemberName: null,                                                    // 卖方会员名称
        status: null,                                                             // 状态
        gpoContacter: null,
      },
      // 勾选的列表项 [药品ID]
      selectedDrugs: [],
      percentage: 0,
      isupload: false,
    };
  },
  methods: {
    // 初始化
    init() {
      // this.salerMemberShow = true;
      this.loading = true;
      // 初始化清空数据
      this.emptyData();
      // 获取集采项目列表
      this.getProjectAll();
      // 获取地址列表
      this.getAddressList();
      // 获取表头信息
      if (this.getGpoId) {
        this.getTopbarItem();
      }
    },
    // 获取头部信息
    getTopbarItem() {
      this.topbarForm.id = null;
      this.topbarForm.gpoMemberId = this.getGpoId;
      this.topbarForm.salerMemberId = null;
      GpoPurchaseList.itemCreate(this.topbarForm).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          let gpoContacter = null;
          let gpoContacterPhone = null;
          if (data) {
            if (data.gpoContacter === null || data.gpoContacter === 'null') {
              gpoContacter = '';
            } else {
              gpoContacter = data.gpoContacter;
            }
            if (data.gpoContacterPhone === null || data.gpoContacterPhone === 'null') {
              gpoContacterPhone = '';
            } else {
              gpoContacterPhone = data.gpoContacterPhone;
            }
            this.totalForm.gpoMemberId = data.gpoMemberId;
            this.totalForm.gpoMemberName = data.gpoMemberName;
            this.totalForm.gpoPerson = data.gpoContacter;
            this.totalForm.gpoPhone = data.gpoContacterPhone;
            this.totalForm.gpoContacter = `${gpoContacter} ${gpoContacterPhone}`;      //  GPO
          }
          this.loading = false;
        }
      });
      this.loading = true;
    },
    // 获取集采项目下拉
    getProjectAll() {
      this.editMessage.options.projectOptions = this.projectOptions;    // 给项目集采名称options赋值
    },
    // 获取gpo数据
    getGpoData() {
      // gpoID赋值
      this.totalForm.gpoMemberId = this.getGpoId;
      for (let i = 0; i < this.gpoOptions.length; i += 1) {
        if (this.gpoOptions[i].id === this.getGpoId) {
          this.totalForm.gpoMemberName = this.gpoOptions[i].name;
        }
      }
    },
    // 改变集采项目名称
    changeProject(val, oldVal) {
      // console.log();
      if (val && oldVal && this.totalForm.gpoPurchaseDrugsItemFormList.length > 0) {
        // // console.log();
        // console.log();
        // // console.log();
        if (this.changInfo) {
          this.changInfo = 0;
          return;
        }
        // console.log();
        this.totalForm.projectId = oldVal;
        this.changInfo = 1;
        // 是否清空
        this.$confirm('此操作将清空明细，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          // 赋值
          this.totalForm.projectId = val;
          this.dialogOptions.dialogForm.projectId = this.totalForm.projectId;
          this.dialogOptions.dialogForm.drugsId = 0;
          // 清空数据
          this.totalForm.gpoPurchaseDrugsItemFormList = [];     // 已选药品列表
          // 获取卖方会员列表
          this.getSalerAll();
          this.changInfo = 1;
          // 清除
        }).catch(() => {
          // // console.log();
          this.changInfo = 0;
          // 不清除
          this.$message({
            type: 'info',
            message: '已取消操作',
          });
        });
      } else {
        // // console.log();
        this.dialogOptions.dialogForm.projectId = this.totalForm.projectId;
        this.dialogOptions.dialogForm.drugsId = 0;
        // 清空数据
        this.totalForm.gpoPurchaseDrugsItemFormList = [];     // 已选药品列表
        // 获取卖方会员列表
        this.getSalerAll();
      }
      if (val) {
        this.salerMemberShow = false;
      } else {
        this.salerMemberShow = true;
      }
      this.dialogOptions.dialogForm.gpoMemberId = this.getGpoId;
      // this.salerMemberShow = false;
      this.btnDisabled.planDelete = false;
    },
    // 获取卖方会员下拉
    getSalerAll() {
      this.allSalerMemberList = [];
      this.editMessage.options.salerOptions = [];
      common.salerListAll(this.totalForm.projectId).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          const arr = [];
          for (let i = 0; i < data.length; i += 1) {
            arr.push({
              label: data[i].memberName,
              value: data[i].id,
            });
          }
          this.editMessage.options.salerOptions = arr;
          this.allSalerMemberList = data;
          this.totalForm.salerMemberId = null;
        }
      });
    },
    // 改变卖方会员名称
    changeSalerMemberId(val, oldVal) {
      // console.log();
      // console.log();
      if (val && oldVal) {
        if (this.totalForm.gpoPurchaseDrugsItemFormList.length > 0) {
          // console.log();
          // console.log();
          if (this.changInfoSaler) {
            this.changInfoSaler = 0;
            return;
          }
          this.changInfoSaler += 1;
          this.totalForm.salerMemberId = oldVal;
          // 是否清空
          this.$confirm('此操作将清空明细，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            // 赋值
            this.totalForm.salerMemberId = val;
            this.dialogOptions.dialogForm.salerMemberId = this.totalForm.salerMemberId;
            this.dialogOptions.dialogForm.drugsId = 0;
            // 清空数据
            this.totalForm.gpoPurchaseDrugsItemFormList = [];     // 已选药品列表
            // 获取卖方会员列表
            this.changInfoSaler = 1;
            // 清除
          }).catch(() => {
            this.changInfoSaler = 0;
            // 不清除
            this.$message({
              type: 'info',
              message: '已取消操作',
            });
          });
        } else {
          // console.log();
          this.dialogOptions.dialogForm.drugsId = 0;
          this.totalForm.gpoPurchaseDrugsItemFormList = [];
          // 父组件触发子组件的改变按钮状态的事件
          this.tradeEditBtn = {
            createBtn: false,        // 新增
            deleteBtn: true,        // 删除
            exportBtn: false,        // 导出
            importBtn: false,        // 导入
          };
          this.btnDisabled.planDelete = false;
          this.dialogOptions.dialogForm.salerMemberId = this.totalForm.salerMemberId;
          for (let i = 0; i < this.allSalerMemberList.length; i += 1) {
            if (this.totalForm.salerMemberId === this.allSalerMemberList[i].id) {
              this.totalForm.salerMemberCode = this.allSalerMemberList[i].memberNo;   // 卖方会员编码
              this.totalForm.salerMemberName = this.allSalerMemberList[i].memberName;   // 卖方会员名称
            }
          }
        }
      } else if (val && !oldVal) {
        // console.log();
        this.dialogOptions.dialogForm.drugsId = 0;
        this.totalForm.gpoPurchaseDrugsItemFormList = [];
        // 父组件触发子组件的改变按钮状态的事件
        this.tradeEditBtn = {
          createBtn: false,        // 新增
          deleteBtn: true,        // 删除
          exportBtn: false,        // 导出
          importBtn: false,        // 导入
        };
        this.btnDisabled.planDelete = false;
        this.dialogOptions.dialogForm.salerMemberId = this.totalForm.salerMemberId;
        // 赋值，需要保存
        for (let i = 0; i < this.allSalerMemberList.length; i += 1) {
          if (this.totalForm.salerMemberId === this.allSalerMemberList[i].id) {
            this.totalForm.salerMemberCode = this.allSalerMemberList[i].memberNo;   // 卖方会员编码
            this.totalForm.salerMemberName = this.allSalerMemberList[i].memberName;   // 卖方会员名称
          }
        }
      } else if (!val && oldVal) {
        // console.log();
        this.tradeEditBtn = {
          createBtn: true,        // 新增
          deleteBtn: true,        // 删除
          exportBtn: true,        // 导出
          importBtn: true,        // 导入
        };
        this.btnDisabled.planDelete = false;
        this.dialogOptions.dialogForm.salerMemberId = null;
        // this.dialogOptions.dialogForm.gpoMemberId = null;
        this.totalForm.salerMemberCode = null;   // 卖方会员编码
        this.totalForm.salerMemberId = null;   // 卖方会员ids
        this.totalForm.salerMemberName = null;   // 卖方会员名称
      }
    },
    // 改变收货地址
    changeAddress() {
      if (this.totalForm.receiveAddressId) {
        this.btnDisabled = {
          planSave: false,
          planSubmit: false,
        };
      }
    },
    // 获取收货地址列表
    getAddressList() {
      common.addressListAll(this.View_UserInfo.memberId).then((res) => {
        const addressList = [];
        if (res.data.code === 0) {
          const datalist = res.data.result;
          for (let i = 0; i < datalist.length; i += 1) {
            const addressInfo = `[${datalist[i].addressName}]${datalist[i].provinceName}${datalist[i].cityName}${datalist[i].countyName} ${datalist[i].addressFull} ${datalist[i].contacter} ${datalist[i].contacterPhone}`;
            this.$set(addressList, i, {
              label: addressInfo,
              value: Number(datalist[i].id),
            });
          }
        }
        this.editMessage.options.addressOption = addressList;
        this.loading = false;
      });
    },
    addAdress(i) {  // 新增地址
      this.district();
      this.dialogFormShow = true;
      this.AddressMessage.rules.provinceId[0].trigger = 'blur';
      this.AddressMessage.rules.cityId[0].trigger = 'blur';
      this.AddressMessage.rules.countyId[0].trigger = 'blur';
      this.form = {
        addressName: '',                // 地址名称，不为空
        provinceId: null,               // 省，不为空
        provinceName: null,             // 省名，不为空
        cityId: null,                   // 市，不为空
        cityName: null,                 // 市，不为空
        countyId: null,                 // 县，不为空
        countyName: null,               // 县，不为空
        zipCode: null,                  // 邮政编码
        addressFull: '',                // 详细地址，不为空
        contacter: '',                  // 联系人，不为空
        contacterPhone: '',    // 联系人电话，不为空
      };
      // i === 1, xinzn
      if (i === 1) {
        this.editType = 0;  // 新增
        this.editMessage.dialogTitle = '地址新增';
        this.dialogFormShow = true;   // 打开弹出框
      }
    },
    // 获取省的选项，默认父ID位88888
    district() {
      district.cityList(88888).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          for (let i = 0; i < data.length; i += 1) {
            if (data[i].id === -1) {
              //              data[i].disabled = true;
              this.$set(data[i], 'disabled', true);
            }
          }
          this.provinceOptions = data;
          this.provinceOptions[0].disabled = true;
        }
      });
      this.$set(this.provinceOptions, 0, {
        disabled: true,
      });
    },
    // 点击保存后的触发事件
    dataSave(formName) {
      this.loading = true;
      Address.create(formName).then((res) => {
        if (res.data.code === 0) {
          this.$bus.$emit('data/list');
          this.$message({
            type: 'success',
            message: '地址新增成功',
          });
        }
        this.getAddressList();
        this.loading = false;
      });
    },
    // 点击取消后的触发事件
    dialogCancel(res) {
    },
    // 改变省
    changeProvince() {
      this.cityOptions = [];
      this.form.cityId = null;
      // 获取省name
      for (let i = 0; i < this.provinceOptions.length; i += 1) {
        if (this.provinceOptions[i].value === this.form.provinceId) {
          this.form.provinceName = this.provinceOptions[i].label;
        }
      }
      if (this.form.provinceId !== null) {
        this.getCity();
      }
    },
    // 获取市
    getCity() {
      // 获取市的选项
      district.cityList(this.form.provinceId).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          this.cityOptions = data;
        }
      });
    },
    // 改变市，获取区
    changeCity() {
      this.countyOptions = [];
      this.form.countyId = '';
      // 获取市name
      for (let i = 0; i < this.cityOptions.length; i += 1) {
        if (this.cityOptions[i].value === this.form.cityId) {
          this.form.cityName = this.cityOptions[i].label;
        }
      }
      // 在更换省份时，市与区会清空，但是会被动触发change事件报错。所以判断市的值是否为空，为空时，不提交区的请求。
      if (this.form.cityId !== null) {
        this.getcounty();
      }
    },
    // 获取区
    getcounty() {
      // 获取区的选项
      district.cityList(this.form.cityId).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          this.countyOptions = data;
        }
      });
    },
    // 选择区
    changecounty() {
      // 获取区name
      for (let i = 0; i < this.countyOptions.length; i += 1) {
        if (this.countyOptions[i].value === this.form.countyId) {
          this.form.countyName = this.countyOptions[i].label;
        }
      }
    },
    // 关闭窗口后的触发事件
    CloseDialog() {
      // 关闭保存Loading
      this.saveLoading = false;
      // 关闭弹出表单
      this.dialogFormShow = false;
    },
    // 添加明细
    dataCreat() {
      this.dialogOptions.isShowDialog = true;
    },
    dataExport() {
      // console.log();
      const form = {
        gpoMemberId: this.getGpoId,
        projectId: this.totalForm.projectId,
        salerMemberId: this.totalForm.salerMemberId,
      };
      // console.log();
      const url = GpoPurchaseList.output(form);
      window.open(url);
    },
    dataImport(e) {
      const file = e.target.files[0];
      console.log('file.type', file);
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel' || file.name.indexOf('.xls') > -1) {
        this.isupload = true;
        const formData = new FormData();
        formData.append('file', file);
        GpoPurchaseList.upload(formData, this.progress).then((res) => {
          const data = res.data.result;
          if (res.data.code === 0) {
            this.percentage = 100;
            setTimeout(() => {
              this.isupload = false;
              this.percentage = 0;
            }, 500);
            this.$message({
              type: 'success',
              message: res.data.message,
            });
            // 导入数据
            const arr = [];
            const arr2 = [];
            let amount = 0;
            let totalNum = 0;
            for (let i = 0; i < this.totalForm.gpoPurchaseDrugsItemFormList.length; i += 1) {
              arr2.push(this.totalForm.gpoPurchaseDrugsItemFormList[i].drugsId);
            }
            this.changInfo = 0;
            this.changInfoSaler = 0;
            for (let i = 0; i < data.length; i += 1) {
              if (Number(data[i].purchaseNum) > 0) {
                if (arr2.indexOf(Number(data[i].drugsId)) >= 0) {
                  for (let j = 0;
                    j < this.totalForm.gpoPurchaseDrugsItemFormList.length; j += 1) {
                    if (data[i].drugsId
                      === this.totalForm.gpoPurchaseDrugsItemFormList[j].drugsId) {
                      // 相同
                      this.totalForm.gpoPurchaseDrugsItemFormList[j].purchaseNum =
                        data[i].purchaseNum;    // 数量
                      this.totalForm.gpoPurchaseDrugsItemFormList[j].gpoPrice =
                        data[i].gpoPrice;       // 金额
                      this.totalForm.gpoPurchaseDrugsItemFormList[j].purchaseAmount =
                        (this.totalForm.gpoPurchaseDrugsItemFormList[j].purchaseNum *
                          this.totalForm.gpoPurchaseDrugsItemFormList[j].gpoPrice)
                          .toFixed(2);
                    }
                  }
                } else {
                  this.totalForm.gpoPurchaseDrugsItemFormList.push(data[i]);
                  arr.push(data[i].drugsId);
                }
              }
            }
            for (let i = 0; i < this.totalForm.gpoPurchaseDrugsItemFormList.length; i += 1) {
              amount += this.totalForm.gpoPurchaseDrugsItemFormList[i].gpoPrice *
                this.totalForm.gpoPurchaseDrugsItemFormList[i].purchaseNum;
              totalNum += Number(this.totalForm.gpoPurchaseDrugsItemFormList[i].purchaseNum);
            }
            this.totalForm.amount = amount.toFixed(2);
            this.totalForm.totalNum = totalNum;
            this.dialogOptions.dialogForm.drugsId =
              `${this.dialogOptions.dialogForm.drugsId},${JSON.stringify(arr).slice(1, JSON.stringify(arr).length - 1)}`;
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
    // 获取当前的数值
    creatFocus(data) {
      // console.log();
      this.nowNum = data;
    },
    // 键盘按钮触发方法
    keydown(data) {
      if ((data.row.purchaseNum.search(/\D/) !== -1 || Number(data.row.purchaseNum) === 0) && data.row.purchaseNum !== '') {
        // console.log();
        // console.log();
        this.totalForm.gpoPurchaseDrugsItemFormList[data.$index].purchaseNum = this.nowNum;
      } else {
        // console.log();
        this.totalForm.gpoPurchaseDrugsItemFormList[data.$index].purchaseAmount =
          (Number(data.row.purchaseNum) * Number(data.row.gpoPrice)).toFixed(2);
        let amount = 0;
        let totalNum = 0;
        for (let i = 0; i < this.totalForm.gpoPurchaseDrugsItemFormList.length; i += 1) {
          amount += (this.totalForm.gpoPurchaseDrugsItemFormList[i].purchaseNum *
            this.totalForm.gpoPurchaseDrugsItemFormList[i].gpoPrice);
          totalNum += Number(this.totalForm.gpoPurchaseDrugsItemFormList[i].purchaseNum);
        }
        this.totalForm.amount = amount.toFixed(2);
        this.totalForm.totalNum = totalNum;
        this.nowNum = data.row.purchaseNum;
      }
      return false;
    },
    // 改变药品单价
    priceChange(data) {  // 数量发生变化的时候触发
      this.totalForm.gpoPurchaseDrugsItemFormList[data.$index].purchaseAmount =
        (Number(data.row.purchaseNum) * Number(data.row.gpoPrice)).toFixed(2);
      let amount = 0;
      let totalNum = 0;
      for (let i = 0; i < this.totalForm.gpoPurchaseDrugsItemFormList.length; i += 1) {
        amount += (this.totalForm.gpoPurchaseDrugsItemFormList[i].purchaseNum *
          this.totalForm.gpoPurchaseDrugsItemFormList[i].gpoPrice);
        totalNum += Number(this.totalForm.gpoPurchaseDrugsItemFormList[i].purchaseNum);
      }
      this.totalForm.amount = amount.toFixed(2);
      this.totalForm.totalNum = totalNum;
    },
    blurPrice(data) {
      // console.log();
      this.totalForm.gpoPurchaseDrugsItemFormList[data.$index].gpoPrice =
        parseFloat(data.row.gpoPrice).toFixed(2);
    },
    // 删除明细操作
    deleteItem() {
      let amount = 0;
      let totalNum = 0;
      const arr = [];
      for (let i = 0; i < this.totalForm.gpoPurchaseDrugsItemFormList.length; i += 1) {
        for (let j = 0; j < this.selectedDrugs.length; j += 1) {
          if (this.totalForm.gpoPurchaseDrugsItemFormList[i].drugsId ===
            this.selectedDrugs[j]) {
            this.totalForm.gpoPurchaseDrugsItemFormList.splice(i, 1);
          }
        }
      }
      if (this.totalForm.gpoPurchaseDrugsItemFormList.length > 0) {
        for (let i = 0; i < this.totalForm.gpoPurchaseDrugsItemFormList.length; i += 1) {
          arr.push(this.totalForm.gpoPurchaseDrugsItemFormList[i].drugsId);
          amount += this.totalForm.gpoPurchaseDrugsItemFormList[i].gpoPrice *
            this.totalForm.gpoPurchaseDrugsItemFormList[i].purchaseNum;
          totalNum += Number(this.totalForm.gpoPurchaseDrugsItemFormList[i].purchaseNum);
        }
      } else {
        this.totalForm.amount = 0;
        this.totalForm.totalNum = 0;
      }
      this.totalForm.amount = amount.toFixed(2);
      this.totalForm.totalNum = totalNum;
      if (arr.length > 0) {
        this.dialogOptions.dialogForm.drugsId = JSON.stringify(arr).slice(1,
          JSON.stringify(arr).length - 1);
      } else {
        this.dialogOptions.dialogForm.drugsId = 0;
      }
    },
    // 关闭弹出框  -- 明细
    dialogHide() {
      this.dialogOptions.isShowDialog = false;
    },
    //  判断下部分表格是否有选项，删除明细按钮是否disabled。
    dataSelect(row) {
      this.selectedDrugs = [];
      let first = 0;
      for (let i = 0; i < row.length; i += 1) {
        const item = row[i];
        first += 1;
        this.selectedDrugs.push(row[i].drugsId);
      }
      if (first > 0) {
        this.tradeEditBtn.deleteBtn = false;
      } else {
        this.tradeEditBtn.deleteBtn = true;
      }
    },
    // 保存操作
    orderSave() {
      this.totalForm.status = 0;            // 保存
      this.toAjax();
    },
    // 提交
    submit() {
      this.totalForm.status = 1;    // 提交
      this.toAjax();
    },
    // 请求
    toAjax() {
      this.getReceiveAddressName();
      let goCreate = true;
      if (this.totalForm.gpoPurchaseDrugsItemFormList.length <= 0) {
        this.$message.error('请输入报量单明细');
        goCreate = false;
      } else {
        const int = /^[0-9]*[1-9][0-9]*$/;         // int
        const positive = /^\d+(?=\.{0,1}\d+$|$)/;  // 正数
        for (let i = 0; i < this.totalForm.gpoPurchaseDrugsItemFormList.length; i += 1) {
          if (!Number(this.totalForm.gpoPurchaseDrugsItemFormList[i].purchaseAmount)) {
            this.$message.error('药品单价必须大于0');
            goCreate = false;
          }
          console.log(3,
            parseFloat(this.totalForm.gpoPurchaseDrugsItemFormList[i].purchaseAmount) > 0);
          // 数量
          const purchaseNum = int.test(this.totalForm.gpoPurchaseDrugsItemFormList[i].purchaseNum);
          // 金额单价
          const purchaseAmount =
            positive.test(this.totalForm.gpoPurchaseDrugsItemFormList[i].purchaseAmount);
          if (!this.totalForm.gpoPurchaseDrugsItemFormList[i].purchaseAmount) {
            this.$message.error('请输入药品金额');
            goCreate = false;
          }
          if (!this.totalForm.gpoPurchaseDrugsItemFormList[i].purchaseNum) {
            this.$message.error('请输入药品数量');
            goCreate = false;
          }
          if (!purchaseAmount) {
            this.$message.error('药品金额格式有误，请重试');
            goCreate = false;
          }
          if (!purchaseNum) {
            this.$message.error('药品数量格式有误，请重试');
            goCreate = false;
          }
        }
      }
      if (goCreate) {
        this.loading = true;
        GpoPurchaseList.create(this.totalForm).then((res) => {
          if (res.data.code === 0) {
            // console.log();
            this.$message({
              type: 'success',
              message: '操作成功',
            });
            this.loading = false;
            history.back();
          }
        });
      }
    },
    // 获取地址名
    getReceiveAddressName() {
      // console.log();
      for (let i = 0; i < this.editMessage.options.addressOption.length; i += 1) {
        if (this.editMessage.options.addressOption[i].value === this.totalForm.receiveAddressId) {
          this.totalForm.receiveAddress = this.editMessage.options.addressOption[i].label;
        }
      }
    },
    // 返回上一页
    orderBack() { // 返回按钮触发事件
      if (this.editStatus) {
        this.$confirm('存在未保存的明细数据，确定返回吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          history.back();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          });
        });
      } else {
        history.back();
      }
    },
    //  计算表格高度
    tableHeightRun() {
      const tableHeightFun = () => {
        this.tableHeight = window.tableCustom.tableHeight(['#from-item', '.TradeFooter', 200]);
      };
      setTimeout(tableHeightFun, 0);
    },
    //  弹出框选择之后确定事件  -- 药品
    dialogSelectDrugs(rows, msgBase, msgCom) {
      this.changInfo = 0;
      this.changInfoSaler = 0;
      this.editStatus = 1;
      const arr = [];
      // console.log();
      if (rows[0]) {
        //          this.totalForm.salerMemberCode = rows[0].salerMemberCode;          // 卖方会员编码
        //          this.totalForm.salerMemberId = rows[0].salerMemberId;              // 卖方会员ID
        //          this.totalForm.salerMemberName = rows[0].salerMemberName;          // 卖方会员名称
        for (let i = 0; i < rows.length; i += 1) {
          this.totalForm.gpoPurchaseDrugsItemFormList.push({
            approvalNumber: rows[i].approvalNumber,
            drugsCode: rows[i].drugsCode,
            formName: rows[i].formName,
            drugsId: rows[i].id,
            drugsName: rows[i].drugsName,
            drugsNo: rows[i].drugsNo,
            gpoPrice: rows[i].gpoPrice,
            id: null,
            packSpecName: rows[i].packSpecName,
            producerCode: rows[i].producerCode,
            producerId: rows[i].producerId,
            producerName: rows[i].producerName,
            purchaseAmount: null,
            purchaseNum: null,
            specificationName: rows[i].specificationName,
            tradeName: rows[i].tradeName,
            unitName: rows[i].unitName,
          });
          arr.push(rows[i].id);
        }
        this.dialogOptions.dialogForm.drugsId =
          `${this.dialogOptions.dialogForm.drugsId},${JSON.stringify(arr).slice(1, JSON.stringify(arr).length - 1)}`;
        // console.log();
      }
    },
    // 清空数据
    emptyData() {
      this.editMessage.options.projectOptions = [];
      this.totalForm = {
        // top
        code: null,
        createTime: null,
        totalNum: 0,
        // .. 需要提交的数据
        amount: 0,                                                                // 金额
        gpoMemberId: null,                                                        // GPOID
        gpoMemberName: null,                                                      // GPO名称
        gpoPerson: null,                                                          // GPO名称
        gpoPhone: null,                                                           // GPO名称
        gpoPurchaseDrugsItemFormList: [],                                         // 药品列表
        id: null,                                                                 // Id
        projectId: null,
        receiveAddress: null,                                                     // 收货地址
        receiveAddressId: null,                                                     // 收货地址
        remarks: null,                                                            // 备注
        salerMemberCode: null,                                                    // 卖方会员编码
        salerMemberId: null,                                                      // 卖方会员ID
        salerMemberName: null,                                                    // 卖方会员名称
        status: null,                                                             // 状态
        gpoContacter: null,
      };
      this.dialogOptions.dialogForm.drugsId = 0;
      this.tradeEditBtn = {
        createBtn: true,        // 新增
        deleteBtn: true,        // 删除
        exportBtn: true,        // 导出
        importBtn: true,        // 导入
      };
      this.btnDisabled.planSave = true;
      this.btnDisabled.planSubmit = true;
    },
  },
};
</script>
