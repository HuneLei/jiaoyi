<template>
  <div class="wq_invoice">
    <el-form :rules="editMessage.rules" label-width="100px">
      <TradeEditsForm :from-edit="Order_PlanfromEdit" :isCreatShow="true" :isDeleteItem="true" :message="editMessage" :isGoBackShow="false" :arrow-num=3 :arrow-down="true" @delete-item="deleteItem" @data-creat="dataCreat" @show-more="showMore">
        <el-form-item label="票折金额" slot="discountAmount" class="input-red">
          <el-input v-model="Order_PlanfromEdit.discountAmount" @keyup.native="editChange(Order_PlanfromEdit.discountAmount)" @blur="editChange(Order_PlanfromEdit.discountAmount)" size="small" style="color: red" class="close-clear input-right">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="发票扫描件" slot="scanFile">
          <y-upload-edit :image="true" :pdf="false" :fileList="uploadData" @upload-result="uploadResult"></y-upload-edit>
        </el-form-item>
      </TradeEditsForm>
    </el-form>
    <div>
      <el-table :data="Order_PlanDateList" v-loading="loading" @selection-change="dataSelect" stripe border fit :height="View_TableHeight">
        <el-table-column type="selection" width="40" fixed="left">
        </el-table-column>
        <el-table-column prop="num" label="#" width="40"></el-table-column>
        <el-table-column prop="deliverCode" min-width="120" label="配送单号" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="drugsCode" min-width="90" label="药品编码" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="drugsName" min-width="120" label="通用名" sortable show-overflow-tooltip>
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
        <el-table-column prop="invoicedNoNum" min-width="100" label="未开票数量" align="right" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column min-width="100" label="开票数量" sortable show-overflow-tooltip>
          <template scope="scope">
            <el-input :class="Number(scope.row.purchaseNum) ===0 || Number(scope.row.purchaseNum) > Number(scope.row.invoicedNoNum)?'out-num':''" class="input-right close-clear" style="width: 98%" slot="reference" size="small" placeholder="请输入开票数量" @focus="creatFocus(scope.row.purchaseNum)" @keyup.native="keydown(scope.row.purchaseNum, scope.row.hospitalUnitPrice, scope.$index, scope.row.taxesRate)" @blur="keydown(scope.row.purchaseNum, scope.row.hospitalUnitPrice, scope.$index, scope.row.taxesRate)" v-model="scope.row.purchaseNum">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column min-width="90" label="含税金额" align="right" sortable show-overflow-tooltip>
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
          <!--<template scope="scope">
            <router-link :to="{ path: '/BusinessHospitalInfo', query: { id: scope.row.id } }">
              <el-button type="text" size="small">{{scope.row.hospitalName}}</el-button>
            </router-link>
          </template>-->
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
  </div>
</template>

<script>
/**
 * Created by wuqian on 2017/10/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import TradeEditsForm from '../../../components/TradeEditsForm';        //  引订单目录表单
import Table from '../../../utils/tableHeight';                         //  重新计算高度
import InvoiceList from '../../../api/Invoice/InvoiceList';
import EditDialog from './EditDialog';
import OutDialog from './OutDialog';
import OutRedDialog from './OutRedDialog';

export default {
  created() {
    this.hospitalAll();
    const btn = {
      orderCreat: true,
      orderDelete: true,
    };
    this.ControltradeBtn(btn);
    const btnDisabled = {
      planSave: false,
      planSubmit: false,
    };
    this.$bus.$emit('data/tradefoot', btnDisabled);
  },
  computed: {
    invoiceType() {
      return this.Order_PlanfromEdit.invoiceType;
    },
    hospitalMemberName() {
      return this.Order_PlanfromEdit.hospitalMemberName;
    },
    ...mapGetters([
      'getGpoId',
      'View_TableHeight',
      'Order_purchaseNum',
      'Order_PlanItemDate',
      'Order_PlanDateList',
      'Order_purchaseAmount',
      'Order_noTaxAmount',
      'Order_PlanfromEdit',
      'View_UserInfo',
    ]),
  },
  components: {
    EditDialog,
    TradeEditsForm,
    OutDialog,
    OutRedDialog,
  },
  watch: {
    getGpoId() {
      this.hospitalAll();
    },
    uploadData() {
      this.TableHeightRun(['.el-form', '.TradeFooter', 200]);
      if (this.uploadData.length === 0) {
        this.TableHeightRun(['.el-form', '.TradeFooter', 160]);
      }
    },
    invoiceType(newinfo, oldinfo) {
      if (this.$route.path === '/Invoice/InvoiceList/Creat') {
        if (this.Order_PlanDateList.length) {
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
            if (newinfo && this.Order_PlanfromEdit.hospitalMemberName) {
              const btn = {
                orderCreat: false,
                orderDelete: true,
              };
              this.ControltradeBtn(btn);
              const btnDisabled = {
                planSave: true,
                planSubmit: true,
              };
              this.$bus.$emit('data/tradefoot', btnDisabled);
            }
            if (newinfo === 0 && this.Order_PlanfromEdit.hospitalMemberName) {
              const btn = {
                orderCreat: false,
                orderDelete: true,
              };
              this.ControltradeBtn(btn);
              const btnDisabled = {
                planSave: true,
                planSubmit: true,
              };
              this.$bus.$emit('data/tradefoot', btnDisabled);
            }
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
          if (newinfo && this.Order_PlanfromEdit.hospitalMemberName) {
            const btn = {
              orderCreat: false,
              orderDelete: true,
            };
            this.ControltradeBtn(btn);
            const btnDisabled = {
              planSave: true,
              planSubmit: true,
            };
            this.$bus.$emit('data/tradefoot', btnDisabled);
          }
          if (newinfo === 0 && this.Order_PlanfromEdit.hospitalMemberName) {
            const btn = {
              orderCreat: false,
              orderDelete: true,
            };
            this.ControltradeBtn(btn);
            const btnDisabled = {
              planSave: true,
              planSubmit: true,
            };
            this.$bus.$emit('data/tradefoot', btnDisabled);
          }
        }
      }
    },
    Order_purchaseAmount(newinfo) {
      const aa = newinfo - this.Order_PlanfromEdit.discountAmount;
      this.$set(this.Order_PlanfromEdit, 'AmountMoney', aa.toFixed(2));
    },
    hospitalMemberName(newinfo, oldinfo) {
      if (this.$route.path === '/Invoice/InvoiceList/Creat') {
        if (this.Order_PlanDateList.length) {
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
            if (newinfo && this.Order_PlanfromEdit.invoiceType) {
              const btn = {
                orderCreat: false,
                orderDelete: true,
              };
              this.ControltradeBtn(btn);
              const btnDisabled = {
                planSave: true,
                planSubmit: true,
              };
              this.$bus.$emit('data/tradefoot', btnDisabled);
            }
            if (newinfo && this.Order_PlanfromEdit.invoiceType === 0) {
              const btn = {
                orderCreat: false,
                orderDelete: true,
              };
              this.ControltradeBtn(btn);
              const btnDisabled = {
                planSave: true,
                planSubmit: true,
              };
              this.$bus.$emit('data/tradefoot', btnDisabled);
            }
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
            this.Order_PlanfromEdit.hospitalMemberId = MemberId;
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
          if (newinfo && this.Order_PlanfromEdit.invoiceType) {
            const btn = {
              orderCreat: false,
              orderDelete: true,
            };
            this.ControltradeBtn(btn);
            const btnDisabled = {
              planSave: true,
              planSubmit: true,
            };
            this.$bus.$emit('data/tradefoot', btnDisabled);
          }
          if (newinfo && this.Order_PlanfromEdit.invoiceType === 0) {
            const btn = {
              orderCreat: false,
              orderDelete: true,
            };
            this.ControltradeBtn(btn);
            const btnDisabled = {
              planSave: true,
              planSubmit: true,
            };
            this.$bus.$emit('data/tradefoot', btnDisabled);
          }
          const info = newinfo.split('&');
          this.PlanListClear(0);
          const MemberId = !info[0] || info[0] === 'null' ? '' : info[0];
          const MemberCode = !info[1] || info[1] === 'null' ? '' : info[1];
          const Phone = !info[2] || info[2] === 'null' ? '' : info[2];
          const Person = !info[3] || info[3] === 'null' ? '' : info[3];
          const ifCrossOrder = !info[4] || info[4] === 'null' ? '' : info[4];
          this.Order_PlanfromEdit.hospitalAllPerson = `${Person} ${Phone}`;
          this.Order_PlanfromEdit.hospitalMemberId = MemberId;
          this.Order_PlanfromEdit.hospitalMemberCode = MemberCode;
          this.Order_PlanfromEdit.ifCrossOrder = ifCrossOrder;
        }
      }
    },
  },
  data() {
    return {
      changInfo: 0,
      uploadData: [], //  上传文件
      tableTitle: '添加明细',
      editMessage: {
        selects: [
          { label: '发票代码', key: 'code', placeholder: '请输入10~12位的有效数字', type: 'el-input', span: 5 },
          { label: '发票号', key: 'number', type: 'el-input', placeholder: '请输入8位有效数字', span: 5 },
          { value: 'discountAmount', type: 'custom', placeholder: '请输入票折金额', span: 5 },
          { key: 'type', type: 'el-form-item', span: 9, md: 0, sm: 0, xs: 0 },
          { label: '发票类型', key: 'invoiceType', type: 'el-select', span: 5, placeholder: '请选择发票类型', option: 'invoiceTypeOption', noClearable: true },
          { label: '开票日期', key: 'invoiceDate', type: 'el-input', isReadonly: true, span: 5 },
          { label: '创建人', key: 'ordersBy', type: 'el-input', isReadonly: true, span: 5 },
          { label: '备注', key: 'remarks', span: 5, type: 'el-input', placeholder: '请输入备注', fromType: 'textarea', rows: 1 },
          { key: 'type', type: 'el-form-item', span: 4, md: 0, sm: 0, xs: 0 },
          { label: '医疗机构', key: 'hospitalMemberName', type: 'el-select', span: 5, noClearable: true, option: 'hospitalOption', filterable: true },
          { label: '联系人', key: 'hospitalAllPerson', type: 'el-input', isReadonly: true, span: 5 },
          { label: '配送企业', key: 'deliveryMemberName', type: 'el-input', isReadonly: true, span: 5 },
          { label: '联系人', key: 'deliveryAllPerson', type: 'el-input', isReadonly: true, span: 5 },
          { value: 'scanFile', type: 'custom', span: 24, md: 20, sm: 24, isReadonly: true },
        ],
        styleObject: {},
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
        parameters: {},
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
      authbtn: {
        create: true,
      },
      dialogOptionsOne: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: [],                //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
        gpoMemberId: null,
        deliveryMemberId: null,
        hospitalMemberId: null,
        ids: '',
      },
      dialogOptionsTwo: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: [],                //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
        gpoMemberId: null,
        deliveryMemberId: null,
        hospitalMemberId: null,
        ids: '',
      },
      dialogOptionsThree: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: [],                //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
        gpoMemberId: null,
        deliveryMemberId: null,
        hospitalMemberId: null,
        ids: '',
      },
      loading: false,
      selectData: [],
      nowNum: 0,                            // 当前数量
      page: 0,
      size: 15,
      piao: null,
    };
  },
  methods: {
    ...mapActions([
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
      // console.log();
      this.uploadData = this.convert.getJSON(this.Order_PlanfromEdit.scanFile);
    },
    // 医疗机构下拉
    hospitalAll() {
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
            this.$set(this.Order_PlanfromEdit, 'hospitalMemberName', '');
            this.editMessage.options.hospitalOption = projectOptions;
          }
        });
      }
    },
    // 重新计算表格高度
    showMore() {
      this.$nextTick(() => {
        this.TableHeightRun(['.el-form', '.TradeFooter', 200]);
      });
    },
    // 获取当前的数值
    creatFocus(data) {
      this.nowNum = data;
    },
    // 键盘按钮触发方法
    keydown(data, res, index, notres) {
      if ((data.toString().search(/\D/) !== -1 || Number(data) === 0) && data !== '') {
        this.Order_PlanDateList[index].purchaseNum = this.nowNum;
      } else {
        const ItemListNum = this.Order_PlanDateList[index].purchaseNum;
        const ItemListPrice = this.Order_PlanDateList[index].hospitalUnitPrice; // 含税单价
        const ItemListNoPrice = this.Order_PlanDateList[index].noUnitPrice; // 不含税单价
        const ItemTaxRate = this.Order_PlanDateList[index].taxesRate; // 税率
        this.Order_PlanDateList[index].purchaseAmount = (ItemListNum * ItemListPrice).toFixed(2);
        this.Order_PlanDateList[index].noTaxAmount = (Number(ItemListNum) *
          Number(ItemListPrice) / (1 + Number(ItemTaxRate))).toFixed(2);  // 不含税金额
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
      // console.log();
      this.dialogOptionsOne.gpoMemberId = this.getGpoId;
      this.dialogOptionsOne.deliveryMemberId = this.Order_PlanfromEdit.deliveryMemberId;
      this.dialogOptionsOne.hospitalMemberId = this.Order_PlanfromEdit.hospitalMemberId;
      this.dialogOptionsTwo.gpoMemberId = this.getGpoId;
      this.dialogOptionsTwo.deliveryMemberId = this.Order_PlanfromEdit.deliveryMemberId;
      this.dialogOptionsTwo.hospitalMemberId = this.Order_PlanfromEdit.hospitalMemberId;
      this.dialogOptionsThree.gpoMemberId = this.getGpoId;
      this.dialogOptionsThree.deliveryMemberId = this.Order_PlanfromEdit.deliveryMemberId;
      this.dialogOptionsThree.hospitalMemberId = this.Order_PlanfromEdit.hospitalMemberId;
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
  },
};
</script>
<style>
.wq_invoice .fromtrades .el-form-item__content {
  line-height: normal !important;
}
</style>
