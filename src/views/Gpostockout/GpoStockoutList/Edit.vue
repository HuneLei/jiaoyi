<template>
  <div v-loading="loading">
    <el-form :rules="editMessage.rules" label-width="100px" id="from-item">
      <TradeEditsForm :from-edit="fromEdit" :isGoBackShow="false" :message="editMessage" :arrow-num=3 :arrow-down="true" @show-more="tableHeightRun">
        <el-form-item label="随货同行单附件" slot="orderFile">
          <YuploadFiles :data="convert.getJSON(this.orderFile)"></YuploadFiles>
        </el-form-item>
      </TradeEditsForm>
    </el-form>
    <div>
      <el-table :data="tableData" stripe border fit :height="tableHeight" @sort-change="sortChange">
        <el-table-column prop="num" label="#" fixed="left" width="40" :formatter="sortTable"></el-table-column>
        <el-table-column prop="purchaseCode" min-width="120" label="采购单编号" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="drugsCode" min-width="120" label="药品编码" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="drugsName" min-width="120" label="通用名" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="formName" min-width="80" label="剂型" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="specName" min-width="80" label="规格" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="packSpecName" min-width="100" label="包装规格" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="unitName" min-width="60" label="单位" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="batchNo" min-width="120" label="批号" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="minUnitPrice" min-width="70" label="单价" align="right" sortable show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.minUnitPrice.toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column prop="stockoutNum" min-width="80" label="数量" align="right" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="amount" min-width="90" label="金额" align="right" sortable show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.amount.toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column prop="producerName" min-width="180" label="生产企业" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="enrollName" min-width="180" label="卖方会员" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="approvalNumber" min-width="130" label="批准文号" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="tradeName" min-width="80" label="商品名" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="stockoutItemNo" min-width="135" label="出库单明细号" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="purchaseItemNo" min-width="135" label="采购单明细编号" sortable show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div class="table-footer">
        <div style="float: left;padding-right: 15px;padding-left: 63%">
          <span>总数量：</span>{{gatherNum}}
        </div>
        <div style="float: left">
          <span style="">总金额：</span>{{gatherAmount}} <span>元</span>
        </div>
      </div>
    </div>
    <TradeFooter :isBackShow="true" @order-back="orderBack"></TradeFooter>
  </div>
</template>

<script>
  /**
   * Created by wuqian on 2017/9/20.
   * <p>
   * 江苏摇铃网络科技有限公司，版权所有。
   * Copyright (C) 2015-2017 All Rights Reserved.
   */
  import { mapActions, mapGetters } from 'vuex';
  import TradeEditsForm from '../../../components/TradeEditsForm'; //  引订单目录表单
  import PurchasePlan from '../../../api/Order/PurchasePlan';
  import TradeFooter from '../../../components/TradeFooter'; // 引入订单底部
  import GpoStockoutList from '../../../api/Gpostockout/GpoStockoutList';
  import convert from '../../../utils/convert'; //  自定义转换js
  
  export default {
    activated() {
      this.dataList();
      this.$store.commit('BreadCrumb_Update', [
        {
          path: '/index',
          name: this.$store.state.view.resourcesNow.name,
        },
        {
          path: '/Gpostockout',
          name: 'GPO出库管理',
          noLink: true,
        },
        {
          path: '/Gpostockout/GpoStockoutList',
          name: '出库单列表',
          noLink: true,
        },
        {
          path: '/Gpostockout/GpoStockoutList/Edit',
          name: '出库单列表详情',
          noLink: true,
        },
      ]);
      this.tableHeightRun();
      window.onresize = () => {
        this.tableHeightRun();
      };
    },
    created() {
      this.tableHeightRun();
      window.onresize = () => {
        this.tableHeightRun();
      };
    },
    components: {
      TradeEditsForm,
      TradeFooter,
    },
    watch: {
      getGpoId() {
        this.$router.push({ path: '/Gpostockout/GpoStockoutList' });
      },
    },
    computed: mapGetters([
      'getGpoId',
    ]),
    data() {
      return {
        orderFile: null,
        tableHeight: 280,
        fromEdit: {},
        editMessage: {
          tabTitle: '',
          selects: [
            { label: 'GPO出库单号', key: 'stockoutCode', type: 'el-input', isReadonly: true, span: 5 },
            { label: '出库日期', key: 'stockoutDate', type: 'el-input', isReadonly: true, span: 5 },
            { label: '出库类型', key: 'stockoutType', type: 'el-input', isReadonly: true, span: 5 },
            { key: 'type', type: 'el-form-item', span: 9, md: 0, sm: 0, xs: 0 },
            { label: '配送企业', key: 'deliveryMemberName', type: 'el-input', isReadonly: true },
            { label: '联系人', key: 'deliveryPerson', type: 'el-input', isReadonly: true },
            { label: '备注', key: 'remarks', span: 5, type: 'el-input', isReadonly: true, fromType: 'textarea', rows: 1 },
            { value: 'orderFile', type: 'custom', span: 24, md: 20, sm: 24, isReadonly: true },
          ],
          styleObject: {},
          parameters: {},
          options: {},
          radios: {},
          rules: {},
        },
        tableData: [],
        tableCount: 0,
        tableNum: [],
        loading: false,
        gatherNum: 0,
        gatherAmount: 0,
      };
    },
    methods: {
       //  每次点击排序都会触发
      sortChange() {
        this.tableCount = 0;
      },
      //  进行排序时返回每一行
      sortTable(row, column) {
        if (this.tableCount < this.tableData.length) {
          const sortRow = window.tableCustom.tableSortNum(
            row,
            this.tableData,
            this.tableCount,
            this.tableNum,
          );
          this.tableData = sortRow.tableData;
          this.tableCount = sortRow.tableCount;
        }
        return row.num;
      },
      // 获取数据列表
      dataList() {
        this.loading = true;
        this.tableData = [];
        GpoStockoutList.itemInfo(this.$route.query.id).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.fromEdit = {
              deliveryMemberName: data.deliveryMemberName,
              deliveryPerson: `${data.deliveryPerson || ''} ${data.deliveryPhone || ''}`,
              remarks: data.remarks,
              stockoutCode: data.stockoutCode,
              stockoutDate: data.stockoutDate,
              stockoutType: data.stockoutType,
              id: data.id,
            };
            this.orderFile = data.orderFile;
            if (this.fromEdit.stockoutType === 1) {
              this.fromEdit.stockoutType = '销退';
            } else {
              this.fromEdit.stockoutType = '销售';
            }
            GpoStockoutList.item(this.$route.query.stockoutCode).then((res1) => {
              if (res.data.code === 0) {
                const data1 = res1.data.result.resultList;
                this.tableNum = [];
                this.tableCount = 0;
                for (let i = 0; i < data1.length; i += 1) {
                  data1[i].num = i + 1;
                  this.tableNum.push(data1[i].num);
                }
                this.tableData = data1;
                const dataSum = res1.data.result.resultSum;
                if (dataSum[0].gatherNum === null) {
                  this.gatherNum = 0;
                } else {
                  this.gatherNum = dataSum[0].gatherNum;
                }
                if (dataSum[0].gatherAmount === null) {
                  this.gatherAmount = 0;
                } else {
                  this.gatherAmount = dataSum[0].gatherAmount;
                }
              }
            });
          }
          this.loading = false;
        });
      },
      orderBack() { // 返回按钮触发事件
        history.back();
      },
      //  计算表格高度
      tableHeightRun() {
        const tableHeightFun = () => {
          this.tableHeight = window.tableCustom.tableHeight(['#from-item', '.TradeFooter', 200]);
        };
        setTimeout(tableHeightFun, 0);
      },
      //  json字符串转json，否则还是返回字符串
      toJSON(str) {
        return convert.toJSON(str);
      },
    },
  };
</script>
