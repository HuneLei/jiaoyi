<template>
  <div>
    <div class="delive-print page-break">
      <el-row>
        <el-col :span="12" class="dfcol">
          <svg id="printcode"></svg>
        </el-col>
      </el-row>
      <div align="center">
        <div id="print1">
          <table class="table_frame" border="0" cellspacing="0" cellpadding="0" width="95%" align="center">
          <tbody>
          <tr>
            <td>
              <table border="0" cellspacing="0" cellpadding="0" width="100%" style="margin-top: 10px;">
                <tbody>
                <tr>
                  <td>
                    <table border="0" cellspacing="0" cellpadding="0" width="100%">
                      <tbody>
                      <tr>
                        <td></td>
                        <td width="80%">
                          <h2>配送单</h2></td>
                        <td width="20%" align="right">
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td class="td_frame" style="padding-top: 5px;">
              <table border="0" cellspacing="0" cellpadding="0" width="100%" align="center">
                <tbody>
                <tr>
                  <td>配送单编号: {{Order_PlanfromEdit.code}}</td>
                  <td>条码号: {{Order_PlanfromEdit.sendNoOut}}</td>
                </tr>
                <tr>
                  <td>创建人: {{Order_PlanfromEdit.createBy}}</td>
                  <td>创建时间: {{Order_PlanfromEdit.createTime}}</td>
                </tr>
                <tr>
                  <td>配送企业: {{Order_PlanfromEdit.deliveryMemberName}}</td>
                  <td>联系人: {{Order_PlanfromEdit.deliveryPerson}}</td>
                </tr>
                <tr>
                  <td>医疗机构: {{Order_PlanfromEdit.hospitalMemberName}}</td>
                  <td>联系人: {{Order_PlanfromEdit.hospitalPerson}}</td>
                </tr>
                <tr>
                  <td>发货联系人: {{Order_PlanfromEdit.sendPerson}}</td>
                </tr>
                <tr>
                  <td colspan="3">备注: {{Order_PlanfromEdit.remarks}}</td>
                </tr>
                <tr>
                  <td colspan="3">收货地址: {{Order_PlanfromEdit.deliveryAddress}}</td>
                </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td class="td_frame1" style="padding-top: 10px;">
              <table border="1 solid" cellspacing="0" cellpadding="0" width="100%" align="center" style="margin: 0;padding: 0;">
                <thead>
                <tr>
                  <th width="1%">序号</th>
                  <th width="5%" style="white-space:nowrap">订单编号</th>
                  <th width="6%">药品编码</th>
                  <th width="6%" style="white-space:nowrap">通用名</th>
                  <th width="6%">剂型</th>
                  <th width="6%">规格</th>
                  <th width="6%">包装规格</th>
                  <th width="3%">单位</th>
                  <th width="6%" nowrap="nowrap">批号</th>
                  <th width="3%">单价</th>
                  <th width="3%">数量</th>
                  <th width="3%">金额</th>
                  <th width="10%" style="white-space:nowrap">生产企业</th>
                  <th width="6%">商品名</th>
                  <th width="5%">批准文号</th>
                </tr>
                </thead>
                <tbody>
                <tr class="table_data_title" v-for="(value, item) in Order_PlanItemList">
                  <td width="1%">{{Order_PlanItemList[item].num}}</td>
                  <td width="5%" style="word-break:break-all">{{Order_PlanItemList[item].ordersCode}}</td>
                  <td width="6%">{{Order_PlanItemList[item].drugsCode}}</td>
                  <td width="6%">{{Order_PlanItemList[item].drugsName}}</td>
                  <td width="6%">{{Order_PlanItemList[item].formName}}</td>
                  <td width="6%">{{Order_PlanItemList[item].specName}}</td>
                  <td width="6%">{{Order_PlanItemList[item].packSpecName}}</td>
                  <td width="3%">{{Order_PlanItemList[item].unitName}}</td>
                  <td width="6%" nowrap="nowrap">{{Order_PlanItemList[item].batchNo}}</td>
                  <td width="3%">{{Number(Order_PlanItemList[item].hospitalUnitPrice).toFixed(2)}}</td>
                  <td width="3%">{{Order_PlanItemList[item].drugsNum}}</td>
                  <td width="3%">{{Number(Order_PlanItemList[item].amount).toFixed(2)}}</td>
                  <td width="10%">{{Order_PlanItemList[item].producerName}}</td>
                  <td width="6%">{{Order_PlanItemList[item].tradeName}}</td>
                  <td width="5%">{{Order_PlanItemList[item].approvalNumber}}</td>
                </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td class="td_frame">
              <table border="0" cellspacing="0" cellpadding="0" width="100%" align="center">
                <tbody>
                <tr>
                  <td width="66%" align="right">总数量： </td>
                  <td width="8%" style="color: red">
                    <span>{{Order_purchaseNum}}</span>
                  </td>
                  <td width="10%" align="right">总金额：</td>
                  <td width="95%">
                    <span style="color: red">{{Number(Order_purchaseAmount).toFixed(2)}}</span> 元
                  </td>
                </tr>
                </tbody>
              </table>
            </td>
          </tr>
          </tbody>
        </table>
        </div>
      </div>
      <div id="delivePrint">
      </div>
      <div class="foot-button not-print">
        <el-button size="large" class="not-print" type="primary" @click.native="dataSubmit">点击打印</el-button>
      </div>
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
      };
    },
    mounted() {
      this.dataList();
    },
    methods: {
      dataSubmit() {
        window.print();
      },
      // 转换日期 YYYY-MM-DD
      convertDate(str) {
        return convert.convertDate(str);
      },
      // 获取数据列表
      dataList() {
        DeliverBillList.item(this.$route.query.id)
          .then((res) => {
            if (res.data.code === 0) {
              const data = res.data.result;
              const itemList = {
                id: data.id,
                code: data.code,
                type: data.type === 0 ? '普通订单' : '加急订单',
                remarks: data.remarks ? data.remarks : '',
                createBy: data.createBy,
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
              let widths = 2;
              const reg = /^\+?[1-9][0-9]*$/;
              const sendNoOut = this.Order_PlanfromEdit.sendNoOut;
              if (sendNoOut.length === 1) {
                widths = 6;
              }
              if (sendNoOut.length === 2 && !reg.test(sendNoOut)) {
                widths = 5;
              }
              if (sendNoOut.length === 2 && reg.test(sendNoOut)) {
                widths = 6;
              }
              if (sendNoOut.length === 3) {
                widths = 4;
              }
              if (sendNoOut.length === 4 && !reg.test(sendNoOut)) {
                widths = 3.5;
              }
              if (sendNoOut.length === 4 && reg.test(sendNoOut)) {
                widths = 5;
              }
              if (sendNoOut.length === 5) {
                widths = 3;
              }
              if (sendNoOut.length === 6 && reg.test(sendNoOut)) {
                widths = 4;
              }
              if (sendNoOut.length === 6 && !reg.test(sendNoOut)) {
                widths = 3;
              }
              if (sendNoOut.length === 7 && reg.test(sendNoOut)) {
                widths = 3;
              }
              if (sendNoOut.length === 7 && !reg.test(sendNoOut)) {
                widths = 2.7;
              }
              if (sendNoOut.length === 8 && reg.test(sendNoOut)) {
                widths = 3;
              }
              if (sendNoOut.length === 8 && !reg.test(sendNoOut)) {
                widths = 2.5;
              }
              if (sendNoOut.length === 9 && !reg.test(sendNoOut)) {
                widths = 2;
              }
              if (sendNoOut.length === 9 && reg.test(sendNoOut)) {
                widths = 2.5;
              }
              if (sendNoOut.length === 10 && !reg.test(sendNoOut)) {
                widths = 2;
              }
              if (sendNoOut.length === 10 && reg.test(sendNoOut)) {
                widths = 3;
              }
              convert.JsBarcode('#printcode', `${this.Order_PlanfromEdit.sendNoOut}`, {
                format: 'code128',
                height: 75,
                fontSize: 25,
                width: widths,
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
  .foot-button {
    padding: 15px 0;
    border-top: 1px solid #e8e8e8;
    background-color: #fafafa;
    text-align: center;
  }
  .dfcol {
    margin-top: 10px;
    margin-left: 30px;
    margin-bottom: -10px;
  }
  .delive-print {
    margin: 20px auto;
    max-width: 900px;
    min-width: 200px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
  .delive-print table {
    display: table;
    border-collapse: collapse;
    border-spacing: 2px;
    border-color: grey;
  }
  .td_frame tr td {
    padding-top: 5px;
    padding-bottom: 4px;
    font-size: 15px;
    color: #655e5e;
  }
  .delive-print td, th {
    display: table-cell;
    vertical-align: inherit;
  }
  .table_data_title td, td {
    font-size: 13px;
  }
  @media print {
    .not-print {
      display: none;
    }
    .delive-print {
      max-width: 100%;
    }
    .app-print {
      min-width: 0;
      position: static;
    }
  }
</style>
