<template>
  <div v-loading="loading">
    <el-form :rules="editMessage.rules" label-width="100px" id="from-item">
      <TradeEditsForm :from-edit="Order_PlanfromEdit" :message="editMessage" :isGoBackShow="false" :bility-show="false" :arrow-num=3 :arrow-down="true" @show-more="showMore">
      </TradeEditsForm>
    </el-form>
    <div>
      <el-table :data="Order_PlanItemList" stripe border fit :height="View_TableHeight">
        <el-table-column prop="num" label="#" width="40" show-overflow-tooltip fixed="left" class-name="table_right_fixed"></el-table-column>
        <el-table-column prop="ordersCode" min-width="135" label="订单编号" sortable show-overflow-tooltip>
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
        <el-table-column align="right" prop="unitName" min-width="60" label="单位" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="batchNo" min-width="120" label="批号" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="right" prop="hospitalUnitPrice" min-width="70" label="单价" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="right" prop="drugsNum" min-width="80" label="发货数量" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="right" min-width="90" label="金额" sortable show-overflow-tooltip>
          <template scope="scope">
            <p>{{Number(scope.row.amount).toFixed(2)}}</p>
          </template>
        </el-table-column>
        <el-table-column min-width="80" label="药检报告" sortable show-overflow-tooltip>
          <template scope="scope">
            <YuploadFiles :data="convert.getJSON(scope.row.drugsReportFile)"></YuploadFiles>
          </template>
        </el-table-column>
        <el-table-column prop="makeDate" min-width="100" height="20px" label="生产日期" sortable show-overflow-tooltip>
          <template scope="scope">
            <p>{{scope.row.makeDate?convertDate(scope.row.makeDate):''}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="validDate" min-width="100" height="20px" label="有效日期" sortable show-overflow-tooltip>
          <template scope="scope">
            <p>{{scope.row.validDate?convertDate(scope.row.validDate):''}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="producerName" min-width="180" label="生产企业" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="salerMemberName" min-width="180" label="卖方会员" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="approvalNumber" min-width="130" label="批准文号" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="invoiceNumber" min-width="80" label="发票号" sortable show-overflow-tooltip align="center">
          <template scope="scope">
            <el-button type="text" size="small" @click="InvoiceCreat(scope.row.deliverItemNo)">
              <!--<i class="icon iconfont icon-chakan" style="font-size: 12px"></i>查看-->
              查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="ordersItemNo" min-width="160" label="订单明细编号" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="contractCode" min-width="120" label="合同编号" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="contractItemNo" min-width="135" label="合同明细编号" sortable show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-footer">
      <div style="float: left;padding-right: 15px;padding-left: 63%">
        <span>总数量：</span>{{Order_purchaseNum}} </div>
      <div style="float: left">
        <span style="">总金额：</span>{{Number(purchaseAmount).toFixed(2)}}
        <span>元</span>
      </div>
    </div>
    <InvoiceNumberTable :options="InvoiceOptions" @dialog-hide="InvoiceHide"></InvoiceNumberTable>
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
import InvoiceNumberTable from './InvoiceNumberTable';                    // 引入发票明细弹出框

export default {
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.dataList();
    });
  },
  computed: mapGetters([
    'Order_purchaseAmount',
    'Order_PlanItemList',
    'Order_purchaseNum',
    'View_TableHeight',
    'Order_PlanfromEdit',
  ]),
  components: {
    InvoiceNumberTable,
    TradeEditsForm,
  },
  data() {
    return {
      purchaseAmount: 0,
      tableTitle: '添加明细',
      editMessage: {
        tabTitle: '',
        selects: [
          { label: '配送单编号', key: 'code', type: 'el-input', placeholder: '请输入配送单编号', isReadonly: true },
          { label: '创建人', key: 'createBy', type: 'el-input', placeholder: '请输入创建人', isReadonly: true },
          { label: '条码号', key: 'sendNoOut', type: 'el-input', placeholder: '请输入条码号', isReadonly: true },
          { key: 'type', type: 'el-form-item', span: 6, md: 0, sm: 0, xs: 0 },
          { label: '配送企业', key: 'deliveryMemberName', type: 'el-input', placeholder: '请输入配送企业', isReadonly: true },
          { label: '联系人', key: 'deliveryPerson', type: 'el-input', placeholder: '请输入联系人', isReadonly: true },
          { label: '发货联系人', key: 'sendPerson', type: 'el-input', placeholder: '请输入联系人', isReadonly: true },
          { key: 'type', type: 'el-form-item', span: 6, md: 0, sm: 0, xs: 0 },
          { label: '医疗机构', key: 'hospitalMemberName', type: 'el-input', placeholder: '请输入医疗机构名称', isReadonly: true, noClearable: true },
          { label: '联系人', key: 'hospitalPerson', type: 'el-input', placeholder: '请输入联系人', isReadonly: true },
          { label: '备注', key: 'remarks', type: 'el-input', placeholder: '请输入备注', fromType: 'textarea', fromStyle: 'style1', rows: 1, isReadonly: true },
          { label: '收货地址', key: 'deliveryAddress', type: 'el-select', placeholder: '请输入收货地址', fromStyle: 'style1', option: 'addressOption', span: 15, isReadonly: true, noClearable: true },
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
      loading: false,
      active: 1,   // 订单状态
    };
  },
  methods: {
    //  json字符串转json，否则还是返回字符串
    toJSON(str) {
      return convert.toJSON(str);
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
    // 重新计算表格高度
    showMore() {
      this.$nextTick(() => {
        this.TableHeightRun(['#from-item', '.TradeFooter', 200]);
      });
    },
    // 获取数据列表
    dataList() {
      this.loading = true;
      DeliverBillList.item(this.$route.query.id)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            let planBackoutStatus = false;
            if (Number(data.undoNum) === 0) {
              planBackoutStatus = true;
            }
            const btnDisabled = {
              planBackout: planBackoutStatus,
            };
            this.$bus.$emit('data/tradefoot', btnDisabled);
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
            this.$nextTick(() => {
              this.TableHeightRun(['#from-item', '.TradeFooter', 200]);
            });
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
          }
          this.loading = false;
        });
    },
    ...mapActions([
      'TableHeightRun',
      'GetItemDate',
      'Initialize',
      'DeleteItem',
      'ItemList',
    ]),
  },
};
</script>
