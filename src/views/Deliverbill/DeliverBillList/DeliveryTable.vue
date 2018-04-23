<template>
  <div class="delivery-table">
    <el-dialog title="配送单（货票同行）" :visible.sync="dialogFormShow" @close="closeDialog" @open="dialogOpen" size="large" :close-on-click-modal="false">
      <div v-loading="loading">
        <el-form :rules="editMessage.rules" label-width="100px" id="from-item">
          <TradeEditsForm :from-edit="Order_PlanfromEdit" :message="editMessage" :isGoBackShow="false" :purchase="Order_purchaseAmount">
            <el-form-item label="随货同行单" slot="scanFile">
              <y-upload-edit :image="true" :pdf="false" :fileList="uploadScanFile" @upload-result="uploadFile"></y-upload-edit>
            </el-form-item>
          </TradeEditsForm>
        </el-form>
        <div style="height: 350px; overflow-y: auto;" class="del-table">
          <div v-for="(value, index) in NotDeliveryListAll" :key="index">
            <el-form :rules="TradeMessage.rules" label-width="100px" :class="index == 0? '' : 'dialog-from'">
              <TradeEditsForm :from-edit="tradefrom[index]" :message="TradeMessage" :isGoBackShow="false" :purchase="Order_purchaseAmount" :isReadonly="disabled[index]" class="trade-table">
                <el-form-item label="票折金额" slot="outAmount" class="input-red">
                  <el-input v-model="tradefrom[index].outAmount" @keyup.native="editChange(index, tradefrom[index].outAmount)" @blur="editChange(index, tradefrom[index].outAmount)" size="small" style="width:85%;color: red" :disabled="disabled[index]" class="close-clear input-right">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </TradeEditsForm>
            </el-form>
            <el-table :data="NotDeliveryListAll[index]" stripe border fit class="from-table" :height="(NotDeliveryListAll[index].length * 32) + 55">
              <el-table-column prop="num" label="#" width="40" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="code" min-width="100" label="订单编号" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="hospitalMemberName" min-width="180" label="医疗机构" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="drugsCode" min-width="90" label="药品编码" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="drugsName" min-width="120" label="通用名" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="specName" min-width="90" label="规格" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="packSpecName" min-width="90" label="包装规格" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="formName" min-width="90" label="剂型" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="unitName" min-width="60" label="单位" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="hospitalUnitPrice" align="right" min-width="70" label="单价" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="producerName" min-width="180" label="生产企业" show-overflow-tooltip>
              </el-table-column>
              <el-table-column align="right" prop="purchaseNum" min-width="100" label="未发货数量" show-overflow-tooltip fixed="right">
              </el-table-column>
              <el-table-column align="right" min-width="100" label="发货数量" show-overflow-tooltip fixed="right">
                <template scope="scope">
                  <el-input :disabled="(NotDeliveryListAll.length-1) == index? disabled[index] : disabledNum[index]" :class="scope.row.OutStyle" class="close-clear input-right" style="width: 98%" slot="reference" size="small" placeholder="请输入内容" @focus="creatFocus(scope.row.drugsNum)" @keyup.native="keydown(scope.row.drugsNum, scope.row.hospitalUnitPrice, scope.$index, scope.row.purchaseNum, scope.row.BatchNum, index)" @blur="keydown(scope.row.drugsNum, scope.row.hospitalUnitPrice, scope.$index, scope.row.purchaseNum, scope.row.BatchNum, index)" v-model="scope.row.drugsNum">
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column min-width="130" label="批号" fixed="right">
                <template scope="scope">
                  <el-select :disabled="(NotDeliveryListAll.length-1) == index? disabled[index] : disabledNum[index]" v-model="batchNo[index][scope.$index]" placeholder="请选择" size="small" style="width: 98%" @change="BatchChange(batchNo[index][scope.$index], scope.$index, scope.row.drugsCode, index)" @visible-change="(value) => visibleChange(value, scope.row.drugsCode, index, scope.$index)" clearable>
                    <el-option v-for="item in GrugsListAll[index][scope.$index]" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="药检报告" align="center" min-width="100" max-width="200">
                <template scope="scope">
                  <YuploadFiles :data="convert.getJSON(drugsReportFile[index][scope.$index])"></YuploadFiles>
                </template>
              </el-table-column>
              <el-table-column min-width="100" label="生产日期" show-overflow-tooltip>
                <template scope="scope">
                  <span>{{makeDate[index][scope.$index]==''?'':convertDate(makeDate[index][scope.$index])}}</span>
                </template>
              </el-table-column>
              <el-table-column min-width="100" label="有效日期" show-overflow-tooltip>
                <template scope="scope">
                  <span>{{validDate[index][scope.$index]==''?'':convertDate(validDate[index][scope.$index])}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="tradeName" min-width="80" label="商品名" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="approvalNumber" min-width="130" label="批准文号" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="contractItemNo" min-width="140" label="合同明细编号" show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="操作" min-width="130" fixed="right" align="center">
                <template scope="scope">
                  <el-button type="text" size="small" @click="batchNoPart(scope.$index, index)" v-if="!scope.row.operate" :disabled="(NotDeliveryListAll.length-1)==index?(disabled[index]?disabled[index]:scope.row.RowDisabled):true">
                    拆分批号
                  </el-button>
                  <el-button type="text" @click="batchNoDeletes(scope.$index, index, scope.row.num)" v-if="scope.row.num" :disabled="(NotDeliveryListAll.length-1) == index? disabled[index] : disabledNum[index]">
                    删除
                  </el-button>
                  <el-button type="text" size="small" @click="batchNoDelete(scope.$index, index)" v-if="scope.row.operate" :disabled="(NotDeliveryListAll.length-1) == index? disabled[index] : disabledNum[index]">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div v-show="!disabled[index]" class="table-button">
              <el-button type="primary" @click="dialogConfirm(index)" :disabled="SubmitAbled">确定</el-button>
              <el-button type="danger" @click="dialogDelete(index)" v-show="NotDeliveryListAll.length !=1&&!disabled[index]">删除</el-button>
            </div>
            <div v-show="disabled[index]" class="table-button">
              <el-button type="warning" @click="dialogUpdate(index)" :disabled="!isDeleteShow">编辑</el-button>
            </div>
            <div class="table-button">
              <el-form ref="form" :model="tradefrom[index]" label-width="90px">
                <el-form-item label="发票扫描附件" class="form-loadedit">
                  <YUploadEdit :fileList="uploadData[index]" :showBriefOther="true" @upload-result="uploadResult" :isDisabled="disabled[index]" :isReadonly="disabled[index]" :show-brief="false" v-model="tradefrom[index].invoiceScan" :is-index="index"></YUploadEdit>
                </el-form-item>
              </el-form>
            </div>
            <div style="width: 1px;height: 65px"></div>
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button style="float: left" type="info" @click="dataDebi()" :disabled="debiAbled">新增发票</el-button>
        <el-button type="primary" @click="dataSubmit" :disabled="SubmitAbled" :loading="loading">确定发货</el-button>
        <el-button @click="dialogClose">取 消</el-button>
      </span>
    </el-dialog>
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
import application from '../../../api/BasicInfo/Project';
import TradeEditsForm from '../../../components/TradeEditsForm';          //  引订单目录表单
import StepsFrom from '../../../components/StepsFrom';                    // 引入加载条组件
import DeliverBillList from '../../../api/Deliverbill/DeliverBillList';   // 订单(配送企业api)
import convert from '../../../utils/convert';

export default {
  watch: {
    Order_DeliveryShow(val) {     // 监听dialogFormVisible值变化组件显示隐藏
      this.dialogFormShow = val;
    },
  },
  computed: mapGetters([
    'Order_purchaseAmount',
    'Order_NotDeliveryList',
    'Order_purchaseNum',
    'View_TableHeight',
    'Order_PlanfromEdit',
    'Order_DeliveryShow',
    'Order_purchaseAmount',
    'Order_BatchNoNum',
    'Order_GrugsList',
    'View_UserInfor',
    'getGpoId',
  ]),
  components: {
    TradeEditsForm,
    StepsFrom,
  },
  data() {
    return {
      isDeleteShow: false,
      newTable: 0,
      passAmount: [],
      SubmitAbled: false,
      debiAbled: true,
      batchNo: [],
      disabled: [],
      makeDate: [],
      validDate: [],
      uploadData: [], //  上传文件
      uploadScanFile: [], //  上传文件
      drugsReportFile: [],
      NotDeliveryListAll: [],
      GrugsListAll: [],
      BatchNoLists: [],
      tradefrom: [],
      OutStyle: '',
      dialogFormShow: false,
      editMessage: {
        tabTitle: '',
        selects: [
          { label: '配送企业', key: 'deliveryMemberName', type: 'el-input', placeholder: '请输入配送企业', isReadonly: true, span: 6, fromStyle: 'style1' },
          { label: '联系人', key: 'sendPerson', type: 'el-input', placeholder: '请输入联系人', span: 6, fromStyle: 'style1' },
          { label: '联系人电话', key: 'sendPhone', type: 'el-input', placeholder: '请输入联系人电话', span: 6, fromStyle: 'style1' },
          { label: '条码号', key: 'sendNoOut', type: 'el-input', placeholder: '请输入条码号', span: 6, fromStyle: 'style1' },
          { label: '配送单编号', key: 'ordersId', type: 'el-input', placeholder: '自动生成', isReadonly: true, span: 6, fromStyle: 'style1' },
          { label: '发票金额合计', key: 'amount', type: 'el-input', placeholder: '自动生成', isReadonly: true, span: 6, fromStyle: 'style1', append: '元', fromclass: 'input-right' },
          { value: 'scanFile', type: 'custom', isReadonly: true, span: 12 },
        ],
        styleObject: {
          style1: {
            width: '85%',
          },
        },
        parameters: {},
        options: {
          typeOption: [],
          addressOption: [],
        },
        radios: {},
        rules: {
          sendPerson: [
            { required: true, validator: window.validator.returnTrue, trigger: 'blur' },
          ],
          sendPhone: [
            { required: true, validator: window.validator.returnTrue, trigger: 'blur' },
          ],
        },
      },
      TradeMessage: {
        tabTitle: '',
        selects: [
          { label: '发票代码', key: 'invoiceCode', type: 'el-input', placeholder: '请输入发票代码', span: 6, fromStyle: 'style1' },
          { label: '发票号', key: 'invoiceNo', type: 'el-input', placeholder: '请输入发票号', span: 6, fromStyle: 'style1' },
          { value: 'outAmount', type: 'custom', placeholder: '', span: 6 },
          { label: '发票金额', key: 'taxesAmount', type: 'el-input', placeholder: '请输入发票金额', isReadonly: true, span: 6, fromStyle: 'style1', append: '元', fromclass: 'input-right' },
          { value: 'invoiceScan', type: 'custom', span: 6 },
        ],
        styleObject: {
          style1: {
            width: '85%',
          },
        },
        parameters: {},
        options: {
          typeOption: [],
          addressOption: [],
        },
        radios: {},
        rules: {
          invoiceNo: [
            { required: true, validator: window.validator.returnTrue, trigger: 'blur' },
          ],
          invoiceCode: [
            { required: true, validator: window.validator.returnTrue, trigger: 'blur' },
          ],
        },
      },
      loading: false,
    };
  },
  methods: {
    // 下拉框出现的时候触发
    visibleChange(event, drugsCode, index, num) {
      if (event) {
        const deliveryMemberId = this.Order_PlanfromEdit.deliveryMemberId;
        DeliverBillList.drugslist(drugsCode, deliveryMemberId).then((res) => {
          if (res.data.code === 0) {
            const drugslist = res.data.result;
            drugslist.drugsCode = drugsCode;
            for (let i = 0; i < drugslist.length; i += 1) {
              drugslist[i].value = `${drugslist[i].id}$${drugslist[i].batchNo}`;
              drugslist[i].label = drugslist[i].batchNo;
              drugslist[i].index = i;
            }
            this.$set(this.GrugsListAll[index], num, drugslist);
          }
        });
      }
    },
    // 票折金额检测
    editChange(index, data) {
      const outAmuont = Number(data);
      const taxesAmount = Number(this.tradefrom[index].taxesAmount);
      const taxesamountAll = Number(this.Order_PlanfromEdit.amount);
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
        this.tradefrom[index].outAmount = this.passAmount[index];
        const tradeList = Object.assign({}, this.tradefrom[index]);
        this.tradefrom[index] = {};
        this.$set(this.tradefrom, index, tradeList);
        this.$message({
          type: 'error',
          message: '票折金额的输入格式不正确！',
        });
      } else if (typeof data !== 'undefined') {
        const Amount = (taxesAmount + Number(this.passAmount[index])) - outAmuont;
        const amountAll = (taxesamountAll + Number(this.passAmount[index])) - outAmuont;
        if (Amount < 0) {
          this.$message({
            type: 'error',
            message: '发票金额不足！',
          });
          this.tradefrom[index].outAmount = this.passAmount[index];
          const tradeList = Object.assign({}, this.tradefrom[index]);
          this.tradefrom[index] = {};
          this.$set(this.tradefrom, index, tradeList);
        } else {
          this.tradefrom[index].taxesAmount = Amount.toFixed(2);
          this.Order_PlanfromEdit.amount = amountAll.toFixed(2);
          this.passAmount[index] = data;
        }
      }
    },
    // 上传
    uploadResult(res, index) {
      this.$set(this.tradefrom[index], 'invoiceScan', res);
      this.$set(this.uploadData, index, this.convert.getJSON(res));
    },
    uploadFile(res) {
      this.Order_PlanfromEdit.scanFile = res;
      this.uploadScanFile = this.convert.getJSON(this.Order_PlanfromEdit.scanFile);
    },
    // 当批号改变的时候触发
    BatchChange(index, key, code, num) {
      if (index) {
        for (let i = 0; i < this.NotDeliveryListAll[num].length; i += 1) {
          if (this.NotDeliveryListAll[num][i].batchNo === index && (i !== key)) {
            this.$message({
              type: 'error',
              message: '批号不能重复',
            });
            this.$set(this.batchNo[num], key, '');
            return;
          }
        }
        if (this.GrugsListAll[num].length) {
          for (let i = 0; i < this.GrugsListAll[num].length; i += 1) {
            for (let n = 0; n < this.GrugsListAll[num][i].length; n += 1) {
              const GrugsOne = this.GrugsListAll[num][i][n];
              let info = [];
              info = index.split('$');
              if (GrugsOne.drugsCode === code && GrugsOne.batchNo === info[1]) {
                this.$set(this.makeDate[num], key, GrugsOne.makeDate);
                this.$set(this.validDate[num], key, GrugsOne.validDate);
                this.$set(this.drugsReportFile[num], key, GrugsOne.drugsReportFile);
                this.NotDeliveryListAll[num][key].makeDate = GrugsOne.makeDate;
                this.NotDeliveryListAll[num][key].validDate = GrugsOne.validDate;
                this.NotDeliveryListAll[num][key].drugsReportFile = GrugsOne.drugsReportFile;
              }
            }
          }
        }
        this.NotDeliveryListAll[num][key].batchNo = index;
      } else {
        this.NotDeliveryListAll[num][key].batchNo = index;
        this.NotDeliveryListAll[num][key].makeDate = '';
        this.NotDeliveryListAll[num][key].validDate = '';
        this.NotDeliveryListAll[num][key].drugsReportFile = '';
        this.$set(this.makeDate[num], key, '');
        this.$set(this.validDate[num], key, '');
        this.$set(this.drugsReportFile[num], key, '');
      }
    },
    // 获取当前的数值
    creatFocus(data) {
      this.nowNum = data;
    },
    // 键盘按钮触发方法
    keydown(data, res, index, key, num, even) {
      if ((data.toString().search(/\D/) !== -1 || Number(data) === 0) && data !== '') {
        this.NotDeliveryListAll[even][index].drugsNum = this.nowNum;
      } else {
        const ItemListNum = this.NotDeliveryListAll[even][index].drugsNum;
        const ItemListPrice = this.NotDeliveryListAll[even][index].hospitalUnitPrice;
        this.NotDeliveryListAll[even][index].purchaseAmount = ItemListNum * ItemListPrice;
        this.nowNum = data;
      }
      const NotList = this.NotDeliveryListAll[even];
      let BatchNumAll = 0;
      for (let i = 0; i < NotList.length; i += 1) {
        if (Number(NotList[i].BatchNum) === num) {
          BatchNumAll = Number(BatchNumAll) + Number(NotList[i].drugsNum);
        }
      }
      if (key <= BatchNumAll) {
        this.DeliverDisabled([index, true, key, BatchNumAll], even);
        this.OutStyle = this.OutStyle === 'in-num' ? 'nn-num' : 'in-num';
      } else {
        this.DeliverDisabled([index, false], even);
        this.OutStyle = this.OutStyle === 'in-num' ? 'nn-num' : 'in-num';
      }
      this.$set(this.NotDeliveryListAll[even], 0, this.NotDeliveryListAll[even][0]);
      this.countAmount(this.NotDeliveryListAll[even], even, 1);
      return false;
    },
    // 打开弹出框时调用
    dialogOpen() {
      this.newTable = 0;
      this.debiAbled = true;
      this.SubmitAbled = false;
      this.isDeleteShow = false;
      this.$set(this.batchNo, 0, []);
      this.$set(this.makeDate, 0, []);
      this.$set(this.validDate, 0, []);
      this.$set(this.tradefrom, 0, {});
      this.$set(this.passAmount, 0, '');
      this.tradefrom[0].invoiceCode = this.View_UserInfor.invoiceCode;
      this.drugsReportFile[0] = [];
      this.NewGrugsList();
      this.disabled = [];
      this.disabledNum = [];
      this.uploadData = [];
      this.uploadScanFile = [];
      this.GrugsListAll = [];
      this.NotDeliveryListAll = [];
      this.uploadScanFile = [];
      this.Order_PlanfromEdit.amount = 0;
      this.newTable = this.Order_NotDeliveryList.length;
      const NotDeliveryList = Object.assign([], this.Order_NotDeliveryList);
      const GrugsList = Object.assign([], this.Order_GrugsList);
      for (let i = 0; i < this.Order_NotDeliveryList.length; i += 1) {
        NotDeliveryList[i] = Object.assign({}, this.Order_NotDeliveryList[i]);
        NotDeliveryList[i].purchaseNumAll = this.Order_NotDeliveryList[i].purchaseNum;
        GrugsList[i] = {};
      }
      this.$set(this.NotDeliveryListAll, 0, NotDeliveryList);
      this.$set(this.GrugsListAll, 0, GrugsList);
      for (let i = 0; i < this.NotDeliveryListAll[0].length; i += 1) {
        this.$set(this.batchNo[0], i, '');
        this.$set(this.makeDate[0], i, '');
        this.$set(this.validDate[0], i, '');
        this.drugsReportFile[0][i] = '';
        this.NotDeliveryListAll[0][i].batchNo = '';
        this.NotDeliveryListAll[0][i].makeDate = '';
        this.NotDeliveryListAll[0][i].validDate = '';
        this.NotDeliveryListAll[0][i].drugsReportFile = '';
        this.NotDeliveryListAll[0][i].purchaseAmount =
          this.NotDeliveryListAll[0][i].hospitalUnitPrice * this.NotDeliveryListAll[0][i].drugsNum;
      }
      this.countAmount(this.NotDeliveryListAll[0], 0, 1);
    },
    // 拆分批号
    batchNoPart(index, num) {
      this.DeliverBatchNo(index, num);
      this.DeliverDisabled([index, true], num);
      for (let i = 0; i < this.NotDeliveryListAll[num].length; i += 1) {
        this.batchNo[num][i] = this.NotDeliveryListAll[num][i].batchNo;
        this.makeDate[num][i] = this.NotDeliveryListAll[num][i].makeDate;
        this.validDate[num][i] = this.NotDeliveryListAll[num][i].validDate;
        this.drugsReportFile[num][i] = this.NotDeliveryListAll[num][i].drugsReportFile;
      }
      this.countAmount(this.NotDeliveryListAll[num], num, 1);
    },
    // 删除拆分的批号
    batchNoDelete(index, num) {
      this.DeliveNoDelete(index, num);
      for (let i = 0; i < this.NotDeliveryListAll[num].length; i += 1) {
        this.batchNo[num][i] = this.NotDeliveryListAll[num][i].batchNo;
        this.makeDate[num][i] = this.NotDeliveryListAll[num][i].makeDate;
        this.validDate[num][i] = this.NotDeliveryListAll[num][i].validDate;
        this.drugsReportFile[num][i] = this.NotDeliveryListAll[num][i].drugsReportFile;
      }
      this.countAmount(this.NotDeliveryListAll[num], num, 1);
    },
    // 计算总金额
    countAmount(data, num, amun) {
      let Amountall = 0;
      for (let i = 0; i < data.length; i += 1) {
        Amountall += Number(data[i].hospitalUnitPrice) * Number(data[i].drugsNum);
      }
      if (amun === 1) {
        Amountall -= Number(this.passAmount[num]);
      }
      Amountall = Amountall.toFixed(2);
      this.$set(this.tradefrom[num], 'taxesAmount', Amountall);
      let amounts = 0;
      for (let i = 0; i < this.NotDeliveryListAll.length; i += 1) {
        amounts += Number(this.tradefrom[i].taxesAmount);
      }
      this.Order_PlanfromEdit.amount = amounts.toFixed(2);
      this.$set(this.Order_PlanfromEdit, 'amount', amounts.toFixed(2));
    },
    // 取消按钮
    dialogClose() {
      this.closeDialog();
    },
    // 新增发票
    dataDebi() {
      this.NewGrugsList();
      const length = this.NotDeliveryListAll.length;
      this.newTable = this.Order_NotDeliveryList.length;
      const NotDeliveryList = Object.assign([], this.Order_NotDeliveryList);
      const GrugsList = Object.assign([], this.Order_GrugsList);
      for (let i = 0; i < this.Order_NotDeliveryList.length; i += 1) {
        NotDeliveryList[i] = Object.assign({}, this.Order_NotDeliveryList[i]);
        NotDeliveryList[i].purchaseNumAll = this.Order_NotDeliveryList[i].purchaseNum;
        GrugsList[i] = {};
      }
      const DeliveryOne = this.NotDeliveryListAll;
      let oNum = 1;
      for (let num = 1; num <= this.newTable; num += 1) {
        let lessNum = 0;
        let drugsNumAll = 0;
        let purchaseNum = 0;
        let DelPurchaseNum = 0;
        let purchaseNumAll = 0;
        let purchaseNumOk = 0;
        let purchaseOk = 0;
        try {
          purchaseNumOk = Number(NotDeliveryList[num - oNum].purchaseNumAll);
          DelPurchaseNum = Number(NotDeliveryList[num - oNum].purchaseNum);
        } catch (err) {
          purchaseNumOk = 0;
          DelPurchaseNum = 0;
        }
        for (let k = 0; k < DeliveryOne.length; k += 1) {
          for (let m = 0; m < DeliveryOne[k].length; m += 1) {
            if (num === DeliveryOne[k][m].BatchNum) {
              purchaseNumAll = Number(DeliveryOne[k][m].purchaseNumAll);
              drugsNumAll += Number(DeliveryOne[k][m].drugsNum);
              purchaseNum = Number(DeliveryOne[k][m].purchaseNum);
              purchaseOk = 1;
            }
          }
        }
        lessNum = purchaseNumAll - drugsNumAll;
        if (purchaseOk !== 1) {
          lessNum = DelPurchaseNum;
        }
        if (lessNum === 0 || purchaseNumOk === 0) {
          NotDeliveryList.splice(num - oNum, 1);
          GrugsList.splice(num - oNum, 1);
          oNum += 1;
        } else {
          NotDeliveryList[num - oNum].purchaseNum = lessNum;
          NotDeliveryList[num - oNum].drugsNum = lessNum;
        }
      }
      if (!NotDeliveryList.length) {
        this.$message({
          type: 'error',
          message: '可发货数量不足,无法新增发票',
        });
        return;
      }
      this.$set(this.batchNo, length, []);
      this.$set(this.makeDate, length, []);
      this.$set(this.validDate, length, []);
      this.$set(this.tradefrom, length, {});
      this.$set(this.passAmount, length, '');
      this.tradefrom[length].invoiceCode = this.tradefrom[length - 1].invoiceCode;
      this.$set(this.uploadData, length, []);
      this.drugsReportFile[length] = [];
      this.$set(this.NotDeliveryListAll, length, NotDeliveryList);
      this.$set(this.GrugsListAll, length, GrugsList);
      this.newTable = this.NotDeliveryListAll[length].length;
      for (let i = 0; i < this.NotDeliveryListAll[length].length; i += 1) {
        this.$set(this.batchNo[length], i, '');
        this.$set(this.makeDate[length], i, '');
        this.$set(this.validDate[length], i, '');
        this.drugsReportFile[length][i] = '';
        this.NotDeliveryListAll[length][i].batchNo = this.batchNo[length][i];
        this.NotDeliveryListAll[length][i].makeDate = this.makeDate[length][i];
        this.NotDeliveryListAll[length][i].validDate = this.validDate[length][i];
        this.NotDeliveryListAll[length][i].drugsReportFile = this.drugsReportFile[length][i];
      }
      this.debiAbled = true;
      this.isDeleteShow = false;
      this.$set(this.disabled, length, false);
      this.$set(this.disabledNum, length, false);
      this.countAmount(this.NotDeliveryListAll[length], length, 1);
    },
    // 确认按钮
    dialogConfirm(index, num) {
      const invoiceNo = this.tradefrom[index].invoiceNo;
      const invoiceCode = this.tradefrom[index].invoiceCode;
      const taxesAmount = this.tradefrom[index].taxesAmount;
      if (!invoiceNo && invoiceNo !== 0) {
        this.$message({
          type: 'error',
          message: '请输入发票号',
        });
        return false;
      }
      if (!invoiceCode && invoiceCode !== 0) {
        this.$message({
          type: 'error',
          message: '请输入发票代码',
        });
        return false;
      }
      const regExp = /^([0-9]\d{7})$/;
      if (regExp.test(invoiceNo) === false ||
        isNaN(Number(invoiceNo))) {
        this.$message({
          type: 'error',
          message: '发票号为8位有效数字',
        });
        return false;
      }
      if (invoiceCode) {
        const regExpt = /^([0-9]\d{9,11})$/;
        if (regExpt.test(invoiceCode) === false ||
          isNaN(Number(invoiceCode))) {
          this.$message({
            type: 'error',
            message: '发票代码为10~12位的有效数字',
          });
          return false;
        }
      }
      if (taxesAmount < 0) {
        this.$message({
          type: 'error',
          message: '发票金额不可小于0！',
        });
        return false;
      }
      for (let n = 0; n < this.tradefrom.length; n += 1) {
        const invoCode = this.tradefrom[n].invoiceCode;
        const invoNo = this.tradefrom[n].invoiceNo;
        const invoice = invoCode + invoNo;
        for (let m = 0; m < this.tradefrom.length; m += 1) {
          const invoiceCodes = this.tradefrom[m].invoiceCode;
          const invoiceNos = this.tradefrom[m].invoiceNo;
          const invoices = invoiceCodes + invoiceNos;
          if (n !== m && invoice === invoices) {
            this.$message({
              type: 'error',
              message: '发票号+发票代码不能重复！',
            });
            return false;
          }
        }
      }
      const bPass = this.checkData(index);
      if (bPass && !num) {
        this.debiAbled = false;
        this.$set(this.disabled, index, true);
        this.$set(this.disabledNum, index, true);
        this.isDeleteShow = true;
        for (let j = 0; j < this.disabled.length; j += 1) {
          if (!this.disabled[j]) {
            this.isDeleteShow = false;
          }
        }
      }
      return bPass;
    },
    // 删除主拆分的批号
    batchNoDeletes(index, num, rownum) {
      const ret = '确定删除吗?';
      this.$confirm(ret, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const DeliveryListoNoe = this.NotDeliveryListAll[num];
        const BatchNum = Number(rownum);
        let Nwei = -1;
        let Snum = 0;
        for (let i = 0; i < DeliveryListoNoe.length; i += 1) {
          const NoeBatchNum = DeliveryListoNoe[i].BatchNum;
          const NoeNum = DeliveryListoNoe[i].num;
          if (NoeBatchNum === BatchNum || NoeNum === BatchNum) {
            if (Nwei === -1) {
              Nwei = i;
            }
            Snum += 1;
          }
        }
        this.NotDeliveryListAll[num].splice(Nwei, Snum);
        this.GrugsListAll[num].splice(Nwei, Snum);
        for (let i = 0; i < this.NotDeliveryListAll[num].length; i += 1) {
          this.batchNo[num][i] = this.NotDeliveryListAll[num][i].batchNo;
          this.makeDate[num][i] = this.NotDeliveryListAll[num][i].makeDate;
          this.validDate[num][i] = this.NotDeliveryListAll[num][i].validDate;
          this.drugsReportFile[num][i] = this.NotDeliveryListAll[num][i].drugsReportFile;
        }
        this.countAmount(this.NotDeliveryListAll[num], num, 1);
        if (this.NotDeliveryListAll[num].length === 0) {
          this.SubmitAbled = true;
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 删除批号处理
    DeliveNoDelete(data, index) {
      const DeliveryListoNoe = this.NotDeliveryListAll[index];
      const BatchNum = Number(DeliveryListoNoe[data].BatchNum);
      const purchaseNum = Number(DeliveryListoNoe[data].purchaseNum);
      this.NotDeliveryListAll[index].splice(data, 1);
      this.GrugsListAll[index].splice(data, 1);
      let num = 0;
      let pasce = 0;
      for (let i = 0; i < DeliveryListoNoe.length; i += 1) {
        if (Number(DeliveryListoNoe[i].BatchNum) === BatchNum) {
          pasce = Number(pasce) + Number(DeliveryListoNoe[i].drugsNum);
          if (BatchNum === Number(DeliveryListoNoe[i].num)) {
            num = i;
          }
        }
      }
      if (pasce < purchaseNum) {
        this.NotDeliveryListAll[index][num].RowDisabled = false;
      } else {
        this.NotDeliveryListAll[index][num].RowDisabled = true;
      }
    },
    // 拆分批号
    DeliverBatchNo(data, index) {
      const BatchList = Object.assign({}, this.NotDeliveryListAll[index][data]);
      let BatchNumAll = 0;
      let num = 0;
      const DeliveryListoNoe = this.NotDeliveryListAll[index];
      for (let i = 0; i < DeliveryListoNoe.length; i += 1) {
        if (Number(DeliveryListoNoe[i].BatchNum) === Number(DeliveryListoNoe[data].num)) {
          BatchNumAll = Number(BatchNumAll) + Number(DeliveryListoNoe[i].drugsNum);
          num += 1;
        }
      }
      BatchList.drugsNum = Number(BatchList.purchaseNum) - Number(BatchNumAll);
      BatchList.BatchNum = Number(BatchList.num);
      BatchList.num = '';
      BatchList.batchNo = '';
      BatchList.makeDate = '';
      BatchList.validDate = '';
      BatchList.drugsReportFile = '';
      BatchList.operate = true;
      this.NotDeliveryListAll[index].splice(num + data, 0, BatchList);
      const GrugsOne = Object.assign({}, this.GrugsListAll[index][data]);
      this.GrugsListAll[index].splice(num + data, 0, GrugsOne);
    },
    // 控制是否可以拆分
    DeliverDisabled(data, index) {
      let num = 0;
      const DeliveryListoNoe = this.NotDeliveryListAll[index];
      for (let i = 0; i <= data[0]; i += 1) {
        if (Number(DeliveryListoNoe[i].BatchNum) === Number(DeliveryListoNoe[data[0]].BatchNum)) {
          num += 1;
        }
      }
      this.NotDeliveryListAll[index][(data[0] + 1) - num].RowDisabled = data[1];
      const BatchNum = Number(DeliveryListoNoe[data[0]].BatchNum);
      const purchaseNum = Number(DeliveryListoNoe[data[0]].purchaseNum);
      let key = 0;
      let pasce = 0;
      for (let i = 0; i < DeliveryListoNoe.length; i += 1) {
        if (Number(DeliveryListoNoe[i].BatchNum) === BatchNum) {
          pasce = Number(pasce) + Number(DeliveryListoNoe[i].drugsNum);
          if (BatchNum === Number(DeliveryListoNoe[i].num)) {
            key = i;
          }
        }
      }
    },
    // 删除按钮
    dialogDelete(index) {
      const ret = '确定删除吗?';
      this.$confirm(ret, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.SubmitAbled = false;
        this.dialogUpdate(index);
        this.debiAbled = false;
        this.NotDeliveryListAll.splice(index, 1);
        this.disabled.splice(index, 1);
        this.disabledNum.splice(index, 1);
        const amount = this.Order_PlanfromEdit.amount;
        const taxesAmount = this.tradefrom[index].taxesAmount;
        this.Order_PlanfromEdit.amount = (Number(amount) - Number(taxesAmount)).toFixed(2);
        this.tradefrom.splice(index, 1);
        this.passAmount.splice(index, 1);
        this.batchNo.splice(index, 1);
        this.validDate.splice(index, 1);
        this.drugsReportFile.splice(index, 1);
        this.makeDate.splice(index, 1);
        this.uploadData.splice(index, 1);
        this.isDeleteShow = true;
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 编辑按钮
    dialogUpdate(index) {
      this.$set(this.disabled, index, false);
      this.debiAbled = true;
      this.isDeleteShow = false;
    },
    // 校验内容是否可以发货
    checkData(index) {
      let preces = 0;
      let num = 0;
      let purchase = 0;
      let batchNoNum = 0;
      let drugsNumNum = 0;
      const DeliveryOne = this.NotDeliveryListAll[index];
      for (let i = 0; i < DeliveryOne.length; i += 1) {
        if (DeliveryOne[i].batchNo) {
          batchNoNum += 1;
        }
        if (DeliveryOne[i].drugsNum) {
          drugsNumNum += 1;
        }
      }
      for (let i = 0; i < DeliveryOne.length; i += 1) {
        num = 0;
        preces = 0;
        if (DeliveryOne[i].num) {
          preces = Number(DeliveryOne[i].purchaseNum);
          for (let n = 0; n < DeliveryOne.length; n += 1) {
            if (DeliveryOne[i].num === DeliveryOne[n].BatchNum) {
              const Delivery = DeliveryOne[n];
              purchase += (Number(Delivery.drugsNum) * Number(Delivery.hospitalUnitPrice));
              num += Number(DeliveryOne[n].drugsNum);
              // if (!Number(DeliveryOne[n].drugsNum)) {
              //   this.$message({
              //     type: 'error',
              //     message: '发货数量不能为0或者为空',
              //   });
              //   return false;
              // }
              if (drugsNumNum === 0) {
                this.$message({
                  type: 'error',
                  message: '至少有一条发货数量不能为空',
                });
                return false;
              }
              // if (!DeliveryOne[n].batchNo) {
              //   this.$message({
              //     type: 'error',
              //     message: '批号不能为空',
              //   });
              //   return false;
              // }
              if (batchNoNum === 0) {
                this.$message({
                  type: 'error',
                  message: '至少有一条批号不能为空',
                });
                return false;
              }
            }
          }
          if (preces < num) {
            this.$message({
              type: 'error',
              message: '可发货数量不足',
            });
            return false;
          }
        }
      }
      return true;
    },
    // 确认发货按钮
    dataSubmit() {
      const deliveryPerson = this.Order_PlanfromEdit.sendPerson;
      const deliveryPhone = this.Order_PlanfromEdit.sendPhone;
      if ((deliveryPerson === '' || deliveryPerson === null) && (deliveryPhone === '' || deliveryPhone === null)) {
        this.$message({
          type: 'error',
          message: '联系人和联系电话不能为空',
        });
        return;
      }
      if (deliveryPerson === '' || deliveryPerson === null) {
        this.$message({
          type: 'error',
          message: '联系人不能为空',
        });
        return;
      }
      if (deliveryPhone === '' || deliveryPhone === null) {
        this.$message({
          type: 'error',
          message: '联系电话不能为空',
        });
        return;
      }
      let bPass = true;
      for (let i = 0; i < this.NotDeliveryListAll.length; i += 1) {
        if (!this.dialogConfirm(i, 1)) {
          bPass = false;
        }
      }
      const tmsInvoiceFormLists = [];
      let amounts = 0;
      if (bPass) {
        this.loading = true;
        for (let i = 0; i < this.NotDeliveryListAll.length; i += 1) {
          const datelist = [];
          for (let y = 0; y < this.NotDeliveryListAll[i].length; y += 1) {
            datelist[y] = Object.assign({}, this.NotDeliveryListAll[i][y]);
            let infos = [];
            infos = datelist[y].batchNo.split('$');
            datelist[y].batchId = Number(infos[0]);
            datelist[y].batchNo = infos[1];
          }
          const dataListChoose = [];
          for (let m = 0; m < datelist.length; m += 1) {
            if (datelist[m].batchNo && datelist[m].drugsNum) {
              dataListChoose.push(datelist[m]);
            }
          }
          tmsInvoiceFormLists[i] = {
            invoiceCode: this.tradefrom[i].invoiceCode,
            invoiceNo: this.tradefrom[i].invoiceNo,
            taxesAmount: this.tradefrom[i].taxesAmount,
            invoiceScan: this.tradefrom[i].invoiceScan,
            discountAmount: this.tradefrom[i].outAmount,
            tmsInvoiceItemFormList: dataListChoose,
          };
          amounts += Number(tmsInvoiceFormLists[i].taxesAmount);
        }
        if (this.Order_PlanfromEdit.sendNoOut === ' ') {
          this.Order_PlanfromEdit.sendNoOut = '';
        }
        const info = this.Order_PlanfromEdit.hospitalMemberName.split('-');
        const MemberId = !info[0] || info[0] === 'null' ? '' : info[0];
        const receiveAddress = JSON.parse(this.Order_PlanfromEdit.receiveAddress);
        const from = {
          amount: amounts,
          deliveryAddress: receiveAddress[1],
          deliveryPerson: this.Order_PlanfromEdit.sendPerson,
          deliveryPhone: this.Order_PlanfromEdit.sendPhone,
          gpoMemberId: this.getGpoId,
          ordersId: this.$route.query.id,
          sendNoOut: this.Order_PlanfromEdit.sendNoOut,
          hospitalMemberId: MemberId,
          billAccessories: this.Order_PlanfromEdit.scanFile,
          tmsInvoiceFormList: tmsInvoiceFormLists,
        };
        DeliverBillList.delivery(from).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '发货成功',
            });
            history.back();
            this.$bus.$emit('data/list');
            this.closeDialog();
          } else {
            this.$message({
              type: 'error',
              message: res.data.message,
            });
          }
          this.loading = false;
        });
      }
    },
    // 关闭窗口
    closeDialog() {
      this.DeliveryShow([false, 'DeliveryShow']);
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
    ...mapActions([
      'ControltradeBtn',
      'TableHeightRun',
      'GetItemDate',
      'TradeSelect',
      'Initialize',
      'CountNum',
      'DeleteItem',
      'ItemList',
      'GetDetailDate',
      'DeliveryShow',
      'NewGrugsList',
    ]),
  },
};
</script>
<style>
.delivery-table .el-dialog__wrapper {
  overflow: unset;
}
.delivery-table .el-dialog {
  top: 10% !important;
}
.delivery-table .el-input.is-disabled .el-input__inner {
  color: #000;
}
.del-table {
  margin-top: -10px;
  padding-top: 10px;
  border: solid 1px #c1c1c1;
}

.del-table .table-button {
  float: left;
  margin-top: 16px;
  margin-left: 15px;
  margin-bottom: 10px;
}

.del-table .from-table {
  margin: -20px auto 0 auto;
  width: 98%;
}
.dialog-from {
  margin-top: 30px;
}
.trade-table .fromtrade-div {
  height: inherit;
  overflow-y: auto;
  padding: 10px 0 5px 0;
  border: none;
}
.delivery-table .el-upload-list li {
  width: 180px !important;
}
.form-loadedit .el-pload-edit .file-list-preview {
  margin-left: 140px !important;
  margin-top: -53px !important;
}
.delivery-table .file-list-preview .el-loading-spinner .el-loading-text {
  margin-top: -23px !important;
}
</style>
