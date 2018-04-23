<template>
  <div v-loading="loading" class="wq_invoice">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="发票信息" name="first">
        <el-form :rules="editMessage.rules" label-width="100px" id="from-item">
          <TradeEditsForm :from-edit="Order_PlanfromEdit" :isCreatShow="isCreatShow" :isDeleteItem="isDeleteItem" :message="editMessage" :isGoBackShow="false" :arrow-num=5 :arrow-down="true" @data-creat="dataCreat" @delete-item="deleteItem" @show-more="showMore">
            <el-form-item label="票折金额" slot="discountAmount" class="input-red">
              <el-input v-model="Order_PlanfromEdit.discountAmount" :disabled="onlyAmount" @keyup.native="editChange(Order_PlanfromEdit.discountAmount)" @blur="editChange(Order_PlanfromEdit.discountAmount)" size="small" style="color: red" class="close-clear input-right">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="发票扫描件" slot="scanFile">
              <y-upload-edit :image="true" :pdf="false" :fileList="uploadData" @upload-result="uploadResult" :isDisabled="isUploadDisabled"></y-upload-edit>
            </el-form-item>
          </TradeEditsForm>
        </el-form>
        <div>
          <el-table :data="Order_PlanItemList" @selection-change="dataSelect" stripe border fit :height="View_TableHeight">
            <el-table-column type="selection" width="40" fixed="left" align="center" v-if="this.$route.query.invoiceStatus === 0&&getPrincipal.memberType === 2">
            </el-table-column>
            <el-table-column prop="num" label="#" width="40"></el-table-column>
            <el-table-column prop="deliverCode" min-width="120" label="配送单号" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="drugsCode" min-width="90" label="药品编码" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="drugsName" min-width="150" label="通用名" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="tradeName" min-width="80" label="商品名" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="formName" min-width="90" label="剂型" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="specName" min-width="90" label="规格" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="packSpecName" min-width="90" label="包装规格" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="unitName" min-width="60" label="单位" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="batchNo" min-width="90" label="批号" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="hospitalUnitPrice" min-width="100" label="含税单价" align="right" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="invoicedNoNum" min-width="100" label="未开票数量" align="right" sortable show-overflow-tooltip v-if="this.$route.query.invoiceStatus === 0">
            </el-table-column>
            <el-table-column min-width="100" label="开票数量" sortable show-overflow-tooltip v-if="this.$route.query.invoiceStatus === 0&&getPrincipal.memberType === 2">
              <template scope="scope">
                <el-input :class="Number(scope.row.purchaseNum) ===0 || Number(scope.row.purchaseNum) > Number(scope.row.invoicedNoNum)?'out-num':''" class="input-right close-clear" style="width: 98%" slot="reference" size="small" placeholder="请输入开票数量" @focus="creatFocus(scope.row.purchaseNum)" @keyup.native="keydown(scope.row.purchaseNum, scope.row.hospitalUnitPrice, scope.$index, scope.row.taxesRate)" @blur="keydown(scope.row.purchaseNum, scope.row.hospitalUnitPrice, scope.$index, scope.row.taxesRate)" v-model="scope.row.purchaseNum">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column prop="purchaseNum" min-width="100" label="开票数量" align="right" sortable show-overflow-tooltip v-else>
            </el-table-column>
            <el-table-column min-width="100" label="含税金额" align="right" sortable show-overflow-tooltip>
              <template scope="scope">
                <p>{{scope.row.purchaseAmount}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="noUnitPrice" min-width="100" label="不含税单价" align="right" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="noTaxAmount" min-width="100" label="不含税金额" align="right" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="taxesRate" min-width="60" label="税率" align="right" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="makeDate" min-width="120" label="生产日期" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="validDate" min-width="120" label="有效日期" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="orderFile" label="随货同行单" align="left" min-width="100" sortable show-overflow-tooltip>
              <template scope="scope">
                <YuploadFiles :data="convert.getJSON(scope.row.orderFile)"></YuploadFiles>
              </template>
            </el-table-column>
            <el-table-column prop="producerName" min-width="180" label="生产企业" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="salerMemberName" min-width="180" label="卖方会员" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="approvalNumber" min-width="130" label="批准文号" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="ordersCode" min-width="120" label="订单编号" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="deliverItemNo" min-width="135" label="配送单明细编号" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="noOut" min-width="135" label="外部配送单编号" sortable show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </div>
        <div class="table-footer">
          <div style="float: left;padding-right: 15px;padding-left: 63%">
            <span>总数量：</span>{{Order_purchaseNum}}
          </div>
          <div style="float: left">
            <span style="">总含税金额：</span>{{this.Order_purchaseAmount.toFixed(2)}}
            <span>元</span>
          </div>
          <div style="float: left">
            <span style="margin-left: 10px;">总不含税金额：</span>{{Order_noTaxAmount.toFixed(2)}}
            <span>元</span>
          </div>
        </div>
        <EditDialog :options="dialogOptionsOne" @dialog-hide="dialogHide"></EditDialog>
        <OutDialog :options="dialogOptionsTwo" @dialog-hide="dialogHide"></OutDialog>
        <OutRedDialog :options="dialogOptionsThree" @dialog-hide="dialogHide"></OutRedDialog>
      </el-tab-pane>
      <el-tab-pane label="发票日志" name="second" v-if="authbtn.logList">
        <InvoiceLog></InvoiceLog>
      </el-tab-pane>
    </el-tabs>
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
import TradeEditsForm from '../../../components/TradeEditsForm'; //  引入订单目录表单
import InvoiceList from '../../../api/Invoice/InvoiceList';
import EditDialog from './EditDialog';
import OutDialog from './OutDialog';
import OutRedDialog from './OutRedDialog';
import InvoiceLog from './InvoiceLog'; // 引用发票日志
import convert from '../../../utils/convert'; //  自定义转换js

export default {
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.dataList();
      vm.hospitalAll();
    });
  },
  created() {
    this.authbtn = InvoiceList.authbtn();
    if (this.$route.query.invoiceStatus === 0) {
      this.$nextTick(() => {
        this.TableHeightRun(['#from-item', '.TradeFooter', 280]);
      });
    } else {
      this.$nextTick(() => {
        this.TableHeightRun(['#from-item', '.TradeFooter', 250]);
      });
    }
    const btn = {
      orderCreat: false,
      orderDelete: true,
      orderExport: false,
      orderImport: false,
    };
    this.ControltradeBtn(btn);
    const btnDisabled = {
      planSave: true,
      planSubmit: true,
    };
    this.$bus.$emit('data/tradefoot', btnDisabled);
  },
  computed: {
    authList() {
      return this.$store.state.view.authList;
    },
    getPrincipal() {
      return this.$store.state.view.principal;
    },
    invoiceType() {
      return this.Order_PlanfromEdit.invoiceType;
    },
    hospitalMemberName() {
      return this.Order_PlanfromEdit.hospitalMemberName;
    },
    ...mapGetters([
      'getGpoId',
      'Order_purchaseAmount',
      'Order_noTaxAmount',
      'Order_PlanItemList',
      'Order_purchaseNum',
      'View_TableHeight',
      'Order_ItemID',
      'Order_PlanfromEdit',
      'View_UserInfo',
    ]),
  },
  components: {
    TradeEditsForm,
    EditDialog,
    OutDialog,
    InvoiceLog,
    OutRedDialog,
  },
  watch: {
    Order_purchaseAmount(newinfo, oldinfo) {
      const aa = newinfo - this.Order_PlanfromEdit.discountAmount;
      this.$set(this.Order_PlanfromEdit, 'AmountMoney', aa.toFixed(2));
    },
    getGpoId() {
      if (this.$route.path === '/Invoice/InvoiceList/Edit') {
        history.back();
      }
    },
    authList() {
      this.authbtn = InvoiceList.authbtn();
    },
    uploadData() {
      this.TableHeightRun(['#from-item', '.TradeFooter', 260]);
      if (this.uploadData.length === 0) {
        this.TableHeightRun(['#from-item', '.TradeFooter', 210]);
      }
    },
    scanFile() {
      if (this.scanFile === 0) {
        this.TableHeightRun(['#from-item', '.TradeFooter', 260]);
      } else {
        this.TableHeightRun(['#from-item', '.TradeFooter', 300]);
      }
    },
    invoiceType(newinfo, oldinfo) {
      if (this.$route.path === '/Invoice/InvoiceList/Edit') {
        if (this.Order_PlanItemList.length) {
          if (this.changInfo) {
            this.changInfo = 0;
            return;
          }
          this.changInfo += 1;
          this.Order_PlanfromEdit.invoiceType = oldinfo;
          this.$confirm('此操作将清空明细，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.changInfo = 1;
            this.PlanListClear(0);
            this.Order_PlanfromEdit.invoiceType = newinfo;
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
    hospitalMemberName(newinfo, oldinfo) {
      if (this.$route.path === '/Invoice/InvoiceList/Edit') {
        if (this.Order_PlanItemList.length) {
          if (this.changInfo) {
            this.changInfo = 0;
            return;
          }
          this.changInfo += 1;
          this.Order_PlanfromEdit.hospitalMemberName = oldinfo;
          this.$confirm('此操作将清空明细，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            const info = newinfo.split('&');
            this.PlanListClear(0);
            const MemberId = !info[0] || info[0] === 'null' ? '' : info[0];
            const MemberCode = !info[1] || info[1] === 'null' ? '' : info[1];
            const Phone = !info[2] || info[2] === 'null' ? '' : info[2];
            const Person = !info[3] || info[3] === 'null' ? '' : info[3];
            const ifCrossOrder = !info[4] || info[4] === 'null' ? '' : info[4];
            this.Order_PlanfromEdit.hospitalAllPerson = `${Person} ${Phone}`;
            this.Order_PlanfromEdit.hospitalPhone = Phone;
            this.Order_PlanfromEdit.hospitalPerson = Person;
            this.Order_PlanfromEdit.hospitalMemberId = Number(MemberId);
            this.Order_PlanfromEdit.hospitalMemberCode = MemberCode;
            this.Order_PlanfromEdit.ifCrossOrder = ifCrossOrder;
            this.changInfo = 1;
            this.Order_PlanfromEdit.hospitalMemberName = newinfo;
          }).catch(() => {
            this.changInfo = 0;
            this.$message({
              type: 'info',
              message: '已取消操作',
            });
          });
        } else {
          this.changInfo = 0;
          if (this.$route.query.invoiceStatus === 0) {
            const info = newinfo.split('&');
            this.PlanListClear(0);
            const MemberId = !info[0] || info[0] === 'null' ? '' : info[0];
            const MemberCode = !info[1] || info[1] === 'null' ? '' : info[1];
            const Phone = !info[2] || info[2] === 'null' ? '' : info[2];
            const Person = !info[3] || info[3] === 'null' ? '' : info[3];
            const ifCrossOrder = !info[4] || info[4] === 'null' ? '' : info[4];
            this.Order_PlanfromEdit.hospitalAllPerson = `${Person} ${Phone}`;
            this.Order_PlanfromEdit.hospitalMemberId = Number(MemberId);
            this.Order_PlanfromEdit.hospitalMemberCode = MemberCode;
            this.Order_PlanfromEdit.ifCrossOrder = ifCrossOrder;
          }
        }
      }
    },
  },
  data() {
    return {
      changInfo: 0,
      uploadData: [], //  上传文件
      isUploadDisabled: true,
      isCreatShow: false, // 新增明细
      isDeleteItem: false, // 删除明细
      activeName: 'first', // 页头的默认选项
      dialogOptionsOne: {
        msgBase: '', //  没什么卵用，有需要可以看看
        isShowDialog: false, //  显示弹框
        tableSelected: [], //  默认表格选中
        tableType: 1, //  0 单选，1 多选 默认单选
      },
      dialogOptionsTwo: {
        msgBase: '', //  没什么卵用，有需要可以看看
        isShowDialog: false, //  显示弹框
        tableSelected: [], //  默认表格选中
        tableType: 1, //  0 单选，1 多选 默认单选
      },
      dialogOptionsThree: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: [],                //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
      },
      tableTitle: '添加明细',
      editMessage: {
        tabTitle: '',
        selects: [
          { label: '发票代码', key: 'code', type: 'el-input', isReadonly: true, span: 5, placeholder: '请输入10~12位的有效数字' },
          { label: '发票号', key: 'number', type: 'el-input', isReadonly: true, span: 5, placeholder: '请输入8位有效数字' },
          { value: 'discountAmount', type: 'custom', placeholder: '请输入票折金额', span: 5 },
          { label: '发票金额', key: 'AmountMoney', type: 'el-input', isReadonly: true, span: 5, append: '元', belclass: 'input-red', fromclass: 'input-right' },
          { label: '', key: 'invoiceStatus', type: 'el-input', isReadonly: true, noborder: 'true', belWidth: '35px', span: 4 },
          { label: '发票类型', key: 'invoiceType', type: 'el-select', span: 5, placeholder: '请选择发票类型', option: 'invoiceTypeOption', noClearable: true, isReadonly: true },
          { label: '开票日期', key: 'invoiceDate', type: 'el-input', isReadonly: true, span: 5 },
          { label: '创建人', key: 'invoiceBy', type: 'el-input', isReadonly: true, span: 5 },
          { label: '备注', key: 'remarks', span: 5, type: 'el-input', isReadonly: true, placeholder: '请输入备注', fromType: 'textarea', rows: 1 },
          { key: 'type', type: 'el-form-item', span: 4, md: 0, sm: 0, xs: 0 },
          { label: '医疗机构', key: 'hospitalMemberName', type: 'el-select', span: 5, option: 'hospitalOption', noClearable: true, isReadonly: true, filterable: true },
          { label: '联系人', key: 'hospitalAllPerson', type: 'el-input', isReadonly: true, span: 5 },
          { label: '配送企业', key: 'deliveryMemberName', type: 'el-input', isReadonly: true, span: 5 },
          { label: '联系人', key: 'deliveryAllPerson', type: 'el-input', isReadonly: true, span: 5 },
          { value: 'scanFile', type: 'custom', span: 24, md: 20, sm: 24, isReadonly: true },
        ],
        styleObject: {},
        parameters: {},
        options: {
          invoiceTypeOption: [
            {
              value: 1,
              label: '普通发票',
            },
            {
              value: 0,
              label: '冲红发票',
            },
            {
              value: 2,
              label: '冲红发票(拒收)',
            },
          ],
          hospitalOption: [],
        },
        radios: {},
        rules: {
          code: [
            { required: true, validator: window.validator.returnTrue, trigger: 'blur' },
          ],
          number: [
            { required: true, validator: window.validator.returnTrue, trigger: 'blur' },
          ],
          invoiceType: [
            { required: true, validator: window.validator.returnTrue, trigger: 'blur' },
          ],
          hospitalMemberName: [
            { required: true, validator: window.validator.returnTrue, trigger: 'blur' },
          ],
        },
      },
      nowNum: 0, // 当前数量
      loading: false,
      authbtn: {
        create: true,
      },
      scanFile: null, // 根据附件来判断表格高度的设置
      piao: null,
      onlyAmount: true,
    };
  },
  methods: {
    ...mapActions([
      'TableHeightRun',
      'GetItemDate',
      'TradeSelect',
      'Initialize',
      'CountNum',
      'DeleteItem',
      'ItemList',
      'ControltradeBtn',
      'PlanListClear',
      'GetOrderLog',
      'PlanListClear',
      'ReturnHint',
    ]),
    // 票折金额检测
    editChange(data) {
      const outAmuont = Number(data);
      const taxesamountAll = Number(this.Order_purchaseAmount);
      const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      let n = 0;
      let str = data;
      let charStr = '';
      if (typeof data !== 'undefined') {
        n = (data.split('.')).length - 1;
        charStr = data.charAt(data.length - 1);
      }
      if (charStr === '.' && n === 1 && str !== '.') {
        str = str.substring(0, str.length - 1);
      }
      if (!reg.test(str) && str !== '' && typeof data !== 'undefined') {
        this.Order_PlanfromEdit.discountAmount = this.piao;
        this.$message({
          type: 'error',
          message: '票折金额的输入格式不正确！',
        });
      } else if (typeof data !== 'undefined') {
        const amountAll = (taxesamountAll - outAmuont);
        if (amountAll < 0) {
          this.$message({
            type: 'error',
            message: '发票金额不足！',
          });
          this.Order_PlanfromEdit.discountAmount = this.piao;
        } else {
          this.Order_PlanfromEdit.AmountMoney = amountAll.toFixed(2);
          this.piao = data;
        }
      }
    },
    // 上传
    uploadResult(res) {
      this.Order_PlanfromEdit.scanFile = res;
      this.uploadData = this.convert.getJSON(this.Order_PlanfromEdit.scanFile);
    },
    // 标签页切换时触发事件
    handleClick() {
      if (this.activeName === 'first') {
        const btnDisabled = {
          planSave: true,
          planSubmit: true,
          confirmInvoice: true,
        };
        this.$bus.$emit('data/tradefoot', btnDisabled);
      }
      if (this.activeName === 'second') {
        const btnDisabled = {
          planSave: false,
          planSubmit: false,
          confirmInvoice: false,
        };
        this.$bus.$emit('data/tradefoot', btnDisabled);
        InvoiceList.logList(this.$route.query.id)
          .then((res) => {
            if (res.data.code === 0) {
              const data = res.data.result.content;
              for (let i = 0; i < data.length; i += 1) {
                data[i].num = i + 1;
              }
              this.GetOrderLog(data);
            }
          });
      }
    },
    // 医疗机构下拉
    hospitalAll(invoiceType) {
      if (this.getGpoId) {
        InvoiceList.hospitalInvoice(this.getGpoId, this.View_UserInfo.memberId).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            const projectOptions = [];
            for (let i = 0; i < data.length; i += 1) {
              projectOptions.push({
                label: data[i].hospitalMemberName,
                value: `${data[i].hospitalMemberId || ''}&${data[i].hospitalMemberCode || ''}&${data[i].hospitalPhone || ''}&${data[i].hospitalPerson || ''}&${data[i].ifCrossOrder || ''}&${data[i].hospitalMemberName || ''}`,
              });
            }
            this.editMessage.options.hospitalOption = projectOptions;
          }
        });
      }
    },
    // 获取当前的数值
    creatFocus(data) {
      this.nowNum = data;
    },
    // 键盘按钮触发方法
    keydown(data, res, index, notres) {
      if ((data.toString().search(/\D/) !== -1 || Number(data) === 0) && data !== '') {
        this.Order_PlanItemList[index].purchaseNum = this.nowNum;
      } else {
        const ItemListNum = this.Order_PlanItemList[index].purchaseNum;
        const ItemListPrice = this.Order_PlanItemList[index].hospitalUnitPrice; // 含税单价
        const ItemListNoPrice = this.Order_PlanItemList[index].noUnitPrice; // 不含税单价
        const ItemTaxRate = this.Order_PlanItemList[index].taxesRate; // 税率
        this.Order_PlanItemList[index].purchaseAmount = (ItemListNum * ItemListPrice).toFixed(2);
        this.Order_PlanItemList[index].noTaxAmount = (Number(ItemListNum) *
          Number(ItemListPrice) / (1 + Number(ItemTaxRate))).toFixed(2);  // 不含税金额
        this.CountNum({ Num: this.nowNum, Count: data, Price: res });
        this.nowNum = data;
        this.ReturnHint();
      }
      return false;
    },
    // 重新计算表格高度
    showMore() {
      this.$nextTick(() => {
        this.TableHeightRun(['#from-item', '.TradeFooter', 260]);
      });
    },
    // 添加明细
    dataCreat() {
      if (this.Order_PlanfromEdit.invoiceType !== 0 && this.Order_PlanfromEdit.invoiceType !== 1
        && this.Order_PlanfromEdit.invoiceType !== 2) {
        this.$message({
          type: 'error',
          message: '请选择发票类型',
        });
        return;
      }
      if (!this.Order_PlanfromEdit.hospitalMemberId) {
        this.$message({
          type: 'error',
          message: '请选择医疗机构',
        });
        return;
      }
      if (typeof (this.Order_PlanfromEdit.hospitalMemberId) !== 'number') {
        this.dialogOptionsOne.hospitalMemberId = this.Order_PlanfromEdit.OldhospitalMemberId;
        this.dialogOptionsTwo.hospitalMemberId = this.Order_PlanfromEdit.OldhospitalMemberId;
        this.dialogOptionsThree.hospitalMemberId = this.Order_PlanfromEdit.OldhospitalMemberId;
      } else {
        this.dialogOptionsOne.hospitalMemberId = this.Order_PlanfromEdit.hospitalMemberId;
        this.dialogOptionsTwo.hospitalMemberId = this.Order_PlanfromEdit.hospitalMemberId;
        this.dialogOptionsThree.hospitalMemberId = this.Order_PlanfromEdit.hospitalMemberId;
      }
      this.dialogOptionsOne.gpoMemberId = this.getGpoId;
      this.dialogOptionsOne.deliveryMemberId = this.Order_PlanfromEdit.deliveryMemberId;
      this.dialogOptionsTwo.gpoMemberId = this.getGpoId;
      this.dialogOptionsTwo.deliveryMemberId = this.Order_PlanfromEdit.deliveryMemberId;
      this.dialogOptionsThree.gpoMemberId = this.getGpoId;
      this.dialogOptionsThree.deliveryMemberId = this.Order_PlanfromEdit.deliveryMemberId;
      if (this.Order_PlanfromEdit.invoiceType === 1) {
        this.dialogOptionsOne.isShowDialog = true;
      } else if (this.Order_PlanfromEdit.invoiceType === 0) {
        this.dialogOptionsTwo.isShowDialog = true;
      } else {
        this.dialogOptionsThree.isShowDialog = true;
      }
    },
    // 关闭弹出框
    dialogHide() {
      if (this.Order_PlanfromEdit.invoiceType === 1) {
        this.dialogOptionsOne.isShowDialog = false;
      } else if (this.Order_PlanfromEdit.invoiceType === 0) {
        this.dialogOptionsTwo.isShowDialog = false;
      } else {
        this.dialogOptionsThree.isShowDialog = false;
      }
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
    // 获取数据列表
    dataList() {
      if (this.$route.query.invoiceStatus === 0 && this.getPrincipal.memberType === 2) {
        this.editMessage.selects[0].isReadonly = false;
        this.editMessage.selects[1].isReadonly = false;
        this.onlyAmount = false;
        this.editMessage.selects[5].isReadonly = false;
        this.editMessage.selects[8].isReadonly = false;
        this.editMessage.selects[10].isReadonly = false;
        this.isUploadDisabled = false;
        this.isCreatShow = true;
        this.isDeleteItem = true;
      }
      if (this.$route.query.id) {
        this.loading = true;
        InvoiceList.itemInfo(this.$route.query.id).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result.content[0];
            let isDeletable = '';
            let MemberName = `${data.hospitalMemberId}&${data.hospitalMemberCode}&${data.contactPhone}&${data.contacter}&${data.ifCrossOrder}&${data.hospitalMemberName}`;
            if (data.invoiceStatus === 0) {
              isDeletable = '待提交';
              this.editMessage.selects[4].fromclass = 'from-green no-border';
            }
            if (data.invoiceStatus === 0 && this.getPrincipal.memberType !== 2) {
              MemberName = data.hospitalMemberName;
            }
            if (data.invoiceStatus === 1) {
              isDeletable = '已确认';
              MemberName = data.hospitalMemberName;
              this.editMessage.selects[4].fromclass = 'from-blue no-border';
            }
            if (data.invoiceStatus === 2) {
              isDeletable = '已作废(配送企业)';
              MemberName = data.hospitalMemberName;
              this.editMessage.selects[4].fromclass = 'from-red no-border';
            }
            if (data.invoiceStatus === 3) {
              isDeletable = '待确认';
              MemberName = data.hospitalMemberName;
              this.editMessage.selects[4].fromclass = 'from-green no-border';
            }
            if (data.invoiceStatus === 4) {
              isDeletable = '已作废(医疗机构)';
              MemberName = data.hospitalMemberName;
              this.editMessage.selects[4].fromclass = 'from-red no-border';
            }
            const itemList = {
              code: data.code,
              number: data.number,
              taxesAmount: data.taxesAmount,
              discountAmount: data.discountAmount,
              AmountMoney: data.taxesAmount,
              invoiceDate: data.invoiceDate,
              invoiceType: data.invoiceType,
              invoiceBy: `${data.ordersBy || ''} ${data.ordersTime || ''}`,
              hospitalMemberId: data.hospitalMemberId,
              hospitalMemberCode: data.hospitalMemberCode,
              hospitalMemberName: MemberName,
              hospitalAllPerson: `${data.contacter || ''} ${data.contactPhone || ''}`,
              hospitalPhone: data.contacter,
              hospitalPerson: data.contactPhone,
              ifCrossOrder: data.ifCrossOrder, // 是否可跨订单开票  0否 1 是
              deliveryMemberId: data.deliveryMemberId,
              deliveryMemberName: data.deliveryMemberName,
              deliveryMemberCode: data.deliveryMemberCode,
              gpoMemberName: data.gpoMemberName,
              deliveryAllPerson: `${data.deliveryPerson || ''} ${data.deliveryPhone || ''}`,
              deliveryPerson: data.deliveryPerson,
              deliveryPhone: data.deliveryPhone,
              remarks: data.remarks,
              id: data.id,
              invoiceStatus: isDeletable,
              scanFile: data.scanFile,
            };
            this.uploadData = [];
            // 附件信息
            this.scanFile = data.scanFile;
            if (!this.scanFile) {
              this.scanFile = 0;
            }
            if (typeof (this.toJSON(data.scanFile)) === 'object') {
              this.uploadData = this.toJSON(data.scanFile);
            }
            if (this.$route.query.invoiceStatus !== 0 || this.getPrincipal.memberType !== 2) {
              itemList.hospitalMemberId = data.hospitalMemberName;
              if (data.invoiceType === 1) {
                itemList.invoiceType = '普通发票';
              } else if (data.invoiceType === 0) {
                itemList.invoiceType = '冲红发票';
              } else {
                itemList.invoiceType = '冲红发票(拒收)';
              }
            }
            this.ItemList(itemList);
            InvoiceList.item(this.$route.query.id).then((res1) => {
              if (res.data.code === 0) {
                const data1 = res1.data.result;
                for (let i = 0; i < data1.length; i += 1) {
                  data1[i].purchaseNum = data1[i].invoicedNum;
                  data1[i].purchaseAmount = data1[i].taxesAmount;
                  data1[i].invoicedNoNum = data1[i].drugsNum;
                  data1[i].noTaxAmountPrice = data1[i].noUnitPrice;
                  data1[i].itemNo = data1[i].itemNo;
                  data1[i].ids = data1[i].id;
                }
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
    //  json字符串转json，否则还是返回字符串
    toJSON(str) {
      return convert.toJSON(str);
    },
  },
};
</script>
<style>
.wq_invoice .fromtrades .el-form-item__content {
  line-height: normal !important;
}
</style>
