<template>
  <div>
    <Percent v-show="isupload" :percentage="percentage"></Percent>
    <div v-loading="loading">
      <el-form :rules="editMessage.rules" label-width="100px" id="from-item">
        <TradeEditsFormI :authbtn="authbtn" :from-edit="totalForm" ref="changeBtnStatus" :isCreatShow="middleBtnShow.isCreatShow" :isDeleteItem="middleBtnShow.isDeleteItem" :tradeEditBtn="tradeEditBtn" :message="editMessage" :isGoBackShow="false" :isExportShow="middleBtnShow.isExportShow" :isImportShow="middleBtnShow.isImportShow" :arrow-num=4 :arrow-down="true" @data-creat="dataCreat" @data-export="dataExport" @data-import="dataImport" @delete-item="deleteItem" @show-more="tableHeightRun">
          <el-form-item label="创建人" prop="createAll" slot='createAll'>
            <el-input v-model="totalForm.createAll" readonly disabled size="small" style="width: 100%; min-width: 120px;"></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="deliveryAll" slot='deliveryAll'>
            <el-input v-model="totalForm.deliveryAll" readonly disabled size="small" style="width: 100%; min-width: 120px;"></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="gpoAll" slot='gpoAll'>
            <el-input v-model="totalForm.gpoAll" readonly disabled size="small" style="width: 100%; min-width: 120px;"></el-input>
          </el-form-item>
          <el-form-item label="集采项目" prop="projectId" slot='projectId'>
            <el-select v-model="totalForm.projectId" placeholder="请选择" size="small" style="width: 100%; min-width: 120px;">
              <el-option v-for="item in editMessage.options.projectOptions" :key="item.value" :label="item.label" :value="item.value">
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
        <el-table :data="totalForm.deliveryPurchaseDrugsItemFormList" @selection-change="dataSelect" stripe border fit :height="tableHeight">
          <el-table-column type="selection" width="40" fixed="left" align="center">
          </el-table-column>
          <el-table-column prop="drugsCode" min-width="90" label="药品编码" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="drugsName" min-width="120" label="通用名" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="formName" min-width="70" label="剂型" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="specificationName" min-width="70" label="规格" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="packSpecName" min-width="70" label="包装规格" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="unitName" min-width="70" label="单位" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="middlePack" min-width="70" label="中包装" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="bigPack" min-width="70" label="大包装" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="removeFactor" min-width="70" label="拆零系数" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="protocolPrice" min-width="70" align="right" label="单价" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="purchaseNum" min-width="80" align="right" label="数量" sortable show-overflow-tooltip>
            <template scope="scope">
              <el-input class="input-right close-clear" style="width: 98%" slot="reference" size="small" placeholder="请输入内容" @focus="creatFocus(scope.row.purchaseNum)" @keyup.native="keydown(scope)" @blur="keydown(scope)" v-model="scope.row.purchaseNum">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="purchaseAmount" min-width="100" align="right" label="金额" sortable show-overflow-tooltip>
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
      <el-form-item class="address-style" label="省" prop="provinceId" slot='provinceId' label-width="115px">
        <el-select v-model="form.provinceId" placeholder="请选择省" @change="changeProvince">
          <el-option v-for="item in provinceOptions" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="address-style" label="市" prop="cityId" slot='cityId' label-width="115px">
        <el-select v-model="form.cityId" placeholder="请选择市" @change="changeCity">
          <el-option v-for="item in cityOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="address-style" label="区" prop="countyId" slot='countyId' label-width="115px">
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
import DialogForm from '../../../components/DialogForm';                //  地址
import district from '../../../api/district';                           //  省市区接口
import EditDialog from './EditDialog';                     // 引入明细弹出窗
import AdressDialog from './AdressDialog';                 // 引入收货地址弹出窗
import Project from '../../../api/BasicInfo/Project';   // api -- project[集采项目]
import common from '../../../api/common';                   //  引入公用API
import Address from '../../../api/BasicInfo/Address';                   //  引入地址管理api
import DeliverypurchaseList from '../../../api/Deliverypurchase/DeliverypurchaseList';   // 配送单列表接口

export default {
  activated() {
    this.authbtn = DeliverypurchaseList.authbtn();
    this.authbtn1 = Address.authbtn();
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
        path: '/Deliverypurchase/DeliveryPurchaseList/CreateDelivery',
        name: '采购单创建',
        noLink: true,
      },
    ]);
    this.$bus.$on('project/getAll', this.getProjectAll);
  },
  deactivated() {
    this.$bus.$off('project/getAll', this.getProjectAll);
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  computed: {
    authList() {
      return this.$store.state.view.authList;
    },
    ...mapGetters([
      'getGpoId',
      'gpoOptions',
      'View_UserInfo',
      'View_UserInfor',
      'projectOptions',
      'status',
    ]),
    projectIdSub() {
      return this.totalForm.projectId;
    },
    deliveryPurchaseDrugsItemFormListSub() {
      return this.totalForm.deliveryPurchaseDrugsItemFormList;
    },
  },
  watch: {
    authList() {
      this.authbtn = DeliverypurchaseList.authbtn();
      this.authbtn1 = Address.authbtn();
    },
    getGpoId() {
      // 当切换gpo时，重定向到列表页authbtn1
      this.$router.push({ path: '/Deliverypurchase/DeliveryPurchaseList' });
    },
    projectIdSub(val, oldVal) {
      this.changeProject(val, oldVal);
    },
    deliveryPurchaseDrugsItemFormListSub(val, oldVal) {
      if (val.length > 0) {
        this.editStatus = 1;
      } else {
        this.editStatus = 0;
      }
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
      editStatus: 0,
      changInfo: 0,
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
          { value: 'aaa', type: 'custom' },
          { label: '邮政编码', key: 'zipCode', type: 'el-input', placeholder: '请输入邮政编码' },
          { label: '详细地址', key: 'addressFull', type: 'el-input', placeholder: '请输入详细地址' },
          { label: '联系人', key: 'contacter', type: 'el-input', placeholder: '请输入联系人' },
          { label: '联系电话', key: 'contacterPhone', type: 'el-input', placeholder: '请输入联系电话' },
          { label: '外部地址编码', key: 'outAddressCode', type: 'el-input', placeholder: '请输入外部地址编码' },
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
          gpoMemberId: null,
          projectId: null,
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
      authbtn: {},
      authbtn1: {},
      // 上部分表单字段
      editMessage: {
        tabTitle: '',
        selects: [
          { value: 'projectId', type: 'custom', noClearable: true, span: 5 },
          { label: '采购单编号', key: 'code', type: 'el-input', isReadonly: true, span: 5 },
          { value: 'createAll', type: 'custom', span: 5 },
          { label: '备注', key: 'remarks', type: 'el-input', fromType: 'textarea', span: 5, rows: 1, placeholder: '请输入备注' },
          { label: '配送企业', key: 'deliveryMemberName', type: 'el-input', isReadonly: true, span: 5 },
          { value: 'deliveryAll', type: 'custom', span: 5 },
          { label: 'GPO名称', key: 'gpoMemberName', type: 'el-input', isReadonly: true, span: 5 },
          { value: 'gpoAll', type: 'custom', span: 5 },
          { value: 'receiveAddressId', type: 'custom', span: 15 },
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
          projectOptions: [],
          addressOption: [],
        },
        radios: {},
        rules: {
          projectId: [
            { required: true, message: '请选择集采项目', trigger: 'blur' },
          ],
        },
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
        receiveAddressId: null,                                                     // 收货地址
        remarks: null,                                                            // 备注
        status: null,                                                             // 状态
        createAll: null,
        deliveryAll: null,
        gpoAll: null,
      },
      // 勾选的列表项 [药品ID]
      selectedDrugs: [],
      ajax: 0,
      percentage: 0,
      isupload: false,
    };
  },
  methods: {
    // 初始化
    init() {
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
      this.dialogOptions.dialogForm.gpoMemberId = this.getGpoId;
      this.topbarForm = {
        id: null,
        projectId: null,
        gpoMemberId: Number(this.getGpoId),
        memberId: Number(this.View_UserInfo.memberId),
      };
      DeliverypurchaseList.itemCreate(this.topbarForm).then((res) => {
        let deliveryContacter = null;
        let deliveryContacterPhone = null;
        let gpoContacter = null;
        let gpoContacterPhone = null;
        if (res.data.code === 0) {
          const data = res.data.result;
          this.totalForm.createAll = null;
          if (data[1].deliveryContacter === null || data[1].deliveryContacter === 'null') {
            deliveryContacter = '';
          } else {
            deliveryContacter = data[1].deliveryContacter;
          }
          if (data[1].deliveryContacterPhone === null || data[1].deliveryContacterPhone === 'null') {
            deliveryContacterPhone = '';
          } else {
            deliveryContacterPhone = data[1].deliveryContacterPhone;
          }
          if (data[0].gpoContacter === null || data[0].gpoContacter === 'null') {
            gpoContacter = '';
          } else {
            gpoContacter = data[0].gpoContacter;
          }
          if (data[0].gpoContacterPhone === null || data[0].gpoContacterPhone === 'null') {
            gpoContacterPhone = '';
          } else {
            gpoContacterPhone = data[0].gpoContacterPhone;
          }
          this.totalForm.deliveryAll = `${deliveryContacter} ${deliveryContacterPhone}`;
          this.totalForm.gpoAll = `${gpoContacter} ${gpoContacterPhone}`;
          this.totalForm.id = null;
          this.totalForm.projectId = null;
          this.totalForm.code = null;
          this.totalForm.createBy = null;
          this.totalForm.createTime = null;
          this.totalForm.deliveryMemberCode = data[1].deliveryMemberNo;
          this.totalForm.deliveryMemberId = data[1].deliveryMemberId;
          this.totalForm.deliveryMemberName = data[1].deliveryMemberName;
          this.totalForm.deliveryPerson = data[1].deliveryContacter;
          this.totalForm.deliveryPhone = data[1].deliveryContacterPhone;
          this.totalForm.gpoMemberId = data[0].gpoMemberId;
          this.totalForm.gpoMemberName = data[0].gpoMemberName;
          this.totalForm.contacter = data[0].gpoContacter;
          this.totalForm.contactPhone = data[0].gpoContacterPhone;
          this.totalForm.receiveAddress = null;
          this.totalForm.receiveAddressId = null;
          this.totalForm.remarks = null;
          this.totalForm.status = 0;                  // 状态值  0  -- 待提交   1 -- 已提交
          this.loading = false;
        }
      });
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
      if (this.totalForm.deliveryPurchaseDrugsItemFormList.length > 0) {
        // console.log();
        if (this.changInfo) {
          this.changInfo = 0;
          return;
        }
        this.totalForm.projectId = oldVal;
        this.changInfo = 1;
        this.$confirm('此操作将清空明细，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          // 清除
          // console.log();
          this.totalForm.projectId = val;
          this.changInfo = 1;
          this.totalForm.deliveryPurchaseDrugsItemFormList = [];
          this.dialogOptions.dialogForm.drugsId = 0;
        }).catch(() => {
          this.changInfo = 0;
          // console.log();
          this.$message({
            type: 'info',
            message: '已取消操作',
          });
        });
      } else {
        // console.log();
      }
      if (this.totalForm.projectId !== null) {
        // 父组件触发子组件的改变按钮状态的事件
        this.tradeEditBtn = {
          createBtn: false,        // 新增
          deleteBtn: true,        // 删除
          exportBtn: false,        // 导出
          importBtn: false,        // 导入
        };
        this.btnDisabled.planDelete = false;
        this.dialogOptions.dialogForm.projectId = this.totalForm.projectId;
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
          // console.log();
          for (let i = 0; i < datalist.length; i += 1) {
            const addressInfo = `[${datalist[i].addressName}]${datalist[i].provinceName}${datalist[i].cityName}${datalist[i].countyName} ${datalist[i].addressFull} ${datalist[i].contacter} ${datalist[i].contacterPhone}`;
            this.$set(addressList, i, {
              label: addressInfo,
              value: Number(datalist[i].id),
            });
          }
        }
        this.editMessage.options.addressOption = addressList;
        // console.log();
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
      const form = {
        gpoMemberId: this.getGpoId,
        projectId: this.totalForm.projectId,
        deliveryMemberId: this.View_UserInfor.id,
      };
      const url = DeliverypurchaseList.output(form);
      window.open(url);
    },
    dataImport(e) {
      const file = e.target.files[0];
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel' || file.name.indexOf('.xls') > -1) {
        this.isupload = true;
        const formData = new FormData();
        formData.append('file', file);
        DeliverypurchaseList.upload(formData, '', this.progress).then((res) => {
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
            // 导入数据
            const arr = [];
            const arr2 = [];
            let amount = 0;
            let totalNum = 0;
            for (let i = 0; i < this.totalForm.deliveryPurchaseDrugsItemFormList.length; i += 1) {
              arr2.push(this.totalForm.deliveryPurchaseDrugsItemFormList[i].drugsId);
            }
            for (let i = 0; i < data.length; i += 1) {
              if (Number(data[i].purchaseNum) > 0) {
                this.changInfo = 0;
                if (arr2.indexOf(Number(data[i].drugsId)) >= 0) {
                  for (let j = 0;
                    j < this.totalForm.deliveryPurchaseDrugsItemFormList.length; j += 1) {
                    if (data[i].drugsId
                      === this.totalForm.deliveryPurchaseDrugsItemFormList[j].drugsId) {
                      // 相同
                      this.totalForm.deliveryPurchaseDrugsItemFormList[j].purchaseNum =
                        data[i].purchaseNum;
                      this.totalForm.deliveryPurchaseDrugsItemFormList[j].purchaseAmount =
                        (this.totalForm.deliveryPurchaseDrugsItemFormList[j].purchaseNum *
                          this.totalForm.deliveryPurchaseDrugsItemFormList[j].protocolPrice)
                          .toFixed(2);
                    }
                  }
                } else {
                  this.totalForm.deliveryPurchaseDrugsItemFormList.push({
                    approvalNumber: data[i].approvalNumber,
                    drugsCode: data[i].drugsCode,
                    drugsId: data[i].drugsId,
                    drugsName: data[i].drugsName,
                    drugsNo: data[i].drugsNo,
                    formName: data[i].formName,
                    id: null,
                    packSpecName: data[i].packSpecName,
                    producerCode: data[i].producerCode,
                    producerId: data[i].producerId,
                    producerName: data[i].producerName,
                    protocolPrice: data[i].protocolPrice,
                    purchaseAmount: data[i].purchaseAmount,
                    purchaseNum: data[i].purchaseNum,
                    specificationName: data[i].specificationName,
                    tradeName: data[i].tradeName,
                    unitName: data[i].unitName,
                    salerMemberCode: data[i].salerMemberCode,
                    salerMemberId: data[i].salerMemberId,
                    salerMemberName: data[i].salerMemberName,
                    middlePack: data[i].middlePack,
                    bigPack: data[i].bigPack,
                    removeFactor: data[i].removeFactor,
                  });
                  arr.push(data[i].drugsId);
                }
              }
            }
            for (let i = 0; i < this.totalForm.deliveryPurchaseDrugsItemFormList.length; i += 1) {
              amount += this.totalForm.deliveryPurchaseDrugsItemFormList[i].protocolPrice *
                this.totalForm.deliveryPurchaseDrugsItemFormList[i].purchaseNum;
              totalNum += Number(this.totalForm.deliveryPurchaseDrugsItemFormList[i].purchaseNum);
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
      if ((data.row.purchaseNum.toString().search(/\D/) !== -1 || Number(data.row.purchaseNum) === 0) && data.row.purchaseNum !== '') {
        // console.log();
        this.totalForm.deliveryPurchaseDrugsItemFormList[data.$index].purchaseNum = this.nowNum;
      } else {
        this.totalForm.deliveryPurchaseDrugsItemFormList[data.$index].purchaseAmount =
          Number(data.row.purchaseNum * data.row.protocolPrice);
        this.totalForm.deliveryPurchaseDrugsItemFormList[data.$index].purchaseAmount =
          this.totalForm.deliveryPurchaseDrugsItemFormList[data.$index].purchaseAmount.toFixed(2);
        let amount = 0;
        let totalNum = 0;
        for (let i = 0; i < this.totalForm.deliveryPurchaseDrugsItemFormList.length; i += 1) {
          amount += this.totalForm.deliveryPurchaseDrugsItemFormList[i].protocolPrice *
            this.totalForm.deliveryPurchaseDrugsItemFormList[i].purchaseNum;
          totalNum += Number(this.totalForm.deliveryPurchaseDrugsItemFormList[i].purchaseNum);
        }
        this.totalForm.amount = amount.toFixed(2);
        this.totalForm.totalNum = totalNum;
        this.nowNum = data.row.purchaseNum;
      }
      return false;
    },
    // 删除明细操作
    deleteItem() {
      let amount = 0;
      let totalNum = 0;
      const arr = [];
      for (let i = 0; i < this.totalForm.deliveryPurchaseDrugsItemFormList.length; i += 1) {
        for (let j = 0; j < this.selectedDrugs.length; j += 1) {
          if (this.totalForm.deliveryPurchaseDrugsItemFormList[i].drugsId ===
            this.selectedDrugs[j]) {
            this.totalForm.deliveryPurchaseDrugsItemFormList.splice(i, 1);
          }
        }
      }
      if (this.totalForm.deliveryPurchaseDrugsItemFormList.length > 0) {
        for (let i = 0; i < this.totalForm.deliveryPurchaseDrugsItemFormList.length; i += 1) {
          arr.push(this.totalForm.deliveryPurchaseDrugsItemFormList[i].drugsId);
          amount += this.totalForm.deliveryPurchaseDrugsItemFormList[i].protocolPrice *
            this.totalForm.deliveryPurchaseDrugsItemFormList[i].purchaseNum;
          totalNum += Number(this.totalForm.deliveryPurchaseDrugsItemFormList[i].purchaseNum);
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
      this.toAjax(0);
    },
    // 提交
    submit() {
      this.totalForm.status = 1;    // 提交
      this.toAjax(1);
    },
    // 请求
    toAjax(type) {
      this.getReceiveAddressName();
      this.ajax = 1;
      let status = 0;
      let goCreate = true;
      if (this.totalForm.deliveryPurchaseDrugsItemFormList.length <= 0) {
        this.$message.error('请输入药品明细');
        goCreate = false;
      } else {
        const int = /^[0-9]*[1-9][0-9]*$/;         // int
        for (let i = 0; i < this.totalForm.deliveryPurchaseDrugsItemFormList.length; i += 1) {
          // 数量
          const purchaseNum
            = int.test(this.totalForm.deliveryPurchaseDrugsItemFormList[i].purchaseNum);
          if (!purchaseNum) {
            this.$message.error('药品数量格式有误，请重试');
            goCreate = false;
          }
          if (!this.totalForm.deliveryPurchaseDrugsItemFormList[i].purchaseNum) {
            this.$message.error('请输入药品数量');
            goCreate = false;
          }
          if (Number(this.totalForm.deliveryPurchaseDrugsItemFormList[i].protocolPrice) === 0) {
            this.$message.error('所选药品单价不可为0');
            goCreate = false;
          }
          if (Number(this.totalForm.deliveryPurchaseDrugsItemFormList[i].purchaseNum) %
            Number(this.totalForm.deliveryPurchaseDrugsItemFormList[i].removeFactor) !== 0) {
            status = 1;
          }
        }
      }
      if (goCreate) {
        if (type === 1) {
          if (status) {
            this.$confirm('当前采购数量可能会导致包装拆零，是否继续？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }).then(() => {
              this.toCreated();
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '取消操作',
              });
            });
          } else {
            this.toCreated();
          }
        } else {
          this.toCreated();
        }
      }
    },
    toCreated() {
      this.loading = true;
      DeliverypurchaseList.create(this.totalForm).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '保存成功',
          });
          this.loading = false;
          this.$router.push({ path: '/Deliverypurchase/DeliveryPurchaseList' });
        }
      });
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
      const arr = [];
      if (rows[0]) {
        for (let i = 0; i < rows.length; i += 1) {
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
            purchaseAmount: null,
            purchaseNum: null,
            specificationName: rows[i].specificationName,
            tradeName: rows[i].tradeName,
            unitName: rows[i].unitName,
            salerMemberCode: rows[i].salerMemberCode,
            salerMemberId: rows[i].salerMemberId,
            salerMemberName: rows[i].salerMemberName,
            middlePack: rows[i].middlePack,
            bigPack: rows[i].bigPack,
            removeFactor: rows[i].removeFactor,
          });
          arr.push(rows[i].id);
        }
        this.dialogOptions.dialogForm.drugsId =
          `${this.dialogOptions.dialogForm.drugsId},${JSON.stringify(arr).slice(1, JSON.stringify(arr).length - 1)}`;
      }
    },
    // 清空数据
    emptyData() {
      this.editMessage.options.projectOptions = [];
      this.totalForm = {
        // top
        code: null,
        createBy: null,
        createTime: null,
        contacter: null,
        contactPhone: null,
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
        receiveAddressId: null,                                                     // 收货地址
        remarks: null,                                                            // 备注
        //          salerMemberCode: null,          // 卖方会员编码
        //          salerMemberId: null,            // 卖方会员ID
        //          salerMemberName: null,         // 卖方会员名称
        status: null,                                                             // 状态
        createAll: null,
        deliveryAll: null,
        gpoAll: null,
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
<style scoped>
.address-style.el-form-item {
  margin-bottom: 22px;
}
</style>
