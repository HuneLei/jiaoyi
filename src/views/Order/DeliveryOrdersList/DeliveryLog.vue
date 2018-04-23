<template>
  <div v-loading="loading" style="height: 5.6rem;overflow: auto;">
    <div v-for="(value, index) in Order_GetDelivery" :style="!index?'':'margin-top: 20px'">
      <div>
        <div class="delivery-log1">配送企业：<span style="font-size: 13px;font-weight: 600">{{Order_GetDelivery[index].deliveryMemberName}}</span></div>
        <div class="delivery-log1">配送单号：<span style="font-size: 13px;font-weight: 600">{{Order_GetDelivery[index].code}}</span></div>
        <div class="delivery-log2">随货同行单：<YuploadFiles :data="convert.getJSON(Order_GetDelivery[index].billAccessories)"></YuploadFiles></div>
      </div>
      <el-table :data="Order_GetDelivery[index].tmsDeliverBillsItems" stripe border fit :height="Order_GetDelivery[index].tmsDeliverBillsItems.length*40+40">
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
        <el-table-column prop="approvalNumber" min-width="130" height="20px" label="批准文号" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="producerName" min-width="180" height="20px" label="生产企业" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="salerMemberName" min-width="180" height="20px" label="卖方会员" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="tradeName" min-width="80" height="20px" label="商品名" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="batchNo" min-width="80" height="20px" label="批号" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="drugsNum" align="right" min-width="80" height="20px" label="发货数量" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="right" min-width="80" height="20px" label="单价" sortable show-overflow-tooltip>
          <template scope="scope">
            <p>{{(Number(scope.row.hospitalUnitPrice)).toFixed(2)}}</p>
          </template>
        </el-table-column>
        <el-table-column align="right" min-width="90" label="金额" sortable show-overflow-tooltip>
          <template scope="scope">
            <p>{{(Number(scope.row.hospitalUnitPrice)*Number(scope.row.drugsNum)).toFixed(2)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="invoiceNumber" min-width="80" label="发票号" show-overflow-tooltip align="center">
          <template scope="scope">
            <el-button type="text" size="small" @click="dataCreat(scope.row.deliverItemNo)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <InvoiceNumberTable :options="dialogOptions" @dialog-hide="dialogHide"></InvoiceNumberTable>
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
  import PurchasePlan from '../../../api/Order/PurchasePlan';
  import InvoiceNumberTable from './InvoiceNumberTable';       // 引入发票明细弹出框

  export default {
    components: {
      InvoiceNumberTable,
    },
    computed: mapGetters([
      'View_TableHeight',
      'Order_GetDelivery',
    ]),
    mounted() {},
    data() {
      return {
        loading: false,
        dialogOptions: {
          msgBase: '',                        //  没什么卵用，有需要可以看看
          isShowDialog: false,                //  显示弹框
          tableSelected: [],                  //  默认表格选中
          tableType: 1,                       //  0 单选，1 多选 默认单选
          ItemNo: '',
        },
      };
    },
    methods: {
      // 查看发票号
      dataCreat(ItemNo) {
        this.dialogOptions.isShowDialog = true;
        this.dialogOptions.ItemNo = ItemNo;
      },
      // 关闭弹出框
      dialogHide() {
        this.dialogOptions.isShowDialog = false;
      },
    },
  };
</script>
<style>
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
