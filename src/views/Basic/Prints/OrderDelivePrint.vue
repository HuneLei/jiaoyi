<template>
  <div>
    <div class="delive-print page-break">
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
                          <h2>订单(配送企业)</h2></td>
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
                  <td>订单编号: {{Order_PlanfromEdit.code}}</td>
                  <td>订单类型: {{Order_PlanfromEdit.type}}</td>
                </tr>
                <tr>
                  <td>创建人: {{Order_PlanfromEdit.createBy}}</td>
                  <td>创建时间: {{Order_PlanfromEdit.createTime}}</td>
                </tr>
                <tr>
                  <td>医疗机构: {{Order_PlanfromEdit.hospitalMemberName}}</td>
                  <td>联系人: {{Order_PlanfromEdit.hospitalPerson}}</td>
                </tr>
                <!--<tr>
                  <td>发货联系人: {{Order_PlanfromEdit.sendPerson}}</td>
                </tr>-->
                <tr>
                  <td colspan="3">收货地址: {{Order_PlanfromEdit.receiveAddress}}</td>
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
                  <th width="1%" style="white-space:nowrap">序号</th>
                  <th width="12%">药品编码</th>
                  <th width="10%" style="white-space:nowrap">通用名</th>
                  <th width="6%" style="white-space:nowrap">剂型</th>
                  <th width="6%" style="white-space:nowrap">规格</th>
                  <th width="12%">包装规格</th>
                  <th width="3%" style="white-space:nowrap">单位</th>
                  <th width="6%" style="white-space:nowrap" align="center">单价</th>
                  <th width="6%" style="white-space:nowrap" align="center">订单数量</th>
                  <th width="8%" align="center">金额</th>
                  <th width="12%">生产企业</th>
                  <th width="6%" style="white-space:nowrap">商品名</th>
                  <th width="12%">批准文号</th>
                </tr>
                </thead>
                <tbody>
                <tr class="table_data_title" v-for="(value, item) in Order_PlanItemList">
                  <td width="1%">{{Order_PlanItemList[item].num}}</td>
                  <td width="12%">{{Order_PlanItemList[item].drugsCode}}</td>
                  <td width="10%">{{Order_PlanItemList[item].drugsName}}</td>
                  <td width="6%" nowrap="nowrap">{{Order_PlanItemList[item].formName}}</td>
                  <td width="6%">{{Order_PlanItemList[item].specName}}</td>
                  <td width="12%">{{Order_PlanItemList[item].packSpecName}}</td>
                  <td width="3%">{{Order_PlanItemList[item].unitName}}</td>
                  <td width="6%" align="center">{{Number(Order_PlanItemList[item].hospitalUnitPrice).toFixed(2)}}</td>
                  <td width="6%" align="center">{{Order_PlanItemList[item].ordersNum}}</td>
                  <td width="8%" align="center">{{Number(Order_PlanItemList[item].purchaseAmount).toFixed(2)}}</td>
                  <td width="12%">{{Order_PlanItemList[item].producerName}}</td>
                  <td width="6%" nowrap="nowrap">{{Order_PlanItemList[item].tradeName}}</td>
                  <td width="12%">{{Order_PlanItemList[item].approvalNumber}}</td>
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
                    <span>{{purchaseNum}}</span>
                  </td>
                  <td width="10%" align="right">总金额：</td>
                  <td width="95%">
                    <span style="color: red">{{Number(purchaseAmount).toFixed(2)}}</span> 元
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
  import DeliveryOrdersList from '../../../api/Order/DeliveryOrdersList';   // 订单(配送企业api)
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
        purchaseNum: 0,
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
        this.loading = true;
        DeliveryOrdersList.item(this.$route.query.id)
          .then((res) => {
            if (res.data.code === 0) {
              const data = res.data.result;
              const itemList = {
                id: data.id,
                code: data.code,
                type: data.type === 0 ? '普通订单' : '加急订单',
                status: data.status,
                remarks: data.remarks,
                createBy: data.createBy,
                createTime: this.convertDate(data.createTime),
                hospitalMemberName: data.hospitalMemberName,
                hospitalPerson: `${data.hospitalPerson || ''} ${data.hospitalPhone || ''}`,
                hospitalPhone: data.hospitalPhone,
                deliveryMemberName: data.deliveryMemberName,
                dPerson: data.deliveryPerson,
                deliveryPerson: `${data.deliveryPerson || ''} ${data.deliveryPhone || ''}`,
                deliveryPhone: data.deliveryPhone,
                deliveryMemberId: data.deliveryMemberId,
                sendPerson: data.deliverPerson,
                sendPhone: data.deliverPhone,
                amount: 0,
                receiveAddress: data.receiveAddress,
              };
              this.ItemList(itemList);
              data.tmsOrdersItemOutputList.item = 0;
              const content = data.tmsOrdersItemOutputList;
              console.log('content', content);
              this.purchaseNum = 0;
              this.purchaseAmount = 0;
              for (let i = 0; i < content.length; i += 1) {
                this.purchaseNum += Number(content[i].ordersNum);
                this.purchaseAmount += Number(content[i].purchaseAmount);
              }
              this.GetItemDate(content);
            }
            this.loading = false;
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
