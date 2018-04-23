<template>
  <div class="delive-print">
    <!--<el-row class="drow">
      <el-col :span="12" class="dfcol">
        <svg id="printcode"></svg>
      </el-col>
    </el-row>-->
    <div id="delivePrint">
      <el-form label-width="100px" class="print-form">
        <TradeEditsForm :from-edit="Order_PlanfromEdit" :message="editMessage" :bility-show="false" :isGoBackShow="false">
        </TradeEditsForm>
      </el-form>
      <div class="print-table">
        <el-table :data="Order_PlanItemList" border :height="200">
          <el-table-column prop="num" label="#" width="30"></el-table-column>
          <el-table-column prop="ordersCode" label="配送单号" width="95">
          </el-table-column>
          <el-table-column prop="drugsCode" label="药品编码" width="70">
          </el-table-column>
          <el-table-column prop="drugsName" label="通用名" width="60">
          </el-table-column>
          <el-table-column prop="drugsName" label="批号" width="60">
          </el-table-column>
          <el-table-column prop="formName" label="剂型" width="50">
          </el-table-column>
          <el-table-column prop="specName" label="规格" width="45">
          </el-table-column>
          <el-table-column prop="packSpecName" label="包装规格" width="60">
          </el-table-column>
          <el-table-column prop="unitName" label="单位" width="40">
          </el-table-column>
          <!--<el-table-column align="right" prop="hospitalUnitPrice" label="含税单价" width="40">
          </el-table-column>
          <el-table-column align="right" prop="drugsNum" label="未开票数量" width="40">
          </el-table-column>
          <el-table-column align="right" label="含税金额" width="40">
            <template scope="scope">
              <p>{{Number(scope.row.amount).toFixed(2)}}</p>
            </template>
          </el-table-column>-->
          <!--<el-table-column prop="makeDate" label="生产日期">-->
            <!--<template scope="scope">-->
              <!--<p>{{scope.row.makeDate?convertDate(scope.row.makeDate):''}}</p>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column prop="validDate" label="有效日期">-->
            <!--<template scope="scope">-->
              <!--<p>{{scope.row.validDate?convertDate(scope.row.validDate):''}}</p>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column prop="producerName" label="生产企业" width="130">
          </el-table-column>
          <el-table-column prop="tradeName" label="卖方会员" width="100">
          </el-table-column>
          <el-table-column prop="approvalNumber" label="批准文号" width="60">
          </el-table-column>
          <el-table-column prop="approvalNumber" label="订单编号" width="60">
          </el-table-column>
        </el-table>
      </div>
      <div class="table-footer">
        <div style="float: left;padding-right: 15px;padding-left: 63%">
          <span>总数量：</span>{{Order_purchaseNum}} </div>
        <div style="float: left">
          <span style="">总金额：</span>{{Number(purchaseAmount).toFixed(2)}} <span>元</span>
        </div>
      </div>
    </div>
    <div class="foot-button not-print">
      <el-button size="large" class="not-print" type="primary" @click.native="dataSubmit">点击打印</el-button>
    </div>
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
  import DeliverBillList from '../../../api/Deliverbill/DeliverBillList';   // 订单(配送企业api)
  import convert from '../../../utils/convert';                             // 引入js公共方法
  import InvoiceList from '../../../api/Invoice/InvoiceList';
  
  export default {
    computed: mapGetters([
      'Order_purchaseAmount',
      'Order_PlanItemList',
      'Order_purchaseNum',
      'View_TableHeight',
      'Order_PlanfromEdit',
    ]),
    components: {
      TradeEditsForm,
    },
    data() {
      return {
        purchaseAmount: 0,
        tableTitle: '添加明细',
        editMessage: {
          tabTitle: '',
          selects: [
            { label: '发票代码', key: 'code', type: 'el-input', placeholder: '请输入配送单编号', isReadonly: true, span: 12, xs: 12 },
            { label: '发票号', key: 'code', type: 'el-input', placeholder: '请输入配送单编号', isReadonly: true, span: 12, xs: 12 },
            { label: '创建人', key: 'createBy', type: 'el-input', placeholder: '请输入创建人', isReadonly: true, span: 12, xs: 12 },
            { label: '发票类型', key: 'deliveryMemberName', type: 'el-input', placeholder: '请输入配送企业', isReadonly: true, span: 12, xs: 12 },
            { label: '开票日期', key: 'deliveryPerson', type: 'el-input', placeholder: '请输入联系人', isReadonly: true, span: 12, xs: 12 },
            { label: '医疗机构', key: 'hospitalMemberName', type: 'el-input', placeholder: '请输入医疗机构名称', isReadonly: true, noClearable: true, span: 12, xs: 12 },
            { label: '联系人', key: 'hospitalPerson', type: 'el-input', placeholder: '请输入联系人', isReadonly: true, span: 12, xs: 12 },
            { label: '备注', key: 'remarks', type: 'el-input', placeholder: '请输入备注', fromType: 'textarea', fromStyle: 'style1', rows: 1, isReadonly: true, span: 12, xs: 12 },
          ],
          styleObject: {},
          parameters: {},
          options: {
            typeOption: [],
            addressOption: [],
          },
          radios: {},
          rules: {},
        },
        InvoiceOptions: {
          msgBase: '',                        //  没什么卵用，有需要可以看看
          isShowDialog: false,                //  显示弹框
          tableSelected: [],                //  默认表格选中
          tableType: 1,                       //  0 单选，1 多选 默认单选
          ItemNo: '',
        },
        active: 1,   // 订单状态
      };
    },
    mounted() {
      this.dataList();
    },
    methods: {
      dataSubmit() {
        window.print();
      },
      // 查看发票号
      InvoiceCreat(ItemNo) {
        this.InvoiceOptions.isShowDialog = true;
        this.InvoiceOptions.ItemNo = ItemNo;
      },
      // 关闭弹出框
      InvoiceHide() {
        this.InvoiceOptions.isShowDialog = false;
      },
      // 转换日期 YYYY-MM-DD
      convertDate(str) {
        return convert.convertDate(str);
      },
      // 获取数据列表
      dataList() {
        InvoiceList.itemInfo(this.$route.query.id)
          .then((res) => {
            if (res.data.code === 0) {
              const data = res.data.result;
              const itemList = {
                id: data.id,
                code: data.code,
                type: data.type === 0 ? '普通订单' : '加急订单',
                remarks: data.remarks ? data.remarks : '',
                createBy: `${data.createBy || ''} ${data.createTime || ''}`,
                createTime: data.createTime,
                hospitalMemberName: data.hospitalMemberName,
                hospitalPerson: `${data.hospitalPerson || ''} ${data.hospitalPhone || ''}`,
                hospitalPhone: data.hospitalPhone,
                deliveryMemberName: data.deliveryMemberName,
                deliveryPerson: `${data.deliveryPerson || ''} ${data.deliveryPhone || ''}`,
                deliveryPhone: data.deliveryPhone,
                deliveryAddress: data.deliveryAddress,
                sendNoOut: data.sendNoOut,
                sendPhone: data.sendPhone,
                sendPerson: `${data.sendPerson || ''} ${data.sendPhone || ''}`,
              };
              this.ItemList(itemList);
              this.purchaseAmount = 0;
              data.tmsDeliverBillsItemOutputList.item = 0;
              const content = data.tmsDeliverBillsItemOutputList;
              for (let i = 0; i < data.tmsDeliverBillsItemOutputList.length; i += 1) {
                const drugsNum = Number(content[i].drugsNum);
                content[i].purchaseNum = drugsNum;
                content[i].purchasableNum = drugsNum;
                this.purchaseAmount += Number(content[i].amount);
              }
              this.GetItemDate(content);
              convert.JsBarcode('#printcode', `${this.Order_PlanfromEdit.sendNoOut}`, {
                format: 'code128',
                height: 60,
                fontSize: 18,
              });
            }
          });
      },
      ...mapActions([
        'TableHeightRun',
        'GetItemDate',
        'TradeSelect',
        'Initialize',
        'DeleteItem',
        'ItemList',
      ]),
    },
  };
</script>
<style>
  html {
    background-color: #f0f0f0;
  }
  #delivePrint .el-table .cell {
    white-space: pre-wrap;
    font-size: 10px;
  }
  #delivePrint .fromtrade-div {
    border: none;
  }
  #delivePrint {
    padding: 0 20px 20px 20px;
    border-top: 1px solid rgb(228, 232, 239);
  }
  .foot-button {
    padding: 15px 0;
    border-top: 1px solid #e8e8e8;
    background-color: #fafafa;
    text-align: center;
  }
  .table-footer {
    background-color: rgb(225, 226, 228);
    width: 100%;
    height: 18px;
    font-size: 12px;
    color: red;
  }
  .print-form {
    margin-left: -20px;
  }
  .table-footer span {
    font-weight: bold;
    color: #64676b !important;
  }
  .print-table {
    margin-top: -50px;
    width: 100%;
  }
  .print-table .el-table__body-wrapper {
    overflow: visible;
  }
  .dfcol {
    margin-top: 5px;
    margin-left: 10px;
  }
  .delive-print {
    margin: 30px auto;
    width: 900px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
  .dmcol {
    margin: 20px 0 0 20px;
  }
  @media print {
    .not-print {
      display: none;
    }
    .delive-print .el-table {
      height: auto!important;
    }
    .delive-print {
      width: 100%
    }
    .app-print {
      min-width: 100%;
    }
  }
</style>
